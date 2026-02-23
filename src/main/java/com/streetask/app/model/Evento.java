package com.streetask.app.model;
import java.time.LocalDateTime;

import com.streetask.app.model.enums.CategoriaEvento;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;


@Entity
@Table(name = "eventos")
@Getter
@Setter

public class Evento extends BaseEntity {

//usuarioId FK
    private String titulo;

    private String descripcion;

    private CategoriaEvento categoria;

//Ubicacion con point

    private String direccion;

    private LocalDateTime fecha_inicio;

    private LocalDateTime fecha_fin;

    private Boolean es_patrocinado;

    private Boolean destacado;

    private LocalDateTime fecha_destacado_hasta;

    private String  icono_mapa;

    private Integer numero_asistentes;

    private Integer numero_interesados;

    private Boolean activo;

    private LocalDateTime fecha_creacion;
    
    private LocalDateTime fecha_actualizacion;
//Faltan relaciones

} 
