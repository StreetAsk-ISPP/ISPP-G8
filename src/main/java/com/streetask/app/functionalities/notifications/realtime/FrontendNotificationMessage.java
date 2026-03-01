package com.streetask.app.functionalities.notifications.realtime;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class FrontendNotificationMessage {

    private String type;
    private String title;
    private String message;

    private UUID referenceId;
    private String referenceType;

    private String zoneKey;
    private LocalDateTime timestamp;
}
