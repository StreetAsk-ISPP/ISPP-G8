FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# Copiamos el archivo pom.xml y descargamos las dependencias
# Esto ayuda a usar la caché de Docker y acelerar futuras construcciones
COPY pom.xml .
RUN mvn dependency:go-offline

# Copiamos el código fuente y compilamos el proyecto omitiendo los tests por ahora
COPY src ./src
RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copiamos el archivo .jar generado en la etapa anterior
COPY --from=build /app/target/*.jar app.jar

# 1. Creamos un grupo llamado 'appgroup' y un usuario 'appuser' sin privilegios de root.
# (Usamos addgroup y adduser porque Alpine Linux funciona así)
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# 2. Copiamos el archivo .jar generado en la etapa anterior.
# Usamos --chown para que el nuevo usuario sea el dueño del archivo y pueda ejecutarlo.
COPY --chown=appuser:appgroup --from=build /app/target/*.jar app.jar

# 3. Le decimos a Docker que, de aquí en adelante, use nuestro usuario sin privilegios.
USER appuser


EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]