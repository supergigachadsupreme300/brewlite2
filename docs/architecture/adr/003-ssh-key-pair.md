# ADR 003: Use SSH key pair for EC2 administration

## Status
Accepted

## Context
Remote administration of the EC2 instance must remain secure and not rely on shared credentials or plaintext secrets.

## Decision
Use an SSH key pair for EC2 access and keep private keys outside the repository.

## Consequences
- Stronger security than password-based access
- Better compliance with secure administration practices
- Requires careful handling of the private `.pem` file on developer machines
