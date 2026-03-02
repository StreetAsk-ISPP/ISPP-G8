package com.streetask.app.model;

import com.streetask.app.user.User;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
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
    private Double latitude;

    /**
     * Longitud de la ubicación
     */
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
