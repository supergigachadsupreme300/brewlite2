# ADR 002: Use AWS EC2 for deployment

## Status
Accepted

## Context
The assignment requires deployment preparation for AWS while keeping the solution straightforward and easy to manage for a small-scale application.

## Decision
Deploy BrewLite on Amazon EC2 Linux using Docker Compose, ECR for images, EBS for persistence, and Nginx as the reverse proxy.

## Consequences
- Lower operational overhead than a larger container orchestration stack
- Suitable for a small to medium application workload
- Clear path for secure administration through SSH and IAM best practices
- Straightforward rollback and image replacement workflow
