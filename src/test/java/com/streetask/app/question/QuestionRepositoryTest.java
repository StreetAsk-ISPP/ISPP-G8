package com.streetask.app.question;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import com.streetask.app.model.Event;
import com.streetask.app.model.Question;
import com.streetask.app.user.RegularUser;

/**
 * Repository tests for QuestionRepository
 * This tests the database queries using an in-memory database
 */
@DataJpaTest
class QuestionRepositoryTest {

	@Autowired
	private TestEntityManager entityManager;

	@Autowired
	private QuestionRepository questionRepository;

	private RegularUser creator1;
	private RegularUser creator2;
	private Event event1;
	private Event event2;
	private Question activeQuestion1;
	private Question inactiveQuestion1;
	private Question activeQuestion2;

	@BeforeEach
	void setUp() {
		// Create test creators
		creator1 = new RegularUser();
		creator1.setEmail("creator1@streetask.com");
		creator1.setUserName("creator1");
		creator1.setFirstName("Creator");
		creator1.setLastName("One");
		entityManager.persist(creator1);

		creator2 = new RegularUser();
		creator2.setEmail("creator2@streetask.com");
		creator2.setUserName("creator2");
		creator2.setFirstName("Creator");
		creator2.setLastName("Two");
		entityManager.persist(creator2);

		// Create test events
		event1 = new Event();
		event1.setTitle("Event 1");
		event1.setDescription("First Event");
		entityManager.persist(event1);

		event2 = new Event();
		event2.setTitle("Event 2");
		event2.setDescription("Second Event");
		entityManager.persist(event2);

		// Create test questions
		activeQuestion1 = createQuestion("Active Question 1", "Content 1", creator1, event1, true);
		inactiveQuestion1 = createQuestion("Inactive Question 1", "Content 2", creator1, event1, false);
		activeQuestion2 = createQuestion("Active Question 2", "Content 3", creator2, event2, true);

		entityManager.flush();
	}

	// =============== FIND BY CREATOR ID TESTS ===============

	@Test
	void findByCreatorId_shouldReturnQuestionsForCreator() {
		// Act
		Iterable<Question> questions = questionRepository.findByCreatorId(creator1.getId());

		// Assert
		List<Question> questionList = (List<Question>) questions;
		assertThat(questionList).hasSize(2);
		assertThat(questionList).extracting(Question::getTitle)
				.containsExactlyInAnyOrder("Active Question 1", "Inactive Question 1");
	}

	@Test
	void findByCreatorId_shouldReturnEmptyWhenNoQuestionsExist() {
		// Arrange
		UUID nonExistentCreatorId = UUID.randomUUID();

		// Act
		Iterable<Question> questions = questionRepository.findByCreatorId(nonExistentCreatorId);

		// Assert
		assertThat(questions).isEmpty();
	}

	// =============== FIND BY EVENT ID TESTS ===============

	@Test
	void findByEventId_shouldReturnQuestionsForEvent() {
		// Act
		Iterable<Question> questions = questionRepository.findByEventId(event1.getId());

		// Assert
		List<Question> questionList = (List<Question>) questions;
		assertThat(questionList).hasSize(2);
		assertThat(questionList).extracting(Question::getTitle)
				.containsExactlyInAnyOrder("Active Question 1", "Inactive Question 1");
	}

	@Test
	void findByEventId_shouldReturnEmptyWhenNoQuestionsExist() {
		// Arrange
		UUID nonExistentEventId = UUID.randomUUID();

		// Act
		Iterable<Question> questions = questionRepository.findByEventId(nonExistentEventId);

		// Assert
		assertThat(questions).isEmpty();
	}

	// =============== FIND BY ACTIVE TESTS ===============

	@Test
	void findByActive_shouldReturnOnlyActiveQuestions() {
		// Act
		Iterable<Question> questions = questionRepository.findByActive(true);

		// Assert
		List<Question> questionList = (List<Question>) questions;
		assertThat(questionList).hasSize(2);
		assertThat(questionList).extracting(Question::getTitle)
				.containsExactlyInAnyOrder("Active Question 1", "Active Question 2");
		assertThat(questionList).allMatch(Question::getActive);
	}

	@Test
	void findByActive_shouldReturnOnlyInactiveQuestions() {
		// Act
		Iterable<Question> questions = questionRepository.findByActive(false);

		// Assert
		List<Question> questionList = (List<Question>) questions;
		assertThat(questionList).hasSize(1);
		assertThat(questionList.get(0).getTitle()).isEqualTo("Inactive Question 1");
		assertThat(questionList.get(0).getActive()).isFalse();
	}

	// =============== FIND BY CREATOR ID AND ACTIVE TESTS ===============

	@Test
	void findByCreatorIdAndActive_shouldReturnFilteredQuestions() {
		// Act
		Iterable<Question> questions = questionRepository.findByCreatorIdAndActive(creator1.getId(), true);

		// Assert
		List<Question> questionList = (List<Question>) questions;
		assertThat(questionList).hasSize(1);
		assertThat(questionList.get(0).getTitle()).isEqualTo("Active Question 1");
		assertThat(questionList.get(0).getActive()).isTrue();
		assertThat(questionList.get(0).getCreator().getId()).isEqualTo(creator1.getId());
	}

	@Test
	void findByCreatorIdAndActive_shouldReturnEmptyWhenNoMatch() {
		// Act
		Iterable<Question> questions = questionRepository.findByCreatorIdAndActive(creator2.getId(), false);

		// Assert
		assertThat(questions).isEmpty();
	}

	// =============== FIND BY EVENT ID AND ACTIVE TESTS ===============

	@Test
	void findByEventIdAndActive_shouldReturnFilteredQuestions() {
		// Act
		Iterable<Question> questions = questionRepository.findByEventIdAndActive(event1.getId(), true);

		// Assert
		List<Question> questionList = (List<Question>) questions;
		assertThat(questionList).hasSize(1);
		assertThat(questionList.get(0).getTitle()).isEqualTo("Active Question 1");
		assertThat(questionList.get(0).getActive()).isTrue();
	}

	@Test
	void findByEventIdAndActive_shouldReturnEmptyWhenNoMatch() {
		// Act
		Iterable<Question> questions = questionRepository.findByEventIdAndActive(event2.getId(), false);

		// Assert
		assertThat(questions).isEmpty();
	}

	// =============== FIND BY CREATOR ID AND EVENT ID TESTS ===============

	@Test
	void findByCreatorIdAndEventId_shouldReturnFilteredQuestions() {
		// Act
		Iterable<Question> questions = questionRepository.findByCreatorIdAndEventId(
				creator1.getId(), event1.getId());

		// Assert
		List<Question> questionList = (List<Question>) questions;
		assertThat(questionList).hasSize(2);
		assertThat(questionList).extracting(Question::getTitle)
				.containsExactlyInAnyOrder("Active Question 1", "Inactive Question 1");
	}

	@Test
	void findByCreatorIdAndEventId_shouldReturnEmptyWhenNoMatch() {
		// Act
		Iterable<Question> questions = questionRepository.findByCreatorIdAndEventId(
				creator1.getId(), event2.getId());

		// Assert
		assertThat(questions).isEmpty();
	}

	// =============== FIND BY CREATOR ID, EVENT ID AND ACTIVE TESTS ===============

	@Test
	void findByCreatorIdAndEventIdAndActive_shouldReturnFilteredQuestions() {
		// Act
		Iterable<Question> questions = questionRepository.findByCreatorIdAndEventIdAndActive(
				creator1.getId(), event1.getId(), true);

		// Assert
		List<Question> questionList = (List<Question>) questions;
		assertThat(questionList).hasSize(1);
		assertThat(questionList.get(0).getTitle()).isEqualTo("Active Question 1");
		assertThat(questionList.get(0).getActive()).isTrue();
		assertThat(questionList.get(0).getCreator().getId()).isEqualTo(creator1.getId());
		assertThat(questionList.get(0).getEvent().getId()).isEqualTo(event1.getId());
	}

	@Test
	void findByCreatorIdAndEventIdAndActive_shouldReturnInactiveQuestions() {
		// Act
		Iterable<Question> questions = questionRepository.findByCreatorIdAndEventIdAndActive(
				creator1.getId(), event1.getId(), false);

		// Assert
		List<Question> questionList = (List<Question>) questions;
		assertThat(questionList).hasSize(1);
		assertThat(questionList.get(0).getTitle()).isEqualTo("Inactive Question 1");
		assertThat(questionList.get(0).getActive()).isFalse();
	}

	@Test
	void findByCreatorIdAndEventIdAndActive_shouldReturnEmptyWhenNoMatch() {
		// Act
		Iterable<Question> questions = questionRepository.findByCreatorIdAndEventIdAndActive(
				creator2.getId(), event1.getId(), true);

		// Assert
		assertThat(questions).isEmpty();
	}

	// =============== CRUD OPERATIONS TESTS ===============

	@Test
	void save_shouldPersistQuestion() {
		// Arrange
		Question newQuestion = createQuestion("New Question", "New Content", creator1, event1, true);

		// Act
		Question saved = questionRepository.save(newQuestion);
		entityManager.flush();

		// Assert
		assertThat(saved.getId()).isNotNull();
		assertThat(questionRepository.findById(saved.getId())).isPresent();
	}

	@Test
	void findById_shouldReturnQuestionWhenExists() {
		// Act
		var result = questionRepository.findById(activeQuestion1.getId());

		// Assert
		assertThat(result).isPresent();
		assertThat(result.get().getTitle()).isEqualTo("Active Question 1");
	}

	@Test
	void findAll_shouldReturnAllQuestions() {
		// Act
		Iterable<Question> questions = questionRepository.findAll();

		// Assert
		assertThat(questions).hasSize(3);
	}

	@Test
	void delete_shouldRemoveQuestion() {
		// Arrange
		UUID questionId = activeQuestion1.getId();

		// Act
		questionRepository.delete(activeQuestion1);
		entityManager.flush();

		// Assert
		assertThat(questionRepository.findById(questionId)).isEmpty();
	}

	@Test
	void update_shouldModifyQuestion() {
		// Arrange
		String newTitle = "Updated Title";
		activeQuestion1.setTitle(newTitle);

		// Act
		questionRepository.save(activeQuestion1);
		entityManager.flush();
		entityManager.clear(); // Clear the persistence context to force a fresh query

		// Assert
		Question updated = questionRepository.findById(activeQuestion1.getId()).get();
		assertThat(updated.getTitle()).isEqualTo(newTitle);
	}

	// =============== HELPER METHODS ===============

	private Question createQuestion(String title, String content, RegularUser creator, 
									Event event, Boolean active) {
		Question question = new Question();
		question.setTitle(title);
		question.setContent(content);
		question.setCreator(creator);
		question.setEvent(event);
		question.setActive(active);
		question.setCreatedAt(LocalDateTime.now());
		question.setExpiresAt(LocalDateTime.now().plusHours(2));
		question.setAnswerCount(0);
		return entityManager.persist(question);
	}

}
