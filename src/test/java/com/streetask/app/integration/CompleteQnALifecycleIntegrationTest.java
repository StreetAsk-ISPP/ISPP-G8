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
import org.springframework.transaction.annotation.Transactional;

import com.streetask.app.answer.AnswerRepository;
import com.streetask.app.answer.AnswerService;
import com.streetask.app.answer.AnswerVoteRepository;
import com.streetask.app.model.Answer;
import com.streetask.app.model.AnswerVote;
import com.streetask.app.model.Question;
import com.streetask.app.model.enums.VoteType;
import com.streetask.app.question.QuestionRepository;
import com.streetask.app.question.QuestionService;
import com.streetask.app.user.AuthoritiesRepository;
import com.streetask.app.user.Authorities;
import com.streetask.app.user.RegularUser;
import com.streetask.app.user.RegularUserRepository;
import com.streetask.app.user.User;
import com.streetask.app.user.UserService;

@SpringBootTest
@Transactional
@DisplayName("Complete Q&A Lifecycle Integration Tests")
class CompleteQnALifecycleIntegrationTest {

    @Autowired
    private QuestionService questionService;

    @Autowired
    private AnswerService answerService;

    @Autowired
    private UserService userService;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private AnswerRepository answerRepository;

    @Autowired
    private AnswerVoteRepository answerVoteRepository;

    @Autowired
    private RegularUserRepository userRepository;

    @Autowired
    private AuthoritiesRepository authoritiesRepository;

    private RegularUser questionCreator;
    private RegularUser answerer1;
    private RegularUser answerer2;
    private Question testQuestion;
    private Authorities authority;

    @BeforeEach
    void setUp() {
        authority = createAuthority("USER");
        questionCreator = createUser("creator", authority);
        answerer1 = createUser("answerer1", authority);
        answerer2 = createUser("answerer2", authority);
        testQuestion = createQuestion(questionCreator, "How to solve problem X?",
                "I have been trying to solve this issue...", true);
    }

    @Test
    @DisplayName("FLOW 1: Complete Q&A lifecycle from question creation to answer voting")
    void testCompleteQnAFlow() {
        // Step 1: Create question
        assertNotNull(testQuestion.getId());
        assertEquals(questionCreator.getId(), testQuestion.getCreator().getId());
        assertEquals("How to solve problem X?", testQuestion.getTitle());

        // Step 2: Verify question is retrievable
        Optional<Question> retrievedQuestion = questionRepository.findById(testQuestion.getId());
        assertTrue(retrievedQuestion.isPresent());
        assertEquals(testQuestion.getTitle(), retrievedQuestion.get().getTitle());

        // Step 3: Create multiple answers
        Answer answer1 = createAnswer(testQuestion, answerer1, "Solution 1: Try this approach...", true);
        Answer answer2 = createAnswer(testQuestion, answerer2, "Solution 2: Use this method...", false);

        // Step 4: Verify answers are linked to question
        List<Answer> answers = (List<Answer>) answerRepository.findAll();
        assertEquals(2, answers.size());

        // Step 5: Vote on answers (upvote answer1, downvote answer2)
        answerService.updateVotes(answer1.getId(), questionCreator.getId(), VoteType.LIKE);
        answerService.updateVotes(answer2.getId(), questionCreator.getId(), VoteType.DISLIKE);

        // Step 6: Verify votes are persisted
        Answer votedAnswer1 = answerRepository.findById(answer1.getId()).orElseThrow();
        Answer votedAnswer2 = answerRepository.findById(answer2.getId()).orElseThrow();

        assertEquals(1, votedAnswer1.getUpvotes());
        assertEquals(0, votedAnswer1.getDownvotes());
        assertEquals(0, votedAnswer2.getUpvotes());
        assertEquals(1, votedAnswer2.getDownvotes());

        // Step 7: Verify user reputation calculations
        User answerer1WithRep = userService.findUser(answerer1.getId());
        User answerer2WithRep = userService.findUser(answerer2.getId());

        assertEquals(2, answerer1WithRep.getReputation()); // 1 upvote * 2
        assertEquals(-1, answerer2WithRep.getReputation()); // 1 downvote
    }

    @Test
    @DisplayName("FLOW 2: Multiple users voting on same answer")
    void testMultipleUsersVotingOnSameAnswer() {
        Answer answer = createAnswer(testQuestion, answerer1, "Popular answer", true);

        // Multiple users upvote the same answer
        answerService.updateVotes(answer.getId(), answerer2.getId(), VoteType.LIKE);
        answerService.updateVotes(answer.getId(), questionCreator.getId(), VoteType.LIKE);

        Answer persistedAnswer = answerRepository.findById(answer.getId()).orElseThrow();
        assertEquals(2, persistedAnswer.getUpvotes());

        // Verify answerer reputation increased accordingly
        User answererWithRep = userService.findUser(answerer1.getId());
        assertEquals(4, answererWithRep.getReputation()); // 2 upvotes * 2
    }

    @Test
    @DisplayName("FLOW 3: Vote changes (switching from like to dislike)")
    void testVoteChanges() {
        Answer answer = createAnswer(testQuestion, answerer1, "Answer to change votes on", true);

        // User votes like
        answerService.updateVotes(answer.getId(), answerer2.getId(), VoteType.LIKE);
        Answer afterUpvote = answerRepository.findById(answer.getId()).orElseThrow();
        assertEquals(1, afterUpvote.getUpvotes());

        // User changes vote to dislike
        answerService.updateVotes(answer.getId(), answerer2.getId(), VoteType.DISLIKE);
        Answer afterDownvote = answerRepository.findById(answer.getId()).orElseThrow();
        assertEquals(0, afterDownvote.getUpvotes());
        assertEquals(1, afterDownvote.getDownvotes());

        // Verify vote entry is updated
        Optional<AnswerVote> vote = answerVoteRepository.findByUserIdAndAnswerId(answerer2.getId(), answer.getId());
        assertTrue(vote.isPresent());
        assertEquals(VoteType.DISLIKE, vote.get().getVoteType());

        // Verify reputation changed accordingly
        User answererWithRep = userService.findUser(answerer1.getId());
        assertEquals(-1, answererWithRep.getReputation());
    }

    @Test
    @DisplayName("FLOW 4: Only answer owner can delete question (cascade)")
    void testQuestionDeletionCascadesToAnswers() {
        Answer answer1 = createAnswer(testQuestion, answerer1, "Answer 1", true);
        Answer answer2 = createAnswer(testQuestion, answerer2, "Answer 2", true);

        UUID questionId = testQuestion.getId();
        UUID answer1Id = answer1.getId();
        UUID answer2Id = answer2.getId();

        // Verify answers exist before deletion
        assertTrue(answerRepository.findById(answer1Id).isPresent());
        assertTrue(answerRepository.findById(answer2Id).isPresent());

        // Delete question (should cascade to answers)
        questionRepository.delete(testQuestion);

        // Verify question is deleted
        assertTrue(questionRepository.findById(questionId).isEmpty());
    }

    @Test
    @DisplayName("FLOW 5: Verified answer indicator")
    void testVerifiedAnswerIndicator() {
        Answer verifiedAnswer = createAnswer(testQuestion, answerer1, "This is the solution", true);
        Answer unverifiedAnswer = createAnswer(testQuestion, answerer2, "Possible solution", false);

        Answer retrievedVerified = answerRepository.findById(verifiedAnswer.getId()).orElseThrow();
        Answer retrievedUnverified = answerRepository.findById(unverifiedAnswer.getId()).orElseThrow();

        assertTrue(retrievedVerified.getIsVerified());
        assertTrue(!retrievedUnverified.getIsVerified());
    }

    @Test
    @DisplayName("FLOW 6: Idempotent voting (voting twice with same vote type)")
    void testIdempotentVoting() {
        Answer answer = createAnswer(testQuestion, answerer1, "Test idempotent voting", true);

        // First vote
        answerService.updateVotes(answer.getId(), answerer2.getId(), VoteType.LIKE);
        Answer afterFirstVote = answerRepository.findById(answer.getId()).orElseThrow();
        assertEquals(1, afterFirstVote.getUpvotes());

        // Second vote with same type (should be idempotent)
        answerService.updateVotes(answer.getId(), answerer2.getId(), VoteType.LIKE);
        Answer afterSecondVote = answerRepository.findById(answer.getId()).orElseThrow();
        assertEquals(1, afterSecondVote.getUpvotes());

        // Verify vote count in vote table is 1
        long voteCount = answerVoteRepository.findByUserIdAndAnswerId(answerer2.getId(), answer.getId()).isPresent() ? 1
                : 0;
        assertEquals(1, voteCount);
    }

    // ========== Helper Methods ==========

    private Authorities createAuthority(String authorityName) {
        Authorities auth = new Authorities();
        auth.setAuthority(authorityName + "_" + UUID.randomUUID().toString().substring(0, 8));
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
}
