package com.streetask.app.model;

import com.streetask.app.user.User;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * Representa la ubicación de un usuario en tiempo real.
 */
@Entity
@Table(name = "user_locations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserLocation extends BaseEntity {

    /**
     * Usuario propietario de esta ubicación
     */
    @ManyToOne
    private User user;

    /**
     * Latitud de la ubicación
     */
    @NotNull(message = "Latitude is required")
    @DecimalMin(value = "-90.0", message = "Latitude must be between -90 and 90")
    @DecimalMax(value = "90.0", message = "Latitude must be between -90 and 90")
    private Double latitude;

    /**
     * Longitud de la ubicación
     */
    @NotNull(message = "Longitude is required")
    @DecimalMin(value = "-180.0", message = "Longitude must be between -180 and 180")
    @DecimalMax(value = "180.0", message = "Longitude must be between -180 and 180")
    private Double longitude;

    /**
     * Precisión de la ubicación en metros
     */
    private Float accuracy;

    /**
     * Fecha y hora en que se capturó la ubicación
     */
    private LocalDateTime timestamp;

    /**
     * Indica si el usuario ha compartido públicamente su ubicación
     */
    private Boolean isPublic;
}
