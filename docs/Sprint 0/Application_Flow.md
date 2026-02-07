# Application Flow

> **Note:** This is a first draft of the application flow based on the use cases, connecting the different screens and features.

---

## Main Onboarding and Access Flow

```
US-03 Login
   ↓
US-01 User registration
   ↓
US-02 Choose subscription plan
   ↓
US-06 Basic user profile
   ↓
   ├─────────────────────────────────────────┐
   ↓                                         ↓
US-11 View active questions near me    US-21 View event map
   ↓                                         ↓
US-25 Map toggle (questions / events) ──────┘
```

---

## Questions Flow (App Core)

```
US-11 View active questions near me
   ↓
   ├──→ US-08 Create question
   │       ↓
   │    US-13 Question expiration
   │       ↓
   │    [Question visible on map]
   │
   └──→ US-12 Notification of questions in my area
           ↓
        US-14 View question details and thread
           ↓
           └──→ US-09 Answer questions
                   ↓
                US-10 Rate answers
                   ↓
                US-28 Earn coins for verified answer
```

---

## Automatic Detection and Event Conversion Flow

```
US-21 View event map
   ↓
[System detects multiple questions in same area]
   ↓
US-22 Auto-create event from question density
   ↓
[NEW GENERATED EVENT appears on map]
   ↓
US-23 View event details
   ↓
US-39 Mark attendance to event
```

---

## User-Created Events Flow

```
US-15 Create my events
   ↓
US-17 See my events
   ↓
   ├──→ US-16 Edit my events
   │       ↓
   │    [Updated event published]
   │
   └──→ US-18 Delete my events
           ↓
        [Event removed from map]
```

---

## Event Discovery and Attendance Flow

```
US-21 View event map
   ↓
   ├──→ US-25 Map toggle (questions / events)
   │
   ├──→ US-26 Event search
   │
   └──→ US-35 Filter events by category
           ↓
        US-24 List of nearby events
           ↓
        US-23 View event details
           ↓
        US-39 Mark attendance to event
           ↓
           ├──→ US-20 Event chat
           │       ↓
           │    [Chat with other attendees]
           │
           ├──→ US-27 Post question about event
           │       ↓
           │    [Question posted about event]
           │
           └──→ US-43 Personal calendar (Post-MVP)
```

---

## Profile Flow, Payments and Rewards

```
US-06 Basic user profile
   ↓
   ├──→ US-04 Edit profile
   │       ↓
   │    [Profile updated]
   │       ↓
   │    US-05 Delete account
   │       ↓
   │    [Account deleted]
   │
   ├──→ US-07 See transactions
   │       ↓
   │    [Transaction history displayed]
   │
   └──→ US-29 View coin balance
           ↓
           ├──→ US-37 Basic rewards store
           │       ↓
           │    [Redeem coins for rewards]
           │
           └──→ US-38 Rewards history
                   ↓
                [View earned/redeemed coins]
```

---

## Notifications Flow (Can occur at any time)

```
[User in specific location]
   ↓
   ├──→ US-12 Notification of questions in my area
   │       ↓
   │    US-14 View question details and thread
   │       ↓
   │    US-09 Answer questions
   │
   └──→ US-36 Notification of nearby events
           ↓
        US-23 View event details
           ↓
        US-39 Mark attendance to event
```

---

## Reports and Moderation Flow

```
[User encounters inappropriate content]
   Business Flow
US-40 Report event or answer
   ↓
[Report sent to admin]

---

[Admin reviews reports]
   ↓
US-32 Admin panel
   ↓
US-33 Moderate inappropriate content
   ↓
   ├──→ [Content removed]
   │
   └──→ US-42 User management
           ↓
        [User suspended/banned]
```

---

## Business Flow

```
US-30 Business account registration
   ↓
[Payment gateway]
   ↓
[Verification request submitted]
   ↓
[Admin verifies via US-34]
   ↓
[Business account approved]
   ↓
US-31 Create sponsored event
   ↓
US-44 Recurring events (Post-MVP)
   ↓
US-41 Highlight event with budget
   ↓
[Event promoted with priority]
   ↓
US-45 Business dashboard (Post-MVP)
   ↓
[View event statistics and metrics]
```

---

## Admin Flow

```
US-32 Admin panel
   ↓
[Dashboard with key metrics]
   ↓
   │
   ├──→ US-34 Verify business accounts
   │       ↓
   │    [Approve/reject business requests]
```

