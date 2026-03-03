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

## �💰 PROJECT BUDGET AT A GLANCE

### Development Costs (Sprint 0 → Sprint 3)

| Phase | Development Cost | Deployment Cost (Azure) | Subtotal |
|---|---:|---:|---:|
| **Sprint 0** (Completed) | €5,572.00 | €17.50 | €5,589.50 |
| **Sprint 1** (Completed) | €5,184.00 | €17.50 | €5,201.50 |
| **Sprint 2** (Estimated) | €7,776.00 | €35.00 | €7,811.00 |
| **Sprint 3** (Estimated) | €7,776.00 | €52.50 | €7,828.50 |
| **TOTAL** | **€26,308.00** | **€122.50** | **€26,430.50** |

---

### Total Project Cost Breakdown

**Development & Deployment Summary:**
> The total **development cost** of the project from Sprint 0 through Sprint 3 would be approximately **€26,308.00**. Adding the **deployment costs** across all sprints (assuming we pay monthly Azure subscription costs for infrastructure during development), the total would be:
> 
> **€26,308.00 (development) + €122.50 (deployment infrastructure) = €26,430.50**

| Category | Cost | Description |
|---|---:|---|
| **Total Labor (Dev + PM)** | €26,308.00 | Team salaries for all sprints |
| **Total Infrastructure (Azure)** | €122.50 | Virtual machines & services (Sprints 0–3) |
| **🎯 TOTAL PROJECT COST** | **€26,430.50** | Complete project through Sprint 3 |

---

### Budget Status

| Metric | Value |
|---|---:|
| ✅ **Completed (Sprint 0 & 1)** | €10,791.50 (40.3%) |
| 📋 **Remaining (Sprint 2 & 3)** | €15,639.00 (59.7%) |
| **Timeline Elapsed** | 4/11 weeks (36%) |
| **Status** | ✅ On track (slightly ahead) |

---

## 📚 COST CLASSIFICATION (CAPEX, OPEX, TCE)

**CAPEX (Capital Expenditure):** One-time infrastructure setup costs
- Azure VM setup, database configuration, CI/CD pipeline infrastructure
- **In this project:** €122.50 (minimal — mostly cloud-based, no hardware)

**OPEX (Operational Expenditure):** Recurring costs to run the project
- Team labor (€26,308) — largest budget component
- Monthly Azure VM operations (€122.50) — hosting during active development
- Scaling infrastructure costs post-launch

**TCE (Total Cost of Employment):** Full cost to hire/retain each person
- Gross salary + employer social contributions (~35%) + equipment + benefits
- **In our rates:** €12.50/h (dev) and €14.80/h (PM) already include full TCE
- Example: €12.50/h × 160h/month = €2,000 TCE/month, which represents ~€1,481 gross salary + €519 employer costs

**Bottom line:** This estimate focuses on OPEX (labor) which drives 99% of budget. Infrastructure costs are minimal due to cloud model.

---

## 📊 INFRASTRUCTURE COSTS

| Phase | Timeline | VMs | Purpose | Cost |
|---|---|---:|---|---:|
| Sprint 0 | Feb 5–20 | 1 | Dev/test | €17.50 |
| Sprint 1 ✅ | Feb 21–Mar 5 | 1 | Production MVP | €17.50 |
| Sprint 2 | Mar 6–26 | 2 | Prod + staging | €35.00 |
| Sprint 3 | Mar 27–Apr 16 | 3 | Prod + staging + failover | €52.50 |
| Operations | Apr 17–Jul 31 | 3 | Maintenance | €367.50 |
| **Total (11 weeks)** | — | — | — | **€490.00** |

**Azure VM:** Standard B2s (€35/month)  
**Services:** OpenStreetMap + Leaflet = **€0.00** (completely free for commercial use)

---

## 🎯 SPRINT SUMMARY

### Sprint 0 — Foundations [COMPLETED ✅]
**Dates:** Feb 5–20 (3 weeks) | **Cost:** €5,589.50  
**Delivered:** Data model, tech stack, CI/CD, business plan, user stories, mockups  
**Work:** 10 Foundation User Stories + cross-cutting activities

### Sprint 1 — Core Q&A [COMPLETED ✅]
**Dates:** Feb 21–Mar 5 (2 weeks) | **Cost:** €5,201.50  
**Delivered:** Registration, login, map, geolocated Q&A, answer threads, authentication  
**Key US:** US-01, US-03, US-08, US-11, US-09, US-13 + infrastructure

### Sprint 2 — Social Interaction [ESTIMATED]
**Dates:** Mar 6–26 (3 weeks) | **Est. Cost:** €7,811.00  
**Scope:** User profiles, ratings (like/dislike), push notifications  
**Key US:** US-06, US-10, US-12, US-04

**Breakdown:**
- User profile system (view stats, activity, editing) — 65h dev
- Rating/reputation engine (like/dislike, trust scores) — 80h dev + 11h PM
- Push notification service (triggers, scheduling, delivery) — 55h dev + 7h PM
- Cross-cutting (planning, QA, documentation) — 165h dev + 78h PM

**Infrastructure:** 2 Azure VMs (prod + staging)

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

---

## 📈 COST BREAKDOWN

| Role | Hours | Cost | % |
|---|---:|---:|---:|
| Developers (16 people) | 1,560 | €19,500.00 | 73.8% |
| PMs (4 people) | 460 | €6,808.00 | 25.7% |
| Infrastructure | — | €122.50 | 0.5% |
| **TOTAL** | **2,020** | **€26,430.50** | **100%** |

**Per person:** Dev €1,218.75 | PM €1,702.00  
**Per user story:** ~€980.02 (27 US estimated)  
**Weekly cost:** €2,402.77

---

## 💡 MONETIZATION & BREAK-EVEN

**Revenue Model:** Freemium (€2.99/mo) + B2B events (€9.99/mo) + gamification

| Users | Monthly Revenue | Break-even |
|---:|---:|---|
| 500 | €94.53 | >280 months |
| 2,500 | €473.14 | ~57 months |
| **10,000** | **€1,892** | **~14 months** ✅ |
| 50,000 | €9,468 | ~3 months |
| 100,000 | €18,941 | ~1.4 months |

**ROI target:** 100% recovery (€26,798) within 6-9 months at 10k+ MAU is realistic for strong market fit MVP.

---

## ⚠️ RISKS & CONTINGENCY

| Risk | Likelihood | Buffer |
|---|---|---:|
| Development delays (20% overrun) | Medium | €2,000–€3,000 |
| Infrastructure scaling | Medium | €50–€200/month |
| Additional team capacity | Medium | €1,000–€2,000 |
| **Total contingency (10%)** | — | **€2,643–€4,000** |

**Recommended approved budget:** €29,500 (includes 10% buffer for flexibility)

---

## 📋 OPENSTREETMAP & LEAFLET POLICY

✅ **Completely free for monetized apps**
- No licensing fees or revenue commissions
- No restrictions on premium subscriptions or business models
- Only requirement: Attribution ("© OpenStreetMap contributors")
- For massive scale (>1M tile requests/month): Consider self-hosting or Mapbox

**Conclusion:** Zero licensing cost = sustainable geolocation features

---

## 📍 BUDGET UTILIZATION (March 2, 2026)

**Completed:**
- Sprint 0: €5,589.50 ✅
- Sprint 1: €5,201.50 ✅
- **Total: €10,791.50 (40.3%)**

**Remaining:**
- Sprint 2: €7,811.00
- Sprint 3: €7,828.50
- Maintenance (Apr–Jul): €367.50
- **Total: €16,007.00 (59.7%)**

**Status:** ✅ Slightly ahead of schedule (40% spend, 36% of timeline elapsed)


