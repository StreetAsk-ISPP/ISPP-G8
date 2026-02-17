# StreetAsk — Technology Stack & Management (Standardized Decision Document)

This document defines the official technological and organizational decisions for the StreetAsk project.  
All sections follow the exact same structure to ensure consistency, transparency, and comparability.

---

# Table of Contents

1. [Backend Development](#1-backend-development)  
2. [Frontend Development](#2-frontend-development)  
3. [Backend & Database Deployment](#3-backend--database-deployment)  
4. [Frontend Deployment](#4-frontend-deployment)  
5. [Team & Software Management](#5-team--software-management)  

---

# 1. Backend Development

## 1.1 Purpose

Define the backend architecture responsible for business logic, authentication, Q/A management, expiration logic, and geolocation filtering.

---

## 1.2 Selected Technology

**Java + Spring Boot (RESTful layered architecture)**

Supporting tools:
- Spring Data JPA / Hibernate
- Spring Security
- Maven
- JUnit 5 + Mockito

---

## 1.3 Decision Drivers

- High team familiarity (21 members)
- Stability and maturity
- Strong security ecosystem
- Maintainability via layered architecture
- MVP alignment
- Long-term scalability

---

## 1.4 Comparative Evaluation of Technologies

| Technology | Advantages | Disadvantages |
|------------|------------|--------------|
| **Java + Spring Boot (Selected)** | Mature ecosystem, strong security, excellent documentation, layered architecture, strong typing, ideal for large teams | Configuration complexity, heavier setup than lightweight frameworks |
| Node.js (Express/NestJS) | Fast prototyping, flexible ecosystem, large community | Risk of inconsistent architecture, weaker typing (unless TS), lower team familiarity |
| Python (Django/FastAPI) | Rapid development, clean syntax, strong frameworks | Lower backend experience in team, potential coordination issues |

---

## 1.5 Risks & Mitigation Plan

| Risk ID | Risk | Impact | Mitigation Strategy |
|----------|------|--------|--------------------|
| BE-R1 | Spring configuration complexity | Medium | Standard structure templates + strict code reviews |
| BE-R2 | Geolocation performance issues | High | Indexed queries + optimized calculations (Haversine) |
| BE-R3 | Security vulnerabilities | High | Spring Security + validation + least-privilege DB access |
| BE-R4 | Merge conflicts (large team) | High | Feature branches + mandatory PR review |
| BE-R5 | Overengineering | Medium | Strict MVP scope enforcement |
| BE-R6 | Low test coverage | High | CI enforcement + required unit tests |

---

## 1.6 Conclusion

Java + Spring Boot provides the strongest balance between robustness, team efficiency, scalability, and risk reduction.

---

# 2. Frontend Development

## 2.1 Purpose

Define the client-side architecture responsible for the user interface and integration with backend APIs.

---

## 2.2 Selected Technology

**React + JavaScript + Vite**

---

## 2.3 Decision Drivers

- Team familiarity
- Industry adoption
- SPA suitability
- MVP simplicity
- Easy integration with Spring Boot

---

## 2.4 Comparative Evaluation of Technologies

| Technology | Advantages | Disadvantages |
|------------|------------|--------------|
| **React + JavaScript (Selected)** | Large ecosystem, modular components, fast iteration, simple setup, strong community support | No static typing, potential runtime errors |
| Vue.js | Clean syntax, easy learning curve, lightweight | Smaller ecosystem compared to React, lower team familiarity |
| Angular | Full-featured framework, strong typing (TypeScript), enterprise-ready | High complexity, steep learning curve, heavy for MVP |
| React + TypeScript | Static typing, better IDE support, scalable for large apps | Extra configuration, learning curve, higher initial friction |

---

## 2.5 Risks & Mitigation Plan

| Risk ID | Risk | Impact | Mitigation Strategy |
|----------|------|--------|--------------------|
| FE-R1 | Runtime errors (no typing) | Medium | ESLint + unit tests |
| FE-R2 | Maintainability issues | Medium | Enforced folder structure + coding standards |
| FE-R3 | Dependency conflicts | Medium | Lockfiles + controlled updates |
| FE-R4 | Bundle performance issues | Medium | Code splitting + lazy loading |
| FE-R5 | Dev/Prod inconsistencies | Medium | Test production builds during sprint |

---

## 2.6 Conclusion

React + JavaScript maximizes development speed while maintaining sufficient maintainability for the MVP scope.

---

# 3. Backend & Database Deployment

## 3.1 Purpose

Define cloud infrastructure and CI/CD automation strategy under student credit constraints.

---

## 3.2 Selected Technology

- **Cloud Provider:** Microsoft Azure  
- **Backend Hosting:** Azure Container Apps  
- **Registry:** Azure Container Registry  
- **Database:** Azure PostgreSQL Flexible Server  
- **CI/CD:** GitHub Actions  
- **Database Migrations:** Flyway  

---

## 3.3 Decision Drivers

- $100 Azure Student credits
- Cost efficiency
- Container portability
- Managed database reliability
- Automated CI/CD

---

## 3.4 Comparative Evaluation of Technologies

| Technology | Advantages | Disadvantages |
|------------|------------|--------------|
| **Azure Container Apps (Selected)** | Scale-to-zero, container-native, cost-efficient, Kubernetes-based without management overhead | Cold starts possible |
| Azure App Service | Simple PaaS deployment | Less container flexibility, potentially higher cost scaling |
| Azure Spring Apps | Fully managed Spring environment | High base cost (unsuitable for student credits) |

---

## 3.5 Risks & Mitigation Plan

| Risk ID | Risk | Impact | Mitigation Strategy |
|----------|------|--------|--------------------|
| DEP-R1 | Credit exhaustion | High | Azure cost alerts (50% / 80%) |
| DEP-R2 | Cold starts | Medium | Accept for MVP + temporary minReplicas=1 for demo |
| DEP-R3 | Data loss | High | Automatic backups + resource locks |
| DEP-R4 | Vendor lock-in | Medium | Dockerized backend + PostgreSQL portability |

---

## 3.6 Conclusion

Azure Container Apps offers the best cost-to-control balance under academic constraints.

---

# 4. Frontend Deployment

## 4.1 Purpose

Define how the frontend is delivered in production while enforcing the one-deployment-per-sprint constraint.

---

## 4.2 Selected Technology

**Unified Deployment: React SPA bundled inside Spring Boot**

---

## 4.3 Decision Drivers

- Single deployment per sprint
- Version consistency
- Reduced infrastructure complexity
- Simpler CI/CD

---

## 4.4 Comparative Evaluation of Technologies

| Technology | Advantages | Disadvantages |
|------------|------------|--------------|
| **Bundled SPA inside Spring Boot (Selected)** | One artifact, version consistency, simplified deployment, sprint compliance | Larger artifact size |
| Independent Frontend Hosting (Vercel/Netlify) | CDN performance, independent releases | Risk of version desync, multiple deployments per sprint |
| Separate Nginx Static Server | Clear separation, high performance | Extra infrastructure complexity |

---

## 4.5 Risks & Mitigation Plan

| Risk ID | Risk | Impact | Mitigation Strategy |
|----------|------|--------|--------------------|
| FD-R1 | SPA routing 404 | Medium | Forward non-API routes to index.html |
| FD-R2 | Browser caching outdated files | Medium | Hashed filenames + cache headers |
| FD-R3 | Larger pipeline time | Low | Cache dependencies |
| FD-R4 | Oversized artifact | Low | Minification + remove unused dependencies |
| FD-R5 | Multiple deployments per sprint | High | Protected main + release-only deployments |

---

## 4.6 Conclusion

Bundled deployment ensures strict sprint compliance and operational simplicity.

---

# 5. Team & Software Management

## 5.1 Purpose

Define project management tooling for coordinating 18 team members effectively.

---

## 5.2 Selected Technology

**ZenHub (GitHub-integrated agile management)**

---

## 5.3 Decision Drivers

- Team size (18 members)
- Need for velocity and burndown tracking
- GitHub-native traceability
- Lower complexity than Jira

---

## 5.4 Comparative Evaluation of Technologies

| Technology | Advantages | Disadvantages |
|------------|------------|--------------|
| **ZenHub (Selected)** | Native GitHub integration, sprint metrics, roadmap, velocity tracking | Learning curve |
| GitHub Projects | Simple, native integration | Limited agile metrics |
| Jira | Enterprise-grade agile tooling, powerful reporting | High complexity, separate ecosystem |

---

## 5.5 Risks & Mitigation Plan

| Risk ID | Risk | Impact | Mitigation Strategy |
|----------|------|--------|--------------------|
| PM-R1 | Learning curve | Medium | Onboarding session |
| PM-R2 | Underuse of metrics | Medium | Assign Scrum responsible |
| PM-R3 | Process overhead | Low | Keep workflows simple |
| PM-R4 | Tool dependency | Low | Core data remains in GitHub |

---

## 5.6 Conclusion

ZenHub provides the best balance between scalability, agile structure, and GitHub-native integration.

---
