# Traceability Matrix

This repository is organized to match the assignment requirements, while preserving the project's existing documentation and source assets. The matrix below links requirements to architecture, design artifacts, implementation entry points, and verification coverage.

## Requirement Mapping

| Requirement ID | User Story / Use Case | Design / Diagram | Code / API | Test Coverage |
| --- | --- | --- | --- | --- |
| FR-01 | Customer places order | `docs/requirements/use-case-place-and-pay.md`, `docs/diagrams/sequence-checkout.puml` | `apps/api/src` endpoints and modules | Integration and E2E tests |
| FR-02 | Customer pays for order | `docs/requirements/use-case-place-and-pay.md` | `apps/api/src` payment flow | Integration and E2E tests |
| FR-03 | Order status visibility | `docs/architecture/architecture.md` | API response models and frontend data flow | Integration tests |
| NFR-01 | System availability | `docs/architecture/architecture.md` | Docker Compose and EC2 deployment plan | Health check and smoke checks |
| NFR-02 | Performance | `docs/architecture/architecture.md` | service boundaries and API design | Load and smoke test plan |
| NFR-03 | Security | `docs/architecture/adr/003-ssh-key-pair.md` | env management, SSH, secrets handling | CI and deployment validation |

## Notes

- This repository deliberately keeps the required structure and artifact placeholders aligned to the assignment.
- Source code should be added under `apps/web` and `apps/api` without altering business behavior.
- Generated plant UML sources remain under `docs/diagrams` and are not replaced with screenshots.
