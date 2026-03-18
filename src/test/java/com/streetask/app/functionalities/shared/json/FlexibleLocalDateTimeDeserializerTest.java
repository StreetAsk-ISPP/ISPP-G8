package com.streetask.app.functionalities.shared.json;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

import org.junit.jupiter.api.Test;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;

class FlexibleLocalDateTimeDeserializerTest {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    void shouldParseIsoInstantUsingSystemDefaultZone() throws Exception {
        String json = "{\"expiresAt\":\"2026-03-15T10:00:00Z\"}";

        DatePayload payload = objectMapper.readValue(json, DatePayload.class);

        LocalDateTime expected = Instant.parse("2026-03-15T10:00:00Z")
                .atZone(ZoneId.systemDefault())
                .toLocalDateTime();

        assertThat(payload.expiresAt).isEqualTo(expected);
    }

    @Test
    void shouldParseIsoOffsetDateTimeUsingSystemDefaultZone() throws Exception {
        String json = "{\"expiresAt\":\"2026-03-15T11:00:00+01:00\"}";

        DatePayload payload = objectMapper.readValue(json, DatePayload.class);

        LocalDateTime expected = Instant.parse("2026-03-15T10:00:00Z")
                .atZone(ZoneId.systemDefault())
                .toLocalDateTime();

        assertThat(payload.expiresAt).isEqualTo(expected);
    }

    @Test
    void shouldParseIsoLocalDateTimeWithoutAddingExtraHour() throws Exception {
        String raw = "2026-03-15T11:00:00";
        String json = "{\"expiresAt\":\"" + raw + "\"}";

        DatePayload payload = objectMapper.readValue(json, DatePayload.class);

        LocalDateTime expected = LocalDateTime.parse(raw, DateTimeFormatter.ISO_LOCAL_DATE_TIME);
        assertThat(payload.expiresAt).isEqualTo(expected);
    }

    private static class DatePayload {
        @JsonDeserialize(using = FlexibleLocalDateTimeDeserializer.class)
        private LocalDateTime expiresAt;
    }
}
