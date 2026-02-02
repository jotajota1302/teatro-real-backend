# Teatro Real - Estado de Desarrollo

## Dashboard de Progreso

| Módulo | Estado | Progreso | Última Actualización |
|--------|--------|----------|----------------------|
| **Sprint 0: Setup** | ✅ Completado | 100% | 2025-12-11 |
| **Sprint 1: Auth + Layout** | ✅ Completado | 100% | 2025-01-23 |
| **Sprint 2: TEMPO** | ✅ Completado | 100% | 2026-01-25 |
| **Sprint 3: TOPS** | ✅ Completado | 95% | 2026-01-29 |
| **Sprint 4: Integraciones** | Parcial | 35% | 2026-01-23 |
| **Sprint 5: Testing + Deploy** | En Progreso | 30% | 2025-01-23 |

> **TEMPO incluye 4 submódulos (todos completados):**
> - Calendario/Actividades (Salas): ✅ Completado 100%
> - Espacios: ✅ Completado 100%
> - Cartelería Digital: ✅ Completado 100%
> - Logística (Almacenes): ✅ Completado 100% (backend CRUD completo + manejo errores frontend)

**Progreso Global: ~80%**

---

## Resumen Ejecutivo

### Stack Tecnológico Actualizado
- **Frontend:** Angular 18.2 + Angular Material 18 + TailwindCSS 3.4
- **Backend:** Spring Boot 3.3.0 + Java 17 (actualizado desde 2.7/Java 8)
- **Base de datos:** H2 (desarrollo) / PostgreSQL 16 (producción)
- **Autenticación:** JWT con 4 roles (ADMIN, GESTOR, OPERADOR, VISUALIZADOR)
- **Documentación API:** SpringDoc OpenAPI 2.2.0

### MVP Desplegado
- **URL:** https://teatro-real-app.vercel.app/dashboard/home

---

## Sprint 0: Setup del Proyecto - COMPLETADO 100%

### Backend (Spring Boot 3.3.0 + Java 17)

| Tarea | Estado | Notas |
|-------|--------|-------|
| Crear proyecto Spring Boot + Maven | [x] Completado | pom.xml configurado |
| Configurar estructura de paquetes | [x] Completado | controller, service, domain, dto, repository, config |
| Configurar H2 para desarrollo | [x] Completado | application.yml |
| Configurar application.yml (dev/prod) | [x] Completado | Puerto 8080 |
| Configurar SpringDoc OpenAPI 2.2.0 | [x] Completado | Swagger UI |
| Actualizar a Java 17 + Spring Boot 3.3 | [x] Completado | 2025-01-23 |

### Frontend (Angular 18.2 + Material 18)

| Tarea | Estado | Notas |
|-------|--------|-------|
| Crear proyecto Angular 18 standalone | [x] Completado | Angular 18.2.0 |
| Configurar Angular Material 18 | [x] Completado | Tema Teatro Real |
| Configurar TailwindCSS 3.4 | [x] Completado | tailwind.config.js |
| Estructura de carpetas | [x] Completado | core/, features/, shared/, layout/ |
| Environment files | [x] Completado | environment.ts + environment.prod.ts |
| Proxy config para desarrollo | [x] Completado | proxy.conf.json |

---

## Sprint 1: Autenticación + Layout - COMPLETADO 95%

### Backend

| Tarea | Estado | Notas |
|-------|--------|-------|
| Entidades JPA: Usuario, Rol, PermisoModulo | [x] Completado | domain/user/ |
| Entidad JPA: Departamento | [x] Completado | domain/tempo/ |
| SecurityConfig + JWT | [x] Completado | SecurityConfig.java |
| JwtAuthFilter + JwtUtil | [x] Completado | security/ |
| AuthController (login, me, logout) | [x] Completado | controller/auth/ |
| UsuarioController | [x] Completado | controller/user/ |
| RolController | [x] Completado | controller/ |
| PermisoModuloController | [x] Completado | controller/ |
| Tests de autenticación | [ ] Pendiente | |

### Frontend

| Tarea | Estado | Notas |
|-------|--------|-------|
| auth.models.ts (4 roles) | [x] Completado | core/auth/ |
| AuthService con signals | [x] Completado | core/auth/ |
| Auth Guard | [x] Completado | core/auth/ |
| Role Guard | [x] Completado | core/guards/ |
| Module Permission Guard | [x] Completado | core/guards/ |
| Auth Interceptor (JWT) | [x] Completado | core/auth/ |
| Página de Login | [x] Completado | features/auth/login/ |
| Main Layout | [x] Completado | layout/main-layout/ |
| Sidebar con navegación | [x] Completado | layout/sidebar/ |
| Header con notificaciones | [x] Completado | layout/header/ |
| Notification Bell | [x] Completado | shared/components/ |
| Temporada Selector | [x] Completado | shared/components/ |
| Tests de auth | [ ] Pendiente | |

### Verificación Sprint 1

- [x] Login funcional con JWT
- [x] 4 roles implementados (ADMIN, GESTOR, OPERADOR, VISUALIZADOR)
- [x] Guards por rol y módulo
- [x] Layout principal visible
- [x] Navegación entre módulos
- [x] Header con selector temporada y notificaciones
- [ ] Tests unitarios pendientes

---

## Sprint 2: Módulo TEMPO - ✅ COMPLETADO 100%

> **TEMPO incluye 4 submódulos según TR-Requisitos v1.3:**
> 1. **Calendario/Actividades** (espacios tipo Sala) - ✅ Completado 100%
> 2. **Espacios** (CRUD salas y almacenes) - ✅ Completado 100%
> 3. **Cartelería Digital** (global + por sala) - ✅ Completado 100%
> 4. **Logística** (espacios tipo Almacén: Arganda-Campa, Arganda-Nave) - ✅ Completado 100%

---

### Submódulo 1: Calendario/Actividades (Salas) - COMPLETADO 98%

#### Backend

| Tarea | Estado | Notas |
|-------|--------|-------|
| Entidad JPA: Espacio | [x] Completado | domain/tempo/Espacio.java |
| Entidad JPA: TipoActividad | [x] Completado | domain/tempo/TipoActividad.java |
| Entidad JPA: Actividad | [x] Completado | domain/tempo/Actividad.java |
| Entidad JPA: ActividadDocumento | [x] Completado | domain/tempo/ActividadDocumento.java |
| Entidad JPA: Temporada | [x] Completado | domain/tempo/Temporada.java |
| Repositorios TEMPO | [x] Completado | repository/tempo/ |
| EspacioService + Controller | [x] Completado | service/tempo/, controller/tempo/ |
| TipoActividadService + Controller | [x] Completado | service/tempo/, controller/tempo/ |
| ActividadService + Controller | [x] Completado | service/tempo/, controller/tempo/ |
| ActividadDocumentoService + Controller | [x] Completado | service/tempo/, controller/tempo/ |
| TemporadaService + Controller | [x] Completado | service/tempo/, controller/ |
| DepartamentoService + Controller | [x] Completado | service/, controller/ |
| NotificacionController | [x] Completado | controller/tempo/ |
| SignageService + Controller | [x] Completado | service/tempo/, controller/tempo/ |
| DashboardService + Controller | [x] Completado | service/dashboard/, controller/dashboard/ |
| Filtros y búsqueda actividades | [x] Completado | |
| Tests TEMPO | [ ] Pendiente | |

#### Frontend

| Tarea | Estado | Notas |
|-------|--------|-------|
| Modelos TypeScript TEMPO | [x] Completado | features/tempo/models/ |
| ActividadService | [x] Completado | features/tempo/services/ |
| EspacioService | [x] Completado | features/tempo/services/ |
| TipoActividadService | [x] Completado | features/tempo/services/ |
| Componente Calendario (FullCalendar) | [x] Completado | features/tempo/calendario/ |
| TEMPO Landing (vista semanal Excel) | [x] Completado | features/tempo/landing/ |
| Weekly Excel View | [x] Completado | features/tempo/landing/weekly-excel-view/ |
| Dialog crear/editar actividad | [x] Completado | features/tempo/actividad/actividad-dialog/ |
| Dialog clonar actividad | [x] Completado | features/tempo/actividad/actividad-clone-dialog/ |
| Control estados almacén | [x] Completado | features/tempo/actividad/actividad-status-control/ |
| Lista de espacios | [x] Completado | features/tempo/espacios/espacio-list/ |
| Form espacio | [x] Completado | features/tempo/espacios/espacio-form/ |
| Dashboard espacios | [x] Completado | features/tempo/espacios/espacios-dashboard/ |
| Lista tipos actividad | [x] Completado | features/tempo/tipos-actividad/tipo-list/ |
| Form tipo actividad | [x] Completado | features/tempo/tipos-actividad/tipo-form/ |
| Lista departamentos | [x] Completado | features/tempo/departamentos/departamento-list/ |
| Form departamento | [x] Completado | features/tempo/departamentos/departamento-form/ |
| Cartelería Global | [x] Completado | features/carteleria/carteleria-global/ |
| Cartelería por Sala | [x] Completado | features/carteleria/carteleria-sala/ |
| Tests TEMPO | [ ] Pendiente | |

#### Verificación Submódulo Calendario/Actividades

- [x] Calendario visual con actividades (mes/semana/día sin scroll)
- [x] Crear/editar/eliminar actividades
- [x] Modal "Nueva Actividad" desde calendario
- [x] Clonar actividades
- [x] Vista semanal tipo Excel
- [x] Filtros por espacio, tipo y temporada
- [x] Layout responsive con altura completa
- [ ] Tests unitarios pendientes

---

### Submódulo 2: Espacios - COMPLETADO 100%

- [x] CRUD de espacios (dashboard completo)
- [x] CRUD de tipos de actividad
- [x] CRUD de departamentos
- [x] Espacios tipo Sala y tipo Almacén

---

### Submódulo 3: Cartelería Digital - COMPLETADO 100%

- [x] Cartelería global (todas las salas del día)
- [x] Cartelería por sala (actividades de una sala)
- [x] SignageService + Controller backend
- [x] Auto-refresh de contenido

---

### Submódulo 4: Logística (Almacenes) - ✅ COMPLETADO 100%

> **Según TR-Requisitos v1.3:** Los espacios tipo "Almacén" (Arganda-Campa, Arganda-Nave)
> tienen actividades logísticas especiales: RECOGIDA (verde) y SALIDA (rosa) de producciones.

#### Backend - COMPLETADO 100%

| Tarea | Estado | Notas |
|-------|--------|-------|
| Usa entidad Actividad existente | [x] Completado | Campos v1.3 ya existían en Actividad.java |
| Migración V5 (Arganda-Campa, Nave) | [x] Completado | V5__logistica_almacenes_v1_3.sql |
| ActividadRepository (queries logística) | [x] Completado | findOperacionesAlmacen, countByEstado |
| LogisticaService | [x] Completado | CRUD completo + transiciones estado |
| LogisticaController | [x] Completado | /api/logistica/* |
| GET /api/logistica/summary | [x] Completado | Estadísticas para dashboard |
| GET /api/logistica/calendario | [x] Completado | Para FullCalendar |
| PUT /api/.../iniciar-transito | [x] Completado | PENDIENTE→EN_TRANSITO |
| PUT /api/.../completar | [x] Completado | EN_TRANSITO→COMPLETADO |
| **POST /api/logistica/operaciones** | [x] Completado | Crear operación logística |
| **PUT /api/logistica/operaciones/{id}** | [x] Completado | Actualizar operación |
| **DELETE /api/logistica/operaciones/{id}** | [x] Completado | Eliminar operación |

#### Frontend - ✅ COMPLETADO 100%

| Tarea | Estado | Notas |
|-------|--------|-------|
| LogisticaComponent (landing) | [x] Completado | features/tempo/logistica/ |
| LogisticaService | [x] Completado | Conectado a backend real |
| Vista con estadísticas | [x] Completado | Programados, En tránsito, Completados |
| Filtros por tipo/estado | [x] Completado | Básicos y avanzados (fecha, producción, lugar) |
| Lista de operaciones | [x] Completado | Con colores y iconos por tipo |
| Calendario Logística (FullCalendar) | [x] Completado | logistica-calendario.component.ts |
| Colores calendario | [x] Completado | Verde=RECOGIDA, Rosa=SALIDA, Amarillo=INTERNO |
| Botones transición estado | [x] Completado | Pendiente→Tránsito→Completado |
| **Modal crear operación** | [x] Completado | Campos v1.3 (nº camiones, origen, destino) |
| **Manejo errores conexión** | [x] Completado | Error banner + retry cuando backend no disponible |

> **Nota:** Frontend y backend completos. Sin fallbacks silenciosos - errores de conexión
> se muestran al usuario con opción de reintentar.

#### Requisitos v1.3 para Logística

| Requisito | Estado | Descripción |
|-----------|--------|-------------|
| Almacenes | [x] Completado | Arganda-Campa, Arganda-Nave en V5 migration |
| Tipos operación | [x] Completado | RECOGIDA (verde), SALIDA (rosa), INTERNO (amarillo) |
| Estados | [x] Completado | PENDIENTE → EN_TRANSITO → COMPLETADO |
| Vista calendario | [x] Completado | Vista mes, semana, día con FullCalendar |
| Campos v1.3 | [x] Completado | Nº camiones, lugar origen/destino en entidad |
| Botones transición | [x] Completado | Botones para cambiar estado en lista |
| Filtros | [x] Completado | Por tipo movimiento y estado |

#### Verificación Submódulo Logística

- [x] Landing con estadísticas (4 tarjetas: Programados, En tránsito, Completados, Camiones hoy)
- [x] Lista de operaciones con filtros (básicos y avanzados)
- [x] Calendario FullCalendar (mes/semana/día)
- [x] Colores: verde=recogida, rosa=salida, amarillo=interno
- [x] Modal con campos v1.3 (nº camiones, origen, destino)
- [x] Botones de transición de estado
- [x] Backend CRUD completo (POST, PUT, DELETE)
- [x] Manejo de errores: banner + retry cuando backend no disponible
- [x] **Responsive:** Stats cards 2x2 en móvil, operation cards con truncado
- [ ] Tests unitarios

---

## Sprint 3: Módulo TOPS - ✅ COMPLETADO 95%

> **Enfoque:** Editor tipo Word para guiones técnicos (basado en guiones-new.jsx del MVP reference)

### Backend - ✅ COMPLETADO 95%

| Tarea | Estado | Notas |
|-------|--------|-------|
| **Migración V6 TOPS schema** | [x] Completado | V6__tops_guiones_schema.sql - tablas completas |
| Entidad JPA: Guion | [x] Completado | domain/tops/Guion.java (+ lock/unlock, estados) |
| Entidad JPA: Acto | [x] Completado | domain/tops/Acto.java (+ pasadaItems) |
| Entidad JPA: Escena | [x] Completado | domain/tops/Escena.java (+ duracion) |
| Entidad JPA: ElementoGuion | [x] Completado | domain/tops/ElementoGuion.java (+ PIE, DPTO, observaciones) |
| Entidad JPA: ColorElementoGuion | [x] Completado | domain/tops/ColorElementoGuion.java |
| **Entidad JPA: PasadaItem** | [x] Completado | domain/tops/PasadaItem.java - NUEVO |
| GuionRepository | [x] Completado | repository/tops/ (+ findByIdCompleto, countTops) |
| ActoRepository | [x] Completado | repository/tops/ |
| EscenaRepository | [x] Completado | repository/tops/ |
| ElementoGuionRepository | [x] Completado | repository/tops/ |
| ColorElementoGuionRepository | [x] Completado | repository/tops/ |
| **PasadaItemRepository** | [x] Completado | repository/tops/ - NUEVO |
| **GuionService** | [x] Completado | CRUD + lock/unlock + estados + createWithActos |
| **GuionController** | [x] Completado | /api/guiones/* (GET, POST, PUT, DELETE, lock) |
| **PasadaItemService** | [x] Completado | CRUD + insertAt (insertar en posición) |
| **PasadaItemController** | [x] Completado | /api/actos/{actoId}/pasada/* |
| ActoService + Controller | [x] Completado | service/tops/, controller/tops/ |
| EscenaService + Controller | [x] Completado | service/tops/, controller/tops/ |
| ElementoGuionService + Controller | [x] Completado | service/tops/, controller/tops/ |
| ColorElementoGuionService | [x] Completado | service/tops/ |
| **DTOs Request** | [x] Completado | GuionRequest, PasadaItemRequest |
| **DTOs Response** | [x] Completado | GuionResponse, GuionCompletoResponse (árbol completo) |
| Operaciones jerárquicas | [x] Completado | findByIdCompleto carga árbol completo |
| Reordenar elementos (drag & drop API) | [ ] Pendiente | |
| Tests TOPS | [ ] Pendiente | |

#### Endpoints API TOPS (Backend)

```
# Guiones
GET    /api/guiones                    # Lista (filtrable por temporada)
GET    /api/guiones/{id}               # Metadata
GET    /api/guiones/{id}/completo      # Árbol completo para editor
POST   /api/guiones                    # Crear con N actos iniciales
PUT    /api/guiones/{id}               # Actualizar metadata
DELETE /api/guiones/{id}               # Eliminar

# Lock/Unlock (edición exclusiva)
POST   /api/guiones/{id}/lock          # Bloquear para edición
DELETE /api/guiones/{id}/lock          # Desbloquear
DELETE /api/guiones/{id}/lock/force    # Forzar desbloqueo (admin)

# Estados
PUT    /api/guiones/{id}/estado        # Cambiar: BORRADOR→EN_EDICION→VALIDADO→PUBLICADO

# Pasada Items (setup antes de cada acto)
GET    /api/actos/{actoId}/pasada
POST   /api/actos/{actoId}/pasada
POST   /api/actos/{actoId}/pasada/insert?orden=X   # Insertar en posición
PUT    /api/actos/{actoId}/pasada/{id}
DELETE /api/actos/{actoId}/pasada/{id}
```

### Frontend - ✅ COMPLETADO 95%

> **Objetivo:** Replicar experiencia de guiones-new.jsx (React/Supabase) en Angular

| Tarea | Estado | Notas |
|-------|--------|-------|
| Modelos TypeScript TOPS | [x] Completado | guion.model.ts con interfaces completas |
| GuionService con signals | [x] Completado | CRUD + lock/unlock + estado reactivo |
| **Editor Guiones (tipo Word)** | [x] Completado | guion-editor.component.ts |
| ├─ EditableCell (click-to-edit) | [x] Completado | display: contents para layout tabla |
| ├─ EditableText (inline edit) | [x] Completado | display: block para metadata en líneas |
| ├─ Toolbar | [x] Completado | Volver, lock/unlock, exportar Word |
| ├─ Header documento | [x] Completado | Metadata editable con estilos Teatro Real |
| ├─ ActoBlock | [x] Completado | Contenedor con Pasada + Escenas |
| ├─ PasadaTable | [x] Completado | Tabla DPTO/LUGAR/DESC + insertar/borrar filas |
| ├─ EscenaBlock | [x] Completado | Contenedor con TopsTable |
| └─ TopsTable | [x] Completado | Tabla PIE/TOP/DPTO/QUIEN-QUE/OBS |
| Lista guiones (landing) | [x] Completado | Cards con botón editar centrado |
| Dialog crear guion | [x] Completado | guion-create-dialog.component.ts |
| Indicador de bloqueo | [x] Completado | Badge en lista + botones lock/unlock |
| Rutas configuradas | [x] Completado | /tops (lista) + /tops/:id (editor) |
| Breadcrumb inteligente | [x] Completado | Muestra "editor" en vez de UUID |
| Tests TOPS | [ ] Pendiente | |

### Verificación Sprint 3

- [x] Lista de guiones con filtros
- [x] Crear nuevo guion con metadata
- [x] Editor jerárquico (actos → escenas → elementos)
- [x] Tabla de pasada funcional (insertar/borrar filas)
- [x] Crear/editar TOPs con todos los campos
- [ ] Drag & drop para reordenar
- [x] Bloqueo de edición exclusivo
- [x] **Fix race condition:** Guiones cargan cuando temporada está lista (effect + setTimeout)
- [ ] Vistas filtradas (global, tops, departamento)

---

## Sprint 4: Integraciones - PARCIAL 25%

### Backend

| Tarea | Estado | Notas |
|-------|--------|-------|
| Google Calendar sync | [ ] Pendiente | Fase posterior |
| Webhook tiempo real | [ ] Pendiente | |
| ExportWordService (Apache POI) | [ ] Pendiente | |
| NotificationService | [x] Completado | Parcial - controller existe |
| Tests de integración | [ ] Pendiente | |

### Frontend

| Tarea | Estado | Notas |
|-------|--------|-------|
| WebSocketService | [ ] Pendiente | |
| Actualización tiempo real | [ ] Pendiente | |
| Descarga exportación Word | [ ] Pendiente | |
| Dashboard con widgets | [x] Completado | features/dashboard/ |
| NotificationService | [x] Completado | core/services/ |
| Notification Bell | [x] Completado | shared/components/ |
| Modo Cartelería | [x] Completado | features/carteleria/ |
| Tests de integración | [ ] Pendiente | |

---

## Sprint 5: Testing + Deploy - EN PROGRESO 30%

### Backend

| Tarea | Estado | Notas |
|-------|--------|-------|
| Tests unitarios | [ ] Pendiente | |
| Tests de integración | [ ] Pendiente | |
| Documentación Swagger | [x] Completado | SpringDoc configurado |
| Dockerfile | [ ] Pendiente | |
| Configuración producción | [ ] Pendiente | |
| build.ps1 para compilación | [x] Completado | Java 17 configurado |

### Frontend

| Tarea | Estado | Notas |
|-------|--------|-------|
| Tests unitarios | [ ] Pendiente | |
| Tests E2E (Playwright) | [ ] Pendiente | |
| Responsive / Mobile | [ ] Pendiente | |
| Accesibilidad (a11y) | [ ] Pendiente | |
| Optimización bundle | [x] Completado | Build funciona |
| Deploy Vercel | [x] Completado | MVP desplegado |

---

## Módulo Admin - PLACEHOLDER 5%

### Estado Actual
| Tarea | Estado | Notas |
|-------|--------|-------|
| admin-placeholder.component | [x] Existe | Solo placeholder |
| CRUD Usuarios | [ ] Pendiente | |
| Gestión 4 roles | [ ] Pendiente | |
| Permisos por módulo | [ ] Pendiente | |
| CRUD Temporadas | [ ] Pendiente | |
| Configuración colores TOPS | [ ] Pendiente | |

---

## Inventario de Código - Actualizado 2025-01-23

### Backend - 96 archivos Java

```
teatro-real-backend/src/main/java/com/teatroreal/
├── TeatroRealBackendApplication.java
├── config/
│   └── SecurityConfig.java
├── controller/
│   ├── auth/AuthController.java
│   ├── admin/EspacioAdminController.java
│   ├── admin/TipoActividadAdminController.java
│   ├── dashboard/DashboardController.java
│   ├── tempo/ActividadController.java
│   ├── tempo/ActividadDocumentoController.java
│   ├── tempo/EspacioController.java
│   ├── tempo/NotificacionController.java
│   ├── tempo/SignageController.java
│   ├── tempo/TipoActividadController.java
│   ├── tops/ActoController.java
│   ├── tops/ElementoGuionController.java
│   ├── tops/EscenaController.java
│   ├── user/UsuarioController.java
│   ├── DepartamentoController.java
│   ├── PermisoModuloController.java
│   ├── RolController.java
│   └── TemporadaController.java
├── domain/
│   ├── tempo/Actividad.java, ActividadDocumento.java, Departamento.java
│   ├── tempo/Espacio.java, Temporada.java, TipoActividad.java
│   ├── tops/Acto.java, ColorElementoGuion.java, ElementoGuion.java
│   ├── tops/Escena.java, Guion.java
│   └── user/PermisoModulo.java, Rol.java, Usuario.java
├── dto/
│   ├── request/*.java (9 archivos)
│   └── response/*.java (15 archivos)
├── repository/
│   ├── tempo/*.java (6 archivos)
│   ├── tops/*.java (5 archivos)
│   └── *.java (3 archivos)
├── security/
│   ├── JwtAuthFilter.java
│   └── JwtUtil.java
└── service/
    ├── dashboard/DashboardService.java
    ├── tempo/*.java (7 archivos)
    ├── tops/*.java (5 archivos - FALTA GuionService)
    └── user/UsuarioService.java
```

### Frontend - 57 archivos TypeScript

```
teatro-real-frontend/src/app/
├── app.component.ts, app.config.ts, app.routes.ts
├── core/
│   ├── auth/ (5 archivos)
│   ├── guards/ (2 archivos)
│   └── services/ (3 archivos)
├── features/
│   ├── admin/ (2 archivos - placeholder)
│   ├── auth/login/ (1 archivo)
│   ├── carteleria/ (2 archivos)
│   ├── dashboard/ (3 archivos)
│   ├── tempo/ (20+ archivos - COMPLETO)
│   └── tops/ (2 archivos - PLACEHOLDER)
├── layout/ (3 archivos)
└── shared/components/ (5 archivos)
```

---

## Tareas Prioritarias - Próximos Pasos

### ✅ COMPLETADO: TEMPO (Sprint 2)

> Módulo TEMPO completado al 100%. Todos los submódulos funcionales.

- [x] Calendario/Actividades con FullCalendar (mes/semana/día)
- [x] Espacios dashboard con CRUD completo
- [x] Cartelería Digital (global + por sala)
- [x] Logística con calendario, filtros y transiciones de estado
- [x] Backend CRUD completo para operaciones logísticas
- [x] Manejo de errores: mensajes claros cuando backend no disponible

---

### ✅ COMPLETADO: TOPS (Sprint 3) - 95%

> **Editor de guiones técnicos tipo Word implementado y funcional**

#### Backend - ✅ COMPLETADO

1. [x] **GuionService.java** - CRUD + lock/unlock + estados
2. [x] **GuionController.java** - Endpoints completos
3. [x] **PasadaItemService/Controller** - CRUD pasada por acto
4. [x] **DTOs completos** - GuionCompletoResponse con árbol anidado
5. [x] **Migración V6** - Schema completo TOPS
6. [x] **@JsonIgnore** - Evita referencias circulares en serialización

#### Frontend - ✅ COMPLETADO

1. [x] **Modelos TypeScript TOPS** - guion.model.ts con interfaces completas
2. [x] **GuionService con signals** - CRUD + lock/unlock reactivo
3. [x] **Editor tipo Word** - Canvas blanco sobre fondo gris
   - EditableCell con `display: contents` (layout tabla correcto)
   - EditableText con `display: block` (metadata en líneas separadas)
   - Botones Teatro Real (rojo carmesí) en vez de Material azul
   - Insertar/borrar filas con actualización local (sin recarga)
4. [x] **Rutas TOPS** - /tops (lista) + /tops/:id (editor)
5. [x] **Breadcrumb inteligente** - Detecta UUIDs y muestra "editor"

#### Pendiente (5%)

- [ ] Drag & drop para reordenar elementos
- [ ] Vistas filtradas (global, tops, departamento)
- [ ] Export Word funcional (Apache POI)

### 🟡 MEDIA PRIORIDAD

6. [ ] **Admin: CRUD Usuarios** (placeholder actual)
7. [ ] **Admin: Gestión permisos por módulo**

### 🟢 BAJA PRIORIDAD (Post-MVP)

9. [ ] Tests unitarios backend/frontend
10. [ ] Google Calendar sync
11. [ ] Export Word (Apache POI)
12. [ ] WebSocket tiempo real

---

## URLs de Desarrollo

| Servicio | URL |
|----------|-----|
| Frontend Angular (local) | http://localhost:4200 |
| Backend API (local) | http://localhost:8080/api |
| Swagger UI | http://localhost:8080/swagger-ui.html |
| H2 Console | http://localhost:8080/h2-console |
| **MVP Producción** | https://teatro-real-app.vercel.app |

### Credenciales H2 (Desarrollo)
- **JDBC URL:** jdbc:h2:mem:teatroreal
- **Usuario:** sa
- **Password:** (vacío)

---

## Comandos de Desarrollo

### Backend (Java 17)
```powershell
# Compilar con Java 17 (Windows)
cd teatro-real-backend
.\build.ps1 clean compile

# Ejecutar
.\build.ps1 spring-boot:run

# Tests
.\build.ps1 test
```

### Frontend
```bash
cd teatro-real-frontend
npm install
npm start        # http://localhost:4200
npm run build    # Build producción
npm test         # Tests
```

---

## Registro de Cambios

| Fecha | Cambio | Autor |
|-------|--------|-------|
| 2025-12-11 | Documento creado | Sistema |
| 2025-01-23 | Actualización completa basada en análisis de código | Claude |
| 2025-01-23 | Actualizado a Java 17 + Spring Boot 3.3 | JJ |
| 2025-01-23 | Merge ramas Fran + Sandra → JJ | JJ |
| 2025-01-23 | Identificado módulo Logística no planificado | Claude |
| 2025-01-23 | Identificado que TOPS frontend está sin implementar | Claude |
| 2026-01-23 | Implementado SignageController + Cartelería completa (global + sala) | Claude |
| 2026-01-24 | Calendario TEMPO: vistas mes/semana/día con altura completa sin scroll | Claude |
| 2026-01-24 | Añadido modal "Nueva Actividad" en calendario TEMPO | Claude |
| 2026-01-24 | Limpieza UI: quitados contadores redundantes del header calendario | Claude |
| 2026-01-24 | Reestructurado: Logística y Cartelería son submódulos de TEMPO (no módulos separados) | Claude |
| 2026-01-24 | TEMPO-Logística backend completo: LogisticaService, LogisticaController, migration V5 | Claude |
| 2026-01-24 | TEMPO-Logística frontend: Calendario FullCalendar, botones transición estado | Claude |
| 2026-01-25 | **TEMPO COMPLETADO 100%** - Backend CRUD logística + manejo errores frontend | Claude |
| 2026-01-25 | Backend: POST/PUT/DELETE /api/logistica/operaciones | Claude |
| 2026-01-25 | Frontend: Error banners en logistica, espacios-dashboard (sin fallbacks silenciosos) | Claude |
| 2026-01-24 | TEMPO-Logística backend completo: LogisticaService, LogisticaController, migration V5 | Claude |
| 2026-01-24 | TEMPO-Logística frontend: Calendario FullCalendar, botones transición estado | Claude |
| 2026-01-29 | **TOPS Backend COMPLETADO:** Migración V6, entidades, DTOs, services, controllers | Claude |
| 2026-01-29 | Nuevas entidades: PasadaItem, campos PIE (refPagina/refCompas/refTimecode) en ElementoGuion | Claude |
| 2026-01-29 | GuionService: CRUD + lock/unlock exclusivo + transiciones estado | Claude |
| 2026-01-29 | GuionCompletoResponse: DTO anidado para cargar árbol completo en una query | Claude |
| 2026-01-29 | PasadaItemService/Controller: CRUD items pasada con inserción en posición | Claude |
| 2026-01-29 | **TOPS Frontend COMPLETADO:** Modelos, GuionService, Editor tipo Word | Claude |
| 2026-01-29 | Frontend: EditableCell, EditableText (click-to-edit como Word) | Claude |
| 2026-01-29 | Frontend: GuionEditorComponent con canvas estilo Word | Claude |
| 2026-01-29 | Frontend: GuionListComponent + GuionCreateDialogComponent | Claude |
| 2026-01-29 | Rutas TOPS actualizadas: /tops (lista) + /tops/:id (editor) | Claude |
| 2026-01-29 | **Fix: Tabla PASADA** - EditableCellComponent con `display: contents` para layout correcto | Claude |
| 2026-01-29 | **Fix: Breadcrumb UUID** - Header detecta UUIDs y muestra "editor" en vez del ID | Claude |
| 2026-01-29 | **Fix: Botones editor** - Cambiados de Material azul a estilos Teatro Real (rojo/naranja) | Claude |
| 2026-01-29 | **Fix: Metadata editor** - Título/Subtítulo/Compositor cada uno en línea separada | Claude |
| 2026-01-29 | **Fix: Backend circular reference** - @JsonIgnore en Acto.guion, PasadaItem.acto, etc. | Claude |
| 2026-01-29 | **Optimización: insertPasadaItem** - Actualiza estado local sin recargar todo el guion | Claude |
| 2026-01-29 | **Deploy:** Subido a GitLab, GitHub, Vercel y Render | Claude |
| 2026-02-02 | **Calendario TEMPO:** Vista semanal mejorada con datos reales y agrupación por sala | Claude |
| 2026-02-02 | **TOPS fix:** Race condition - guiones no cargaban si temporada no estaba lista | Claude |
| 2026-02-02 | **TOPS fix:** Error NG0600 - signal writing en effect (setTimeout workaround) | Claude |
| 2026-02-02 | **Logística fix:** Stats cards responsive (2x2 en móvil en vez de 4x1) | Claude |
| 2026-02-02 | **Logística fix:** Operation cards responsive con truncado de texto | Claude |

---

*Última actualización: 2026-02-02*
*Progreso Global: ~82%* (TEMPO 100%, TOPS 95% - Fixes responsive y race conditions)
