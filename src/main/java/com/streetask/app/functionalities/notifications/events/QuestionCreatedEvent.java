package com.streetask.app.functionalities.notifications.events;

import java.util.UUID;

public record QuestionCreatedEvent(UUID questionId) {
}
