package com.streetask.app.answer;

import java.util.UUID;

import org.springframework.data.repository.CrudRepository;

import com.streetask.app.model.Answer;

public interface AnswerRepository extends CrudRepository<Answer, UUID> {

	Iterable<Answer> findByQuestionId(UUID questionId);

	Iterable<Answer> findByUserId(UUID userId);

	Iterable<Answer> findByIsVerified(Boolean isVerified);

	Iterable<Answer> findByUserIdAndIsVerified(UUID userId, Boolean isVerified);

	Iterable<Answer> findByQuestionIdAndIsVerified(UUID questionId, Boolean isVerified);

	Iterable<Answer> findByQuestionIdAndUserId(UUID questionId, UUID userId);

	Iterable<Answer> findByQuestionIdAndUserIdAndIsVerified(UUID questionId, UUID userId, Boolean isVerified);

}
