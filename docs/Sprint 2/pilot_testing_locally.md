# 🧪 Master Pilot Testing Report: Consolidated Feedback

## Sprint Status Overview
🔴 TO DO | 🟡 PENDING / FIX | 🟢 DONE

---

### 📋 User Stories & Bug Reports

| Sprint | User Story | Status | Bugs Found & Enhancements Required | Reported By |
| :--- | :--- | :--- | :--- | :--- |
| **S1** | **US-01:** User Registration | 🟡 Pending | • **UI:** Hide the "Business Sign-up" button or add a "Coming Soon" badge. | Manuel, Darío, Javi |
| **S1** | **US-03:** User Login | 🟡 Pending |• **DevOps:** Add Brevo environment variables to the production environment. | Manuel, Darío, Javi |
| **S1** | **US-08:** Create Question | 🟡 Pending | • **Bug:** Clicking "Create a question" incorrectly centers the map on Seville instead of the user's location.<br>• **Bug:** 10km radius causes a timeout error (>10,000ms).<br>• **Logic:** Restrict the allowed radius range (e.g., prevent useless 0.005km or excessive 10,000km limits).<br>• **Feature:** Allow radius selection when typing an address manually (currently locked to 1km).<br>• **UX:** Remove advertisements as they negatively impact the experience. | Manuel, Darío, Zoilo, Javi |
| **S1** | **US-09:** Answer Questions | 🟡 Pending | - | Manuel, Darío, Zoilo, Javi |
| **S1** | **US-11:** Map View | 🟡 Fix | • **Bug:** The map does not reload properly after a new question is created.<br>• **UI/UX Suggestion:** Instead of opening the forum in full-screen, use a side modal so the map remains visible in the background. | Manuel, Darío, Zoilo, Javi |
| **S1** | **US-13:** View Threads | 🟢 DONE | • **Bug:** Re-opening a thread via "Click to open" fails if you just closed it; requires clicking elsewhere on the map first.<br>• **Localization:** "Move closer" prompt appears in Spanish. Translate to English.<br>• **Feature:** Add sorting options for answers (Newest / Most Voted).<br>• **UI:** Improve typography and icons (question text is too small). Consider using a side modal instead of full-screen. | Manuel, Darío, Zoilo, Javi |
| **S1** | **US-XX:** Question Expiration | 🟡 Fix | • **Bug:** Questions are disappearing exactly 1 hour before their set expiration time.<br>• **Update:** Change the User Story requirement to a 6-hour expiration limit. | Manuel, Darío, Zoilo, Javi |
| **S2** | **US-04:** Edit Profile | 🟢 DONE | - | Santia, Zoilo, Javi |
| **S2** | **US-06:** User Profile | 🟡 Fix | • **Bug:** Questions appear duplicated in the profile statistics.<br>• **UI:** Many buttons are missing their corresponding screens/views (settings f.e.). | Santia, Zoilo, Javi |
| **S2** | **US-10:** Rating System | 🟢 Fix | **Logic:** Reputation calculation is skewed (a single "like" grants a 5/5 score).<br> | Santia, Zoilo, Javi |
| **S2** | **US-12:** Notifications | 🟡 Fix | • **Bug:** If question creation fails due to a timeout, a "Question Created" notification still fires. | Santia, Zoilo, Javi |
| **S3** | **US-37:** Admin Panel | 🟡 Pending | • **Bug:** "Delete User" from admin is broken (Rob is currently working on a fix). | Zoilo, Javi |
| **S3** | **US-39:** Verify Business | 🔴 To Do | • Admin functionality to approve/reject business accounts is pending implementation. | Javi |

---

### 📌 General Tasks & UI/UX Feedback

* **Subscription Plans:** Hide subscription plan buttons because this isn't neccesary for Sprint 2.
* **Navigation / Header UI:** Remove the notification bell and search (magnifying glass) icons from the interface.
* **Settings Screen:** The "Settings" button currently navigates to a blank screen. Needs a routing fix.
* **Account Deletion:** The "Delete Account" button is non-functional. Consider removing the button entirely if this feature is out of scope for the current release.