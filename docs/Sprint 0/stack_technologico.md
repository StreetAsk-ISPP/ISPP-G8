# Tecnological Stack

## 1: Backend Development

## Backend Development

The backend of StreetAsk is designed as a scalable RESTful service responsible for managing users, questions, answers, and geolocation-based filtering logic.

### Selected Stack

The backend of StreetAsk will be developed using:

- *Language:* Java
- *Framework:* Spring Boot
- *Architecture:* RESTful API
- *Persistence Layer:* Spring Data JPA / Hibernate
- *Database:* Relational database
- *Security:* Spring Security
- *Testing:* JUnit 5 + Mockito
- *Build Tool:* Maven

---

### Justification for the Selection

The decision to use *Java + Spring Boot* is based on the following factors:

#### 1. Team Experience
All team members are familiar with Java and Spring Boot. This reduces the learning curve and minimizes technical blocking in a large team (21 members).

#### 2. Stability and Maturity
Spring Boot is a mature, well-documented framework with strong community support. It provides robust tools for:
- REST API development
- Security configuration
- Database integration
- Dependency management

#### 3. Scalability and Maintainability
The backend follows a layered architecture (Controller–Service–Repository), which promotes separation of concerns and improves maintainability.
- Role management
- Advanced analytics
- Monetization features
- Event systems

#### 4. Alignment with MVP Requirements
StreetAsk requires:
- User authentication
- Real-time question/answer endpoints
- Expiration logic for questions
- Geolocation-based filtering

Spring Boot allows implementing these requirements in a structured and secure way.


### Alternatives Considered

---

#### Node.js (Express / NestJS)
*Pros:*
- Fast for prototyping
- Large ecosystem

*Cons:*
- Lower team familiarity
- Higher risk of inconsistent architecture in a large team

---

#### Python (Django / FastAPI)
*Pros:*
- Rapid development
- Clean syntax

*Cons:*
- Less backend experience in the team compared to Java
- Risk of coordination issues

---

Java + Spring Boot was selected because it minimizes risk and maximizes productivity within the team.

---

### Risk Analysis and Mitigation Plan

| Risk | Impact | Mitigation Strategy |
|------|--------|--------------------|
| R1: Complexity of Spring configuration | Medium | Define a standard project structure and coding conventions. Use code reviews. |
| R2: Performance issues in geolocation filtering | High | Use indexed queries, optimized calculations (e.g., Haversine formula), and pagination. |
| R3: Security vulnerabilities (location data) | High | Implement Spring Security, input validation, and limit sensitive data storage. |
| R4: Merge conflicts due to large team size | High | Use feature branches, pull request reviews, and keep trunk updated. |
| R5: Overengineering in MVP | Medium | Keep implementation minimal and aligned with MVP scope. |
| R6: Insufficient test coverage | High | Enforce unit testing before merge and require passing CI pipelines before integration. |


---

### Conclusion

Java + Spring Boot provides the best balance between technical robustness, team expertise, scalability, and risk reduction. It ensures a stable backend foundation for StreetAsk’s MVP and future expansions.

## 2: Frontend Development

## 3: Backend & Database Deployment 

### 3.1: Cloud Provider Selection: Why Azure?

The decision to utilize **Microsoft Azure** as our cloud infrastructure is driven by a strategic resource advantage:

* **University of Seville Partnership:** The University of Seville is an active beneficiary of the **Azure for Students** program. Only the following regions are available ("spaincentral","switzerlandnorth","italynorth","germanywestcentral","polandcentral").
* **Cost Efficiency:** This partnership grants us access to **$100 in annual credits** and free tier services for 12 months. This allows the team to deploy enterprise-grade architecture (PaaS and Serverless) without incurring out-of-pocket expenses during the development and initial production phases.
* **Professional Certification:** Developing on Azure aligns with industry standards, offering the team experience with tools widely used in the corporate sector (PostgreSQL on Azure, GitHub Actions).

---

### 3.2: Architecture Selection: Option 3 (Winner)

We evaluated three potential architectures. We have selected **Option 3: Azure Container Apps** as the optimal balance between modernity, cost (covered by student credits), and performance.

| Architecture | Description | Verdict |
| --- | --- | --- |
| **Azure App Service** | Traditional PaaS for hosting web apps. | **Discarded.** While simple, it lacks the flexibility of container orchestration and can be more expensive to scale vertically. |
| **Azure Spring Apps** | Managed service specifically for Spring Boot. | **Discarded.** The base cost is too high, consuming our student credits too quickly for a single microservice. |
| **Azure Container Apps** | **Serverless Containers (Kubernetes-based).** | **WINNER.** It allows us to run **Docker containers** natively. It supports **scaling to zero** (saving credits when the app is not in use) and provides a production-ready environment similar to Kubernetes but without the management overhead. |

---

### 3.3: The Deployment Pipeline (CI/CD)

We will automate the delivery of both the Database and the Backend Code using **GitHub Actions**. Manual deployments are restricted to the initial infrastructure setup.

#### A. The Database: Azure Database for PostgreSQL

We will use the **Flexible Server** deployment option.

* **Provisioning:** We will provision the instance via the Azure Portal (using student credits).
* **Security:** The database will be configured inside a Virtual Network (VNet) or with firewall rules that **only** allow connections from our Container App and the developers' specific IP addresses for debugging.
* **Schema Management:** We will not run SQL scripts manually. The Spring Boot application will include **Flyway** (or Liquibase) to automatically migrate the database schema (create tables, add columns) every time the application starts.

#### B. The Backend: Source Code to Container

The Continuous Deployment (CD) pipeline will function as follows:

1. **Trigger:** Developer pushes code to the `main` branch.
2. **Build (CI):** GitHub Actions creates a runner, checks out the code, and runs `mvn clean package` to test and build the JAR file.
3. **Dockerize:** The Action builds a Docker image using our `Dockerfile`.
4. **Registry:** The image is pushed to **Azure Container Registry (ACR)**.
5. **Deploy (CD):** The Action triggers a revision update in **Azure Container Apps**, pulling the new image from ACR and restarting the container gracefully.

---

### 3.4: Risk Assessment & Mitigation

Deploying a cloud-native application under an academic license involves specific risks.

| Risk | Impact | Mitigation Strategy |
| --- | --- | --- |
| **Credit Exhaustion** | If the $100 student credit runs out, services will stop immediately. | **Budget Alerts:** We will configure "Cost Alerts" in Azure to notify us when we reach 50% and 80% of the credit limit. We will use "B-series" (Burstable) compute instances which are the cheapest. |
| **Cold Starts** | Azure Container Apps "scales to zero" to save money. The first user might wait 10+ seconds for the backend to wake up. | **Acceptance:** For a student project/MVP, this is an acceptable trade-off to save credits. If needed for a demo, we can set `minReplicas=1` temporarily. |
| **Data Loss** | Accidental deletion of the database resource. | **Backups:** Azure PostgreSQL Flexible Server includes automatic backups (7-day retention). We will also enable "Resource Locks" in the Azure Portal to prevent accidental deletion. |
| **Vendor Lock-in** | Difficulty migrating if we lose University access. | **Docker Strategy:** Since the entire backend is dockerized and the DB is standard PostgreSQL, we can migrate to AWS, Google Cloud, or a local server in less than 2 hours by simply moving the container image and dumping the SQL data. |



---

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
