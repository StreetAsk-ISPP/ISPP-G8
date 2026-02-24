package com.streetask.app.user;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;


@Entity
@Table(name = "usuarios_apie")
@Getter
@Setter

public class UsuarioAPie extends User {

//usuarioId FK
    private String name;
    private String apellidos;

    private String telefono;

    private String foto_perfil;

    private Integer saldo_monedas;

    private Float rating; 

    // Implementar point para ubicacion
    
    private Float radio_visibilidad_km;

    private Boolean verificado;

//Faltan relaciones

} 
