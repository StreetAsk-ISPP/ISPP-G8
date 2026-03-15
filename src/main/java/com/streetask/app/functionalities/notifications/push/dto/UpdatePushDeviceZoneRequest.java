package com.streetask.app.functionalities.notifications.push.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdatePushDeviceZoneRequest {

    private String endpoint;
    private String zoneKey;
    private Double latitude;
    private Double longitude;
}