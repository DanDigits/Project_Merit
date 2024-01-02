# VPC ------------------------------------------------------------------------------------------------------------
resource "aws_vpc" "vpc" {
  cidr_block           = "10.11.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true
  tags = {
    Name = "merit-vpc"
  }
}

resource "aws_subnet" "public_subnet" {
  vpc_id                  = aws_vpc.vpc.id
  count                   = var.subnet_count
  availability_zone       = data.aws_availability_zones.available.names[count.index]
  cidr_block              = cidrsubnet(aws_vpc.vpc.cidr_block, 8, 12 + count.index)
  map_public_ip_on_launch = true
  tags = {
    Name = "merit-public-${data.aws_availability_zones.available.names[count.index]}"
  }
}

# Gateway ----------------------------------
resource "aws_internet_gateway" "gateway" {
  vpc_id = aws_vpc.vpc.id
  tags = {
    Name = "merit-gateway"
  }
}

resource "aws_eip" "elastic_ip" {
  depends_on = [aws_internet_gateway.gateway]
  count      = var.subnet_count
  tags = {
    Name = "merit-eip-${data.aws_availability_zones.available.names[count.index]}"
  }
}

# Route Table --------------------------------
resource "aws_route_table" "public_route_table" {
  vpc_id = aws_vpc.vpc.id
  # tags = {
  #   Name = "merit-public-rt"
  # }

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.gateway.id
  }
}

resource "aws_route_table_association" "public_route_table_assoc" {
  route_table_id = aws_route_table.public_route_table.id
  count          = var.subnet_count
  subnet_id      = aws_subnet.public_subnet[count.index].id
}

# Security Group -----------------------------
resource "aws_security_group" "ecs_ecr_sg" {
  name_prefix = "merit-${var.branch_prefix}-ecr"
  vpc_id      = aws_vpc.vpc.id

  egress {
    from_port   = 0
    to_port     = 65535
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "ecs_task" {
  name_prefix = "merit-${var.branch_prefix}-ecs-task"
  vpc_id      = aws_vpc.vpc.id
  description = "Allow all traffic within the VPC"

  ingress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = [aws_vpc.vpc.cidr_block]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "http" {
  name_prefix = "merit-${var.branch_prefix}-http"
  description = "Allow all HTTP/HTTPS traffic from public"
  vpc_id      = aws_vpc.vpc.id

  dynamic "ingress" {
    for_each = [80, 443]
    content {
      protocol    = "tcp"
      from_port   = ingress.value
      to_port     = ingress.value
      cidr_blocks = ["0.0.0.0/0"]
    }
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# ECS Cluster ------------------------------------------------------------------------------------------------
resource "aws_ecs_cluster" "cluster" {
  name = "merit-${var.branch_prefix}"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}

# IAM -------------------------------------------------------------------------------------
# EC2 Role -------------------------------------
resource "aws_iam_role" "ec2_instance_role" {
  name_prefix        = "merit-${var.branch_prefix}-ec2-role"
  assume_role_policy = data.aws_iam_policy_document.ec2_doc.json
}

resource "aws_iam_role_policy_attachment" "ec2_instance_role_policy" {
  role       = aws_iam_role.ec2_instance_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonEC2ContainerServiceforEC2Role"
}

resource "aws_iam_instance_profile" "ec2_instance_profile" {
  name_prefix = "merit-${var.branch_prefix}-ec2-instance-profile"
  path        = "/ecs/merit/instance/"
  role        = aws_iam_role.ec2_instance_role.name
}

# ECS Role -------------------------------------
resource "aws_iam_role" "ecs_task_role" {
  name_prefix        = "merit-${var.branch_prefix}-ecs-task-role"
  assume_role_policy = data.aws_iam_policy_document.ecs_doc.json
}

resource "aws_iam_role" "ecs_exec_role" {
  name_prefix        = "merit-${var.branch_prefix}-ecs-exec-role"
  assume_role_policy = data.aws_iam_policy_document.ecs_doc.json
}

resource "aws_iam_role_policy_attachment" "ecs_exec_role_policy" {
  role       = aws_iam_role.ecs_exec_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# Launch Template ----------------------------------
resource "aws_launch_template" "ecs_ec2" {
  name_prefix            = "merit-${var.branch_prefix}-launch-template"
  image_id               = data.aws_ssm_parameter.ecs_ec2_ami.value
  instance_type          = "t2.micro"
  vpc_security_group_ids = [aws_security_group.ecs_ecr_sg.id]

  iam_instance_profile {
    arn = aws_iam_instance_profile.ec2_instance_profile.arn
  }

  monitoring {
    enabled = true
  }

  // Register EC2 instance to ECS cluster
  user_data = base64encode(
    <<EOF
      #!/bin/bash
      echo "ECS_CLUSTER=${aws_ecs_cluster.cluster.name}" >> /etc/ecs/ecs.config
    EOF
  )
}

# Autoscaling Group -----------------------------------
resource "aws_autoscaling_group" "autoscaling_group" {
  name_prefix               = "merit-${var.branch_prefix}-autoscaling"
  vpc_zone_identifier       = aws_subnet.public_subnet[*].id
  min_size                  = 1
  max_size                  = 6
  health_check_grace_period = 0
  health_check_type         = "EC2"
  protect_from_scale_in     = false

  launch_template {
    id      = aws_launch_template.ecs_ec2.id
    version = "$Latest"
  }

  tag {
    key                 = "Name"
    value               = "Merit-ECS-Cluster"
    propagate_at_launch = true
  }

  tag {
    key                 = "AmazonECSManaged"
    value               = ""
    propagate_at_launch = true
  }
}

# ECS Capacity Provider ---------------------------------
resource "aws_ecs_capacity_provider" "capacity_provider" {
  name = "merit_capacity_provider"

  auto_scaling_group_provider {
    auto_scaling_group_arn         = aws_autoscaling_group.autoscaling_group.arn
    managed_termination_protection = "DISABLED"

    managed_scaling {
      status                    = "ENABLED"
      maximum_scaling_step_size = 2
      minimum_scaling_step_size = 1
      target_capacity           = 100
    }
  }
}

resource "aws_ecs_cluster_capacity_providers" "cluster_capacity_provider" {
  cluster_name       = aws_ecs_cluster.cluster.name
  capacity_providers = [aws_ecs_capacity_provider.capacity_provider.name]

  default_capacity_provider_strategy {
    capacity_provider = aws_ecs_capacity_provider.capacity_provider.name
    base              = 1
    weight            = 100
  }
}

# Cloudwatch ---------------------------------------
resource "aws_cloudwatch_log_group" "ecs_cloudwatch" {
  name              = "/ecs/merit-${var.branch_prefix}"
  retention_in_days = 14
}

# ECS Task Definition ------------------------------------------------------------------------------------------
resource "aws_ecs_task_definition" "ecs_task_definition" {
  family             = "merit-${var.branch_prefix}-task"
  task_role_arn      = aws_iam_role.ecs_task_role.arn
  execution_role_arn = aws_iam_role.ecs_exec_role.arn
  network_mode       = "awsvpc"
  cpu                = 256
  memory             = 256

  container_definitions = jsonencode([{
    name  = "merit-${var.branch_prefix}",
    image     = "${var.repo_url}",
    essential = true,
    portMappings = [
      {
        name          = "portmapping",
        containerPort = var.container_port,
        hostPort      = var.container_port,
        protocol      = "tcp",
        appProtocol   = "http"
      }
    ],

    environment = [
      # {
      #   name  = "DB_URI",
      #   value = "${var.db_uri}"
      # },
      # {
      #   name  = "NEXTAUTH_SECRET",
      #   value = "${var.nextauth_secret}"
      # },
      # {
      #   name  = "NEXTAUTH_URL",
      #   value = "${var.nextauth_url}"
      # },
      # {
      #   name  = "NEXTAUTH_PORT",
      #   value = "${var.nextauth_port}"
      # },
      # {
      #   name  = "NEXT_PUBLIC_NEXTAUTH_URL",
      #   value = "${var.nextauth_public_url}"
      # },
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

# ECS Service Definition ----------------------------------------------------------------------------------------
resource "aws_ecs_service" "ecs_service" {
  name            = "merit-${var.branch_prefix}"
  cluster         = aws_ecs_cluster.cluster.id
  task_definition = aws_ecs_task_definition.ecs_task_definition.arn
  desired_count   = 1
  depends_on      = [aws_lb_target_group.target_group]

  network_configuration {
    security_groups = [aws_security_group.ecs_task.id]
    subnets         = aws_subnet.public_subnet[*].id
  }

  capacity_provider_strategy {
    capacity_provider = aws_ecs_capacity_provider.capacity_provider.name
    base              = 1
    weight            = 100
  }

  ordered_placement_strategy {
    type  = "spread"
    field = "attribute:ecs.availability-zone"
  }

  lifecycle {
    ignore_changes = [desired_count]
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.target_group.arn
    container_name   = "merit-${var.branch_prefix}"
    container_port   = var.container_port
  }
}

# Application Load Balancer ---------------------------------
resource "aws_lb" "load_balancer" {
  name               = "merit-${var.branch_prefix}"
  load_balancer_type = "application"
  subnets            = aws_subnet.public_subnet[*].id
  security_groups    = [aws_security_group.http.id]
}

resource "aws_lb_target_group" "target_group" {
  name_prefix = "merit-"
  port        = 80
  protocol    = "HTTP"
  target_type = "ip"
  vpc_id      = aws_vpc.vpc.id

  health_check {
    enabled  = true
    protocol = "HTTP"
    path     = "/Auth/Login"
    #port                = 80
    timeout             = 15
    unhealthy_threshold = 2
    healthy_threshold   = 5
    interval            = 30
    matcher             = 200
  }
}

resource "aws_lb_listener" "load_balancer_listener_HTTP" {
  load_balancer_arn = aws_lb.load_balancer.arn
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
  load_balancer_arn = aws_lb.load_balancer.arn
  port              = "443"
  protocol          = "HTTPS"
  certificate_arn   = data.aws_acm_certificate.certificate.arn

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.target_group.arn
  }
}

output "alb_url" {
  value = aws_lb.load_balancer.dns_name
}
