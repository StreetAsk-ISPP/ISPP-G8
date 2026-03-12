package com.streetask.app.functionalities.notifications.push.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterPushDeviceRequest {

    private String endpoint;
    private String p256dh;
    private String auth;
    private String zoneKey;
}