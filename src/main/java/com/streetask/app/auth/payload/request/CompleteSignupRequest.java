package com.streetask.app.auth.payload.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CompleteSignupRequest {

    @NotBlank
    @Email
    private String email;

}
