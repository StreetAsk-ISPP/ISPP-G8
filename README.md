# ISPP-G8
Aplicación para conocer en tiempo real información relevante sobre eventos en vivo.

## Tecnologías

| Capa | Tecnología |
|------|-----------|
| Frontend | React Native + Expo (JavaScript) |
| Backend | Spring Boot 3 (Java 21) |
| Base de datos | H2 en memoria (dev) / MySQL (prod) |
| Autenticación | JWT |

## ¿Cómo ejecutar?

| Modo | Base de datos | Cuándo usar |
|------|--------------|-------------|
| **Sin Docker** | H2 (memoria) | Desarrollo rápido, no requiere setup |
| **Con Docker** | MySQL | Probar queries reales antes de producción |
| **Producción** | MySQL (Azure) | Despliegue real |

> ⚠️ **IMPORTANTE**: No puedes ejecutar ambas opciones a la vez. Usan los mismos puertos (8080, 8081). Para cambiar de modo, para primero el que esté corriendo.

---

## Opción 1: Sin Docker (Desarrollo Rápido)

**Requisitos**: Java 21 LTS, Node.js LTS

Esta opción usa **H2** (base de datos en memoria). No necesitas instalar nada más.

### Backend

```bash
# Windows
.\mvnw.cmd spring-boot:run

# macOS/Linux
./mvnw spring-boot:run
```

El backend estará en `http://localhost:8080`

### Frontend

```bash
cd frontend
npm install
npm start
```

Escanea el QR con Expo Go o pulsa `w` para abrir en el navegador.

### URLs útiles

| URL | Descripción |
|-----|-------------|
| http://localhost:8080/swagger-ui/index.html | Documentación de la API |
| http://localhost:8080/h2-console | Consola de base de datos H2 |

> **Nota**: Los datos en H2 se pierden al reiniciar. Esto es intencional para desarrollo.

---

## Opción 2: Con Docker (Entorno Completo)

**Requisitos**: Docker Desktop

Esta opción levanta **todo** (frontend, backend, MySQL) con un solo comando. Usa MySQL como en producción.

### Arrancar

```bash
docker-compose up -d
```

### URLs

| URL | Servicio |
|-----|----------|
| http://localhost:8081 | Frontend (Web) |
| http://localhost:8080/swagger-ui/index.html | API Docs |
| http://localhost:8080/api/v1/* | Backend API |

### Comandos útiles

```bash
# Ver logs del backend
docker-compose logs -f backend

# Parar todo
docker-compose down

# Parar y borrar datos de MySQL
docker-compose down -v
```

> **Nota**: Los datos de MySQL persisten entre reinicios (volumen `mysql_data`).

---

## Variables de entorno

### Frontend (frontend/.env)

```bash
cp frontend/.env.example frontend/.env  # Windows: copy frontend\.env.example frontend\.env
```

| Variable | Valor por defecto | Descripción |
|----------|-------------------|-------------|
| `EXPO_PUBLIC_API_BASE_URL` | `http://localhost:8080` | URL del backend |
| `EXPO_PUBLIC_API_TIMEOUT_MS` | `10000` | Timeout de las peticiones (ms) |

---

## Producción (Azure)

Backend, Frontend y MySQL están desplegados en Azure. El despliegue es automático vía CI/CD.

- **Backend**: Azure App Service
- **Frontend**: Expo (EAS Build)
- **Database**: Azure MySQL

---

## Solución de Problemas

### VS Code muestra errores de dependencias falsos

Si VS Code muestra cientos de errores de imports pero Maven compila bien (`./mvnw compile`), el caché del Java Language Server está desincronizado.

**¿Por qué pasa esto?** El Java Language Server de VS Code genera archivos de caché (`.classpath`, `bin/`, etc.) que a veces se corrompen al hacer pull, cambiar de rama, o editar el `pom.xml`. La configuración del proyecto ya está optimizada para minimizar esto, pero si ocurre:

**Opción 1 - Sin cerrar VS Code (recomendada):**
1. Presiona `Ctrl+Shift+P` (Windows/Linux) o `Cmd+Shift+P` (macOS)
2. Escribe `Java: Clean Java Language Server Workspace`
3. Selecciona "Reload and delete"
4. Espera ~30 segundos a que reinicie

**Opción 2 - Con script (si la opción 1 no funciona):**

> ⚠️ **IMPORTANTE**: Cierra VS Code completamente antes de ejecutar el script

```bash
# Windows (PowerShell) - Abre PowerShell desde el menú inicio, NO desde VS Code
cd C:\Users\TU_USUARIO\Desktop\ISPP\ISPP-G8
.\scripts\clean-java-cache.ps1

# macOS/Linux - Abre Terminal, NO el terminal de VS Code
cd ~/Desktop/ISPP/ISPP-G8
chmod +x scripts/clean-java-cache.sh
./scripts/clean-java-cache.sh
```

Después de ejecutar el script, abre VS Code de nuevo.

**Consejos para evitar que vuelva a pasar:**
- Después de hacer `git pull`, espera que el Java LS termine de indexar (barra de carga abajo)
- Si cambias de rama, haz `Ctrl+Shift+P` → `Java: Clean Java Language Server Workspace`
- Nunca commits archivos `.classpath`, `.project`, `bin/`, `.settings/` (ya están en `.gitignore`)

### El backend no conecta a MySQL en Docker

1. Verifica que Docker Desktop esté ejecutándose
2. Espera a que el healthcheck de MySQL pase (~30 segundos)
3. Revisa los logs: `docker-compose logs db`


