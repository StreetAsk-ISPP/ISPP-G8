package com.streetask.app.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import lombok.Getter;

@ResponseStatus(value = HttpStatus.BAD_REQUEST)
@Getter
public class UpperPlanFeatureException extends RuntimeException {

	private static final long serialVersionUID = -3906338266891937036L;

	public UpperPlanFeatureException(String message) {
		super(message);
	}

}



