package com.streetask.app;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication()
@EnableScheduling
public class StreetAskApplication {

	public static void main(String[] args) {
		SpringApplication.run(StreetAskApplication.class, args);
	}

}



