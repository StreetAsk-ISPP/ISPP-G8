package com.streetask.app.auth;

import java.util.List;
import java.util.stream.Collectors;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import com.streetask.app.auth.payload.request.BusinessSignupRequest;
import com.streetask.app.auth.payload.request.CompleteSignupRequest;
import com.streetask.app.auth.payload.request.LoginRequest;
import com.streetask.app.auth.payload.request.SignupRequest;
import com.streetask.app.auth.payload.response.JwtResponse;
import com.streetask.app.auth.payload.response.MessageResponse;
import com.streetask.app.configuration.jwt.JwtUtils;
import com.streetask.app.configuration.services.UserDetailsImpl;
import com.streetask.app.user.BusinessAccountRepository;
import com.streetask.app.user.UserService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.security.authentication.BadCredentialsException;

@RestController
@RequestMapping("/api/v1/auth")
@Tag(name = "Authentication", description = "The Authentication API based on JWT")
public class AuthController {

	private final AuthenticationManager authenticationManager;
	private final UserService userService;
	private final JwtUtils jwtUtils;
	private final AuthService authService;
	private final BusinessAccountRepository businessAccountRepository;

	@Autowired
	public AuthController(AuthenticationManager authenticationManager, UserService userService, JwtUtils jwtUtils,
			AuthService authService, BusinessAccountRepository businessAccountRepository) {
		this.userService = userService;
		this.jwtUtils = jwtUtils;
		this.authenticationManager = authenticationManager;
		this.authService = authService;
		this.businessAccountRepository = businessAccountRepository;
	}

	@PostMapping("/signin")
	public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
		try {
			Authentication authentication = authenticationManager.authenticate(
					new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

			SecurityContextHolder.getContext().setAuthentication(authentication);
			String jwt = jwtUtils.generateJwtToken(authentication);

			UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
			List<String> roles = userDetails.getAuthorities().stream().map(item -> item.getAuthority())
					.collect(Collectors.toList());

			return ResponseEntity.ok()
					.body(new JwtResponse(jwt, userDetails.getId(), userDetails.getUsername(), roles));
		} catch (BadCredentialsException exception) {
			return ResponseEntity.badRequest().body("Bad Credentials!");
		}
	}

	@GetMapping("/validate")
	public ResponseEntity<Boolean> validateToken(@RequestParam String token) {
		Boolean isValid = jwtUtils.validateJwtToken(token);
		return ResponseEntity.ok(isValid);
	}

	@PostMapping("/signup/basic")
	public ResponseEntity<MessageResponse> registerBasicUser(@Valid @RequestBody SignupRequest signUpRequest) {
		// Check whether email already exists
		if (userService.existsUser(signUpRequest.getEmail()).equals(true)) {
			return ResponseEntity.badRequest().body(new MessageResponse("Error: Email is already registered!"));
		}
		// Check whether username already exists
		if (userService.existsByUserName(signUpRequest.getUserName()).equals(true)) {
			return ResponseEntity.badRequest().body(new MessageResponse("Error: Username is already taken!"));
		}
		authService.createBasicUser(signUpRequest);
		return ResponseEntity.ok(new MessageResponse("Basic user data saved! Complete your registration."));
	}

	@PostMapping("/signup/regular")
	public ResponseEntity<MessageResponse> completeRegularUser(
			@Valid @RequestBody CompleteSignupRequest signUpRequest) {
		// Check whether the basic user exists
		try {
			authService.createRegularUser(signUpRequest);
			return ResponseEntity.ok(new MessageResponse("Regular user registered successfully!"));
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(new MessageResponse("Error: User not found or already completed!"));
		}
	}

	@PostMapping("/signup/business")
	public ResponseEntity<MessageResponse> completeBusinessUser(
			@Valid @RequestBody BusinessSignupRequest signUpRequest) {
		String normalizedTaxId = signUpRequest.getTaxId().trim().toUpperCase().replace(" ", "").replace("-", "");
		signUpRequest.setTaxId(normalizedTaxId);

		// Check whether tax ID already exists
		if (businessAccountRepository.existsByTaxId(signUpRequest.getTaxId()).equals(true)) {
			return ResponseEntity.badRequest().body(new MessageResponse("Error: Tax ID is already registered!"));
		}
		// Complete business account data
		try {
			authService.convertToBusinessUser(signUpRequest);
			return ResponseEntity.ok(new MessageResponse(
					"Business account registered successfully! Your account is pending admin verification."));
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(new MessageResponse("Error: User not found or already completed!"));
		}
	}

}
