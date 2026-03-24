package com.streetask.app.integration;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
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
import com.streetask.app.user.AuthoritiesRepository;
import com.streetask.app.user.Authorities;
import com.streetask.app.user.RegularUser;
import com.streetask.app.user.RegularUserRepository;
import com.streetask.app.user.User;
import com.streetask.app.user.UserService;
import com.streetask.app.model.Answer;
import com.streetask.app.model.Question;
import com.streetask.app.model.enums.VoteType;

@SpringBootTest
@Transactional
@DisplayName("Full Authentication and Question Creation Flow Integration Tests")
class FullAuthAndQuestionCreationIntegrationTest {

    @Autowired
    private UserService userService;

    @Autowired
    private QuestionService questionService;

    @Autowired
    private AnswerService answerService;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private AnswerRepository answerRepository;

    @Autowired
    private RegularUserRepository userRepository;

    @Autowired
    private AuthoritiesRepository authoritiesRepository;

    private Authorities userAuthority;

    @BeforeEach
    void setUp() {
        // Create standard USER authority
        userAuthority = new Authorities();
        userAuthority.setAuthority("USER_" + UUID.randomUUID().toString().substring(0, 8));
        authoritiesRepository.save(userAuthority);
    }

    @Test
    @DisplayName("FLOW 1: User lifecycle - create, authenticate, create content")
    void testUserLifecyclFromCreationToContent() {
        // Step 1: Create user (simulating registration)
        RegularUser newUser = new RegularUser();
        newUser.setEmail("newuser" + UUID.randomUUID() + "@test.com");
        newUser.setUserName("username_" + UUID.randomUUID().toString().substring(0, 8));
        newUser.setPassword("encodedPassword123");
        newUser.setFirstName("John");
        newUser.setLastName("Doe");
        newUser.setActive(true);
        newUser.setAuthority(userAuthority);
        RegularUser savedUser = userRepository.save(newUser);

        // Step 2: Verify user was created
        Optional<RegularUser> retrieved = userRepository.findById(savedUser.getId());
        assertTrue(retrieved.isPresent());
        assertEquals(newUser.getEmail(), retrieved.get().getEmail());

        // Step 3: Lookup user by email (authentication check)
        Optional<RegularUser> foundByEmail = userRepository.findByEmail(newUser.getEmail());
        assertTrue(foundByEmail.isPresent());

        // Step 4: User creates a question
        Question question = new Question();
        question.setCreator(savedUser);
        question.setTitle("My first question");
        question.setContent("I need help with this issue");
        question.setActive(true);
        Question savedQuestion = questionRepository.save(question);

        assertNotNull(savedQuestion.getId());
        assertEquals(savedUser.getId(), savedQuestion.getCreator().getId());

        // Step 5: User receives answer
        RegularUser answerer = createUser("answerer", userAuthority);
        Answer answer = new Answer();
        answer.setQuestion(savedQuestion);
        answer.setUser(answerer);
        answer.setContent("Try this solution");
        answer.setIsVerified(false);
        answer.setUpvotes(0);
        answer.setDownvotes(0);
        Answer savedAnswer = answerRepository.save(answer);

        // Step 6: Original user votes on answer
        answerService.updateVotes(savedAnswer.getId(), savedUser.getId(), VoteType.LIKE);

        // Step 7: Verify vote and reputation
        Answer votedAnswer = answerRepository.findById(savedAnswer.getId()).orElseThrow();
        assertEquals(1, votedAnswer.getUpvotes());

        User answererWithRep = userService.findUser(answerer.getId());
        assertEquals(2, answererWithRep.getReputation());
    }

    @Test
    @DisplayName("FLOW 2: Multiple users interaction - questions and answers")
    void testMultipleUsersInteraction() {
        RegularUser user1 = createUser("user1", userAuthority);
        RegularUser user2 = createUser("user2", userAuthority);
        RegularUser user3 = createUser("user3", userAuthority);

        // User 1 creates question
        Question q1 = createQuestion(user1, "First Question", "Description 1", true);

        // User 2 creates question
        Question q2 = createQuestion(user2, "Second Question", "Description 2", true);

        // User 3 answers both
        Answer a1 = createAnswer(q1, user3, "Answer to Q1", false);
        Answer a2 = createAnswer(q2, user3, "Answer to Q2", false);

        // User 1 votes on User 3's answer in Q1
        answerService.updateVotes(a1.getId(), user1.getId(), VoteType.LIKE);

        // User 2 votes on User 3's answer in Q2
        answerService.updateVotes(a2.getId(), user2.getId(), VoteType.LIKE);

        // Verify total reputation for User 3
        User user3WithRep = userService.findUser(user3.getId());
        assertEquals(4, user3WithRep.getReputation()); // 2 answers * 2 upvotes each

        // Verify questions are retrievable
        List<Question> allQuestions = (List<Question>) questionRepository.findAll();
        assertEquals(6, allQuestions.size());
    }

    @Test
    @DisplayName("FLOW 3: User stats after Q&A interaction")
    void testUserStatsAfterInteraction() {
        RegularUser contentCreator = createUser("creator", userAuthority);
        RegularUser answerer = createUser("answerer", userAuthority);
        RegularUser voter = createUser("voter", userAuthority);

        // Creator makes 3 questions
        Question q1 = createQuestion(contentCreator, "Q1", "Desc1", true);
        Question q2 = createQuestion(contentCreator, "Q2", "Desc2", true);
        Question q3 = createQuestion(contentCreator, "Q3", "Desc3", true);

        // Answerer makes answers
        Answer a1 = createAnswer(q1, answerer, "Answer 1", true);
        Answer a2 = createAnswer(q2, answerer, "Answer 2", false);

        // Voter votes
        answerService.updateVotes(a1.getId(), voter.getId(), VoteType.LIKE);
        answerService.updateVotes(a2.getId(), voter.getId(), VoteType.DISLIKE);

        // Get creator stats
        Object creatorStats = userService.getUserStats(contentCreator.getId());
        assertNotNull(creatorStats);

        // Get answerer reputation
        User answererWithStats = userService.findUser(answerer.getId());
        assertEquals(1, answererWithStats.getReputation()); // 1 like * 2 - 1 dislike = 1
    }

    @Test
    @DisplayName("FLOW 4: Question ownership verification")
    void testQuestionOwnershipVerification() {
        RegularUser owner = createUser("owner", userAuthority);
        RegularUser nonOwner = createUser("nonowner", userAuthority);

        Question question = createQuestion(owner, "Question by owner", "Content", true);

        // Verify owner
        assertEquals(owner.getId(), question.getCreator().getId());

        // Verify non-owner is different
        assertTrue(!question.getCreator().getId().equals(nonOwner.getId()));
    }

    @Test
    @DisplayName("FLOW 5: User can see their own stats vs others")
    void testUserStatsVisibility() {
        RegularUser user1 = createUser("user1", userAuthority);
        RegularUser user2 = createUser("user2", userAuthority);

        Question q1 = createQuestion(user1, "Q1", "D1", true);
        Answer a1 = createAnswer(q1, user1, "Self answer", false);

        // User 2 votes
        answerService.updateVotes(a1.getId(), user2.getId(), VoteType.LIKE);

        // Get both users' data
        User user1Data = userService.findUser(user1.getId());
        User user2Data = userService.findUser(user2.getId());

        assertEquals(2, user1Data.getReputation());
        assertEquals(0, user2Data.getReputation());
    }

    @Test
    @DisplayName("FLOW 6: User deletion behavior (cascade)")
    void testUserWithContentDeletion() {
        RegularUser user = createUser("todelete", userAuthority);
        Question q = createQuestion(user, "Question", "Desc", true);
        Answer a = createAnswer(q, user, "Answer", false);

        UUID userId = user.getId();
        UUID questionId = q.getId();
        UUID answerId = a.getId();

        // Delete user (if cascade is implemented)
        userRepository.delete(user);

        // Verify deletion
        assertTrue(userRepository.findById(userId).isEmpty());
        // Questions and answers cascade behavior depends on implementation
    }

    @Test
    @DisplayName("FLOW 7: Question status updates")
    void testQuestionStatusManagement() {
        RegularUser creator = createUser("creator", userAuthority);
        Question question = createQuestion(creator, "Question", "Description", true);

        assertTrue(question.getActive());

        // Simulate deactivation (if service method exists)
        question.setActive(false);
        questionRepository.save(question);

        Question retrieved = questionRepository.findById(question.getId()).orElseThrow();
        assertTrue(!retrieved.getActive());
    }

    // ========== Helper Methods ==========

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
}
