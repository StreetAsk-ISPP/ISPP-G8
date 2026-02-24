package com.streetask.app.auth.payload.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SignupRequest {

	// Email (username en la BD para autenticación)
	@NotBlank
	@Email
	private String email;

	@NotBlank
	private String userName;

	@NotBlank
	private String password;

	// Datos personales
	@NotBlank
	private String firstName;

	@NotBlank
	private String lastName;

}
