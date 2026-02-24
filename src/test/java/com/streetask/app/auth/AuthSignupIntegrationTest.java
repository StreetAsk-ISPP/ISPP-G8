package com.streetask.app.auth;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.HashMap;
import java.util.Map;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.streetask.app.user.CuentaEmpresa;
import com.streetask.app.user.User;
import com.streetask.app.user.UserRepository;
import com.streetask.app.user.UsuarioAPie;

import jakarta.transaction.Transactional;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class AuthSignupIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Test
    void signupBasicShouldCreateUserWhenPayloadIsValid() throws Exception {
        String email = "normal.success@streetask.com";

        mockMvc.perform(post("/api/v1/auth/signup/basic")
                .contentType(APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validBasicPayload(email, "normalUser1"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Basic user data saved! Complete your registration."));

        assertThat(userRepository.findByEmail(email)).isPresent();
    }

    @Test
    void signupBasicShouldReturnBadRequestWhenEmailAlreadyExists() throws Exception {
        String email = "duplicated.email@streetask.com";

        mockMvc.perform(post("/api/v1/auth/signup/basic")
                .contentType(APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validBasicPayload(email, "dupUser1"))))
                .andExpect(status().isOk());

        mockMvc.perform(post("/api/v1/auth/signup/basic")
                .contentType(APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validBasicPayload(email, "dupUser2"))))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Error: Email is already registered!"));
    }

    @Test
    void signupBasicShouldReturnBadRequestWhenRequiredFieldIsMissing() throws Exception {
        Map<String, Object> invalidPayload = new HashMap<>();
        invalidPayload.put("email", "invalid.payload@streetask.com");
        invalidPayload.put("password", "123456");
        invalidPayload.put("firstName", "Invalid");
        invalidPayload.put("lastName", "Payload");

        mockMvc.perform(post("/api/v1/auth/signup/basic")
                .contentType(APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidPayload)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void signupNormalShouldConvertBasicUserToUsuarioAPie() throws Exception {
        String email = "normal.convert@streetask.com";

        mockMvc.perform(post("/api/v1/auth/signup/basic")
                .contentType(APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validBasicPayload(email, "normalConvertUser"))))
                .andExpect(status().isOk());

        mockMvc.perform(post("/api/v1/auth/signup/normal")
                .contentType(APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of("email", email))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Normal user registered successfully!"));

        User storedUser = userRepository.findByEmail(email).orElseThrow();
        assertThat(storedUser).isInstanceOf(UsuarioAPie.class);
        assertThat(storedUser.getAuthority().getAuthority()).isEqualTo("USER");
        assertThat(storedUser.getActivo()).isTrue();
    }

    @Test
    void signupNormalShouldReturnBadRequestWhenBasicUserDoesNotExist() throws Exception {
        mockMvc.perform(post("/api/v1/auth/signup/normal")
                .contentType(APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of("email", "missing.user@streetask.com"))))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Error: User not found or already completed!"));
    }

    @Test
    void signupBusinessShouldConvertBasicUserToCuentaEmpresa() throws Exception {
        String email = "business.convert@streetask.com";
        String nif = "B12345678";

        mockMvc.perform(post("/api/v1/auth/signup/basic")
                .contentType(APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validBasicPayload(email, "businessUser1"))))
                .andExpect(status().isOk());

        mockMvc.perform(post("/api/v1/auth/signup/business")
                .contentType(APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validBusinessPayload(email, nif, "Gran Via 1"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message")
                        .value("Business account registered successfully! Your account is pending admin verification."));

        User storedUser = userRepository.findByEmail(email).orElseThrow();
        assertThat(storedUser).isInstanceOf(CuentaEmpresa.class);
        CuentaEmpresa empresa = (CuentaEmpresa) storedUser;

        assertThat(empresa.getCif()).isEqualTo(nif);
        assertThat(empresa.getDireccion()).isEqualTo("Gran Via 1");
        assertThat(empresa.getAuthority().getAuthority()).isEqualTo("BUSINESS");
        assertThat(empresa.getActivo()).isFalse();
    }

    @Test
    void signupBusinessShouldReturnBadRequestWhenNifAlreadyExists() throws Exception {
        String duplicatedNif = "B87654321";

        mockMvc.perform(post("/api/v1/auth/signup/basic")
                .contentType(APPLICATION_JSON)
                .content(objectMapper
                        .writeValueAsString(validBasicPayload("business.one@streetask.com", "businessOne"))))
                .andExpect(status().isOk());

        mockMvc.perform(post("/api/v1/auth/signup/business")
                .contentType(APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(
                        validBusinessPayload("business.one@streetask.com", duplicatedNif, "Address 1"))))
                .andExpect(status().isOk());

        mockMvc.perform(post("/api/v1/auth/signup/basic")
                .contentType(APPLICATION_JSON)
                .content(objectMapper
                        .writeValueAsString(validBasicPayload("business.two@streetask.com", "businessTwo"))))
                .andExpect(status().isOk());

        mockMvc.perform(post("/api/v1/auth/signup/business")
                .contentType(APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(
                        validBusinessPayload("business.two@streetask.com", duplicatedNif, "Address 2"))))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Error: NIF is already registered!"));
    }

    private Map<String, Object> validBasicPayload(String email, String userName) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("email", email);
        payload.put("userName", userName);
        payload.put("password", "123456");
        payload.put("firstName", "Test");
        payload.put("lastName", "User");
        return payload;
    }

    private Map<String, Object> validBusinessPayload(String email, String nif, String address) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("email", email);
        payload.put("nif", nif);
        payload.put("address", address);
        return payload;
    }
}
