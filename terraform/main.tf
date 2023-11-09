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
  ecr_repo_name = var.ecr_repo_name
}

module "ecs" {
  source   = "./modules/ecs"
  repo_url = module.ecr.repository_url

  availability_zones = var.availability_zones
  cluster_name       = var.cluster_name

  task_family              = var.task_family
  container_port           = var.container_port
  container_name           = var.container_name
  task_execution_role_name = var.task_execution_role_name

  db_uri              = var.db_uri
  nextauth_port       = var.nextauth_port
  nextauth_url        = var.nextauth_url
  nextauth_public_url = var.nextauth_public_url

  application_load_balancer_name = var.application_load_balancer_name
  target_group                   = var.target_group
  service_name                   = var.service_name
  domain_certificate             = var.domain_certificate
}