# Pilot User Management Strategy - Sprint 2

**Executive Version | Total Duration: ≤6 hours**

---

##  Objective

Validate 9 critical use cases (MVP) with 2 internal pilot user groups before release.

---

## Phase 1️⃣: Definition

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

### Pilot User Groups

#### Group 1: Technical (3-4 testers)
- **Role:** Developers, QA
- **Duration:** 3h
- **Focus:** Bugs, API behavior, data integrity, performance
- **Deliverable:** Technical issues with reproducible steps

#### Group 2: Non-Technical (2-3 testers)
- **Role:** Product managers, designers
- **Duration:** 3h
- **Focus:** UX clarity, navigation, requirement alignment
- **Deliverable:** Usability feedback and improvements




## Phase 2️⃣: Preparation

### Pre-Testing Checklist

**Backend/Frontend:**
- [ ] Staging environment deployed + healthy
- [ ] Frontend APK/ESC builds ready
- [ ] Test accounts created (8-10 accounts)
- [ ] Test data seeded (5+ questions, 3+ events)
- [ ] Swagger API docs accessible

**Communication:**
- [ ] Slack channel #ispp-pilot-testing created
- [ ] Testing guidelines distributed to testers
- [ ] Google Form feedback ready (or printed)
- [ ] Calendar invites sent (4 sessions)

**Testers:**
- [ ] Each tester knows when + what to test
- [ ] Test account credentials shared
- [ ] APK/build accessible for download

### Reference Documents

1. **Testing_Guidelines.md** (for testers)
2. **Feedback_Form.md** (during testing)

---

## Phase 3️⃣: Execution

### 4 Testing Sessions

| Session | Group | Duration | Activity |
|---------|-------|----------|----------|
| 1 | Group 1 (Tech) | 1.5h | Testing core scenarios |
| 2 | Group 2 (UX) | 1.5h | Testing core scenarios |
| 3 | Both | 1.5h | Bug triage + clarification |
| 4 | Group 1 | 1h | [Opt] Re-test hotfixes |

**Total: 5.5 hours** (within 6h limit)

### Issue Reporting Protocol

**During testing, report immediately (Slack):**
- 🔴 **CRITICAL:** App crash / complete feature failure
- 🟠 **MAJOR:** Partial feature failure / significant UX friction
- 🟡 **MINOR:** Cosmetic / polish

---

## Phase 4️⃣: Feedback Management

### Categorization

| Severity | Action |
|-----------|--------|
| **CRITICAL** | GitHub issue (Severity: Critical) + Dev team notified immediately |
| **MAJOR** | GitHub issue (Severity: Major) + add to Sprint 2 backlog |
| **MINOR** | GitHub issue (Severity: Minor) + label "nice-to-have" (post-MVP) |

### Workflow Post-Testing

1. **Consolidate findings** (Day T+1)
   - Merge feedback forms into spreadsheet
   - Deduplicate similar issues
   - Identify patterns

2. **Create GitHub Issues** (Day T+1)
   - One issue per finding
   - Use template below
   - Label: `pilot-feedback`, `sprint-2-validation`

3. **Triage Meeting** (Day T+2)
   - Review critical issues
   - Assign priority & estimate effort
   - Commit fixes to Sprint 2 timeline

### GitHub Issue Template

```
Title: [PILOT-FEEDBACK] Brief description

Severity: 🔴 Critical / 🟠 Major / 🟡 Minor
Category: Bug / UX / Performance / Missing Feature

Reported by: [Tester names, #testers]
Use Case: [UC-XX]

Description:
[What is happening vs. what should happen?]

Steps to Reproduce:
1. [Step 1]
2. [Step 2]
-> Expected: [X]
-> Actual: [Y]

Evidence: [Screenshots/logs if applicable]
Suggested Fix: [If applicable]

Labels: pilot-feedback, sprint-2-validation, severity:[level]
```

---

## 📊 Success Metrics

| Metric | Target | Notes |
|--------|--------|-------|
| **Use Case Coverage** | 8/8 P0 cases | 100% tested |
| **Min Validators per UC** | 2+ | Overlap for duplicate findings |
| **Total Testing Time** | ≤6h | Actual: ~5.5h (5-7 testers × 1h avg) |
| **Critical Issues Found** | 0-1 | >1 = major rework needed |
| **Major Issues Found** | 1-5 | Healthy range for MVP |
| **Issue Reproducibility** | 100% | All issues must have clear steps |

---

## ⚠️ Failure Criteria

**Stop testing if:**
- App crashes repeatedly on core feature
- Authentication completely broken
- Complete feature failure (buttons don't work at all)
- Data loss observed

**Action:** Report immediately to Pilot Coordinator + Dev Lead in Slack

---

## 🕐 Timeline

```
T-3 to T-1: Prepare environment + send invites
Day T:      Session 1 + 2 (3h testing)
Day T+1:    Session 3 (Triage) + consolidate findings
Day T+2-7:  Fix critical issues + [Opt] Session 4
```

---

## 📋 Roles & Responsibilities

| Role | Owner | Key Tasks |
|------|-------|-----------|
| **Pilot Coordinator** | Darío Zafra Ruiz | Orchestrates process, scheduling, communication |
| **Test Facilitator** | TBD | Monitors sessions, issue escalation |
| **QA Lead** | TBD | Triage, GitHub issues, categorization |
| **Dev Lead** | TBD | Prioritization, estimation, fixes |
| **Product Owner** | TBD | Final decisions, Sprint 2 commitment |

---

## ✅ Pre-Launch Checklist

- [ ] All documents created + reviewed
- [ ] Roles assigned + confirmed
- [ ] Testing guidelines sent to testers
- [ ] Staging environment healthy
- [ ] Test accounts created
- [ ] Feedback form ready (Google Form or printed)
- [ ] Slack channel created
- [ ] Calendar invites sent
- [ ] 24h reminder queued

---

## 📞 Quick Reference

**Slack Channel:** #ispp-pilot-testing  
**Feedback Form:** See DOCX file in Pilot_Testing folder  
**Staging URL:** Pending assignment    

---

**Status:** Ready for Sprint 2 Execution  
**Version:** 1.0
