# Work Plan: Sprints 1-3

* **End of Sprint 1 (S1):** March 5th (Core Functionality + Deployment)
* **End of Sprint 2 (S2):** March 26th (Interaction + Event Visualization)
* **End of Sprint 3 (S3):** April 16th (Business Management, Event Creation, and Gamification)

---

# 1. Product Backlog (Prioritized for MVP)

This backlog consolidates the features necessary for the MVP, ordered by development priority.

### A: Foundations & Geolocation (Core)

* **Technical Task:** Definition of **API Contract** (Swagger/OpenAPI) and Data Model.
* **US-01:** User Registration (Email/Pass).
* **US-03:** User Login.
* **US-11:** View map with active questions (red dots) and current location.
* **US-08:** Create geolocated question (Radius, Topic, Text).

### B: Social Interaction (Q&A Loop)

* **US-13:** View question details and list of answers (Threads).
* **US-09:** Answer questions (Presence verification via GPS).
* **US-10:** Rate answers (Like/Dislike).
* **US-06:** Basic User Profile.

### Epic C: Events & Business

* **US-15:** View events map (Visual icons).
* **US-16:** View event details (Time, location).
* **US-28:** Business Account Registration (Basic verification).
* **US-29:** Create events (Business users only).
* **US-30:** Edit events.

### Epic D: Extras & Retention (Gamification & Admin)

* **US-35:** Earn coins for answering (Backend logic).
* **US-23:** View coin balance.
* **US-12:** Basic notifications (New question nearby).
* **US-02:** Plan selection (Free/Premium - Visual UI, no complex real payment gateway for MVP).
* **US-37:** Admin Panel (Basic metrics).

---

# 2. Sprint Planning

## Sprint 1: Core + Deployment

**Objective:** Enable a user to register, view a map, post a question, and have this deployed in the cloud. Strict Back/Front separation.
**Delivery Date:** March 5th.

#### 🔧 Technical Tasks (Top Priority)

1. **API Contract First:** Define the OpenAPI (Swagger) specification for Auth, Questions, and Geolocation endpoints. This allows Frontend and Backend to work in parallel.
2. **Environment Setup:** Repository, Basic CI/CD, and Database (PostGIS or similar for geolocation).
3. **Cloud Deployment (MVP v0):** Deploy a "Hello World" connected to the DB to ensure infrastructure from week 1.

#### 👤 User Stories (Functionality)

* **US-01 & US-03 (Auth):** Registration and Login .
* **US-11 (Map):** Implement map view (Google Maps/Mapbox) and rendering of pins from the API.
* **US-08 (Create Question):** Form to submit a question with current latitude/longitude. Backend validates and saves.
* **US-XX (System):** Logic for automatic question expiration (Basic Cronjob or TTL in database).

**S1 Deliverable:** An accessible URL where you can register, view the map, and post a question (appears as a dot on the map).

---

## Sprint 2: Interaction & Visualization (Answers + Event Reading)

**Objective:** Close the communication loop (Answer/Vote) and introduce Event visualization to populate the map.
**Delivery Date:** March 26th.

#### 🔧 Technical Tasks

1. **"Proof of Presence" Logic:** Refine Backend validation to ensure the responder (US-09) is within the question's radius.
2. **Geospatial Query Optimization:** Ensure fast loading of pins.

#### 👤 User Stories (Functionality)

* **US-13 (Threads):** Detail view when clicking on a question.
* **US-09 (Answer):** Ability to send text answers.
* **US-10 (Rating):** Like/Dislike system on answers.
* **US-15 & US-16 (View Events):** Events are added to the map (visual distinction between Question and Event). *Note: Events can be inserted via Database or simple Admin for now to test visualization.*
* **US-06 (Profile):** View basic user data and simple statistics.

**S2 Deliverable:** The app is now useful. Users can ask and answer, verifying location. Events are visible on the map (even if not yet created from the app).

---

## Sprint 3: Business Management & Gamification

**Objective:** Allow businesses to manage their events (Create/Edit) and add the gamification layer (Coins) and notifications.
**Delivery Date:** April 16th.

#### 🔧 Technical Tasks

1. **Roles and Permissions:** Differentiate between `User` and `Business` in Backend.
2. **Notification Service:** Implementation of Push Notifications (Firebase/OneSignal).

#### 👤 User Stories (Functionality)

* **US-28 (Business Registration):** Differentiated flow for companies.
* **US-29 & US-30 (Event Management):** Complete CRUD of events from the business user interface.
* **US-35 & US-23 (Coins/Gamification):** Backend adds coins upon answering. Frontend shows the balance in the profile.
* **US-12 (Notifications):** Alert when someone answers your question.
* **US-37 (Basic Admin):** A simple view for administrators to approve business accounts (US-39).

**S3 Deliverable (Complete MVP):** The application meets the basic promise: Users ask/answer and earn coins; Businesses create events to attract people. Everything functional and deployed.
