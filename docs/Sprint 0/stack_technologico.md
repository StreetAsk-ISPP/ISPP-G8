# StreetAsk — Technology Stack 

This document defines the **official technology stack** and **operational decisions** for the StreetAsk project. It provides a standardized reference for the whole team, including the rationale behind each choice, evaluated alternatives, and the main risks with mitigation strategies. The goal is to ensure **consistency**, **scalability**, and **alignment with MVP constraints** across backend, frontend, deployment, and team management.

---

## Table of Contents

1. [Backend Development](#1-backend-development)  
   1.1. [Selected Stack](#11-selected-stack)  
   1.2. [Justification](#12-justification)  
   1.3. [Alternatives Considered](#13-alternatives-considered)  
   1.4. [Risk Analysis & Mitigation](#14-risk-analysis--mitigation)  
   1.5. [Conclusion](#15-backend-conclusion)  

2. [Frontend Development](#2-frontend-development)  
   2.1. [Selected Stack](#21-selected-stack)  
   2.2. [Rationale: JavaScript over TypeScript](#22-rationale-javascript-over-typescript)  
   2.3. [Evaluated Alternatives](#23-evaluated-alternatives)  
   2.4. [Risks & Mitigation](#24-frontend-risks--mitigation)  
   2.5. [Conclusion](#25-frontend-conclusion)  

3. [Backend & Database Deployment (Azure)](#3-backend--database-deployment-azure)  
   3.1. [Cloud Provider: Why Azure?](#31-cloud-provider-why-azure)  
   3.2. [Architecture Selection: Option 3 (Winner)](#32-architecture-selection-option-3-winner)  
   3.3. [Deployment Pipeline (CI/CD)](#33-the-deployment-pipeline-cicd)  
   3.4. [Risk Assessment & Mitigation](#34-risk-assessment--mitigation)  

4. [Frontend Deployment](#4-frontend-deployment)  
   4.1. [Selected Technology](#41-selected-technology)  
   4.2. [Deployment Architecture](#42-deployment-architecture)  
   4.3. [One Deployment per Sprint Compliance](#43-compliance-with-the-one-deployment-per-sprint-constraint)  
   4.4. [SPA Routing Considerations](#44-spa-routing-considerations)  
   4.5. [CI/CD Strategy](#45-cicd-strategy)  
   4.6. [Risks & Mitigation](#46-identified-risks--mitigation-plan)  
   4.7. [Conclusion](#47-frontend-deployment-conclusion)  

5. [Team & Software Management](#5-team--software-management)  
   5.1. [Selected Tool: ZenHub](#51-selected-tool-zenhub)  
   5.2. [Rationale](#52-rationale)  
   5.3. [Alternatives Considered](#53-alternatives-considered)  
   5.4. [Risks & Mitigation](#54-risks--mitigation-plan)  
   5.5. [Conclusion](#55-management-conclusion)  

---

## 1. Backend Development

The backend of StreetAsk is designed as a scalable RESTful service responsible for managing users, questions, answers, and geolocation-based filtering logic.

### 1.1 Selected Stack

The backend of StreetAsk will be developed using:

- **Language:** Java  
- **Framework:** Spring Boot  
- **Architecture:** RESTful API  
- **Persistence Layer:** Spring Data JPA / Hibernate  
- **Database:** Relational database  
- **Security:** Spring Security  
- **Testing:** JUnit 5 + Mockito  
- **Build Tool:** Maven  

---

### 1.2 Justification

#### 1) Team Experience
All team members are familiar with Java and Spring Boot. This reduces the learning curve and minimizes technical blocking in a large team (**21 members**).

#### 2) Stability and Maturity
Spring Boot is a mature, well-documented framework with strong community support. It provides robust tools for:
- REST API development  
- Security configuration  
- Database integration  
- Dependency management  

#### 3) Scalability and Maintainability
The backend follows a layered architecture (**Controller–Service–Repository**) that promotes separation of concerns and maintainability. It supports future capabilities such as:
- Role management  
- Advanced analytics  
- Monetization features  
- Event systems  

#### 4) Alignment with MVP Requirements
StreetAsk requires:
- User authentication  
- Question/answer endpoints  
- Expiration logic for questions  
- Geolocation-based filtering  

Spring Boot enables implementing these requirements in a structured and secure way.

---

### 1.3 Alternatives Considered

#### Node.js (Express / NestJS)
**Pros:**
- Fast prototyping  
- Large ecosystem  

**Cons:**
- Lower team familiarity  
- Higher risk of inconsistent architecture in a large team  

#### Python (Django / FastAPI)
**Pros:**
- Rapid development  
- Clean syntax  

**Cons:**
- Less backend experience in the team compared to Java  
- Higher risk of coordination issues  

**Decision:** Java + Spring Boot was selected because it minimizes risk and maximizes productivity within the team.

---

### 1.4 Risk Analysis & Mitigation

| Risk | Impact | Mitigation Strategy |
|------|--------|---------------------|
| R1: Complexity of Spring configuration | Medium | Define a standard project structure and coding conventions. Use code reviews. |
| R2: Performance issues in geolocation filtering | High | Use indexed queries, optimized calculations (e.g., Haversine formula), and pagination. |
| R3: Security vulnerabilities (location data) | High | Implement Spring Security, input validation, and limit sensitive data storage. |
| R4: Merge conflicts due to large team size | High | Use feature branches, pull request reviews, and keep trunk updated. |
| R5: Overengineering in MVP | Medium | Keep implementation minimal and aligned with MVP scope. |
| R6: Insufficient test coverage | High | Enforce unit testing before merge and require passing CI pipelines before integration. |

---

### 1.5 Backend Conclusion

Java + Spring Boot provides the best balance between technical robustness, team expertise, scalability, and risk reduction. It ensures a stable backend foundation for StreetAsk’s MVP and future expansions.

---

## 2. Frontend Development

This section defines the selected technology stack for the frontend development of the system.

### 2.1 Selected Stack

The frontend will be developed using:

- **React** (Single Page Application – SPA)  
- **JavaScript** as the development language  
- **Vite** as the build tool and bundler  
- **Node.js** as the runtime environment during development  

React with JavaScript was selected due to:
- Strong industry adoption and maturity  
- Component-based architecture promoting modularity and maintainability  
- Efficient rendering through the Virtual DOM  
- Accessible learning curve using plain JavaScript (no TypeScript overhead)  
- Extensive ecosystem and documentation  
- Seamless integration with REST APIs exposed by the Spring Boot backend  
- High team familiarity, reducing onboarding friction  

The frontend will operate as a client-side rendered SPA consuming the backend REST API.

---

### 2.2 Rationale: JavaScript over TypeScript

While TypeScript offers static typing and stronger tooling, JavaScript was selected because:
- The team has more experience with JavaScript, lowering adaptation time  
- In an academic project context, TypeScript complexity is not proportional to the benefit  
- The scope does not justify additional configuration/compilation overhead  
- JavaScript enables faster iteration early on, without type blockers  

This decision may be revisited in later phases if the project scales in complexity.

---

### 2.3 Evaluated Alternatives

#### Decision Drivers
- Compatibility with project constraints (**one deployment per sprint**)  
- Ease of integration with Spring Boot  
- Learning curve  
- Long-term stability and sustainability  
- Operational simplicity (academic context)  

#### Alternative 1 — Vue.js with JavaScript
**Advantages:**
- Clear syntax  
- Strong documentation  
- Smaller bundles for lightweight apps  

**Disadvantages:**
- Lower adoption vs React  
- Smaller ecosystem for integrations  
- Lower team familiarity  

**Decision:** Rejected due to lower adoption and team familiarity.

#### Alternative 2 — Angular with TypeScript
**Advantages:**
- Full-featured framework  
- Strong typing via TypeScript  
- Suitable for large-scale apps  

**Disadvantages:**
- Steeper learning curve  
- High verbosity/config complexity  
- Oversized for current scope  
- Mandatory TypeScript increases friction  

**Decision:** Rejected due to unnecessary overhead.

#### Alternative 3 — React with TypeScript
**Advantages:**
- Static typing reduces compile-time errors  
- Better IDE support/autocomplete  
- More suitable for large teams long-term  

**Disadvantages:**
- Additional learning curve for TypeScript  
- Longer initial setup/config time  
- Benefit not justified for academic scope  

**Decision:** Rejected in favor of React + JavaScript to reduce friction.

---

### 2.4 Frontend Risks & Mitigation

**Risk 1 — Runtime errors due to lack of static typing**  
Mitigation:
- Strong PR reviews  
- ESLint strict rules  
- Unit tests (Jest or Vitest) for critical modules  

**Risk 2 — Maintainability issues as project grows**  
Mitigation:
- Clear coding conventions (naming, folder structure, separation of concerns)  

**Risk 3 — Dependency version conflicts**  
Mitigation:
- Reproducible installs for all team members  
- Review changelogs before updating critical dependencies  

**Risk 4 — Bundle performance in production**  
Mitigation:
- Vite production optimizations (minification, tree-shaking)  
- Code splitting and lazy loading  
- Remove unused dependencies before each release  

**Risk 5 — Dev/prod environment inconsistencies**  
Mitigation:
- Test production builds during the sprint  
- Document the build and Spring Boot integration procedure  

---

### 2.5 Frontend Conclusion

React + JavaScript + Vite provides a mature and widely adopted foundation, enabling fast iteration and smooth integration with the Spring Boot backend while remaining aligned with the project’s academic constraints.

---

## 3. Backend & Database Deployment (Azure)

### 3.1 Cloud Provider: Why Azure?

The decision to use **Microsoft Azure** is driven by a strategic resource advantage:

- **University of Seville Partnership:** The team can use the **Azure for Students** program. Only the following regions are available: `spaincentral`, `switzerlandnorth`, `italynorth`, `germanywestcentral`, `polandcentral`.  
- **Cost Efficiency:** Access to **$100 annual credits** and free tier services for 12 months supports deployment without out-of-pocket costs during development and initial production.  
- **Professional Tooling:** Working on Azure provides experience with industry-grade tooling (PostgreSQL on Azure, GitHub Actions).

---

### 3.2 Architecture Selection: Option 3 (Winner)

We evaluated three architectures and selected **Option 3: Azure Container Apps** as the best balance between modernity, cost, and performance.

| Architecture | Description | Verdict |
|---|---|---|
| Azure App Service | Traditional PaaS hosting for web apps. | Discarded — less flexibility and potentially higher scaling cost. |
| Azure Spring Apps | Managed Spring Boot service. | Discarded — base cost consumes student credits too quickly. |
| Azure Container Apps | Serverless containers (Kubernetes-based). | **Winner** — supports Docker, scales to zero, production-ready without management overhead. |

---

### 3.3 The Deployment Pipeline (CI/CD)

We will automate delivery of both the Database and Backend using **GitHub Actions**. Manual deployments are restricted to initial infrastructure setup.

#### A) Database — Azure Database for PostgreSQL (Flexible Server)
- **Provisioning:** via Azure Portal (student credits)  
- **Security:** VNet or firewall rules restricting access to Container App + developers’ IPs  
- **Schema Management:** use **Flyway** (or Liquibase) to migrate schema automatically on startup  

#### B) Backend — Source Code to Container
1. **Trigger:** push to `main`  
2. **Build (CI):** `mvn clean package` to test and build the JAR  
3. **Dockerize:** build Docker image via `Dockerfile`  
4. **Registry:** push image to **Azure Container Registry (ACR)**  
5. **Deploy (CD):** update revision in **Azure Container Apps** and restart gracefully  

---

### 3.4 Risk Assessment & Mitigation

| Risk | Impact | Mitigation Strategy |
|---|---|---|
| Credit Exhaustion | Services stop when credits run out. | Configure Azure Cost Alerts at 50% and 80%. Use cheaper burstable instances when applicable. |
| Cold Starts | First user after scale-to-zero may wait 10+ seconds. | Acceptable trade-off for MVP; set `minReplicas=1` temporarily for demos if needed. |
| Data Loss | Accidental DB deletion. | Use automatic backups (7-day retention). Enable Azure Resource Locks. |
| Vendor Lock-in | Difficulty migrating off Azure. | Dockerized backend + standard PostgreSQL enable migration by moving container + DB dump quickly. |

---

## 4. Frontend Deployment

### 4.1 Selected Technology

- React (SPA)  
- Node.js runtime  
- Vite bundler/build tool  

---

### 4.2 Deployment Architecture

The frontend will not be deployed independently. Instead:

1. Build the React app:
   - `npm install`
   - `npm run build`

2. Copy the production build output (e.g., `dist/`) into:
   - `src/main/resources/static/`

Spring Boot will then serve:
- `/` → `index.html`  
- `/assets/...` → static assets  
- `/api/...` → backend endpoints  

The backend is packaged with:
- `mvn clean package`

This produces **a single deployable artifact** (JAR or Docker image) containing:
- Spring Boot REST API  
- Compiled React SPA  

---

### 4.3 Compliance with the “One Deployment per Sprint” Constraint

To ensure compliance with the rule of **one deployment per sprint**:

- Frontend and backend are deployed together as a single artifact  
- Production deployment is triggered only at sprint closure  
- PRs run build/test pipelines but do not deploy  
- Main branch is protected  
- Deployment is executed via a controlled release workflow (tag-based or manual release)  

---

### 4.4 SPA Routing Considerations

As this is an SPA:
- Client-side routes (e.g., `/events/1`) must not return 404 on refresh  
- Spring Boot must forward unknown non-API routes to `index.html`  

---

### 4.5 CI/CD Strategy

- **Pull Requests:**
  - Run frontend build  
  - Run backend build  
  - Run tests  
  - **No production deployment**  

- **Sprint Closure:**
  - Deployment triggered manually or via sprint release tag  
  - One artifact built and deployed  

Safeguards:
- Protected `main` branch  
- Mandatory review before merge  
- Controlled deployment workflow  

---

### 4.6 Identified Risks & Mitigation Plan

**Risk 1 — SPA routes return 404 on refresh**  
Mitigation:
- Configure Spring Boot to redirect all non-API routes to `index.html`

**Risk 2 — Browser caching serves outdated frontend**  
Mitigation:
- Use hashed filenames  
- Set appropriate cache-control headers  
- Avoid aggressive caching for `index.html`

**Risk 3 — Longer CI/CD pipeline duration**  
Mitigation:
- Cache Node dependencies  
- Trigger frontend build only when frontend files change

**Risk 4 — Oversized deployable artifact**  
Mitigation:
- Production minification  
- Remove unused dependencies  
- Code splitting and lazy loading

**Risk 5 — Violation of sprint deployment policy**  
Mitigation:
- Protect main branch  
- Restrict deployment to sprint release tags  
- Enforce review process before release

---

### 4.7 Frontend Deployment Conclusion

Bundling the React SPA into the Spring Boot backend provides operational simplicity, strict sprint-deployment compliance, version consistency, and lower infrastructure complexity—ideal for an academic MVP.

---

## 5. Team & Software Management

### 5.1 Selected Tool: ZenHub

The project will use **ZenHub** for sprint and workflow management. ZenHub extends GitHub Issues with Scrum tooling while preserving full traceability to the GitHub development workflow.

---

### 5.2 Rationale

ZenHub was selected because:
- The team size (**18 members**) requires structured coordination  
- The project aims to simulate a startup-like environment  
- Agile metrics are needed (velocity, burndown, progress tracking)  
- Tight GitHub integration ensures traceability: issue → branch → commit → PR → merge  

ZenHub provides:
- Sprint planning  
- Burndown charts  
- Velocity tracking  
- Roadmaps  
- Dependency management  
- Deep integration with GitHub issues and PRs  

---

### 5.3 Alternatives Considered

#### GitHub Projects
**Advantages:**
- Native GitHub integration  
- Simple and low overhead  

**Disadvantages:**
- Limited agile metrics  
- Weak velocity/burndown tracking  
- Limited dependency management  
- Insufficient for coordinating 18 members effectively  

**Decision:** Rejected due to limited Scrum metrics and scalability.

#### Jira
**Advantages:**
- Industry-standard agile tooling  
- Strong reporting and metrics  
- Mature ecosystem  

**Disadvantages:**
- Requires integration with GitHub  
- Higher operational complexity  
- Steeper learning curve  
- More configuration overhead  

**Decision:** Rejected due to added complexity and separation from GitHub workflow.

---

### 5.4 Risks & Mitigation Plan

**Risk 1 — Learning curve**  
Mitigation:
- Short onboarding session  
- Clear guidelines for sprint/board usage  
- Standardized workflow across teams  

**Risk 2 — Underutilization of advanced features**  
Mitigation:
- Assign a Scrum responsible to monitor metrics  
- Review sprint performance formally at sprint end  

**Risk 3 — Increased process complexity**  
Mitigation:
- Keep workflows simple  
- Avoid unnecessary customization  
- Use only features with measurable value  

**Risk 4 — Tool dependency**  
Mitigation:
- Core data remains in GitHub Issues  
- Maintain workflow documentation independent of ZenHub  

---

### 5.5 Management Conclusion

ZenHub is the most appropriate tool for StreetAsk given the team size and need for structured Scrum metrics, while keeping the workflow fully integrated with GitHub and minimizing operational friction.

---
