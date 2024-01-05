# VPC ------------------------------------------------------------------
resource "aws_default_vpc" "vpc" {
  #cidr_block           = "10.11.0.0/16"
  # enable_dns_hostnames = true
  # enable_dns_support   = true
  tags = {
    Name = "merit-vpc"
  }
}

resource "aws_default_subnet" "subnet" {
  #vpc_id            = aws_default_vpc.vpc.id
  count             = var.subnet_count
  availability_zone = data.aws_availability_zones.available.names[count.index]
  # cidr_block              = cidrsubnet(aws_default_vpc.vpc.cidr_block, 8, 12 + count.index)
  # map_public_ip_on_launch = true
  tags = {
    Name = "merit-${var.branch_prefix}-${data.aws_availability_zones.available.names[count.index]}"
  }
}

# Security Groups -------------------------------------------------------
resource "aws_security_group" "load_balancer" {
  name_prefix = "merit-${var.branch_prefix}-alb"
  # vpc_id      = aws_default_vpc.vpc.id

  dynamic "ingress" {
    for_each = [80, 443, 3000]
    content {
      from_port        = ingress.value
      to_port          = ingress.value
      protocol         = "tcp"
      cidr_blocks      = ["0.0.0.0/0"]
      ipv6_cidr_blocks = ["::/0"]
    }
  }

  egress {
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }
}

resource "aws_security_group" "ecs_service" {
  name_prefix = "merit-${var.branch_prefix}-service"
  #vpc_id      = aws_default_vpc.vpc.id

  ingress {
    from_port       = 0
    to_port         = 0
    protocol        = "-1"
    security_groups = [aws_security_group.load_balancer.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Load Balancer -------------------------------------------------------
resource "aws_alb" "application_load_balancer" {
  name               = "merit-${var.branch_prefix}"
  load_balancer_type = "application"
  subnets            = aws_default_subnet.subnet[*].id
  security_groups    = [aws_security_group.load_balancer.id]
}

resource "aws_lb_target_group" "target_group" {
  name_prefix = "merit-"
  port        = 80
  protocol    = "HTTP"
  target_type = "ip"
  vpc_id      = aws_default_vpc.vpc.id

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
  port              = 80
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

# IAM Roles -------------------------------------------------------
resource "aws_iam_role" "task_execution_role" {
  name_prefix        = "merit-${var.branch_prefix}-ecs-task-role"
  assume_role_policy = data.aws_iam_policy_document.assume_role_policy.json
}

resource "aws_iam_role_policy_attachment" "task_execution_role_policy" {
  role       = aws_iam_role.task_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_iam_role_policy_attachment" "task_cloudwatch_role_policy" {
  role       = aws_iam_role.task_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/CloudWatchLogsFullAccess"
}

# Cluster -------------------------------------------------------------
resource "aws_ecs_cluster" "cluster" {
  name = "merit-${var.branch_prefix}"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}

# Cloudwatch ----------------------------------------------------------
resource "aws_cloudwatch_log_group" "ecs_cloudwatch" {
  name              = "/ecs/merit-${var.branch_prefix}"
  retention_in_days = 14
}

# Task Definition ------------------------------------------------------
resource "aws_ecs_task_definition" "task_definition" {
  family                   = "merit-${var.branch_prefix}-task"
  execution_role_arn       = aws_iam_role.task_execution_role.arn
  network_mode             = "awsvpc"
  cpu                      = 256
  memory                   = 512
  requires_compatibilities = ["FARGATE"]
  runtime_platform {
    cpu_architecture        = "X86_64"
    operating_system_family = "LINUX"
  }

  container_definitions = jsonencode([{
    name      = "merit-${var.branch_prefix}",
    image     = "${var.repo_url}",
    essential = true,
    portMappings = [
      {
        name          = "3000-tcp",
        containerPort = var.container_port,
        hostPort      = var.container_port,
        protocol      = "tcp",
        appProtocol   = "http"
      }
    ],

    environment = [
      {
        name  = "DB_URI",
        value = "${var.db_uri}"
      },
      {
        name  = "NEXTAUTH_SECRET",
        value = "${var.nextauth_secret}"
      },
      {
        name  = "NEXTAUTH_URL",
        value = "${var.nextauth_url}"
      },
      {
        name  = "NEXTAUTH_PORT",
        value = "${var.nextauth_port}"
      },
      {
        name  = "NEXT_PUBLIC_NEXTAUTH_URL",
        value = "${var.nextauth_public_url}"
      },
      {
        name  = "EMAIL_SERVER_USER",
        value = "${var.email_server_user}"
      },
      {
        name  = "EMAIL_SERVER_PASSWORD",
        value = "${var.email_server_password}"
      }
      # {
      #   name  = "EMAIL_SERVER_SERVICE",
      #   value = "${var.email_server_service}"
      # },
      # {
      #   name  = "EMAIL_SERVER_HOST",
      #   value = "${var.email_server_host}"
      # },
      # {
      #   name  = "EMAIL_SERVER_PORT",
      #   value = "${var.email_server_port}"
      # },
      # {
      #   name  = "EMAIL_FROM",
      #   value = "${var.email_from}"
      # },
      # {
      #   name  = "EMAIL_SUBJECT",
      #   value = "${var.email_subject}"
      # }
    ],

    logConfiguration = {
      logDriver = "awslogs",
      options = {
        "awslogs-region"        = "us-east-1",
        "awslogs-group"         = aws_cloudwatch_log_group.ecs_cloudwatch.name,
        "awslogs-stream-prefix" = "merit-${var.branch_prefix}"
      }
    },
  }])
}

# Service -----------------------------------------------------------
resource "aws_ecs_service" "service" {
  name                              = "merit-${var.branch_prefix}"
  cluster                           = aws_ecs_cluster.cluster.id
  task_definition                   = aws_ecs_task_definition.task_definition.arn
  launch_type                       = "FARGATE"
  desired_count                     = 1
  health_check_grace_period_seconds = 10

  load_balancer {
    target_group_arn = aws_lb_target_group.target_group.arn
    container_name   = "merit-${var.branch_prefix}"
    container_port   = var.container_port
  }

  network_configuration {
    subnets          = aws_default_subnet.subnet[*].id
    assign_public_ip = true
    security_groups  = [aws_security_group.ecs_service.id]
  }
}