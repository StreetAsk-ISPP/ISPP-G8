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
  5. The question appears as a temporary pin on the map, visually less highlighted than company events.  
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
- **Related Stories:** US-06, US-10, US-22.

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
- **Preconditions:** Account is verified as a Business with a paid monthly subscription; user has a "Sponsorship" balance.  
- **Main Success Scenario:**  
  1. Business user creates an event.  
  2. User selects the "Promote" option.  
  3. System applies a distinct visual style (e.g., a glowing gold pin) to the event, making it more prominent than user questions.  
  4. System places the event at the top of the "Nearby Events" list for all users.  
- **Related Stories:** US-24, US-25, US-35.

**UC-05: Community Reward Redemption**  
- **Goal:** To exchange accumulated "Contribution Coins" for in-app rewards such as premium subscription time, event tickets, badges, or other digital perks (coins cannot be redeemed for physical money).  
- **Primary Actor:** Registered User.  
- **Preconditions:** User has a positive coin balance.  
- **Main Success Scenario:**  
  1. User navigates to the "Rewards Store."  
  2. User selects a reward (e.g., a "Local Expert" badge or one month of premium subscription).  
  3. System verifies if the user has sufficient coins.  
  4. System deducts the coins and updates the user's profile statistics.  
- **Related Stories:** US-23, US-31, US-32.

**UC-06: Interactive Event Chat (Reddit-like Q&A Model)**  
- **Goal:** To provide a real-time, Reddit-like communication channel within events where users ask questions and others respond in threaded format.  
- **Primary Actor:** System.  
- **Preconditions:** Existing event with attendees.  
- **Main Success Scenario:**  
  1. System creates a chat thread for each question within the event.  
  2. Attendees can post questions and respond in threads.  
  3. System deletes the chat after the event has ended.  
- **Related Story:** US-14.

**UC-07: Content Moderation & Banning**  
- **Goal:** To allow admins to clean the map of spam or offensive content.  
- **Primary Actor:** Admin.  
- **Preconditions:** Offensive content has been produced and reported.  
- **Main Success Scenario:**  
  1. User reports content.  
  2. Admin identifies user and/or question/event.  
  3. Admin checks if the content is offensive.  
  4. Admin bans user and deletes the question or event.  
- **Related Story:** US-27, US-34, US-36.

## User Stories

### Critical Stories for MVP - Must Have

**US-01: User registration**  
- **As** a new visitor,  
- **I want** to register with email and password,  
- **So that** I can access the application and create questions.

**US-02: Choose subscription plan**  
- **As** a registered user,  
- **I want** to choose one of two plans: Free (with ads and fixed question duration of 2 hours) or Premium (ad-free with configurable question duration),  
- **So that** I can access the benefits of my desired plan.

**US-03: Login**  
- **As** a registered user,  
- **I want** to log in with my credentials,  
- **So that** I can access my profile and personalized features.

**US-04: Edit profile**  
- **As** a registered user,  
- **I want** to edit my profile,  
- **So that** I can keep my profile up to date.

**US-05: Delete account**  
- **As** a registered user,  
- **I want** to delete my account,  
- **So that** I don't have an open account which will not be used.

**US-06: Basic user profile**  
- **As** a registered user,  
- **I want** to view my profile and basic statistics,  
- **So that** I can track my activity.

**US-07: See Transactions**  
- **As** a registered user,  
- **I want** to view a list of my past transactions,  
- **So that** I can track and manage my spendings.

**US-08: Create question**  
- **As** a registered user,  
- **I want** to create a question by selecting a point or area on the map and defining a radius and duration (if premium),  
- **So that** only people near that area receive the question and can answer.

**US-09: Answer questions**  
- **As** a user with useful information,  
- **I want** to answer questions from other users,  
- **So that** I can help the community and earn rewards.

**US-10: Rate answers**  
- **As** a user,  
- **I want** to be able to rate other users' answers using a star rating system (1 to 5 stars),  
- **So that** the most reliable and useful answers are more visible and I get better information.

**US-11: View active questions near me**  
- **As** a user in an area,  
- **I want** to see the active questions within a radius around my current location,  
- **So that** I can answer in real time what people want to know.

**US-12: Notification or update of questions in my area**  
- **As** a user in an area,  
- **I want** to be notified or see updates when a new question is created near me,  
- **So that** I can decide if I want to answer it.

**US-13: Question expiration**  
- **As** the creator of a question,  
- **I want** my question to automatically expire after a defined time (fixed 2 hours for free users),  
- **So that** the information on the map remains relevant.

**US-14: View question details and thread**  
- **As** a user,  
- **I want** to open a question and see all associated answers in a thread format (Reddit-like),  
- **So that** I can follow the specific conversation about that topic.

### Important Stories for MVP - Should Have

**US-15: Create my events**  
- **As** a business user,  
- **I want** to publish an event,  
- **So that** I can correct errors or update relevant details.

**US-16: Edit my events**  
- **As** a business user,  
- **I want** to edit the information of my published events,  
- **So that** I can correct errors or update relevant details.

**US-17: See my events**  
- **As** a business user,  
- **I want** to have access to a list with all my events,  
- **So that** I have better access to them in order to edit or delete.

**US-18: Delete my events**  
- **As** a business user,  
- **I want** to delete events I have created,  
- **So that** I can remove obsolete information or cancellations.

**US-19: See Assistance**  
- **As** a registered user,  
- **I want** to see a list of events I selected as "Assisting,"  
- **So that** I can organize myself better.

**US-20: Event chat**  
- **As** an event attendee,  
- **I want** to chat with other attendees in a Reddit-like thread format,  
- **So that** I can coordinate details or meet people before the event.

**US-21: View event map**  
- **As** a user,  
- **I want** to see an interactive map with nearby events represented by visual icons,  
- **So that** I can quickly discover what's happening around me.

**US-22: Auto-create event from question density**  
- **As** a user viewing the map,  
- **I want** the system to automatically detect when multiple questions are created in the same area within a short time,  
- **So that** an event marker is created automatically and other users can discover that something interesting is happening there.

**US-23: View event details**  
- **As** a user,  
- **I want** to click on an event from the map or list to see all its details (time, place, number of attendees),  
- **So that** I can get complete information before deciding to attend.

**US-24: List of nearby events**  
- **As** a user,  
- **I want** to see a list of events sorted by proximity or date,  
- **So that** I have an alternative to the map when I prefer detailed information.

**US-25: Map toggle**  
- **As** a user,  
- **I want** to have a toggle that will show events (in blue) or questions (in red),  
- **So that** it is easier for me to browse through the map.

**US-26: Event search**  
- **As** a user,  
- **I want** to search for events by keyword, location, or date,  
- **So that** I can find specific events without having to browse the map.

**US-27: Post question about event**  
- **As** a user interested in an event,  
- **I want** to post a question related to the event,  
- **So that** I can get additional information from other attendees or creators.

**US-28: Earn coins for verified answer**  
- **As** a user who answers questions,  
- **I want** to receive coins when my answer is marked as correct,  
- **So that** I feel rewarded for contributing value to the community.

**US-29: View coin balance**  
- **As** a registered user,  
- **I want** to see my current coin balance in my profile,  
- **So that** I know how many rewards I have accumulated.

**US-30: Business account registration**  
- **As** an event organizing company,  
- **I want** to register with a verified, paid business account (monthly fee),  
- **So that** I can publish official events with greater visibility.

**US-31: Create sponsored event**  
- **As** a verified company,  
- **I want** to create events with a "sponsored" or "official" label,  
- **So that** I can promote my events with higher priority on the map and lists.

**US-32: Admin panel**  
- **As** a system administrator,  
- **I want** to access a control panel with key metrics,  
- **So that** I can monitor application information (active users, events created, verified answers...).

**US-33: Moderate inappropriate content**  
- **As** an administrator,  
- **I want** to delete events or answers that violate the rules,  
- **So that** I can maintain the quality and safety of the platform.

**US-34: Verify business accounts**  
- **As** an administrator,  
- **I want** to approve or reject business verification requests,  
- **So that** only legitimate companies get sponsorship privileges.

**US-35: Filter events by category**  
- **As** a user,  
- **I want** to filter events by categories (music, sports, gastronomy, emergencies, etc.),  
- **So that** I can quickly find events of interest.

**US-36: Notification of nearby events**  
- **As** a user,  
- **I want** to receive notifications when an event is created very close to my location,  
- **So that** I am informed in real time about what's happening around me.

**US-37: Basic rewards store**  
- **As** a user with accumulated coins,  
- **I want** to redeem my coins for in-app rewards (badges, highlights, premium time),  
- **So that** I can make use of the coins I have earned.

**US-38: Rewards history**  
- **As** a user,  
- **I want** to see a history of coins earned and redeemed,  
- **So that** I can track my activity and rewards.

**US-39: Mark attendance to event**  
- **As** an interested user,  
- **I want** to mark that I will attend an event,  
- **So that** others can see the level of interest and confirm my participation.

**US-40: Report event or answer**  
- **As** a user,  
- **I want** to report inappropriate content or spam,  
- **So that** I can help maintain the quality of the platform.

**US-41: Highlight event with budget**  
- **As** a company,  
- **I want** to pay to highlight my event for a limited time,  
- **So that** I can increase the visibility and reach of my event.

**US-42: User management**  
- **As** an administrator,  
- **I want** to suspend or ban users who repeatedly violate the rules,  
- **So that** I can protect the community from abusive behavior.

### Desirable Stories Post-MVP - Could Have

**US-43: Personal calendar**  
- **As** a user,  
- **I want** to sync future events with my personal calendar,  
- **So that** I can manage my schedule.

**US-44: Recurring events**  
- **As** an event organizer,  
- **I want** to create recurring events (weekly, monthly, daily...),  
- **So that** I don't have to manually create the same event multiple times.

**US-45: Business dashboard**  
- **As** a verified company,  
- **I want** to access a dashboard with statistics of my events (views, attendees, interactions),  
- **So that** I can measure the impact of my sponsored events.
