# Definición de entidades del sistema

## Introducción
Este documento describe las entidades principales del sistema identificadas a partir de las historias de usuario y los casos de uso definidos para el MVP. La aplicación es una plataforma social basada en geolocalización donde los usuarios pueden crear eventos, hacer preguntas, compartir información en tiempo real y ganar recompensas por su participación.

---

## Entidades Base

### 1. Usuario (User)
Entidad base que representa la autenticación de cualquier persona en la plataforma. Clase padre de UsuarioAPie, CuentaEmpresa y Administrador.

**Atributos:**
- `id` (UUID): Identificador único del usuario
- `email` (String): Correo electrónico único
- `password` (String): Contraseña encriptada
- `tipo_cuenta` (Enum): USUARIO_APIE, EMPRESA, ADMINISTRADOR
- `activo` (Boolean): Si la cuenta está activa
- `fecha_registro` (DateTime): Fecha de creación de la cuenta
- `ultima_conexion` (DateTime): Última vez que el usuario estuvo activo

**Relaciones:**
- Puede extenderse a UsuarioAPie (1:1)
- Puede extenderse a CuentaEmpresa (1:1)
- Puede extenderse a Administrador (1:1)

**Nota:** Usuario es una entidad abstracta. Cada registro debe tener exactamente una extensión (UsuarioAPie, CuentaEmpresa o Administrador).

---

### 2. UsuarioAPie (UsuarioAPie)
Usuario regular de la aplicación. Hereda de Usuario y añade funcionalidades de interacción, gamificación y geolocalización.

**Atributos:**
- `id` (UUID): Identificador único
- `usuario_id` (UUID): Referencia al usuario base (FK)
- `nombre` (String): Nombre del usuario
- `apellidos` (String): Apellidos del usuario
- `username` (String): Nombre de usuario único
- `telefono` (String, opcional): Número de teléfono
- `foto_perfil` (String): URL de la imagen de perfil
- `saldo_monedas` (Integer): Monedas virtuales acumuladas (Contribution Coins)
- `rating` (Float): Rating del usuario basado en (respuestas_positivas - respuestas_negativas) / total_respuestas, escala de 5


**Relaciones:**
- Extiende de Usuario (1:1)
- Puede hacer múltiples preguntas (1:N con Pregunta)
- Puede responder múltiples preguntas (1:N con Respuesta)
- Puede asistir a múltiples eventos (N:M con Evento a través de AsistenciaEvento) 
- Puede recibir múltiples notificaciones (1:N con Notificación)
- Puede tener múltiples transacciones de monedas (1:N con TransaccionMoneda)
- Puede reportar contenido (1:N con Reporte)
- Puede canjear recompensas (N:M con Recompensa)

---

### 3. Cuenta Empresa (CuentaEmpresa)
Extensión de Usuario para empresas que organizan eventos oficiales. Hereda de Usuario.

**Atributos:**
- `id` (UUID): Identificador único
- `usuario_id` (UUID): Referencia al usuario base
- `nombre_empresa` (String): Nombre legal de la empresa
- `cif` (String): Código de Identificación Fiscal
- `direccion` (String): Dirección física de la empresa
- `sitio_web` (String, opcional): URL del sitio web
- `descripcion` (String): Descripción de la empresa
- `logo` (String): URL del logo de la empresa
- `verificado` (Boolean): Si la empresa ha sido verificada por administradores
- `fecha_verificacion` (DateTime, opcional): Fecha de verificación
- `estado_solicitud` (Enum): PENDIENTE, APROBADA, RECHAZADA 
- `fecha_vencimiento_suscripcion` (DateTime, opcional): Fecha de fin de suscripción

**Relaciones:**
- Extiende de Usuario (1:1)
- Puede crear eventos patrocinados (1:N con Evento)

---

### 4. Evento (Evento)
Representa una actividad o situación ubicada geográficamente.

**Atributos:**
- `id` (UUID): Identificador único del evento
- `creador_id` (UUID): Referencia a la empresa creadora
- `titulo` (String): Título del evento
- `descripcion` (Text): Descripción detallada
- `categoria` (Enum): OCIO, BIENESTAR, CULTURA, GASTRONOMÍA, EMERGENCIA, OTRO 
- `ubicacion` (Point): Coordenadas geográficas (latitud, longitud)
- `direccion` (String): Dirección textual del evento
- `fecha_inicio` (DateTime): Fecha y hora de inicio
- `fecha_fin` (DateTime, opcional): Fecha y hora de finalización
- `destacado` (Boolean): Si el evento está destacado (pagado)
- `num_asistentes` (Integer): Contador de personas confirmadas
- `activo` (Boolean): Si el evento está visible
- `fecha_creacion` (DateTime): Fecha de creación
- `fecha_actualizacion` (DateTime): Última actualización

**Relaciones:**
- Pertenece a una empresa creadora (N:1 con Usuario)
- Puede tener múltiples preguntas asociadas (1:N con Pregunta)
- Puede tener múltiples asistencias confirmadas (N:M con Usuario a través de AsistenciaEvento)
- Tiene un chat asociado (1:1 con ChatEvento)
- Puede ser reportado (1:N con Reporte)

---

### 5. AsistenciaEvento (AsistenciaEvento)
Tabla de relación N:M entre UsuarioAPie y Evento. Gestiona la confirmación de asistencia de usuarios a eventos.

**Atributos:**
- `id` (UUID): Identificador único
- `usuario_apie_id` (UUID): Referencia al usuario APie
- `evento_id` (UUID): Referencia al evento
- `asiste` (Boolean): Si el usuario asistirá al evento
- `fecha_confirmacion` (DateTime): Fecha de confirmación o cambio de estado

**Relaciones:**
- Conecta UsuarioAPie con Evento (N:M)
- Un usuario puede tener un solo registro activo por evento (No puede asistir varias veces a un mismo evento)

**Reglas de Negocio:**
- Un UsuarioAPie solo puede tener una asistencia por evento 
- El contador `Evento.num_asistentes` se calcula contando registros con asiste = True
- Al cambiar de estado, se actualiza `fecha_confirmacion`

---

### 6. Pregunta (Pregunta)
Representa una consulta publicada por un usuario relacionada con un evento o ubicación.

**Atributos:**
- `id` (UUID): Identificador único
- `creador_id` (UUID): Referencia al usuario que hace la pregunta
- `evento_id` (UUID, opcional): Referencia al evento relacionado
- `titulo` (String): Título de la pregunta
- `contenido` (Text): Descripción detallada de la pregunta
- `ubicacion` (Point): Coordenadas geográficas
- `radio_alcance_km` (Float): Radio de alcance para notificar usuarios
- `activa` (Boolean): Si la pregunta sigue vigente
- `fecha_expiracion` (DateTime): Fecha de expiración automática (2h free, configurable premium)
- `fecha_creacion` (DateTime): Fecha de publicación
- `num_respuestas` (Integer): Contador de respuestas

**Relaciones:**
- Pertenece a un usuario (N:1 con Usuario)
- Puede estar asociada a un evento (N:1 con Evento)
- Puede tener múltiples respuestas (1:N con Respuesta)
- Puede ser reportada (1:N con Reporte)

---

### 7. Respuesta (Respuesta)
Representa una respuesta a una pregunta publicada.

**Atributos:**
- `id` (UUID): Identificador único
- `pregunta_id` (UUID): Referencia a la pregunta
- `usuario_id` (UUID): Referencia al usuario que responde
- `contenido` (Text): Contenido de la respuesta
- `es_verificada` (Boolean): Si el creador de la pregunta marcó esta respuesta como correcta
- `fecha_verificacion` (DateTime, opcional): Fecha de verificación
- `monedas_ganadas` (Integer): Monedas obtenidas por la respuesta verificada
- `ubicacion_usuario` (Point): Ubicación del usuario al responder (para verificar proximidad)
- `fecha_creacion` (DateTime): Fecha de publicación
- `votos_positivos` (Integer): Votos a favor de la respuesta obtenidos por otros usuarios 
- `votos_negativos` (Integer): Votos en contra de la respuesta obtenidos por otros usuarios 
- 

**Relaciones:**
- Pertenece a una pregunta (N:1 con Pregunta)
- Pertenece a un usuario (N:1 con Usuario)
- Puede ser reportada (1:N con Reporte)


---

### 8. VotoRespuesta (VotoRespuesta)
Registra los votos (likes/dislikes) de los usuarios sobre las respuestas.

**Atributos:**
- `id` (UUID): Identificador único
- `respuesta_id` (UUID): Referencia a la respuesta votada
- `usuario_id` (UUID): Referencia al usuario que vota
- `tipo_voto` (Enum): LIKE, DISLIKE
- `fecha_voto` (DateTime): Fecha del voto

**Relaciones:**
- Pertenece a una respuesta (N:1 con Respuesta)
- Pertenece a un usuario (N:1 con Usuario)

**Reglas de Negocio:**
- Un usuario solo puede votar una vez por respuesta (índice único usuario_id + respuesta_id)
- El rating del usuario que responde se calcula como: (respuestas_con_mas_likes - respuestas_con_mas_dislikes) / total_respuestas en escala de 5
- El autor de la respuesta gana 1 moneda si likes > dislikes, pierde 1 si dislikes > likes 

---

### 10. Notificacion (Notificación)
Representa alertas y avisos enviados a los usuarios.

**Atributos:**
- `id` (UUID): Identificador único
- `usuario_id` (UUID): Referencia al usuario destinatario
- `tipo` (Enum): PREGUNTA_CERCANA ,EVENTO_CERCANO, RESPUESTA_PREGUNTA, VERIFICACION_RESPUESTA, ADMIN
- `contenido` (Text): Descripción del aviso
- `referencia_id` (UUID, opcional): ID del evento, pregunta o respuesta relacionada
- `referencia_tipo` (String, opcional): Tipo de entidad referenciada
- `fecha_envio` (DateTime): Fecha de creación

**Relaciones:**
- Pertenece a un usuario (N:1 con Usuario)

---

### 11. TransaccionMoneda (TransaccionMoneda)
Registro de movimientos de monedas virtuales del usuario.

**Atributos:**
- `id` (UUID): Identificador único
- `usuario_id` (UUID): Referencia al usuario
- `tipo` (Enum): GANANCIA, GASTO
- `cantidad` (Integer): Número de monedas (positivo o negativo)
- `saldo_anterior` (Integer): Saldo antes de la transacción
- `saldo_posterior` (Integer): Saldo después de la transacción
- `referencia_id` (UUID, opcional): ID de la respuesta, recompensa o evento relacionado
- `fecha_transaccion` (DateTime): Fecha de la operación

**Relaciones:**
- Pertenece a un usuario (N:1 con Usuario)

---

### 14. Reporte (Reporte)
Representa denuncias de contenido inapropiado.

**Atributos:**
- `id` (UUID): Identificador único
- `usuario_id` (UUID): Referencia al usuario que reporta
- `contenido_id` (UUID): ID del elemento reportado
- `descripcion` (Text, opcional): Detalles adicionales
- `estado` (Enum): PENDIENTE, EN_REVISION, RESUELTO, RECHAZADO
- `fecha_reporte` (DateTime): Fecha de creación
- `fecha_resolucion` (DateTime, opcional): Fecha de respuesta administrativa

**Relaciones:**
- Pertenece a un usuario reportante (N:1 con Usuario)
- Puede ser revisado por uno o varios administradores (N:N con Administrador)

---

### 15. Administrador (Administrador)
Extensión de Usuario con permisos administrativos. Hereda de Usuario.

**Atributos:**
- `id` (UUID): Identificador único
- `usuario_id` (UUID): Referencia al usuario base
- `rol` (Enum): SUPER_ADMIN, MODERADOR_CONTENIDO, SOPORTE
- `permisos` (JSON): Lista de acciones permitidas
- `activo` (Boolean): Si tiene permisos activos
- `fecha_asignacion` (DateTime): Fecha de asignación del rol

**Relaciones:**
- Extiende de Usuario (1:1)
- Puede resolver reportes (1:N con Reporte)
- Puede verificar cuentas empresa (1:N con CuentaEmpresa)

---


## Resumen de Relaciones Principales

```
' ===== HERENCIA =====
Usuario (1) ──── (1) UsuarioAPie [extends]
Usuario (1) ──── (1) CuentaEmpresa [extends]
Usuario (1) ──── (1) Administrador [extends]

' ===== USUARIO APIE =====
UsuarioAPie (1) ──── (N) Evento [crea]
UsuarioAPie (1) ──── (N) Pregunta [publica]
UsuarioAPie (1) ──── (N) Respuesta [responde]
UsuarioAPie (N) ──── (M) Evento [asiste vía AsistenciaEvento]
UsuarioAPie (1) ──── (N) Notificacion [recibe]
UsuarioAPie (1) ──── (N) TransaccionMoneda [tiene]
UsuarioAPie (N) ──── (M) Recompensa [canjea vía CanjeRecompensa]
UsuarioAPie (1) ──── (N) Reporte [reporta]
UsuarioAPie (1) ──── (N) MensajeChat [envía]

' ===== EVENTOS =====
Evento (1) ──── (N) Pregunta [tiene]
Evento (1) ──── (1) ChatEvento [tiene]
Evento (1) ──── (N) AsistenciaEvento [tiene]
Evento (N) ──── (1) Categoria [pertenece a]

' ===== ASISTENCIA (N:M) =====
AsistenciaEvento (N) ──── (1) UsuarioAPie
AsistenciaEvento (N) ──── (1) Evento

' ===== PREGUNTAS =====
Pregunta (1) ──── (N) Respuesta [tiene]

' ===== CHAT =====
ChatEvento (1) ──── (N) MensajeChat [contiene]

' ===== MODERACIÓN =====
Administrador (1) ──── (N) Reporte [resuelve]
```

---

## Diagrama UML - Modelo de Datos

### Diagrama de clases UML

![Diagrama UML del Sistema](./images/diagramaUML.png)

### Leyenda de Cardinalidades

- `1` : Relación uno a uno
- `*` : Relación uno a muchos
- `0..1` : Relación opcional

