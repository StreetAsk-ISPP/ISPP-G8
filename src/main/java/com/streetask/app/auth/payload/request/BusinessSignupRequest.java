package com.streetask.app.auth.payload.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BusinessSignupRequest {

    @NotBlank
    @Email
    private String email;

    @NotBlank
    @Pattern(regexp = "^[A-Za-z]\\d{7}[A-Za-z0-9]$", message = "Tax ID must follow format: 1 letter + 7 digits + 1 control character.")
    private String taxId;

    @NotBlank
    private String companyName;

    private String address;

    private String website;

    private String description;

}
