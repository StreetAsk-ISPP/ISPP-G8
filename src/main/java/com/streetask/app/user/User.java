package com.streetask.app.user;

import com.streetask.app.model.BaseEntity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@Table(name = "appusers")
public class User extends BaseEntity {

	// Email para autenticación
	@NotBlank
	@Email
	@Column(unique = true)
	private String email;

	// Nombre de usuario elegido por el usuario
	@NotBlank
	private String userName;

	private String password;

	@NotBlank
	private String firstName;

	@NotBlank
	private String lastName;

	@Enumerated(EnumType.STRING)
	private TipoCuenta tipo_cuenta;

	private Boolean activo;

	private LocalDateTime fecha_registro;

	private LocalDateTime ultima_conexion;

	@NotNull
	@ManyToOne(optional = false)
	@JoinColumn(name = "authority")
	Authorities authority;

	public Boolean hasAuthority(String auth) {
		return authority.getAuthority().equals(auth);
	}

	public Boolean hasAnyAuthority(String... authorities) {
		Boolean cond = false;
		for (String auth : authorities) {
			if (auth.equals(authority.getAuthority()))
				cond = true;
		}
		return cond;
	}

}
