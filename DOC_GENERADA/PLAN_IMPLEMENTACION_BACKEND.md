# Teatro Real - Plan de Implementación Backend
## Spring Boot 2.7.18 + Java 8 + PostgreSQL
 
---
**Stack:** Spring Boot 2.7.18 | Java 8 | PostgreSQL 16 (H2 dev) | Maven
**Fecha:** 2025-12-11
**Última actualización:** 2025-12-11

> **Nota:** Se utiliza Java 8 + Spring Boot 2.7.18 por compatibilidad.
> Migración a Java 17+ y Spring Boot 3.x planificada para fase posterior.

---

## 1. Arquitectura del Backend

### 1.1 Estructura del Proyecto

```
teatro-real-backend/
├── pom.xml
├── src/
│   ├── main/
│   │   ├── java/com/teatroreal/
│   │   │   ├── TeatroRealApplication.java
│   │   │   │
│   │   │   ├── config/                    # Configuración
│   │   │   │   ├── SecurityConfig.java
│   │   │   │   ├── OAuth2Config.java
│   │   │   │   ├── CorsConfig.java
│   │   │   │   ├── WebSocketConfig.java
│   │   │   │   └── OpenApiConfig.java
│   │   │   │
│   │   │   ├── domain/                    # Entidades JPA
│   │   │   │   ├── user/
│   │   │   │   │   ├── Usuario.java
│   │   │   │   │   └── Rol.java
│   │   │   │   ├── tempo/
│   │   │   │   │   ├── Actividad.java
│   │   │   │   │   ├── Espacio.java
│   │   │   │   │   ├── TipoActividad.java
│   │   │   │   │   └── Departamento.java
│   │   │   │   └── tops/
│   │   │   │       ├── Guion.java
│   │   │   │       ├── Acto.java
│   │   │   │       ├── Escena.java
│   │   │   │       ├── ElementoGuion.java
│   │   │   │       ├── Top.java
│   │   │   │       └── Adjunto.java
│   │   │   │
│   │   │   ├── repository/                # Repositorios JPA
│   │   │   │   ├── user/
│   │   │   │   ├── tempo/
│   │   │   │   └── tops/
│   │   │   │
│   │   │   ├── service/                   # Lógica de negocio
│   │   │   │   ├── user/
│   │   │   │   │   └── UsuarioService.java
│   │   │   │   ├── tempo/
│   │   │   │   │   ├── ActividadService.java
│   │   │   │   │   ├── EspacioService.java
│   │   │   │   │   └── GoogleCalendarService.java
│   │   │   │   ├── tops/
│   │   │   │   │   ├── GuionService.java
│   │   │   │   │   ├── TopService.java
│   │   │   │   │   └── ExportWordService.java
│   │   │   │   └── notification/
│   │   │   │       └── NotificationService.java
│   │   │   │
│   │   │   ├── controller/                # REST Controllers
│   │   │   │   ├── auth/
│   │   │   │   │   └── AuthController.java
│   │   │   │   ├── tempo/
│   │   │   │   │   ├── ActividadController.java
│   │   │   │   │   ├── EspacioController.java
│   │   │   │   │   └── TipoActividadController.java
│   │   │   │   ├── tops/
│   │   │   │   │   ├── GuionController.java
│   │   │   │   │   ├── ActoController.java
│   │   │   │   │   ├── EscenaController.java
│   │   │   │   │   └── ElementoController.java
│   │   │   │   └── admin/
│   │   │   │       ├── UsuarioController.java
│   │   │   │       └── DepartamentoController.java
│   │   │   │
│   │   │   ├── dto/                       # Data Transfer Objects
│   │   │   │   ├── request/
│   │   │   │   └── response/
│   │   │   │
│   │   │   ├── mapper/                    # MapStruct mappers
│   │   │   │
│   │   │   ├── exception/                 # Manejo de errores
│   │   │   │   ├── GlobalExceptionHandler.java
│   │   │   │   └── BusinessException.java
│   │   │   │
│   │   │   └── util/                      # Utilidades
│   │   │
│   │   └── resources/
│   │       ├── application.yml
│   │       ├── application-dev.yml
│   │       ├── application-prod.yml
│   │       └── db/migration/              # Flyway migrations
│   │           ├── V1__create_users.sql
│   │           ├── V2__create_tempo.sql
│   │           └── V3__create_tops.sql
│   │
│   └── test/
│       └── java/com/teatroreal/
│           ├── controller/
│           ├── service/
│           └── repository/
│
└── docker-compose.yml
```

### 1.2 Dependencias Principales (pom.xml)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0">
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.7.18</version>
    </parent>

    <properties>
        <java.version>1.8</java.version>
        <springdoc.version>1.7.0</springdoc.version>
    </properties>

    <dependencies>
        <!-- Spring Boot Starters (Core) -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>

        <!-- Security (añadir cuando se implemente auth) -->
        <!--
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-oauth2-client</artifactId>
        </dependency>
        -->

        <!-- WebSocket (añadir cuando se implemente tiempo real) -->
        <!--
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-websocket</artifactId>
        </dependency>
        -->

        <!-- Database -->
        <dependency>
            <groupId>org.postgresql</groupId>
            <artifactId>postgresql</artifactId>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>com.h2database</groupId>
            <artifactId>h2</artifactId>
            <scope>runtime</scope>
        </dependency>

        <!-- Google APIs (añadir cuando se implemente integración) -->
        <!--
        <dependency>
            <groupId>com.google.api-client</groupId>
            <artifactId>google-api-client</artifactId>
            <version>2.2.0</version>
        </dependency>
        <dependency>
            <groupId>com.google.apis</groupId>
            <artifactId>google-api-services-calendar</artifactId>
            <version>v3-rev20231123-2.0.0</version>
        </dependency>
        -->

        <!-- Document Generation (añadir cuando se implemente export) -->
        <!--
        <dependency>
            <groupId>org.apache.poi</groupId>
            <artifactId>poi-ooxml</artifactId>
            <version>5.2.5</version>
        </dependency>
        -->

        <!-- Utils -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>

        <!-- API Documentation - Spring Boot 2.7.x compatible -->
        <dependency>
            <groupId>org.springdoc</groupId>
            <artifactId>springdoc-openapi-ui</artifactId>
            <version>${springdoc.version}</version>
        </dependency>

        <!-- DevTools -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-devtools</artifactId>
            <scope>runtime</scope>
            <optional>true</optional>
        </dependency>

        <!-- Testing -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>
</project>
```

> **Importante para Spring Boot 2.7.x:**
> - Usar `springdoc-openapi-ui` (NO `springdoc-openapi-starter-webmvc-ui` que es para Spring Boot 3)
> - Las anotaciones usan `javax.*` (NO `jakarta.*`)
> - Swagger UI disponible en `/swagger-ui.html` o `/swagger-ui/index.html`

---

## 2. Modelo de Datos (Entidades JPA)

### 2.1 Módulo Usuario/Admin

```java
// Usuario.java
// NOTA: En Java 8, usar String para IDs UUID o generarlos manualmente
@Entity
@Table(name = "usuarios")
public class Usuario {
    @Id
    @Column(length = 36)
    private String id;  // UUID como String (Java 8 compatible)

    @PrePersist
    public void generateId() {
        if (id == null) {
            id = java.util.UUID.randomUUID().toString();
        }
    }

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String nombre;

    private String avatarUrl;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "rol_id", nullable = false)
    private Rol rol;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "departamento_id")
    private Departamento departamento;

    @Column(nullable = false)
    private Boolean activo = true;

    private LocalDateTime ultimoAcceso;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    // En Java 8 usamos LocalDateTime que está disponible desde Java 8
}

// Rol.java
@Entity
@Table(name = "roles")
public class Rol {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    @Enumerated(EnumType.STRING)
    private RolNombre nombre; // ADMIN, COLABORADOR, CONSULTA

    private String descripcion;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "rol_permisos")
    private Set<String> permisos;
}

// Departamento.java
@Entity
@Table(name = "departamentos")
public class Departamento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 10)
    private String codigo; // M.E., MAQ., Útil., etc.

    @Column(nullable = false)
    private String nombre;

    private String ambito; // Técnico, Artístico, Operaciones

    private String colorHex;
}
```

### 2.2 Módulo TEMPO

```java
// Espacio.java
@Entity
@Table(name = "espacios")
public class Espacio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoEspacio tipo; // SALA, ALMACEN

    private String googleCalendarId;

    private Integer capacidad;

    private String ubicacion;

    @Column(nullable = false)
    private Boolean activo = true;

    private Integer orden;
}

// TipoActividad.java
@Entity
@Table(name = "tipos_actividad")
public class TipoActividad {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false, length = 7)
    private String colorHex; // #FF5733

    @Enumerated(EnumType.STRING)
    private TipoEspacio aplicaA; // SALA, ALMACEN, AMBOS

    private String descripcion;

    private Integer orden;
}

// Actividad.java
@Entity
@Table(name = "actividades")
public class Actividad {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String titulo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tipo_actividad_id", nullable = false)
    private TipoActividad tipoActividad;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "espacio_id", nullable = false)
    private Espacio espacio;

    @Column(nullable = false)
    private LocalDate fecha;

    @Column(nullable = false)
    private LocalTime horaInicio;

    @Column(nullable = false)
    private LocalTime horaFin;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "departamento_id")
    private Departamento departamento;

    @Column(columnDefinition = "TEXT")
    private String notas;

    // Campos específicos para ALMACEN
    @Enumerated(EnumType.STRING)
    private TipoMovimiento tipoMovimiento; // RECOGIDA, SALIDA

    private Integer numCamiones;
    private String lugarOrigen;
    private String lugarDestino;
    private String produccionNombre;

    // Google Calendar sync
    private String googleEventId;
    private LocalDateTime ultimaSincronizacion;

    // Auditoría
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private Usuario createdBy;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}

// ActividadDocumento.java (para adjuntos)
@Entity
@Table(name = "actividad_documentos")
public class ActividadDocumento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "actividad_id", nullable = false)
    private Actividad actividad;

    @Column(nullable = false)
    private String nombreArchivo;

    @Column(nullable = false)
    private String url;

    private String tipoMime;
    private Long tamanoBytes;
}
```

### 2.3 Módulo TOPS

```java
// Guion.java
@Entity
@Table(name = "guiones")
public class Guion {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String produccionNombre;

    private String compania;
    private String productor;
    private String responsableEdicion;
    private String directorEscena;
    private String directorMusical;

    private Integer version = 1;
    private String versionNombre; // "Pre-ensayo", "Final"

    // Bloqueo de edición
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "locked_by")
    private Usuario lockedBy;

    private LocalDateTime lockedAt;

    @Enumerated(EnumType.STRING)
    private EstadoGuion estado; // BORRADOR, EN_REVISION, FINAL

    @OneToMany(mappedBy = "guion", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("orden ASC")
    private List<Acto> actos = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private Usuario createdBy;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}

// Acto.java
@Entity
@Table(name = "actos")
public class Acto {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "guion_id", nullable = false)
    private Guion guion;

    @Column(nullable = false)
    private Integer numero;

    private String titulo;

    @Column(nullable = false)
    private Integer orden;

    @OneToMany(mappedBy = "acto", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("orden ASC")
    private List<Escena> escenas = new ArrayList<>();
}

// Escena.java
@Entity
@Table(name = "escenas")
public class Escena {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "acto_id", nullable = false)
    private Acto acto;

    private Integer numero;

    private String titulo;

    @Column(nullable = false)
    private Boolean esPasada = false; // true si es sección de preparación

    @Column(nullable = false)
    private Integer orden;

    @OneToMany(mappedBy = "escena", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("orden ASC")
    private List<ElementoGuion> elementos = new ArrayList<>();
}

// ElementoGuion.java
@Entity
@Table(name = "elementos_guion")
public class ElementoGuion {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "escena_id", nullable = false)
    private Escena escena;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoElemento tipo; // TOP, ENTRADA, MUTIS, INTERNO, AVISO, PASADA_ITEM

    @Column(nullable = false)
    private String codigo; // "23", "23.1", "E1", "M1"

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private ElementoGuion parent; // Para sub-TOPs

    // Referencias de partitura
    private Integer refPartituraPagina;
    private Integer refPartituraLinea;
    private String refPartituraCompas;
    private String refTimecode;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(columnDefinition = "TEXT")
    private String observaciones;

    private String lugar; // Para elementos de pasada

    @Column(nullable = false)
    private Integer orden;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "elemento_departamentos",
        joinColumns = @JoinColumn(name = "elemento_id"),
        inverseJoinColumns = @JoinColumn(name = "departamento_id")
    )
    private Set<Departamento> departamentos = new HashSet<>();

    @OneToMany(mappedBy = "elemento", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ElementoAdjunto> adjuntos = new ArrayList<>();
}

// ElementoAdjunto.java
@Entity
@Table(name = "elemento_adjuntos")
public class ElementoAdjunto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "elemento_id", nullable = false)
    private ElementoGuion elemento;

    @Enumerated(EnumType.STRING)
    private TipoAdjunto tipo; // IMAGEN, DOCUMENTO

    @Column(nullable = false)
    private String url;

    @Column(nullable = false)
    private String nombreArchivo;

    private Integer orden;
}

// HistorialCambio.java (Auditoría de guiones)
@Entity
@Table(name = "historial_cambios")
public class HistorialCambio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "guion_id", nullable = false)
    private Guion guion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoAccion accion; // CREAR, MODIFICAR, ELIMINAR, BLOQUEAR, DESBLOQUEAR

    @Column(nullable = false)
    private String entidad; // "Acto", "Escena", "ElementoGuion"

    private String entidadId;

    @Column(columnDefinition = "TEXT")
    private String detalle; // JSON con cambios

    @CreationTimestamp
    private LocalDateTime createdAt;
}
```

---

## 3. Migraciones Flyway

### V1__create_users.sql
```sql
-- Roles
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(20) NOT NULL UNIQUE,
    descripcion TEXT
);

CREATE TABLE rol_permisos (
    rol_id INTEGER REFERENCES roles(id),
    permisos VARCHAR(100),
    PRIMARY KEY (rol_id, permisos)
);

-- Departamentos
CREATE TABLE departamentos (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(10) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    ambito VARCHAR(50),
    color_hex VARCHAR(7)
);

-- Usuarios
CREATE TABLE usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    nombre VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    rol_id INTEGER NOT NULL REFERENCES roles(id),
    departamento_id INTEGER REFERENCES departamentos(id),
    activo BOOLEAN NOT NULL DEFAULT true,
    ultimo_acceso TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Datos iniciales
INSERT INTO roles (nombre, descripcion) VALUES
    ('ADMIN', 'Administrador del sistema'),
    ('COLABORADOR', 'Puede crear y editar contenido'),
    ('CONSULTA', 'Solo lectura');

INSERT INTO departamentos (codigo, nombre, ambito) VALUES
    ('M.E.', 'Mecánica Escénica', 'Técnico'),
    ('MAQ.', 'Maquinaria', 'Técnico'),
    ('Útil.', 'Utilería', 'Técnico'),
    ('Elec.', 'Electricidad', 'Técnico'),
    ('A/V.', 'Audio-Visuales', 'Técnico'),
    ('Sast.', 'Sastrería', 'Artístico'),
    ('Carac.', 'Caracterización', 'Artístico'),
    ('Log.', 'Logística', 'Operaciones');
```

### V2__create_tempo.sql
```sql
-- Espacios
CREATE TABLE espacios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    tipo VARCHAR(20) NOT NULL, -- SALA, ALMACEN
    google_calendar_id VARCHAR(255),
    capacidad INTEGER,
    ubicacion VARCHAR(255),
    activo BOOLEAN NOT NULL DEFAULT true,
    orden INTEGER
);

-- Tipos de actividad
CREATE TABLE tipos_actividad (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    color_hex VARCHAR(7) NOT NULL,
    aplica_a VARCHAR(20), -- SALA, ALMACEN, AMBOS
    descripcion TEXT,
    orden INTEGER
);

-- Actividades
CREATE TABLE actividades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    titulo VARCHAR(255) NOT NULL,
    tipo_actividad_id INTEGER NOT NULL REFERENCES tipos_actividad(id),
    espacio_id INTEGER NOT NULL REFERENCES espacios(id),
    fecha DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    departamento_id INTEGER REFERENCES departamentos(id),
    notas TEXT,
    -- Campos almacén
    tipo_movimiento VARCHAR(20),
    num_camiones INTEGER,
    lugar_origen VARCHAR(255),
    lugar_destino VARCHAR(255),
    produccion_nombre VARCHAR(255),
    -- Google Calendar
    google_event_id VARCHAR(255),
    ultima_sincronizacion TIMESTAMP,
    -- Auditoría
    created_by UUID REFERENCES usuarios(id),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_actividades_fecha ON actividades(fecha);
CREATE INDEX idx_actividades_espacio ON actividades(espacio_id);
CREATE INDEX idx_actividades_tipo ON actividades(tipo_actividad_id);

-- Documentos de actividad
CREATE TABLE actividad_documentos (
    id SERIAL PRIMARY KEY,
    actividad_id UUID NOT NULL REFERENCES actividades(id) ON DELETE CASCADE,
    nombre_archivo VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    tipo_mime VARCHAR(100),
    tamano_bytes BIGINT
);

-- Datos iniciales: Espacios
INSERT INTO espacios (nombre, tipo, orden) VALUES
    ('Sala Principal - Escenario', 'SALA', 1),
    ('Sala S.E.P.E.', 'SALA', 2),
    ('Sala de Ballet', 'SALA', 3),
    ('Sala de Orquesta', 'SALA', 4),
    ('Sala Gayarre', 'SALA', 5),
    ('Sala del Coro', 'SALA', 6),
    ('Salón de Baile', 'SALA', 7),
    ('Arganda-Campa', 'ALMACEN', 20),
    ('Arganda-Nave', 'ALMACEN', 21);

-- Datos iniciales: Tipos de actividad (Salas)
INSERT INTO tipos_actividad (nombre, color_hex, aplica_a, orden) VALUES
    ('Función', '#0000FF', 'SALA', 1),
    ('Ensayo', '#008000', 'SALA', 2),
    ('Montaje', '#FA8072', 'SALA', 3),
    ('Pauta técnica', '#808080', 'SALA', 4),
    ('Cargas y descargas', '#FFFF00', 'SALA', 5),
    ('Eventos', '#FF1493', 'SALA', 6),
    ('Cursos', '#FFC0CB', 'SALA', 7),
    ('Visitas', '#800080', 'SALA', 8),
    ('Nocturnas', '#FFA500', 'SALA', 9),
    ('Rueda de prensa', '#FF0000', 'SALA', 10),
    ('Flamenco Real', '#DDA0DD', 'SALA', 11),
    ('Actividad escenario', '#FFFFFF', 'SALA', 12),
    -- Almacenes
    ('Recogida', '#008000', 'ALMACEN', 20),
    ('Salida', '#FFC0CB', 'ALMACEN', 21);
```

### V3__create_tops.sql
```sql
-- Guiones
CREATE TABLE guiones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    produccion_nombre VARCHAR(255) NOT NULL,
    compania VARCHAR(255),
    productor VARCHAR(255),
    responsable_edicion VARCHAR(255),
    director_escena VARCHAR(255),
    director_musical VARCHAR(255),
    version INTEGER NOT NULL DEFAULT 1,
    version_nombre VARCHAR(100),
    locked_by UUID REFERENCES usuarios(id),
    locked_at TIMESTAMP,
    estado VARCHAR(20) NOT NULL DEFAULT 'BORRADOR',
    created_by UUID REFERENCES usuarios(id),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Actos
CREATE TABLE actos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guion_id UUID NOT NULL REFERENCES guiones(id) ON DELETE CASCADE,
    numero INTEGER NOT NULL,
    titulo VARCHAR(255),
    orden INTEGER NOT NULL
);

CREATE INDEX idx_actos_guion ON actos(guion_id);

-- Escenas
CREATE TABLE escenas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    acto_id UUID NOT NULL REFERENCES actos(id) ON DELETE CASCADE,
    numero INTEGER,
    titulo VARCHAR(255),
    es_pasada BOOLEAN NOT NULL DEFAULT false,
    orden INTEGER NOT NULL
);

CREATE INDEX idx_escenas_acto ON escenas(acto_id);

-- Elementos del guion (TOPs, Entradas, Mutis, etc.)
CREATE TABLE elementos_guion (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    escena_id UUID NOT NULL REFERENCES escenas(id) ON DELETE CASCADE,
    tipo VARCHAR(20) NOT NULL, -- TOP, ENTRADA, MUTIS, INTERNO, AVISO, PASADA_ITEM
    codigo VARCHAR(20) NOT NULL,
    parent_id UUID REFERENCES elementos_guion(id),
    ref_partitura_pagina INTEGER,
    ref_partitura_linea INTEGER,
    ref_partitura_compas VARCHAR(50),
    ref_timecode VARCHAR(20),
    descripcion TEXT,
    observaciones TEXT,
    lugar VARCHAR(100),
    orden INTEGER NOT NULL
);

CREATE INDEX idx_elementos_escena ON elementos_guion(escena_id);
CREATE INDEX idx_elementos_tipo ON elementos_guion(tipo);

-- Relación elementos-departamentos
CREATE TABLE elemento_departamentos (
    elemento_id UUID NOT NULL REFERENCES elementos_guion(id) ON DELETE CASCADE,
    departamento_id INTEGER NOT NULL REFERENCES departamentos(id),
    PRIMARY KEY (elemento_id, departamento_id)
);

-- Adjuntos de elementos
CREATE TABLE elemento_adjuntos (
    id SERIAL PRIMARY KEY,
    elemento_id UUID NOT NULL REFERENCES elementos_guion(id) ON DELETE CASCADE,
    tipo VARCHAR(20) NOT NULL, -- IMAGEN, DOCUMENTO
    url TEXT NOT NULL,
    nombre_archivo VARCHAR(255) NOT NULL,
    orden INTEGER
);

-- Historial de cambios
CREATE TABLE historial_cambios (
    id SERIAL PRIMARY KEY,
    guion_id UUID NOT NULL REFERENCES guiones(id) ON DELETE CASCADE,
    usuario_id UUID NOT NULL REFERENCES usuarios(id),
    accion VARCHAR(20) NOT NULL,
    entidad VARCHAR(50) NOT NULL,
    entidad_id VARCHAR(50),
    detalle TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_historial_guion ON historial_cambios(guion_id);
```

---

## 4. API REST - Endpoints

### 4.1 Autenticación
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/auth/google` | Iniciar OAuth con Google |
| GET | `/api/auth/google/callback` | Callback OAuth |
| GET | `/api/auth/me` | Usuario actual |
| POST | `/api/auth/logout` | Cerrar sesión |

### 4.2 TEMPO - Actividades
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/actividades` | Listar (filtros: espacio, fecha, tipo) |
| GET | `/api/actividades/{id}` | Detalle |
| POST | `/api/actividades` | Crear |
| PUT | `/api/actividades/{id}` | Actualizar |
| DELETE | `/api/actividades/{id}` | Eliminar |
| GET | `/api/actividades/calendario` | Vista calendario (rango fechas) |
| POST | `/api/actividades/import` | Importar CSV/Excel |
| GET | `/api/actividades/export` | Exportar CSV/Excel |

### 4.3 TEMPO - Configuración
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/espacios` | Listar espacios |
| POST | `/api/espacios` | Crear |
| PUT | `/api/espacios/{id}` | Actualizar |
| DELETE | `/api/espacios/{id}` | Eliminar |
| GET | `/api/tipos-actividad` | Listar tipos |
| POST | `/api/tipos-actividad` | Crear |
| PUT | `/api/tipos-actividad/{id}` | Actualizar |
| DELETE | `/api/tipos-actividad/{id}` | Eliminar |

### 4.4 TOPS - Guiones
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/guiones` | Listar guiones |
| GET | `/api/guiones/{id}` | Detalle completo (con actos, escenas, elementos) |
| POST | `/api/guiones` | Crear |
| PUT | `/api/guiones/{id}` | Actualizar metadata |
| DELETE | `/api/guiones/{id}` | Eliminar |
| POST | `/api/guiones/{id}/lock` | Bloquear para edición |
| POST | `/api/guiones/{id}/unlock` | Desbloquear |
| GET | `/api/guiones/{id}/historial` | Historial de cambios |
| GET | `/api/guiones/{id}/export` | Exportar a Word |

### 4.5 TOPS - Estructura del Guion
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/guiones/{id}/actos` | Crear acto |
| PUT | `/api/actos/{id}` | Actualizar acto |
| DELETE | `/api/actos/{id}` | Eliminar acto |
| POST | `/api/actos/{id}/escenas` | Crear escena |
| PUT | `/api/escenas/{id}` | Actualizar escena |
| DELETE | `/api/escenas/{id}` | Eliminar escena |
| POST | `/api/escenas/{id}/elementos` | Crear elemento |
| PUT | `/api/elementos/{id}` | Actualizar elemento |
| DELETE | `/api/elementos/{id}` | Eliminar elemento |
| POST | `/api/elementos/{id}/adjuntos` | Subir adjunto |
| PUT | `/api/guiones/{id}/reordenar` | Reordenar elementos (drag & drop) |

### 4.6 TOPS - Vistas
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/guiones/{id}/vista/completa` | Vista global |
| GET | `/api/guiones/{id}/vista/tops` | Solo TOPs |
| GET | `/api/guiones/{id}/vista/departamento/{codigo}` | Por departamento |

### 4.7 Admin
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/usuarios` | Listar usuarios |
| POST | `/api/usuarios` | Crear usuario |
| PUT | `/api/usuarios/{id}` | Actualizar |
| DELETE | `/api/usuarios/{id}` | Eliminar/Desactivar |
| GET | `/api/departamentos` | Listar departamentos |
| POST | `/api/departamentos` | Crear |
| PUT | `/api/departamentos/{id}` | Actualizar |

---

## 5. Servicios Clave

### 5.1 GoogleCalendarService
```java
@Service
@RequiredArgsConstructor
public class GoogleCalendarService {

    private final Calendar calendarClient;

    public String createEvent(Actividad actividad) {
        Event event = new Event()
            .setSummary(actividad.getTitulo())
            .setDescription(actividad.getNotas())
            .setColorId(getColorId(actividad.getTipoActividad()));

        DateTime startDateTime = toGoogleDateTime(actividad.getFecha(), actividad.getHoraInicio());
        DateTime endDateTime = toGoogleDateTime(actividad.getFecha(), actividad.getHoraFin());

        event.setStart(new EventDateTime().setDateTime(startDateTime));
        event.setEnd(new EventDateTime().setDateTime(endDateTime));

        String calendarId = actividad.getEspacio().getGoogleCalendarId();
        Event created = calendarClient.events().insert(calendarId, event).execute();

        return created.getId();
    }

    public void updateEvent(Actividad actividad) { ... }
    public void deleteEvent(Actividad actividad) { ... }
    public void syncFromGoogle(Espacio espacio) { ... }
}
```

### 5.2 ExportWordService
```java
@Service
public class ExportWordService {

    public byte[] exportGuion(Guion guion, ExportOptions options) {
        XWPFDocument document = new XWPFDocument();

        // Encabezado
        addHeader(document, guion);

        // Por cada acto
        for (Acto acto : guion.getActos()) {
            addActoHeader(document, acto);

            for (Escena escena : acto.getEscenas()) {
                if (escena.getEsPasada()) {
                    addPasadaTable(document, escena);
                } else {
                    addEscenaSection(document, escena, options);
                }
            }
        }

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        document.write(out);
        return out.toByteArray();
    }
}
```

### 5.3 NotificationService
```java
@Service
@RequiredArgsConstructor
public class NotificationService {

    private final JavaMailSender mailSender;
    private final SimpMessagingTemplate websocket;

    public void notifyActividadCreada(Actividad actividad) {
        // Email a jefes de departamento
        List<Usuario> jefes = getJefesDepartamento(actividad.getDepartamento());
        for (Usuario jefe : jefes) {
            sendEmail(jefe.getEmail(), "Nueva actividad: " + actividad.getTitulo(), ...);
        }

        // WebSocket para actualización en tiempo real
        websocket.convertAndSend("/topic/actividades",
            new ActividadEvent("CREATED", actividad.getId()));
    }

    public void notifyActividadModificada(Actividad actividad, List<String> cambios) { ... }
    public void notifyGuionBloqueado(Guion guion, Usuario usuario) { ... }
}
```

---

## 6. Seguridad

### 6.1 SecurityConfig
```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/carteleria/**").permitAll()
                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/**").hasAnyRole("ADMIN", "COLABORADOR", "CONSULTA")
                .requestMatchers(HttpMethod.POST, "/api/**").hasAnyRole("ADMIN", "COLABORADOR")
                .requestMatchers(HttpMethod.PUT, "/api/**").hasAnyRole("ADMIN", "COLABORADOR")
                .requestMatchers(HttpMethod.DELETE, "/api/**").hasAnyRole("ADMIN", "COLABORADOR")
                .requestMatchers("/api/usuarios/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .oauth2Login(oauth2 -> oauth2
                .successHandler(oAuth2SuccessHandler)
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
```

---

## 7. Plan de Desarrollo Backend

### Sprint 1: Setup + Auth (1 semana)
| Tarea | Horas |
|-------|-------|
| Configurar proyecto Spring Boot + Maven | 4h |
| Configurar PostgreSQL + Flyway | 4h |
| Implementar migraciones V1 (usuarios) | 4h |
| Implementar OAuth2 con Google | 8h |
| JWT + SecurityConfig | 6h |
| Tests de autenticación | 4h |
| **Total Sprint 1** | **30h** |

### Sprint 2: Módulo TEMPO (1.5 semanas)
| Tarea | Horas |
|-------|-------|
| Migraciones V2 (tempo) | 4h |
| Entidades + Repositorios TEMPO | 6h |
| CRUD Espacios | 4h |
| CRUD Tipos Actividad | 4h |
| CRUD Actividades | 8h |
| Filtros y búsqueda actividades | 6h |
| Vista calendario (endpoint) | 4h |
| Integración Google Calendar básica | 12h |
| Tests TEMPO | 6h |
| **Total Sprint 2** | **54h** |

### Sprint 3: Módulo TOPS (2 semanas)
| Tarea | Horas |
|-------|-------|
| Migraciones V3 (tops) | 6h |
| Entidades + Repositorios TOPS | 8h |
| CRUD Guiones | 6h |
| CRUD Actos/Escenas | 8h |
| CRUD Elementos (TOPs, etc.) | 10h |
| Bloqueo de edición | 6h |
| Historial de cambios | 6h |
| Vistas (completa, tops, departamento) | 8h |
| Reordenar elementos (drag & drop API) | 4h |
| Tests TOPS | 8h |
| **Total Sprint 3** | **70h** |

### Sprint 4: Integraciones + Exportación (1 semana)
| Tarea | Horas |
|-------|-------|
| Google Calendar sync completo | 12h |
| Exportación Word (guiones) | 10h |
| Sistema de notificaciones (email) | 6h |
| WebSocket para updates en tiempo real | 6h |
| Tests de integración | 6h |
| **Total Sprint 4** | **40h** |

### Sprint 5: Polish + Deploy (1 semana)
| Tarea | Horas |
|-------|-------|
| Documentación OpenAPI/Swagger | 4h |
| Validaciones y manejo de errores | 6h |
| Optimización de queries | 4h |
| Docker + docker-compose | 4h |
| Configuración para producción | 4h |
| Tests E2E | 6h |
| **Total Sprint 5** | **28h** |

---

## 8. Resumen de Estimación Backend

| Fase | Horas |
|------|-------|
| Sprint 1: Setup + Auth | 30h |
| Sprint 2: TEMPO | 54h |
| Sprint 3: TOPS | 70h |
| Sprint 4: Integraciones | 40h |
| Sprint 5: Polish + Deploy | 28h |
| **TOTAL BACKEND** | **222h** |

---

## 9. Comandos de Desarrollo

```bash
# Ejecutar aplicación (Windows)
cd teatro-real-backend
mvnw.cmd spring-boot:run

# Ejecutar aplicación (Linux/Mac)
./mvnw spring-boot:run

# Ejecutar tests
mvnw.cmd test

# Build para producción
mvnw.cmd clean package -DskipTests

# El jar generado estará en target/teatro-real-backend-1.0.0-SNAPSHOT.jar
java -jar target/teatro-real-backend-1.0.0-SNAPSHOT.jar
```

### URLs de Desarrollo
| Servicio | URL |
|----------|-----|
| API REST | http://localhost:8080/api |
| Swagger UI | http://localhost:8080/swagger-ui.html |
| OpenAPI JSON | http://localhost:8080/v3/api-docs |
| H2 Console | http://localhost:8080/h2-console |
| Actuator Health | http://localhost:8080/actuator/health |

### Credenciales H2 (Desarrollo)
```
JDBC URL: jdbc:h2:mem:teatroreal
Usuario: sa
Password: (vacío)
```

---

---

## 10. Diferencias con Spring Boot 3.x (para futura migración)

| Aspecto | Spring Boot 2.7.x (Actual) | Spring Boot 3.x (Futuro) |
|---------|---------------------------|--------------------------|
| Java mínimo | Java 8 | Java 17 |
| Paquetes | `javax.*` | `jakarta.*` |
| SpringDoc | `springdoc-openapi-ui` 1.x | `springdoc-openapi-starter-webmvc-ui` 2.x |
| URL Swagger | `/swagger-ui.html` | `/swagger-ui/index.html` |
| Hibernate | 5.x | 6.x |
| Spring Security | 5.x | 6.x |

### Pasos para migrar a Spring Boot 3:
1. Actualizar Java a 17+
2. Cambiar `javax.*` → `jakarta.*` en imports
3. Actualizar `springdoc-openapi` a versión 2.x
4. Revisar configuración de Security
5. Actualizar dependencias de terceros

---

*Plan de Implementación Backend - Teatro Real*
*Spring Boot 2.7.18 + Java 8 + PostgreSQL*
*Fecha: 2025-12-11*
