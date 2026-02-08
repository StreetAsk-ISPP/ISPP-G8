# Initial Development Guide (Proposal)

## Introduction
This guide defines the proposed structure and baseline guidelines for the project: a geolocation-based social platform to share real-time event information.

---

## 1. System architecture

### 1.1 General architecture (3 tiers)

**Presentation layer (Frontend)**
- Web application
- Mobile application (optional for MVP)
- UI with interactive maps

**Logic layer (Backend)**
- RESTful API
- Authentication and authorization (JWT)
- Business logic (events, questions, subscriptions, rewards)
- Geolocation services
- WebSockets (live chat and notifications)

**Data layer**
- Relational database with geospatial support
- Cache system for performance
- File storage (images, media)
- External services (maps, push notifications)

---

## 2. Recommended technology stack

### 2.1 Backend
**Main options:**
- **Node.js** with Express/Fastify + TypeScript
- **Python** with FastAPI/Django
- **Java** with Spring Boot

**ORM/Database:**
- PostgreSQL + PostGIS (for geolocation)
- Prisma, TypeORM, or SQLAlchemy as ORM

**Authentication:**
- JWT (JSON Web Tokens)
- Bcrypt for password hashing

### 2.2 Frontend
**Web:**
- React or Vue.js with TypeScript
- Tailwind CSS for styling
- React Leaflet or Google Maps for maps

**Mobile (optional):**
- React Native or Flutter
- Android Studio (for native Android development)

### 2.3 Infrastructure
- **Cache**: Redis
- **Storage**: AWS S3, Google Cloud Storage, or similar
- **Containers**: Docker
- **CI/CD**: GitHub Actions
- **Hosting**: AWS, Google Cloud, Railway, or Vercel

---

## 3. Project structure

### 3.1 Backend

```
backend/
├── src/
│   ├── config/              # Configuration (DB, JWT, env)
│   ├── entities/            # Domain models
│   ├── controllers/         # HTTP controllers
│   ├── services/            # Business logic
│   ├── repositories/        # Data access
│   ├── middlewares/         # Auth, validation, errors
│   ├── routes/              # Route definitions
│   ├── dto/                 # Data Transfer Objects
│   ├── utils/               # Helpers
│   └── websockets/          # WebSocket handlers
├── tests/
├── prisma/                  # Schema and migrations
├── .env.example
├── package.json
└── Dockerfile
```

### 3.2 Frontend

```
frontend/
├── src/
│   ├── components/          # Reusable components
│   │   ├── ui/             # Base components
│   │   ├── map/            # Map components
│   │   └── events/         # Event components
│   ├── pages/              # Pages
│   ├── hooks/              # Custom hooks
│   ├── services/           # API calls
│   ├── store/              # Global state
│   ├── types/              # TypeScript types
│   ├── utils/              # Utilities
│   └── assets/             # Images and icons
├── public/
├── .env.example
└── package.json
```

---

## 4. REST API - Main endpoints

### URL structure
```
Base: /api/v1
```

### Core endpoints

**Authentication**
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
```

**Users**
```
GET    /api/users/me
PUT    /api/users/me
GET    /api/users/:id
```

**Events**
```
GET    /api/events
POST   /api/events
GET    /api/events/:id
PUT    /api/events/:id
DELETE /api/events/:id
GET    /api/events/nearby
POST   /api/events/:id/attend
```

**Questions**
```
GET    /api/questions
POST   /api/questions
GET    /api/questions/:id
GET    /api/questions/nearby
```

**Answers**
```
GET    /api/questions/:id/answers
POST   /api/questions/:id/answers
PUT    /api/answers/:id/verify
```

**Chat**
```
GET    /api/events/:id/chat/messages
POST   /api/events/:id/chat/messages
```

**Notifications**
```
GET    /api/notifications
PUT    /api/notifications/:id/read
```

### Response format

**Success:**
```json
{
  "success": true,
  "data": { /* objeto o array */ }
}
```

**Error:**
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Descripción del error"
  }
}
```


## 5. Key functionality

### 5.1 Geolocation
- Store locations as GPS coordinates (latitude, longitude)
- Use PostGIS for spatial queries
- Implement radius search (nearby events)
- Calculate distances between points

### 5.2 Accounts and plans
- Company accounts are paid-only through a monthly fee
- Only company accounts can create events
- User accounts have two plans: free (with ads) and premium (without ads)
- Premium users can set question duration; free users have a fixed duration of 2 hours

### 5.3 Event and Q&A model
- Inside each event, questions work in a Reddit-like model
- Users ask questions and other users respond within each question
- User questions on the map appear less highlighted than company events

### 5.4 Coin system
- Record all transactions
- Grant coins for verified positive answers
- Coins are redeemed for in-app rewards only (no physical money)
- Examples of rewards: one month of premium, tickets for event rewards
- Maintain a balance history

### 5.5 WebSocket for real time
- Live event chat
- Instant notifications
- Counter updates (attendees, messages)

## 6. Security
- JWT authentication
- Password hashing with bcrypt
- Input data validation
- Rate limiting to prevent abuse
- Properly configured CORS

---

## 7. Database

### 7.1 Technology
- **PostgreSQL** with **PostGIS** extension
- Native geolocation support
- ACID transactions
- Advanced data types (JSON, UUID, Arrays)

### 7.2 Important indexes
- Geospatial indexes on location columns
- Indexes on foreign keys
- Indexes on frequent search fields (email, username)
- Composite indexes for complex queries

### 7.3 Considerations
- Use UUIDs for entity IDs
- Implement soft delete (mark inactive instead of deleting)
- Store timestamps (created_at, updated_at)
- Normalize data to avoid redundancy

---

## 8. Testing

### 8.1 Test types
- **Unit tests**: Test individual functions and methods
- **Integration tests**: Test interactions between components
- **E2E tests**: Test full user flows

### 8.2 Tools
- Backend: Jest, Pytest, or JUnit
- Frontend: Jest, React Testing Library
- E2E: Playwright or Cypress

### 8.3 Coverage
- Target: >70% code coverage
- Prioritize tests for critical business logic

---

## 9. Deployment

### 9.1 Environments
- **Development**: Local with Docker
- **Pre-production**: `trunk` branch
- **Production**: `main` branch

### 9.2 CI/CD
- Run tests automatically on Pull Requests
- Validate code format (linting)
- Automatic build on merge
- Automatic deploy to production from `main`

### 9.3 Monitoring
- Error logs and important events
- Performance metrics (latency, resource usage)
- Alerts for critical errors


