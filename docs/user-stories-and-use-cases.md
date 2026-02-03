# User Stories and Use Cases
This document presents the user stories and real-world use cases identified for the application.
Additionally, it describes the prioritization methodology applied to these requirements, based on an adapted MoSCoW framework for defining the scope of the minimum viable product (MVP).

## Prioritization Methodology
The stories are organized into three priority levels based on the MoSCoW framework adapted for MVP:

1. **P0 (Must Have)**: Critical functionality without which the MVP is not viable
2. **P1 (Should Have)**: Important functionality that adds significant value to the MVP
3. **P2 (Could Have)**: Desirable functionality for post-MVP versions

## Use Cases

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

**US-06: Vote answers (like/dislike)**
- **As** a user,
- **I want** to be able to vote on other users' answers (for example with like or dislike),
- **So that** the most reliable and useful answers are more visible and I get the information I was looking for.

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