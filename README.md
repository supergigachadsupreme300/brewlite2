# BrewLite

BrewLite is a coffee ordering and in-store checkout application planned for a lightweight modular monolith architecture. This repository is organized to support parallel frontend and backend development, local Docker-based orchestration, and deployment preparation for AWS EC2.

## Technology Stack

- Frontend: Next.js + TypeScript
- Backend: NestJS + TypeScript
- Database: PostgreSQL
- ORM: Prisma-ready
- Containerization: Docker and Docker Compose
- CI: GitHub Actions
- Infrastructure target: AWS EC2 + ECR + EBS + Nginx + CloudWatch

## Repository Structure

```text
brewlite/
├── apps/
│   ├── web/
│   │   ├── src/
│   │   ├── public/
│   │   ├── package.json
│   │   └── Dockerfile
│   └── api/
│       ├── src/
│       ├── test/
│       ├── prisma/
│       ├── package.json
│       └── Dockerfile
├── docs/
│   ├── requirements/
│   ├── diagrams/
│   ├── architecture/
│   ├── traceability-matrix.md
│   └── deployment.md
├── tests/
│   ├── integration/
│   └── e2e/
├── .github/
│   └── workflows/
│       └── ci.yml
├── docker-compose.yml
├── .env.example
├── .gitignore
├── README.md
└── package.json
```

## Prerequisites

- Node.js 20+
- npm 10+
- Docker Desktop or Docker Engine
- Docker Compose v2
- PostgreSQL client (optional for manual checks)

## Install Dependencies

```bash
npm install
npm install --workspace @brewlite/web
npm install --workspace @brewlite/api
```

## Environment Configuration

Copy the sample environment file and adjust values as needed:

```bash
cp .env.example .env
```

Key values include:

- `NEXT_PUBLIC_API_URL`
- `API_PORT`
- `WEB_PORT`
- `DATABASE_URL`
- `POSTGRES_DB`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `JWT_SECRET`

Do not commit real secrets or private keys to the repository.

## Run Locally

### Frontend

```bash
npm run dev:web
```

### Backend

```bash
npm run dev:api
```

### Full local stack with Docker Compose

```bash
docker compose up --build
```

The stack includes:

- `web` on `http://localhost:3000`
- `api` on `http://localhost:3001`
- `db` on `localhost:5432`

## Database and Prisma

If Prisma is enabled in the backend, keep schema and migrations under `apps/api/prisma` and run:

```bash
cd apps/api
npx prisma migrate dev
npx prisma generate
```

## Health Check

The API exposes a health endpoint:

```bash
curl http://localhost:3001/health
```

## Lint, Test, and Build

```bash
npm run lint
npm run test
npm run build
```

## GitHub Actions CI

The repository includes a CI workflow at `.github/workflows/ci.yml` that runs in order:

1. Install
2. Lint
3. Unit test
4. Build

This workflow runs on push and pull request events with a standard Node.js 20 setup.

## AWS EC2 Deployment Preparation

This repository is set up for deployment preparation, not for direct production deployment. The accompanying deployment plan is documented in `docs/deployment.md` and includes the EC2 + ECR + EBS + Nginx + CloudWatch approach described in the assignment.

## Update and Rollback

- Update application versions via versioned Git commits and pull requests.
- Use a stable `main` branch and feature branches.
- Roll back by checking out the last known good commit or deploying a previous image tag from ECR.
- Keep database backups for PostgreSQL persistent volumes and apply restoration procedures before production cutover.

## Notes

This repository currently contains the required organizational structure and project skeleton. Any production application code, business logic, and detailed framework-specific implementations should be retained in their existing source locations and aligned with the structure above without changing original behavior.
