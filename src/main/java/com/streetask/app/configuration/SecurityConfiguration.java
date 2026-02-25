package com.streetask.app.configuration;

import static org.springframework.security.config.Customizer.withDefaults;
/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import javax.sql.DataSource;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import com.streetask.app.configuration.jwt.AuthEntryPointJwt;
import com.streetask.app.configuration.jwt.AuthTokenFilter;
import com.streetask.app.configuration.services.UserDetailsServiceImpl;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.boot.autoconfigure.security.servlet.PathRequest;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration {

	@Autowired
	UserDetailsServiceImpl userDetailsService;

	@Autowired
	private AuthEntryPointJwt unauthorizedHandler;

	@Autowired
	DataSource dataSource;

	private static final String ADMIN = "ADMIN";
	private static final String CLINIC_OWNER = "CLINIC_OWNER";

	@Bean
	protected SecurityFilterChain configure(HttpSecurity http) throws Exception {

		http
				.cors(withDefaults())
				.csrf(AbstractHttpConfigurer::disable)
				.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.headers((headers) -> headers.frameOptions((frameOptions) -> frameOptions.disable()))
				.exceptionHandling((exepciontHandling) -> exepciontHandling.authenticationEntryPoint(
						unauthorizedHandler))

				.authorizeHttpRequests(auth -> auth
						// Public common static resources (css, js, images, webjars...)
						.requestMatchers(PathRequest.toStaticResources().atCommonLocations()).permitAll()
						// Accessible H2 Console
						.requestMatchers(PathRequest.toH2Console()).permitAll()
						.requestMatchers("/h2-console/**").permitAll()

						// Root / public pages
						.requestMatchers("/", "/oups").permitAll()

						// Accessible Swagger / OpenAPI
						.requestMatchers(
								"/v3/api-docs/**",
								"/swagger-ui.html",
								"/swagger-ui/**",
								"/swagger-resources/**")
						.permitAll()

						// Public API
						.requestMatchers("/api/v1/auth/**").permitAll()
						.requestMatchers("/api/v1/developers").permitAll()
						.requestMatchers("/api/v1/plan").permitAll()
						.requestMatchers("/api/v1/clinics").permitAll()
						.requestMatchers("/api/v1/developers").permitAll()

						// Restricted API for pet owners:
						.requestMatchers("/api/v1/plan").hasAuthority("OWNER")

						// Restricted API for administrators
						.requestMatchers("/api/v1/users/**").hasAuthority(ADMIN)
						.requestMatchers("/api/v1/clinicOwners/all").hasAuthority(ADMIN)
						.requestMatchers(HttpMethod.DELETE, "/api/v1/consultations/**").hasAuthority(ADMIN)
						.requestMatchers("/api/v1/owners/**").hasAuthority(ADMIN)
						.requestMatchers("/api/v1/pets/stats").hasAuthority(ADMIN)
						.requestMatchers("/api/v1/vets/stats").hasAuthority(ADMIN)

						// Other access-control rules:
						.requestMatchers("/api/v1/clinicOwners/**").hasAnyAuthority(ADMIN, CLINIC_OWNER)
						.requestMatchers("/api/v1/visits/**").authenticated()
						.requestMatchers("/api/v1/pets").authenticated()
						.requestMatchers("/api/v1/pets/**").authenticated()
						.requestMatchers("/api/v1/consultations/**").authenticated()
						.requestMatchers("/api/v1/clinics/**").hasAnyAuthority(CLINIC_OWNER, ADMIN)
						.requestMatchers(HttpMethod.GET, "/api/v1/vets/**").authenticated()
						.requestMatchers("/api/v1/vets/**").hasAnyAuthority(ADMIN, "VET", CLINIC_OWNER)

						// Deny everything else
						.anyRequest().denyAll())

				.addFilterBefore(authenticationJwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);
		return http.build();
	}

	@Bean
	public AuthTokenFilter authenticationJwtTokenFilter() {
		return new AuthTokenFilter();
	}

	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
		return config.getAuthenticationManager();
	}

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	public CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration configuration = new CorsConfiguration();
		configuration
				.setAllowedOrigins(List.of("http://localhost:8080", "http://localhost:8081", "http://localhost:19006"));
		configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
		configuration.setAllowedHeaders(List.of("*"));
		configuration.setAllowCredentials(true);
		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", configuration);
		return source;
	}

}
