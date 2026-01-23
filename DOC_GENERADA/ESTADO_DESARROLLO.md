# Teatro Real - Estado de Desarrollo

## Dashboard de Progreso

| Módulo | Estado | Progreso | Última Actualización |
|--------|--------|----------|----------------------|
| **Sprint 0: Setup** | Completado | 100% | 2025-12-11 |
| **Sprint 1: Auth + Layout** | Completado | 95% | 2025-01-23 |
| **Sprint 2: TEMPO** | Casi Completado | 80% | 2025-01-23 |
| **Sprint 3: TOPS** | En Progreso | 15% | 2025-01-23 |
| **Sprint 4: Integraciones** | Parcial | 25% | 2025-01-23 |
| **Sprint 5: Testing + Deploy** | En Progreso | 30% | 2025-01-23 |
| **EXTRA: Logística** | Implementado | 70% | 2025-01-23 |

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

## Sprint 2: Módulo TEMPO - COMPLETADO 80%

### Backend

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
| SignageService | [x] Completado | service/tempo/ |
| DashboardService + Controller | [x] Completado | service/dashboard/, controller/dashboard/ |
| Filtros y búsqueda actividades | [x] Completado | |
| Tests TEMPO | [ ] Pendiente | |

### Frontend

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

### Verificación Sprint 2

- [x] Calendario visual con actividades
- [x] Crear/editar/eliminar actividades
- [x] Clonar actividades
- [x] Estados de almacén (PENDIENTE, EN_TRANSITO, COMPLETADO)
- [x] Vista semanal tipo Excel
- [x] Filtros por espacio y tipo
- [x] CRUD de espacios
- [x] CRUD de tipos de actividad
- [x] CRUD de departamentos
- [x] Cartelería global y por sala
- [ ] Tests unitarios pendientes

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

## MÓDULO EXTRA: Logística - NO PLANIFICADO ORIGINALMENTE

> **NOTA:** Este módulo fue implementado pero NO estaba en la planificación original.
> Debe añadirse formalmente al plan de desarrollo.

### Frontend - IMPLEMENTADO 70%

| Tarea | Estado | Notas |
|-------|--------|-------|
| LogisticaComponent | [x] Completado | features/tempo/logistica/ |
| LogisticaService | [x] Completado | features/tempo/logistica/ |
| Vista con estadísticas | [x] Completado | Programados, En tránsito, Completados |
| Filtros por tipo/estado | [x] Completado | |
| Lista de operaciones | [x] Completado | |
| MovimientosListComponent | [x] Completado | features/tempo/movimientos/ |
| ProduccionesListComponent | [x] Completado | features/tempo/producciones/ |
| Crear nuevo movimiento | [ ] Pendiente | Botón existe pero no funcional |
| Ver detalle operación | [ ] Pendiente | |
| Iniciar operación | [ ] Pendiente | |

### Backend - PENDIENTE

| Tarea | Estado | Notas |
|-------|--------|-------|
| Entidad Operacion/Movimiento | [ ] Pendiente | |
| Repository | [ ] Pendiente | |
| Service | [ ] Pendiente | |
| Controller | [ ] Pendiente | |

### Rutas Configuradas

- `/tempo/movimientos` → LogisticaComponent
- `/tempo/producciones` → ProduccionesListComponent

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

### ALTA PRIORIDAD (TOPS)

1. [ ] **Backend: Crear GuionService.java**
   - CRUD guiones
   - Lock/unlock para edición
   - Filtro por temporada

2. [ ] **Backend: Crear GuionController.java**
   - GET /api/guiones
   - GET /api/guiones/{id}
   - POST /api/guiones
   - PUT /api/guiones/{id}
   - DELETE /api/guiones/{id}
   - POST /api/guiones/{id}/lock
   - POST /api/guiones/{id}/unlock

3. [ ] **Frontend: Crear TOPS Landing**
   - Lista guiones de temporada
   - Lista mis guiones

4. [ ] **Frontend: Crear Editor TOPS**
   - Panel actos expandible
   - Panel escenas
   - Elementos con colores

### MEDIA PRIORIDAD

5. [ ] **Documentar módulo Logística en plan**
6. [ ] **Implementar backend Logística**
7. [ ] **Admin: CRUD Usuarios**
8. [ ] **Admin: Gestión permisos**

### BAJA PRIORIDAD

9. [ ] Tests unitarios backend
10. [ ] Tests unitarios frontend
11. [ ] Google Calendar sync
12. [ ] Export Word

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

---

*Última actualización: 2025-01-23*
*Progreso Global: ~55%*
