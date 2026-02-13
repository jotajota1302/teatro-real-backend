# ===========================================
# Dockerfile - Teatro Real Backend
# Multi-stage build for Spring Boot
# ===========================================

# Stage 1: Build
FROM maven:3.9-eclipse-temurin-17 AS builder

WORKDIR /app

# Copiar POM primero (cache de dependencias)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copiar codigo fuente
COPY src ./src

# Construir JAR (sin tests para acelerar)
RUN mvn package -DskipTests -B

# Stage 2: Runtime
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Crear usuario no-root
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# Copiar JAR desde builder
COPY --from=builder /app/target/*.jar app.jar

# Puerto (Render usa $PORT)
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s \
  CMD wget -qO- http://localhost:8080/api/health || exit 1

# Ejecutar
ENTRYPOINT ["java", "-jar", "-Dserver.port=${PORT:-8080}", "app.jar"]
