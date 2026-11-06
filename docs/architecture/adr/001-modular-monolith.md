# ADR 001: Use a modular monolith

## Status
Accepted

## Context
The project needs a clear structure for fast delivery while supporting maintainability and local deployment. A full microservice architecture would add unnecessary complexity for the assignment scope.

## Decision
Use a modular monolith architecture: a single backend service with separated modules and clear boundaries, plus a dedicated frontend application.

## Consequences
- Easier local development and debugging
- Simpler deployment on a single EC2 instance
- Clear separation of service and presentation responsibilities
- Future extension to microservices is still possible if the domain grows
