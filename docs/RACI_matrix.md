# RACI Matrix Proposal - StreetAsk (Sprint 1) - Horizontal Structure

This document defines the roles and responsibilities for **Sprint 1** and project management, adapted to the content of `WORK_PLAN.md` and `CONTRIBUTING.md`, taking into account our horizontal and distributed organizational structure.

### 0. Structure and Role Assignment Justification

To maximize the agility and autonomy of our 20-person team, we have structured the organization into **4 Multidisciplinary Working Groups**. With this structure, we aim to eliminate functional silos.

We distribute responsibility as follows:

- **Horizontal Governance (No Single Leader):** We do not have the figure of a "Project Leader". Strategic decision-making is **consensus-based**. Each group has a **Coordinator**; decisions affecting the entire project are made in the **Coordinators' Committee**, where each coordinator conveys their group's stance, and decisions are made in a shared manner.
- **Multidisciplinary Groups:** The team is divided into 4 operational groups. Each group is autonomous and internally possesses all necessary capabilities (Backend, Frontend, QA, Design, Doc) to complete their tasks from start to finish ("End-to-End"), similar to independent work cells.
- **Dynamic Assignment:** The composition of the groups and the specific task load is dynamic, adjusting to the needs of each Sprint.
- **Quality and Consistency:** Although the groups are autonomous, the technical roles (QA, Design) maintain cross-cutting standards defined in the _Definition of Done_ and the style guides.

### 1. Role Definitions (Stakeholders)

- **Coordinators (C):** (Javi, Miguel, Santia, and Guillermo). They represent each of the 4 groups. They do not impose orders, but facilitate consensus, resolve blockers between groups, and ensure global alignment. They have shared authority (**A**) over critical decisions.
- **Group Members (Functional Roles):**
  - **Developers (Devs):** Technical implementation (Fullstack/Front/Back) within each group.
  - **Design:** UX/UI responsible members integrated into the groups.
  - **QA:** Responsible for validating quality within the group flow and auditing cross-group intersections.
  - **Doc/Business:** Management of documentation and business plans.

---

### 2. RACI Matrix

**Legend:**

- **R (Responsible):** Who executes the task (within their group).
- **A (Accountable):** Who has final authority (In this model, it is the **Coordinators' Committee** by consensus or the Group itself for self-managed tasks).
- **C (Consulted):** Expert consulted (two-way communication between groups).
- **I (Informed):** Informed after task completion.

#### A. Management and Planning

_Planning is a joint exercise by the coordinators based on feedback from their groups._

| Task / Deliverable                | Coordinators (Committee) | Groups (General Team) | QA / Design / Doc (Roles) |
| :-------------------------------- | :----------------------: | :-------------------: | :-----------------------: |
| **Sprint 1 Roadmap Definition**   |  **A / R** (Consensus)   |           C           |             I             |
| **Task Assignment (Issues)**      |            A             | **R** (Self-assigned) |             I             |
| **Communication with Professors** |  **A / R** (Rotational)  |           I           |             I             |
| **Business Plan Update**          |            A             |           C           |   **R** (Doc/Biz Role)    |

#### B. Technical Development (Sprint 1 - Core)

_Tasks are distributed among the 4 groups. The "Devs" column refers to the developers within the group assigned to that task._

_Objective: Functional Q&A loop with mandatory registration._

| Task / Deliverable                      | Coordinators | Dev Backend (In Group) | Dev Frontend (In Group) | QA (Transversal/Group) |
| :-------------------------------------- | :----------: | :--------------------: | :---------------------: | :--------------------: |
| **API Contract Definition**             |    **A**     |         **R**          |            C            |           C            |
| **Env Config + PostGIS**                |    **A**     |         **R**          |            I            |           I            |
| **Registration (US-01) & Auth (US-03)** |      A       |         **R**          |          **R**          |           C            |
| **Map & Red Dots (US-11)**              |      A       |           C            |          **R**          |           C            |
| **Create Question (US-08)**             |      A       |         **R**          |          **R**          |           C            |
| **Answer Questions (US-09)**            |      A       |         **R**          |          **R**          |           C            |
| **View Threads (US-13)**                |      A       |           C            |          **R**          |           C            |
| **Auto-Expiration Logic (US-XX)**       |      I       |         **R**          |            I            |           C            |
| **Code Review (PRs)**                   |    **A**     |         **R**          |          **R**          |           C            |
| **Merge to `trunk`**                    |    **A**     |           I            |            I            |           I            |

#### C. Quality and Consolidated Design

_QA and Design act as quality guarantors integrated into the groups, but with unified criteria._

| Task / Deliverable                    | Coordinators | Devs (Implementation) | Design (Role) |      QA (Role)      |
| :------------------------------------ | :----------: | :-------------------: | :-----------: | :-----------------: |
| **Mockups & Final UI**                |      A       |           C           |     **R**     |          I          |
| **Unit Tests**                        |      I       |         **R**         |       I       |          C          |
| **Functional Tests**                  |      A       |           C           |       I       |        **R**        |
| **"Definition of Done" Verification** |    **A**     |           R           |       I       | **C / R** (Auditor) |

#### D. Documentation and Presentation

| Task / Deliverable       | Coordinators | Presenters | Doc/Biz Role | Rest of Team |
| :----------------------- | :----------: | :--------: | :----------: | :----------: |
| **Sprint Review Slides** |      A       |   **R**    |      C       |      I       |
| **Presentation Script**  |    **A**     |   **R**    |      C       |      I       |
| **Docs Update**          |      I       |     I      |    **R**     |      I       |
| **Meeting Minutes**      |      I       |     I      |    **R**     |      I       |
