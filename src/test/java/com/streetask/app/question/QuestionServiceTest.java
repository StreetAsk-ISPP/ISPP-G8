package com.streetask.app.question;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import com.streetask.app.exceptions.ResourceNotFoundException;
import com.streetask.app.model.Question;
import com.streetask.app.user.RegularUser;
import com.streetask.app.user.RegularUserRepository;

/**
 * Unit tests for QuestionService
 * This tests the service layer logic in isolation using mocks
 */
@ExtendWith(MockitoExtension.class)
class QuestionServiceTest {

	@Mock
	private QuestionRepository questionRepository;

	@Mock
	private RegularUserRepository regularUserRepository;

	@Mock
	private ApplicationEventPublisher eventPublisher;

	@InjectMocks
	private QuestionService questionService;

	private Question testQuestion;
	private UUID testId;
	private RegularUser testCreator;
	private static final String TEST_EMAIL = "creator@test.com";

	@BeforeEach
	void setUp() {
		testId = UUID.randomUUID();
		testCreator = new RegularUser();
		testCreator.setId(UUID.randomUUID());
		testCreator.setEmail(TEST_EMAIL);

		testQuestion = new Question();
		testQuestion.setId(testId);
		testQuestion.setTitle("Test Question");
		testQuestion.setContent("Test Content");
		testQuestion.setCreator(testCreator);

		SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
		Authentication authentication = org.mockito.Mockito.mock(Authentication.class);
		lenient().when(authentication.getName()).thenReturn(TEST_EMAIL);
		securityContext.setAuthentication(authentication);
		SecurityContextHolder.setContext(securityContext);
		lenient().when(regularUserRepository.findByEmail(TEST_EMAIL)).thenReturn(Optional.of(testCreator));
	}

	@AfterEach
	void tearDown() {
		SecurityContextHolder.clearContext();
	}

	// =============== SAVE QUESTION TESTS ===============

	@Test
	void saveQuestion_shouldApplyDefaultsAndSaveSuccessfully() {
		// Arrange
		Question newQuestion = new Question();
		newQuestion.setTitle("New Question");
		newQuestion.setContent("New Content");
		newQuestion.setCreator(testCreator);

		when(questionRepository.save(any(Question.class))).thenReturn(newQuestion);

		// Act
		Question saved = questionService.saveQuestion(newQuestion);

		// Assert
		assertThat(saved.getCreatedAt()).isNotNull();
		assertThat(saved.getActive()).isTrue();
		assertThat(saved.getAnswerCount()).isZero();
		assertThat(saved.getExpiresAt()).isNotNull();
		assertThat(saved.getExpiresAt()).isAfter(saved.getCreatedAt());
		verify(questionRepository, times(1)).save(newQuestion);
	}

	@Test
	void saveQuestion_shouldSetExpiresAtTwoHoursAfterCreatedAt() {
		// Arrange
		Question newQuestion = new Question();
		newQuestion.setTitle("New Question");
		newQuestion.setContent("New Content");
		newQuestion.setCreator(testCreator);

		when(questionRepository.save(any(Question.class))).thenReturn(newQuestion);

		// Act
		Question saved = questionService.saveQuestion(newQuestion);

		// Assert
		assertThat(saved.getExpiresAt()).isEqualTo(saved.getCreatedAt().plusHours(2));
	}

	@Test
	void saveQuestion_shouldNotOverrideExistingValues() {
		// Arrange
		LocalDateTime specificCreatedAt = LocalDateTime.now().minusDays(1);
		LocalDateTime specificExpiresAt = LocalDateTime.now().plusDays(1);
		
		Question newQuestion = new Question();
		newQuestion.setTitle("New Question");
		newQuestion.setContent("New Content");
		newQuestion.setCreator(testCreator);
		newQuestion.setCreatedAt(specificCreatedAt);
		newQuestion.setActive(false);
		newQuestion.setAnswerCount(5);
		newQuestion.setExpiresAt(specificExpiresAt);

		when(questionRepository.save(any(Question.class))).thenReturn(newQuestion);

		// Act
		Question saved = questionService.saveQuestion(newQuestion);

		// Assert
		assertThat(saved.getCreatedAt()).isEqualTo(specificCreatedAt);
		assertThat(saved.getActive()).isFalse();
		assertThat(saved.getAnswerCount()).isEqualTo(5);
		assertThat(saved.getExpiresAt()).isEqualTo(specificExpiresAt);
	}

	// =============== FIND QUESTION TESTS ===============

	@Test
	void findQuestion_shouldReturnQuestionWhenExists() {
		// Arrange
		when(questionRepository.findById(testId)).thenReturn(Optional.of(testQuestion));

		// Act
		Question found = questionService.findQuestion(testId);

		// Assert
		assertThat(found).isNotNull();
		assertThat(found.getId()).isEqualTo(testId);
		assertThat(found.getTitle()).isEqualTo("Test Question");
		verify(questionRepository, times(1)).findById(testId);
	}

	@Test
	void findQuestion_shouldThrowResourceNotFoundExceptionWhenDoesNotExist() {
		// Arrange
		UUID nonExistentId = UUID.randomUUID();
		when(questionRepository.findById(nonExistentId)).thenReturn(Optional.empty());

		// Act & Assert
		assertThatThrownBy(() -> questionService.findQuestion(nonExistentId))
				.isInstanceOf(ResourceNotFoundException.class)
				.hasMessageContaining("Question")
				.hasMessageContaining(nonExistentId.toString());
		verify(questionRepository, times(1)).findById(nonExistentId);
	}

	// =============== FIND ALL TESTS ===============

	@Test
	void findAll_shouldReturnAllQuestions() {
		// Arrange
		Question question2 = new Question();
		question2.setId(UUID.randomUUID());
		question2.setTitle("Question 2");

		when(questionRepository.findAll()).thenReturn(Arrays.asList(testQuestion, question2));

		// Act
		Iterable<Question> questions = questionService.findAll();

		// Assert
		assertThat(questions).hasSize(2);
		verify(questionRepository, times(1)).findAll();
	}

	// =============== FIND BY CREATOR TESTS ===============

	@Test
	void findByCreator_shouldReturnQuestionsForCreator() {
		// Arrange
		UUID creatorId = testCreator.getId();
		when(questionRepository.findByCreatorId(creatorId)).thenReturn(Arrays.asList(testQuestion));

		// Act
		Iterable<Question> questions = questionService.findByCreator(creatorId);

		// Assert
		assertThat(questions).hasSize(1);
		verify(questionRepository, times(1)).findByCreatorId(creatorId);
	}

	// =============== FIND BY EVENT TESTS ===============

	@Test
	void findByEvent_shouldReturnQuestionsForEvent() {
		// Arrange
		UUID eventId = UUID.randomUUID();
		when(questionRepository.findByEventId(eventId)).thenReturn(Arrays.asList(testQuestion));

		// Act
		Iterable<Question> questions = questionService.findByEvent(eventId);

		// Assert
		assertThat(questions).hasSize(1);
		verify(questionRepository, times(1)).findByEventId(eventId);
	}

	// =============== FIND BY ACTIVE TESTS ===============

	@Test
	void findByActive_shouldReturnActiveQuestions() {
		// Arrange
		when(questionRepository.findByActive(true)).thenReturn(Arrays.asList(testQuestion));

		// Act
		Iterable<Question> questions = questionService.findByActive(true);

		// Assert
		assertThat(questions).hasSize(1);
		verify(questionRepository, times(1)).findByActive(true);
	}

	// =============== FIND BY CREATOR AND ACTIVE TESTS ===============

	@Test
	void findByCreatorAndActive_shouldReturnFilteredQuestions() {
		// Arrange
		UUID creatorId = testCreator.getId();
		when(questionRepository.findByCreatorIdAndActive(creatorId, true))
				.thenReturn(Arrays.asList(testQuestion));

		// Act
		Iterable<Question> questions = questionService.findByCreatorAndActive(creatorId, true);

		// Assert
		assertThat(questions).hasSize(1);
		verify(questionRepository, times(1)).findByCreatorIdAndActive(creatorId, true);
	}

	// =============== FIND BY EVENT AND ACTIVE TESTS ===============

	@Test
	void findByEventAndActive_shouldReturnFilteredQuestions() {
		// Arrange
		UUID eventId = UUID.randomUUID();
		when(questionRepository.findByEventIdAndActive(eventId, true))
				.thenReturn(Arrays.asList(testQuestion));

		// Act
		Iterable<Question> questions = questionService.findByEventAndActive(eventId, true);

		// Assert
		assertThat(questions).hasSize(1);
		verify(questionRepository, times(1)).findByEventIdAndActive(eventId, true);
	}

	// =============== FIND BY CREATOR AND EVENT TESTS ===============

	@Test
	void findByCreatorAndEvent_shouldReturnFilteredQuestions() {
		// Arrange
		UUID creatorId = testCreator.getId();
		UUID eventId = UUID.randomUUID();
		when(questionRepository.findByCreatorIdAndEventId(creatorId, eventId))
				.thenReturn(Arrays.asList(testQuestion));

		// Act
		Iterable<Question> questions = questionService.findByCreatorAndEvent(creatorId, eventId);

		// Assert
		assertThat(questions).hasSize(1);
		verify(questionRepository, times(1)).findByCreatorIdAndEventId(creatorId, eventId);
	}

	// =============== FIND BY CREATOR, EVENT AND ACTIVE TESTS ===============

	@Test
	void findByCreatorAndEventAndActive_shouldReturnFilteredQuestions() {
		// Arrange
		UUID creatorId = testCreator.getId();
		UUID eventId = UUID.randomUUID();
		when(questionRepository.findByCreatorIdAndEventIdAndActive(creatorId, eventId, true))
				.thenReturn(Arrays.asList(testQuestion));

		// Act
		Iterable<Question> questions = questionService.findByCreatorAndEventAndActive(creatorId, eventId, true);

		// Assert
		assertThat(questions).hasSize(1);
		verify(questionRepository, times(1)).findByCreatorIdAndEventIdAndActive(creatorId, eventId, true);
	}

	// =============== UPDATE QUESTION TESTS ===============

	@Test
	void updateQuestion_shouldUpdateAndReturnQuestion() {
		// Arrange
		Question updatedData = new Question();
		updatedData.setTitle("Updated Title");
		updatedData.setContent("Updated Content");
		updatedData.setActive(false);

		when(questionRepository.findById(testId)).thenReturn(Optional.of(testQuestion));
		when(questionRepository.save(any(Question.class))).thenReturn(testQuestion);

		// Act
		Question updated = questionService.updateQuestion(updatedData, testId);

		// Assert
		assertThat(updated.getTitle()).isEqualTo("Updated Title");
		assertThat(updated.getContent()).isEqualTo("Updated Content");
		assertThat(updated.getActive()).isFalse();
		verify(questionRepository, times(1)).findById(testId);
		verify(questionRepository, times(1)).save(testQuestion);
	}

	@Test
	void updateQuestion_shouldNotUpdateIdCreatedAtOrAnswerCount() {
		// Arrange
		LocalDateTime originalCreatedAt = LocalDateTime.now().minusDays(1);
		testQuestion.setCreatedAt(originalCreatedAt);
		testQuestion.setAnswerCount(10);

		Question updatedData = new Question();
		UUID differentId = UUID.randomUUID();
		updatedData.setId(differentId);
		updatedData.setTitle("Updated Title");
		updatedData.setCreatedAt(LocalDateTime.now());
		updatedData.setAnswerCount(999);

		when(questionRepository.findById(testId)).thenReturn(Optional.of(testQuestion));
		when(questionRepository.save(any(Question.class))).thenReturn(testQuestion);

		// Act
		Question updated = questionService.updateQuestion(updatedData, testId);

		// Assert
		assertThat(updated.getId()).isEqualTo(testId).isNotEqualTo(differentId);
		assertThat(updated.getCreatedAt()).isEqualTo(originalCreatedAt);
		assertThat(updated.getAnswerCount()).isEqualTo(10).isNotEqualTo(999);
	}

	@Test
	void updateQuestion_shouldThrowExceptionWhenQuestionNotFound() {
		// Arrange
		UUID nonExistentId = UUID.randomUUID();
		Question updatedData = new Question();
		updatedData.setTitle("Updated Title");

		when(questionRepository.findById(nonExistentId)).thenReturn(Optional.empty());

		// Act & Assert
		assertThatThrownBy(() -> questionService.updateQuestion(updatedData, nonExistentId))
				.isInstanceOf(ResourceNotFoundException.class);
		verify(questionRepository, times(1)).findById(nonExistentId);
		verify(questionRepository, times(0)).save(any(Question.class));
	}

	// =============== DELETE QUESTION TESTS ===============

	@Test
	void deleteQuestion_shouldDeleteSuccessfully() {
		// Arrange
		when(questionRepository.findById(testId)).thenReturn(Optional.of(testQuestion));

		// Act
		questionService.deleteQuestion(testId);

		// Assert
		verify(questionRepository, times(1)).findById(testId);
		verify(questionRepository, times(1)).delete(testQuestion);
	}

	@Test
	void deleteQuestion_shouldThrowExceptionWhenQuestionNotFound() {
		// Arrange
		UUID nonExistentId = UUID.randomUUID();
		when(questionRepository.findById(nonExistentId)).thenReturn(Optional.empty());

		// Act & Assert
		assertThatThrownBy(() -> questionService.deleteQuestion(nonExistentId))
				.isInstanceOf(ResourceNotFoundException.class);
		verify(questionRepository, times(1)).findById(nonExistentId);
		verify(questionRepository, times(0)).delete(any(Question.class));
	}

}
