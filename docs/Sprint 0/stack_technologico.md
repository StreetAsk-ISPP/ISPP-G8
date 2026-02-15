# Tecnological Stack

## Backend Development

## Frontend Development

## Backend Deployment

## Frontend Deployment

### 1. Purpose

This section defines the technological stack and deployment strategy for the frontend of the system.

The objective is to:

- Clearly define the selected technology.
- Justify the decision based on technical and project constraints.
- Ensure compliance with the rule of **only one deployment per sprint**.
- Identify potential risks and establish mitigation strategies.



### 2. Selected Technology

The frontend of the system will be developed using:

- **React** (Single Page Application – SPA)
- Node.js runtime environment
- Vite as build tool and bundler

React has been selected due to:

- Its strong industry adoption and maturity.
- Component-based architecture promoting modularity and maintainability.
- Efficient rendering through the Virtual DOM.
- Strong ecosystem and long-term sustainability.
- Seamless integration with REST APIs exposed by Spring Boot.

The frontend will operate as a client-side rendered SPA consuming the backend REST API.



### 3. Deployment Architecture

The frontend will not be deployed as an independent service.

Instead, the production build of the React application will be integrated into the Spring Boot backend and served as static resources.

After executing:

    npm install
    npm run build

The generated build files (e.g., `dist/`) will be copied into:

    src/main/resources/static/

Spring Boot will then serve:

- `/` → `index.html`
- Static assets → `/assets/...`
- API endpoints → `/api/...`

The backend will be packaged using:

    mvn clean package

This produces a **single deployable artifact (JAR or Docker image)** containing:

- Backend logic (Spring Boot REST API)
- Compiled frontend (React SPA)



### 4. Compliance with the “One Deployment per Sprint” Constraint

The project enforces a strict limitation of **one deployment per sprint**.

To ensure compliance:

- Frontend and backend are deployed together as a single artifact.
- Deployment is triggered only at sprint closure.
- Pull Requests execute build and test pipelines but do not trigger production deployment.
- The main branch is protected.
- Deployment requires a controlled sprint release (tag-based or release workflow).

By consolidating frontend and backend into a single artifact, we eliminate the possibility of multiple independent deployments within a sprint.

This strategy guarantees strict adherence to project constraints.



### 5. Technology Selection Rationale

The chosen approach (React SPA compiled and served by Spring Boot) was selected after evaluating multiple alternatives.

#### 5.1 Decision Drivers

The decision was based on the following criteria:

- Compliance with one-deployment-per-sprint constraint.
- Version consistency between frontend and backend.
- Operational simplicity.
- Reduced infrastructure complexity.
- Academic project context prioritizing stability over scalability.

#### 5.2 Alternative 1 – Independent Frontend Deployment (e.g., Vercel, Netlify)

**Advantages:**
- CDN-based performance optimization.
- Independent frontend releases.
- Preview deployments for branches.

**Disadvantages:**
- Requires separate deployment process.
- Risk of frontend/backend version desynchronization.
- Increased operational complexity.
- Higher risk of violating sprint deployment limitation.

**Decision:** Rejected due to misalignment with sprint deployment constraint.



#### 5.3 Alternative 2 – Dedicated Static Server (e.g., Nginx)

**Advantages:**
- High-performance static serving.
- Clear separation of concerns.

**Disadvantages:**
- Additional infrastructure to maintain.
- More complex deployment pipeline.
- Increased configuration overhead.

**Decision:** Rejected due to unnecessary architectural complexity for the project scope.



#### 5.4 Final Decision

The unified deployment model ensures:

- Strict compliance with sprint constraints.
- Single source of truth for application versioning.
- Simplified CI/CD.
- Reduced operational risk.
- Controlled and stable release process.



### 6. SPA Routing Considerations

As the application is a Single Page Application:

- Client-side routes (e.g., `/events/1`) must not return 404 errors when refreshed.
- Spring Boot will be configured to forward unknown non-API routes to `index.html`.

This guarantees correct client-side routing behavior.



### 7. CI/CD Strategy

The CI/CD pipeline will follow these principles:

- Pull Requests:
  - Execute frontend build.
  - Execute backend build.
  - Run tests.
  - No production deployment.

- Sprint Closure:
  - Deployment triggered manually or by sprint release tag.
  - Single artifact built and deployed.

Additional safeguards:

- Protected main branch.
- Mandatory review before merge.
- Controlled deployment workflow.



### 8. Identified Risks and Mitigation Plan

#### Risk 1 – SPA routing returning 404 errors

Description:
Refreshing nested routes may cause the server to return 404.

Mitigation:
- Configure Spring Boot to redirect all non-API requests to `index.html`.



#### Risk 2 – Browser caching serving outdated frontend versions

Description:
Users may receive outdated static files after deployment.

Mitigation:
- Use hashed filenames generated by the bundler.
- Configure appropriate cache-control headers.
- Avoid aggressive caching for `index.html`.



#### Risk 3 – Increased CI/CD pipeline duration

Description:
Frontend build increases pipeline execution time.

Mitigation:
- Cache Node dependencies.
- Trigger frontend build only when frontend files change.



#### Risk 4 – Oversized deployable artifact

Description:
Bundling frontend and backend may increase artifact size.

Mitigation:
- Enable production minification.
- Remove unused dependencies.
- Apply code splitting and lazy loading.



#### Risk 5 – Violation of sprint deployment policy

Description:
Accidental multiple deployments during a sprint.

Mitigation:
- Protect main branch.
- Restrict deployment to sprint release tags.
- Enforce review process before release.



### 9. Conclusion

The selected frontend deployment strategy — compiling the React SPA and serving it through Spring Boot — provides:

- Architectural simplicity.
- Operational efficiency.
- Strict compliance with sprint constraints.
- Version consistency between frontend and backend.
- Reduced deployment risk.
- Controlled and predictable release management.

This solution balances technical robustness with academic and operational constraints, ensuring a stable, maintainable, and compliant deployment process.



## Team and Software Management
