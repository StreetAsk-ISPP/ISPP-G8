package com.streetask.app.answer;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.repository.CrudRepository;

import com.streetask.app.model.AnswerVote;

public interface AnswerVoteRepository extends CrudRepository<AnswerVote, UUID> {

    boolean existsByUserIdAndAnswerId(UUID userId, UUID answerId);

    Optional<AnswerVote> findByUserIdAndAnswerId(UUID userId, UUID answerId);

    List<AnswerVote> findByUserIdAndAnswerQuestionId(UUID userId, UUID questionId);
}
