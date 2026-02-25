# System Entity Definitions

## Introduction
This document describes the main system entities identified from the user stories and use cases defined for the MVP. The application is a geolocation-based social platform where users can create events, ask questions, share real-time information, and earn rewards for their participation.

---

## Base Entities

### 1. User
Base entity representing authentication for any person on the platform. Parent class of `RegularUser`, `BusinessAccount`, and `Admin`.

**Attributes:**
- `id` (UUID): Unique user identifier
- `email` (String): Unique email address
- `username` (String): Unique username
- `first_name` (String): First name
- `last_name` (String): Last name(s)
- `password` (String): Encrypted password
- `account_type` (Enum): `REGULAR_USER`, `BUSINESS`, `ADMIN`
- `active` (Boolean): Whether the account is active
- `created_at` (DateTime): Account creation date
- `last_login` (DateTime): Last time the user was active

**Relationships:**
- Can extend to `RegularUser` (1:1)
- Can extend to `BusinessAccount` (1:1)
- Can extend to `Admin` (1:1)

**Note:** `User` is an abstract entity. Each record must have exactly one extension (`RegularUser`, `BusinessAccount`, or `Admin`).

---

### 2. RegularUser
Regular application user. Inherits from `User` and adds interaction, gamification, and geolocation features.

**Attributes:**
- `id` (UUID): Unique identifier
- `user_id` (UUID): Reference to base user (FK)
- `phone` (String, optional): Phone number
- `profile_photo` (String): Profile image URL
- `coin_balance` (Integer): Accumulated virtual coins (Contribution Coins)
- `rating` (Float): User rating based on (positive_answers - negative_answers) / total_answers, scale of 5
- `visibility_radius_km` (Float): User visibility radius in kilometers for geolocation features
- `verified` (Boolean): Whether the regular user account is verified

**Relationships:**
- Extends `User` (1:1)
- Can ask multiple questions (1:N with `Question`)
- Can answer multiple questions (1:N with `Answer`)
- Can attend multiple events (N:M with `Event` via `EventAttendance`)
- Can receive multiple notifications (1:N with `Notification`)
- Can have multiple coin transactions (1:N with `CoinTransaction`)
- Can report content (1:N with `Report`)
- Can redeem rewards (N:M with `Reward`)

---

### 3. BusinessAccount
User extension for companies that organize official events. Inherits from `User`.

**Attributes:**
- `id` (UUID): Unique identifier
- `user_id` (UUID): Reference to base user
- `company_name` (String): Legal company name
- `tax_id` (String): Tax ID
- `address` (String): Company address
- `website` (String, optional): Website URL
- `description` (String, opcional): Company description
- `logo` (String, opcional): Company logo URL
- `verified` (Boolean): Whether the company is verified by admins
- `verified_at` (DateTime, optional): Verification date
- `request_status` (Enum): `PENDING`, `APPROVED`, `REJECTED`
- `subscription_expires_at` (DateTime, optional): Subscription end date

**Relationships:**
- Extends `User` (1:1)
- Can create sponsored events (1:N with `Event`)

---

### 4. Event
Represents an activity or situation located geographically.

**Attributes:**
- `id` (UUID): Unique event identifier
- `creator_id` (UUID): Reference to the creating company
- `title` (String): Event title
- `description` (Text): Detailed description
- `category` (Enum): `LEISURE`, `WELLNESS`, `CULTURE`, `GASTRONOMY`, `EMERGENCY`, `OTHER`
- `location` (Point): Geographic coordinates (latitude, longitude)
- `address` (String): Event address
- `starts_at` (DateTime): Start date/time
- `ends_at` (DateTime, optional): End date/time
- `featured` (Boolean): Whether the event is highlighted (paid)
- `attendee_count` (Integer): Count of confirmed attendees
- `active` (Boolean): Whether the event is visible
- `created_at` (DateTime): Creation date
- `updated_at` (DateTime): Last update date

**Relationships:**
- Belongs to a creating company (N:1 with `User`)
- Can have multiple associated questions (1:N with `Question`)
- Can have multiple confirmed attendances (N:M with `User` via `EventAttendance`)
- Has an associated chat (1:1 with `EventChat`)
- Can be reported (1:N with `Report`)

---

### 5. EventAttendance
N:M relationship table between `RegularUser` and `Event`. Manages user attendance confirmation.

**Attributes:**
- `id` (UUID): Unique identifier
- `regular_user_id` (UUID): Reference to `RegularUser`
- `event_id` (UUID): Reference to `Event`
- `is_attending` (Boolean): Whether the user will attend
- `confirmed_at` (DateTime): Confirmation or status change date

**Relationships:**
- Connects `RegularUser` with `Event` (N:M)
- A user can have only one active record per event (cannot attend the same event multiple times)

**Business Rules:**
- A `RegularUser` can have only one attendance per event
- `Event.attendee_count` is computed by counting records with `is_attending = True`
- On status change, update `confirmed_at`

---

### 6. Question
Represents a question posted by a user related to an event or location.

**Attributes:**
- `id` (UUID): Unique identifier
- `creator_id` (UUID): Reference to the user who asks the question
- `event_id` (UUID, optional): Reference to the related event
- `title` (String): Question title
- `content` (Text): Detailed question description
- `location` (Point): Geographic coordinates
- `radius_km` (Float): Radius for notifying users
- `active` (Boolean): Whether the question is still active
- `expires_at` (DateTime): Automatic expiration date (2h free, configurable premium)
- `created_at` (DateTime): Publication date
- `answer_count` (Integer): Answer counter

**Relationships:**
- Belongs to a user (N:1 with `User`)
- Can be associated with an event (N:1 with `Event`)
- Can have multiple answers (1:N with `Answer`)
- Can be reported (1:N with `Report`)

---

### 7. Answer
Represents an answer to a posted question.

**Attributes:**
- `id` (UUID): Unique identifier
- `question_id` (UUID): Reference to the question
- `user_id` (UUID): Reference to the responding user
- `content` (Text): Answer content
- `is_verified` (Boolean): Whether the question creator marked it as correct
- `verified_at` (DateTime, optional): Verification date
- `coins_earned` (Integer): Coins earned for verified answer
- `user_location` (Point): User location at time of answering (to verify proximity)
- `created_at` (DateTime): Publication date
- `upvotes` (Integer): Positive votes from other users
- `downvotes` (Integer): Negative votes from other users

**Relationships:**
- Belongs to a question (N:1 with `Question`)
- Belongs to a user (N:1 with `User`)
- Can be reported (1:N with `Report`)

---

### 8. AnswerVote
Records likes/dislikes on answers.

**Attributes:**
- `id` (UUID): Unique identifier
- `answer_id` (UUID): Reference to the voted answer
- `user_id` (UUID): Reference to the voting user
- `vote_type` (Enum): `LIKE`, `DISLIKE`
- `voted_at` (DateTime): Vote date

**Relationships:**
- Belongs to an answer (N:1 with `Answer`)
- Belongs to a user (N:1 with `User`)

**Business Rules:**
- A user can vote only once per answer (unique index `user_id` + `answer_id`)
- The responder's rating is calculated as: (answers_with_more_likes - answers_with_more_dislikes) / total_answers on a scale of 5
- The answer author gains 1 coin if likes > dislikes, loses 1 if dislikes > likes

---

### 10. Notification
Represents alerts and notices sent to users.

**Attributes:**
- `id` (UUID): Unique identifier
- `user_id` (UUID): Reference to the recipient user
- `type` (Enum): `NEARBY_QUESTION`, `NEARBY_EVENT`, `ANSWER_TO_QUESTION`, `ANSWER_VERIFIED`, `ADMIN`
- `content` (Text): Notification content
- `reference_id` (UUID, optional): ID of the related event, question, or answer
- `reference_type` (String, optional): Type of referenced entity
- `sent_at` (DateTime): Creation date

**Relationships:**
- Belongs to a user (N:1 with `User`)

---

### 11. CoinTransaction
Record of virtual coin movements for the user.

**Attributes:**
- `id` (UUID): Unique identifier
- `user_id` (UUID): Reference to the user
- `type` (Enum): `EARN`, `SPEND`
- `amount` (Integer): Number of coins (positive or negative)
- `balance_before` (Integer): Balance before the transaction
- `balance_after` (Integer): Balance after the transaction
- `reference_id` (UUID, optional): ID of the related answer, reward, or event
- `created_at` (DateTime): Transaction date

**Relationships:**
- Belongs to a user (N:1 with `User`)

---

### 14. Report
Represents reports of inappropriate content.

**Attributes:**
- `id` (UUID): Unique identifier
- `reporter_id` (UUID): Reference to the reporting user
- `content_id` (UUID): ID of the reported item
- `description` (Text, optional): Additional details
- `status` (Enum): `PENDING`, `UNDER_REVIEW`, `RESOLVED`, `REJECTED`
- `reported_at` (DateTime): Creation date
- `resolved_at` (DateTime, optional): Administrative response date

**Relationships:**
- Belongs to a reporting user (N:1 with `User`)
- Can be reviewed by one or more admins (N:N with `Admin`)

---

### 15. Admin
User extension with administrative permissions. Inherits from `User`.

**Attributes:**
- `id` (UUID): Unique identifier
- `user_id` (UUID): Reference to the base user
- `role` (Enum): `SUPER_ADMIN`, `CONTENT_MODERATOR`, `SUPPORT`
- `permissions` (JSON): List of permitted actions
- `active` (Boolean): Whether permissions are active
- `assigned_at` (DateTime): Role assignment date

**Relationships:**
- Extends `User` (1:1)
- Can resolve reports (1:N with `Report`)
- Can verify business accounts (1:N with `BusinessAccount`)

---

## Summary of Main Relationships
User (1) ──── (1) RegularUser [extends]

User (1) ──── (1) BusinessAccount [extends]

User (1) ──── (1) Admin [extends]

RegularUser (1) ──── (N) Event [creates]

RegularUser (1) ──── (N) Question [publishes]

RegularUser (1) ──── (N) Answer [answers]

RegularUser (N) ──── (M) Event [attends via EventAttendance]

RegularUser (1) ──── (N) Notification [receives]

RegularUser (1) ──── (N) CoinTransaction [has]

RegularUser (N) ──── (M) Reward [redeems via RewardRedemption]

RegularUser (1) ──── (N) Report [reports]

RegularUser (1) ──── (N) ChatMessage [sends]

Event (1) ──── (N) Question [has]

Event (1) ──── (1) EventChat [has]

Event (1) ──── (N) EventAttendance [has]

Event (N) ──── (1) Category [belongs to]

EventAttendance (N) ──── (1) RegularUser

EventAttendance (N) ──── (1) Event

Question (1) ──── (N) Answer [has]

EventChat (1) ──── (N) ChatMessage [contains]

Admin (1) ──── (N) Report [resolves]


---

## UML Diagram - Data Model

### UML Class Diagram

![System UML Diagram](./images/diagramaUML.png)

### Cardinality Legend

- `1` : One-to-one relationship
- `*` : One-to-many relationship
- `0..1` : Optional relationship
