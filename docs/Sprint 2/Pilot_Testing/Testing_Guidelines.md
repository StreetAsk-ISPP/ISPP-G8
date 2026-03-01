# Pilot Testing Guidelines

**Document:** Testing Instructions for Pilot Users  
**Read this if:** You're a tester (Group 1 or Group 2)

---

## Pre-Testing Setup

### For All Testers

1. **Install Application**
   - Download StreetAsk APK/ESC build (Pending assignment)
   - Android: Settings → Security → Enable "Unknown Sources" → Install
   - iOS: Check Slack for TestFlight link
   - App should open without crashing

2. **Use Test Account (DO NOT use personal accounts)**
   - Email: `[test-email@example.com]`
   - Password: `[your-password]`
   - If doesn't exist yet, register with same credentials

3. **Enable Permissions**
   - ✓ Location (GPS)
   - ✓ Notifications
   - ✓ Camera (if needed)
   - ✓ Internet connectivity (WiFi or mobile)

4. **Verify App Ready**
   - App opens without crash
   - Login works
   - Map visible + centered on your location

---

## Testing Instructions by Group

### Group 1: Technical (Developers & QA)

**Focus:** Bugs, API behavior, data integrity, performance

- Test each use case **systematically** (don't skip steps)
- Open **Developer Tools:**
  - Android: logcat/Android Studio debugger
  - iOS: Xcode console or Safari inspector
  - Web: Chrome DevTools (Network + Performance tabs)
- Check: API responses (2xx status), JSON structure, data values
- Check: Data persists after app restart, no crashes/freezes
- Test: Edge cases (empty inputs, long text, special chars), network failures

**Key Questions:**
- ✔️ Does it work as documented?
- ✔️ Any crashes/freezes/errors?
- ✔️ Are API calls successful?
- ✔️ Does data persist?
- ✔️ Performance acceptable (<500ms APIs, <2s page load)?

---

### Group 2: Non-Technical (Product, Design, Business)

**Focus:** UX clarity, navigation, requirement alignment

- Test at **user's pace** — don't rush
- **Think aloud:** Say what you see, expect, and what confuses you
- Take **screenshots** of confusing screens
- Ask: "Would a typical user find this obvious?"

**Key Questions:**
- ✔️ Is it obvious how to do things?
- ✔️ Are buttons labeled clearly + logically placed?
- ✔️ Is visual hierarchy logical (size, color, position)?
- ✔️ Does flow match requirements?
- ✔️ Any typos, unclear icons, or poor design?

---

## 5 Testing Scenarios (Total: ~36 min)

### Scenario 1: Registration & Login (5 min)
**Use Cases:** US-01, US-03

1. Open app → Tap "Register"
2. Enter test email + password
3. Tap "Register" → Verify confirmation email received
4. Login with same credentials
5. Verify: Logged in, no crashes

---

### Scenario 2: Ask Location-Based Question (8 min)
**Use Case:** UC-01

1. Login → Navigate to map
2. Tap "Ask" button
3. Enter title: `Is the library open?`
4. Enter description: `Need a quiet study spot`
5. Set location (auto-detect) + radius (500m or 1km)
6. Choose subscription: Free (watch ad) or Premium
7. Tap "Post" / "Publish"
8. Verify: Question on map, expiration timer visible, no crashes

---

### Scenario 3: Vote on Answers (8 min)
**Use Case:** UC-02

1. Login → Tap an existing question
2. Scroll down to see answers
3. Tap upvote (↑) or downvote (↓) on answer
4. Verify: Vote count updates immediately
5. Upvote multiple answers
6. Verify: Most-voted answer gets "Top" badge
7. Tap upcote again (test reversibility)
8. Verify: Vote persists after app refresh

---

### Scenario 4: Create & Edit Event (10 min)
**Use Case:** UC-06 (Business Account)

1. Login with **business test account**
2. Navigate to "My Events" or "Create Event"
3. Tap "Create Event"
4. Fill in: Title, location (on map), date/time, description, category
5. Tap "Create" → Verify event in list + on map
6. Tap event → "Edit"
7. Change title or description → "Save"
8. Verify: Changes reflected
9. Tap "Delete" → Confirm
10. Verify: Event removed from list

---

### Scenario 5: Profile & Edit (5 min)
**Use Cases:** US-04, US-06

1. Login → Navigate to Profile tab
2. View info: name, email, stats, karma
3. Tap "Edit Profile"
4. Change name to `Test User [date]` + add bio
5. Tap "Save"
6. Verify: Changes visible
7. Logout → Login again → Verify changes persisted

---

## Critical Paths (MUST VALIDATE)

1. **Register → Login → Ask Question → Vote on Answer**  
   (Core app value)

2. **Business Login → Create Event → Edit → User asks question in event forum → Business responds**  
   (B2B monetization)

3. **Register → Login → Create content → Logout → Login → Content still exists**  
   (Data persistence)

---

## Failure Criteria (STOP & ESCALATE IF...)

🔴 **App crashes** — Force close, screenshot, post in Slack immediately

🔴 **Complete feature failure** — "Ask" button doesn't work at all

🔴 **Data loss** — Create question, refresh app, question is gone

🔴 **Login broken** — Can't login with test account (verify credentials first)

🔴 **Infinite loading** — Loading screen for >30 seconds without change

**Action:** Post in Slack `@test-facilitator URGENT: [issue]. Steps: 1. [step] 2. [step]`

---

## How to Report Issues

### During Testing:
1. **For CRITICAL issues:** Post immediately in Slack
2. **For all issues:** Describe in **Feedback Form** at end of session

**Include:**
- What happened vs. what should happen
- Exact steps to reproduce
- Device model + OS version
- Screenshot/video (if possible)

---

## DO's & DON'Ts

✔️ **DO:**
- Follow scenarios step-by-step
- Take screenshots of bugs or confusing screens
- Note if anything feels slow
- Test on actual device (not simulator)
- Restart app occasionally (test persistence)
- Try edge cases (unusual inputs, errors)

✗ **DON'T:**
- Use personal accounts — use test accounts only
- Skip steps to "save time" — bugs hide that way
- Assume it works if you see no error message — verify
- Leave app running in background for too long
- Close without reporting critical crashes

---

## Reference Links

- **Feedback Form:** DOCX file in Pilot_Testing folder

---

**Questions?** Ask Pilot Coordinator or Test Facilitator in Slack.

**Thank you for testing! Your feedback shapes Sprint 2. 🙌**
