<!--
Sync Impact Report:
Version change: 1.0.0 -> 2.0.0
Bump rationale: MAJOR — backward-incompatible governance redefinition;
  Phase III principles replaced with Phase IV cloud-native deployment rules;
  new mandatory infrastructure and AI Ops policies added.

List of modified principles:
- I. Security & Isolation -> I. Security & Isolation (preserved, expanded for K8s)
- II. Accuracy & State Integrity -> II. Accuracy & State Integrity (preserved)
- III. Reliability & Error Handling -> III. Reliability & Operational Readiness (expanded)
- IV. Usability & Responsiveness -> IV. Usability & Responsiveness (preserved)
- V. Reproducibility & Documentation -> V. Reproducibility & Infrastructure as Code (redefined)

Added sections:
- Phase IV: Cloud-Native Deployment Rules
- Infrastructure Policy
- AI Ops Rules
- Containerization Standards
- Kubernetes Deployment Standards

Removed sections: none (Phase III app logic preserved)

Templates requiring updates:
- .specify/templates/plan-template.md — Constitution Check (updated)
- .specify/templates/spec-template.md — FR references (no change needed)
- .specify/templates/tasks-template.md — Phase structure (no change needed)

Follow-up TODOs: none
-->

# Todo Full-Stack Web Application Constitution

## Core Principles

### I. Security & Isolation
All authentication flows MUST ensure strict user isolation and JWT
token integrity. Access control MUST be enforced at every layer —
application, API gateway, and Kubernetes namespace — to prevent
unauthorized data access or modification. Secrets MUST be managed
via environment variables or Kubernetes Secrets; hardcoded
credentials are prohibited.

### II. Accuracy & State Integrity
Backend operations MUST correctly reflect frontend actions and
synchronize with the database state. Data consistency is
non-negotiable across all system boundaries. The stateless server
design MUST persist all state in the database; no in-memory state
may survive container restarts.

### III. Reliability & Operational Readiness
APIs MUST handle errors gracefully, return appropriate HTTP status
codes, and maintain consistent data even under failure conditions.
Containers MUST include health check endpoints. Kubernetes
deployments MUST define liveness and readiness probes. System
stability across pod restarts and scaling events is a primary goal.

### IV. Usability & Responsiveness
The frontend interface MUST be responsive, intuitive, and
user-friendly across both desktop and mobile views. User experience
MUST be consistent and logical. The ChatKit UI from Phase III MUST
work without modification under containerized deployment.

### V. Reproducibility & Infrastructure as Code
All operations, configurations, and environment setups MUST be
defined as code (Dockerfiles, Helm charts, YAML manifests). The
project MUST be deployable to a fresh Minikube cluster with a single
`helm install` command. Manual infrastructure steps are prohibited;
all infrastructure MUST be spec-driven.

## Key Standards

- **Authentication**: All API calls require a valid JWT token;
  unauthorized requests MUST return 401.
- **API Compliance**: Endpoints MUST follow REST conventions with
  proper HTTP methods and status codes.
- **Database Integrity**: Task ownership MUST be enforced at the
  schema/query level; data stored persistently in Neon PostgreSQL.
- **Frontend Integration**: Next.js frontend MUST attach JWT to all
  requests and display server responses accurately.
- **Coding & Documentation**: Clear, readable code with purposeful
  comments; environment variables MUST be documented in
  `.env.example`.
- **Containerization**: Frontend and backend MUST each have a
  production-ready Dockerfile with multi-stage builds.
- **Orchestration**: All services MUST be deployable via Helm charts
  to a Minikube cluster using `kubectl` or `kubectl-ai`.

## Phase IV: Cloud-Native Deployment Rules

### Spec-Driven Infrastructure Automation
All infrastructure work MUST follow the SDD workflow:
spec -> plan -> tasks -> implementation. No manual coding or
ad-hoc infrastructure changes are permitted. AI agents handle
DevOps tasks; humans write specs and review output.

### Containerization Standards
- Frontend and backend MUST be containerized with Docker.
- Docker actions MUST be executed via Gordon (if available) or
  Claude Code agents.
- Images MUST use minimal base images and multi-stage builds.
- Containers MUST NOT run as root.
- Each container MUST expose a health check endpoint.

### Kubernetes Deployment Standards
- Deployment target: local Minikube cluster.
- All resources MUST be managed via Helm charts.
- Kubernetes actions MUST be executed via `kubectl-ai` and `kagent`.
- Deployments MUST define resource requests/limits, liveness probes,
  and readiness probes.
- ConfigMaps and Secrets MUST be used for environment configuration.
- Helm MUST manage all releases and upgrades.

### AI Ops Rules
- Docker build/push/run actions: via Gordon or Claude Code.
- Kubernetes apply/scale/rollout actions: via `kubectl-ai` and
  `kagent`.
- Human role: write specifications, review output, approve releases.
- Automated agents MUST NOT push to production without human
  approval.

## Constraints

- **Feature Set**: Phase III chatbot functionality MUST be preserved:
  task listing, creation, updating, deletion, and toggle status via
  natural language chat.
- **Viewport Support**: Responsive frontend supporting desktop and
  mobile views.
- **Security Config**: JWT tokens configured with shared secret via
  `BETTER_AUTH_SECRET`.
- **Backend Stack**: FastAPI + SQLModel ORM.
- **Frontend Stack**: Next.js 16+ using App Router with ChatKit UI.
- **AI Stack**: OpenAI Agents SDK + Official MCP SDK.
- **Infrastructure Stack**: Docker + Minikube + Helm + kubectl-ai +
  kagent.
- **Workflow**: 100% of implementation MUST be generated via
  Spec-Driven Development (SDD) workflow. No manual coding allowed.

## Success Criteria

- All Phase III chatbot functionality works without modification
  under containerized deployment.
- Frontend and backend containerized with production-ready
  Dockerfiles.
- Application deployable to Minikube via `helm install`.
- Kubernetes deployments include health checks, resource limits,
  and proper secret management.
- All infrastructure defined as code (no manual kubectl commands
  outside of AI agent execution).
- AI agents (Gordon, kubectl-ai, kagent) used for all DevOps
  operations.
- All API endpoints functional and secure against unauthorized
  access.
- Conversation history persists across pod restarts.
- Documentation complete for local Minikube deployment.

## Governance

- This constitution supersedes all other project practices.
- Amendments require a version bump and rationale in the Sync
  Impact Report.
- All implementation tasks MUST verify compliance with these
  principles.
- Version changes follow semantic versioning:
  - MAJOR: Backward-incompatible governance/principle changes.
  - MINOR: New principle/section added or materially expanded.
  - PATCH: Clarifications, wording, non-semantic refinements.
- Compliance reviews MUST occur at each SDD phase gate
  (spec, plan, tasks, implementation).

**Version**: 2.0.0 | **Ratified**: 2026-01-09 | **Last Amended**: 2026-02-14
