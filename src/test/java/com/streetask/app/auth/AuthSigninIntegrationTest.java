package com.streetask.app.auth;

import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.JsonNode;
import java.util.Map;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.transaction.Transactional;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class AuthSigninIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void signinShouldReturnJwtWhenCredentialsAreValid() throws Exception {
        Map<String, Object> payload = Map.of(
                "email", "admin1@streetask.com",
                "password", "4dm1n");

        mockMvc.perform(post("/api/v1/auth/signin")
                        .contentType(APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.type").value("Bearer"))
                .andExpect(jsonPath("$.username").value("admin1@streetask.com"))
                .andExpect(jsonPath("$.roles[0]").value("ADMIN"));
    }

    @Test
    void signinShouldReturnJwtWhenUsernameAndCredentialsAreValid() throws Exception {
        Map<String, Object> payload = Map.of(
                "email", "admin1",
                "password", "4dm1n");

        mockMvc.perform(post("/api/v1/auth/signin")
                        .contentType(APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.type").value("Bearer"))
                .andExpect(jsonPath("$.username").value("admin1@streetask.com"))
                .andExpect(jsonPath("$.roles[0]").value("ADMIN"));
    }

    @Test
    void signinShouldReturnUnauthorizedWhenCredentialsAreInvalid() throws Exception {
        Map<String, Object> payload = Map.of(
                "email", "admin1@streetask.com",
                "password", "wrong-password");

        mockMvc.perform(post("/api/v1/auth/signin")
                        .contentType(APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Error: Invalid email or password."));
    }

    @Test
    void signinShouldReturnJwtWhenEmailHasSpacesAndUppercase() throws Exception {
        Map<String, Object> payload = Map.of(
                "email", "  ADMIN1@STREETASK.COM  ",
                "password", "4dm1n");

        mockMvc.perform(post("/api/v1/auth/signin")
                        .contentType(APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.username").value("admin1@streetask.com"));
    }

    @Test
    void signinShouldReturnBadRequestWhenIdentifierIsBlank() throws Exception {
        Map<String, Object> payload = Map.of(
                "email", "  ",
                "password", "123456");

        mockMvc.perform(post("/api/v1/auth/signin")
                        .contentType(APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("{email=must not be blank}"));
    }

    @Test
    void signinShouldReturnBadRequestWhenPasswordIsBlank() throws Exception {
        Map<String, Object> payload = Map.of(
                "email", "admin1",
                "password", " ");

        mockMvc.perform(post("/api/v1/auth/signin")
                        .contentType(APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("{password=must not be blank}"));
    }

    @Test
    void validateShouldReturnTrueForValidToken() throws Exception {
        String token = signinAndExtractToken("admin1", "4dm1n");

        mockMvc.perform(get("/api/v1/auth/validate").param("token", token))
                .andExpect(status().isOk())
                .andExpect(content().string("true"));
    }

    @Test
    void validateShouldReturnFalseForInvalidToken() throws Exception {
        mockMvc.perform(get("/api/v1/auth/validate").param("token", "invalid.token.value"))
                .andExpect(status().isOk())
                .andExpect(content().string("false"));
    }

    private String signinAndExtractToken(String identifier, String password) throws Exception {
        Map<String, Object> payload = Map.of(
                "email", identifier,
                "password", password);

        MvcResult result = mockMvc.perform(post("/api/v1/auth/signin")
                        .contentType(APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isOk())
                .andReturn();

        JsonNode body = objectMapper.readTree(result.getResponse().getContentAsString());
        return body.get("token").asText();
    }
}
