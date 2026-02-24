package com.streetask.app.auth;

import java.time.LocalDateTime;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import com.streetask.app.auth.payload.request.BusinessSignupRequest;
import com.streetask.app.auth.payload.request.CompleteSignupRequest;
import com.streetask.app.auth.payload.request.SignupRequest;
import com.streetask.app.user.Authorities;
import com.streetask.app.user.AuthoritiesService;
import com.streetask.app.user.CuentaEmpresa;
import com.streetask.app.user.CuentaEmpresaRepository;
import com.streetask.app.user.EstadoSolicitud;
import com.streetask.app.user.TipoCuenta;
import com.streetask.app.user.User;
import com.streetask.app.user.UserService;
import com.streetask.app.user.UsuarioAPie;
import com.streetask.app.user.UsuarioAPieRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

	@PersistenceContext
	private EntityManager entityManager;

	private final PasswordEncoder encoder;
	private final AuthoritiesService authoritiesService;
	private final UserService userService;
	private final UsuarioAPieRepository usuarioAPieRepository;
	private final CuentaEmpresaRepository cuentaEmpresaRepository;

	@Autowired
	public AuthService(PasswordEncoder encoder, AuthoritiesService authoritiesService, UserService userService,
			UsuarioAPieRepository usuarioAPieRepository, CuentaEmpresaRepository cuentaEmpresaRepository) {
		this.encoder = encoder;
		this.authoritiesService = authoritiesService;
		this.userService = userService;
		this.usuarioAPieRepository = usuarioAPieRepository;
		this.cuentaEmpresaRepository = cuentaEmpresaRepository;
	}

	@Transactional
	public void createNormalUser(@Valid CompleteSignupRequest request) {
		// Buscar el usuario básico creado en la primera pantalla
		User basicUser = userService.findUser(request.getEmail());

		UsuarioAPie usuario = new UsuarioAPie();

		// Copiar datos de User (base)
		usuario.setEmail(basicUser.getEmail());
		usuario.setUserName(basicUser.getUserName());
		usuario.setPassword(basicUser.getPassword());
		usuario.setFirstName(basicUser.getFirstName());
		usuario.setLastName(basicUser.getLastName());
		usuario.setTipo_cuenta(TipoCuenta.USUARIO_APIE);
		usuario.setActivo(true); // Usuario normal activo inmediatamente
		usuario.setFecha_registro(basicUser.getFecha_registro());

		// Datos específicos de UsuarioAPie
		usuario.setName(basicUser.getFirstName());
		usuario.setApellidos(basicUser.getLastName());
		usuario.setSaldo_monedas(0);
		usuario.setRating(0.0f);
		usuario.setVerificado(false);

		// Asignar autoridad de USER
		Authorities role = authoritiesService.findByAuthority("USER");
		usuario.setAuthority(role);

		// Eliminar el usuario básico y hacer flush para forzar el DELETE
		userService.deleteUser(basicUser.getId());
		entityManager.flush();

		// Guardar el usuario a pie
		usuarioAPieRepository.save(usuario);
	}

	@Transactional
	public User createBasicUser(@Valid SignupRequest request) {
		// Crea un usuario básico temporal que será convertido a UsuarioAPie o
		// CuentaEmpresa
		User user = new User();
		user.setEmail(request.getEmail());
		user.setUserName(request.getUserName()); // nombre de usuario elegido
		user.setPassword(encoder.encode(request.getPassword()));
		user.setFirstName(request.getFirstName());
		user.setLastName(request.getLastName());
		user.setActivo(false); // Inactivo hasta que se complete el registro
		user.setFecha_registro(LocalDateTime.now());

		// Asignar autoridad temporal USER
		Authorities role = authoritiesService.findByAuthority("USER");
		user.setAuthority(role);

		return userService.saveUser(user);
	}

	@Transactional
	public void convertToBusinessUser(@Valid BusinessSignupRequest request) {
		// Buscar el usuario básico creado en la primera pantalla
		User basicUser = userService.findUser(request.getEmail());

		// Crear CuentaEmpresa con los datos del usuario básico
		CuentaEmpresa empresa = new CuentaEmpresa();

		// Copiar datos básicos
		empresa.setEmail(basicUser.getEmail());
		empresa.setUserName(basicUser.getUserName());
		empresa.setPassword(basicUser.getPassword());
		empresa.setFirstName(basicUser.getFirstName());
		empresa.setLastName(basicUser.getLastName());
		empresa.setTipo_cuenta(TipoCuenta.EMPRESA);
		empresa.setActivo(false); // Inactivo hasta que admin verifique
		empresa.setFecha_registro(basicUser.getFecha_registro());

		// Datos específicos de CuentaEmpresa
		empresa.setCif(request.getNif());
		empresa.setDireccion(request.getAddress());

		// Estados por defecto
		empresa.setVerificado(false);
		empresa.setRating(0.0f);
		empresa.setEstado_solicitud(EstadoSolicitud.PENDIENTE);
		empresa.setSuscripcion_activa(false);

		// Asignar autoridad de BUSINESS
		Authorities role = authoritiesService.findByAuthority("BUSINESS");
		empresa.setAuthority(role);

		// Eliminar el usuario básico y hacer flush para forzar el DELETE
		userService.deleteUser(basicUser.getId());
		entityManager.flush();

		// Guardar la cuenta empresa
		cuentaEmpresaRepository.save(empresa);
	}

}
