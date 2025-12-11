# Teatro Real - Backend API

API REST para el Sistema de Gestión Interna del Teatro Real, desarrollada con Java 17 y Spring Boot 3.x.

## Tecnologías

- **Java 17** (LTS)
- **Spring Boot 3.3.x**
- **Spring Data JPA** - Persistencia
- **Spring Security** - Autenticación y autorización con JWT
- **PostgreSQL** - Base de datos principal
- **Flyway** - Migraciones de base de datos
- **MapStruct** - Mapeo de DTOs
- **OpenAPI/Swagger** - Documentación de API
- **Maven** - Gestión de dependencias

## Estructura del Proyecto

```
teatro-real-backend/
├── src/
│   ├── main/
│   │   ├── java/com/teatroreal/
│   │   │   ├── config/           # Configuraciones (Security, CORS, etc.)
│   │   │   ├── controller/       # Controladores REST
│   │   │   ├── dto/              # Data Transfer Objects
│   │   │   ├── entity/           # Entidades JPA
│   │   │   ├── exception/        # Excepciones personalizadas
│   │   │   ├── mapper/           # Mappers MapStruct
│   │   │   ├── repository/       # Repositorios JPA
│   │   │   ├── security/         # JWT, filtros de seguridad
│   │   │   ├── service/          # Lógica de negocio
│   │   │   └── TeatroRealApplication.java
│   │   └── resources/
│   │       ├── application.yml
│   │       ├── application-dev.yml
│   │       ├── application-prod.yml
│   │       └── db/migration/     # Scripts Flyway
│   └── test/
│       └── java/com/teatroreal/  # Tests unitarios e integración
├── pom.xml
└── README.md
```

## Módulos Funcionales

### TEMPO (Gestión de Espacios y Calendario)
- `/api/v1/espacios` - CRUD de espacios y salas
- `/api/v1/actividades` - Gestión de actividades (funciones, ensayos, montajes)
- `/api/v1/calendario` - Consultas de calendario y disponibilidad

### TOPS (Gestión de Producciones)
- `/api/v1/producciones` - CRUD de producciones/óperas
- `/api/v1/guiones` - Gestión de guiones técnicos
- `/api/v1/cues` - Gestión de cues dentro de guiones

### Logística
- `/api/v1/logistica` - Operaciones de carga/descarga
- `/api/v1/transportes` - Gestión de transportes

### Sistema
- `/api/v1/auth` - Autenticación (login, refresh token)
- `/api/v1/usuarios` - Gestión de usuarios
- `/api/v1/roles` - Gestión de roles y permisos

## Requisitos Previos

- Java 17+
- Maven 3.9+
- PostgreSQL 15+ o cuenta en Supabase

## Configuración

### Variables de Entorno

```bash
# Base de datos
DB_HOST=localhost
DB_PORT=5432
DB_NAME=teatro_real
DB_USERNAME=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRATION=86400000

# Servidor
SERVER_PORT=8080
```

### application.yml

```yaml
spring:
  datasource:
    url: jdbc:postgresql://${DB_HOST}:${DB_PORT}/${DB_NAME}
    username: ${DB_USERNAME}
    password: ${DB_PASSWORD}
  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: false
  flyway:
    enabled: true

jwt:
  secret: ${JWT_SECRET}
  expiration: ${JWT_EXPIRATION}

server:
  port: ${SERVER_PORT:8080}
```

## Instalación y Ejecución

### Desarrollo

```bash
# Clonar el repositorio
cd teatro-real-backend

# Compilar
./mvnw clean compile

# Ejecutar tests
./mvnw test

# Ejecutar en modo desarrollo
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

### Producción

```bash
# Generar JAR
./mvnw clean package -DskipTests

# Ejecutar JAR
java -jar target/teatro-real-backend-1.0.0.jar --spring.profiles.active=prod
```

## API Documentation

Una vez iniciada la aplicación, la documentación Swagger estará disponible en:

- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **OpenAPI JSON**: http://localhost:8080/v3/api-docs

## Testing

```bash
# Tests unitarios
./mvnw test

# Tests de integración
./mvnw verify

# Cobertura de código
./mvnw jacoco:report
```

## Seguridad

- Autenticación basada en JWT
- Refresh tokens para sesiones prolongadas
- Roles: ADMIN, DIRECTOR_TECNICO, REGIDOR, JEFE_DEPARTAMENTO, COORDINADOR
- CORS configurado para el frontend Angular

## Base de Datos

### Entidades Principales

- `Usuario` - Usuarios del sistema
- `Rol` - Roles y permisos
- `Espacio` - Salas y espacios del teatro
- `Actividad` - Funciones, ensayos, montajes, eventos
- `Produccion` - Óperas y espectáculos
- `Guion` - Guiones técnicos de regiduría
- `Cue` - Indicaciones dentro de un guión
- `OperacionLogistica` - Cargas y descargas

## Contribución

1. Crear rama feature desde `develop`
2. Implementar cambios con tests
3. Crear Pull Request hacia `develop`
4. Code review y merge
