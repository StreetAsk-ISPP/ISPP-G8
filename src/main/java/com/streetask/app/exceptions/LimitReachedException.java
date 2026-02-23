package com.streetask.app.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import lombok.Getter;

@ResponseStatus(value = HttpStatus.NOT_FOUND)
@Getter
public class LimitReachedException extends RuntimeException {

	private static final long serialVersionUID = -3906338266891937036L;

	public LimitReachedException(String resourceName) {
		super(String.format(
				"You have reached the limit for %s. Please contact support.",
				resourceName));
	}

}



