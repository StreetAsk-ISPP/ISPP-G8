# Time and Cost Estimation Report by Issues

Date: 24/02/2026  
Project: ISPP-G8  
Economic assumptions:
- Full-Stack Developer: **€12.50/h**
- Project Manager: **€14.80/h**
- PMs considered: **4 PMs (combined hours)**

## Capacity Context and Adjustment Criteria

- Total team: **20 people**
- Committed dedication: **10 h/week per person**
- Elapsed time: **3 weeks**
- Theoretical total capacity: **600 h**

Given that there are coordination/monitoring/support tasks not reflected as issues, the direct load per issue is reduced and a cross-cutting budget is added (meetings, management, QA and rework) to bring the consolidated estimate to **~500 h total**.

## Estimation by Issue

| Issue ID/Name | Dev Hours Estimate | Dev Cost (€) | PM Hours Estimate (4 combined) | PM Cost (€) | Total Issue Cost (€) |
|---|---:|---:|---:|---:|---:|
| 1. [DOCS]: Study new functionalities to add to the app to upgrade the premium plan | 14 | 175,00 | 8 | 118,40 | 293,40 |
| 2. [DOCS]: RACI Matrix | 8 | 100,00 | 5 | 74,00 | 174,00 |
| 3. [DOCS]: Fix presentation (#67) | 6 | 75,00 | 4 | 59,20 | 134,20 |
| 4. docs: Update changelog presentation 19/02 | 4 | 50,00 | 3 | 44,40 | 94,40 |
| 5. [DOCS]: unify visual style and slide appearance | 10 | 125,00 | 6 | 88,80 | 213,80 |
| 6. [DOCS]: design Minimum Viable Product (MVP) slides | 8 | 100,00 | 5 | 74,00 | 174,00 |
| 7. [DOCS]: design core functionalities slides | 8 | 100,00 | 5 | 74,00 | 174,00 |
| 8. [DOCS]: Definir Stack Tecnológico para el Frontend | 9 | 112,50 | 5 | 74,00 | 186,50 |
| 9. [DOCS]: Change Git workflow of the presentation | 5 | 62,50 | 3 | 44,40 | 106,90 |
| 10. Feature/ci | 20 | 250,00 | 12 | 177,60 | 427,60 |
| 11. docs: update presentation changelog | 4 | 50,00 | 3 | 44,40 | 94,40 |
| 12. docs: Add pricing | 7 | 87,50 | 4 | 59,20 | 146,70 |
| 13. [DOCS]: Tools slide | 5 | 62,50 | 3 | 44,40 | 106,90 |
| 14. [DOCS]: create SWOT analysis slide - Internal Factors | 5 | 62,50 | 3 | 44,40 | 106,90 |
| 15. [DOCS]: create SWOT analysis slide - External Factors | 5 | 62,50 | 3 | 44,40 | 106,90 |
| 16. docs: add commitment agreement | 4 | 50,00 | 3 | 44,40 | 94,40 |
| 17. docs: dp deliverable | 7 | 87,50 | 4 | 59,20 | 146,70 |
| 18. docs: update changelog 17/02 | 4 | 50,00 | 3 | 44,40 | 94,40 |

## Cross-cutting Hours Not Tracked in Issues (Added to Budget)

| Cross-cutting Concept | Dev Hours | Dev Cost (€) | PM Hours (4 combined) | PM Cost (€) | Total Cost (€) |
|---|---:|---:|---:|---:|---:|
| Follow-up and synchronization meetings | 80 | 1,000.00 | 40 | 592.00 | 1,592.00 |
| Planning (sprint planning, refinement, inter-team coordination) | 30 | 375.00 | 40 | 592.00 | 967.00 |
| Functional QA, cross-reviews, blockers and rework | 67 | 837.50 | 28 | 414.40 | 1,251.90 |
| **Total cross-cutting hours/cost** | **177** | **2,212.50** | **108** | **1,598.40** | **3,810.90** |

## Financial Summary

- **Dev hours in issues:** 133 h
- **Dev cost in issues:** €1,662.50
- **PM hours in issues (4 combined):** 82 h
- **PM cost in issues:** €1,213.60
- **Total hours in issues block:** 215 h
- **Total cost of issues block:** €2,876.10

- **Added cross-cutting Dev hours:** 177 h
- **Cross-cutting Dev cost:** €2,212.50
- **Added cross-cutting PM hours (4 combined):** 108 h
- **Cross-cutting PM cost:** €1,598.40
- **Added cross-cutting hours:** 285 h
- **Added cross-cutting cost:** €3,810.90

- **Total Dev hours (issues + cross-cutting): 310 h**
- **Total Dev cost (issues + cross-cutting): €3,875.00**
- **Total PM hours (issues + cross-cutting): 190 h**
- **Total PM cost (issues + cross-cutting): €2,812.00**
- **Total consolidated estimated hours: 500 h**
- **Total consolidated estimated cost: €6,687.00**

## Brief Critical Analysis

- The load per issue is reduced to **215 h** to better reflect the documentary nature of most of the backlog.
- An explicit buffer of **285 cross-cutting hours** (meetings, management, QA and rework) is added to represent real work not tracked in issues.
- This brings the budget to **500 total hours**, consistent with the 3-week effort and avoiding artificially inflating each individual issue.
- The PM weight (190 h) remains high; it can be partially justified by coordinating 20 people, but it should be monitored to avoid penalizing the efficiency of technical cost.

---
---

# Complete Project Estimation — ISPP-G8 (StreetAsk)

## 1. General Assumptions

| Parameter | Value |
|---|---|
| Total team | **20 people** |
| Project Managers (PM) | **4** at €14.80/h |
| Full-Stack Developers | **16** at €12.50/h |
| Individual dedication | **10 h/week** |
| Total project duration | **11 weeks** (4 sprints) |

### Sprint Schedule

| Sprint | Period | Weeks | Main Objective |
|--------|---------|--------:|---|
| Sprint 0 | ~Feb 5 – Feb 20 | 3 | Foundations, documentation, tech stack and presentations |
| Sprint 1 | Feb 21 – Mar 5 | 2 | Core Q&A Loop — Registration, login, map, questions and answers |
| Sprint 2 | Mar 6 – Mar 26 | 3 | Social Interaction — Profiles, ratings, notifications |
| Sprint 3 | Mar 27 – Apr 16 | 3 | Events, Business Accounts, Gamification and Admin |

---

## 2. Team Weekly Capacity

| Role | People | Hours/week/person | Total h/week | Cost/week (€) |
|---|---:|---:|---:|---:|
| Full-Stack Developer | 16 | 10 | 160 | 2,000.00 |
| Project Manager | 4 | 10 | 40 | 592.00 |
| **Team total** | **20** | — | **200** | **2,592.00** |

**Project weekly cost: €2,592.00**

---

## 3. Estimation by Sprint

---

### Sprint 0 — Foundations & Documentation (3 weeks)

**Theoretical capacity:** 600 h (480 h Dev + 120 h PM) → **€7,776.00**

> **Note:** The actual tracking of Sprint 0 (documented in the previous section) recorded **500 h** with a cost of **€6,687.00**. The difference of 100 h / €1,089 represents slack not tracked to specific issues. For this global estimation, the theoretical committed capacity is used.

**Main deliverables:**
- Entity and data model definition
- Tech stack (frontend/backend)
- Business plan, pricing and monetization strategy
- Mockups and user stories
- User acquisition plan
- CI/CD configuration
- Course presentations and documentation

| Concept | Dev H. | € Dev | PM H. | € PM | € Total |
|---|---:|---:|---:|---:|---:|
| Direct development (issues and documentation) | 310 | 3,875.00 | 82 | 1,213.60 | 5,088.60 |
| Cross-cutting work (meetings, planning, QA) | 170 | 2,125.00 | 38 | 562.40 | 2,687.40 |
| **Total Sprint 0** | **480** | **6,000.00** | **120** | **1,776.00** | **7,776.00** |

---

### Sprint 1 — Core Q&A Loop (2 weeks: Feb 21 – Mar 5)

**Capacity:** 400 h (320 h Dev + 80 h PM) → **€5,184.00**

**Objective:** Allow a registered user to view the map, post geolocated questions with topic and radius, and answer questions from other users. All users must register to interact.

#### Direct development by functionality

| Task / User Story | Dev H. | € Dev | PM H. | € PM | € Total |
|---|---:|---:|---:|---:|---:|
| API Contract (OpenAPI) + Data Model | 25 | 312.50 | 4 | 59.20 | 371.70 |
| Authentication System (JWT) | 38 | 475.00 | 5 | 74.00 | 549.00 |
| Environment and Deployment (PostGIS, Cloud) | 32 | 400.00 | 5 | 74.00 | 474.00 |
| US-01: User registration | 18 | 225.00 | 3 | 44.40 | 269.40 |
| US-03: User login | 15 | 187.50 | 2 | 29.60 | 217.10 |
| US-11: Map with active questions (red dots) | 40 | 500.00 | 5 | 74.00 | 574.00 |
| US-08: Create geolocated question (radius, topic, text) | 24 | 300.00 | 3 | 44.40 | 344.40 |
| US-13: View answer threads (mini-forum) | 20 | 250.00 | 3 | 44.40 | 294.40 |
| US-09: Answer questions (location validation) | 20 | 250.00 | 3 | 44.40 | 294.40 |
| US-XX: Automatic question expiration (2 h free) | 10 | 125.00 | 2 | 29.60 | 154.60 |
| **Direct subtotal** | **242** | **3,025.00** | **35** | **518.00** | **3,543.00** |

#### Cross-cutting work

| Concept | Dev H. | € Dev | PM H. | € PM | € Total |
|---|---:|---:|---:|---:|---:|
| Sprint Planning and Refinement | 10 | 125.00 | 12 | 177.60 | 302.60 |
| Dailies and synchronization | 28 | 350.00 | 16 | 236.80 | 586.80 |
| QA, cross-reviews and rework | 25 | 312.50 | 10 | 148.00 | 460.50 |
| Technical documentation | 15 | 187.50 | 7 | 103.60 | 291.10 |
| **Cross-cutting subtotal** | **78** | **975.00** | **45** | **666.00** | **1,641.00** |

#### Sprint 1 Summary

| | Hours | Cost (€) |
|---|---:|---:|
| Developers | 320 | 4,000.00 |
| Project Managers | 80 | 1,184.00 |
| **Total Sprint 1** | **400** | **5,184.00** |

---

### Sprint 2 — Social Interaction & Quality Control (3 weeks: Mar 6 – Mar 26)

**Capacity:** 600 h (480 h Dev + 120 h PM) → **€7,776.00**

**Objective:** Enrich the Q&A system with quality control (ratings), user profiles and push notifications.

#### Direct development by functionality

| Task / User Story | Dev H. | € Dev | PM H. | € PM | € Total |
|---|---:|---:|---:|---:|---:|
| Rating System Backend (Like/Dislike engine) | 45 | 562.50 | 6 | 88.80 | 651.30 |
| User Profile Backend (statistics, history) | 40 | 500.00 | 5 | 74.00 | 574.00 |
| Notification Service (push, backend triggers) | 55 | 687.50 | 7 | 103.60 | 791.10 |
| US-06: User profile (view, statistics, activity) | 40 | 500.00 | 5 | 74.00 | 574.00 |
| US-10: Ratings (Like/Dislike frontend + reputation calculation) | 35 | 437.50 | 5 | 74.00 | 511.50 |
| US-12: Notifications (nearby questions, own answers) | 40 | 500.00 | 5 | 74.00 | 574.00 |
| US-04: Edit profile | 25 | 312.50 | 4 | 59.20 | 371.70 |
| Improvements and bug-fixes from Sprint 1 | 35 | 437.50 | 5 | 74.00 | 511.50 |
| **Direct subtotal** | **315** | **3,937.50** | **42** | **621.60** | **4,559.10** |

#### Cross-cutting work

| Concept | Dev H. | € Dev | PM H. | € PM | € Total |
|---|---:|---:|---:|---:|---:|
| Sprint Planning and Refinement | 18 | 225.00 | 18 | 266.40 | 491.40 |
| Dailies and synchronization | 42 | 525.00 | 24 | 355.20 | 880.20 |
| QA, cross-reviews and rework | 55 | 687.50 | 20 | 296.00 | 983.50 |
| Technical documentation | 50 | 625.00 | 16 | 236.80 | 861.80 |
| **Cross-cutting subtotal** | **165** | **2,062.50** | **78** | **1,154.40** | **3,216.90** |

#### Sprint 2 Summary

| | Hours | Cost (€) |
|---|---:|---:|
| Developers | 480 | 6,000.00 |
| Project Managers | 120 | 1,776.00 |
| **Total Sprint 2** | **600** | **7,776.00** |

---

### Sprint 3 — Events, Business Accounts & Gamification (3 weeks: Mar 27 – Apr 16)

**Capacity:** 600 h (480 h Dev + 120 h PM) → **€7,776.00**

**Objective:** Enable event visualization and management, business accounts (B2B), coin-based gamification system and administration panel.

#### Direct development by functionality

| Task / User Story | Dev H. | € Dev | PM H. | € PM | € Total |
|---|---:|---:|---:|---:|---:|
| Event Data Model (DB structure) | 20 | 250.00 | 3 | 44.40 | 294.40 |
| Roles and Permissions (User vs Business) | 25 | 312.50 | 4 | 59.20 | 371.70 |
| Gamification Engine (coin logic) | 30 | 375.00 | 4 | 59.20 | 434.20 |
| Admin Panel Backend (metrics, approval) | 25 | 312.50 | 4 | 59.20 | 371.70 |
| US-15: Event map (visual icons) | 25 | 312.50 | 3 | 44.40 | 356.90 |
| US-16: Event details (time, location, attendees) | 18 | 225.00 | 3 | 44.40 | 269.40 |
| US-17: Map toggle (show/hide questions) | 12 | 150.00 | 2 | 29.60 | 179.60 |
| US-27: Mark/unmark event attendance | 15 | 187.50 | 2 | 29.60 | 217.10 |
| US-28: Business registration (verification with Tax ID) | 22 | 275.00 | 4 | 59.20 | 334.20 |
| US-48: Payment screen (Business fee) | 18 | 225.00 | 3 | 44.40 | 269.40 |
| US-29/30/31/32: Event CRUD (Business only) | 35 | 437.50 | 5 | 74.00 | 511.50 |
| US-35: Earn coins for answering | 15 | 187.50 | 2 | 29.60 | 217.10 |
| US-23: View coin balance | 10 | 125.00 | 2 | 29.60 | 154.60 |
| US-02: Plan selection (Free/Premium UI) | 15 | 187.50 | 3 | 44.40 | 231.90 |
| US-37: Administration panel (basic metrics) | 20 | 250.00 | 3 | 44.40 | 294.40 |
| US-39: Verify/approve business requests | 12 | 150.00 | 2 | 29.60 | 179.60 |
| Improvements and bug-fixes from previous sprints | 20 | 250.00 | 3 | 44.40 | 294.40 |
| **Direct subtotal** | **317** | **3,962.50** | **52** | **769.60** | **4,732.10** |

#### Cross-cutting work

| Concept | Dev H. | € Dev | PM H. | € PM | € Total |
|---|---:|---:|---:|---:|---:|
| Sprint Planning and Refinement | 18 | 225.00 | 16 | 236.80 | 461.80 |
| Dailies and synchronization | 42 | 525.00 | 22 | 325.60 | 850.60 |
| QA, cross-reviews and rework | 55 | 687.50 | 16 | 236.80 | 924.30 |
| Documentation and final delivery preparation | 48 | 600.00 | 14 | 207.20 | 807.20 |
| **Cross-cutting subtotal** | **163** | **2,037.50** | **68** | **1,006.40** | **3,043.90** |

#### Sprint 3 Summary

| | Hours | Cost (€) |
|---|---:|---:|
| Developers | 480 | 6,000.00 |
| Project Managers | 120 | 1,776.00 |
| **Total Sprint 3** | **600** | **7,776.00** |

---

## 4. Global Project Financial Summary

### Cost by sprint

| Sprint | Weeks | Dev H. | € Dev | PM H. | € PM | Total H. | € Total |
|---|---:|---:|---:|---:|---:|---:|---:|
| Sprint 0 — Foundations | 3 | 480 | 6,000.00 | 120 | 1,776.00 | 600 | 7,776.00 |
| Sprint 1 — Core Q&A | 2 | 320 | 4,000.00 | 80 | 1,184.00 | 400 | 5,184.00 |
| Sprint 2 — Social | 3 | 480 | 6,000.00 | 120 | 1,776.00 | 600 | 7,776.00 |
| Sprint 3 — Events & Business | 3 | 480 | 6,000.00 | 120 | 1,776.00 | 600 | 7,776.00 |
| **PROJECT TOTAL** | **11** | **1,760** | **22,000.00** | **440** | **6,512.00** | **2,200** | **28,512.00** |

### Cost distribution

| Concept | Hours | Cost (€) | % of total |
|---|---:|---:|---:|
| Full-Stack Development (16 people) | 1,760 | 22,000.00 | 77.2% |
| Project Management (4 people) | 440 | 6,512.00 | 22.8% |
| **Total** | **2,200** | **28,512.00** | **100%** |

### Cost per person (project average)

| Role | Total hours/person | Total cost/person (€) |
|---|---:|---:|
| Full-Stack Developer | 110 | 1,375.00 |
| Project Manager | 110 | 1,628.00 |

### Key indicators

| Indicator | Value |
|---|---|
| Total project duration | 11 weeks |
| Total committed hours | 2,200 h |
| Total estimated cost | **€28,512.00** |
| Average cost per week | €2,592.00/week |
| Average cost per hour (weighted) | €12.96/h |
| Number of User Stories delivered (MVP) | ~25 US |
| Average cost per User Story | ~€1,140.48 |

---

## 5. Economic Viability Analysis

### Projected cost-revenue ratio

According to the monetization model defined in the project *Pricing*:

| User scale | Estimated monthly revenue (€) | Months to cover investment |
|---|---:|---:|
| 100 users (pilot) | 108.39 | ~263 months |
| 1,000 users | ~660.00 | ~43 months |
| 10,000 users | ~6,600.00 | ~4.3 months |
| 50,000 users | ~33,000.00 | < 1 month |

### Observations

- **Total project investment (€28,512)** is contained for an 11-week MVP with a team of 20 people, which reflects a Lean structure consistent with the defined strategy.
- The **PM/Dev ratio (22.8% / 77.2%)** is reasonable for a team of this size. Coordinating 20 people justifies 4 PMs.
- The monetization model reaches **break-even from ~4,300 monthly active users** (assuming the pricing conversion ratios: 4.2% premium + ~2% business).
- The densest sprint in functionalities is **Sprint 3** (17 direct tasks/US), but it has 3 full weeks and the team will have already matured in velocity.
- It is recommended to reserve a **contingency margin of 10-15%** on the total budget to cover technical unforeseen events or delays, placing the **budget with contingency between €31,363 and €32,789**.


