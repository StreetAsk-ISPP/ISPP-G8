# Pilot User Management Strategy - Sprint 2

**Executive Version | Total Duration: ≤6 hours**

---

## Objective

Validate 9 critical use cases (MVP) using the deployed web environment with 2 internal pilot user groups before release.

---

## Phase 1: Definition

### Use Cases to Validate

| UC | Name | P? | Min. Validators |
|-------|--------|-----|---------|
| US-01 | User Registration | P0 | 2 |
| US-03 | Login | P0 | 2 |
| US-04 | Edit Profile | P0 | 2 |
| UC-01 | Location-Based Question | P0 | 2 |
| UC-02 | Knowledge Validation (Voting) | P0 | 2 |
| UC-04 | Event Question Forum | P0 | 2 |
| UC-06 | Event Management (Business) | P0 | 2 |
| UC-03 | Reward Redemption | P1 | 1+ |

---

## Pilot User Groups

### Group 1: Pilot Users (3-4 people)
- **Access Level:** Web application users only (no developer/code access)
- **Duration:** ~1h testing
- **Task:** Use deployed web app as regular users
- **Deliverable:** Google Form submission (bugs + usability feedback)

### Group 2: Pilot Users (2-3 people)
- **Access Level:** Web application users only (no developer/code access)
- **Duration:** ~1h testing
- **Task:** Use deployed web app as regular users
- **Deliverable:** Google Form submission (bugs + usability feedback)

---

## Phase 2: Preparation

### Pre-Testing Checklist

**Environment:**
- [ ] Web application deployed and publicly accessible
- [ ] Deployment URL verified and stable
- [ ] Test accounts created (one per tester or shared)
- [ ] Test data seeded (questions, events, business accounts)
- [ ] Smoke test completed on deployed environment

**Automation & Communication:**
- [ ] Workflow configured to send:
      - Deployed URL
      - Test credentials
      - Google Form link
- [ ] Google Form created and validated
- [ ] Slack channel #ispp-pilot-testing created
- [ ] Pilot users identified

### Reference Documents

1. Google Form (online feedback collection)
2. Strategy.md (process & workflow)
3. Exported response spreadsheet (internal use)

---

## Phase 3: Execution

### Feedback Collection Timeline

| Phase | Duration | Activity |
|-------|----------|----------|
| Day 0 | 2h | Workflow sends deployed URL + credentials + Google Form |
| Days 1-2 | Self-paced | Testers use web app (~1h each) and complete Google Form |
| Day 3 | 1h | Review responses and start triage |
| Days 4-5 | - | Consolidate findings, create GitHub issues |

**Total feedback collection: ~3-4 days (async testing)**

---

## Feedback Collection & Response

### Tester Submission (via Google Form)

- Testers access deployed web application
- Complete Google Form after testing
- Report issues with severity:
  - 🔴 CRITICAL
  - 🟠 MAJOR
  - 🟡 MINOR
- Provide reproduction steps and screenshots if possible

### Team Response Plan

1. **Consolidation (Day T+1)**
   - Export Google Form responses
   - Identify duplicates and patterns

2. **GitHub Issues (Day T+1)**
   - Create one issue per validated finding
   - Add labels: `pilot-feedback`, `sprint-2-validation`

3. **Triage Meeting (Day T+2)**
   - Review severity
   - Estimate effort
   - Commit fixes to Sprint 2

4. **Development Reaction (Days T+3-7)**
   - Fix critical and major issues
   - Track progress within sprint

---

## Phase 4: Feedback Management

### Categorization

| Severity | Action |
|-----------|--------|
| CRITICAL | Immediate GitHub issue + must be fixed in Sprint 2 |
| MAJOR | Prioritized in Sprint 2 backlog |
| MINOR | Labeled as improvement (post-MVP) |

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Use Case Coverage | 100% P0 validated |
| Min Validators per UC | 2+ |
| Total Testing Time | ≤6h |
| Critical Issues Found | 0-1 |
| Issue Reproducibility | 100% (clear steps provided) |

---

## Failure Criteria

Stop testing if:

- Repeated crashes on core features
- Authentication completely broken
- Complete feature failure
- Data loss observed

Action: Immediate escalation to Pilot Coordinator and Dev Lead via Slack.

---

## Timeline Overview

T-3 to T-1: Deployment verification + workflow setup  
Day T: Workflow triggers + testing begins  
Day T+1: Consolidation + triage  
Day T+2-7: Fix critical/major issues  

---

## Roles & Responsibilities

| Role | Owner | Key Tasks |
|------|-------|-----------|
| Pilot Coordinator | Darío Zafra Ruiz | Process orchestration, monitoring workflow, triage coordination |
| QA Lead | TBD | Response consolidation, issue creation |
| Dev Lead | TBD | Prioritization and fixes |
| Product Owner | TBD | Sprint 2 scope validation |

---

## Pre-Launch Checklist

- [ ] Deployment stable and accessible
- [ ] Workflow tested
- [ ] Google Form validated
- [ ] Test accounts working
- [ ] Roles assigned
- [ ] Slack channel active

---

**Status:** Ready for Sprint 2 Execution  
**Version:** 2.0 (Web-based Pilot Testing)