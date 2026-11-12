# Repository Setup and Workflow

## Structure

- `apps/web` - Next.js mobile-first frontend
- `apps/api` - NestJS backend
- `docs` - requirements, diagrams, architecture and traceability
- `tests` - integration and end-to-end tests

## Branch strategy

- `main` - stable branch
- `develop` - integration branch
- `feature/<name>` - feature branches

## Commit convention

- `feat:` new feature
- `fix:` bug fix
- `docs:` documentation
- `test:` tests
- `chore:` maintenance

## Pull request rules

- CI must pass: install, lint, unit test, build
- At least one review before merge
- No secrets in commits

## Definition of Done

- Code compiles and tests pass
- Documentation updated
- Health check works
- No lint errors