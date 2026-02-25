package com.streetask.app.auth;

import java.time.LocalDateTime;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import com.streetask.app.auth.payload.request.BusinessSignupRequest;
import com.streetask.app.auth.payload.request.CompleteSignupRequest;
import com.streetask.app.auth.payload.request.SignupRequest;
import com.streetask.app.user.Authorities;
import com.streetask.app.user.AuthoritiesService;
import com.streetask.app.user.AccountType;
import com.streetask.app.user.BusinessAccount;
import com.streetask.app.user.BusinessAccountRepository;
import com.streetask.app.user.RequestStatus;
import com.streetask.app.user.User;
import com.streetask.app.user.UserService;
import com.streetask.app.user.RegularUser;
import com.streetask.app.user.RegularUserRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

	@PersistenceContext
	private EntityManager entityManager;

	private final PasswordEncoder encoder;
	private final AuthoritiesService authoritiesService;
	private final UserService userService;
	private final RegularUserRepository regularUserRepository;
	private final BusinessAccountRepository businessAccountRepository;

	@Autowired
	public AuthService(PasswordEncoder encoder, AuthoritiesService authoritiesService, UserService userService,
			RegularUserRepository regularUserRepository, BusinessAccountRepository businessAccountRepository) {
		this.encoder = encoder;
		this.authoritiesService = authoritiesService;
		this.userService = userService;
		this.regularUserRepository = regularUserRepository;
		this.businessAccountRepository = businessAccountRepository;
	}

	@Transactional
	public void createRegularUser(@Valid CompleteSignupRequest request) {
		// Find the basic user created in the first step
		User basicUser = userService.findUser(request.getEmail());

		RegularUser user = new RegularUser();

		// Copy base User fields
		user.setEmail(basicUser.getEmail());
		user.setUserName(basicUser.getUserName());
		user.setPassword(basicUser.getPassword());
		user.setFirstName(basicUser.getFirstName());
		user.setLastName(basicUser.getLastName());
		user.setAccountType(AccountType.REGULAR_USER);
		user.setActive(true);
		user.setCreatedAt(basicUser.getCreatedAt());

		// Regular user defaults
		user.setCoinBalance(0);
		user.setRating(0.0f);
		user.setVerified(false);

		// Assign USER authority
		Authorities role = authoritiesService.findByAuthority("USER");
		user.setAuthority(role);

		// Delete basic user and flush to force DELETE
		userService.deleteUser(basicUser.getId());
		entityManager.flush();

		regularUserRepository.save(user);
	}

	@Transactional
	public User createBasicUser(@Valid SignupRequest request) {
		// Create temporary basic user; then convert to RegularUser or BusinessAccount
		User user = new User();
		user.setEmail(request.getEmail());
		user.setUserName(request.getUserName());
		user.setPassword(encoder.encode(request.getPassword()));
		user.setFirstName(request.getFirstName());
		user.setLastName(request.getLastName());
		user.setActive(false);
		user.setCreatedAt(LocalDateTime.now());

		// Assign temporary USER authority
		Authorities role = authoritiesService.findByAuthority("USER");
		user.setAuthority(role);

		return userService.saveUser(user);
	}

	@Transactional
	public void convertToBusinessUser(@Valid BusinessSignupRequest request) {
		// Find the basic user created in the first step
		User basicUser = userService.findUser(request.getEmail());

		BusinessAccount businessAccount = new BusinessAccount();

		businessAccount.setEmail(basicUser.getEmail());
		businessAccount.setUserName(basicUser.getUserName());
		businessAccount.setPassword(basicUser.getPassword());
		businessAccount.setFirstName(basicUser.getFirstName());
		businessAccount.setLastName(basicUser.getLastName());
		businessAccount.setAccountType(AccountType.BUSINESS);
		businessAccount.setActive(false);
		businessAccount.setCreatedAt(basicUser.getCreatedAt());

		businessAccount.setTaxId(request.getTaxId());
		businessAccount.setAddress(request.getAddress());

		businessAccount.setVerified(false);
		businessAccount.setRating(0.0f);
		businessAccount.setRequestStatus(RequestStatus.PENDING);
		businessAccount.setSubscriptionActive(false);

		// Assign BUSINESS authority
		Authorities role = authoritiesService.findByAuthority("BUSINESS");
		businessAccount.setAuthority(role);

		// Delete basic user and flush to force DELETE
		userService.deleteUser(basicUser.getId());
		entityManager.flush();

		businessAccountRepository.save(businessAccount);
	}

}
