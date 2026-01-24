# CONTEXTO BACKEND - Teatro Real

> Documento de referencia para agentes de codificación. Spring Boot 3.3 + Java 17 + JWT.

## Stack Tecnológico

| Tecnología | Versión | Uso |
|------------|---------|-----|
| Java | 17 | Lenguaje |
| Spring Boot | 3.3.0 | Framework |
| Spring Security | 6.x | Autenticación JWT |
| Spring Data JPA | 3.x | Persistencia |
| Hibernate | 6.5 | ORM |
| H2 | 2.2 | BD desarrollo (file-based) |
| PostgreSQL | 16 | BD producción |
| Flyway | 9.x | Migraciones |
| Lombok | 1.18 | Reducción boilerplate |
| SpringDoc OpenAPI | 2.x | Documentación Swagger |

## Estructura de Carpetas

```
src/main/java/com/teatroreal/
├── config/                  # Configuración (SecurityConfig)
├── controller/              # REST Controllers
│   ├── auth/               # AuthController
│   ├── tempo/              # Actividad, Espacio, TipoActividad, etc.
│   ├── tops/               # Acto, Escena, ElementoGuion
│   └── admin/              # Controllers admin
├── domain/                  # Entidades JPA
│   ├── tempo/              # Actividad, Espacio, TipoActividad, Temporada
│   ├── tops/               # Guion, Acto, Escena, ElementoGuion
│   └── user/               # Usuario, Rol, PermisoModulo
├── dto/                     # Data Transfer Objects
│   ├── request/            # ActividadRequest, EspacioRequest, etc.
│   └── response/           # ActividadResponse, ApiResponse, etc.
├── repository/              # JPA Repositories
│   ├── tempo/              # ActividadRepository, etc.
│   └── tops/               # GuionRepository, etc.
├── security/                # JWT (JwtUtil, JwtAuthFilter)
└── service/                 # Lógica de negocio
    ├── tempo/              # ActividadService, EspacioService, etc.
    └── tops/               # GuionService, etc.

src/main/resources/
├── application.properties   # Configuración
└── db/migration/           # Flyway SQL (V1__, V2__, etc.)
```

## Patrón Controller → Service → Repository

```
HTTP Request
    ↓
@RestController (valida con @Valid)
    ↓
@Service @Transactional (lógica de negocio)
    ↓
@Repository extends JpaRepository (persistencia)
    ↓
Entity JPA → Base de datos
    ↓
Response DTO → JSON
```

## Convenciones de Código

### Naming

| Tipo | Convención | Ejemplo |
|------|-----------|---------|
| Controllers | `{Entidad}Controller` | `ActividadController` |
| Services | `{Entidad}Service` | `ActividadService` |
| Repositories | `{Entidad}Repository` | `ActividadRepository` |
| Entities | `{Entidad}` (singular) | `Actividad` |
| Request DTOs | `{Entidad}Request` | `ActividadRequest` |
| Response DTOs | `{Entidad}Response` | `ActividadResponse` |

### Anotaciones Principales

```java
// Controllers
@RestController
@RequestMapping("/api/actividades")
@RequiredArgsConstructor

// Métodos HTTP
@GetMapping, @PostMapping, @PutMapping, @DeleteMapping
@GetMapping("/{id}")
@PostMapping("/{id}/clone")

// Parámetros
@PathVariable String id
@RequestParam(required = false) String filtro
@Valid @RequestBody ActividadRequest request

// Services
@Service
@Transactional
@RequiredArgsConstructor

// Entities
@Entity
@Table(name = "actividades")
@Getter @Setter
```

## Controller Típico

```java
@RestController
@RequestMapping("/api/actividades")
@RequiredArgsConstructor
public class ActividadController {
    private final ActividadService actividadService;

    @GetMapping
    public ResponseEntity<List<ActividadResponse>> getAll() {
        return ResponseEntity.ok(actividadService.findAll());
    }

    @GetMapping("/search")
    public ResponseEntity<List<ActividadResponse>> search(
        @RequestParam(required = false) String espacioId,
        @RequestParam(required = false) String tipoActividadId,
        @RequestParam(required = false) String fechaInicio,
        @RequestParam(required = false) String fechaFin
    ) {
        return ResponseEntity.ok(actividadService.search(espacioId, tipoActividadId, fechaInicio, fechaFin));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ActividadResponse> getById(@PathVariable String id) {
        return ResponseEntity.ok(actividadService.findById(id));
    }

    @PostMapping
    public ResponseEntity<ActividadResponse> create(@Valid @RequestBody ActividadRequest request) {
        return ResponseEntity.status(201).body(actividadService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ActividadResponse> update(
        @PathVariable String id,
        @Valid @RequestBody ActividadRequest request
    ) {
        return ResponseEntity.ok(actividadService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        actividadService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
```

## Service Típico

```java
@Service
@RequiredArgsConstructor
@Transactional
public class ActividadService {
    private final ActividadRepository actividadRepository;
    private final EspacioRepository espacioRepository;
    private final TipoActividadRepository tipoActividadRepository;

    public List<ActividadResponse> findAll() {
        return actividadRepository.findAll().stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
    }

    public ActividadResponse findById(String id) {
        Actividad actividad = actividadRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Actividad no encontrada: " + id));
        return toResponse(actividad);
    }

    public ActividadResponse create(ActividadRequest request) {
        // 1. Validar entidades relacionadas
        TipoActividad tipo = tipoActividadRepository.findById(request.getTipoActividadId())
            .orElseThrow(() -> new EntityNotFoundException("TipoActividad no encontrado"));
        Espacio espacio = espacioRepository.findById(Long.valueOf(request.getEspacioId()))
            .orElseThrow(() -> new EntityNotFoundException("Espacio no encontrado"));

        // 2. Mapear request → entity
        Actividad actividad = new Actividad();
        actividad.setTitulo(request.getTitulo());
        actividad.setFecha(LocalDate.parse(request.getFecha()));
        actividad.setHoraInicio(LocalTime.parse(request.getHoraInicio()));
        actividad.setTipoActividad(tipo);
        actividad.setEspacio(espacio);
        actividad.setEstado(Actividad.EstadoActividad.PENDIENTE);

        // 3. Persistir y retornar
        return toResponse(actividadRepository.save(actividad));
    }

    public ActividadResponse update(String id, ActividadRequest request) {
        Actividad actividad = actividadRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Actividad no encontrada"));

        // Actualizar campos
        actividad.setTitulo(request.getTitulo());
        actividad.setFecha(LocalDate.parse(request.getFecha()));
        // ... más campos

        return toResponse(actividadRepository.save(actividad));
    }

    public void delete(String id) {
        if (!actividadRepository.existsById(id)) {
            throw new EntityNotFoundException("Actividad no encontrada: " + id);
        }
        actividadRepository.deleteById(id);
    }

    // Método privado reutilizable para mapear entity → response
    private ActividadResponse toResponse(Actividad a) {
        return ActividadResponse.builder()
            .id(a.getId())
            .titulo(a.getTitulo())
            .fecha(a.getFecha().toString())
            .horaInicio(a.getHoraInicio().toString())
            .tipoActividad(a.getTipoActividad() != null
                ? ActividadResponse.TipoActividadInfo.builder()
                    .id(a.getTipoActividad().getId())
                    .nombre(a.getTipoActividad().getNombre())
                    .colorHex(a.getTipoActividad().getColorHex())
                    .build()
                : null)
            .espacio(a.getEspacio() != null
                ? ActividadResponse.EspacioInfo.builder()
                    .id(String.valueOf(a.getEspacio().getId()))
                    .nombre(a.getEspacio().getNombre())
                    .build()
                : null)
            .build();
    }
}
```

## Entity Típica

```java
@Entity
@Table(name = "actividades")
@Getter @Setter
public class Actividad {

    @Id
    private String id;

    @PrePersist
    public void generateId() {
        if (this.id == null) {
            this.id = UUID.randomUUID().toString();
        }
    }

    @NotBlank
    @Column(nullable = false, length = 255)
    private String titulo;

    @NotNull
    @Column(nullable = false)
    private LocalDate fecha;

    @NotNull
    @Column(nullable = false)
    private LocalTime horaInicio;

    private LocalTime horaFin;

    @Column(length = 1000)
    private String descripcion;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoActividad estado = EstadoActividad.PENDIENTE;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tipo_actividad_id")
    private TipoActividad tipoActividad;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "espacio_id")
    private Espacio espacio;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "temporada_id")
    private Temporada temporada;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public enum EstadoActividad {
        PENDIENTE, EN_TRANSITO, COMPLETADO
    }
}
```

## DTOs

### Request DTO (con validaciones)

```java
@Getter @Setter
public class ActividadRequest {

    @NotBlank(message = "El título es obligatorio")
    @Size(max = 255)
    private String titulo;

    @NotNull(message = "La fecha es obligatoria")
    private String fecha;  // ISO: yyyy-MM-dd

    @NotNull(message = "La hora de inicio es obligatoria")
    private String horaInicio;  // ISO: HH:mm

    private String horaFin;

    @Size(max = 1000)
    private String descripcion;

    @NotNull
    private String tipoActividadId;

    @NotNull
    private String espacioId;

    private String temporadaId;
}
```

### Response DTO (con Builder)

```java
@Getter @Setter
@Builder
public class ActividadResponse {
    private String id;
    private String titulo;
    private String fecha;
    private String horaInicio;
    private String horaFin;
    private String descripcion;
    private String estado;
    private TipoActividadInfo tipoActividad;
    private EspacioInfo espacio;

    @Getter @Setter @Builder
    public static class TipoActividadInfo {
        private String id;
        private String nombre;
        private String colorHex;
    }

    @Getter @Setter @Builder
    public static class EspacioInfo {
        private String id;
        private String nombre;
    }
}
```

### ApiResponse Genérico

```java
@Getter @Setter
@Builder
public class ApiResponse<T> {
    private boolean success;
    private String message;
    private LocalDateTime timestamp;
    private T data;

    public static <T> ApiResponse<T> success(T data) {
        return ApiResponse.<T>builder()
            .success(true)
            .data(data)
            .timestamp(LocalDateTime.now())
            .build();
    }

    public static <T> ApiResponse<T> failure(String message) {
        return ApiResponse.<T>builder()
            .success(false)
            .message(message)
            .timestamp(LocalDateTime.now())
            .build();
    }
}
```

## Repository

```java
@Repository
public interface ActividadRepository extends JpaRepository<Actividad, String> {

    List<Actividad> findByEspacioId(Long espacioId);

    List<Actividad> findByTipoActividadId(String tipoActividadId);

    List<Actividad> findByFechaBetween(LocalDate inicio, LocalDate fin);

    @Query("SELECT a FROM Actividad a WHERE a.espacio.id = :espacioId AND a.fecha = :fecha")
    List<Actividad> findByEspacioAndFecha(@Param("espacioId") Long espacioId, @Param("fecha") LocalDate fecha);
}
```

## Autenticación JWT

### JwtUtil

```java
@Component
public class JwtUtil {
    private final String jwtSecret = "teatro-real-secret-key";
    private final long jwtExpirationMs = 86400000; // 24h

    public String generateToken(String userId, String email) {
        return Jwts.builder()
            .setSubject(userId)
            .claim("email", email)
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
            .signWith(SignatureAlgorithm.HS512, jwtSecret)
            .compact();
    }

    public boolean validateJwtToken(String token) { ... }
    public String getUserIdFromJwtToken(String token) { ... }
}
```

### JwtAuthFilter

```java
public class JwtAuthFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(HttpServletRequest request, ...) {
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            if (jwtUtil.validateJwtToken(token)) {
                String userId = jwtUtil.getUserIdFromJwtToken(token);
                // Establecer SecurityContext
            }
        }
        filterChain.doFilter(request, response);
    }
}
```

### SecurityConfig

```java
@Configuration
public class SecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, JwtAuthFilter jwtAuthFilter) {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> {})
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth.anyRequest().permitAll());
        http.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}
```

## Endpoints REST

### Patrón URI

```
GET    /api/{entidad}              → Listar todos
GET    /api/{entidad}/search?...   → Buscar con filtros
GET    /api/{entidad}/{id}         → Obtener por ID
POST   /api/{entidad}              → Crear
PUT    /api/{entidad}/{id}         → Actualizar
DELETE /api/{entidad}/{id}         → Eliminar
POST   /api/{entidad}/{id}/action  → Acción específica
```

### Códigos HTTP

| Código | Uso |
|--------|-----|
| 200 | GET, PUT exitoso |
| 201 | POST exitoso |
| 204 | DELETE exitoso |
| 400 | Validación fallida |
| 404 | Entidad no encontrada |
| 500 | Error interno |

## Validaciones

### En DTOs (anotaciones Jakarta)

```java
@NotBlank(message = "Campo obligatorio")
@NotNull
@Size(min = 1, max = 255)
@Min(0)
@Email
```

### En Services (lógica)

```java
// Validar FK existe
Entity entity = repository.findById(id)
    .orElseThrow(() -> new EntityNotFoundException("No encontrado: " + id));

// Validar reglas de negocio
if (!condicion) {
    throw new IllegalArgumentException("Mensaje de error");
}
```

## Migraciones Flyway

```
src/main/resources/db/migration/
├── V1__schema.sql              # Creación de tablas
├── V2__seed.sql                # Datos iniciales (roles, admin)
├── V3__seed_espacios.sql       # Catálogos
└── V4__seed_actividades.sql    # Datos de ejemplo
```

Ejecutadas automáticamente al arrancar.

## Configuración (application.properties)

```properties
# Base de datos H2 (desarrollo)
spring.datasource.url=jdbc:h2:file:./data/teatroreal
spring.datasource.username=sa
spring.datasource.password=

# Flyway
spring.flyway.enabled=true
spring.flyway.locations=classpath:db/migration

# JPA
spring.jpa.hibernate.ddl-auto=none
spring.jpa.show-sql=false

# JWT
jwt.secret=teatro-real-secret-key
jwt.expiration=86400000

# Servidor
server.port=8080
```

## Comandos de Desarrollo

```bash
# Windows
cd teatro-real-backend
build.bat spring-boot:run    # Arranca servidor
build.bat test               # Ejecuta tests
build.bat install            # Compila

# URLs
http://localhost:8080/api          # API REST
http://localhost:8080/swagger-ui.html  # Documentación
http://localhost:8080/h2-console   # Consola BD (user: sa, pass: vacío)
```

## Módulos Implementados

| Módulo | Controllers | Services | Estado |
|--------|-------------|----------|--------|
| Auth | AuthController | - | 80% |
| TEMPO | Actividad, Espacio, TipoActividad, Temporada, Departamento | Completos | 95% |
| TOPS | Acto, Escena, ElementoGuion | Parcial (falta GuionService) | 40% |
| Admin | Espacio, TipoActividad | Básicos | 20% |
