variable "cluster_name" {
  description = "ECS Cluster Name"
  type        = string
}

variable "availability_zones" {
  description = "us-east-1 AZs"
  type        = list(string)
}

variable "task_family" {
  description = "ECS Task Family"
  type        = string
}

variable "repo_url" {
  description = "ECR Repo URL"
  type        = string
}

variable "container_port" {
  description = "Container Port"
  type        = number
}

variable "container_name" {
  description = "ECS Container Name"
  type        = string
}

variable "task_execution_role_name" {
  description = "ECS Task Execution Role Name"
  type        = string
}

variable "application_load_balancer_name" {
  description = "ALB Name"
  type        = string
}

variable "target_group" {
  description = "ALB Target Group Name"
  type        = string
}

variable "service_name" {
  description = "ECS Service Name"
  type        = string
}

# Environment variables ---------------------------------------------
variable "domain_certificate" {
  description = "HTTPS Domain Certificate"
  type        = string
}

variable "db_uri" {
  description = "Database Connection String"
  type        = string
}

variable "nextauth_secret" {
  description = "Nextauth Secret"
  type        = string
}

variable "nextauth_port" {
  description = "Nextauth Public Facing Port"
  type        = string
}

variable "nextauth_url" {
  description = "Nextauth URL Address"
  type        = string
}

variable "nextauth_public_url" {
  description = "Nextauth URL Address"
  type        = string
}

variable "email_server_service" {
  description = "Email Service Provider"
  type        = string
}

variable "email_server_user" {
  description = "Email Service User"
  type        = string
}

variable "email_server_password" {
  description = "Email Service Password"
  type        = string
}

variable "email_server_host" {
  description = "Email Service Provider Address"
  type        = string
}

variable "email_server_port" {
  description = "Email Service Provider Port"
  type        = string
}

variable "email_from" {
  description = "Email Sender"
  type        = string
}

variable "email_subject" {
  description = "Email Header"
  type        = string
}