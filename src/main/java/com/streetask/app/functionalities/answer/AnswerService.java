package com.streetask.app.answer;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.streetask.app.exceptions.ResourceNotFoundException;
import com.streetask.app.model.Answer;
import com.streetask.app.model.GeoPoint;
import com.streetask.app.model.Question;

import jakarta.validation.Valid;

@Service
public class AnswerService {

	private final AnswerRepository answerRepository;

	@Autowired
	public AnswerService(AnswerRepository answerRepository) {
		this.answerRepository = answerRepository;
	}

	@Transactional
	public Answer saveAnswer(@Valid Answer answer, Question question) throws DataAccessException {
		// Validate location before saving
		validateAnswerLocation(answer, question);
		applyDefaults(answer);
		answerRepository.save(answer);
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
	public Answer updateAnswer(@Valid Answer answer, UUID idToUpdate, Question question) {
		Answer toUpdate = findAnswer(idToUpdate);
		// Validate location before updating
		validateAnswerLocation(answer, question);
		BeanUtils.copyProperties(answer, toUpdate, "id", "createdAt", "question");
		applyDefaults(toUpdate);
		answerRepository.save(toUpdate);
		return toUpdate;
	}

	@Transactional
	public void deleteAnswer(UUID id) {
		Answer toDelete = findAnswer(id);
		answerRepository.delete(toDelete);
	}

	/**
	 * Validates that the answer is posted from a location within the question's radius.
	 * 
	 * @param answer The answer to validate
	 * @param question The question the answer is replying to
	 * @throws IllegalArgumentException if the user location is not within the allowed radius
	 */
	private void validateAnswerLocation(Answer answer, Question question) {
		if (answer.getUserLocation() == null || question.getLocation() == null) {
			throw new IllegalArgumentException("User location and question location must not be null");
		}

		double distance = calculateDistance(answer.getUserLocation(), question.getLocation());
		double allowedRadius = question.getRadiusKm() != null ? question.getRadiusKm() : 0;

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
			answer.setCreatedAt(LocalDateTime.now());
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

}
