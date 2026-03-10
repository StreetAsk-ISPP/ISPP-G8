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

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.StreamSupport;

import jakarta.validation.Valid;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import com.streetask.app.answer.AnswerRepository;
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
	private AnswerRepository answerRepository;
	private static final int LIKE_WEIGHT = 2;
	private static final int DISLIKE_WEIGHT = 1;

	@Autowired
	public UserService(UserRepository userRepository, AnswerRepository answerRepository) {
		this.userRepository = userRepository;
		this.answerRepository = answerRepository;
	}

	@Transactional
	public User saveUser(User user) throws DataAccessException {
		userRepository.save(user);
		return enrichReputation(user);
	}

	@Transactional(readOnly = true)
	public User findUser(String email) {
		User user = userRepository.findByEmail(email)
				.orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
		return enrichReputation(user);
	}

	@Transactional(readOnly = true)
	public User findUser(UUID id) {
		User user = userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
		return enrichReputation(user);
	}

	@Transactional(readOnly = true)
	public User findCurrentUser() {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		if (auth == null)
			throw new ResourceNotFoundException("Nobody authenticated!");
		else {
			User user = userRepository.findByEmail(auth.getName())
					.orElseThrow(() -> new ResourceNotFoundException("User", "Email", auth.getName()));
			return enrichReputation(user);
		}
	}

	public Boolean existsUser(String email) {
		return userRepository.existsByEmail(email);
	}

	public Boolean existsByUserName(String userName) {
		return userRepository.existsByUserName(userName);
	}

	@Transactional(readOnly = true)
	public Iterable<User> findAll() {
		return enrichReputation(userRepository.findAll());
	}

	public Iterable<User> findAllByAuthority(String auth) {
		return enrichReputation(userRepository.findAllByAuthority(auth));
	}

	@Transactional
	public User updateUser(@Valid User user, UUID idToUpdate) {
		User toUpdate = findUser(idToUpdate);
		BeanUtils.copyProperties(user, toUpdate, "id");
		userRepository.save(toUpdate);

		return enrichReputation(toUpdate);
	}

	@Transactional
	public void deleteUser(UUID id) {
		User toDelete = findUser(id);
		this.userRepository.delete(toDelete);
	}

	private User enrichReputation(User user) {
		Map<UUID, Integer> reputationByUserId = calculateReputationByUserIds(List.of(user.getId()));
		user.setReputation(reputationByUserId.getOrDefault(user.getId(), 0));
		return user;
	}

	private Iterable<User> enrichReputation(Iterable<User> users) {
		List<User> userList = StreamSupport.stream(users.spliterator(), false).toList();
		if (userList.isEmpty()) {
			return userList;
		}

		List<UUID> userIds = new ArrayList<>(userList.size());
		for (User user : userList) {
			userIds.add(user.getId());
		}

		Map<UUID, Integer> reputationByUserId = calculateReputationByUserIds(userIds);

		for (User user : userList) {
			user.setReputation(reputationByUserId.getOrDefault(user.getId(), 0));
		}

		return userList;
	}

	private Map<UUID, Integer> calculateReputationByUserIds(List<UUID> userIds) {
		Map<UUID, Integer> reputationByUserId = new HashMap<>();
		List<Object[]> aggregates = answerRepository.aggregateVotesByUserIds(userIds);
		for (Object[] row : aggregates) {
			UUID userId = (UUID) row[0];
			int likes = ((Number) row[1]).intValue();
			int dislikes = ((Number) row[2]).intValue();
			int reputation = (likes * LIKE_WEIGHT) - (dislikes * DISLIKE_WEIGHT);
			reputationByUserId.put(userId, reputation);
		}
		return reputationByUserId;
	}

}
