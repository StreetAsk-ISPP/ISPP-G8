package com.streetask.app.answer;

import java.util.UUID;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.streetask.app.auth.payload.response.MessageResponse;
import com.streetask.app.model.Answer;
import com.streetask.app.model.Question;
import com.streetask.app.model.enums.VoteType;
import com.streetask.app.question.QuestionService;
import com.streetask.app.util.RestPreconditions;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/v1/answers")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Answers", description = "Endpoints for managing answer threads on questions")
public class AnswerRestController {

	private final AnswerService answerService;
	private final QuestionService questionService;

	@Autowired
	public AnswerRestController(AnswerService answerService, QuestionService questionService) {
		this.answerService = answerService;
		this.questionService = questionService;
	}

	@GetMapping
	public ResponseEntity<Iterable<Answer>> findAll(@RequestParam(required = false) UUID questionId,
			@RequestParam(required = false) UUID userId, @RequestParam(required = false) Boolean isVerified,
			@RequestParam(required = false) String sort, @RequestParam(required = false) Integer page,
			@RequestParam(required = false) Integer size) {
		Iterable<Answer> res;
		if (questionId != null && userId != null && isVerified != null) {
			res = answerService.findByQuestionAndUserAndIsVerified(questionId, userId, isVerified);
		} else if (questionId != null && userId != null) {
			res = answerService.findByQuestionAndUser(questionId, userId);
		} else if (questionId != null && isVerified != null) {
			res = answerService.findByQuestionAndIsVerified(questionId, isVerified);
		} else if (userId != null && isVerified != null) {
			res = answerService.findByUserAndIsVerified(userId, isVerified);
		} else if (questionId != null) {
			res = answerService.findByQuestionSorted(questionId, sort, page, size);
		} else if (userId != null) {
			res = answerService.findByUser(userId);
		} else if (isVerified != null) {
			res = answerService.findByIsVerified(isVerified);
		} else {
			res = answerService.findAll();
		}
		return new ResponseEntity<>(res, HttpStatus.OK);
	}

	@GetMapping(value = "{id}")
	@Operation(summary = "Get answer by ID")
	public ResponseEntity<Answer> findById(@PathVariable("id") UUID id) {
		return new ResponseEntity<>(answerService.findAnswer(id), HttpStatus.OK);
	}

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	@Operation(summary = "Create a new answer to a question", description = "Post an answer to a question. The user's location must be within the question's radius. The answer will be stored with location validation.")
	public ResponseEntity<?> create(@RequestBody @Valid Answer answer) {
		// Validate that the question exists and get it
		RestPreconditions.checkNotNull(answer.getQuestion(), "Answer", "question", answer.getQuestion());
		UUID questionId = answer.getQuestion().getId();
		RestPreconditions.checkNotNull(questionId, "Question", "id", questionId);
		Question question = questionService.findQuestion(questionId);
		answer.setQuestion(question);

		// Save the answer with location validation
		try {
			Answer savedAnswer = answerService.saveAnswer(answer, question);
			return new ResponseEntity<>(savedAnswer, HttpStatus.CREATED);
		} catch (IllegalArgumentException e) {
			return new ResponseEntity<>(new MessageResponse(e.getMessage()), HttpStatus.BAD_REQUEST);
		}
	}

	@PutMapping(value = "{answerId}")
	@ResponseStatus(HttpStatus.OK)
	@Operation(summary = "Update an answer")
	public ResponseEntity<?> update(@PathVariable("answerId") UUID id,
			@RequestBody @Valid Answer answer) {
		// Validate that the answer exists
		Answer existingAnswer = answerService.findAnswer(id);
		RestPreconditions.checkNotNull(existingAnswer, "Answer", "id", id);

		// Get the question from the existing answer
		Question question = existingAnswer.getQuestion();
		RestPreconditions.checkNotNull(question, "Question", "id", question.getId());

		// Update the answer with location validation
		try {
			return new ResponseEntity<>(answerService.updateAnswer(answer, id, question), HttpStatus.OK);
		} catch (IllegalArgumentException e) {
			return new ResponseEntity<>(new MessageResponse(e.getMessage()), HttpStatus.BAD_REQUEST);
		}
	}

	@DeleteMapping(value = "{answerId}")
	@ResponseStatus(HttpStatus.OK)
	@Operation(summary = "Delete an answer")
	public ResponseEntity<MessageResponse> delete(@PathVariable("answerId") UUID id) {
		RestPreconditions.checkNotNull(answerService.findAnswer(id), "Answer", "ID", id);
		answerService.deleteAnswer(id);
		return new ResponseEntity<>(new MessageResponse("Answer deleted!"), HttpStatus.OK);
	}

	@GetMapping("/votes")
	@Operation(summary = "Get the authenticated user's votes for all answers of a question")
	public ResponseEntity<?> getUserVotes(
			@RequestParam UUID userId,
			@RequestParam UUID questionId) {
		return new ResponseEntity<>(answerService.getUserVotesForQuestion(userId, questionId), HttpStatus.OK);
	}

	@PutMapping(value = "{answerId}/votes")
	@ResponseStatus(HttpStatus.OK)
	@Operation(summary = "Vote on an answer (once per user)")
	public ResponseEntity<?> updateVotes(
			@PathVariable("answerId") UUID answerId,
			@RequestParam UUID userId,
			@RequestParam VoteType voteType) {

		RestPreconditions.checkNotNull(answerService.findAnswer(answerId), "Answer", "id", answerId);

		try {
			Answer updatedAnswer = answerService.updateVotes(answerId, userId, voteType);
			return new ResponseEntity<>(updatedAnswer, HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<>(new MessageResponse(e.getMessage()), HttpStatus.BAD_REQUEST);
		}
	}

	@DeleteMapping(value = "{answerId}/votes")
	@ResponseStatus(HttpStatus.OK)
	@Operation(summary = "Remove a user's vote from an answer")
	public ResponseEntity<?> removeVote(
			@PathVariable("answerId") UUID answerId,
			@RequestParam UUID userId) {

		RestPreconditions.checkNotNull(answerService.findAnswer(answerId), "Answer", "id", answerId);

		try {
			Answer updatedAnswer = answerService.removeVote(answerId, userId);
			return new ResponseEntity<>(updatedAnswer, HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<>(new MessageResponse(e.getMessage()), HttpStatus.BAD_REQUEST);
		}
	}
}
