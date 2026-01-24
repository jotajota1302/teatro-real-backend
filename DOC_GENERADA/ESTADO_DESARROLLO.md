# Teatro Real - Estado de Desarrollo

## Dashboard de Progreso

| Módulo | Estado | Progreso | Última Actualización |
|--------|--------|----------|----------------------|
| **Sprint 0: Setup** | Completado | 100% | 2025-12-11 |
| **Sprint 1: Auth + Layout** | Completado | 95% | 2025-01-23 |
| **Sprint 2: TEMPO** | En Progreso | 92% | 2026-01-24 |
| **Sprint 3: TOPS** | En Progreso | 15% | 2025-01-23 |
| **Sprint 4: Integraciones** | Parcial | 35% | 2026-01-23 |
| **Sprint 5: Testing + Deploy** | En Progreso | 30% | 2025-01-23 |

> **TEMPO incluye 4 submódulos:**
> - Calendario/Actividades (Salas): ✅ Completado 98%
> - Espacios: ✅ Completado 100%
> - Cartelería Digital: ✅ Completado 100%
> - Logística (Almacenes): ✅ Completado 95% (falta dialog crear/editar operación)

**Progreso Global: ~55%**

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

## Sprint 2: Módulo TEMPO - EN PROGRESO 75%

> **IMPORTANTE:** TEMPO incluye 4 submódulos según TR-Requisitos v1.3:
> 1. **Calendario/Actividades** (espacios tipo Sala) - ✅ Completado
> 2. **Espacios** (CRUD salas y almacenes) - ✅ Completado
> 3. **Cartelería Digital** (global + por sala) - ✅ Completado
> 4. **Logística** (espacios tipo Almacén: Arganda-Campa, Arganda-Nave) - ⏳ En Progreso

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

### Submódulo 4: Logística (Almacenes) - COMPLETADO 95%

> **Según TR-Requisitos v1.3:** Los espacios tipo "Almacén" (Arganda-Campa, Arganda-Nave)
> tienen actividades logísticas especiales: RECOGIDA (verde) y SALIDA (rosa) de producciones.

#### Backend - COMPLETADO 100%

| Tarea | Estado | Notas |
|-------|--------|-------|
| Usa entidad Actividad existente | [x] Completado | Campos v1.3 ya existían en Actividad.java |
| Migración V5 (Arganda-Campa, Nave) | [x] Completado | V5__logistica_almacenes_v1_3.sql |
| ActividadRepository (queries logística) | [x] Completado | findOperacionesAlmacen, countByEstado |
| LogisticaService | [x] Completado | CRUD + transiciones estado |
| LogisticaController | [x] Completado | /api/logistica/* |
| GET /api/logistica/summary | [x] Completado | Estadísticas para dashboard |
| GET /api/logistica/calendario | [x] Completado | Para FullCalendar |
| PUT /api/.../iniciar-transito | [x] Completado | PENDIENTE→EN_TRANSITO |
| PUT /api/.../completar | [x] Completado | EN_TRANSITO→COMPLETADO |

#### Frontend - COMPLETADO 90%

| Tarea | Estado | Notas |
|-------|--------|-------|
| LogisticaComponent (landing) | [x] Completado | features/tempo/logistica/ |
| LogisticaService | [x] Completado | Conectado a backend real |
| Vista con estadísticas | [x] Completado | Programados, En tránsito, Completados |
| Filtros por tipo/estado | [x] Completado | |
| Lista de operaciones | [x] Completado | |
| Calendario Logística (FullCalendar) | [x] Completado | logistica-calendario.component.ts |
| Colores calendario | [x] Completado | Verde=RECOGIDA, Rosa=SALIDA, Amarillo=INTERNO |
| Botones transición estado | [x] Completado | Pendiente→Tránsito→Completado |
| **Dialog crear operación** | [ ] **PENDIENTE** | Campos v1.3 (nº camiones, origen, destino) |

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

- [x] Landing con estadísticas
- [x] Lista de operaciones con filtros
- [x] Calendario FullCalendar (mes/semana/día)
- [x] Colores: verde=recogida, rosa=salida, amarillo=interno
- [ ] Dialog con campos v1.3 (modal para crear/editar) - pendiente
- [x] Botones de transición de estado
- [x] Backend completo (service, controller, repository queries)
- [ ] Tests unitarios

---

## Sprint 3: Módulo TOPS - EN PROGRESO 15%

### Backend

| Tarea | Estado | Notas |
|-------|--------|-------|
| Entidad JPA: Guion | [x] Completado | domain/tops/Guion.java |
| Entidad JPA: Acto | [x] Completado | domain/tops/Acto.java |
| Entidad JPA: Escena | [x] Completado | domain/tops/Escena.java |
| Entidad JPA: ElementoGuion | [x] Completado | domain/tops/ElementoGuion.java |
| Entidad JPA: ColorElementoGuion | [x] Completado | domain/tops/ColorElementoGuion.java |
| GuionRepository | [x] Completado | repository/tops/ |
| ActoRepository | [x] Completado | repository/tops/ |
| EscenaRepository | [x] Completado | repository/tops/ |
| ElementoGuionRepository | [x] Completado | repository/tops/ |
| ColorElementoGuionRepository | [x] Completado | repository/tops/ |
| **GuionService** | **[ ] PENDIENTE** | **CRÍTICO - Falta implementar** |
| **GuionController** | **[ ] PENDIENTE** | **CRÍTICO - Falta implementar** |
| ActoService + Controller | [x] Completado | service/tops/, controller/tops/ |
| EscenaService + Controller | [x] Completado | service/tops/, controller/tops/ |
| ElementoGuionService + Controller | [x] Completado | service/tops/, controller/tops/ |
| ColorElementoGuionService | [x] Completado | service/tops/ |
| Operaciones jerárquicas | [ ] Pendiente | |
| Reordenar elementos (drag & drop API) | [ ] Pendiente | |
| Vistas (completa, tops, departamento) | [ ] Pendiente | |
| HistorialService (auditoría) | [ ] Pendiente | |
| Tests TOPS | [ ] Pendiente | |

### Frontend - **CASI TODO PENDIENTE**

| Tarea | Estado | Notas |
|-------|--------|-------|
| Modelos TypeScript TOPS | [ ] Pendiente | |
| GuionService | [ ] Pendiente | |
| ElementoService | [ ] Pendiente | |
| **TOPS Landing (2 listas)** | **[ ] PENDIENTE** | **Solo hay placeholder** |
| Lista de guiones | [ ] Pendiente | |
| Detalle guion (metadata) | [ ] Pendiente | |
| Form crear/editar guion | [ ] Pendiente | |
| **Editor principal** | **[ ] PENDIENTE** | **Componente principal** |
| Panel de Acto (expandible) | [ ] Pendiente | |
| Panel de Escena | [ ] Pendiente | |
| Elemento item (TOP, E, M, etc.) | [ ] Pendiente | |
| Tabla de Pasada | [ ] Pendiente | |
| Dialog crear/editar TOP | [ ] Pendiente | |
| Drag & drop para reordenar | [ ] Pendiente | |
| Indicador de bloqueo | [ ] Pendiente | |
| Vista solo TOPs | [ ] Pendiente | |
| Vista por departamento | [ ] Pendiente | |
| Tests TOPS | [ ] Pendiente | |

### Verificación Sprint 3

- [ ] Lista de guiones con filtros
- [ ] Crear nuevo guion con metadata
- [ ] Editor jerárquico (actos → escenas → elementos)
- [ ] Tabla de pasada funcional
- [ ] Crear/editar TOPs con todos los campos
- [ ] Drag & drop para reordenar
- [ ] Bloqueo de edición exclusivo
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

### ALTA PRIORIDAD (TEMPO-Logística) - Esta Semana ✅ CASI COMPLETO

> Submódulo Logística de TEMPO prácticamente completado

1. [x] **Backend: Usa entidad Actividad existente + migration V5**
   - Campos v1.3 ya existían en Actividad.java
   - V5__logistica_almacenes_v1_3.sql añade Arganda-Campa/Nave

2. [x] **Backend: LogisticaService + Controller**
   - Queries específicas para almacenes en ActividadRepository
   - Transiciones de estado (PUT /iniciar-transito, /completar)
   - GET /calendario para FullCalendar

3. [x] **Frontend: Calendario Logística (FullCalendar)**
   - Vista mes/semana/día
   - Colores: verde=RECOGIDA, rosa=SALIDA, amarillo=INTERNO
   - Ruta: /tempo/movimientos/calendario

4. [ ] **Frontend: Dialog crear operación v1.3**
   - Campos: nº camiones, origen, destino, almacén
   - Validaciones (PENDIENTE)

5. [x] **Frontend: Botones transición estado**
   - Pendiente → En tránsito → Completado
   - Actualización en tiempo real

### MEDIA PRIORIDAD (TOPS) - Próxima Semana

6. [ ] **Backend: Crear GuionService.java**
   - CRUD guiones
   - Lock/unlock para edición
   - Filtro por temporada

7. [ ] **Backend: Crear GuionController.java**
   - GET/POST/PUT/DELETE /api/guiones
   - POST /api/guiones/{id}/lock
   - POST /api/guiones/{id}/unlock

8. [ ] **Frontend: Crear TOPS Landing**
   - Lista guiones de temporada
   - Lista mis guiones

9. [ ] **Frontend: Crear Editor TOPS**
   - Panel actos expandible
   - Panel escenas
   - Elementos con colores

### BAJA PRIORIDAD

10. [ ] **Admin: CRUD Usuarios**
11. [ ] **Admin: Gestión permisos**
12. [ ] Tests unitarios backend/frontend
13. [ ] Google Calendar sync
14. [ ] Export Word

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

---

*Última actualización: 2026-01-24*
*Progreso Global: ~55%* (TEMPO 92% completado)
