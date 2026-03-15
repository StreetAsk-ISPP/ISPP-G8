package com.streetask.app.answer;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.dao.DataAccessException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.streetask.app.exceptions.ResourceNotFoundException;
import com.streetask.app.functionalities.notifications.events.AnswerCreatedEvent;
import com.streetask.app.model.Answer;
import com.streetask.app.model.AnswerVote;
import com.streetask.app.model.GeoPoint;
import com.streetask.app.model.Question;
import com.streetask.app.model.enums.VoteType;
import com.streetask.app.user.RegularUser;
import com.streetask.app.user.RegularUserRepository;

import jakarta.validation.Valid;

@Service
public class AnswerService {

	private final AnswerRepository answerRepository;
	private final AnswerVoteRepository answerVoteRepository;
	private final RegularUserRepository regularUserRepository;
	private final ApplicationEventPublisher eventPublisher;

	@Autowired
	public AnswerService(AnswerRepository answerRepository, AnswerVoteRepository answerVoteRepository,
			RegularUserRepository regularUserRepository, ApplicationEventPublisher eventPublisher) {
		this.answerRepository = answerRepository;
		this.answerVoteRepository = answerVoteRepository;
		this.regularUserRepository = regularUserRepository;
		this.eventPublisher = eventPublisher;
	}

	@Transactional
	public Answer saveAnswer(@Valid Answer answer, Question question) throws DataAccessException {
		attachAuthenticatedUser(answer);
		// Validate location before saving
		validateAnswerLocation(answer, question);
		applyDefaults(answer);
		answerRepository.save(answer);
		eventPublisher.publishEvent(new AnswerCreatedEvent(answer.getId()));
		return answer;
	}

	@Transactional(readOnly = true)
	public Answer findAnswer(UUID id) {
		return answerRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Answer", "id", id));
	}

	@Transactional(readOnly = true)
	public Iterable<Answer> findAll() {
		return answerRepository.findAll();
	}

	@Transactional(readOnly = true)
	public Iterable<Answer> findByQuestion(UUID questionId) {
		return answerRepository.findByQuestionId(questionId);
	}

	@Transactional(readOnly = true)
	public Iterable<Answer> findByUser(UUID userId) {
		return answerRepository.findByUserId(userId);
	}

	@Transactional(readOnly = true)
	public Iterable<Answer> findByIsVerified(Boolean isVerified) {
		return answerRepository.findByIsVerified(isVerified);
	}

	@Transactional(readOnly = true)
	public Iterable<Answer> findByUserAndIsVerified(UUID userId, Boolean isVerified) {
		return answerRepository.findByUserIdAndIsVerified(userId, isVerified);
	}

	@Transactional(readOnly = true)
	public Iterable<Answer> findByQuestionAndIsVerified(UUID questionId, Boolean isVerified) {
		return answerRepository.findByQuestionIdAndIsVerified(questionId, isVerified);
	}

	@Transactional(readOnly = true)
	public Iterable<Answer> findByQuestionAndUser(UUID questionId, UUID userId) {
		return answerRepository.findByQuestionIdAndUserId(questionId, userId);
	}

	@Transactional(readOnly = true)
	public Iterable<Answer> findByQuestionAndUserAndIsVerified(UUID questionId, UUID userId, Boolean isVerified) {
		return answerRepository.findByQuestionIdAndUserIdAndIsVerified(questionId, userId, isVerified);
	}

	@Transactional
	public Answer updateAnswer(Answer updatedAnswer, UUID answerId, Question question) {
		// 1. Buscamos la respuesta existente en la base de datos
		Answer existingAnswer = findAnswer(answerId);

		// 2. Actualizamos los campos (por ejemplo, el contenido y la ubicación)
		existingAnswer.setContent(updatedAnswer.getContent());
		existingAnswer.setUserLocation(updatedAnswer.getUserLocation());
		validateAnswerLocation(existingAnswer, question);

		// 3. Guardamos y retornamos la respuesta actualizada
		return answerRepository.save(existingAnswer);
	}

	@Transactional
	public Answer updateVotes(UUID answerId, UUID userId, VoteType voteType) {
		Answer answer = findAnswer(answerId);

		Optional<AnswerVote> existingOpt = answerVoteRepository.findByUserIdAndAnswerId(userId, answerId);

		if (existingOpt.isPresent()) {
			AnswerVote existing = existingOpt.get();
			if (existing.getVoteType() == voteType) {
				// Same vote, nothing to do
				return answer;
			}
			// Change vote: swap counters
			if (voteType == VoteType.LIKE) {
				answer.setUpvotes(answer.getUpvotes() + 1);
				answer.setDownvotes(Math.max(0, answer.getDownvotes() - 1));
			} else {
				answer.setDownvotes(answer.getDownvotes() + 1);
				answer.setUpvotes(Math.max(0, answer.getUpvotes() - 1));
			}
			existing.setVoteType(voteType);
			existing.setVotedAt(LocalDateTime.now());
			answerVoteRepository.save(existing);
		} else {
			RegularUser user = regularUserRepository.findById(userId)
					.orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
			AnswerVote vote = new AnswerVote();
			vote.setAnswer(answer);
			vote.setUser(user);
			vote.setVoteType(voteType);
			vote.setVotedAt(LocalDateTime.now());
			answerVoteRepository.save(vote);
			if (voteType == VoteType.LIKE) {
				answer.setUpvotes(answer.getUpvotes() + 1);
			} else {
				answer.setDownvotes(answer.getDownvotes() + 1);
			}
		}

		return answerRepository.save(answer);
	}

	@Transactional
	public Answer removeVote(UUID answerId, UUID userId) {
		Answer answer = findAnswer(answerId);
		AnswerVote existing = answerVoteRepository.findByUserIdAndAnswerId(userId, answerId)
				.orElseThrow(() -> new IllegalArgumentException("No vote found for this user on this answer"));
		if (existing.getVoteType() == VoteType.LIKE) {
			answer.setUpvotes(Math.max(0, answer.getUpvotes() - 1));
		} else {
			answer.setDownvotes(Math.max(0, answer.getDownvotes() - 1));
		}
		answerVoteRepository.delete(existing);
		return answerRepository.save(answer);
	}

	@Transactional(readOnly = true)
	public Map<UUID, String> getUserVotesForQuestion(UUID userId, UUID questionId) {
		List<AnswerVote> votes = answerVoteRepository.findByUserIdAndAnswerQuestionId(userId, questionId);
		return votes.stream().collect(Collectors.toMap(
				v -> v.getAnswer().getId(),
				v -> v.getVoteType().name()));
	}

	@Transactional
	public void deleteAnswer(UUID id) {
		Answer toDelete = findAnswer(id);
		answerRepository.delete(toDelete);
	}

	/**
	 * Validates that the answer is posted from a location within the question's
	 * radius.
	 * Only validates if the question has a location and a radius > 0.
	 * 
	 * @param answer   The answer to validate
	 * @param question The question the answer is replying to
	 * @throws IllegalArgumentException if the user location is not within the
	 *                                  allowed radius
	 */
	private void validateAnswerLocation(Answer answer, Question question) {
		// Only validate location if question has a location and a positive radius
		if (question.getLocation() == null || question.getRadiusKm() == null || question.getRadiusKm() <= 0) {
			// No location validation required
			return;
		}

		// Location validation is required for this question
		if (answer.getUserLocation() == null) {
			throw new IllegalArgumentException("User location must not be null for questions with location radius");
		}

		double distance = calculateDistance(answer.getUserLocation(), question.getLocation());
		double allowedRadius = question.getRadiusKm();

		if (distance > allowedRadius) {
			throw new IllegalArgumentException(
					String.format("User is not within the allowed radius. Distance: %.2f km, Allowed radius: %.2f km",
							distance, allowedRadius));
		}
	}

	/**
	 * Calculates the distance between two GeoPoints using the Haversine formula.
	 * Returns the distance in kilometers.
	 * 
	 * @param point1 First location
	 * @param point2 Second location
	 * @return Distance in kilometers
	 */
	private double calculateDistance(GeoPoint point1, GeoPoint point2) {
		final int EARTH_RADIUS_KM = 6371;

		double lat1 = Math.toRadians(point1.getLatitude());
		double lon1 = Math.toRadians(point1.getLongitude());
		double lat2 = Math.toRadians(point2.getLatitude());
		double lon2 = Math.toRadians(point2.getLongitude());

		double dlat = lat2 - lat1;
		double dlon = lon2 - lon1;

		double a = Math.sin(dlat / 2) * Math.sin(dlat / 2)
				+ Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlon / 2) * Math.sin(dlon / 2);
		double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

		return EARTH_RADIUS_KM * c;
	}

	private void applyDefaults(Answer answer) {
		if (answer.getCreatedAt() == null) {
			answer.setCreatedAt(OffsetDateTime.now(ZoneOffset.UTC));
		}
		if (answer.getIsVerified() == null) {
			answer.setIsVerified(false);
		}
		if (answer.getUpvotes() == null) {
			answer.setUpvotes(0);
		}
		if (answer.getDownvotes() == null) {
			answer.setDownvotes(0);
		}
	}

	private void attachAuthenticatedUser(Answer answer) {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		if (auth == null || auth.getName() == null || auth.getName().isBlank()) {
			if (answer.getUser() != null) {
				return;
			}
			throw new AccessDeniedException("Only authenticated regular users can create answers");
		}

		String identifier = auth.getName().trim();
		RegularUser regularUser = regularUserRepository.findByEmail(identifier)
				.or(() -> regularUserRepository.findByUserNameIgnoreCase(identifier))
				.orElseThrow(() -> new AccessDeniedException("Only regular users can create answers"));

		answer.setUser(regularUser);
	}

}
