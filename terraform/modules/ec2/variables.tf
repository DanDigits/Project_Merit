variable "subnet_count" {
  description = "EC2 Subnet Count"
  default     = 1
  type        = number
}

variable "repo_url" {
  description = "ECR Repo URL"
  type        = string
}

variable "container_port" {
  description = "Container Port"
  type        = number
}

# # Environment variables ---------------------------------------------
variable "branch_prefix" {
  description = "The git branch prefix to append to respective names"
  type        = string
}

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

variable "email_server_user" {
  description = "Email Service User"
  type        = string
}

variable "email_server_password" {
  description = "Email Service Password"
  type        = string
}

variable "email_server_service" {
  description = "Email Service Provider"
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