package com.streetask.app.answer;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.context.ApplicationEventPublisher;

import com.streetask.app.exceptions.ResourceNotFoundException;
import com.streetask.app.functionalities.notifications.events.AnswerCreatedEvent;
import com.streetask.app.model.Answer;
import com.streetask.app.model.GeoPoint;
import com.streetask.app.model.Question;

class AnswerServiceTest {

    @Mock
    private AnswerRepository answerRepository;

    @Mock
    private ApplicationEventPublisher eventPublisher;

    @InjectMocks
    private AnswerService answerService;

    private Answer answer;
    private Question question;
    private UUID answerId;
    private UUID questionId;
    private UUID userId;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        answerId = UUID.randomUUID();
        questionId = UUID.randomUUID();
        userId = UUID.randomUUID();

        // Create test question with location and radius
        question = new Question();
        question.setId(questionId);
        question.setTitle("Test Question");
        question.setContent("Test Question Content");
        question.setLocation(new GeoPoint());
        question.getLocation().setLatitude(37.7749); // San Francisco
        question.getLocation().setLongitude(-122.4194);
        question.setRadiusKm(1.0f);
        question.setActive(true);
        question.setCreatedAt(LocalDateTime.now());

        // Create test answer
        answer = new Answer();
        answer.setId(answerId);
        answer.setQuestion(question);
        answer.setContent("Test Answer");
        answer.setUserLocation(new GeoPoint());
        answer.getUserLocation().setLatitude(37.7749); // Same location as question
        answer.getUserLocation().setLongitude(-122.4194);
    }

    @Test
    void testSaveAnswerWithValidLocation() {
        when(answerRepository.save(answer)).thenReturn(answer);

        Answer savedAnswer = answerService.saveAnswer(answer, question);

        assertNotNull(savedAnswer);
        assertEquals(answerId, savedAnswer.getId());
        assertEquals("Test Answer", savedAnswer.getContent());
        assertNotNull(savedAnswer.getCreatedAt());
        assertEquals(false, savedAnswer.getIsVerified());
        assertEquals(0, savedAnswer.getUpvotes());
        assertEquals(0, savedAnswer.getDownvotes());

        verify(answerRepository, times(1)).save(answer);

        ArgumentCaptor<AnswerCreatedEvent> eventCaptor = ArgumentCaptor.forClass(AnswerCreatedEvent.class);
        verify(eventPublisher, times(1)).publishEvent(eventCaptor.capture());
        assertEquals(answerId, eventCaptor.getValue().answerId());
    }

    @Test
    void testSaveAnswerOutsideRadius() {
        // Move answer location far away
        answer.getUserLocation().setLatitude(37.8044); // About 3.2 km away
        answer.getUserLocation().setLongitude(-122.2712);

        assertThrows(IllegalArgumentException.class, () -> {
            answerService.saveAnswer(answer, question);
        });

        verify(answerRepository, never()).save(answer);
        verifyNoInteractions(eventPublisher);
    }

    @Test
    void testSaveAnswerWithNullLocation() {
        answer.setUserLocation(null);

        assertThrows(IllegalArgumentException.class, () -> {
            answerService.saveAnswer(answer, question);
        });

        verify(answerRepository, never()).save(answer);
        verifyNoInteractions(eventPublisher);
    }

    @Test
    void testSaveAnswerWhenQuestionHasNoLocation() {
        answer.setUserLocation(null);
        question.setLocation(null);

        when(answerRepository.save(answer)).thenReturn(answer);

        Answer savedAnswer = answerService.saveAnswer(answer, question);

        assertNotNull(savedAnswer);
        verify(answerRepository, times(1)).save(answer);
        verify(eventPublisher, times(1)).publishEvent(any(AnswerCreatedEvent.class));
    }

    @Test
    void testSaveAnswerWhenQuestionHasNullRadius() {
        answer.setUserLocation(null);
        question.setRadiusKm(null);

        when(answerRepository.save(answer)).thenReturn(answer);

        Answer savedAnswer = answerService.saveAnswer(answer, question);

        assertNotNull(savedAnswer);
        verify(answerRepository, times(1)).save(answer);
        verify(eventPublisher, times(1)).publishEvent(any(AnswerCreatedEvent.class));
    }

    @Test
    void testSaveAnswerWhenQuestionHasZeroRadius() {
        answer.setUserLocation(null);
        question.setRadiusKm(0f);

        when(answerRepository.save(answer)).thenReturn(answer);

        Answer savedAnswer = answerService.saveAnswer(answer, question);

        assertNotNull(savedAnswer);
        verify(answerRepository, times(1)).save(answer);
        verify(eventPublisher, times(1)).publishEvent(any(AnswerCreatedEvent.class));
    }

    @Test
    void testSaveAnswerWhenQuestionHasNegativeRadius() {
        answer.setUserLocation(null);
        question.setRadiusKm(-2f);

        when(answerRepository.save(answer)).thenReturn(answer);

        Answer savedAnswer = answerService.saveAnswer(answer, question);

        assertNotNull(savedAnswer);
        verify(answerRepository, times(1)).save(answer);
        verify(eventPublisher, times(1)).publishEvent(any(AnswerCreatedEvent.class));
    }

    @Test
    void testFindAnswerById() {
        when(answerRepository.findById(answerId)).thenReturn(Optional.of(answer));

        Answer foundAnswer = answerService.findAnswer(answerId);

        assertNotNull(foundAnswer);
        assertEquals(answerId, foundAnswer.getId());
        verify(answerRepository, times(1)).findById(answerId);
    }

    @Test
    void testFindAnswerByIdNotFound() {
        when(answerRepository.findById(answerId)).thenReturn(Optional.empty());

        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class, () -> {
            answerService.findAnswer(answerId);
        });

        assertTrue(exception.getMessage().contains("Answer not found with id"));
        verify(answerRepository, times(1)).findById(answerId);
    }

    @Test
    void testFindAllDelegatesToRepository() {
        List<Answer> answers = List.of(answer);
        when(answerRepository.findAll()).thenReturn(answers);

        Iterable<Answer> result = answerService.findAll();

        assertSame(answers, result);
        verify(answerRepository, times(1)).findAll();
    }

    @Test
    void testFindByQuestionDelegatesToRepository() {
        List<Answer> answers = List.of(answer);
        when(answerRepository.findByQuestionId(questionId)).thenReturn(answers);

        Iterable<Answer> result = answerService.findByQuestion(questionId);

        assertSame(answers, result);
        verify(answerRepository, times(1)).findByQuestionId(questionId);
    }

    @Test
    void testFindByUserDelegatesToRepository() {
        List<Answer> answers = List.of(answer);
        when(answerRepository.findByUserId(userId)).thenReturn(answers);

        Iterable<Answer> result = answerService.findByUser(userId);

        assertSame(answers, result);
        verify(answerRepository, times(1)).findByUserId(userId);
    }

    @Test
    void testFindByIsVerifiedDelegatesToRepository() {
        List<Answer> answers = List.of(answer);
        when(answerRepository.findByIsVerified(true)).thenReturn(answers);

        Iterable<Answer> result = answerService.findByIsVerified(true);

        assertSame(answers, result);
        verify(answerRepository, times(1)).findByIsVerified(true);
    }

    @Test
    void testFindByUserAndIsVerifiedDelegatesToRepository() {
        List<Answer> answers = List.of(answer);
        when(answerRepository.findByUserIdAndIsVerified(userId, true)).thenReturn(answers);

        Iterable<Answer> result = answerService.findByUserAndIsVerified(userId, true);

        assertSame(answers, result);
        verify(answerRepository, times(1)).findByUserIdAndIsVerified(userId, true);
    }

    @Test
    void testFindByQuestionAndIsVerifiedDelegatesToRepository() {
        List<Answer> answers = List.of(answer);
        when(answerRepository.findByQuestionIdAndIsVerified(questionId, true)).thenReturn(answers);

        Iterable<Answer> result = answerService.findByQuestionAndIsVerified(questionId, true);

        assertSame(answers, result);
        verify(answerRepository, times(1)).findByQuestionIdAndIsVerified(questionId, true);
    }

    @Test
    void testFindByQuestionAndUserDelegatesToRepository() {
        List<Answer> answers = List.of(answer);
        when(answerRepository.findByQuestionIdAndUserId(questionId, userId)).thenReturn(answers);

        Iterable<Answer> result = answerService.findByQuestionAndUser(questionId, userId);

        assertSame(answers, result);
        verify(answerRepository, times(1)).findByQuestionIdAndUserId(questionId, userId);
    }

    @Test
    void testFindByQuestionAndUserAndIsVerifiedDelegatesToRepository() {
        List<Answer> answers = List.of(answer);
        when(answerRepository.findByQuestionIdAndUserIdAndIsVerified(questionId, userId, true)).thenReturn(answers);

        Iterable<Answer> result = answerService.findByQuestionAndUserAndIsVerified(questionId, userId, true);

        assertSame(answers, result);
        verify(answerRepository, times(1)).findByQuestionIdAndUserIdAndIsVerified(questionId, userId, true);
    }

    @Test
    void testDeleteAnswer() {
        when(answerRepository.findById(answerId)).thenReturn(Optional.of(answer));

        answerService.deleteAnswer(answerId);

        verify(answerRepository, times(1)).findById(answerId);
        verify(answerRepository, times(1)).delete(answer);
    }

    @Test
    void testUpdateAnswerWithValidLocation() {
        Answer updatedAnswer = new Answer();
        updatedAnswer.setContent("Updated Answer");
        updatedAnswer.setUserLocation(new GeoPoint());
        updatedAnswer.getUserLocation().setLatitude(37.7749);
        updatedAnswer.getUserLocation().setLongitude(-122.4194);

        when(answerRepository.findById(answerId)).thenReturn(Optional.of(answer));
        when(answerRepository.save(answer)).thenReturn(answer);

        Answer result = answerService.updateAnswer(updatedAnswer, answerId, question);

        assertNotNull(result);
        assertSame(answer, result);
        assertEquals("Updated Answer", result.getContent());
        assertEquals(37.7749, result.getUserLocation().getLatitude());
        assertEquals(-122.4194, result.getUserLocation().getLongitude());
        verify(answerRepository, times(1)).findById(answerId);
        verify(answerRepository, times(1)).save(answer);
    }

    @Test
    void testUpdateVotesIncrementsUpvotes() {
        answer.setUpvotes(2);
        answer.setDownvotes(3);

        when(answerRepository.findById(answerId)).thenReturn(Optional.of(answer));
        when(answerRepository.save(answer)).thenReturn(answer);

        Answer result = answerService.updateVotes(answerId, 1, 0);

        assertEquals(3, result.getUpvotes());
        assertEquals(3, result.getDownvotes());
        verify(answerRepository, times(1)).save(answer);
    }

    @Test
    void testUpdateVotesIncrementsDownvotes() {
        answer.setUpvotes(2);
        answer.setDownvotes(3);

        when(answerRepository.findById(answerId)).thenReturn(Optional.of(answer));
        when(answerRepository.save(answer)).thenReturn(answer);

        Answer result = answerService.updateVotes(answerId, 0, 1);

        assertEquals(2, result.getUpvotes());
        assertEquals(4, result.getDownvotes());
        verify(answerRepository, times(1)).save(answer);
    }

    @Test
    void testUpdateVotesPreventsNegativeUpvotes() {
        answer.setUpvotes(1);
        answer.setDownvotes(2);

        when(answerRepository.findById(answerId)).thenReturn(Optional.of(answer));
        when(answerRepository.save(answer)).thenReturn(answer);

        Answer result = answerService.updateVotes(answerId, -5, 0);

        assertEquals(0, result.getUpvotes());
        assertEquals(2, result.getDownvotes());
        verify(answerRepository, times(1)).save(answer);
    }

    @Test
    void testUpdateVotesPreventsNegativeDownvotes() {
        answer.setUpvotes(3);
        answer.setDownvotes(1);

        when(answerRepository.findById(answerId)).thenReturn(Optional.of(answer));
        when(answerRepository.save(answer)).thenReturn(answer);

        Answer result = answerService.updateVotes(answerId, 0, -5);

        assertEquals(3, result.getUpvotes());
        assertEquals(0, result.getDownvotes());
        verify(answerRepository, times(1)).save(answer);
    }

    @Test
    void testUpdateVotesNotFound() {
        when(answerRepository.findById(answerId)).thenReturn(Optional.empty());

        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class,
                () -> answerService.updateVotes(answerId, 1, 1));

        assertTrue(exception.getMessage().contains("Answer not found with id"));
        verify(answerRepository, times(1)).findById(answerId);
        verify(answerRepository, never()).save(any(Answer.class));
    }
}
