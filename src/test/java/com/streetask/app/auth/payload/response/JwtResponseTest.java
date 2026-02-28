package com.streetask.app.auth.payload.response;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.Test;

class JwtResponseTest {

    @Test
    void constructorAndToStringShouldExposeAllFields() {
        UUID id = UUID.fromString("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa");
        List<String> roles = List.of("ADMIN", "USER");

        JwtResponse response = new JwtResponse("token-value", id, "admin1@streetask.com", roles);

        assertThat(response.getToken()).isEqualTo("token-value");
        assertThat(response.getType()).isEqualTo("Bearer");
        assertThat(response.getId()).isEqualTo(id);
        assertThat(response.getUsername()).isEqualTo("admin1@streetask.com");
        assertThat(response.getRoles()).containsExactly("ADMIN", "USER");

        assertThat(response.toString()).isEqualTo(
                "JwtResponse [token=token-value, type=Bearer, id=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa, username=admin1@streetask.com, roles=[ADMIN, USER]]");
    }
}
