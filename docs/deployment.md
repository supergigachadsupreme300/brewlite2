# BrewLite Deployment Plan

## Objective

This document describes the AWS EC2 deployment preparation approach for BrewLite. It is intentionally implementation-oriented but does not create or commit live AWS credentials or private keys.

## Target Architecture

- Amazon EC2 Linux instance as the application host
- SSH key pair for secure administrative access
- Docker and Docker Compose to run the application stack
- Amazon ECR to store the application container images
- Amazon EBS for PostgreSQL data persistence
- Nginx as reverse proxy
- CloudWatch Agent / CloudWatch Logs for log collection when enabled

## 1. Create the EC2 Instance

1. Open the AWS Console and navigate to EC2.
2. Choose an Amazon Linux 2023 or Ubuntu LTS AMI.
3. Select an instance type suitable for a small production deployment, such as `t3.small` or similar.
4. Configure a VPC, subnet, and public IP assignment if the environment requires internet access.
5. Create the instance and wait for it to be in the `running` state.

## 2. Create or Select an SSH Key Pair

1. In EC2, navigate to `Network & Security > Key Pairs`.
2. Create a new key pair or reuse an existing one.
3. Download the `.pem` file to the local workstation.
4. Restrict local permissions:

```bash
chmod 400 my-brewlite-key.pem
```

5. Store the private key only in a secure local location; do not commit it to Git.

## 3. Configure Security Groups

Add or update the EC2 security group to allow:

- `22/tcp` from the administrator IP only
- `80/tcp` from `0.0.0.0/0` or a controlled source range
- `443/tcp` from `0.0.0.0/0` or a controlled source range

This reduces exposure while enabling HTTP/HTTPS entry and SSH administration.

## 4. Connect to the EC2 Host

```bash
ssh -i my-brewlite-key.pem ec2-user@<EC2_PUBLIC_IP>
```

If using Ubuntu, the default user may be `ubuntu` instead of `ec2-user`.

## 5. Install Docker and Docker Compose

```bash
sudo yum update -y
sudo yum install -y docker
sudo systemctl enable docker
sudo systemctl start docker
sudo usermod -aG docker ec2-user
```

For Compose v2:

```bash
sudo curl -SL https://github.com/docker/compose/releases/latest/download/docker-compose-linux-x86_64 -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

Then verify:

```bash
docker --version
docker compose version
```

## 6. Authenticate to Amazon ECR

```bash
aws ecr get-login-password --region <region> | docker login --username AWS --password-stdin <aws-account-id>.dkr.ecr.<region>.amazonaws.com
```

Then pull the built image:

```bash
docker pull <aws-account-id>.dkr.ecr.<region>.amazonaws.com/brewlite:latest
```

## 7. Start the Application with Docker Compose

On the instance, place the application config and compose file in the service directory.

```bash
docker compose up -d
```

This is expected to run:

- `web` for the Next.js application
- `api` for the NestJS backend
- `db` for PostgreSQL

## 8. Check Service Health

```bash
curl http://localhost:3001/health
curl http://localhost:3000
```

The backend health endpoint should respond with a successful status payload.

## 9. Backup and Recovery

- Use EBS snapshots or database backups for PostgreSQL persistence.
- Store the dockerized application config under version control.
- Keep environment variables in a secure secret manager or protected `.env` file outside the repository.
- Document a rollback plan by reusing the previous ECR image tag or container configuration.

## 10. Rollback Procedure

1. Stop the current containers:

```bash
docker compose down
```

2. Pull the previous known-good image from ECR.
3. Redeploy the previous container version.
4. Verify health on the backend and frontend.
5. Restore PostgreSQL data from the latest consistent backup if needed.

## Security Notes

- Never commit `.pem` keys, access tokens, `.env` files, or database passwords.
- Use AWS IAM roles or temporary credentials when possible.
- Keep SSH access restricted to trusted source IPs.
- Encrypt EBS volumes where appropriate.

## Status

The repository is prepared for deployment planning and AWS readiness documentation. No live AWS resources are created as part of this task.
