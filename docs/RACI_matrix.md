# RACI Matrix Proposal - StreetAsk (Sprint 1)

This matrix defines the roles and responsibilities for **Sprint 1** and general project management, based on `WORK_PLAN.md`, `Comunication_Plan.md`, and `CONTRIBUTING.md`.

### 0. Structure and Role Assignment Justification

To ensure operational efficiency in a large team (20 people), we have segmented the matrix into **4 functional blocks**, avoiding information saturation and clarifying the focus of each sub-team. The assignment decisions respond to the following criteria agreed upon in our internal documentation:

- **Management & Planning:** We separate the strategic authority of the **Project Leader (A)** from the operational management of the **Area Managers (R)**, who supervise daily task assignment as stipulated in the _Communication Plan_.
- **Technical Development:** **Accountability (A)** for code lies exclusively with the authorized _Reviewers_ (Javi, Miguel, Santia, Guillermo) to protect the stability of the `trunk` branch, strictly complying with the workflow rules of `CONTRIBUTING.md`.
- **Quality & Design:** The **QA** team acts as an auditor (_Consulted/Responsible_) to validate compliance with the _Definition of Done_ (tests and functionality) before any merge, while the Design team requires technical approval (_A_) from Managers to ensure mockup feasibility.
- **Documentation:** Direct owners are assigned to key deliverables (presentations and legal documentation) to centralize consistency and avoid the dilution of responsibility in non-technical tasks.

### 1. Role Definitions (Stakeholders)

- **Project Leader (PL):** General coordination, blocker resolution, and final decision-making.
- **Area Managers / Reviewers (AM):** Javi, Miguel, Santia, and Guillermo. Responsible for approving PRs, supervising areas, and managing deadlines.
- **Developers (Devs):** Responsible for technical implementation (Frontend/Backend).
- **Design Team:** Responsible for user experience and mockups (Canva/Figma).
- **QA Team:** Responsible for ensuring compliance with the _Definition of Done_.
- **Doc/Business Team:** Responsible for the Business Plan and legal documentation.

---

### 2. RACI Matrix

**Legend:**

- **R (Responsible):** Who executes the task.
- **A (Accountable):** Who approves and has final authority (Only one per task).
- **C (Consulted):** Expert consulted before deciding (two-way communication).
- **I (Informed):** Informed after task completion (one-way communication).

#### A. Management and Planning

| Task / Deliverable                | Project Leader | Area Managers | Devs | Design | QA  | Doc/Biz |
| :-------------------------------- | :------------: | :-----------: | :--: | :----: | :-: | :-----: |
| **Sprint 1 Roadmap Definition**   |     **A**      |       R       |  C   |   I    |  I  |    C    |
| **Task Assignment (Issues)**      |       A        |     **R**     |  I   |   I    |  I  |    I    |
| **Communication with Professors** |    **R/A**     |       C       |  I   |   I    |  I  |    I    |
| **Business Plan Update**          |       I        |       C       |  I   |   I    |  I  | **R/A** |

#### B. Technical Development (Sprint 1 - Core)

_Based on priorities A and B of the Work Plan_

| Task / Deliverable            | Project Leader | Reviewers (AM) | Backend Dev | Frontend Dev | QA Team |
| :---------------------------- | :------------: | :------------: | :---------: | :----------: | :-----: |
| **API Contract Definition**   |       I        |     **A**      |    **R**    |      C       |    C    |
| **Cloud Env Config (Deploy)** |       I        |     **A**      |    **R**    |      C       |    I    |
| **Auth System (JWT/Login)**   |       I        |       A        |    **R**    |    **R**     |    C    |
| **Map & Red Dots (US-11)**    |       I        |       A        |      C      |    **R**     |    C    |
| **Create Question (US-08)**   |       I        |       A        |    **R**    |    **R**     |    C    |
| **Code Review (PRs)**         |       I        |    **R/A**     |      I      |      I       |    C    |
| **Merge to `trunk`**          |       I        |     **A**      |      I      |      I       |    I    |

#### C. Quality and Design

| Task / Deliverable                    | Project Leader | Area Managers | Devs  | Design Team | QA Team |
| :------------------------------------ | :------------: | :-----------: | :---: | :---------: | :-----: |
| **Mockups & Final UI**                |       C        |       A       |   C   |    **R**    |    I    |
| **Unit Tests**                        |       I        |       I       | **R** |      I      |    C    |
| **Functional Tests**                  |       I        |       A       |   C   |      I      |  **R**  |
| **"Definition of Done" Verification** |       I        |       A       |   R   |      I      |  **C**  |

#### D. Documentation and Presentation

| Task / Deliverable       | Project Leader | Presenters | Doc Team | Rest of Team |
| :----------------------- | :------------: | :--------: | :------: | :----------: |
| **Sprint Review Slides** |       C        |   **R**    |    C     |      I       |
| **Presentation Script**  |     **A**      |   **R**    |    C     |      I       |
| **Wiki/Docs Update**     |       I        |     I      |  **R**   |      I       |
| **Meeting Minutes**      |       I        |     I      | **R/A**  |      I       |
