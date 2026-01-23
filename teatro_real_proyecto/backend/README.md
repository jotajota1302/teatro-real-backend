# Backend - Teatro Real TEMPO

Sistema de backend basado en Spring Boot para la gestión integral de funciones, espacios y actividades del Teatro Real.

## Requisitos Previos

- **Java 17+** (JDK)
- **Maven 3.8+**
- **MySQL 8.0+**
- **Git**

## Configuración Inicial

### 1. Crear la Base de Datos

```sql
CREATE DATABASE teatro_real CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Configurar la Conexión a Base de Datos

Editar `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/teatro_real
spring.datasource.username=root
spring.datasource.password=tu_contraseña
```

## Compilación

### Compilar el proyecto

```bash
mvn clean compile
```

### Compilar y empaquetar

```bash
mvn clean package
```

## Ejecución

### Ejecutar con Maven

```bash
mvn spring-boot:run
```

### Ejecutar el JAR generado

```bash
java -jar target/teatro-real-backend-1.0.0.jar
```

## Acceso a la API

Una vez iniciada la aplicación, acceder a:

- **API REST**: http://localhost:8080
- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **OpenAPI JSON**: http://localhost:8080/v3/api-docs

## Estructura del Proyecto

```
src/main/java/com/teatroreal/
├── TeatroRealApplication.java          # Clase principal
├── tempo/
│   ├── domain/
│   │   ├── model/                      # Entidades de dominio
│   │   └── repository/                 # Interfaces de repositorio
│   ├── application/
│   │   ├── dto/                        # Objetos de transferencia de datos
│   │   └── service/                    # Servicios de aplicación
│   └── presentation/
│       └── controller/                 # Controladores REST
└── shared/
    └── infrastructure/
        └── exception/                  # Manejo de excepciones
```

## Endpoints Principales

### Espacios
- `GET /tempo/espacios` - Listar todos los espacios
- `GET /tempo/espacios/{id}` - Obtener un espacio
- `POST /tempo/espacios` - Crear nuevo espacio
- `PUT /tempo/espacios/{id}` - Actualizar espacio
- `DELETE /tempo/espacios/{id}` - Eliminar espacio

### Actividades
- `GET /tempo/actividades` - Listar todas las actividades
- `GET /tempo/actividades/{id}` - Obtener una actividad
- `GET /tempo/actividades/espacio/{espacioId}` - Actividades por espacio
- `POST /tempo/actividades` - Crear nueva actividad
- `PUT /tempo/actividades/{id}/horario` - Modificar horario
- `DELETE /tempo/actividades/{id}` - Eliminar actividad

## Logs y Debugging

Los logs se generan en la consola. Nivel de detalle configurado en `application.properties`:

```properties
logging.level.com.teatroreal=DEBUG
logging.level.org.springframework.web=INFO
```

## Solución de Problemas

### Error de conexión a base de datos

Verificar:
- MySQL está ejecutándose
- Credenciales correctas en `application.properties`
- Base de datos existe

### Puerto 8080 en uso

Cambiar el puerto en `application.properties`:
```properties
server.port=8081
```

### Errores de compilación

```bash
mvn clean install
mvn -U clean compile
```

## Tecnologías Utilizadas

- **Spring Boot 3.x** - Framework web
- **Spring Data JPA** - Persistencia
- **MySQL** - Base de datos
- **Lombok** - Reducción de boilerplate
- **Springdoc OpenAPI** - Documentación automática (Swagger)
- **Maven** - Gestión de dependencias

## Desarrollo

### Crear una nueva entidad

1. Crear clase en `domain/model/`
2. Crear repositorio en `domain/repository/`
3. Crear DTO en `application/dto/`
4. Crear servicio en `application/service/`
5. Crear controlador en `presentation/controller/`

### Agregar nueva dependencia

```bash
mvn dependency:resolve
```

## Contacto

**Teatro Real**
- Sitio web: https://www.teatroreal.es
- Teléfono: +34 91 516 06 06

---

*Última actualización: Diciembre 2025*
