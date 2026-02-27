package com.streetask.app.question;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.streetask.app.model.Question;
import com.streetask.app.user.Authorities;
import com.streetask.app.user.RegularUser;
import com.streetask.app.user.UserRepository;

import jakarta.transaction.Transactional;

/**
 * Integration tests for QuestionRestController
 * This tests the REST endpoints with real Spring context
 */
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class QuestionRestControllerTest {

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private ObjectMapper objectMapper;

	@Autowired
	private QuestionRepository questionRepository;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private jakarta.persistence.EntityManager entityManager;

	private RegularUser testCreator;
	private Question testQuestion;

	@BeforeEach
	void setUp() {
		// Find existing authority from data.sql
		Authorities userAuthority = entityManager.find(Authorities.class,
				java.util.UUID.fromString("22222222-2222-2222-2222-222222222222"));

		// Create a test user
		testCreator = new RegularUser();
		testCreator.setEmail("testcreator@streetask.com");
		testCreator.setUserName("testcreator");
		testCreator.setFirstName("Test");
		testCreator.setLastName("Creator");
		testCreator.setAuthority(userAuthority);
		testCreator = userRepository.save(testCreator);

		// Create a test question
		testQuestion = new Question();
		testQuestion.setTitle("Test Question");
		testQuestion.setContent("Test Content");
		testQuestion.setCreator(testCreator);
		testQuestion.setActive(true);
		testQuestion.setAnswerCount(0);
		testQuestion.setCreatedAt(LocalDateTime.now());
		testQuestion.setExpiresAt(LocalDateTime.now().plusHours(2));
		testQuestion = questionRepository.save(testQuestion);
	}

	// =============== GET ALL QUESTIONS TESTS ===============

	@Test
	@WithMockUser
	void findAll_shouldReturnAllQuestions() throws Exception {
		mockMvc.perform(get("/api/v1/questions")
				.contentType(APPLICATION_JSON))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$", hasSize(1)))
				.andExpect(jsonPath("$[0].title").value("Test Question"))
				.andExpect(jsonPath("$[0].content").value("Test Content"));
	}

	@Test
	@WithMockUser
	void findAll_withCreatorIdParam_shouldReturnFilteredQuestions() throws Exception {
		mockMvc.perform(get("/api/v1/questions")
				.param("creatorId", testCreator.getId().toString())
				.contentType(APPLICATION_JSON))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$", hasSize(1)))
				.andExpect(jsonPath("$[0].title").value("Test Question"));
	}

	@Test
	@WithMockUser
	void findAll_withActiveParam_shouldReturnFilteredQuestions() throws Exception {
		mockMvc.perform(get("/api/v1/questions")
				.param("active", "true")
				.contentType(APPLICATION_JSON))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$", hasSize(1)))
				.andExpect(jsonPath("$[0].active").value(true));
	}

	@Test
	@WithMockUser
	void findAll_withMultipleParams_shouldReturnFilteredQuestions() throws Exception {
		mockMvc.perform(get("/api/v1/questions")
				.param("creatorId", testCreator.getId().toString())
				.param("active", "true")
				.contentType(APPLICATION_JSON))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$", hasSize(1)));
	}

	// =============== GET QUESTION BY ID TESTS ===============

	@Test
	@WithMockUser
	void findById_shouldReturnQuestionWhenExists() throws Exception {
		mockMvc.perform(get("/api/v1/questions/{id}", testQuestion.getId())
				.contentType(APPLICATION_JSON))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.id").value(testQuestion.getId().toString()))
				.andExpect(jsonPath("$.title").value("Test Question"))
				.andExpect(jsonPath("$.content").value("Test Content"))
				.andExpect(jsonPath("$.active").value(true));
	}

	@Test
	@WithMockUser
	void findById_shouldReturnNotFoundWhenQuestionDoesNotExist() throws Exception {
		UUID nonExistentId = UUID.randomUUID();
		
		mockMvc.perform(get("/api/v1/questions/{id}", nonExistentId)
				.contentType(APPLICATION_JSON))
				.andExpect(status().isNotFound());
	}

	// =============== CREATE QUESTION TESTS ===============

	@Test
	@WithMockUser
	void create_shouldCreateQuestionWhenPayloadIsValid() throws Exception {
		Map<String, Object> questionPayload = createValidQuestionPayload();

		mockMvc.perform(post("/api/v1/questions")
				.contentType(APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(questionPayload)))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.title").value("New Question"))
				.andExpect(jsonPath("$.content").value("New Content"))
				.andExpect(jsonPath("$.active").value(true))
				.andExpect(jsonPath("$.answerCount").value(0))
				.andExpect(jsonPath("$.createdAt").exists())
				.andExpect(jsonPath("$.expiresAt").exists());

		// Verify the question was actually saved
		assertThat(questionRepository.count()).isEqualTo(2);
	}

	@Test
	@WithMockUser
	void create_shouldApplyDefaultValues() throws Exception {
		Map<String, Object> questionPayload = new HashMap<>();
		questionPayload.put("title", "Question Without Defaults");
		questionPayload.put("content", "Content");
		questionPayload.put("creator", Map.of("id", testCreator.getId().toString()));

		mockMvc.perform(post("/api/v1/questions")
				.contentType(APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(questionPayload)))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.active").value(true))
				.andExpect(jsonPath("$.answerCount").value(0))
				.andExpect(jsonPath("$.createdAt").exists())
				.andExpect(jsonPath("$.expiresAt").exists());
	}

	@Test
	@WithMockUser
	void create_shouldReturnBadRequestWhenTitleIsMissing() throws Exception {
		Map<String, Object> invalidPayload = new HashMap<>();
		invalidPayload.put("content", "Content without title");
		invalidPayload.put("creator", Map.of("id", testCreator.getId().toString()));

		mockMvc.perform(post("/api/v1/questions")
				.contentType(APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(invalidPayload)))
				.andExpect(status().isBadRequest());
	}

	@Test
	@WithMockUser
	void create_shouldReturnBadRequestWhenContentIsMissing() throws Exception {
		Map<String, Object> invalidPayload = new HashMap<>();
		invalidPayload.put("title", "Title without content");
		invalidPayload.put("creator", Map.of("id", testCreator.getId().toString()));

		mockMvc.perform(post("/api/v1/questions")
				.contentType(APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(invalidPayload)))
				.andExpect(status().isBadRequest());
	}

	// =============== UPDATE QUESTION TESTS ===============

	@Test
	@WithMockUser
	void update_shouldUpdateQuestionWhenExists() throws Exception {
		Map<String, Object> updatePayload = new HashMap<>();
		updatePayload.put("title", "Updated Title");
		updatePayload.put("content", "Updated Content");
		updatePayload.put("active", false);
		updatePayload.put("creator", Map.of("id", testCreator.getId().toString()));

		mockMvc.perform(put("/api/v1/questions/{questionId}", testQuestion.getId())
				.contentType(APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(updatePayload)))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.id").value(testQuestion.getId().toString()))
				.andExpect(jsonPath("$.title").value("Updated Title"))
				.andExpect(jsonPath("$.content").value("Updated Content"))
				.andExpect(jsonPath("$.active").value(false));
	}

	@Test
	@WithMockUser
	void update_shouldNotUpdateAnswerCount() throws Exception {
		// Set initial answer count
		testQuestion.setAnswerCount(5);
		questionRepository.save(testQuestion);

		Map<String, Object> updatePayload = new HashMap<>();
		updatePayload.put("title", "Updated Title");
		updatePayload.put("content", "Updated Content");
		updatePayload.put("answerCount", 999); // Try to change it
		updatePayload.put("creator", Map.of("id", testCreator.getId().toString()));

		mockMvc.perform(put("/api/v1/questions/{questionId}", testQuestion.getId())
				.contentType(APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(updatePayload)))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.answerCount").value(5)); // Should remain unchanged
	}

	@Test
	@WithMockUser
	void update_shouldReturnNotFoundWhenQuestionDoesNotExist() throws Exception {
		UUID nonExistentId = UUID.randomUUID();
		Map<String, Object> updatePayload = createValidQuestionPayload();

		mockMvc.perform(put("/api/v1/questions/{questionId}", nonExistentId)
				.contentType(APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(updatePayload)))
				.andExpect(status().isNotFound());
	}

	@Test
	@WithMockUser
	void update_shouldReturnBadRequestWhenPayloadIsInvalid() throws Exception {
		Map<String, Object> invalidPayload = new HashMap<>();
		invalidPayload.put("title", ""); // Invalid: empty title
		invalidPayload.put("creator", Map.of("id", testCreator.getId().toString()));

		mockMvc.perform(put("/api/v1/questions/{questionId}", testQuestion.getId())
				.contentType(APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(invalidPayload)))
				.andExpect(status().isBadRequest());
	}

	// =============== DELETE QUESTION TESTS ===============

	@Test
	@WithMockUser
	void delete_shouldDeleteQuestionWhenExists() throws Exception {
		mockMvc.perform(delete("/api/v1/questions/{questionId}", testQuestion.getId())
				.contentType(APPLICATION_JSON))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.message").value("Question deleted!"));

		// Verify the question was actually deleted
		assertThat(questionRepository.findById(testQuestion.getId())).isEmpty();
	}

	@Test
	@WithMockUser
	void delete_shouldReturnNotFoundWhenQuestionDoesNotExist() throws Exception {
		UUID nonExistentId = UUID.randomUUID();

		mockMvc.perform(delete("/api/v1/questions/{questionId}", nonExistentId)
				.contentType(APPLICATION_JSON))
				.andExpect(status().isNotFound());
	}

	// =============== HELPER METHODS ===============

	private Map<String, Object> createValidQuestionPayload() {
		Map<String, Object> payload = new HashMap<>();
		payload.put("title", "New Question");
		payload.put("content", "New Content");
		payload.put("creator", Map.of("id", testCreator.getId().toString()));
		return payload;
	}

}
