package com.streetask.app.model;

import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.Setter;

@Embeddable
@Getter
@Setter
public class GeoPoint {

    private Double latitude;

    private Double longitude;
}
