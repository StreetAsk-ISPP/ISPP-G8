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

#### Group 1: Pilot Users (3-4 people)
- **Access Level:** App users only (no developer/code access)
- **Duration:** ~1h testing
- **Task:** Use app as regular users, report bugs/feedback via questionnaire
- **Deliverable:** Bug reports + usability feedback form

#### Group 2: Pilot Users (2-3 people)
- **Access Level:** App users only (no developer/code access)
- **Duration:** ~1h testing
- **Task:** Use app as regular users, report bugs/feedback via questionnaire
- **Deliverable:** Bug reports + usability feedback form




## Phase 2️⃣: Preparation

### Pre-Testing Checklist

**App & Environment:**
- [ ] APK/ESC build ready for distribution
- [ ] Test accounts created (one per tester or shared)
- [ ] Test data seeded (5+ questions, 3+ events, business accounts)
- [ ] App tested on Android/iOS locally first

**Communication:**
- [ ] Bug report questionnaire (DOCX) prepared
- [ ] Email templates ready
- [ ] Slack channel #ispp-pilot-testing created
- [ ] Pilot users identified and email addresses collected

**Tester Setup:**
- [ ] APK/ESC build uploaded and link ready
- [ ] Test account credentials prepared
- [ ] Installation instructions prepared
- [ ] Questionnaire template ready to send

### Reference Documents

1. **Bug Report Questionnaire** (sent via email)
2. **Feedback_Form.md** (during testing)

---

## Phase 3️⃣: Execution

### Feedback Collection Timeline

| Phase | Duration | Activity |
|-------|----------|----------|
| **Day 0** | 2h | Send app + test accounts to Group 1 + Group 2 |
| **Days 1-2** | Self-paced | Testers use app (~1h each), complete questionnaire |
| **Day 3** | 1h | Collect all questionnaires, start triage |
| **Days 4-5** | - | Consolidate findings, create GitHub issues |

**Total feedback collection: ~3-4 days** (testers work async)

### Feedback Collection & Response

**Tester Submission (via email questionnaire):**
- Testers complete DOCX form during/after app testing
- Report bugs with severity: 🔴 CRITICAL / 🟠 MAJOR / 🟡 MINOR
- Include steps to reproduce + screenshots if possible
- Submit forms via email to Pilot Coordinator

**Team Response Plan:**
1. **Consolidation (Day T+1):** Compile all responses, identify duplicates
2. **GitHub Issues (Day T+1):** Create issues for each bug/feedback item
3. **Triage Meeting (Day T+2):** Severity review, estimate fixes, commit to Sprint 2
4. **Dev Reaction (Days T+3-7):** Fix critical/major items, track in sprint

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
- [ ] Bug report questionnaire prepared
- [ ] Staging environment healthy
- [ ] Test accounts created
- [ ] Feedback form ready (email questionnaire + Google Form)
- [ ] Slack channel created
- [ ] Email invites sent to pilot users
- [ ] Email reminders with questionnaire link queued

---

## 📞 Quick Reference

**Slack Channel:** #ispp-pilot-testing  
**Feedback Form:** See DOCX file in Pilot_Testing folder  
**Staging URL:** Pending assignment    

---

**Status:** Ready for Sprint 2 Execution  
**Version:** 1.0
