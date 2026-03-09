/*
 * Copyright 2002-2013 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package com.streetask.app.user;

import java.util.Map;
import java.util.HashMap;
import java.util.UUID;
import java.util.List;

import jakarta.validation.Valid;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import com.streetask.app.exceptions.ResourceNotFoundException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.streetask.app.question.QuestionRepository;
import com.streetask.app.answer.AnswerRepository;
import com.streetask.app.model.Question;

@Service
public class UserService {

	private UserRepository userRepository;
	private final QuestionRepository questionRepository;
	private final AnswerRepository answerRepository;

	@Autowired
	public UserService(UserRepository userRepository,
			QuestionRepository questionRepository,
			AnswerRepository answerRepository) {
		this.userRepository = userRepository;
		this.questionRepository = questionRepository;
		this.answerRepository = answerRepository;
	}

	@Transactional
	public User saveUser(User user) throws DataAccessException {
		userRepository.save(user);
		return user;
	}

	@Transactional(readOnly = true)
	public User findUser(String email) {
		return userRepository.findByEmail(email)
				.orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
	}

	@Transactional(readOnly = true)
	public User findUser(UUID id) {
		return userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
	}

	@Transactional(readOnly = true)
	public User findCurrentUser() {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		if (auth == null)
			throw new ResourceNotFoundException("Nobody authenticated!");
		else
			return userRepository.findByEmail(auth.getName())
					.orElseThrow(() -> new ResourceNotFoundException("User", "Email", auth.getName()));
	}

	public Boolean existsUser(String email) {
		return userRepository.existsByEmail(email);
	}

	public Boolean existsByUserName(String userName) {
		return userRepository.existsByUserName(userName);
	}

	@Transactional(readOnly = true)
	public Iterable<User> findAll() {
		return userRepository.findAll();
	}

	public Iterable<User> findAllByAuthority(String auth) {
		return userRepository.findAllByAuthority(auth);
	}

	@Transactional
	public User updateUser(@Valid User user, UUID idToUpdate) {
		User toUpdate = findUser(idToUpdate);
		BeanUtils.copyProperties(user, toUpdate, "id");
		userRepository.save(toUpdate);

		return toUpdate;
	}

	@Transactional
	public void deleteUser(UUID id) {
		User toDelete = findUser(id);
		this.userRepository.delete(toDelete);
	}

	@Transactional(readOnly = true)
	public Map<String, Object> getUserStats(UUID userId) {
		Map<String, Object> stats = new HashMap<>();
		User user = findUser(userId);

		stats.put("username", user.getUserName());
		stats.put("role", user.getAuthority().getAuthority());
		stats.put("questionsCount", questionRepository.countByUserId(userId));
		stats.put("answersCount", answerRepository.countByUserId(userId));
		stats.put("likesCount", 0);

		return stats;
	}

	@Transactional(readOnly = true)
	public Iterable<com.streetask.app.model.Answer> findAnswersByUserId(UUID userId) {
		return answerRepository.findByUserId(userId);
	}

	@Transactional(readOnly = true)
	public Iterable<com.streetask.app.model.Question> findQuestionsByUserId(UUID userId) {
		return questionRepository.findByUser_Id(userId);
	}

}
