package com.streetask.app.user;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * DTO para enviar ubicación del cliente
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserLocationDTO {
    private Double latitude;
    private Double longitude;
    private Float accuracy;
    private Boolean isPublic;
}
