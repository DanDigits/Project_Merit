data "aws_availability_zones" "available" {
  state = "available"
}

data "aws_iam_policy_document" "ec2_doc" {
  statement {
    actions = ["sts:AssumeRole"]
    effect  = "Allow"

    principals {
      type        = "Service"
      identifiers = ["ec2.amazonaws.com"]
    }
  }
}

data "aws_iam_policy_document" "ecs_doc" {
  statement {
    actions = ["sts:AssumeRole"]
    effect  = "Allow"

    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }
  }
}

data "aws_ssm_parameter" "ecs_ec2_ami" {
  name = "/aws/service/ecs/optimized-ami/amazon-linux-2/recommended/image_id"
}

data "aws_acm_certificate" "certificate" {
  domain      = var.domain_certificate
  key_types   = ["EC_secp384r1"]
  statuses    = ["ISSUED"]
  most_recent = true
}
