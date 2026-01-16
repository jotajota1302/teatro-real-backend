# Template: Desarrollo Backend (Spring Boot)

## Instrucciones de Uso
Copia este template y rellena las secciones marcadas con `[...]`.

---

## PROMPT

```
## Contexto del Proyecto

Estoy desarrollando el backend del **Sistema de Gestión del Teatro Real** con:
- **Java 8** + **Spring Boot 2.7.18**
- **Spring Data JPA** + **H2** (desarrollo) / **PostgreSQL** (producción)
- **SpringDoc OpenAPI 1.7.0** para documentación
- **Lombok** para reducir boilerplate
- Paquete base: `com.teatroreal`

### Estructura del Proyecto
```
teatro-real-backend/src/main/java/com/teatroreal/
├── config/          # Configuración (CORS, OpenAPI, etc.)
├── controller/      # REST Controllers
├── service/         # Lógica de negocio
├── repository/      # Repositorios JPA
├── domain/          # Entidades JPA
├── dto/             # Data Transfer Objects
│   ├── request/     # DTOs de entrada
│   └── response/    # DTOs de salida
├── exception/       # Excepciones personalizadas
└── mapper/          # Mappers (Entity <-> DTO)
```

### Convenciones a Seguir
- Usar `javax.*` para validaciones (NO `jakarta.*`)
- IDs como `String` (UUID generado con `@PrePersist`)
- Timestamps con `@CreationTimestamp` y `@UpdateTimestamp`
- Documentar endpoints con `@Operation` y `@ApiResponse`
- Validar DTOs con `@Valid` y anotaciones `javax.validation`

---

## Solicitud de Desarrollo

### Módulo
[ADMIN | TEMPO | TOPS]

### Tipo de Desarrollo
[Entidad | Repositorio | Servicio | Controller | CRUD Completo | Endpoint específico]

### Descripción
[Describe qué necesitas desarrollar]

### Requisito de Referencia
[RF-TEMPO-X | RF-TOPS-X | RF-ADMIN-X] - [Nombre del requisito]

### Especificaciones

#### Entidad/Modelo (si aplica)
| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| [campo1] | [tipo] | [Sí/No] | [descripción] |
| [campo2] | [tipo] | [Sí/No] | [descripción] |

#### Endpoints (si aplica)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| [GET/POST/PUT/DELETE] | `/api/[recurso]` | [descripción] |

#### Reglas de Negocio
1. [Regla 1]
2. [Regla 2]

### Relaciones con Otras Entidades
- [Entidad1]: [tipo de relación - 1:N, N:M, etc.]
- [Entidad2]: [tipo de relación]

### Criterios de Aceptación
- [ ] [Criterio 1]
- [ ] [Criterio 2]
- [ ] Endpoint documentado en Swagger
- [ ] Validaciones implementadas
- [ ] Manejo de errores apropiado

---

## Archivos de Referencia
- Ver modelo de datos en: DOC_GENERADA/PLAN_IMPLEMENTACION_BACKEND.md (sección 2)
- Ver API contract en: DOC_GENERADA/SINTESIS_REQUISITOS_FINAL.md (sección 9)
```

---

## Ejemplos de Uso

### Ejemplo 1: CRUD de Espacios (TEMPO)

```
## Solicitud de Desarrollo

### Módulo
TEMPO

### Tipo de Desarrollo
CRUD Completo

### Descripción
Implementar el CRUD completo para la gestión de Espacios del teatro (salas y almacenes).

### Requisito de Referencia
RF-TEMPO-1 - CRUD de Actividades (dependencia: espacios)

### Especificaciones

#### Entidad/Modelo
| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| id | Long | Sí (auto) | ID único |
| nombre | String | Sí | Nombre del espacio |
| tipo | Enum | Sí | SALA o ALMACEN |
| googleCalendarId | String | No | ID del calendario de Google |
| capacidad | Integer | No | Capacidad de personas |
| ubicacion | String | No | Ubicación física |
| activo | Boolean | Sí | Si está activo (default: true) |
| orden | Integer | No | Orden de visualización |

#### Endpoints
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/espacios` | Listar todos los espacios |
| GET | `/api/espacios/{id}` | Obtener espacio por ID |
| POST | `/api/espacios` | Crear nuevo espacio |
| PUT | `/api/espacios/{id}` | Actualizar espacio |
| DELETE | `/api/espacios/{id}` | Eliminar espacio |
| GET | `/api/espacios/tipo/{tipo}` | Filtrar por tipo (SALA/ALMACEN) |

#### Reglas de Negocio
1. El nombre del espacio debe ser único
2. No se puede eliminar un espacio con actividades asociadas
3. Los espacios inactivos no aparecen en listados por defecto

### Criterios de Aceptación
- [ ] Entidad Espacio con enum TipoEspacio
- [ ] Repository con métodos de búsqueda por tipo
- [ ] Service con validaciones de negocio
- [ ] Controller con todos los endpoints
- [ ] DTOs de request y response
- [ ] Documentación Swagger completa
- [ ] Datos iniciales en data.sql
```

### Ejemplo 2: Servicio de Bloqueo de Guiones (TOPS)

```
## Solicitud de Desarrollo

### Módulo
TOPS

### Tipo de Desarrollo
Servicio + Endpoints

### Descripción
Implementar el sistema de bloqueo exclusivo para edición de guiones técnicos.

### Requisito de Referencia
RF-TOPS-5 - Control de Edición y Auditoría

### Especificaciones

#### Endpoints
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/guiones/{id}/lock` | Bloquear guion para edición |
| POST | `/api/guiones/{id}/unlock` | Desbloquear guion |
| GET | `/api/guiones/{id}/lock-status` | Verificar estado de bloqueo |

#### Reglas de Negocio
1. Solo un usuario puede tener bloqueado un guion a la vez
2. El bloqueo expira después de 30 minutos de inactividad
3. Un admin puede forzar el desbloqueo de cualquier guion
4. El usuario que bloquea debe ser el mismo que desbloquea (excepto admin)

### Criterios de Aceptación
- [ ] Campos lockedBy y lockedAt en entidad Guion
- [ ] Método lockGuion(guionId, usuarioId) en GuionService
- [ ] Método unlockGuion(guionId, usuarioId) en GuionService
- [ ] Verificación de timeout automático
- [ ] Excepción GuionLockedException cuando está bloqueado
- [ ] Registro en historial de cambios
```
