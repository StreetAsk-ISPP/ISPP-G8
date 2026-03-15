package com.streetask.app.functionalities.notifications.push.dto;

import java.util.UUID;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PushMessage {

    private String title;
    private String body;
    private String type;
    private UUID referenceId;
    private String referenceType;
    private Double questionLatitude;
    private Double questionLongitude;
    private Double radiusKm;
}