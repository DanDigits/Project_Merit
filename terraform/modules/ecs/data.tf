data "aws_iam_policy_document" "assume_role_policy" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }
  }
}

data "aws_acm_certificate" "certificate" {
  domain      = var.domain_certificate
  key_types   = ["EC_secp384r1"]
  statuses    = ["ISSUED"]
  most_recent = true
}
