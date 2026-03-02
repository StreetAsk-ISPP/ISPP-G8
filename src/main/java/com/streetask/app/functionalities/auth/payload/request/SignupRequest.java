package com.streetask.app.auth.payload.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SignupRequest {

	@NotBlank
	@Email
	private String email;

	@NotBlank
	private String userName;

	@NotBlank
	private String password;

	// Personal data
	@NotBlank
	private String firstName;

	@NotBlank
	private String lastName;

}
