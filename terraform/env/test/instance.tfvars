bucket_name = "terraformstate-bucket089217340198"
table_name  = "state_locks"
# ecr_repo_name = "meritDev"
availability_zones = ["us-east-1a", "us-east-1b", "us-east-1c", "us-east-1d", "us-east-1e", "us-east-1f"]
# cluster_name             = "meritDevCluster"
task_family              = "meritDevTask"
container_port           = 3000
container_name           = "meritDev"
task_execution_role_name = "meritDevTaskExecutionRole"
# db_uri              = "mongodb+srv://admin:7BJ6vvekZP3XkXcQ@development.mh52mvl.mongodb.net/?retryWrites=true&w=majority"
nextauth_port                  = 443
nextauth_url                   = "https://test.testing.systems"
nextauth_public_url            = "https://test.testing.systems"
application_load_balancer_name = "meritDevALB"
target_group                   = "meritDevTG"
# service_name                   = "meritDevService"