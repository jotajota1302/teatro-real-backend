# Template: Desarrollo de Feature Completa (Fullstack)

## Instrucciones de Uso
Usa esta template cuando necesites desarrollar una funcionalidad completa que incluya backend y frontend.

---

## PROMPT

```
## Contexto del Proyecto

Estoy desarrollando el **Sistema de Gestión del Teatro Real**, una aplicación fullstack con:

### Backend
- **Java 8** + **Spring Boot 2.7.18**
- **Spring Data JPA** + **H2** (desarrollo) / **PostgreSQL** (producción)
- **SpringDoc OpenAPI 1.7.0** para documentación
- Base URL API: `http://localhost:8080/api`

### Frontend
- **Angular 18.2** con Standalone Components
- **TailwindCSS 3.4** para estilos
- **Signals** para gestión de estado
- Base URL: `http://localhost:4200`

### Módulos del Sistema
| Módulo | Descripción |
|--------|-------------|
| **ADMIN** | Usuarios, roles, departamentos, configuración |
| **TEMPO** | Actividades, calendario, espacios |
| **TOPS** | Guiones técnicos, TOPs, pasadas |

---

## Solicitud de Feature

### Nombre de la Feature
[Nombre descriptivo de la funcionalidad]

### Módulo
[ADMIN | TEMPO | TOPS]

### Requisito de Referencia
[RF-TEMPO-X | RF-TOPS-X | RF-ADMIN-X] - [Nombre del requisito]

### Descripción General
[Describe la funcionalidad completa desde la perspectiva del usuario]

### Historia de Usuario
```
Como [rol de usuario]
quiero [acción/funcionalidad]
para [beneficio/objetivo]
```

---

## Especificación Backend

### Entidades
| Entidad | Campos Principales | Relaciones |
|---------|-------------------|------------|
| [Entidad1] | [campos] | [relaciones] |

### Endpoints API
| Método | Endpoint | Descripción | Request | Response |
|--------|----------|-------------|---------|----------|
| [GET] | `/api/[recurso]` | [desc] | [params] | [tipo] |
| [POST] | `/api/[recurso]` | [desc] | [body] | [tipo] |

### Reglas de Negocio Backend
1. [Regla 1]
2. [Regla 2]

### Validaciones
- [Validación 1]
- [Validación 2]

---

## Especificación Frontend

### Componentes a Crear
| Componente | Ruta | Descripción |
|------------|------|-------------|
| [Componente1] | `features/[módulo]/[comp]/` | [desc] |

### Servicios
| Servicio | Métodos | Descripción |
|----------|---------|-------------|
| [Service1] | [métodos] | [desc] |

### Rutas
| Path | Componente | Guard |
|------|------------|-------|
| `/[ruta]` | [Componente] | [Guard] |

### Diseño UI
[Descripción del diseño, wireframe o mockup si existe]

### Estados de la UI
- **Loading:** [descripción]
- **Empty:** [descripción]
- **Error:** [descripción]
- **Success:** [descripción]

---

## Flujo de Datos

```
[Usuario] -> [Componente] -> [Service] -> [API Backend]
                                              |
                                              v
                                        [Controller]
                                              |
                                              v
                                         [Service]
                                              |
                                              v
                                        [Repository]
                                              |
                                              v
                                         [Database]
```

---

## Criterios de Aceptación

### Backend
- [ ] Entidades creadas con relaciones
- [ ] Repository con queries necesarias
- [ ] Service con lógica de negocio
- [ ] Controller con endpoints documentados
- [ ] DTOs de request y response
- [ ] Validaciones implementadas
- [ ] Manejo de excepciones
- [ ] Tests unitarios

### Frontend
- [ ] Componentes standalone creados
- [ ] Service con signals
- [ ] Integración con API
- [ ] Manejo de estados (loading, error, empty)
- [ ] Validación de formularios
- [ ] Estilos con TailwindCSS
- [ ] Responsive design
- [ ] Navegación configurada

### Integración
- [ ] Frontend consume API correctamente
- [ ] Manejo de errores end-to-end
- [ ] Flujo completo funcional

---

## Orden de Implementación Sugerido

1. **Backend - Modelo:** Entidades y migraciones
2. **Backend - Repositorio:** Queries JPA
3. **Backend - Servicio:** Lógica de negocio
4. **Backend - Controller:** Endpoints REST
5. **Backend - Tests:** Unitarios y de integración
6. **Frontend - Modelos:** Interfaces TypeScript
7. **Frontend - Servicio:** Llamadas HTTP + Signals
8. **Frontend - Componentes:** UI + lógica
9. **Frontend - Rutas:** Navegación
10. **Integración:** Pruebas end-to-end

---

## Archivos de Referencia
- Requisitos: DOC_GENERADA/SINTESIS_REQUISITOS_FINAL.md
- Modelo de datos: DOC_GENERADA/PLAN_IMPLEMENTACION_BACKEND.md (sección 2)
- API Contract: DOC_GENERADA/SINTESIS_REQUISITOS_FINAL.md (sección 9)
- Componentes: DOC_GENERADA/PLAN_IMPLEMENTACION_FRONTEND.md (sección 6)
```

---

## Ejemplo Completo: CRUD de Espacios

```
## Solicitud de Feature

### Nombre de la Feature
Gestión de Espacios del Teatro

### Módulo
TEMPO

### Requisito de Referencia
RF-TEMPO-1 - CRUD de Actividades (dependencia: espacios)

### Descripción General
Permitir a los administradores gestionar los espacios del teatro (salas de ensayo, escenarios, almacenes), incluyendo crear, editar, listar y eliminar espacios.

### Historia de Usuario
```
Como Administrador
quiero gestionar los espacios del teatro
para mantener actualizado el catálogo de salas y almacenes disponibles
```

---

## Especificación Backend

### Entidades
| Entidad | Campos Principales | Relaciones |
|---------|-------------------|------------|
| Espacio | id, nombre, tipo, googleCalendarId, capacidad, ubicacion, activo, orden | 1:N con Actividad |

### Endpoints API
| Método | Endpoint | Descripción | Request | Response |
|--------|----------|-------------|---------|----------|
| GET | `/api/espacios` | Listar todos | ?activo=true | List<EspacioDTO> |
| GET | `/api/espacios/{id}` | Obtener uno | - | EspacioDTO |
| POST | `/api/espacios` | Crear | EspacioRequest | EspacioDTO |
| PUT | `/api/espacios/{id}` | Actualizar | EspacioRequest | EspacioDTO |
| DELETE | `/api/espacios/{id}` | Eliminar | - | void |
| GET | `/api/espacios/tipo/{tipo}` | Por tipo | - | List<EspacioDTO> |

### Reglas de Negocio Backend
1. El nombre del espacio debe ser único
2. No se puede eliminar un espacio con actividades futuras asociadas
3. Al desactivar un espacio, se mantienen las actividades pasadas
4. El tipo puede ser SALA o ALMACEN

### Validaciones
- nombre: obligatorio, max 100 caracteres, único
- tipo: obligatorio, enum válido
- capacidad: opcional, >= 0
- googleCalendarId: opcional, formato válido

---

## Especificación Frontend

### Componentes a Crear
| Componente | Ruta | Descripción |
|------------|------|-------------|
| EspacioListComponent | `features/tempo/espacios/espacio-list/` | Tabla de espacios |
| EspacioFormComponent | `features/tempo/espacios/espacio-form/` | Formulario crear/editar |

### Servicios
| Servicio | Métodos | Descripción |
|----------|---------|-------------|
| EspacioService | getAll, getById, create, update, delete, getByTipo | CRUD de espacios |

### Rutas
| Path | Componente | Guard |
|------|------------|-------|
| `/tempo/espacios` | EspacioListComponent | AuthGuard |
| `/tempo/espacios/nuevo` | EspacioFormComponent | AuthGuard, RoleGuard(ADMIN) |
| `/tempo/espacios/:id/editar` | EspacioFormComponent | AuthGuard, RoleGuard(ADMIN) |

### Diseño UI
- Tabla con columnas: Nombre, Tipo, Capacidad, Estado, Acciones
- Botón "Nuevo Espacio" (solo admin)
- Filtro por tipo (tabs: Todos, Salas, Almacenes)
- Switch para mostrar/ocultar inactivos
- Acciones: Editar, Activar/Desactivar, Eliminar

### Estados de la UI
- **Loading:** Skeleton de tabla
- **Empty:** "No hay espacios configurados"
- **Error:** Toast con mensaje de error
- **Success:** Toast "Espacio guardado correctamente"

---

## Criterios de Aceptación

### Backend
- [x] Entidad Espacio con enum TipoEspacio
- [x] EspacioRepository con findByTipo, findByActivo
- [x] EspacioService con validaciones
- [x] EspacioController con 6 endpoints
- [x] EspacioRequest y EspacioResponse DTOs
- [x] GlobalExceptionHandler para errores
- [x] Datos iniciales de espacios del Teatro Real

### Frontend
- [x] EspacioListComponent con tabla y filtros
- [x] EspacioFormComponent con validación
- [x] EspacioService con signals
- [x] Integración completa con API
- [x] Confirmación antes de eliminar
- [x] Feedback visual (toasts)
- [x] Responsive en tablet y desktop

### Integración
- [x] CRUD completo funcional
- [x] Errores mostrados correctamente
- [x] Navegación entre list y form
```
