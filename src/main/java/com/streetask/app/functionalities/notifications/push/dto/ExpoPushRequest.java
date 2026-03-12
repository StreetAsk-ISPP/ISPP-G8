package com.streetask.app.functionalities.notifications.push.dto;

import java.util.Map;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ExpoPushRequest {

    private String to;
    private String title;
    private String body;
    private String sound;
    private Map<String, Object> data;
}