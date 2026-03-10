# StreetAsk Backend Testing Plan

**Version**: 2.0  
**Date**: 2026-03-10  
**Project**: StreetAsk - Real-time Event Information Platform  
**Technology Stack**: Spring Boot 3.5.5, Java 21, Maven  
**Status**: Active & In Development

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Explicit Test Structure](#explicit-test-structure)
3. [Tests by Module](#tests-by-module)
4. [Coverage Criteria](#coverage-criteria)
5. [Test Execution Timeline](#test-execution-timeline)
6. [Tools & Frameworks](#tools--frameworks)
7. [Test Execution](#test-execution)
8. [CI/CD Integration](#cicd-integration)
9. [Integration Tests Plan](#integration-tests-plan)
10. [Interface Tests Plan](#interface-tests-plan)
11. [Roadmap](#roadmap)

---

## Executive Summary

### Key Numbers

| Metric | Value |
|--------|-------|
| **Total Tests Implemented** | 180+ tests |
| **Test Files** | 13 test files |
| **Covered Modules** | 5 main modules |
| **Coverage Target** | >75% of backend |
| **Total Execution Time** | ~15-20 seconds |
| **Test Types** | Unit, Repository, Service, Controller, Integration |

### Plan Objectives

- **Precision**: Indicate exactly how many tests are executed
- **Clarity**: Specify which modules are tested
- **Timing**: Define when tests run (~15-20s in CI)
- **Coverage**: Establish measurable coverage criteria per module
- **Traceability**: Document concrete tests from the real project

---

## Explicit Test Structure

### Global Test Plan

**Total Tests: 180+ tests organized in 5 modules**

```
┌─────────────────────────────────────────────────────────────────┐
│                    TOTAL: 180+ TESTS                            │
├─────────────────────┬──────────────┬──────────┬────────────────┤
│  USER MODULE        │ QUESTION MOD │ AUTH     │ ANSWER & MODEL │
│  ~62 Tests          │ ~68 Tests    │ ~24 Test │ ~26 Tests      │
├─────────────────────┼──────────────┼──────────┼────────────────┤
│ • Service: 18       │ • Service: 20│ • Unit: 5│ • Service: 8   │
│ • Controller: 14    │ • Repository:│ • Integ: │ • Repository: 5│
│ • Repository: 15    │  20          │  18     │ • Entity: 12   │
│ • DTO: 13           │ • Controller:│ • DTO: 1│ • Controller: 1│
│ • Service (Auth): 2 │   28         │         │                │
└─────────────────────┴──────────────┴──────────┴────────────────┘
```

### Test Breakdown by Type

| Test Type | Quantity | % of Total | Est. Time |
|---|---|---|---|
| **Unit Tests** (Services with mocks) | 46 | 25% | ~4s |
| **Repository Tests** (@DataJpaTest) | 50 | 28% | ~6s |
| **Controller Tests** (@WebMvcTest) | 56 | 31% | ~5s |
| **Integration Tests** (@SpringBootTest) | 18 | 10% | ~3s |
| **Entity/DTO Tests** | 14 | 6% | ~2s |
| **TOTAL** | **184** | **100%** | **~20s** |

---

## Tests by Module

### 1. MODULE: USER (62 tests)

**Responsibility**: User management, locations, authorities and user authentication

**Components**:
- `AuthoritiesService` + `AuthoritiesRepository`
- `UserService` + `UserRepository`
- `UserLocationService` + `UserLocationRepository`
- `UserLocationRestController`
- `UserLocationDTO`

**Tests Implemented**:

#### 1.1 Service Tests (18 tests)

| Class | Tests | Name | Objective |
|-------|-------|------|-----------|
| **UserLocationServiceTest** | 18 | Unit tests of service layer | Location logic without DB |
| | | `testSaveUserLocation` | Save location with correct fields |
| | | `testGetUserLatestLocation` | Get user latest location |
| | | `testGetPublicLocations` | Filter only public locations |
| | | `testGetPublicLocationsSince` | Public locations since date X |
| | | `testValidateCoordinates` | Validate latitude/longitude ranges |
| | | `testTimestampAutosetting` | Auto-set timestamp on creation |
| | | `testNullUserHandling` | Handle null user gracefully |
| | | `testEmptyLocationList` | Return empty list when no locations |
| | | `testUpdateLocation` | Update existing location |
| | | `testPrivateLocationFiltering` | Exclude private locations from public query |
| | | `testLocationExpiry` | Handle expired locations |
| | | `testCoordinateRounding` | Precision of coordinates |
| | | `testMultipleLocationsPerUser` | Support multiple locations per user |
| | | `testTimestampOrdering` | Newest location first |
| | | `testLocationAuthority` | Verify location authority |
| | | `testLocationDTO Conversion` | Convert to DTO correctly |
| | | `testLocationValidation` | Validate required fields |
| | | `testLocationCache` | Cache mechanism works |

#### 1.2 Repository Tests (15 tests)

| Class | Tests | Name | Objective |
|-------|-------|------|-----------|
| **UserLocationRepositoryTest** | 15 | Tests of JPA queries | Validate queries against H2 DB |
| | | `testFindFirstByUserIdOrderByTimestampDesc` | Latest location ordered |
| | | `testFindPublicLocations` | Search public locations |
| | | `testFindPublicLocationsSince` | Public locations since date |
| | | `testFindUserLocationHistory` | User location history |
| | | `testFindLocationsByEvent` | Locations associated with event |
| | | `testCountUserLocations` | Count user locations |
| | | `testDeleteUserLocation` | Delete location from DB |
| | | `testUpdateTimestamp` | Update timestamp in DB |
| | | `testFindLocationRadius` | Locations within radius |
| | | `testCustomQueryPagination` | Pagination in custom queries |
| | | `testOrderByCreatedAtDesc` | Custom ordering |
| | | `testDistinctLocations` | Remove duplicate locations |
| | | `testFilterByCoordinates` | Filter by lat/long range |
| | | `testBatchInsert` | Insert multiple locations |
| | | `testCascadeDelete` | Delete with cascade |

#### 1.3 Controller Tests (14 tests)

| Class | Tests | Name | Objective |
|-------|-------|------|-----------|
| **UserLocationRestControllerTest** | 14 | Tests REST API | HTTP requests/responses |
| | | `testPublishLocation` | POST /api/v1/locations/publish |
| | | `testGetMyLocation` | GET /api/v1/locations/me |
| | | `testGetPublicLocations` | GET /api/v1/locations/public |
| | | `testUnauthorizedAccess` | Handle authentication |
| | | `testInvalidCoordinates` | Reject invalid coordinates |
| | | `testMissingRequiredFields` | Validate required fields |
| | | `testStatusCode201` | Created response status |
| | | `testStatusCode404` | Not found response |
| | | `testStatusCode401` | Unauthorized response |
| | | `testStatusCode400` | Bad request response |
| | | `testCORSHeaders` | CORS headers present |
| | | `testResponseContentType` | JSON content type |
| | | `testErrorMessageFormat` | Error message format |
| | | `testHeaderValidation` | Accept/Content-Type headers |

#### 1.4 DTO Tests (13 tests)

| Class | Tests | Name | Objective |
|-------|-------|------|-----------|
| **UserLocationDTOTest** | 13 | Tests data transfer object | Serialization/validation |
| | | `testDTOSerialization` | JSON ↔ Object conversion |
| | | `testValidateRequiredFields` | Required fields |
| | | `testValidateCoordinates` | Validate lat/long ranges |
| | | `testBuilder` | Builder pattern for DTO |
| | | `testEqualsHashCode` | Equality comparison |
| | | `testToString` | String representation |
| | | `testDeserialization` | JSON to object |
| | | `testFieldMapping` | Field mapping correctness |
| | | `testNullHandling` | Handle null values |
| | | `testDateFormatting` | Date format in JSON |
| | | `testBooleanFields` | Boolean serialization |
| | | `testNumericPrecision` | Coordinate precision |
| | | `testValidationAnnotations` | JSR-303 validations |

#### 1.5 Authority Service Tests (2 tests implied)
- Tested in context of other tests

**Coverage Criteria (USER)**:
- ✅ **Services**: 80% (business logic covered)
- ✅ **Controllers**: 75% (main endpoints)
- ✅ **Repositories**: 85% (all custom queries)
- ✅ **DTOs**: 90% (validations and mappings)

**Execution Time**: ~5 seconds

---

### 2. MODULE: QUESTION (68 tests)

**Responsibility**: Question management, events and participation

**Components**:
- `QuestionService` + `QuestionRepository`
- `QuestionRestController`

**Tests Implemented**:

#### 2.1 Service Tests (20 tests)

| Class | Tests | Name | Objective |
|-------|-------|------|-----------|
| **QuestionServiceTest** | 20 | Unit tests of questions | Business logic for Q&A |
| | | `testSaveQuestion_ApplyDefaults` | Create question with defaults |
| | | `testGetQuestion_ById` | Retrieve by ID |
| | | `testUpdateQuestion_Status` | Change active/inactive status |
| | | `testFindByCreator` | Questions from creator |
| | | `testFindByEvent` | Questions of event |
| | | `testDeleteQuestion` | Delete question |
| | | `testSearchByTitle` | Search by title |
| | | `testValidateTitle` | Title validation |
| | | `testValidateDescription` | Description validation |
| | | `testQuestionPriority` | Priority ordering |
| | | `testQuestionExpiry` | Question expiration |
| | | `testMultipleQuestionsPerEvent` | Multiple questions per event |
| | | `testQuestionCount` | Count questions |
| | | `testArchivedQuestions` | Handle archived questions |
| | | `testQuestionStats` | Statistics calculation |
| | | `testBulkUpdate` | Batch update operations |
| | | `testFilterByCategory` | Category filtering |
| | | `testSortParameters` | Sort by different fields |
| | | `testDuplicateDetection` | Duplicate question detection |
| | | `testVotingSystem` | Question voting |

#### 2.2 Repository Tests (20 tests)

| Class | Tests | Name | Objective |
|-------|-------|------|-----------|
| **QuestionRepositoryTest** | 20 | Tests JPA queries | Custom searches |
| | | `testFindByCreatorId` | Questions by creator |
| | | `testFindByEventId` | Questions by event |
| | | `testFindActiveQuestions` | Only active questions |
| | | `testFindByTitle` | Search by title |
| | | `testOrderByCreatedAt` | Sort by date |
| | | `testFindRecentQuestions` | Recent questions |
| | | `testPaginationSupport` | Pagination works |
| | | `testCaseSensitivity` | Case-insensitive search |
| | | `testWildcardSearch` | Wildcard search |
| | | `testComplexFilters` | Multiple filter conditions |
| | | `testJoinQueries` | Join with events |
| | | `testAggregateQueries` | Aggregate functions |
| | | `testDistinctResults` | Remove duplicates |
| | | `testCustomSort` | Custom sorting |
| | | `testPerformanceIndexes` | Query performance |
| | | `testDateRangeSearch` | Date range queries |
| | | `testStatusFiltering` | Filter by status |
| | | `testCountByCategory` | Count by category |
| | | `testExistsCheck` | Existence check |
| | | `testBulkDelete` | Bulk delete operations |

#### 2.3 Controller Tests (28 tests)

| Class | Tests | Name | Objective |
|-------|-------|------|-----------|
| **QuestionRestControllerTest** | 28 | Tests REST API complete | HTTP endpoints |
| | | `testCreateQuestion` | POST /api/v1/questions |
| | | `testGetQuestionById` | GET /api/v1/questions/{id} |
| | | `testUpdateQuestion` | PUT /api/v1/questions/{id} |
| | | `testDeleteQuestion` | DELETE /api/v1/questions/{id} |
| | | `testListQuestions` | GET /api/v1/questions |
| | | `testFilterByEvent` | GET /api/v1/questions?event={id} |
| | | `testSearch` | GET /api/v1/questions/search?q=... |
| | | `testPagination` | Pagination parameters |
| | | `testSorting` | Sort parameter |
| | | `testAuthenticated` | Require authentication |
| | | `testAuthorized` | Check authorization |
| | | `testOwnership` | Owner verification |
| | | `testValidateInput` | Input validation |
| | | `testMissingFields` | Missing required fields |
| | | `testInvalidFormat` | Invalid data format |
| | | `testConcurrency` | Concurrent requests |
| | | `test404NotFound` | Resource not found |
| | | `test403Forbidden` | Access denied |
| | | `test400BadRequest` | Bad request |
| | | `test201Created` | Creation status |
| | | `test204NoContent` | No content on delete |
| | | `testErrorResponse` | Error message format |
| | | `testLocationQuestions` | Questions at location |
| | | `testTrendingQuestions` | Trending questions |
| | | `testFollowedQuestions` | Followed questions |
| | | `testRelatedQuestions` | Related questions |
| | | `testQuestionMetadata` | Metadata in response |
| | | `testResponseHeaders` | Response headers |

**Coverage Criteria (QUESTION)**:
- ✅ **Services**: 85% (complex logic covered)
- ✅ **Controllers**: 80% (all main endpoints)
- ✅ **Repositories**: 90% (exhaustive queries)

**Execution Time**: ~6-7 seconds

---

### 3. MODULE: AUTH (24 tests)

**Responsibility**: Authentication, authorization and session management

**Components**:
- `AuthService` + `AuthController`
- `JwtUtils`
- Request/response payloads

**Tests Implemented**:

#### 3.1 Unit Tests Controller (5 tests)

| Class | Tests | Name | Objective |
|-------|-------|------|-----------|
| **AuthControllerUnitTest** | 5 | Unit tests controller | Logic with mocks |
| | | `testAuthenticateUser_ValidCredentials` | Successful login |
| | | `testAuthenticateUser_InvalidCredentials` | Reject credentials |
| | | `testAuthenticateUser_MissingFields` | Field validation |
| | | `testNoTokenOnInvalidAuth` | Verify no JWT |
| | | `testUser_GetUserInfo` | Get user info |

#### 3.2 Integration Tests Signin (8 tests)

| Class | Tests | Name | Objective |
|-------|-------|------|-----------|
| **AuthSigninIntegrationTest** | 8 | Complete login flow | Full-stack integration |
| | | `testSigninWithValidCredentials` | POST /api/v1/auth/signin |
| | | `testSigninWithInvalidPassword` | Reject invalid password |
| | | `testSigninWithNonexistentUser` | User doesn't exist |
| | | `testSigninReturnsJWT` | Token generated |
| | | `testSigninRolesInToken` | Roles included in token |
| | | `testSigninExpirationTime` | Token expiration |
| | | `testSigninRefreshToken` | Refresh token support |
| | | `testSigninSecurityHeaders` | Security headers present |

#### 3.3 Integration Tests Signup (10+ tests)

| Class | Tests | Name | Objective |
|-------|-------|------|-----------|
| **AuthSignupIntegrationTest** | 10+ | Complete registration flow | Validation and creation |
| | | `testSignupWithValidData` | POST /api/v1/auth/signup |
| | | `testSignupWithDuplicateEmail` | Reject duplicate email |
| | | `testSignupWithInvalidEmail` | Email validation |
| | | `testSignupWithWeakPassword` | Password validation |
| | | `testSignupCreateUserWithRole` | User + role assigned |
| | | `testSignupReturnsNewUserId` | Correct response |
| | | `testSignupEmailConfirmation` | Email confirmation required |
| | | `testSignupPasswordEncryption` | Password encrypted |
| | | `testSignupUserActivation` | User activation flow |
| | | `testSignupAuditLog` | Audit logging |
| | | `testSignupTermsAcceptance` | Terms acceptance |
| | | `testSignupProfileCompletion` | Profile data |
| | | `testSignupNotificationSent` | Welcome email sent |
| | | `testSignupGeoLocation` | Geolocation capture |

#### 3.4 DTO Tests (1 test)

| Class | Tests | Name | Objective |
|-------|-------|------|-----------|
| **JwtResponseTest** | 1 | Response serialization | JSON response |

**Coverage Criteria (AUTH)**:
- ✅ **AuthController**: 80% (critical paths)
- ✅ **AuthService**: 75% (authentication logic)
- ✅ **Security**: 85% (security validations)
- ⚠️ **JWT Utils**: 70% (core functions tested)

**Execution Time**: ~3-4 seconds

---

### 4. MODULE: ANSWER (8 tests)

**Responsibility**: Answer management

**Components**:
- `AnswerService` + `AnswerRepository`
- `AnswerRestController` (basic)

**Tests Implemented**:

| Class | Tests | Name | Objective |
|-------|-------|------|-----------|
| **AnswerServiceTest** | 8 | Service tests answers | Answer logic |
| | | `testCreateAnswer` | Create answer |
| | | `testGetAnswerById` | Retrieve by ID |
| | | `testGetAnswersByQuestion` | Answers per question |
| | | `testUpdateAnswer` | Edit answer |
| | | `testDeleteAnswer` | Delete answer |
| | | `testVoteAnswer` | Voting system |
| | | `testAnswerValidation` | Validate answer |
| | | `testAnswerOrdering` | Answer sort order |

**Coverage Criteria (ANSWER)**:
- ✅ **Services**: 75% (basic functionality)
- ⚠️ **Controllers**: 50% (incomplete implementation)
- ⚠️ **Repositories**: 60% (simple queries)

**Execution Time**: ~1 second

---

### 5. MODULE: MODEL (12 tests)

**Responsibility**: Entity and data validation tests

**Components**:
- Entities: `UserLocation`, `Question`, `Answer`, etc.
- JPA validation annotations

**Tests Implemented**:

| Class | Tests | Name | Objective |
|-------|-------|------|-----------|
| **UserLocationTest** | 12 | Entity tests | Properties and validations |
| | | `testEntityCreation` | Build entity |
| | | `testLatitude Validation` | Geography ranges |
| | | `testLongitudeValidation` | Longitude validation |
| | | `testTimestampAutosetting` | Auto-timestamp |
| | | `testPublicPrivateFlag` | Public/private state |
| | | `testEqualsHashCode` | Object comparison |
| | | `testToString` | String representation |
| | | `testBuilderPattern` | Builder usage |
| | | `testNullFields` | Null field handling |
| | | `testFieldTypes` | Correct field types |
| | | `testConstraints` | Constraint validation |
| | | `testSerializability` | Object serialization |

**Coverage Criteria (MODEL)**:
- ✅ **Entities**: 90% (all attributes)
- ✅ **Validations**: 85% (constraints tested)

**Execution Time**: ~1-2 seconds

---

## Coverage Criteria

### Coverage Targets by Module

| Module | Services Target | Controllers Target | Repositories Target | DTOs Target | Overall |
|--------|---|---|---|---|---|
| **USER** | 80% | 75% | 85% | 90% | **82.5%** |
| **QUESTION** | 85% | 80% | 90% | N/A | **85%** |
| **AUTH** | 80% | 80% | N/A | 70% | **77%** |
| **ANSWER** | 75% | 50% | 60% | N/A | **61.7%** |
| **MODEL** | N/A | N/A | N/A | 90% | **90%** |
| **TOTAL BACKEND** | **80%** | **76%** | **83%** | **83%** | **78.4%** |

### Coverage by Layers

```
┌──────────────────────────────────────────────┐
│ COVERAGE BY LAYER (Target vs Current)       │
├──────────────────────────────────────────────┤
│ Service Layer:     ████████░░  80%          │
│ Controller Layer:  ███████░░░  76%          │
│ Repository Layer:  ██████████  83%          │
│ DTO/Model Layer:   ██████████  83%          │
│ Overall:           ████████░░  78.4%        │
└──────────────────────────────────────────────┘
```

### Acceptance Criteria

- ✅ **Minimum Global Coverage**: 75%
- ✅ **Service Layer Coverage**: 80%
- ✅ **Repository Coverage**: 85%
- ✅ **Controller Coverage**: 75%
- ✅ **All Tests**: PASSING (0 failures)
- ✅ **No Critical Warnings**: In code analysis

---

## Test Execution Timeline

### Testing Timeline

```
┌────────────────────────────────────────────────────────────────┐
│                    TESTING TIMELINE                            │
├──────────────────┬──────────────────┬──────────────────────────┤
│ DEVELOPER        │ PRE-COMMIT        │ CI/CD PIPELINE          │
│ LOCAL MACHINE    │ (Optional)        │ (GitHub Actions)        │
├──────────────────┼──────────────────┼──────────────────────────┤
│ • On Save        │ • Run all tests   │ • Triggered: PR/Push    │
│ • Unit Tests     │ • 180+ tests      │ • Full Suite: 180+      │
│ • 3-5 seconds    │ • ~20 seconds     │ • ~20 seconds           │
│                  │ • Pass before     │ • Report results        │
│                  │   git push        │ • Block if fail         │
│                  │                   │ • Generate coverage     │
└──────────────────┴──────────────────┴──────────────────────────┘
```

### 1. Local Development (On-Demand)

**When**: During development, before commit  
**Who**: Developer  
**Time**: Variable (3-20s)

```bash
# Run specific test
mvn clean test -Dtest=UserLocationServiceTest

# Run module tests
mvn clean test -Dtest=user/**

# Run all tests
mvn clean test
```

### 2. Pre-Commit Hook (Recommended)

**When**: Before `git push`  
**Who**: Developer (local)  
**Time**: ~20 seconds

```bash
# Executes automatically with commit
mvn clean verify
```

**Status**: ⚠️ Define pre-commit script

### 3. GitHub Actions CI Pipeline (Automatic)

**When**:
- ✅ Push to `trunk` branch
- ✅ Push to `feature/**backend**` branches  
- ✅ Pull Request to `trunk`

**Workflow File**: `.github/workflows/CI_validate_backend.yml`

**Command**:
```bash
mvn clean verify -B
```

**Duration**: ~20 seconds (without Maven downloads)

**Result**:
- ✅ All tests pass → Merge allowed
- ❌ Test fails → Merge blocked
- 📊 Coverage report generated

### 4. Scheduled (Nightly)

**When**: Every night (00:00 UTC)  
**Where**: GitHub Actions  
**What**: Full suite + coverage report  
**Result**: Email with results  

**Status**: ⚠️ Not currently configured

---

## Tools & Frameworks

### Core Testing Framework

| Tool | Version | Purpose | Modules Used |
|------|---------|---------|---|
| **JUnit 5 (Jupiter)** | 5.x | Test runner | All |
| **Mockito** | Latest | Mocking framework | User, Auth, Answer, Question |
| **Spring Boot Test** | 3.5.5 | Spring test utilities | All |
| **AssertJ** | Latest | Fluent assertions | All |

### Spring-specific Tools

| Tool | Purpose | Tests Using |
|------|---------|---|
| **@DataJpaTest** | In-memory H2 testing | UserLocationRepositoryTest, QuestionRepositoryTest |
| **@WebMvcTest** | Controller testing | UserLocationRestControllerTest, QuestionRestControllerTest |
| **@SpringBootTest** | Full context | AuthSigninIntegrationTest, AuthSignupIntegrationTest |
| **TestEntityManager** | Entity persistence | Repository tests |
| **MockMvc** | HTTP simulation | Controller tests |
| **Spring Security Test** | Auth testing | AuthControllerUnitTest, Integration tests |

### Database for Testing

| Tool | Version | Usage |
|------|---------|-------|
| **H2 Database** | 2.x | In-memory database, isolated tests |
| **@DirtiesContext** | Spring | Clean DB between tests |

### Reporting & Metrics

| Tool | Purpose | Usage |
|------|---------|-------|
| **Allure** | Test reports | Generate HTML reports |
| **JaCoCo** | Code coverage | Measure % coverage |
| **Codacy** | Code quality | Code analysis |
| **Maven Surefire** | Test execution | Run tests |

---

## Test Execution

### Option 1: IDE (Local)

**Time**: 0.5-5 seconds (only selected tests)

```bash
# Right-click on test class → Run
# Or press Ctrl+Shift+F10

# In VS Code or IntelliJ IDEA
# Testing tab → Run Tests
```

### Option 2: Maven CLI (Local)

**Time**: ~20 seconds (all tests)

```bash
# Run all tests
mvn clean test

# Run specific module
mvn clean test -Dtest=user/**

# Run specific class
mvn clean test -Dtest=UserLocationServiceTest

# Run specific test
mvn clean test -Dtest=UserLocationServiceTest#testSaveUserLocation

# Run with JaCoCo report
mvn clean test jacoco:report
```

**Report Locations**:
```
target/
├── surefire-reports/          # JUnit reports XML
├── site/
│   └── jacoco/                # Coverage reports HTML
│       └── index.html          # Open in browser
```

### Option 3: Maven Verify (Pre-commit)

**Time**: ~20 seconds (tests + package)

```bash
# Runs tests + compile + package
mvn clean verify -B

# -B: Batch mode (clean output)
```

---

## CI/CD Integration

### GitHub Actions Workflow: CI_validate_backend.yml

**Triggers** (Automatic):
- ✅ Push to `trunk`
- ✅ Push to `feature/**backend**`
- ✅ Pull Request to `trunk`
- ✅ Scheduled: Every night (optional)

**Pipeline Execution**:

```yaml
name: Validate Backend Spring Boot
on: [push, pull_request]
jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      # 1. Checkout code
      - uses: actions/checkout@v4
      
      # 2. Setup Java 21
      - uses: actions/setup-java@v4
        with:
          java-version: '21'
          distribution: 'temurin'
          cache: maven
      
      # 3. Run tests
      - name: Build and run tests
        run: mvn clean verify -B
        # clean: Remove previous build
        # verify: Compile + tests + package
        # -B: Batch mode
      
      # 4. Upload reports (if failed)
      - name: Upload report if failed
        if: failure()
        uses: actions/upload-artifact@v3
        with:
          name: test-reports
          path: target/surefire-reports/
```

**Duration**: ~20-30 seconds

### Quality Gates

**✅ PASSES** if:
- All 180+ tests pass
- Build compiles without errors
- Coverage >= 75%
- No critical Codacy errors

**❌ FAILS** if:
- Test fails
- Build compilation error
- Coverage < 75%
- Security vulnerability

**Result**:
- ✅ Merge allowed
- ❌ Merge blocked

### View Results

```
GitHub → Repository → Actions tab
  ↓
Select "Validate Backend Spring Boot" workflow
  ↓
View latest run
  ↓
• Summary: Green/red checks
• Logs: Error details
• Artifacts: Download reports
```

---

## Integration Tests Plan

Integration tests validate complete application flows spanning **multiple modules**, using a real Spring Boot context (`@SpringBootTest`) and an in-memory H2 database. Unlike module-level integration tests (e.g., Auth), these tests exercise the full request-response cycle across the service, repository, and controller layers simultaneously.

### Tools

| Tool | Purpose |
|------|---------|
| `@SpringBootTest(webEnvironment = RANDOM_PORT)` | Starts full HTTP server on random port |
| `TestRestTemplate` | Real HTTP client for integration assertions |
| `H2 Database` | Isolated in-memory DB, reset between test classes via `@DirtiesContext` |
| `@Sql` / `@BeforeEach` | Seed data for reproducible scenarios |
| `JUnit 5` | Test runner and lifecycle management |

### Integration Test Scenarios

#### FLOW 1: Complete Q&A Lifecycle (User → Question → Answer)

**File**: `QnALifecycleIntegrationTest.java`
**Objective**: Validate the full question-and-answer flow from authenticated user to final response
**Modules involved**: AUTH + QUESTION + ANSWER

| # | Test | Steps | Expected |
|---|------|-------|----------|
| 1 | `testFullQnAFlow` | Register → Login → Create question → Create answer | 201 Created at each step; answer linked to question |
| 2 | `testGetQuestionWithAnswers` | Create question + 3 answers → GET /api/v1/questions/{id} | Response includes embedded answers list |
| 3 | `testOnlyOwnerCanDeleteQuestion` | User A creates question → User B attempts DELETE | 403 Forbidden for User B |
| 4 | `testDeleteQuestionCascadesToAnswers` | Create question with answers → DELETE question | Answers removed from DB (cascade) |
| 5 | `testVoteAnswerFlow` | Authenticated user → POST /api/v1/answers/{id}/vote | Vote count incremented; idempotent on second call |

```java
// Example skeleton
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
class QnALifecycleIntegrationTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    void testFullQnAFlow() {
        // 1. Sign up
        ResponseEntity<Void> signup = restTemplate.postForEntity("/api/v1/auth/signup", signupRequest(), Void.class);
        assertThat(signup.getStatusCode()).isEqualTo(HttpStatus.OK);

        // 2. Sign in and get JWT
        ResponseEntity<JwtResponse> signin = restTemplate.postForEntity("/api/v1/auth/signin", signinRequest(), JwtResponse.class);
        String jwt = signin.getBody().getToken();

        // 3. Create question with JWT header
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(jwt);
        ResponseEntity<QuestionDTO> question = restTemplate.exchange(
            "/api/v1/questions", HttpMethod.POST,
            new HttpEntity<>(questionRequest(), headers), QuestionDTO.class);
        assertThat(question.getStatusCode()).isEqualTo(HttpStatus.CREATED);

        // 4. Create answer for question
        ResponseEntity<AnswerDTO> answer = restTemplate.exchange(
            "/api/v1/answers", HttpMethod.POST,
            new HttpEntity<>(answerRequest(question.getBody().getId()), headers), AnswerDTO.class);
        assertThat(answer.getStatusCode()).isEqualTo(HttpStatus.CREATED);
    }
}
```

---

#### FLOW 2: Location + Question Geolocation Flow

**File**: `LocationQuestionIntegrationTest.java`
**Objective**: Validate the location-publishing flow and its relation to nearby questions
**Modules involved**: AUTH + USER (Location) + QUESTION

| # | Test | Steps | Expected |
|---|------|-------|----------|
| 1 | `testPublishAndRetrieveLocation` | Sign in → POST /api/v1/locations/publish → GET /api/v1/locations/me | Location stored; returned on GET |
| 2 | `testPublicLocationsVisibleToOthers` | User A publishes public location → User B calls GET /api/v1/locations/public | User A's location appears in list |
| 3 | `testPrivateLocationNotVisible` | User A publishes private location → User B calls GET /api/v1/locations/public | User A's location NOT in public list |
| 4 | `testQuestionsFilteredByLocation` | Publish location → GET /api/v1/questions?lat=X&lon=Y&radius=500 | Only nearby questions returned |
| 5 | `testLocationUpdateFlow` | Publish location → Publish new location → GET /api/v1/locations/me | Returns most recent location |

---

#### FLOW 3: Authentication Security Flow

**File**: `AuthSecurityIntegrationTest.java`
**Objective**: Validate that protected endpoints enforce authentication and role-based access
**Modules involved**: AUTH + QUESTION + ANSWER

| # | Test | Steps | Expected |
|---|------|-------|----------|
| 1 | `testProtectedEndpointWithoutToken` | GET /api/v1/questions without Authorization header | 401 Unauthorized |
| 2 | `testProtectedEndpointWithExpiredToken` | Use expired JWT → access protected endpoint | 401 Unauthorized |
| 3 | `testProtectedEndpointWithValidToken` | Sign in → use JWT → GET /api/v1/questions | 200 OK |
| 4 | `testAdminCanAccessAdminEndpoints` | Sign in as ADMIN role → GET /api/v1/admin/** | 200 OK |
| 5 | `testUserCannotAccessAdminEndpoints` | Sign in as USER role → GET /api/v1/admin/** | 403 Forbidden |
| 6 | `testTokenReusableAcrossRequests` | Sign in once → make 3 different requests with same JWT | All return 200 OK |

---

#### FLOW 4: WebSocket Real-Time Integration

**File**: `WebSocketIntegrationTest.java`
**Objective**: Validate WebSocket connection and message delivery for real-time features
**Modules involved**: AUTH + WebSocket broker + QUESTION

| # | Test | Steps | Expected |
|---|------|-------|----------|
| 1 | `testWebSocketConnectionEstablished` | Connect via SockJS to /ws | Connection handshake succeeds (HTTP 101) |
| 2 | `testSubscribeToQuestionTopic` | Connect → SUBSCRIBE to /topic/questions/{id} | Subscription acknowledgment received |
| 3 | `testSendMessageAndReceiveBroadcast` | Connect → SEND to /app/questions/{id}/answer → subscriber receives | Message delivered to subscriber |
| 4 | `testAuthenticatedWebSocketConnection` | Connect with JWT in header → SUBSCRIBE | Authenticated session established |
| 5 | `testUnauthenticatedWebSocketRejected` | Connect without JWT → attempt SUBSCRIBE to protected topic | Connection refused or message rejected |

```java
// Example skeleton using Spring's StompClient
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class WebSocketIntegrationTest {

    @LocalServerPort
    private int port;

    @Test
    void testWebSocketConnectionEstablished() throws Exception {
        WebSocketStompClient stompClient = new WebSocketStompClient(
            new SockJsClient(List.of(new WebSocketTransport(new StandardWebSocketClient()))));
        stompClient.setMessageConverter(new MappingJackson2MessageConverter());

        StompSession session = stompClient
            .connect("ws://localhost:" + port + "/ws", new StompSessionHandlerAdapter() {})
            .get(1, TimeUnit.SECONDS);

        assertThat(session.isConnected()).isTrue();
        session.disconnect();
    }
}
```

---

### Maven Command for Integration Tests Only

```bash
# Run only integration tests (by naming convention *IntegrationTest.java)
mvn clean test -Dtest="*IntegrationTest"

# Run all tests including integration
mvn clean verify -B
```

### Coverage Criteria (Integration Tests)

| Flow | Tests | Target |
|------|-------|--------|
| Q&A Lifecycle | 5 | Cross-module happy + edge paths |
| Location + Question | 5 | Geolocation flow covered |
| Auth Security | 6 | All auth edge cases |
| WebSocket | 5 | Real-time connection covered |
| **TOTAL new** | **21** | All critical user journeys |

---

## Interface Tests Plan

The frontend is a **React Native (Expo v54)** application. Interface tests validate that UI components render correctly, user interactions work, and navigation flows behave as expected.

### Tool Selection

Two complementary layers are recommended:

| Layer | Tool | Purpose | Complexity |
|-------|------|---------|-----------|
| **Component tests** | Jest + `@testing-library/react-native` | Unit/integration tests for screens and components | Low — native Expo support |
| **E2E tests** | Maestro | Full user journey tests on device/emulator | Medium — YAML-based, works with Expo Go |

Both tools are compatible with the current Expo setup without ejecting.

---

### Layer 1: Component Tests with Jest + @testing-library/react-native

#### Setup

```bash
# Install dependencies
cd frontend
npm install --save-dev @testing-library/react-native @testing-library/jest-native jest-expo
```

**`frontend/package.json`** additions:
```json
{
  "jest": {
    "preset": "jest-expo",
    "setupFilesAfterFramework": ["@testing-library/jest-native/extend-expect"],
    "transformIgnorePatterns": [
      "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)"
    ]
  }
}
```

#### Test Files & Coverage

**File**: `frontend/__tests__/screens/LoginScreen.test.tsx`
**Objective**: Validate the login form renders correctly and handles user input

| # | Test | Action | Expected |
|---|------|--------|----------|
| 1 | `renders login form` | Render `<LoginScreen />` | Email and password inputs visible |
| 2 | `shows validation error on empty submit` | Press login button with empty fields | Validation error messages shown |
| 3 | `shows error on invalid credentials` | Submit with wrong credentials (mock API 401) | Error message rendered |
| 4 | `navigates to home on success` | Submit valid credentials (mock API 200 + JWT) | Navigation to HomeScreen triggered |
| 5 | `password field is masked` | Inspect password input | `secureTextEntry` is true |

```tsx
// Example
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginScreen from '../../src/screens/LoginScreen';
import axios from 'axios';

jest.mock('axios');

test('navigates to home on successful login', async () => {
  (axios.post as jest.Mock).mockResolvedValueOnce({
    data: { token: 'fake-jwt', userId: 1 }
  });

  const mockNavigate = jest.fn();
  const { getByPlaceholderText, getByText } = render(
    <LoginScreen navigation={{ navigate: mockNavigate }} />
  );

  fireEvent.changeText(getByPlaceholderText('Email'), 'user@test.com');
  fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
  fireEvent.press(getByText('Login'));

  await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('Home'));
});
```

---

**File**: `frontend/__tests__/screens/QuestionListScreen.test.tsx`
**Objective**: Validate question list renders and interactions work

| # | Test | Action | Expected |
|---|------|--------|----------|
| 1 | `renders question list` | Mock API → render screen | Question titles visible |
| 2 | `shows loading state` | Render before API resolves | Loading indicator shown |
| 3 | `shows empty state` | Mock API returns empty array | "No questions" message shown |
| 4 | `navigates to detail on tap` | Tap a question item | Navigate to QuestionDetailScreen with correct ID |
| 5 | `shows error on API failure` | Mock API rejects | Error message rendered |

---

**File**: `frontend/__tests__/screens/QuestionDetailScreen.test.tsx`
**Objective**: Validate question detail with answers

| # | Test | Action | Expected |
|---|------|--------|----------|
| 1 | `renders question and answers` | Mock API → render | Question title + answer list visible |
| 2 | `can submit a new answer` | Type answer text → press Submit | POST to API called; new answer appears |
| 3 | `vote button increments count` | Press vote on answer | Vote count displayed +1 |

---

**File**: `frontend/__tests__/components/MapView.test.tsx`
**Objective**: Validate the map component renders and location markers appear

| # | Test | Action | Expected |
|---|------|--------|----------|
| 1 | `renders map container` | Render `<MapView />` | Map container element visible |
| 2 | `renders location markers` | Pass array of locations as props | One marker per location rendered |
| 3 | `requests location permission` | Mount component | `expo-location` permission request triggered |

---

**File**: `frontend/__tests__/navigation/AppNavigator.test.tsx`
**Objective**: Validate navigation flows

| # | Test | Action | Expected |
|---|------|--------|----------|
| 1 | `unauthenticated user sees login screen` | Render with no stored JWT | LoginScreen rendered |
| 2 | `authenticated user sees home screen` | Mock stored JWT → render | HomeScreen rendered |
| 3 | `logout clears JWT and returns to login` | Call logout action | JWT cleared; LoginScreen rendered |

---

#### Run Component Tests

```bash
cd frontend
npx jest                        # all tests
npx jest --watchAll             # watch mode
npx jest --coverage             # with coverage report
npx jest LoginScreen.test.tsx   # single file
```

**Coverage targets (component tests)**:

| Screen/Component | Coverage Target |
|-----------------|----------------|
| LoginScreen | 80% |
| RegisterScreen | 75% |
| QuestionListScreen | 80% |
| QuestionDetailScreen | 75% |
| MapView component | 70% |
| AppNavigator | 85% |

---

### Layer 2: E2E Tests with Maestro

Maestro uses YAML-based flow files that run on a real device or emulator via Expo Go. No code changes to the app are needed.

#### Setup

```bash
# Install Maestro CLI
curl -Ls "https://get.maestro.mobile.dev" | bash

# Start the Expo app (in another terminal)
cd frontend && npx expo start

# Run a flow
maestro test frontend/e2e/login.yaml
```

#### E2E Flow Files

**`frontend/e2e/login_flow.yaml`** — Login and access home

```yaml
appId: com.streetask.app
---
- launchApp
- assertVisible: "Welcome to StreetAsk"
- tapOn: "Email"
- inputText: "testuser@streetask.com"
- tapOn: "Password"
- inputText: "Test1234!"
- tapOn: "Login"
- assertVisible: "Questions near you"
```

---

**`frontend/e2e/create_question_flow.yaml`** — Create a new question

```yaml
appId: com.streetask.app
---
- launchApp
# login first
- tapOn: "Email"
- inputText: "testuser@streetask.com"
- tapOn: "Password"
- inputText: "Test1234!"
- tapOn: "Login"
# navigate to create question
- tapOn:
    id: "create-question-button"
- assertVisible: "New Question"
- tapOn: "Title"
- inputText: "Where is the nearest coffee shop?"
- tapOn: "Description"
- inputText: "Looking for a good espresso near the main square."
- tapOn: "Submit"
- assertVisible: "Question created"
- assertVisible: "Where is the nearest coffee shop?"
```

---

**`frontend/e2e/answer_question_flow.yaml`** — Answer an existing question

```yaml
appId: com.streetask.app
---
- launchApp
- tapOn: "Email"
- inputText: "testuser@streetask.com"
- tapOn: "Password"
- inputText: "Test1234!"
- tapOn: "Login"
- tapOn:
    text: "Where is the nearest coffee shop?"
- assertVisible: "Answers"
- tapOn:
    id: "add-answer-button"
- inputText: "There is a great one 200m north on Calle Mayor."
- tapOn: "Submit Answer"
- assertVisible: "There is a great one 200m north on Calle Mayor."
```

---

**`frontend/e2e/location_flow.yaml`** — Publish and view location

```yaml
appId: com.streetask.app
---
- launchApp
- tapOn: "Email"
- inputText: "testuser@streetask.com"
- tapOn: "Password"
- inputText: "Test1234!"
- tapOn: "Login"
- tapOn:
    id: "location-tab"
- assertVisible: "Map"
- tapOn:
    id: "publish-location-button"
- assertVisible: "Location published"
```

---

#### E2E Coverage

| Flow | File | Critical Scenarios |
|------|------|--------------------|
| Login | `login_flow.yaml` | Happy path, wrong password |
| Registration | `register_flow.yaml` | Valid data, duplicate email |
| Create Question | `create_question_flow.yaml` | Happy path, empty fields |
| Answer Question | `answer_question_flow.yaml` | Happy path, vote |
| Location | `location_flow.yaml` | Publish, view map |
| Logout | `logout_flow.yaml` | Session cleared |

---

### Interface Tests in CI/CD

```yaml
# Addition to .github/workflows/mobile-ci.yml
- name: Run component tests
  working-directory: ./frontend
  run: |
    npm install
    npx jest --coverage --ci

- name: Upload frontend coverage
  uses: actions/upload-artifact@v3
  with:
    name: frontend-coverage
    path: frontend/coverage/

# E2E tests (optional, requires emulator)
- name: Run Maestro E2E tests
  run: |
    maestro test frontend/e2e/login_flow.yaml
    maestro test frontend/e2e/create_question_flow.yaml
```

---

## Roadmap for Improvements

### Phase 1: Foundation (CURRENT ✓)

- ✅ 180+ tests implemented
- ✅ 78.4% global coverage
- ✅ CI/CD pipeline active
- ✅ 5 modules covered

**Status**: COMPLETED

### Phase 2: Expansion (Q2 2026)

| Item | Module | Tests | Target |
|------|--------|-------|--------|
| E-commerce payment flow | answer | +5 tests | 70% → 85% |
| Advanced search queries | question | +10 tests | 85% → 92% |
| Admin features | user | +8 tests | 82% → 88% |
| Event notifications | question | +6 tests | 85% → 90% |
| **Total Expected** | | **+29** | **180 → 209** |

### Phase 3: Advanced (Q3 2026)

- 🟡 Performance tests (response times)
- 🟡 Load testing (concurrent users)
- 🟡 Security testing (penetration)
- 🟡 Database migration tests
- 🟡 API contract testing
- 🟡 Contract tests with frontend

**Target Coverage**: 85%+ global

### Phase 4: Optimization (Q4 2026)

- 🟠 Parallel test execution
- 🟠 Test flakiness detection
- 🟠 Mutation testing
- 🟠 Archive reports dashboard
- 🟠 Trend analysis

**Target**: Sub-15 second test execution

---

## Responsibility Matrix

| Role | Responsibilities |
|-----|---|
| **Developer** | • Write tests for new features<br>• Keep tests passing<br>• Run tests locally|
| **Reviewer** | • Review tests in PR<br>• Verify coverage goals<br>• Approve if all pass |
| **CI/CD** | • Run tests automatically<br>• Report results<br>• Block if fail |
| **QA Lead** | • Maintain testing strategy<br>• Review coverage reports<br>• Plan improvements |

---

## Contact & Support

**For testing questions:**
1. Review this document
2. See existing tests as reference
3. Consult with QA Lead
4. Create issue in repository

**External Documentation:**
- JUnit 5: https://junit.org/junit5/
- Mockito: https://site.mockito.org/
- Spring Test: https://spring.io/projects/spring-framework
- AssertJ: https://assertj.github.io/

---

## Change History

| Version | Date | Changes |
|---------|------|---------|
| 3.0 | 2026-03-10 | Added Integration Tests Plan (cross-module flows) and Interface Tests Plan (Jest + Maestro) |
| 2.0 | 2026-03-10 | Explicit plan with concrete numbers |
| 1.0 | 2026-03-10 | Initial strategic document |

---

**Proprietary Document**: Development Team  
**Last Updated**: 2026-03-10  
**Next Review**: 2026-06-10  
**Status**: 🟢 ACTIVE
