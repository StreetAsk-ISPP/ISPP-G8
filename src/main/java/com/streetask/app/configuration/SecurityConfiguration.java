@Bean
protected SecurityFilterChain configure(HttpSecurity http) throws Exception {

    http
        .cors(withDefaults())
        .csrf(AbstractHttpConfigurer::disable)
        .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .headers(headers -> headers.frameOptions(frameOptions -> frameOptions.disable()))
        .exceptionHandling(ex -> ex.authenticationEntryPoint(unauthorizedHandler))

        .authorizeHttpRequests(auth -> auth

            // Static resources
            .requestMatchers(PathRequest.toStaticResources().atCommonLocations()).permitAll()

            // H2 Console
            .requestMatchers(PathRequest.toH2Console()).permitAll()
            .requestMatchers("/h2-console/**").permitAll()

            // Public root pages
            .requestMatchers("/", "/oups").permitAll()

            // Swagger / OpenAPI
            .requestMatchers(
                "/v3/api-docs/**",
                "/swagger-ui.html",
                "/swagger-ui/**",
                "/swagger-resources/**"
            ).permitAll()

            // Public API
            .requestMatchers("/api/v1/auth/**").permitAll()
            .requestMatchers("/api/v1/developers").permitAll()
            .requestMatchers("/api/v1/clinics").permitAll()
            .requestMatchers("/api/v1/locations/public/**").permitAll()
            .requestMatchers(HttpMethod.GET, "/api/v1/locations/user/**").permitAll()

            // OWNER
            .requestMatchers("/api/v1/plan").hasAuthority("OWNER")

            // ADMIN
            .requestMatchers("/api/v1/users/**").hasAuthority(ADMIN)
            .requestMatchers("/api/v1/clinicOwners/all").hasAuthority(ADMIN)
            .requestMatchers(HttpMethod.DELETE, "/api/v1/consultations/**").hasAuthority(ADMIN)
            .requestMatchers("/api/v1/owners/**").hasAuthority(ADMIN)
            .requestMatchers("/api/v1/pets/stats").hasAuthority(ADMIN)
            .requestMatchers("/api/v1/vets/stats").hasAuthority(ADMIN)

            // Other role rules
            .requestMatchers("/api/v1/clinicOwners/**").hasAnyAuthority(ADMIN, CLINIC_OWNER)
            .requestMatchers("/api/v1/visits/**").authenticated()
            .requestMatchers("/api/v1/pets").authenticated()
            .requestMatchers("/api/v1/pets/**").authenticated()
            .requestMatchers("/api/v1/consultations/**").authenticated()
            .requestMatchers("/api/v1/clinics/**").hasAnyAuthority(CLINIC_OWNER, ADMIN)
            .requestMatchers(HttpMethod.GET, "/api/v1/vets/**").authenticated()
            .requestMatchers("/api/v1/vets/**").hasAnyAuthority(ADMIN, "VET", CLINIC_OWNER)

            // 🔥 StreetAsk Questions (control fino por método)
            .requestMatchers(HttpMethod.POST,   "/api/v1/questions/**").hasAnyAuthority("USER", "ADMIN")
            .requestMatchers(HttpMethod.PUT,    "/api/v1/questions/**").hasAnyAuthority("USER", "ADMIN")
            .requestMatchers(HttpMethod.DELETE, "/api/v1/questions/**").hasAnyAuthority("USER", "ADMIN")
            .requestMatchers(HttpMethod.GET,    "/api/v1/questions/**").authenticated()

            // Answers
            .requestMatchers("/api/v1/answers/**").authenticated()

            // Everything else denied
            .anyRequest().denyAll()
        )

        .addFilterBefore(authenticationJwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);

    return http.build();
}