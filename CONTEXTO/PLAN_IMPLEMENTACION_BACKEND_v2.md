# Teatro Real - Plan de Implementación Backend v2
## Spring Boot 2.7.18 + Java 8 + PostgreSQL

---
**Stack:** Spring Boot 2.7.18 | Java 8 | PostgreSQL 16 (H2 dev) | Maven
**Fecha:** 2025-01-13
**Versión:** 2.0 (actualizado con requisitos v1.3)

> **Changelog v2:**
> - Nuevos campos en entidades (temporada, descripcion, estado, etc.)
> - Nuevos roles: GESTOR, OPERADOR, VISUALIZADOR
> - Flujo de estados para actividades de almacén
> - Integración con Drive intranet
> - Sistema de notificaciones
> - Endpoints adicionales (clone, signage, notifications)

---

## 1. Arquitectura del Backend

### 1.1 Estructura del Proyecto (Actualizada v2)

```
teatro-real-backend/
├── pom.xml
├── src/
│   ├── main/
│   │   ├── java/com/teatroreal/
│   │   │   ├── TeatroRealApplication.java
│   │   │   │
│   │   │   ├── config/
│   │   │   │   ├── SecurityConfig.java
│   │   │   │   ├── OAuth2Config.java
│   │   │   │   ├── CorsConfig.java
│   │   │   │   ├── WebSocketConfig.java
│   │   │   │   └── OpenApiConfig.java
│   │   │   │
│   │   │   ├── domain/
│   │   │   │   ├── user/
│   │   │   │   │   ├── Usuario.java
│   │   │   │   │   ├── Rol.java
│   │   │   │   │   └── PermisoModulo.java          ← NUEVO v2
│   │   │   │   ├── tempo/
│   │   │   │   │   ├── Actividad.java              ← MODIFICADO v2
│   │   │   │   │   ├── Espacio.java                ← MODIFICADO v2
│   │   │   │   │   ├── TipoActividad.java
│   │   │   │   │   ├── Departamento.java           ← MODIFICADO v2
│   │   │   │   │   ├── DepartamentoUsuario.java    ← NUEVO v2
│   │   │   │   │   ├── Documento.java              ← NUEVO v2
│   │   │   │   │   └── Notificacion.java           ← NUEVO v2
│   │   │   │   └── tops/
│   │   │   │       ├── Guion.java                  ← MODIFICADO v2
│   │   │   │       ├── Acto.java
│   │   │   │       ├── Escena.java
│   │   │   │       ├── ElementoGuion.java
│   │   │   │       ├── ElementoAdjunto.java
│   │   │   │       ├── ColorElementoGuion.java     ← NUEVO v2
│   │   │   │       └── HistorialCambio.java
│   │   │   │
│   │   │   ├── repository/
│   │   │   │   ├── user/
│   │   │   │   ├── tempo/
│   │   │   │   │   └── NotificacionRepository.java ← NUEVO v2
│   │   │   │   └── tops/
│   │   │   │
│   │   │   ├── service/
│   │   │   │   ├── user/
│   │   │   │   │   └── UsuarioService.java
│   │   │   │   ├── tempo/
│   │   │   │   │   ├── ActividadService.java       ← MODIFICADO v2
│   │   │   │   │   ├── EspacioService.java
│   │   │   │   │   ├── GoogleCalendarService.java
│   │   │   │   │   ├── DriveService.java           ← NUEVO v2
│   │   │   │   │   └── NotificacionService.java    ← NUEVO v2
│   │   │   │   └── tops/
│   │   │   │       ├── GuionService.java           ← MODIFICADO v2
│   │   │   │       └── ExportWordService.java
│   │   │   │
│   │   │   ├── controller/
│   │   │   │   ├── auth/
│   │   │   │   ├── tempo/
│   │   │   │   │   ├── ActividadController.java    ← MODIFICADO v2
│   │   │   │   │   ├── SignageController.java      ← NUEVO v2
│   │   │   │   │   ├── DriveController.java        ← NUEVO v2
│   │   │   │   │   └── NotificacionController.java ← NUEVO v2
│   │   │   │   ├── tops/
│   │   │   │   │   └── GuionController.java        ← MODIFICADO v2
│   │   │   │   └── admin/
│   │   │   │       └── ConfigController.java       ← NUEVO v2
│   │   │   │
│   │   │   ├── dto/
│   │   │   ├── mapper/
│   │   │   └── exception/
│   │   │
│   │   └── resources/
│   │       ├── application.yml
│   │       ├── application-dev.yml
│   │       ├── application-prod.yml
│   │       └── db/migration/
│   │           ├── V1__create_users.sql
│   │           ├── V2__create_tempo.sql
│   │           ├── V3__create_tops.sql
│   │           └── V4__updates_v2.sql              ← NUEVO v2
│   │
│   └── test/
│
└── docker-compose.yml
```

---

## 2. Modelo de Datos (Entidades JPA) - Actualizado v2

### 2.1 Módulo Usuario/Admin (ACTUALIZADO)

```java
// Rol.java - ACTUALIZADO v2
@Entity
@Table(name = "roles")
public class Rol {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    @Enumerated(EnumType.STRING)
    private RolNombre nombre; // ADMIN, GESTOR, OPERADOR, VISUALIZADOR ← CAMBIO v2

    private String descripcion;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "rol_permisos")
    private Set<String> permisos;
}

// RolNombre.java - NUEVO v2
public enum RolNombre {
    ADMIN,       // Superusuario - acceso total
    GESTOR,      // Antes COLABORADOR - CRUD completo
    OPERADOR,    // NUEVO - Lectura + edición propia
    VISUALIZADOR // NUEVO - Solo lectura
}

// PermisoModulo.java - NUEVO v2
@Entity
@Table(name = "permisos_modulo")
public class PermisoModulo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Modulo modulo; // TEMPO, TOPS

    @Column(nullable = false)
    private Boolean acceso = true;
}

// Departamento.java - ACTUALIZADO v2
@Entity
@Table(name = "departamentos")
public class Departamento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 10)
    private String codigo;

    @Column(nullable = false)
    private String nombre;

    // NUEVOS CAMPOS v2
    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "jefe_id")
    private Usuario jefe;

    private String ambito;
    private String colorHex;

    // Relación N:M con usuarios (personal)
    @ManyToMany
    @JoinTable(
        name = "departamento_usuarios",
        joinColumns = @JoinColumn(name = "departamento_id"),
        inverseJoinColumns = @JoinColumn(name = "usuario_id")
    )
    private Set<Usuario> personal = new HashSet<>();
}
```

### 2.2 Módulo TEMPO (ACTUALIZADO)

```java
// Espacio.java - ACTUALIZADO v2
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
    private TipoEspacio tipo;

    private String googleCalendarId;

    // NUEVOS CAMPOS v2
    private String color;        // Color identificativo
    private Integer capacidad;   // Aforo máximo
    private String dimensiones;  // Dimensiones físicas

    private String ubicacion;
    @Column(nullable = false)
    private Boolean activo = true;
    private Integer orden;
}

// Actividad.java - ACTUALIZADO v2
@Entity
@Table(name = "actividades")
public class Actividad {
    @Id
    @Column(length = 36)
    private String id;

    @PrePersist
    public void generateId() {
        if (id == null) {
            id = java.util.UUID.randomUUID().toString();
        }
    }

    @Column(nullable = false)
    private String titulo;

    // NUEVOS CAMPOS v2
    @Column(nullable = false)
    private String temporada;  // Ej: "2025-2026"

    @Column(columnDefinition = "TEXT")
    private String descripcion;

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
    private TipoMovimiento tipoMovimiento;

    private Integer numCamiones;
    private String lugarOrigen;
    private String lugarDestino;
    private String produccionNombre;

    // NUEVO v2: Estado para actividades de almacén
    @Enumerated(EnumType.STRING)
    private EstadoActividad estado; // PENDIENTE, EN_TRANSITO, COMPLETADO

    // Google Calendar sync
    private String googleEventId;
    private LocalDateTime ultimaSincronizacion;

    // Relación con documentos - NUEVO v2
    @OneToMany(mappedBy = "actividad", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Documento> documentos = new ArrayList<>();

    // Auditoría
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private Usuario createdBy;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}

// EstadoActividad.java - NUEVO v2
public enum EstadoActividad {
    PENDIENTE,    // Estado inicial
    EN_TRANSITO,  // Material en movimiento
    COMPLETADO    // Llegó a destino
}

// Documento.java - NUEVO v2
@Entity
@Table(name = "documentos")
public class Documento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @Enumerated(EnumType.STRING)
    private TipoDocumento tipo; // PLANO, DOSSIER, PARTITURA, HORARIO, IMAGEN, OTRO

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FuenteDocumento fuente; // DRIVE, LOCAL

    @Column(nullable = false)
    private String url;

    private String tipoMime;
    private Long tamanoBytes;

    // Puede estar asociado a actividad o elemento de guion
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "actividad_id")
    private Actividad actividad;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "elemento_guion_id")
    private ElementoGuion elementoGuion;

    @CreationTimestamp
    private LocalDateTime createdAt;
}

// FuenteDocumento.java - NUEVO v2
public enum FuenteDocumento {
    DRIVE,  // Desde Drive intranet
    LOCAL   // Subido desde dispositivo
}

// Notificacion.java - NUEVO v2
@Entity
@Table(name = "notificaciones")
public class Notificacion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(nullable = false)
    private String titulo;

    @Column(columnDefinition = "TEXT")
    private String mensaje;

    @Enumerated(EnumType.STRING)
    private TipoNotificacion tipo; // ACTIVIDAD_CREADA, ACTIVIDAD_MODIFICADA, GUION_BLOQUEADO, etc.

    private String entidadTipo;  // "Actividad", "Guion"
    private String entidadId;

    @Column(nullable = false)
    private Boolean leida = false;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
```

### 2.3 Módulo TOPS (ACTUALIZADO)

```java
// Guion.java - ACTUALIZADO v2
@Entity
@Table(name = "guiones")
public class Guion {
    @Id
    @Column(length = 36)
    private String id;

    @PrePersist
    public void generateId() {
        if (id == null) {
            id = java.util.UUID.randomUUID().toString();
        }
    }

    // NUEVO v2: Temporada
    @Column(nullable = false)
    private String temporada;

    @Column(nullable = false)
    private String produccionNombre;

    private String compania;
    private String productor;
    private String responsableEdicion;
    private String directorEscena;
    private String directorMusical;

    private Integer version = 1;
    private String versionNombre;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "locked_by")
    private Usuario lockedBy;

    private LocalDateTime lockedAt;

    @Enumerated(EnumType.STRING)
    private EstadoGuion estado;

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

// ColorElementoGuion.java - NUEVO v2
@Entity
@Table(name = "colores_elemento_guion")
public class ColorElementoGuion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, unique = true)
    private TipoElemento tipoElemento; // TOP, ENTRADA, MUTIS, etc.

    @Column(nullable = false, length = 7)
    private String colorHex;

    private String descripcion;
}
```

---

## 3. Migraciones Flyway - Actualización v2

### V4__updates_v2.sql (NUEVO)
```sql
-- =====================================================
-- MIGRACIÓN V4: Actualizaciones para requisitos v1.3
-- =====================================================

-- 1. ACTUALIZAR ROLES
UPDATE roles SET nombre = 'GESTOR' WHERE nombre = 'COLABORADOR';

INSERT INTO roles (nombre, descripcion) VALUES
    ('OPERADOR', 'Puede visualizar y editar su propio trabajo'),
    ('VISUALIZADOR', 'Acceso de solo lectura')
ON CONFLICT (nombre) DO NOTHING;

-- 2. ACTUALIZAR TABLA DEPARTAMENTOS
ALTER TABLE departamentos
    ADD COLUMN IF NOT EXISTS descripcion TEXT,
    ADD COLUMN IF NOT EXISTS jefe_id UUID REFERENCES usuarios(id);

-- 3. CREAR TABLA DEPARTAMENTO_USUARIOS (N:M)
CREATE TABLE IF NOT EXISTS departamento_usuarios (
    departamento_id INTEGER NOT NULL REFERENCES departamentos(id),
    usuario_id UUID NOT NULL REFERENCES usuarios(id),
    PRIMARY KEY (departamento_id, usuario_id)
);

-- 4. ACTUALIZAR TABLA ESPACIOS
ALTER TABLE espacios
    ADD COLUMN IF NOT EXISTS color VARCHAR(7),
    ADD COLUMN IF NOT EXISTS dimensiones VARCHAR(100);

-- 5. ACTUALIZAR TABLA ACTIVIDADES
ALTER TABLE actividades
    ADD COLUMN IF NOT EXISTS temporada VARCHAR(20),
    ADD COLUMN IF NOT EXISTS descripcion TEXT,
    ADD COLUMN IF NOT EXISTS estado VARCHAR(20) DEFAULT 'PENDIENTE';

-- Añadir departamento "Otros" si no existe
INSERT INTO departamentos (codigo, nombre, ambito)
VALUES ('Otros', 'Otros', 'Varios')
ON CONFLICT (codigo) DO NOTHING;

-- 6. ACTUALIZAR TABLA GUIONES
ALTER TABLE guiones
    ADD COLUMN IF NOT EXISTS temporada VARCHAR(20);

-- 7. CREAR TABLA DOCUMENTOS (NUEVO)
CREATE TABLE IF NOT EXISTS documentos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    tipo VARCHAR(50),
    fuente VARCHAR(20) NOT NULL, -- DRIVE, LOCAL
    url TEXT NOT NULL,
    tipo_mime VARCHAR(100),
    tamano_bytes BIGINT,
    actividad_id UUID REFERENCES actividades(id) ON DELETE CASCADE,
    elemento_guion_id UUID REFERENCES elementos_guion(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 8. CREAR TABLA COLORES ELEMENTOS GUION (NUEVO)
CREATE TABLE IF NOT EXISTS colores_elemento_guion (
    id SERIAL PRIMARY KEY,
    tipo_elemento VARCHAR(20) NOT NULL UNIQUE,
    color_hex VARCHAR(7) NOT NULL,
    descripcion VARCHAR(100)
);

-- Datos iniciales para colores
INSERT INTO colores_elemento_guion (tipo_elemento, color_hex, descripcion) VALUES
    ('TOP', '#FF5733', 'Punto de sincronización técnica'),
    ('ENTRADA', '#33FF57', 'Entrada de personaje/elemento'),
    ('MUTIS', '#3357FF', 'Salida de personaje/elemento'),
    ('INTERNO', '#FF33F5', 'Acción interna'),
    ('AVISO', '#F5FF33', 'Aviso previo'),
    ('PASADA_ITEM', '#808080', 'Elemento de pasada')
ON CONFLICT (tipo_elemento) DO NOTHING;

-- 9. CREAR TABLA NOTIFICACIONES (NUEVO)
CREATE TABLE IF NOT EXISTS notificaciones (
    id SERIAL PRIMARY KEY,
    usuario_id UUID NOT NULL REFERENCES usuarios(id),
    titulo VARCHAR(255) NOT NULL,
    mensaje TEXT,
    tipo VARCHAR(50),
    entidad_tipo VARCHAR(50),
    entidad_id VARCHAR(50),
    leida BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_notificaciones_usuario ON notificaciones(usuario_id);
CREATE INDEX IF NOT EXISTS idx_notificaciones_leida ON notificaciones(usuario_id, leida);

-- 10. CREAR TABLA PERMISOS POR MÓDULO (NUEVO)
CREATE TABLE IF NOT EXISTS permisos_modulo (
    id SERIAL PRIMARY KEY,
    usuario_id UUID NOT NULL REFERENCES usuarios(id),
    modulo VARCHAR(20) NOT NULL, -- TEMPO, TOPS
    acceso BOOLEAN NOT NULL DEFAULT true,
    UNIQUE(usuario_id, modulo)
);

-- 11. CREAR TABLA TEMPORADAS (NUEVO)
CREATE TABLE IF NOT EXISTS temporadas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(20) NOT NULL UNIQUE, -- "2025-2026"
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    activa BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO temporadas (nombre, fecha_inicio, fecha_fin, activa) VALUES
    ('2025-2026', '2025-08-01', '2026-07-31', true)
ON CONFLICT (nombre) DO NOTHING;

-- 12. ÍNDICES ADICIONALES
CREATE INDEX IF NOT EXISTS idx_actividades_temporada ON actividades(temporada);
CREATE INDEX IF NOT EXISTS idx_guiones_temporada ON guiones(temporada);
CREATE INDEX IF NOT EXISTS idx_actividades_estado ON actividades(estado);
```

---

## 4. API REST - Endpoints (ACTUALIZADO v2)

### 4.1 Autenticación
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/auth/google` | Iniciar OAuth con Google |
| GET | `/api/auth/google/callback` | Callback OAuth |
| GET | `/api/auth/me` | Usuario actual |
| POST | `/api/auth/logout` | Cerrar sesión |

### 4.2 TEMPO - Actividades (ACTUALIZADO v2)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/actividades` | Listar (filtros: espacio, fecha, tipo, **temporada**) |
| GET | `/api/actividades/{id}` | Detalle |
| POST | `/api/actividades` | Crear |
| PUT | `/api/actividades/{id}` | Actualizar |
| DELETE | `/api/actividades/{id}` | Eliminar |
| **POST** | `/api/actividades/{id}/clone` | **Clonar actividad** ← NUEVO v2 |
| **PUT** | `/api/actividades/{id}/estado` | **Cambiar estado (almacén)** ← NUEVO v2 |
| GET | `/api/actividades/calendario` | Vista calendario (rango fechas) |
| GET | `/api/actividades/semanal` | **Vista semanal tipo Excel** ← NUEVO v2 |
| POST | `/api/actividades/import` | Importar CSV/Excel |
| GET | `/api/actividades/export` | Exportar CSV/Excel |

### 4.3 TEMPO - Documentos (NUEVO v2)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/documentos` | Listar documentos |
| POST | `/api/documentos` | Subir documento (local) |
| POST | `/api/documentos/drive` | Adjuntar desde Drive |
| DELETE | `/api/documentos/{id}` | Eliminar documento |
| GET | `/api/drive/browse` | Navegar Drive intranet |
| GET | `/api/drive/search` | Buscar en Drive |

### 4.4 TEMPO - Cartelería (ACTUALIZADO v2)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/signage/global` | **Vista global todas las salas** ← NUEVO v2 |
| GET | `/api/signage/{espacioId}` | Vista por sala |

### 4.5 Notificaciones (NUEVO v2)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/notificaciones` | Mis notificaciones |
| GET | `/api/notificaciones/count` | Contador no leídas |
| PUT | `/api/notificaciones/{id}/read` | Marcar como leída |
| PUT | `/api/notificaciones/read-all` | Marcar todas como leídas |

### 4.6 TOPS - Guiones (ACTUALIZADO v2)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/guiones` | Listar guiones (filtro: **temporada**) |
| **GET** | `/api/guiones/mine` | **Mis guiones (involucrado)** ← NUEVO v2 |
| GET | `/api/guiones/{id}` | Detalle completo |
| POST | `/api/guiones` | Crear |
| PUT | `/api/guiones/{id}` | Actualizar metadata |
| DELETE | `/api/guiones/{id}` | Eliminar |
| POST | `/api/guiones/{id}/lock` | Bloquear para edición |
| POST | `/api/guiones/{id}/unlock` | Desbloquear |
| GET | `/api/guiones/{id}/historial` | Historial de cambios |
| GET | `/api/guiones/{id}/export` | Exportar a Word |

### 4.7 Admin - Configuración (NUEVO v2)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/config/element-colors` | Colores elementos guion |
| PUT | `/api/config/element-colors` | Actualizar colores |
| GET | `/api/config/temporadas` | Listar temporadas |
| POST | `/api/config/temporadas` | Crear temporada |
| PUT | `/api/config/temporadas/{id}/activar` | Activar temporada |
| GET | `/api/usuarios/{id}/permisos` | Permisos por módulo |
| PUT | `/api/usuarios/{id}/permisos` | Configurar permisos |
| PUT | `/api/departamentos/{id}/personal` | Gestionar personal dpto |

---

## 5. Servicios Clave (ACTUALIZADO v2)

### 5.1 ActividadService - Métodos nuevos
```java
@Service
@RequiredArgsConstructor
public class ActividadService {

    // ... métodos existentes ...

    // NUEVO v2: Clonar actividad
    public Actividad clone(String id, LocalDate nuevaFecha) {
        Actividad original = findById(id);
        Actividad clon = new Actividad();
        // Copiar todos los campos excepto id y fecha
        BeanUtils.copyProperties(original, clon, "id", "fecha", "googleEventId");
        clon.setFecha(nuevaFecha);
        return actividadRepository.save(clon);
    }

    // NUEVO v2: Cambiar estado (almacén)
    public Actividad cambiarEstado(String id, EstadoActividad nuevoEstado) {
        Actividad actividad = findById(id);
        if (actividad.getEspacio().getTipo() != TipoEspacio.ALMACEN) {
            throw new BusinessException("Solo actividades de almacén tienen estado");
        }
        actividad.setEstado(nuevoEstado);
        Actividad saved = actividadRepository.save(actividad);

        // Notificar cambio de estado
        notificacionService.notifyEstadoCambiado(saved);

        return saved;
    }

    // NUEVO v2: Vista semanal tipo Excel
    public List<ActividadSemanalDTO> getVistaSemanal(LocalDate semana, Long espacioId) {
        LocalDate inicio = semana.with(DayOfWeek.MONDAY);
        LocalDate fin = semana.with(DayOfWeek.SUNDAY);

        List<Actividad> actividades = actividadRepository
            .findByFechaBetweenAndEspacioTipo(inicio, fin, TipoEspacio.SALA);

        // Agrupar por día y franja horaria
        return mapToSemanalDTO(actividades);
    }
}
```

### 5.2 NotificacionService (NUEVO v2)
```java
@Service
@RequiredArgsConstructor
public class NotificacionService {

    private final NotificacionRepository notificacionRepository;
    private final SimpMessagingTemplate websocket;

    public void notifyActividadCreada(Actividad actividad) {
        // Crear notificaciones para usuarios vinculados
        List<Usuario> destinatarios = getDestinatarios(actividad);

        for (Usuario usuario : destinatarios) {
            Notificacion notif = new Notificacion();
            notif.setUsuario(usuario);
            notif.setTitulo("Nueva actividad: " + actividad.getTitulo());
            notif.setMensaje("Se ha creado una nueva actividad en " +
                actividad.getEspacio().getNombre());
            notif.setTipo(TipoNotificacion.ACTIVIDAD_CREADA);
            notif.setEntidadTipo("Actividad");
            notif.setEntidadId(actividad.getId());
            notificacionRepository.save(notif);

            // WebSocket push
            websocket.convertAndSendToUser(
                usuario.getEmail(),
                "/queue/notifications",
                NotificacionDTO.from(notif)
            );
        }
    }

    public void notifyActividadModificada(Actividad actividad, List<String> cambios) { ... }
    public void notifyEstadoCambiado(Actividad actividad) { ... }
    public void notifyGuionBloqueado(Guion guion) { ... }

    public List<Notificacion> getMisNotificaciones(Usuario usuario) {
        return notificacionRepository.findByUsuarioOrderByCreatedAtDesc(usuario);
    }

    public long getUnreadCount(Usuario usuario) {
        return notificacionRepository.countByUsuarioAndLeidaFalse(usuario);
    }

    public void marcarComoLeida(Long id) {
        Notificacion notif = notificacionRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("Notificación no encontrada"));
        notif.setLeida(true);
        notificacionRepository.save(notif);
    }
}
```

### 5.3 DriveService (NUEVO v2)
```java
@Service
@RequiredArgsConstructor
public class DriveService {

    @Value("${teatro.drive.base-path}")
    private String driveBasePath;

    public List<DriveFileDTO> browse(String path) {
        // Navegar carpetas del Drive de intranet
        Path fullPath = Paths.get(driveBasePath, path);

        if (!Files.exists(fullPath)) {
            throw new NotFoundException("Ruta no encontrada: " + path);
        }

        try (Stream<Path> stream = Files.list(fullPath)) {
            return stream.map(this::toDTO).collect(Collectors.toList());
        } catch (IOException e) {
            throw new BusinessException("Error al leer directorio", e);
        }
    }

    public List<DriveFileDTO> search(String query) {
        // Buscar archivos en Drive
        try (Stream<Path> stream = Files.walk(Paths.get(driveBasePath))) {
            return stream
                .filter(p -> p.getFileName().toString().toLowerCase()
                    .contains(query.toLowerCase()))
                .limit(50)
                .map(this::toDTO)
                .collect(Collectors.toList());
        } catch (IOException e) {
            throw new BusinessException("Error en búsqueda", e);
        }
    }

    public Documento attachFromDrive(String drivePath, String actividadId) {
        // Crear referencia a archivo de Drive
        Documento doc = new Documento();
        doc.setNombre(Paths.get(drivePath).getFileName().toString());
        doc.setFuente(FuenteDocumento.DRIVE);
        doc.setUrl(drivePath);
        // ... asociar a actividad
        return documentoRepository.save(doc);
    }

    private DriveFileDTO toDTO(Path path) {
        DriveFileDTO dto = new DriveFileDTO();
        dto.setNombre(path.getFileName().toString());
        dto.setPath(driveBasePath.relativize(path).toString());
        dto.setEsDirectorio(Files.isDirectory(path));
        return dto;
    }
}
```

---

## 6. Seguridad (ACTUALIZADO v2)

### SecurityConfig con nuevos roles
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
                // Públicos
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/signage/**").permitAll() // Cartelería pública
                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()

                // Lectura: todos los roles autenticados
                .requestMatchers(HttpMethod.GET, "/api/**")
                    .hasAnyRole("ADMIN", "GESTOR", "OPERADOR", "VISUALIZADOR")

                // Escritura: ADMIN y GESTOR
                .requestMatchers(HttpMethod.POST, "/api/actividades/**")
                    .hasAnyRole("ADMIN", "GESTOR")
                .requestMatchers(HttpMethod.PUT, "/api/actividades/**")
                    .hasAnyRole("ADMIN", "GESTOR")
                .requestMatchers(HttpMethod.DELETE, "/api/actividades/**")
                    .hasAnyRole("ADMIN", "GESTOR")

                // TOPS: GESTOR puede editar, OPERADOR solo sus elementos
                .requestMatchers(HttpMethod.POST, "/api/guiones/**")
                    .hasAnyRole("ADMIN", "GESTOR")
                .requestMatchers(HttpMethod.PUT, "/api/elementos/**")
                    .hasAnyRole("ADMIN", "GESTOR", "OPERADOR")

                // Admin: solo ADMIN
                .requestMatchers("/api/usuarios/**").hasRole("ADMIN")
                .requestMatchers("/api/config/**").hasRole("ADMIN")

                .anyRequest().authenticated()
            )
            .oauth2Login(oauth2 -> oauth2.successHandler(oAuth2SuccessHandler))
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
```

---

## 7. Plan de Desarrollo Backend (ACTUALIZADO v2)

### Sprint 1: Setup + Auth (1 semana) - SIN CAMBIOS
| Tarea | Horas |
|-------|-------|
| Configurar proyecto Spring Boot + Maven | 4h |
| Configurar PostgreSQL + Flyway | 4h |
| Implementar migraciones V1 (usuarios) | 4h |
| Implementar OAuth2 con Google | 8h |
| JWT + SecurityConfig | 6h |
| Tests de autenticación | 4h |
| **Total Sprint 1** | **30h** |

### Sprint 2: Módulo TEMPO (ACTUALIZADO v2)
| Tarea | Horas |
|-------|-------|
| Migraciones V2 (tempo) | 4h |
| Entidades + Repositorios TEMPO | 6h |
| CRUD Espacios (con nuevos campos) | 5h |
| CRUD Tipos Actividad | 4h |
| CRUD Actividades (con temporada, descripcion) | 10h |
| **Endpoint clonar actividad** | 3h |
| **Flujo estados almacén** | 4h |
| **Vista semanal tipo Excel** | 6h |
| Filtros y búsqueda actividades | 6h |
| Integración Google Calendar básica | 12h |
| Tests TEMPO | 6h |
| **Total Sprint 2** | **66h** (+12h vs v1) |

### Sprint 3: Módulo TOPS (ACTUALIZADO v2)
| Tarea | Horas |
|-------|-------|
| Migraciones V3 + V4 (tops + updates) | 8h |
| Entidades + Repositorios TOPS | 8h |
| CRUD Guiones (con temporada) | 6h |
| **Endpoint mis guiones** | 2h |
| CRUD Actos/Escenas | 8h |
| CRUD Elementos (TOPs, etc.) | 10h |
| Bloqueo de edición | 6h |
| Historial de cambios | 6h |
| Vistas (completa, tops, departamento) | 8h |
| **Colores elementos configurables** | 3h |
| Reordenar elementos (drag & drop API) | 4h |
| Tests TOPS | 8h |
| **Total Sprint 3** | **77h** (+7h vs v1) |

### Sprint 4: Integraciones + Nuevas Features v2
| Tarea | Horas |
|-------|-------|
| Google Calendar sync completo | 12h |
| Exportación Word (guiones) | 10h |
| **Sistema de notificaciones** | 10h |
| **Integración Drive intranet** | 8h |
| **Cartelería global** | 4h |
| WebSocket para updates en tiempo real | 6h |
| Tests de integración | 6h |
| **Total Sprint 4** | **56h** (+16h vs v1) |

### Sprint 5: Admin + Polish (ACTUALIZADO v2)
| Tarea | Horas |
|-------|-------|
| **Gestión 4 roles (permisos por módulo)** | 8h |
| **Gestión departamentos (jefe + personal)** | 6h |
| **Configuración colores elementos** | 3h |
| **Gestión temporadas** | 3h |
| Documentación OpenAPI/Swagger | 4h |
| Validaciones y manejo de errores | 6h |
| Optimización de queries | 4h |
| Docker + docker-compose | 4h |
| Tests E2E | 6h |
| **Total Sprint 5** | **44h** (+16h vs v1) |

---

## 8. Resumen de Estimación Backend v2

| Fase | Horas v1 | Horas v2 | Diferencia |
|------|----------|----------|------------|
| Sprint 1: Setup + Auth | 30h | 30h | - |
| Sprint 2: TEMPO | 54h | 66h | +12h |
| Sprint 3: TOPS | 70h | 77h | +7h |
| Sprint 4: Integraciones | 40h | 56h | +16h |
| Sprint 5: Admin + Polish | 28h | 44h | +16h |
| **TOTAL BACKEND** | **222h** | **273h** | **+51h** |

### Nuevas funcionalidades v2 (+51h):
- Flujo estados almacén: +7h
- Vista semanal tipo Excel: +6h
- Sistema notificaciones: +10h
- Integración Drive: +8h
- Cartelería global: +4h
- Gestión 4 roles: +8h
- Departamentos (jefe+personal): +6h
- Colores elementos: +3h
- Temporadas: +3h
- Endpoints adicionales: +5h

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
```

### URLs de Desarrollo
| Servicio | URL |
|----------|-----|
| API REST | http://localhost:8080/api |
| Swagger UI | http://localhost:8080/swagger-ui.html |
| H2 Console | http://localhost:8080/h2-console |
| WebSocket | ws://localhost:8080/ws |

---

*Plan de Implementación Backend v2 - Teatro Real*
*Actualizado: 2025-01-13*
*Basado en: Requisitos v1.3*
