package com.streetask.app.functionalities.shared.json;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;

/**
 * Serializes LocalDateTime as ISO 8601 UTC string with explicit 'Z' suffix.
 * This ensures the frontend correctly interprets the timestamp as UTC, not
 * local time.
 */
public class UtcLocalDateTimeSerializer extends JsonSerializer<LocalDateTime> {

    private static final DateTimeFormatter ISO_INSTANT_FORMATTER = DateTimeFormatter.ISO_OFFSET_DATE_TIME;

    @Override
    public void serialize(LocalDateTime value, JsonGenerator gen, SerializerProvider serializers) throws IOException {
        if (value == null) {
            gen.writeNull();
            return;
        }

        // Treat LocalDateTime as UTC and convert to ISO string with 'Z'
        String isoString = value.atZone(ZoneId.of("UTC")).format(ISO_INSTANT_FORMATTER);
        gen.writeString(isoString);
    }
}
