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

## Sprint 1: Core Q&A Loop (Registered Users)

**Objective:** Enable a registered user to view the map, post a question with topic and radius, **and answer questions** from other users. All users must register to interact with the platform.
**Delivery Date:** March 5th.

#### 🔧 Technical Tasks (Top Priority)

1. **API Contract First:** Define OpenAPI specs for Questions, Answers, Authentication, and Geolocation.
2. **Auth System:** Implement user registration and login with JWT authentication.
3. **Environment & Deployment:** Setup DB (PostGIS) and deploy the initial Backend/Frontend to the cloud.

#### 👤 User Stories (Functionality)

* **US-01 (Registration):** User registration with email and password.
* **US-03 (Login):** User login with credentials.
* **US-11 (Map):** View map with active questions (red dots) and current location.
* **US-08 (Create Question):** Form to submit a question with topic (mandatory), radius, and question text.
* **US-13 (View Threads):** View question details and the list of existing answers in mini-forum format.
* **US-09 (Answer Questions):** Users can post answers to questions nearby (validating location) with threaded replies.
* **US-XX (System):** Logic for automatic question expiration (2 hours for free users).

**S1 Deliverable:** A fully functional Q&A loop with user registration. Users must register/login, then can view the map, find red dots (questions), read the thread, and reply.

---

## Sprint 2: Social Interaction & Quality Control

**Objective:** Enhance the Q&A system with Quality Control (Ratings), User Profiles, and Notifications.
**Delivery Date:** March 26th.

#### 🔧 Technical Tasks

1. **Rating System:** Implement Like/Dislike voting on answers.
2. **User Profile Backend:** Store and display user statistics and history.
3. **Notification Service:** Basic push notifications for nearby questions and responses.

#### 👤 User Stories (Functionality)

* **US-06 (Profile):** View basic user profile, statistics, and activity history.
* **US-10 (Rating):** Like/Dislike system on answers with user rating calculation.
* **US-12 (Notifications):** Receive notifications for nearby questions and responses to own questions.
* **US-04 (Edit Profile):** Edit profile information.

**S2 Deliverable:** The app now has user profiles with reputation based on answer quality. Users receive notifications and can rate answers to surface the best information.

---

## Sprint 3: Events, Business Accounts & Gamification

**Objective:** Enable Event visualization and management, Business accounts (B2B), Gamification system, and Admin tools.
**Delivery Date:** April 16th.

#### 🔧 Technical Tasks

1. **Event Data Model:** Database structure for Events (distinct from Questions).
2. **Roles & Permissions:** Backend logic to distinguish `User` vs `Business`.
3. **Gamification Engine:** Logic to award coins for valid answers.
4. **Admin Panel:** Basic metrics and business account approval.

#### 👤 User Stories (Functionality)

**Events:**
* **US-15 (Event Map):** Events appear on the map with visual icons.
* **US-16 (Event Details):** View event details (time, location, attendees).
* **US-17 (Map Toggle):** Toggle to show/hide questions on the map (events always visible).
* **US-27 (Attendance):** Mark/unmark attendance to events.

**Business Accounts:**
* **US-28 (Business Registration):** Verification flow for companies with NIF.
* **US-48 (Payment Screen):** Payment screen for one-time Business account fee.
* **US-29, US-30, US-31, US-32 (Event Management):** Create, Edit, View, Delete events (Business users).

**Gamification:**
* **US-35 (Earn Coins):** Earn coins for answering questions.
* **US-23 (Coin Balance):** View coin balance in profile.
* **US-02 (Plans):** Plan selection UI (Free/Premium).

**Admin:**
* **US-37 (Admin Panel):** Basic metrics panel and business approval.
* **US-39 (Verify Business):** Approve or reject business verification requests.

**S3 Deliverable (Complete MVP):** Full ecosystem with events on the map, business accounts managing events, user gamification with coins, and admin tools for moderation.

**S3 Deliverable (Complete MVP):** Full ecosystem. Users identify themselves, earn rewards, and businesses manage their own presence and events.