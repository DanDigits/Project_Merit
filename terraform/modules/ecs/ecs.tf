resource "aws_ecs_cluster" "cluster" {
  name = var.cluster_name

  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}

# Task Definition ----------------------------------------
resource "aws_ecs_task_definition" "task_definition" {
  family                   = var.task_family
  container_definitions    = <<DEFINITION
  [
    {
      "name": "${var.container_name}",
      "image": "${var.repo_url}",
      "cpu": 0,
      "essential": true,
      "portMappings": [
        {
          "name": "3000-tcp",
          "containerPort": ${var.container_port},
          "hostPort": ${var.container_port},
          "protocol": "tcp",
          "appProtocol": "http"
        }
      ],
      "environment": [
        {
          "name": "DB_URI",
          "value": "${var.db_uri}"
        },
        {
          "name": "NEXTAUTH_URL",
          "value": "${var.nextauth_url}"
        },
        {
          "name": "NEXTAUTH_PORT",
          "value": "${var.nextauth_port}"
        },
        {
          "name": "NEXT_PUBLIC_NEXTAUTH_URL",
          "value": "${var.nextauth_public_url}"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
            "awslogs-create-group": "true",
            "awslogs-group": "/ecs/${var.container_name}",
            "awslogs-region": "us-east-1",
            "awslogs-stream-prefix": "ecs"
        },
        "secretOptions": []
      }
    }
  ]
  DEFINITION
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  memory                   = 2048
  cpu                      = 1024
  execution_role_arn       = aws_iam_role.task_execution_role.arn

  runtime_platform {
    cpu_architecture        = "X86_64"
    operating_system_family = "LINUX"
  }
}

# IAM Role -------------------------------------------------------
resource "aws_iam_role" "task_execution_role" {
  name               = var.task_execution_role_name
  assume_role_policy = data.aws_iam_policy_document.assume_role_policy.json
}

resource "aws_iam_role_policy_attachment" "task_execution_role_policy" {
  role       = aws_iam_role.task_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# Security Group -------------------------------------------------
# Load Balancer
resource "aws_security_group" "load_balancer_security_group" {
  ingress {
    from_port        = 80
    to_port          = 80
    protocol         = "tcp"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  ingress {
    from_port        = 443
    to_port          = 443
    protocol         = "tcp"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  ingress {
    from_port        = 3000
    to_port          = 3000
    protocol         = "tcp"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  egress {
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }
}

# Service
resource "aws_security_group" "service_security_group" {
  ingress {
    from_port       = 0
    to_port         = 0
    protocol        = "-1"
    security_groups = ["${aws_security_group.load_balancer_security_group.id}"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Application Load Balancer --------------------------------------
resource "aws_default_vpc" "default_vpc" {}

resource "aws_default_subnet" "default_subnet_a" {
  availability_zone = var.availability_zones[0]
}
resource "aws_default_subnet" "default_subnet_b" {
  availability_zone = var.availability_zones[1]
}
resource "aws_default_subnet" "default_subnet_c" {
  availability_zone = var.availability_zones[2]
}
resource "aws_default_subnet" "default_subnet_d" {
  availability_zone = var.availability_zones[3]
}
resource "aws_default_subnet" "default_subnet_e" {
  availability_zone = var.availability_zones[4]
}
resource "aws_default_subnet" "default_subnet_f" {
  availability_zone = var.availability_zones[5]
}

resource "aws_alb" "application_load_balancer" {
  name               = var.application_load_balancer_name
  load_balancer_type = "application"
  subnets = [
    "${aws_default_subnet.default_subnet_a.id}",
    "${aws_default_subnet.default_subnet_b.id}",
    "${aws_default_subnet.default_subnet_c.id}",
    "${aws_default_subnet.default_subnet_d.id}",
    "${aws_default_subnet.default_subnet_e.id}",
    "${aws_default_subnet.default_subnet_f.id}"
  ]
  security_groups = ["${aws_security_group.load_balancer_security_group.id}"]
}

resource "aws_lb_target_group" "target_group" {
  name        = var.target_group
  port        = 80
  protocol    = "HTTP"
  target_type = "ip"
  vpc_id      = aws_default_vpc.default_vpc.id

  health_check {
    enabled             = true
    protocol            = "HTTP"
    path                = "/Auth/Login"
    timeout             = 15
    unhealthy_threshold = 2
    healthy_threshold   = 5
    interval            = 30
    matcher             = "200"
  }
}

resource "aws_lb_listener" "load_balancer_listener_HTTP" {
  load_balancer_arn = aws_alb.application_load_balancer.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type = "redirect"
    redirect {
      port        = "443"
      protocol    = "HTTPS"
      status_code = "HTTP_301"
      #path = "/#{host}:443/#{path}?#{query}", https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lb_listener
    }
  }
}

resource "aws_lb_listener" "load_balancer_listener_HTTPS" {
  load_balancer_arn = aws_alb.application_load_balancer.arn
  port              = "443"
  protocol          = "HTTPS"
  certificate_arn   = data.aws_acm_certificate.certificate.arn

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.target_group.arn
  }
}

# Service -----------------------------------------------------------

resource "aws_ecs_service" "service" {
  name                              = var.service_name
  cluster                           = aws_ecs_cluster.cluster.id
  task_definition                   = aws_ecs_task_definition.task_definition.arn
  launch_type                       = "FARGATE"
  desired_count                     = 1
  health_check_grace_period_seconds = 10

  load_balancer {
    target_group_arn = aws_lb_target_group.target_group.arn
    container_name   = var.container_name
    container_port   = var.container_port
  }

  network_configuration {
    subnets = [
      "${aws_default_subnet.default_subnet_a.id}",
      "${aws_default_subnet.default_subnet_b.id}",
      "${aws_default_subnet.default_subnet_c.id}",
      "${aws_default_subnet.default_subnet_d.id}",
      "${aws_default_subnet.default_subnet_e.id}",
      "${aws_default_subnet.default_subnet_f.id}"
    ]
    assign_public_ip = true
    security_groups  = ["${aws_security_group.service_security_group.id}"]
  }
}