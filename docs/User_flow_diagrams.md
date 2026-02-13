# Application Flow Diagram

## Complete Flow by User Type

---

## 1. Initial Flow (All Users)

```
                                    US3 (Login)
                                         |
                        +----------------+----------------+
                        |                                 |
                   US1 (Register)               US11 (Main Panel)
                        |
            +-----------+-----------+
            |                       |
    Normal Account          Business Account
            |                       |
            |              US27 (NIF and Address)
            |                       |
            |              Payment Gateway
            |                       |
            |              Email to Admin
            |                       |
            +-------+-------+-------+
                    |
            US11 (Main Panel)
```

### Initial Flow Summary

US3 is the login screen. From there, the user can go to US1 (register) or directly to US11 (main panel) if they already have an account.

In US1, the user chooses between a normal account or a business account. If they choose a normal account, they go directly to US11. If they choose a business account, they go to US27, where they must enter the company's NIF and address. From US27 they proceed to a payment gateway, and after completing the payment, an email is sent to the administrator to verify the data. If everything is correct, the account is created and they access US11.

---

## 2. Normal User - Complete Flow

```
US11 – Main Panel
│
├── US6 – Profile
│   ├── US4 – Edit profile
│   ├── US23 – Balance
│   │   ├── US25 – Store
│   │   └── US26 – Rewards history
│   ├── US7 – My purchases
│   └── US5 – Delete account
│
├── US20 – My questions
│   ├── US13 – View Q&A
│   ├── US37 – Delete answer
│   └── US43 – Report content
│
├── US19 – Active questions
│   ├── US9 – Answer question
│   ├── US10 – View ratio
│   └── US13 – View Q&A
│
├── US14 – Events I'm attending
│   ├── US22 – Event details
│   └── US21 – Cancel attendance
│
├── US18 – Search events
│   ├── US17 – Search by date
│   ├── US24 – Filter by category
│   └── US41 – Filter by city
│
├── US12 – Notifications
│
├── US2 – Change plan
│
├── US8 – Ask a question
│
├── US15 – Filtered view
│   ├── US16 – Event details
│   ├── US32 – Event questions
│   └── US33 – Post question about event
│
└── US47 – Unified view (US11 + US8)
```

### Normal User Flow Summary

US11 is the main panel from where most functionalities are accessed.

**Profile:** From US11 you can enter the profile (US6). In US6 you can edit the profile (US4), view purchases (US7) or delete the account/logout (US5). You can also access the balance (US23) from where you go to the store (US25) or rewards history (US26).

**Questions:** From US11 you can go to US20 (my questions) or US19 (active questions). From US20 you can view Q&A details (US13), delete an answer (US37) or report inappropriate content (US43). From US19 you can also go to US13, answer questions (US9) or view the ratio (US10).

**Events:** From US11 you can go to US14 to see the events the user is attending. From US14 you can view event details (US22) or cancel attendance (US21). Also from US11 you can go to US18 to search for events, filtering by date (US17), category (US24) or city (US41).

**Ask a Question:** From US11 you can ask a question by pressing the "ask a question" button (US8). When they answer the question, a nearby question is created or a new event is published, the user receives a notification (US12).

**Filtered View:** In US11 there is a button to view all questions and events. If that button is deactivated, you move to US15 (filtered view). From US15 you can enter event details (US16), post a question about that event (US33) or view event questions (US32).

**Other functionalities:** The union of US11 and US8 is reflected in US47 (unified view). From US11 you can also go to US2 to change the plan, but only if the user has a normal account.

---

## 3. Business - Complete Flow

```
US15 – Filtered view
│
├── US6 – Profile
│   ├── US4 – Edit profile
│   ├── US20 – My questions
│   ├── US19 – Active questions
│   ├── US23 – Balance
│   │   ├── US25 – Store
│   │   └── US26 – Rewards history
│   ├── US7 – My purchases
│   └── US5 – Delete account
│
├── US18 – Search events
│   ├── US17 – Search by date
│   ├── US24 – Filter by category
│   └── US41 – Filter by city
│
├── US12 – Notifications
│
├── US28 – Create event
│   └── US44 – Highlighted event
│
├── US45 – Create recurring event
│   └── US44 – Highlighted event
│
├── If Verified Business:
│   ├── US35 – Create sponsored event
│   └── US46 – Verified business dashboard
│
├── US16 – Event details
│   ├── US32 – Event questions
│   └── US33 – Post question about event
│       └── US34 – Earn coins for answering
│
├── US32 – Event questions
│
├── US33 – Post question about event
│
├── US30 – My events (business)
│   ├── US29 – Edit event
│   ├── US31 – Delete event
│   └── US32 – View event questions
│       └── US33 – Event forum
│           └── US34 – Earn coins for answering
│
└── US47 – Unified view (US11 + US8)
```

### Business Flow Summary

Businesses work mainly from US15 (filtered view), where they have access to specific functionalities in addition to the basic profile, event search and notification functionalities.

**Event creation:** ALL businesses (verified or not) can create events in US28 (marking them as highlighted in US44) or create recurring events in US45 (also highlightable in US44).

**Exclusive functionalities for verified businesses:** In addition to all the previous functionalities, verified businesses can create sponsored events in US35 and access the verified business dashboard in US46.

**Event management:** The business can manage its events from US30 (my events). From US30 they can edit an event (US29), delete it (US31) or view event questions (US32). From US32 they can enter the event forum (US33) and, if they answer questions, they can earn coins (US34).

**Event interaction:** From US16 (event details) you can go to event questions (US32) or post a question about the event (US33), which can also generate coins (US34).

**Other functionalities:** Businesses share the same profile (US6) and balance (US23) functionalities as normal users, in addition to being able to search for events (US18) and receive notifications (US12).

---

## 4. Administrator - Complete Flow

```
                        US36 (Admin Panel)
                               |
                +-------------+-------------+
                |             |             |
               US39          US38          US41
       (Delete Content)  (Verifications) (View Accounts)
```

### Administrator Flow Summary

If the user is an administrator, they can access the administration panel (US36). From US36 they can:
- Delete inappropriate content (US39)
- Approve or reject business verification requests (US38)
- View user accounts (US41)

---

## Legend

- **US1**: Account registration
- **US2**: Change plan
- **US3**: Login screen
- **US4**: Edit profile
- **US5**: Delete account
- **US6**: View profile
- **US7**: My purchases
- **US8**: Ask a question
- **US9**: Answer questions
- **US10**: View ratio
- **US11**: Main panel
- **US12**: Notifications
- **US13**: View questions and answers
- **US14**: Events I'm attending
- **US15**: Main panel with filter activated
- **US16**: Event details
- **US17**: Search events by date
- **US18**: Search events
- **US19**: Active questions
- **US20**: My questions
- **US21**: Cancel event attendance
- **US22**: Event details
- **US23**: Coin balance
- **US24**: Filter events by category
- **US25**: Store
- **US26**: Rewards history
- **US27**: Business verification (NIF and address)
- **US28**: Create event (business)
- **US29**: Edit event (business)
- **US30**: View my events (business)
- **US31**: Delete event (business)
- **US32**: View event questions
- **US33**: Post question about event / Forum
- **US34**: Earn coins for answering (business)
- **US35**: Create sponsored event (verified business)
- **US36**: Administrator panel
- **US37**: Delete answer
- **US38**: Approve/reject verifications (admin)
- **US39**: Delete inappropriate content (admin)
- **US41**: Filter events by city
- **US43**: Report inappropriate content
- **US44**: Create highlighted event (business)
- **US45**: Create recurring event (business)
- **US46**: Verified business dashboard
- **US47**: Unified view US11 + US8
