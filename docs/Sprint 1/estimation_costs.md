# Time and Cost Estimation Report — ISPP-G8 StreetAsk

**Date:** 02/03/2026 | **Project:** ISPP-G8 | **Duration:** 11 weeks  
**Team:** 20 people (16 Dev @€12.50/h + 4 PM @€14.80/h)

---

## � HOURLY RATE METHODOLOGY

**Rates applied:**
- **Developers:** €12.50/h (full TCE included)
- **Project Managers:** €14.80/h (full TCE included)

**Source & Justification:**
These rates are based on **junior/academic profile benchmarks** in the Spanish market for university-led software projects (ISPP program context). They include:
- Gross salary equivalents for entry-level positions (€1,200-€1,500/month)
- Employer social contributions (~35%)
- Equipment and indirect costs

**Market comparison:**
- Junior developers (Spain, 2026): €10-€15/h (academic/internship context)
- Mid-level professionals: €20-€35/h
- Senior consultants: €40-€60/h

**Reference:** Aligned with ISPP project standards and Spanish labor cost structures for educational/research initiatives.

---

## 💰 PROJECT BUDGET AT A GLANCE

### Development Costs (Sprint 0 → Sprint 3)

| Phase | Development Cost | Deployment Cost (Azure) | Subtotal |
|---|---:|---:|---:|
| **Sprint 0** (Completed) | €5,572.00 | €17.50 | €5,589.50 |
| **Sprint 1** (Completed) | €5,184.00 | €17.50 | €5,201.50 |
| **Sprint 2** (Completed) | €7,776.00 | €35.00 | €7,811.00 |
| **Sprint 3** (Estimated) | €7,776.00 | €52.50 | €7,828.50 |
| **TOTAL** | **€26,308.00** | **€122.50** | **€26,430.50** |

---

## 💻 PHYSICAL INFRASTRUCTURE & SOFTWARE COSTS

### Hardware (Development Workstations)

| Concept | Units | Unit Cost | Total Cost |
|---|---:|---:|---:|
| Development laptops | 20 | €1,000 | €20,000 |

**Assumptions:**
- Mid-range development laptop (16GB RAM, SSD)
- Suitable for Java + React Native development

👉 **Total hardware cost (CAPEX): €20,000**

### Mobile Testing Devices

| Concept | Units | Unit Cost | Total |
|---|---:|---:|---:|
| Test smartphones | 4 | €300 | €1,200 |

👉 **Total testing devices cost (CAPEX): €1,200**

---

### Software & Collaboration Tools

| Tool | Plan | Cost | Justification |
|---|---|---:|---|
| GitHub | Free | €0 | Repository, CI/CD, project management |
| Microsoft Teams | Free | €0 | Communication |
| Azure | Student credits | Included | Already accounted |
| Expo (EAS) | Free tier | €0 | Mobile deployment |
| OpenStreetMap + Leaflet | Free | €0 | Maps |

## 📋 OPENSTREETMAP & LEAFLET POLICY

✅ **Completely free for monetized apps**
- No licensing fees or revenue commissions
- No restrictions on premium subscriptions or business models
- Only requirement: Attribution ("© OpenStreetMap contributors")
- For massive scale (>1M tile requests/month): Consider self-hosting or Mapbox

👉 **Total software licensing cost: €0**

---

## 📊 TOTAL INFRASTRUCTURE COST

| Category | Cost |
|---|---:|
| Azure Infrastructure | €122.50 |
| Hardware (laptops) | €20,000.00 |
| Mobile Devices | €1,200.00 |
| Software Licenses | €0.00 |
| **TOTAL INFRASTRUCTURE COST** | **€21,322.50** |

---

## 🎯 TOTAL PROJECT COST

| Category | Cost |
|---|---:|
| Labor (Dev + PM) | €26,308.00 |
| Infrastructure | €21,322.50 |
| **🎯 TOTAL PROJECT COST** | **€47,630.50** |

---

## 📚 COST CLASSIFICATION (CAPEX vs OPEX vs TCE)

### CAPEX (Capital Expenditure)
One-time investments in assets required to start the project:

- Development laptops → €20,000  
- Mobile testing devices → €1,200  
- Initial cloud setup (Azure) → €122.50  

👉 **Total CAPEX: €21,322.50**

---

### OPEX (Operational Expenditure)
Recurring costs required to operate the project:

- Team labor → €26,308.00  
- Future cloud hosting (post-MVP scaling)  

👉 **Total OPEX (project phase): €26,308.00**

---

### TCE (Total Cost of Employment)

Included in hourly rates:

- Gross salary  
- Employer contributions (~35%)  
- Indirect costs  

- Developers → €12.50/h  
- PMs → €14.80/h  

---


## 📊 COST BREAKDOWN

| Role | Hours | Cost | % |
|---|---:|---:|---:|
| Developers | 1,560 | €19,500.00 | 40.9% |
| PMs | 460 | €6,808.00 | 14.3% |
| Infrastructure (CAPEX) | — | €21,322.50 | 44.8% |
| **TOTAL** | — | **€47,630.50** | **100%** |

---

## 🎯 SPRINT SUMMARY

### Sprint 0 — Foundations [COMPLETED ✅]
**Dates:** Feb 5–20 (3 weeks) | **Cost:** €5,589.50  
**Delivered:** Data model, tech stack, CI/CD, business plan, user stories, mockups  
**Work:** 10 Foundation User Stories + cross-cutting activities

---

### Sprint 1 — Core Q&A [COMPLETED ✅]
**Dates:** Feb 21–Mar 5 (2 weeks) | **Cost:** €5,201.50  
**Delivered:** Registration, login, map, geolocated Q&A, answer threads, authentication  
**Key US:** US-01, US-03, US-08, US-11, US-09, US-13 + infrastructure

---

### Sprint 2 — Social Interaction [COMPLETED ✅]
**Dates:** Mar 6–26 (3 weeks) | **Cost:** €7,811.00  
**Scope:** User profiles, ratings (like/dislike), push notifications  
**Key US:** US-06, US-10, US-12, US-04

**Breakdown:**
- User profile system (view stats, activity, editing) — 65h dev  
- Rating/reputation engine (like/dislike, trust scores) — 80h dev + 11h PM  
- Push notification service (triggers, scheduling, delivery) — 55h dev + 7h PM  
- Cross-cutting (planning, QA, documentation) — 165h dev + 78h PM  

**Infrastructure:** 2 Azure VMs (prod + staging)

---

### Sprint 3 — Events & Business [ESTIMATED]
**Dates:** Mar 27–Apr 16 (3 weeks) | **Est. Cost:** €7,828.50  
**Scope:** Events, business accounts, gamification, admin panel  
**Key US:** US-15/16/17 (event map), US-28 (business reg), US-29-32 (event CRUD), US-35 (coins), US-37/39 (admin)

**Breakdown:**
- Event visualization & management (map, details, toggles, attendance) — 65h dev  
- Business account system (registration, verification, Tax ID) — 22h dev + 4h PM  
- Event CRUD operations (creation, editing, deletion) — 35h dev + 5h PM  
- Gamification engine (coin logic, reward distribution) — 30h dev + 4h PM  
- Admin panel (metrics, approvals, user management) — 32h dev + 5h PM  
- Cross-cutting (planning, QA, documentation) — 163h dev + 68h PM  

**Infrastructure:** 3 Azure VMs (prod + staging + failover for stability)

---

## 💡 MONETIZATION & BREAK-EVEN

**Revenue Model:** Ads + Freemium (€2.99/mo) + B2B events (€9.99/mo)

**Assumptions (based on MVP data at 100 users):**
- Ads: €0.60/user/month
- Premium + Business combined: €0.48/user/month
- Total ARPU ≈ €1.08/user/month

---

| Users | Monthly Revenue | Break-even |
|---:|---:|---|
| 500 | €541.95 | ~88 months |
| 2,500 | €2,709.75 | ~18 months |
| **10,000** | **€10,839** | **~4–5 months** ✅ |
| 50,000 | €54,195 | <1 month |

---

**ROI target:** 100% recovery (~€47,630.50) within **4–6 months** at 10k+ MAU is achievable under current monetization assumptions.

## ⚠️ RISKS & CONTINGENCY

| Risk | Likelihood | Buffer |
|---|---|---:|
| Development delays | Medium | €3,000 |
| Infrastructure scaling | Medium | €200/month |
| Additional hires | Medium | €2,000 |
| **Total contingency (~10%)** | — | **€4,700** |

---

## 📌 FINAL INTERPRETATION

Two valid cost perspectives exist:

### Full Investment Scenario (Real Startup)
- Total cost: **€47,630.50**
- Includes full infrastructure acquisition (CAPEX)

### Operational Scenario (Academic Context)
- Total cost: **€26,430.50**
- Assumes pre-existing infrastructure

---

## 📍 BUDGET STATUS (labor)

| Metric | Value |
|---|---:|
| Completed (Sprint 0–2) | €18,602.50 (70.4%) |
| Remaining (Sprint 3) | €7,828.50 (29.6%) |
| Timeline | ~7/11 weeks (~64%) |
| Status | On track |
