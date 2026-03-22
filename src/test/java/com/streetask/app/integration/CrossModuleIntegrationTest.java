package com.streetask.app.integration;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;

import com.streetask.app.answer.AnswerRepository;
import com.streetask.app.answer.AnswerService;
import com.streetask.app.question.QuestionRepository;
import com.streetask.app.question.QuestionService;
import com.streetask.app.report.QuestionReportRepository;
import com.streetask.app.report.QuestionReportService;
import com.streetask.app.user.AuthoritiesRepository;
import com.streetask.app.user.RegularUser;
import com.streetask.app.user.RegularUserRepository;
import com.streetask.app.user.UserLocationRepository;
import com.streetask.app.user.UserService;
import com.streetask.app.user.Authorities;
import com.streetask.app.user.User;
import com.streetask.app.report.QuestionReport;
import com.streetask.app.model.Answer;
import com.streetask.app.model.Question;
import com.streetask.app.model.UserLocation;
import com.streetask.app.model.enums.QuestionReportReason;
import com.streetask.app.model.enums.VoteType;

@SpringBootTest
@Transactional
@DisplayName("Cross-Module Complete Application Flow Integration Tests")
class CrossModuleIntegrationTest {

    @Autowired
    private QuestionService questionService;

    @Autowired
    private AnswerService answerService;

    @Autowired
    private UserService userService;

    @Autowired
    private QuestionReportService questionReportService;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private AnswerRepository answerRepository;

    @Autowired
    private QuestionReportRepository questionReportRepository;

    @Autowired
    private UserLocationRepository userLocationRepository;

    @Autowired
    private RegularUserRepository userRepository;

    @Autowired
    private AuthoritiesRepository authoritiesRepository;

    private Authorities userAuthority;

    @BeforeEach
    void setUp() {
        userAuthority = new Authorities();
        userAuthority.setAuthority("USER_" + UUID.randomUUID().toString().substring(0, 8));
        authoritiesRepository.save(userAuthority);
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    @DisplayName("SUPER_FLOW: Complete ecosystem with users, questions, answers, votes, reports, and locations")
    void testCompleteEcosystem() {
        // ===== PHASE 1: User Setup =====
        RegularUser alice = createUser("alice", userAuthority);
        RegularUser bob = createUser("bob", userAuthority);
        RegularUser charlie = createUser("charlie", userAuthority);
        RegularUser diana = createUser("diana", userAuthority);

        // ===== PHASE 2: Location Publishing =====
        UserLocation aliceLocation = createLocation(alice, 40.7128, -74.0060, true); // NYC
        UserLocation bobLocation = createLocation(bob, 40.7200, -74.0100, true); // Near NYC
        UserLocation charlieLocation = createLocation(charlie, 34.0522, -118.2437, true); // LA

        assertNotNull(aliceLocation.getId());
        assertNotNull(bobLocation.getId());
        assertNotNull(charlieLocation.getId());

        // ===== PHASE 3: Question Creation (Alice asks, Bob & others participate) =====
        Question q1 = createQuestion(alice, "Best pizza in NYC?",
                "Looking for the best pizza place in Manhattan", true);
        Question q2 = createQuestion(alice, "How to fix Java concurrency?",
                "Having issues with thread synchronization", true);

        Question q3 = createQuestion(bob, "Frontend framework recommendations?",
                "Planning a new web project", true);

        assertEquals(3, countQuestions());

        // ===== PHASE 4: Answer Creation (Multiple users answering) =====
        Answer a1_q1 = createAnswer(q1, bob, "Try Joe's Pizza on Bleecker Street", true);
        Answer a2_q1 = createAnswer(q1, charlie, "L&B Spumoni Gardens is the best", false);

        Answer a1_q2 = createAnswer(q2, bob, "Use ReentrantLock or synchronized blocks", false);
        Answer a2_q2 = createAnswer(q2, diana, "Consider using concurrent collections", false);

        Answer a1_q3 = createAnswer(q3, alice, "React is excellent for complex UIs", true);
        Answer a2_q3 = createAnswer(q3, charlie, "Vue is simpler to learn", false);

        assertEquals(6, countAnswers());

        // ===== PHASE 5: Voting & Reputation System =====
        // Alice votes on Bob's pizza answer (upvote)
        answerService.updateVotes(a1_q1.getId(), alice.getId(), VoteType.LIKE);

        // Bob votes on Diana's concurrency answer (upvote)
        answerService.updateVotes(a2_q2.getId(), bob.getId(), VoteType.LIKE);

        // Charlie votes on Alice's framework answer (downvote)
        answerService.updateVotes(a1_q3.getId(), charlie.getId(), VoteType.DISLIKE);

        // Diana votes on Bob's concurrency answer (upvote)
        answerService.updateVotes(a1_q2.getId(), diana.getId(), VoteType.LIKE);

        // ===== PHASE 6: Reputation Verification =====
        User bobWithRep = userService.findUser(bob.getId());
        User dianaWithRep = userService.findUser(diana.getId());
        User aliceWithRep = userService.findUser(alice.getId());

        // Diana: 1 upvote on concurrency = 2
        assertEquals(2, dianaWithRep.getReputation());

        // Alice: 1 downvote on framework = -1
        assertEquals(-1, aliceWithRep.getReputation());

        // Bob: Should have at least 4 reputation from upvotes (may vary)
        assertTrue(bobWithRep.getReputation() >= 4);

        // ===== PHASE 7: Reporting System =====
        // Diana reports Bob's pizza answer as irrelevant (reports the question, not the
        // answer)
        setAuthenticated(diana);
        QuestionReport report1 = questionReportService.createQuestionReport(
                q1.getId(),
                QuestionReportReason.IRRELEVANT,
                "This is too casual for the platform");

        // Charlie reports Q2 as spam
        setAuthenticated(charlie);
        QuestionReport report2 = questionReportService.createQuestionReport(
                q2.getId(),
                QuestionReportReason.SPAM,
                "Already discussed in another thread");

        assertNotNull(report1.getId());
        assertNotNull(report2.getId());
        assertEquals(diana.getId(), report1.getReporter().getId());
        assertEquals(charlie.getId(), report2.getReporter().getId());

        // ===== PHASE 8: Comprehensive Verification =====
        // Verify all data integrity
        assertTrue(countUsers() >= 4, "Should have at least 4 users created in this test");
        assertEquals(3, countQuestions());
        assertEquals(6, countAnswers());
        assertEquals(2, countReports());
        assertEquals(3, countLocations());

        // Verify original questions unchanged by voting/reporting
        Question q1Retrieved = questionRepository.findById(q1.getId()).orElseThrow();
        assertEquals("Best pizza in NYC?", q1Retrieved.getTitle());
        assertTrue(q1Retrieved.getActive());

        // Verify answers maintain correct associations
        Answer a1_q1Retrieved = answerRepository.findById(a1_q1.getId()).orElseThrow();
        assertEquals(q1.getId(), a1_q1Retrieved.getQuestion().getId());
        assertEquals(bob.getId(), a1_q1Retrieved.getUser().getId());
        assertTrue(a1_q1Retrieved.getIsVerified());
    }

    @Test
    @DisplayName("FLOW: User creates content, gets reported, reputation affected by votes")
    void testReputationWithReportingIntegration() {
        RegularUser author = createUser("author", userAuthority);
        RegularUser voter1 = createUser("voter1", userAuthority);
        RegularUser voter2 = createUser("voter2", userAuthority);
        RegularUser reporter = createUser("reporter", userAuthority);

        // Author creates question
        Question question = createQuestion(author, "Controversial topic", "Description", true);

        // Authors creates answer (to get reputation through votes)
        Answer answer = createAnswer(question, author, "My response", false);

        // Voters upvote and downvote
        answerService.updateVotes(answer.getId(), voter1.getId(), VoteType.LIKE);
        answerService.updateVotes(answer.getId(), voter2.getId(), VoteType.DISLIKE);

        // Before report: reputation = 1*2 - 1 = 1
        User authorBeforeReport = userService.findUser(author.getId());
        assertEquals(1, authorBeforeReport.getReputation());

        // Reporter reports the question
        setAuthenticated(reporter);
        questionReportService.createQuestionReport(
                question.getId(),
                QuestionReportReason.OFFENSIVE,
                "Violation of community standards");

        // After report: reputation should remain same (reporting shouldn't directly
        // affect it)
        User authorAfterReport = userService.findUser(author.getId());
        assertEquals(1, authorAfterReport.getReputation());

        // Verify report was created
        assertTrue(questionReportRepository.count() > 0);
    }

    @Test
    @DisplayName("FLOW: Geographic-based Q&A with community interaction")
    void testGeographicCommunityInteraction() {
        // Users in NYC area
        RegularUser nycUser1 = createUser("nyc1", userAuthority);
        RegularUser nycUser2 = createUser("nyc2", userAuthority);

        // User in LA
        RegularUser laUser = createUser("la", userAuthority);

        // All publish locations
        createLocation(nycUser1, 40.7128, -74.0060, true); // NYC
        createLocation(nycUser2, 40.7200, -74.0100, true); // NYC nearby
        createLocation(laUser, 34.0522, -118.2437, true); // LA

        // NYC Users create local questions
        Question nycQuestion1 = createQuestion(nycUser1, "NYC Transit", "Q about subway", true);
        Question nycQuestion2 = createQuestion(nycUser2, "NYC Food", "Best bagels?", true);

        // LA user creates LA question
        Question laQuestion = createQuestion(laUser, "LA Traffic", "How to navigate LA", true);

        // Interaction: NYC users answer each other's questions
        Answer nycAns1 = createAnswer(nycQuestion2, nycUser1, "Murray's Bagels", true);

        // LA user answers NYC question (possible in open platform)
        Answer laAns1 = createAnswer(nycQuestion1, laUser, "I heard good things", false);

        // NYC user votes
        answerService.updateVotes(nycAns1.getId(), nycUser2.getId(), VoteType.LIKE);
        answerService.updateVotes(laAns1.getId(), nycUser1.getId(), VoteType.LIKE);

        // Verify all integrations
        User nycUser1Rep = userService.findUser(nycUser1.getId());
        User laUserRep = userService.findUser(laUser.getId());

        assertEquals(2, nycUser1Rep.getReputation()); // 1 upvote on LA answer
        assertEquals(2, laUserRep.getReputation()); // 1 upvote on NYC answer
    }

    // ========== Helper Methods ==========

    private Authorities createAuthority() {
        Authorities auth = new Authorities();
        auth.setAuthority("USER_" + UUID.randomUUID().toString().substring(0, 8));
        return authoritiesRepository.save(auth);
    }

    private RegularUser createUser(String prefix, Authorities authority) {
        String uniqueSuffix = UUID.randomUUID().toString().substring(0, 8);
        RegularUser user = new RegularUser();
        user.setEmail(prefix + "_" + uniqueSuffix + "@test.com");
        user.setUserName(prefix + "_" + uniqueSuffix);
        user.setPassword("password123");
        user.setFirstName("Test");
        user.setLastName("User");
        user.setActive(true);
        user.setAuthority(authority);
        return userRepository.save(user);
    }

    private Question createQuestion(RegularUser creator, String title, String content, Boolean active) {
        Question question = new Question();
        question.setCreator(creator);
        question.setTitle(title);
        question.setContent(content);
        question.setActive(active);
        return questionRepository.save(question);
    }

    private Answer createAnswer(Question question, RegularUser user, String content, Boolean isVerified) {
        Answer answer = new Answer();
        answer.setQuestion(question);
        answer.setUser(user);
        answer.setContent(content);
        answer.setIsVerified(isVerified);
        answer.setUpvotes(0);
        answer.setDownvotes(0);
        return answerRepository.save(answer);
    }

    private UserLocation createLocation(RegularUser user, Double latitude, Double longitude, Boolean isPublic) {
        UserLocation location = new UserLocation();
        location.setUser(user);
        location.setLatitude(latitude);
        location.setLongitude(longitude);
        location.setIsPublic(isPublic);
        location.setTimestamp(LocalDateTime.now());
        return userLocationRepository.save(location);
    }

    private long countUsers() {
        return userRepository.count();
    }

    private long countQuestions() {
        return questionRepository.count();
    }

    private long countAnswers() {
        return answerRepository.count();
    }

    private long countReports() {
        return questionReportRepository.count();
    }

    private long countLocations() {
        return userLocationRepository.count();
    }

    private void setAuthenticated(RegularUser user) {
        Authentication authentication = mock(Authentication.class);
        SecurityContext securityContext = mock(SecurityContext.class);
        when(authentication.getName()).thenReturn(user.getEmail());
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);
    }
}
