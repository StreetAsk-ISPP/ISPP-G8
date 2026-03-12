package com.streetask.app.functionalities.notifications.push.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UnregisterPushDeviceRequest {

    private String pushToken;
}