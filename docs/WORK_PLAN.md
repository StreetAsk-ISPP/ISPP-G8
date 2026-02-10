# Work Plan: Sprints 1-3

* **End of Sprint 1 (S1):** March 5th (Core Functionality + Deployment)
* **End of Sprint 2 (S2):** March 26th (Interaction + Event Visualization)
* **End of Sprint 3 (S3):** April 16th (Business Management, Event Creation, and Gamification)

---

# 1. Product Backlog (Prioritized for MVP)

This backlog consolidates the features necessary for the MVP, ordered by development priority.

### A: Foundations & Geolocation (Core)

* **Technical Task:** Definition of **API Contract** (Swagger/OpenAPI) and Data Model.
* **US-11:** View map with active questions (red dots) and current location.
* **US-08:** Create geolocated question (Radius, Topic, Text).
* **US-13:** View question details and list of answers (Threads).
* **US-09:** Answer questions

### B: Social Interaction (Q&A Loop)

* **US-01:** User Registration.
* **US-03:** User Login.
* **US-10:** Rate answers (Like/Dislike).
* **US-06:** Basic User Profile.

### C: Events & Business

* **US-15:** View events map (Visual icons).
* **US-16:** View event details (Time, location).
* **US-28:** Business Account Registration (Basic verification).
* **US-29:** Create events (Business users only).
* **US-30:** Edit events.



### D: Extras & Retention (Gamification & Admin)

* **US-35:** Earn coins for answering (Backend logic).
* **US-23:** View coin balance.
* **US-12:** Basic notifications (New question nearby).
* **US-02:** Plan selection (Free/Premium - Visual UI, no complex real payment gateway for MVP).
* **US-37:** Admin Panel (Basic metrics).
---

# 2. Sprint Planning

## Sprint 1: Core Q&A Loop (Anonymous/Guest)

**Objective:** Enable a user to view the map, post a question, **and answer a question** immediately (Guest Mode). The core value (information exchange) is prioritized over user identification.
**Delivery Date:** March 5th.

#### 🔧 Technical Tasks (Top Priority)

1. **API Contract First:** Define OpenAPI specs for Questions, Answers, and Geolocation.
2. **Guest/Anonymous Logic:** Implement a mechanism (Device ID or temporary session) to allow interaction without full registration.
3. **Environment & Deployment:** Setup DB (PostGIS) and deploy the initial Backend/Frontend to the cloud.

#### 👤 User Stories (Functionality)

* **US-11 (Map):** View map with active questions (red dots) and current location.
* **US-08 (Create Question):** Form to submit a question with current latitude/longitude.
* **US-13 (View Threads):** View question details and the list of existing answers.
* **US-09 (Answer Questions):** Users can post answers to questions nearby (validating location).
* **US-XX (System):** Logic for automatic question expiration.

**S1 Deliverable:** A fully functional Q&A loop. Users can open the app, find a red dot, read the thread, and reply—all without a login screen blocking them.

---

## Sprint 2: Identity, Social & Event Visualization

**Objective:** Introduce User Identity (saving history), Quality Control (Ratings), and visual population of the map with Events.
**Delivery Date:** March 26th.

#### 🔧 Technical Tasks

1. **Auth System:** Implement JWT and secure password storage.
2. **Data Migration:** Logic to associate previous "Guest" activity with the new User Account upon registration.
3. **Event Data Model:** Database structure for Events (distinct from Questions).

#### 👤 User Stories (Functionality)

* **US-01 & US-03 (Auth):** User Registration and Login.
* **US-06 (Profile):** View basic user profile and history.
* **US-10 (Rating):** Like/Dislike system on answers.
* **US-15 & US-16 (View Events):** Events appear on the map with visual icons and details (Time/Location).

**S2 Deliverable:** The app now has registered users who can build reputation (via history) and curate content (ratings). The map becomes richer with Event icons.

---

## Sprint 3: Business Management & Gamification

**Objective:** Enable the Business model (B2B accounts), increase retention (Gamification), and provide Admin tools.
**Delivery Date:** April 16th.

#### 🔧 Technical Tasks

1. **Roles & Permissions:** Backend logic to distinguish `User` vs `Business`.
2. **Notification Service:** Push notifications (Firebase/OneSignal).
3. **Gamification Engine:** Logic to award coins for valid answers.

#### 👤 User Stories (Functionality)

* **US-28 (Business Registration):** Verification flow for companies.
* **US-29 & US-30 (Event Management):** Create and Edit events (Business users).
* **US-35 & US-23 (Gamification):** Earn coins for answering and view balance.
* **US-12 (Notifications):** Alert when a nearby question is asked or your question is answered.
* **US-37 (Admin):** Basic metrics panel and business approval.
* **US-02 (Plans):** Visual UI for plan selection (Free/Premium).

**S3 Deliverable (Complete MVP):** Full ecosystem. Users identify themselves, earn rewards, and businesses manage their own presence and events.