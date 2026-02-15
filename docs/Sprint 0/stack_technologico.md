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

### 1. Purpose

This section defines the project management tool that will be used during the upcoming sprints.

Given the team size (18 members) and the startup-oriented approach of the project, the selected tool must:

- Support structured sprint planning.
- Enable coordination across multiple functional areas.
- Provide agile metrics (velocity, burndown, progress tracking).
- Integrate seamlessly with the GitHub development workflow.
- Scale effectively for a medium-sized team.



### 2. Selected Tool: ZenHub

The team has selected **ZenHub** as the project and sprint management tool.

ZenHub operates as an agile project management layer integrated directly into GitHub, extending native GitHub Issues with advanced Scrum capabilities.



### 3. Rationale for Selection

The decision was based on the following factors:

- The team consists of 18 members, which requires structured coordination.
- The project aims to simulate a real startup environment.
- Advanced agile metrics are necessary for sprint planning and evaluation.
- Tight integration with GitHub is essential to maintain traceability.

ZenHub provides:

- Sprint planning tools
- Burndown charts
- Velocity tracking
- Roadmap visualization
- Dependency management
- Direct integration with GitHub issues and pull requests

This makes it suitable for scaling agile processes beyond basic task tracking.



### 4. Alternatives Considered

#### 4.1 GitHub Projects

GitHub Projects was evaluated as a potential solution.

**Advantages:**
- Fully integrated with GitHub.
- Simple and easy to use.
- No additional configuration required.
- Low operational overhead.

**Disadvantages:**
- Limited agile metrics.
- No robust velocity tracking.
- Basic burndown functionality.
- Limited dependency management.
- Insufficient for coordinating 18 team members effectively.

**Decision:**  
Rejected due to limited scalability and lack of advanced Scrum metrics.



#### 4.2 Jira

Jira was also evaluated as an industry-standard agile management tool.

**Advantages:**
- Advanced Scrum support.
- Extensive reporting and metrics.
- Mature ecosystem.
- Widely adopted in enterprise environments.

**Disadvantages:**
- Separate from GitHub (requires integration).
- Increased operational complexity.
- Higher configuration overhead.
- Steeper learning curve.
- Adds friction to development workflow.

**Decision:**  
Rejected due to infrastructure complexity and separation from the GitHub-centered workflow.



### 5. Why ZenHub Over the Alternatives

ZenHub was selected because it combines:

- Advanced agile management capabilities (similar to Jira),
- Seamless integration with GitHub (like GitHub Projects),
- Lower operational overhead compared to Jira,
- Scalability suitable for a team of 18 members.

It allows the team to:

- Maintain full traceability from issue → branch → commit → PR → merge.
- Track sprint performance objectively.
- Monitor team velocity.
- Identify bottlenecks early.
- Plan releases more strategically.

This aligns with the project’s startup-oriented mindset and professional development goals.



### 6. Risks and Mitigation Plan

#### Risk 1 – Learning Curve

Description:
Team members may initially struggle to use advanced ZenHub features.

Mitigation:
- Provide a short onboarding session.
- Define clear sprint and board usage guidelines.
- Use a standardized workflow across teams.



#### Risk 2 – Underutilization of Advanced Features

Description:
The team may not fully leverage velocity tracking or burndown metrics.

Mitigation:
- Assign a Scrum responsible to monitor metrics.
- Review sprint performance formally at the end of each sprint.



#### Risk 3 – Increased Process Complexity

Description:
More structure may slow down early development.

Mitigation:
- Keep workflows simple.
- Avoid unnecessary customization.
- Focus only on features that add measurable value.



#### Risk 4 – Tool Dependency

Description:
Reliance on ZenHub could introduce process dependency.

Mitigation:
- Since ZenHub is built on top of GitHub Issues, core data remains in GitHub.
- Maintain workflow documentation independent of the tool.



### 7. Conclusion

Given the team size (18 members), the startup-oriented approach, and the need for structured agile metrics, **ZenHub** is the most appropriate project management tool.

It provides:

- Scalability.
- Advanced Scrum metrics.
- Full GitHub integration.
- Professional workflow support.
- Reduced operational friction compared to Jira.

The selection balances agility, scalability, and integration, ensuring the team can operate in a structured yet flexible manner consistent with real-world startup practices.