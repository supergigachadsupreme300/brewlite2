# Software Requirements Specification (SRS)

## Functional Requirements

### FR-01: Place Order
The system shall allow a customer to view the available menu and place an order.

### FR-02: Payment
The system shall support a payment flow for the selected order.

### FR-03: Order Confirmation
The system shall confirm the completed order to the customer.

### FR-04: Health Monitoring
The system shall expose a health endpoint for service monitoring.

## Non-Functional Requirements

### NFR-01: Availability
The application shall be deployable in a local development environment and a production-ready EC2 host.

### NFR-02: Maintainability
The repository shall support parallel frontend and backend development with clear boundaries.

### NFR-03: Security
The repository shall not commit secrets, private keys, or production credentials.

## MoSCoW Prioritization

### Must Have
- Menu browsing and checkout flow
- Payment confirmation flow
- Health endpoint
- Local containerized deployment
- CI workflow

### Should Have
- Clear architecture documentation
- Traceability matrix
- Deployment readiness notes

### Could Have
- Additional automation and environment checks
- Extended monitoring configuration

### Won't Have
- Full microservice decomposition in this assignment
- Real production AWS deployment as part of this task

## Acceptance Criteria

- Repository structure aligns with the assignment target layout.
- Frontend and backend can run in parallel in local development.
- Docker Compose starts the web, API, and database services.
- CI pipeline validates install, lint, unit test, and build.
- Documentation includes requirements, architecture, and deployment guidance.
