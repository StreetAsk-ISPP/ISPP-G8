package com.streetask.app.answer;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.streetask.app.model.Answer;
import com.streetask.app.model.GeoPoint;
import com.streetask.app.model.Question;
import com.streetask.app.user.RegularUser;

class AnswerServiceTest {

    @Mock
    private AnswerRepository answerRepository;

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
    }

    @Test
    void testSaveAnswerOutsideRadius() {
        // Move answer location far away
        answer.getUserLocation().setLatitude(37.8044); // About 3.2 km away
        answer.getUserLocation().setLongitude(-122.2712);

        when(answerRepository.save(answer)).thenReturn(answer);

        assertThrows(IllegalArgumentException.class, () -> {
            answerService.saveAnswer(answer, question);
        });

        verify(answerRepository, never()).save(answer);
    }

    @Test
    void testSaveAnswerWithNullLocation() {
        answer.setUserLocation(null);

        assertThrows(IllegalArgumentException.class, () -> {
            answerService.saveAnswer(answer, question);
        });

        verify(answerRepository, never()).save(answer);
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

        assertThrows(Exception.class, () -> {
            answerService.findAnswer(answerId);
        });

        verify(answerRepository, times(1)).findById(answerId);
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
        assertEquals("Updated Answer", result.getContent());
        verify(answerRepository, times(1)).save(answer);
    }
}
