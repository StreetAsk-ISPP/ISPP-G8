package com.streetask.app.question;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.streetask.app.exceptions.ResourceNotFoundException;
import com.streetask.app.model.Question;
import com.streetask.app.user.RegularUser;
import com.streetask.app.user.RegularUserRepository;

import jakarta.validation.Valid;

@Service
public class QuestionService {

	private final QuestionRepository questionRepository;
	private final RegularUserRepository regularUserRepository;

	@Autowired
	public QuestionService(QuestionRepository questionRepository, RegularUserRepository regularUserRepository) {
		this.questionRepository = questionRepository;
		this.regularUserRepository = regularUserRepository;
	}

	@Transactional
	public Question saveQuestion(@Valid Question question) throws DataAccessException {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    	String email = auth.getName();
    	RegularUser ru = regularUserRepository.findByEmail(email)
        	.orElseThrow(() -> new AccessDeniedException("Only regular users can create questions"));
    	question.setCreator(ru);
		applyDefaults(question);
		questionRepository.save(question);
		return question;
	}

	@Transactional(readOnly = true)
	public Question findQuestion(UUID id) {
		return questionRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Question", "id", id));
	}

	@Transactional(readOnly = true)
	public Iterable<Question> findAll() {
		return questionRepository.findAll();
	}

	@Transactional(readOnly = true)
	public Iterable<Question> findByCreator(UUID creatorId) {
		return questionRepository.findByCreatorId(creatorId);
	}

	@Transactional(readOnly = true)
	public Iterable<Question> findByEvent(UUID eventId) {
		return questionRepository.findByEventId(eventId);
	}

	@Transactional(readOnly = true)
	public Iterable<Question> findByActive(Boolean active) {
		return questionRepository.findByActive(active);
	}

	@Transactional(readOnly = true)
	public Iterable<Question> findByCreatorAndActive(UUID creatorId, Boolean active) {
		return questionRepository.findByCreatorIdAndActive(creatorId, active);
	}

	@Transactional(readOnly = true)
	public Iterable<Question> findByEventAndActive(UUID eventId, Boolean active) {
		return questionRepository.findByEventIdAndActive(eventId, active);
	}

	@Transactional(readOnly = true)
	public Iterable<Question> findByCreatorAndEvent(UUID creatorId, UUID eventId) {
		return questionRepository.findByCreatorIdAndEventId(creatorId, eventId);
	}

	@Transactional(readOnly = true)
	public Iterable<Question> findByCreatorAndEventAndActive(UUID creatorId, UUID eventId, Boolean active) {
		return questionRepository.findByCreatorIdAndEventIdAndActive(creatorId, eventId, active);
	}

	@Transactional
	public Question updateQuestion(@Valid Question question, UUID idToUpdate) {
		Question toUpdate = findQuestion(idToUpdate);
		BeanUtils.copyProperties(question, toUpdate, "id", "createdAt", "answerCount");
		applyDefaults(toUpdate);
		questionRepository.save(toUpdate);
		return toUpdate;
	}

	@Transactional
	public void deleteQuestion(UUID id) {
		Question toDelete = findQuestion(id);
		questionRepository.delete(toDelete);
	}

	@Transactional
    @Scheduled(cron = "0 * * * * *") 
    public void executeExpirationCron() {
        LocalDateTime now = LocalDateTime.now();
        Iterable<Question> expiredQuestions = questionRepository.findAllByActiveTrueAndExpiresAtBefore(now);
        
        if (expiredQuestions.iterator().hasNext()) {
			expiredQuestions.forEach(question -> {
				question.setActive(false);
			});
			questionRepository.saveAll(expiredQuestions);
		}
    }

	private void applyDefaults(Question question) {
		if (question.getCreatedAt() == null) {
			question.setCreatedAt(LocalDateTime.now());
		}
		if (question.getActive() == null) {
			question.setActive(true);
		}
		if (question.getAnswerCount() == null) {
			question.setAnswerCount(0);
		}
		if (question.getExpiresAt() == null) {
			question.setExpiresAt(question.getCreatedAt().plusHours(2));
		}
		// Para próximo sprint cuando pongamos planes de usuario regular, añadir: 
		// if (question.getCreator().getPlan() == PREMIUM) {...}
	}
}
