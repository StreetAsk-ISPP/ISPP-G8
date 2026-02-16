# Tecnological Stack

## Backend Development

The backend of StreetAsk is designed as a scalable RESTful service responsible for managing users, questions, answers, and geolocation-based filtering logic.

### Selected Stack

The backend of StreetAsk will be developed using:

- **Language:** Java
- **Framework:** Spring Boot
- **Architecture:** RESTful API
- **Persistence Layer:** Spring Data JPA / Hibernate
- **Database:** Relational database
- **Security:** Spring Security
- **Testing:** JUnit 5 + Mockito
- **Build Tool:** Maven

---

### Justification for the Selection

The decision to use **Java + Spring Boot** is based on the following factors:

#### 1. Team Experience
All team members are familiar with Java and Spring Boot. This reduces the learning curve and minimizes technical blocking in a large team (21 members).

#### 2. Stability and Maturity
Spring Boot is a mature, well-documented framework with strong community support. It provides robust tools for:
- REST API development
- Security configuration
- Database integration
- Dependency management

#### 3. Scalability and Maintainability
The backend follows a layered architecture (Controller–Service–Repository), which promotes separation of concerns and improves maintainability.
- Role management
- Advanced analytics
- Monetization features
- Event systems

#### 4. Alignment with MVP Requirements
StreetAsk requires:
- User authentication
- Real-time question/answer endpoints
- Expiration logic for questions
- Geolocation-based filtering

Spring Boot allows implementing these requirements in a structured and secure way.


### Alternatives Considered

---

#### Node.js (Express / NestJS)
**Pros:**
- Fast for prototyping
- Large ecosystem

**Cons:**
- Lower team familiarity
- Higher risk of inconsistent architecture in a large team

---

#### Python (Django / FastAPI)
**Pros:**
- Rapid development
- Clean syntax

**Cons:**
- Less backend experience in the team compared to Java
- Risk of coordination issues

---

Java + Spring Boot was selected because it minimizes risk and maximizes productivity within the team.

---

### Risk Analysis and Mitigation Plan

| Risk | Impact | Mitigation Strategy |
|------|--------|--------------------|
| R1: Complexity of Spring configuration | Medium | Define a standard project structure and coding conventions. Use code reviews. |
| R2: Performance issues in geolocation filtering | High | Use indexed queries, optimized calculations (e.g., Haversine formula), and pagination. |
| R3: Security vulnerabilities (location data) | High | Implement Spring Security, input validation, and limit sensitive data storage. |
| R4: Merge conflicts due to large team size | High | Use feature branches, pull request reviews, and keep trunk updated. |
| R5: Overengineering in MVP | Medium | Keep implementation minimal and aligned with MVP scope. |
| R6: Insufficient test coverage | High | Enforce unit testing before merge and require passing CI pipelines before integration. |


---

### Conclusion

Java + Spring Boot provides the best balance between technical robustness, team expertise, scalability, and risk reduction. It ensures a stable backend foundation for StreetAsk’s MVP and future expansions.


## Frontend Development

## Backend Deployment

## Frontend Deployment

## Team and Software Management
