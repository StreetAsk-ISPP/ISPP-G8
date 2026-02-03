# Guía inicial para el desarrollo (Propuesta)

## Introducción
Esta guía establece la propuesta de estructura y directrices básicas para el desarrollo del proyecto: una plataforma social basada en geolocalización para compartir información de eventos en tiempo real.

---

## 1. Arquitectura del sistema

### 1.1 Arquitectura general (3 Capas)

**Capa de Presentación (Frontend)**
- Aplicación Web
- Aplicación Móvil (opcional para MVP)
- Interfaz de usuario con mapas interactivos

**Capa de Lógica (Backend)**
- API RESTful
- Autenticación y autorización (JWT)
- Lógica de negocio (eventos, preguntas, monedas)
- Servicios de geolocalización
- WebSockets (chat y notificaciones en tiempo real)

**Capa de Datos**
- Base de datos relacional con soporte geoespacial
- Sistema de caché para rendimiento
- Almacenamiento de archivos (imágenes, multimedia)
- Servicios externos (mapas, notificaciones push)

---

## 2. Stack tecnológico recomendado

### 2.1 Backend
**Opciones principales:**
- **Node.js** con Express/Fastify + TypeScript
- **Python** con FastAPI/Django
- **Java** con Spring Boot

**ORM/Base de Datos:**
- PostgreSQL + PostGIS (para geolocalización)
- Prisma, TypeORM o SQLAlchemy como ORM

**Autenticación:**
- JWT (JSON Web Tokens)
- Bcrypt para hash de contraseñas

### 2.2 Frontend
**Web:**
- React o Vue.js con TypeScript
- Tailwind CSS para estilos
- React Leaflet o Google Maps para mapas

**Móvil (opcional):**
- React Native o Flutter

### 2.3 Infraestructura
- **Caché**: Redis
- **Almacenamiento**: AWS S3, Google Cloud Storage o similar
- **Contenedores**: Docker
- **CI/CD**: GitHub Actions
- **Hosting**: AWS, Google Cloud, Railway o Vercel

---

## 3. Estructura del Proyecto

### 3.1 Backend

```
backend/
├── src/
│   ├── config/              # Configuración (DB, JWT, env)
│   ├── entities/            # Modelos de dominio
│   ├── controllers/         # Controladores HTTP
│   ├── services/            # Lógica de negocio
│   ├── repositories/        # Acceso a datos
│   ├── middlewares/         # Auth, validación, errores
│   ├── routes/              # Definición de rutas
│   ├── dto/                 # Data Transfer Objects
│   ├── utils/               # Funciones auxiliares
│   └── websockets/          # Handlers de WebSocket
├── tests/
├── prisma/                  # Esquema y migraciones
├── .env.example
├── package.json
└── Dockerfile
```

### 3.2 Frontend

```
frontend/
├── src/
│   ├── components/          # Componentes reutilizables
│   │   ├── ui/             # Componentes base
│   │   ├── map/            # Componentes de mapa
│   │   └── events/         # Componentes de eventos
│   ├── pages/              # Páginas
│   ├── hooks/              # Custom hooks
│   ├── services/           # Llamadas a la API
│   ├── store/              # Estado global
│   ├── types/              # Tipos TypeScript
│   ├── utils/              # Utilidades
│   └── assets/             # Imágenes e iconos
├── public/
├── .env.example
└── package.json
```

---

## 4. API RESTful - Endpoints principales

### Estructura de URLs
```
Base: /api/v1
```

### Endpoints Básicos

**Autenticación**
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
```

**Usuarios**
```
GET    /api/users/me
PUT    /api/users/me
GET    /api/users/:id
```

**Eventos**
```
GET    /api/events
POST   /api/events
GET    /api/events/:id
PUT    /api/events/:id
DELETE /api/events/:id
GET    /api/events/nearby
POST   /api/events/:id/attend
```

**Preguntas**
```
GET    /api/questions
POST   /api/questions
GET    /api/questions/:id
GET    /api/questions/nearby
```

**Respuestas**
```
GET    /api/questions/:id/answers
POST   /api/questions/:id/answers
PUT    /api/answers/:id/verify
```

**Chat**
```
GET    /api/events/:id/chat/messages
POST   /api/events/:id/chat/messages
```

**Notificaciones**
```
GET    /api/notifications
PUT    /api/notifications/:id/read
```

### Formato de Respuestas

**Éxito:**
```json
{
  "success": true,
  "data": { /* objeto o array */ }
}
```

**Error:**
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Descripción del error"
  }
}
```


## 5. Funcionalidades clave

### 5.1 Geolocalización
- Almacenar ubicaciones como coordenadas GPS (latitud, longitud)
- Usar PostGIS para consultas espaciales
- Implementar búsqueda por radio (eventos cercanos)
- Calcular distancias entre puntos

### 5.2 Sistema de monedas
- Registrar todas las transacciones
- Otorgar monedas por respuestas verificadas
- Permitir canje de monedas por recompensas
- Mantener historial de saldo

### 5.3 WebSocket para tiempo real
- Chat de eventos en vivo
- Notificaciones instantáneas
- Actualización de contadores (asistentes, mensajes)

### 6.4 Seguridad
- Autenticación con JWT
- Hash de contraseñas con bcrypt
- Validación de datos de entrada
- Rate limiting para prevenir abuso
- CORS configurado correctamente

---

## 7. Base de Datos

### 7.1 Tecnología
- **PostgreSQL** con extensión **PostGIS**
- Soporte nativo para geolocalización
- Transacciones ACID
- Tipos de datos avanzados (JSON, UUID, Arrays)

### 7.2 Índices Importantes
- Índices geoespaciales en columnas de ubicación
- Índices en claves foráneas
- Índices en campos de búsqueda frecuente (email, username)
- Índices compuestos para consultas complejas

### 7.3 Consideraciones
- Usar UUIDs para IDs de entidades
- Implementar soft delete (marcar como inactivo en vez de eliminar)
- Registrar timestamps (created_at, updated_at)
- Normalizar datos para evitar redundancia

---

## 8. Testing

### 8.1 Tipos de Tests
- **Tests Unitarios**: Probar funciones y métodos individuales
- **Tests de Integración**: Probar interacciones entre componentes
- **Tests E2E**: Probar flujos completos de usuario

### 8.2 Herramientas
- Backend: Jest, Pytest o JUnit
- Frontend: Jest, React Testing Library
- E2E: Playwright o Cypress

### 8.3 Cobertura
- Objetivo: >70% de cobertura de código
- Priorizar tests en lógica de negocio crítica

---

## 9. Despliegue

### 9.1 Entornos
- **Desarrollo**: Local con Docker
- **Pre-producción**: Rama `trunk`
- **Producción**: Rama `main`

### 9.2 CI/CD
- Ejecutar tests automáticamente en Pull Requests
- Validar formato de código (linting)
- Build automático al hacer merge
- Deploy automático a producción desde `main`

### 9.3 Monitoreo
- Logs de errores y eventos importantes
- Métricas de rendimiento (latencia, uso de recursos)
- Alertas para errores críticos
