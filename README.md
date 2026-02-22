# ISPP-G8
Aplicación para conocer en tiempo real información relevante sobre eventos en vivo.

## Requisitos

- **Java 21 LTS**
- **Maven 3.6+** (incluido con Maven Wrapper)

## Arrancar el backend

- Compilar:

```powershell
.\mvnw.cmd -DskipTests clean package
```

- Arrancar:

```powershell
.\mvnw.cmd spring-boot:run
```

El servidor estará disponible en `http://localhost:8080`
