terraform {
  required_version = "~> 1.5.0"

  backend "s3" {
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

module "ecr" {
  source        = "./modules/ecr"
  ecr_repo_name = "merit-${var.branch_prefix}"
}

// Fargate ECS Deployment
module "ecs" {
  source         = "./modules/ecs"
  repo_url       = module.ecr.repository_url
  branch_prefix  = var.branch_prefix
  subnet_count   = var.subnet_count
  container_port = var.container_port

  db_uri                = var.db_uri
  nextauth_secret       = var.nextauth_secret
  nextauth_port         = var.nextauth_port
  nextauth_url          = var.nextauth_url
  nextauth_public_url   = var.nextauth_public_url
  domain_certificate    = var.domain_certificate
  email_server_service  = var.email_server_service
  email_server_user     = var.email_server_user
  email_server_password = var.email_server_password
  email_server_host     = var.email_server_host
  email_server_port     = var.email_server_port
  email_from            = var.email_from
  email_subject         = var.email_subject
}

// EC2 ECS Deployment
# module "ec2" {
#   source         = "./modules/ec2"
#   repo_url       = module.ecr.repository_url
#   branch_prefix  = var.branch_prefix
#   subnet_count   = var.subnet_count
#   container_port = var.container_port

#   db_uri                = var.db_uri
#   nextauth_secret       = var.nextauth_secret
#   nextauth_port         = var.nextauth_port
#   nextauth_url          = var.nextauth_url
#   nextauth_public_url   = var.nextauth_public_url
#   domain_certificate    = var.domain_certificate
#   email_server_service  = var.email_server_service
#   email_server_user     = var.email_server_user
#   email_server_password = var.email_server_password
#   email_server_host     = var.email_server_host
#   email_server_port     = var.email_server_port
#   email_from            = var.email_from
#   email_subject         = var.email_subject
# }