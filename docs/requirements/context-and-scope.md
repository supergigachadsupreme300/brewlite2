# Context and Scope

## Project Context

BrewLite is a coffee-ordering and checkout application intended to support a lightweight, local-first service flow for ordering drinks and completing a checkout transaction. The system is planned to run as a modular monolith with a clear separation between customer-facing interfaces and a backend service layer.

## Stakeholders

- Customer: browses the menu and places an order.
- Barista / staff: prepares and fulfills the order.
- Operations: monitors the service and deployment readiness.
- Engineering: maintains the application and local DevOps workflows.

## In Scope

- Menu browsing and product selection
- Place order flow
- Payment processing flow
- Local development using Docker Compose
- CI validation with GitHub Actions
- Deployment preparation for AWS EC2

## Out of Scope

- Real payment gateway integration beyond a placeholder flow
- Large-scale analytics or multi-region deployment
- Full microservices decomposition at this stage
- Advanced inventory forecasting and enterprise operations features

## Assumptions

- The application can be developed in a familiar full-stack JavaScript/TypeScript environment.
- PostgreSQL is used as the persistent datastore.
- The repository will support a clean workflow for frontend and backend development in parallel.

## Constraints

- Repository must remain organized around the assignment requirements.
- Existing source code and documentation must not be deleted or replaced without good reason.
- No live AWS credentials or secrets should be committed.
