# BrewLite Architecture

## Overview

BrewLite is organized as a modular monolith with a clear separation between the web application, service API, and persistent data layer. The repository supports parallel frontend and backend development and is prepared for local Docker orchestration and AWS EC2 hosting.

## Layers

### Presentation Layer
- Next.js web application in `apps/web`
- Built with TypeScript and React
- Responsible for menu browsing and checkout screens

### Application Layer
- NestJS backend in `apps/api`
- Exposes domain services and API endpoints
- Maintains service health and business operations

### Data Layer
- PostgreSQL database
- Prisma-ready schema and migrations can be hosted under `apps/api/prisma`

### Deployment Layer
- Docker Compose for local development
- GitHub Actions for CI validation
- AWS EC2 deployment plan for production hosting

## Architectural Decision Records

The ADR files in `docs/architecture/adr/` describe the reasoning behind the repository structure and infrastructure choices.

## Operational Characteristics

- Services are organized around a single deployable unit with bounded modules.
- Local development is separated into frontend, API, and database services.
- Database connection details remain environment-driven and avoid hardcoded secrets.
