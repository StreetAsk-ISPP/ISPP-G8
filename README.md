# ISPP-G8
Aplicación para conocer en tiempo real información relevante sobre eventos en vivo.

## Tecnologías

| Capa | Tecnología |
|------|-----------|
| Frontend | React Native + Expo (JavaScript) |
| Backend | Spring Boot 3 (Java 21) |
| Base de datos | H2 en memoria (dev) / MySQL (prod) |
| Autenticación | JWT |

## Requisitos previos

- **Java 21 LTS**
- **Maven 3.6+** (incluido con el Maven Wrapper del proyecto)
- **Node.js LTS** + **npm**
- **Expo Go** (opcional, para probar en móvil)

---

## Backend

### Arrancar (base de datos H2 en memoria, por defecto)

```bash
./mvnw spring-boot:run
```

El servidor estará disponible en `http://localhost:8080`

### Arrancar con MySQL

```bash
./mvnw spring-boot:run -Dspring-boot.run.profiles=mysql
```

Requiere una base de datos MySQL con:
- Base de datos: `streetask`
- Usuario: `streetask`
- Contraseña: `streetask`

### URLs útiles (backend)

| URL | Descripción |
|-----|-------------|
| `http://localhost:8080/swagger-ui/index.html` | Documentación interactiva de la API |
| `http://localhost:8080/h2-console` | Consola H2 (solo en modo H2) |

---

## Frontend

```bash
cd frontend
npm install
cp .env.example .env   # en Windows: copy .env.example .env
npm start
```

Escanea el QR con Expo Go o pulsa `w` para abrir en el navegador.

### Variables de entorno (frontend/.env)

| Variable | Valor por defecto | Descripción |
|----------|-------------------|-------------|
| `EXPO_PUBLIC_API_BASE_URL` | `http://localhost:8080` | URL base del backend |
| `EXPO_PUBLIC_API_TIMEOUT_MS` | `10000` | Timeout de las peticiones (ms) |
