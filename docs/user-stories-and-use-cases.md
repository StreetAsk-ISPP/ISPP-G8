# User Stories and Use Cases
This document presents the user stories and real-world use cases identified for the application.
Additionally, it describes the prioritization methodology applied to these requirements, based on an adapted MoSCoW framework for defining the scope of the minimum viable product (MVP).

## Prioritization Methodology
The stories are organized into three priority levels based on the MoSCoW framework adapted for MVP:

1. **P0 (Must Have)**: Critical functionality without which the MVP is not viable
2. **P1 (Should Have)**: Important functionality that adds significant value to the MVP
3. **P2 (Could Have)**: Desirable functionality for post-MVP versions

## Use Cases

**UC-01: Location-Based Question Broadcast**
- **Goal:** To allow users to crowdsource real-time information from a specific geographic area.

- **Primary Actor:** Registered User.

- **Preconditions:** User has GPS enabled and is logged in.

- **Main Success Scenario:**

1. User selects the "Ask" tool on the map.

2. User inputs the question and defines the interest radius (e.g., 500m).

3. System identifies all active users within that radius.

4. System sends a push notification to those users.

5. The question appears as a temporary pin on the map.

- **Related Stories:** US-04, US-08, US-09.

**UC-02: Peer-to-Peer Knowledge Validation**
- **Goal:** To ensure the most accurate information rises to the top through community voting.

- **Primary Actor:** Registered User / Contributor.

- **Preconditions:** A question has been asked and at least one answer exists.

- **Main Success Scenario:**

1. User views a question thread.

2. User selects an answer and submits a "Like" or "Dislike."

3. System updates the answer's trust score in real-time.

4. If an answer hits a high threshold of likes, the system highlights it as the "Top Answer."

**Related Stories:** US-06, US-10, US-22.

**UC-03: Algorithmic Event Detection (Hotspots)**
- **Goal:** To automatically identify unorganized events based on high user activity.

- **Primary Actor:** System (Automated).

- **Preconditions:** Multiple users are asking questions in the same vicinity.

- **Main Success Scenario:**

1. System monitors the density of new questions in a specific area.

2. If the count exceeds the threshold (e.g., 5 questions in 10 minutes), the system triggers a "Hotspot."

3. System generates a unique "Active Area" icon on the map for all nearby users.

4. Users can click the icon to see the cluster of questions and answers.

- **Related Stories:** US-16.

**UC-04: Sponsored Event Promotion**
- **Goal:** To allow businesses to gain higher visibility for their events.

- **Primary Actor:** Business User.

- **Preconditions:** Account is verified as a Business; user has a "Sponsorship" balance.

- **Main Success Scenario:**

1. Business user creates an event.

2. User selects the "Promote" option.

3. System applies a distinct visual style (e.g., a glowing gold pin) to the event.

4. System places the event at the top of the "Nearby Events" list for all users.

- **Related Stories:** US-24, US-25, US-35.


**UC-05: Community Reward Redemption**
- **Goal:** To exchange accumulated "Contribution Coins" for digital or physical perks.

- **Primary Actor:** Registered User.

- **Preconditions:** User has a positive coin balance.

- **Main Success Scenario:**

1. User navigates to the "Rewards Store."

2. User selects a reward (e.g., a "Local Expert" badge).

3. System verifies if the user has sufficient coins.

4. System deducts the coins and updates the user's profile statistics.

- **Related Stories:** US-23, US-31, US-32.


- **UC-06:** Interactive Event Chat

**Goal:** To provide a real-time communication channel for people attending the same event.

- **Primary Actor:** System.

- **Preconditions:** Existing event that has people going.

- **Main Success Scenario:**

1. System creates a chat for the event.

2. Atendees are able to talk to eachother in the chat.

3. System deletes the chat after the event has ended.

**Related Story:** US-14.


**UC-07: Content Moderation & Banning**

- **Goal:** To allow admins to clean the map of spam or offensive content.

- **Primary Actor:** Admin.

- **Preconditions:** Offensive content has been produced and noticed.

- **Main Success Scenario:**

1. User reports content

2. Admin identifies user and/or question/event.

3. Admin checks if the content is offensive.

3. Admin bans user and deletes the question or event.

- **Related Story:** US-27, US-34, US-36.


## User Stories
### Critical Stories for MVP - Must Have
**US-01: User registration**
- **As** a new visitor,
- **I want** to register with email and password,
- **So that** I can access the application and create events.

**US-02: Login**
- **As** a registered user,
- **I want** to log in with my credentials,
- **So that** I can access my profile and personalized features.

**US-03: Basic user profile**
- **As** a registered user,
- **I want** to view my profile and basic statistics,
- **So that** I can track my activity.

**US-04: Create question**
- **As** a registered user,
- **I want** to create a question by selecting a point or area on the map and defining a radius,
- **So that** only people near that area receive the question and can answer.

**US-05: Answer questions**
- **As** a user with useful information,
- **I want** to answer questions from other users,
- **So that** I can help the community and earn rewards.

**US-06: Rate answers**
- **As** a user,
- **I want** to be able to rate other users' answers using a star rating system (1 to 5 stars),
- **So that** the most reliable and useful answers are more visible and I get the information I was looking for, with a more nuanced evaluation than just like or dislike.

**US-07: View active questions near me**
- **As** a user who is in an area,
- **I want** to see the active questions within a radius around my current location,
- **So that** I can answer in real time what people want to know in that area.

**US-08: Notification or update of questions in my area**
- **As** a user who is in an area,
- **I want** to be notified or see updates when a new question is created near me,
- **So that** I can decide if I want to answer it at that moment.

**US-09: Question expiration**
- **As** the creator of a question,
- **I want** my question to automatically expire after a defined time,
- **So that** the information seen on the map remains relevant and up to date.

**US-10: View question details and thread**
- **As** a user,
- **I want** to open a question and see all associated answers in a thread format,
- **So that** I can follow the specific conversation about that topic in that area.


### Important Stories for MVP - Should Have

**US-11: Create my events**
- **As** registered user,
- **I want** publish an event,
- **So that** I can correct errors or update relevant details.

**US-12: Edit my events**
- **As** an event creator,
- **I want** to edit the information of my published events,
- **So that** I can correct errors or update relevant details.

**US-13: Delete my events**
- **As** an event creator,
- **I want** to delete events I have created,
- **So that** I can remove obsolete information or cancellations.

**US-14: Event chat**
- **As** an event attendee,
- **I want** to chat with other attendees,
- **So that** I can coordinate details or meet people before the event.

**US-15: View event map**
- **As** a user,
- **I want** to see an interactive map with nearby events represented by visual icons,
- **So that** I can quickly discover what's happening around me.

**US-16: Auto-create event from question density**

- **As** a user viewing the map,
- **I want** the system to automatically detect when multiple questions are created in the same area within a short time,
- **So that** a event marker is created automatically and other users can discover that something interesting is happening there.

**US-17: View event details**
- **As** a user,
- **I want** to click on an event from the map or list to see all its details,
- **So that** I can get complete information before deciding to attend.

**US-18: List of nearby events**
- **As** a user,
- **I want** to see a list of events sorted by proximity or date,
- **So that** I have an alternative to the map when I prefer detailed information.

**US-19: View number of attendees**
- **As** a user viewing an event,
- **I want** to see how many people have confirmed attendance,
- **So that** I can assess the popularity of the event.

**US-20: Event search**
- **As** a user,
- **I want** to search for events by keyword, location, or date,
- **So that** I can find specific events without having to browse the map.

**US-21: Post question about event**
- **As** a user interested in an event,
- **I want** to post a question related to the event,
- **So that** I can get additional information from other attendees or creators.

**US-22: Earn coins for verified answer**
- **As** a user who answers questions,
- **I want** to receive coins when my answer is marked as correct,
- **So that** I feel rewarded for contributing value to the community.

**US-23: View coin balance**
- **As** a registered user,
- **I want** to see my current coin balance in my profile,
- **So that** I know how many rewards I have accumulated.

**US-24: Business account registration**
- **As** an event organizing company,
- **I want** to register with a verified business account,
- **So that** I can publish official events with greater visibility.

**US-25: Create sponsored event**
- **As** a verified company,
- **I want** to create events with a "sponsored" or "official" label,
- **So that** I can promote my events with higher priority on the map and lists.

**US-26: Admin panel**
- **As** a system administrator,
- **I want** to access a control panel with key metrics,
- **So that** I can monitor application information (active users, events created, verified answers...).

**US-27: Moderate inappropriate content**
- **As** an administrator,
- **I want** to delete events or answers that violate the rules,
- **So that** I can maintain the quality and safety of the platform.

**US-28: Verify business accounts**
- **As** an administrator,
- **I want** to approve or reject business verification requests,
- **So that** only legitimate companies get sponsorship privileges.

**US-29: Filter events by category**
- **As** a user,
- **I want** to filter events by categories (music, sports, gastronomy, emergencies, etc.),
- **So that** I can quickly find events of interest.

**US-30: Notification of nearby events**
- **As** a user,
- **I want** to receive notifications when an event is created very close to my location,
- **So that** I am informed in real time about what's happening around me.

**US-31: Basic rewards store**
- **As** a user with accumulated coins,
- **I want** to redeem my coins for rewards within the app (badges, highlights, priority in listings),
- **So that** I can make use of the coins I have earned.

**US-32: Rewards history**
- **As** a user,
- **I want** to see a history of coins earned and redeemed,
- **So that** I can track my activity and rewards.

**US-33: Mark attendance to event**
- **As** an interested user,
- **I want** to mark that I will attend an event,
- **So that** others can see the level of interest and confirm my participation.

**US-34: Report event or answer**
- **As** a user,
- **I want** to report inappropriate content or spam,
- **So that** I can help maintain the quality of the platform.


**US-35: Highlight event with budget**
- **As** a company,
- **I want** to pay to highlight my event for a limited time,
- **So that** I can increase the visibility and reach of my event.

**US-36: User management**
- **As** an administrator,
- **I want** to suspend or ban users who repeatedly violate the rules,
- **So that** I can protect the community from abusive behavior.

### Desirable Stories Post-MVP - Could Have
**US-37: Personal calendar**
- **As** a user,
- **I want** to sync future events with my personal calendar,
- **So that** I can manage my schedule.

**US-38: Recurring events**
- **As** an event organizer,
- **I want** to create recurring events (weekly, monthly, daily...),
- **So that** I don't have to manually create the same event multiple times.

**US-39: Business dashboard**
- **As** a verified company,
- **I want** to access a dashboard with statistics of my events (views, attendees, interactions),
- **So that** I can measure the impact of my sponsored events.