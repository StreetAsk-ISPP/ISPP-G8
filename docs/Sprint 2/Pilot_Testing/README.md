# Pilot User Testing - Sprint 2

Structured validation process with 2 groups of regular app users using the deployed web environment.

## Documents

- **[Strategy.md](Strategy.md)** → Full plan: groups, timeline, feedback reaction, GitHub issue workflow
- **Google Form (Feedback Form)** → Online questionnaire for usability feedback and bug reporting
- **Deployed Web URL** → Application accessible via browser (sent automatically via workflow)

---

## Pilot Groups

- **Group 1:** 3-4 users (~1h testing)
- **Group 2:** 2-3 users (~1h testing)

Both groups: Regular app users only. No code access.


## What we're testing

9 core use cases:

- US-01 (Registration)
- US-03 (Login)
- US-04 (Edit Profile)
- UC-01 (Location Questions)
- UC-02 (Voting)
- UC-04 (Event Forum)
- UC-06 (Business Events)
- UC-03 (Rewards - P1)


## Quick start

### For pilot coordinator (Darío Zafra Ruiz)

1. Ensure the web application is deployed and accessible.
2. Create and verify test accounts.
3. Configure workflow to automatically send:
   - Deployed web URL
   - Test account credentials
   - Google Form link
4. Monitor Google Form responses for 2-3 days.
5. Consolidate findings → Create GitHub issues.
6. Organize triage meeting for prioritization.

---

### For testers

1. Access the provided web URL.
2. Log in using test account credentials.
3. Use the application normally (~1h).
4. Complete the Google Form:
   - Report usability feedback
   - Report bugs found
   - Indicate severity level
5. Submit the form (no email required).

---

## Feedback process

### During Testing

- Testers use the deployed web application.
- Note any usability problems or functional issues.
- Capture screenshots if possible.

### After Testing (Days 1-3)

- Testers complete the Google Form.
- Report issues with severity classification:
  - 🔴 CRITICAL
  - 🟠 MAJOR
  - 🟡 MINOR
- Provide steps to reproduce whenever possible.

### Team Reaction (Days 3-5)

1. Export and consolidate all Google Form responses.
2. Remove duplicates and identify patterns.
3. Create one GitHub issue per validated finding.
4. Label issues:
   - `pilot-feedback`
   - `sprint-2-validation`
5. Conduct triage meeting:
   - Critical → Must be fixed in Sprint 2
   - Major → Prioritized within Sprint 2
   - Minor → Backlog / post-MVP
6. Development team fixes critical and major items.