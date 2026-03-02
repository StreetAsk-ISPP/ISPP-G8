# StreetAsk — Technology Stack & Management (Standardized Decision Document)

This document defines the official technological and organizational decisions for the StreetAsk project.  
All sections follow the exact same structure to ensure consistency, transparency, and comparability.

---

# Table of Contents

1. [Backend Development](#1-backend-development)  
2. [Frontend Development](#2-frontend-development)  
3. [Backend & Database Deployment](#3-backend--database-deployment)  
4. [Frontend Deployment](#4-frontend-deployment)  
5. [Team, Control & Testing Management](#5-team-control--testing-management)  

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
- Authentication: JWT
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
| BE-R6 | Low test coverage | High | CI enforcement + required unit tests with JUnit 5 + Mockito |

---

## 1.6 Conclusion

Java + Spring Boot provides the strongest balance between robustness, team efficiency, scalability, and risk reduction.

---

# 2. Frontend Development

## 2.1 Purpose

Define the mobile client architecture responsible for the user interface and integration with backend APIs.

---

## 2.2 Selected Technology

**React Native + JavaScript + Expo**

Supporting tools:
- Expo SDK
- Expo EAS (build and release)
- React Navigation

---

## 2.3 Decision Drivers

- Team familiarity with React ecosystem
- Fast MVP delivery for mobile platforms
- One shared codebase for Android/iOS
- Easy API integration with Spring Boot backend
- Managed workflow simplicity through Expo

---

## 2.4 Comparative Evaluation of Technologies

| Technology | Advantages | Disadvantages |
|------------|------------|--------------|
| **React Native + JavaScript + Expo (Selected)** | Fast cross-platform development, large ecosystem, reusable React knowledge, rapid testing on real devices, simplified setup with Expo | No static typing by default, dependency compatibility checks required |
| Flutter | Strong performance and consistent UI | Higher team learning curve, different ecosystem from React |
| Native Android/iOS (Kotlin/Swift) | Maximum native control and performance | Duplicated effort, slower MVP delivery for small team budgets |
| React Native + TypeScript | Better type safety and maintainability | Additional setup and onboarding overhead |

---

## 2.5 Risks & Mitigation Plan

| Risk ID | Risk | Impact | Mitigation Strategy |
|----------|------|--------|--------------------|
| FE-R1 | Runtime errors (no typing) | Medium | ESLint rules, shared component patterns, and focused smoke tests |
| FE-R2 | Device fragmentation (Android/iOS versions) | High | Test matrix on representative devices and versions each sprint |
| FE-R3 | Expo/native dependency incompatibilities | Medium | Lock dependencies and validate upgrades in a staging branch |
| FE-R4 | Mobile performance issues (rendering/startup) | Medium | Use profiling, optimize re-renders, and lazy-load heavy screens |
| FE-R5 | Build/release inconsistencies | Medium | Standardized EAS profiles and release checklist in CI |

---

## 2.6 Conclusion

React Native + JavaScript + Expo maximizes development speed and delivery consistency for a mobile-first MVP.

---

# 3. Backend & Database Deployment

## 3.1 Purpose

Define cloud infrastructure and CI/CD automation strategy under student credit constraints.

---

## 3.2 Selected Technology

- **Cloud Provider:** Microsoft Azure  
- **Backend Hosting:** Azure Container Apps  
- **Registry:** Azure Container Registry  
- **Database:** MySQL (Azure Database for MySQL Flexible Server)  
- **CI/CD:** GitHub Actions  
- **Database Migrations:** Flyway  
- **Historical early-stage hosting (before Azure consolidation):** Render  

---

## 3.3 Decision Drivers

- $100 Azure Student credits
- Cost efficiency and managed services
- Container portability for backend services
- MySQL familiarity and compatibility with project setup
- Automated CI/CD through GitHub-native workflows

---

## 3.4 Comparative Evaluation of Technologies

| Technology | Advantages | Disadvantages |
|------------|------------|--------------|
| **Azure Container Apps + Azure MySQL (Selected)** | Scale-to-zero capable backend, container-native operations, managed MySQL reliability, strong integration with GitHub Actions | Cold starts may occur under low traffic |
| Azure App Service + Azure MySQL | Simple PaaS deployment model | Less container flexibility and potentially higher scaling costs |
| Render + Managed MySQL | Quick setup for early-stage demos | Lower alignment with final Azure-based target architecture |

---

## 3.5 Risks & Mitigation Plan

| Risk ID | Risk | Impact | Mitigation Strategy |
|----------|------|--------|--------------------|
| DEP-R1 | Credit exhaustion | High | Azure cost alerts (50% / 80%) + monthly budget review |
| DEP-R2 | Cold starts in Azure Container Apps | Medium | Keep default scale-to-zero for cost, use temporary minReplicas=1 for demos |
| DEP-R3 | Data loss or schema drift | High | Automated backups, Flyway migrations, and protected production database access |
| DEP-R4 | Vendor lock-in | Medium | Dockerized backend + MySQL portability + IaC-ready configuration |
| DEP-R5 | CI/CD instability | Medium | Protected main branch, required checks, and rollback-ready deployment tags |

---

## 3.6 Conclusion

Azure Container Apps + MySQL offers the best balance between cost, portability, and operational control for the project context.

---

# 4. Frontend Deployment

## 4.1 Purpose

Define how the mobile frontend is distributed and versioned in production while keeping backend and app releases coordinated per sprint.

---

## 4.2 Selected Technology

**Expo-based mobile deployment (EAS Build/Release) coordinated with backend deployments in Azure**

---

## 4.3 Decision Drivers

- Mobile-first product delivery (React Native)
- Consistent release workflow for Android/iOS builds
- Controlled release cadence aligned with sprint goals
- Reduced operational overhead via Expo managed workflow

---

## 4.4 Comparative Evaluation of Technologies

| Technology | Advantages | Disadvantages |
|------------|------------|--------------|
| **Expo EAS coordinated with Azure backend (Selected)** | Fast mobile build pipeline, simplified signing/build management, clear release process, easy integration with GitHub Actions | Requires strict profile/environment management |
| Bare React Native pipeline | Full native control | Higher complexity and maintenance cost |
| Independent ad-hoc manual builds | Low initial setup | High risk of inconsistencies and poor traceability |

---

## 4.5 Risks & Mitigation Plan

| Risk ID | Risk | Impact | Mitigation Strategy |
|----------|------|--------|--------------------|
| FD-R1 | Frontend/backend version mismatch | High | Release checklist with API compatibility verification before publishing |
| FD-R2 | Environment misconfiguration in mobile builds | Medium | Centralized environment variables and protected secrets |
| FD-R3 | Regression in production devices | Medium | Pre-release smoke tests on representative Android/iOS devices |
| FD-R4 | Slower release pipeline near deadlines | Medium | Build caching and release cut-off policy before sprint closure |

---

## 4.6 Conclusion

Expo-based deployment gives the team a practical, consistent, and scalable process for mobile releases aligned with backend evolution.

---

# 5. Team, Control & Testing Management

## 5.1 Purpose

Define project management, delivery control, and core testing tooling for coordinating the team effectively.

---

## 5.2 Selected Technology

**GitHub Projects + GitHub Flow + JUnit 5 + Mockito**

Tooling scope:
- **Control & planning:** GitHub Projects
- **Repository workflow:** Pull requests, branch protection, mandatory reviews
- **Testing baseline:** JUnit 5 + Mockito for backend unit and service-level tests

---

## 5.3 Decision Drivers

- Team coordination needs in a single GitHub-native ecosystem
- Low process friction for student team dynamics
- Strong traceability between issues, PRs, and releases
- Reliable Java testing stack already aligned with backend architecture

---

## 5.4 Comparative Evaluation of Technologies

| Technology | Advantages | Disadvantages |
|------------|------------|--------------|
| **GitHub Projects (Selected)** | Native GitHub integration, simple board workflow, direct link with issues/PRs, low overhead | Fewer advanced agile metrics than specialized tools |
| ZenHub | Advanced agile reporting and planning layers | Extra complexity and learning overhead |
| Jira | Enterprise-grade reporting and configuration | High operational overhead for current team size |

---

## 5.5 Risks & Mitigation Plan

| Risk ID | Risk | Impact | Mitigation Strategy |
|----------|------|--------|--------------------|
| PM-R1 | Inconsistent board usage | Medium | Define DoR/DoD and mandatory status updates per PR |
| PM-R2 | Weak traceability between tasks and code | Medium | Enforce issue-linked branches and PR templates |
| PM-R3 | Underuse of test suite | High | CI gates requiring test execution in pull requests |
| PM-R4 | Process overhead growth | Low | Keep workflows simple and review ceremonies monthly |

---

## 5.6 Conclusion

GitHub Projects, together with JUnit 5 and Mockito, provides a balanced framework for planning, control, and quality assurance with minimal overhead.

---
