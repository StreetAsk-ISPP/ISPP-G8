package com.streetask.app.user;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "cuenta_empresa")
@Getter
@Setter

public class CuentaEmpresa extends User {

    // usuarioId FK
    private String nombre_empresa;

    @Column(unique = true)
    private String cif;

    private String direccion;

    private String sitio_web;

    private String descpricion;

    private String logo;

    private Boolean verificado;

    private Float rating;

    private LocalDateTime fecha_verificacion;

    private EstadoSolicitud estado_solicitud;

    private Boolean suscripcion_activa;

    private LocalDateTime fecha_vencimiento_suscripcion;

    // Faltan relaciones

}
