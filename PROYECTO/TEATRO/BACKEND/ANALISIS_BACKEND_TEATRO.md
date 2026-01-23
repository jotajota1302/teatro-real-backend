# Análisis Backend - Sistema de Gestión Interna Teatro Real

## 1. Resumen Ejecutivo

El Teatro Real requiere una plataforma backend robusta y escalable basada en **microservicios con Clean Architecture (Hexagonal)**. La solución unifica TEMPO (planificación), TOPS (coordinación técnica) y operaciones logísticas usando Java 21, Spring Boot 3.2+, PostgreSQL, Kafka y Google Cloud.

---

## 2. Contexto Tecnológico

- **Lenguaje**: Java 21 LTS
- **Framework**: Spring Boot 3.2+ con Spring Cloud
- **Arquitectura**: Hexagonal/Ports & Adapters + DDD
- **BD**: PostgreSQL 15+
- **Caché**: Redis 7+
- **Infraestructura**: Google Cloud Platform (preferente)
- **APIs**: REST (OpenAPI 3.0) + WebSockets
- **Mensajería**: Kafka
- **Autenticación**: Google OAuth2
- **Contenedores**: Docker + Kubernetes

---

## 3. Arquitectura de Microservicios

```
┌─────────────────┐
│    FRONTEND     │ (Angular)
└────────┬────────┘
         │
┌────────▼────────────────────┐
│     API GATEWAY             │
│ (Auth, Rate Limit, Routing) │
└──┬──────────┬───────────┬───┘
   │          │           │
   ▼          ▼           ▼
┌──────────┐┌────────┐┌──────────────┐
│TEMPO Srv ││TOPS Srv││LOGISTICA Srv │
└────┬─────┘└───┬────┘└──────┬───────┘
     │          │            │
     └──────────┼────────────┘
                ▼
         ┌─────────────┐
         │ Kafka Bus   │ (Eventos)
         └─────┬───┬───┘
               │   │
               ▼   ▼
          ┌──────────────┐
          │Notification  │
          │   Service    │
          └──────────────┘
```

### Servicios Core

| Servicio | Responsabilidad |
|----------|-----------------|
| **TEMPO** | Actividades, espacios, sincronización Google Calendar |
| **TOPS** | Guiones técnicos, Tops, historial, bloqueos |
| **LOGISTICA** | Movimientos Arganda, trazabilidad |
| **IAM** | OAuth2, usuarios, roles, permisos |
| **NOTIFICATION** | Alertas por email/internas |

---

## 4. Modelo de Dominio TEMPO

### Aggregate: Actividad

```java
@Getter
public class Actividad {
    private final ActividadId id;
    private String titulo;
    private TipoActividad tipo;
    private EspacioId espacioId;
    private RangoHorario horario;
    private String codigoColor;
    private String responsable;
    private boolean sincronizadaGoogleCalendar;
    private final Instant createdAt;
    private Instant updatedAt;
    
    public static Actividad crear(String titulo, TipoActividad tipo, 
            EspacioId espacioId, RangoHorario horario, String responsable) {
        validarDatos(titulo, responsable);
        return new Actividad(ActividadId.generate(), titulo, tipo, 
            espacioId, horario, responsable, Instant.now());
    }
    
    public void modificarHorario(RangoHorario nuevoHorario) {
        this.horario = nuevoHorario;
        this.updatedAt = Instant.now();
    }
}
```

### Aggregate: Espacio

```java
@Getter
public class Espacio {
    private final EspacioId id;
    private String nombre;
    private String tipo;
    private String ubicacion;
    private String codigoColor;
    private boolean activo;
    
    public static Espacio crear(String nombre, String tipo, String ubicacion) {
        validarNombre(nombre);
        return new Espacio(EspacioId.generate(), nombre, tipo, ubicacion, true);
    }
}
```

### Value Objects

```java
@Value
public class RangoHorario {
    LocalDateTime inicio;
    LocalDateTime fin;
    
    public RangoHorario {
        if (fin.isBefore(inicio)) throw new HorarioInvalidoException();
    }
    
    public boolean solapaCon(RangoHorario otro) {
        return !fin.isBefore(otro.inicio) && !inicio.isAfter(otro.fin);
    }
}

@Value
public class ActividadId {
    UUID value;
    public static ActividadId generate() { return new ActividadId(UUID.randomUUID()); }
}
```

---

## 5. Modelo de Dominio TOPS

### Aggregate: GuionTecnico

```java
@Getter
public class GuionTecnico {
    private final GuionId id;
    private final ActividadId actividadId;
    private String titulo;
    private List<Acto> actos;
    private UsuarioId editorActual;
    private Instant fechaBloqueo;
    private List<CambioGuion> historialCambios;
    
    // RN-002: Solo un editor a la vez
    public void bloquearPara(UsuarioId usuario) {
        if (this.editorActual != null && !this.editorActual.equals(usuario)) {
            throw new GuionYaBloqueadoException();
        }
        this.editorActual = usuario;
        this.fechaBloqueo = Instant.now();
    }
    
    public void desbloquear() {
        this.editorActual = null;
        this.fechaBloqueo = null;
    }
    
    // RN-010: Auditoría permanente
    public void registrarCambio(UsuarioId usuario, String tipo, String descripcion) {
        CambioGuion cambio = new CambioGuion(this.id, usuario, tipo, 
            descripcion, Instant.now());
        this.historialCambios.add(cambio);
    }
}
```

### Entity: Top

```java
@Getter
public class Top {
    private final TopId id;
    private Integer numero;           // RN-001: Único por producción
    private String compas;
    private DepartamentoTecnico departamento;
    private String descripcion;
    private List<ElementoAccion> elementos;
}
```

---

## 6. Modelo de Dominio Logística

### Aggregate: MovimientoLogistico

```java
@Getter
public class MovimientoLogistico {
    private final MovimientoId id;
    private final ActividadId actividadId;
    private TipoMovimiento tipo;
    private Instant fechaMovimiento;
    private List<ItemMovimiento> items;
    private String camion;
    private String conductor;
    private EstadoMovimiento estado;
    
    // RN-009: Validación estricta antes de confirmar
    public void confirmar() {
        validarDatosObligatorios();
        this.estado = EstadoMovimiento.CONFIRMADA;
    }
    
    private void validarDatosObligatorios() {
        if (camion == null || conductor == null || items == null || items.isEmpty()) {
            throw new DatosIncompletos();
        }
    }
}
```

---

## 7. Puertos y Adaptadores

### Puertos de Salida (Out)

```java
// Repositorios
public interface ActividadRepository {
    Optional<Actividad> findById(ActividadId id);
    List<Actividad> findConflictos(EspacioId espacioId, RangoHorario horario);
    Actividad save(Actividad actividad);
    void delete(ActividadId id);
}

// Integraciones
public interface GoogleCalendarPort {
    String crearEvento(Actividad actividad);
    void actualizarEvento(Actividad actividad);
    void eliminarEvento(String eventId);
}

public interface NotificacionPort {
    void enviarAlerta(String destinatario, Alerta alerta);
}
```

### Application Services (Casos de Uso)

```java
@Service @RequiredArgsConstructor @Transactional
public class CrearActividadService {
    private final ActividadRepository repository;
    private final GoogleCalendarPort googleCalendar;
    private final NotificacionPort notificacion;
    private final EventPublisher eventPublisher;
    
    public ActividadId ejecutar(CrearActividadCommand cmd) {
        // RN-006: Validar no solapamiento
        List<Actividad> conflictos = repository.findConflictos(
            cmd.espacioId, cmd.rango);
        if (!conflictos.isEmpty()) throw new SolapamientoException();
        
        // Crear y persistir
        Actividad actividad = Actividad.crear(cmd.titulo, cmd.tipo, 
            cmd.espacioId, cmd.rango, cmd.responsable);
        Actividad guardada = repository.save(actividad);
        
        // RN-004: Sincronizar Google Calendar
        googleCalendar.crearEvento(guardada);
        
        // RN-003: Notificar
        notificacion.enviarAlerta(cmd.responsable, 
            new Alerta("Actividad creada: " + cmd.titulo));
        
        // Publicar evento
        eventPublisher.publicar(new ActividadCreadaEvent(guardada.getId()));
        
        return guardada.getId();
    }
}
```

---

## 8. APIs REST

### TEMPO Endpoints

```
POST   /api/v1/actividades              - Crear
GET    /api/v1/actividades              - Listar
GET    /api/v1/actividades/{id}         - Obtener
PUT    /api/v1/actividades/{id}         - Modificar
DELETE /api/v1/actividades/{id}         - Eliminar
POST   /api/v1/espacios                 - Crear espacio
GET    /api/v1/espacios                 - Listar espacios
```

### TOPS Endpoints

```
POST   /api/v1/guiones                  - Crear guión
GET    /api/v1/guiones/{id}             - Obtener
PUT    /api/v1/guiones/{id}/bloquear    - Bloquear (edición)
PUT    /api/v1/guiones/{id}/desbloquear - Desbloquear
POST   /api/v1/guiones/{id}/tops        - Registrar Top
GET    /api/v1/guiones/{id}/historial   - Ver historial
```

### LOGISTICA Endpoints

```
POST   /api/v1/movimientos              - Registrar movimiento
GET    /api/v1/movimientos/{id}         - Obtener
PUT    /api/v1/movimientos/{id}/confirmar - Confirmar
```

---

## 9. Reglas de Negocio Implementadas

| Regla | Implementación |
|-------|-----------------|
| **RN-001** | Unicidad Tops/producción → DB constraint + validation |
| **RN-002** | Bloqueo exclusivo guión → GuionTecnico.bloquearPara() |
| **RN-003** | Alertas automáticas → NotificacionPort |
| **RN-004** | Sincronización Google Calendar → GoogleCalendarPort |
| **RN-006** | No solapamiento espacios → ActividadRepository.findConflictos() |
| **RN-009** | Validación datos logística → MovimientoLogistico.confirmar() |
| **RN-010** | Historial permanente → GuionTecnico.registrarCambio() |

---

## 10. Estructura Maven

```
teatro-real-backend/
├── pom.xml (parent)
├── docker-compose.yml
├── shared-lib/
│   └── src/main/java/com/teatroreal/shared/
│       ├── domain/
│       │   ├── DomainEvent.java
│       │   ├── AggregateRoot.java
│       │   └── ValueObject.java
│       └── exception/
├── tempo-service/
│   ├── pom.xml
│   └── src/main/java/com/teatroreal/tempo/
│       ├── domain/model/ (Actividad, Espacio, RangoHorario)
│       ├── domain/event/ (ActividadCreadaEvent)
│       ├── application/port/
│       │   ├── in/ (CrearActividadUseCase, ModificarActividadUseCase)
│       │   └── out/ (ActividadRepository, GoogleCalendarPort, NotificacionPort)
│       ├── application/service/
│       │   ├── CrearActividadService.java
│       │   └── ModificarActividadService.java
│       └── infrastructure/adapter/
│           ├── in/web/ (ActividadController)
│           └── out/ (JpaActividadRepository, GoogleCalendarAdapter)
├── tops-service/
│   └── src/main/java/com/teatroreal/tops/
│       ├── domain/model/ (GuionTecnico, Top, Acto, Escena, Pasada)
│       ├── application/port/
│       │   ├── in/ (CrearGuionUseCase, RegistrarTopUseCase, BloquearGuionUseCase)
│       │   └── out/ (GuionRepository, HistorialRepository)
│       └── infrastructure/adapter/
│           ├── in/web/ (GuionController, TopController)
│           └── out/persistence/ (JpaGuionRepository)
├── logistica-service/
│   └── src/main/java/com/teatroreal/logistica/
│       ├── domain/model/ (MovimientoLogistico, ItemMovimiento)
│       ├── application/port/
│       │   ├── in/ (RegistrarMovimientoUseCase, ConfirmarMovimientoUseCase)
│       │   └── out/ (MovimientoRepository)
│       └── infrastructure/adapter/
│           ├── in/web/ (LogisticaController)
│           └── out/persistence/ (JpaMovimientoRepository)
├── iam-service/
│   └── src/main/java/com/teatroreal/iam/
│       ├── domain/model/ (Usuario, UsuarioId, RolUsuario, Permiso)
│       ├── application/port/
│       │   ├── in/ (CrearUsuarioUseCase, CambiarRolUseCase)
│       │   └── out/ (UsuarioRepository, GoogleOAuthPort)
│       └── infrastructure/adapter/
│           ├── in/web/ (UsuarioController, AuthController)
│           └── out/ (JpaUsuarioRepository, GoogleOAuthAdapter)
└── notification-service/
    └── src/
