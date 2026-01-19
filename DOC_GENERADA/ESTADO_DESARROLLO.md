# Teatro Real - Estado de Desarrollo v2

## Dashboard de Progreso

| Módulo | Estado | Progreso | Última Actualización |
|--------|--------|----------|----------------------|
| **Sprint 0: Setup** | Completado | 100% | 2025-12-11 |
| **Sprint 1: Auth + Layout** | En progreso | 50% | 2025-12-11 |
| **Sprint 2: TEMPO** | En progreso | 20% | 2025-12-11 |
| **Sprint 3: TOPS** | Pendiente | 3% | 2025-12-11 |
| **Sprint 4: Integraciones v2** | Pendiente | 0% | - |
| **Sprint 5: Testing + Deploy** | Pendiente | 0% | - |

**Progreso Global: ~20%**

---

## Changelog v2 (Feedback Cliente 2025-12-17)

> Los cambios v2 incorporan el feedback del cliente tras la demo, documentado en `TR- Requisitos Generales - v1.3.docx`

| Área | Cambios Principales | Impacto Horas |
|------|---------------------|---------------|
| **Auth/Roles** | 4 roles (ADMIN, GESTOR, OPERADOR, VISUALIZADOR), permisos por módulo | +10h |
| **TEMPO** | Landing semanal Excel, temporadas, estados almacén, clonar, Drive | +44h frontend, +20h backend |
| **TOPS** | Landing 2 listas, temporadas, editor Word, colores config | +30h frontend, +16h backend |
| **Cartelería** | Vista global (todas las salas) | +8h frontend, +4h backend |
| **Notificaciones** | Sistema notificaciones en header | +8h frontend, +4h backend |
| **Drive** | Integración navegador Drive intranet | +14h frontend, +7h backend |
| **TOTAL** | | **+159h** |

### Estimación Actualizada

| Componente | v1 | v2 | Delta |
|------------|-----|-----|-------|
| Backend | 222h | 273h | +51h |
| Frontend | 259h | 367h | +108h |
| **TOTAL** | **481h** | **640h** | **+159h** |

---

## Sprint 0: Setup del Proyecto ✅ COMPLETADO

### Backend (Spring Boot 2.7.18 + Java 8)

| Tarea | Estado | Notas |
|-------|--------|-------|
| Crear proyecto Spring Boot + Maven | ✅ Completado | pom.xml configurado |
| Configurar estructura de paquetes | ✅ Completado | controller, service, entity, dto, repository, config |
| Configurar H2 para desarrollo | ✅ Completado | application.yml |
| Configurar application.yml (dev/prod) | ✅ Completado | Puerto 8080, H2 console habilitada |
| Configurar SpringDoc OpenAPI 1.7.0 | ✅ Completado | Swagger UI en /swagger-ui.html |

### Frontend (Angular 18.2 + Material 18)

| Tarea | Estado | Notas |
|-------|--------|-------|
| Crear proyecto Angular 18 standalone | ✅ Completado | Angular 18.2.0 |
| Configurar Angular Material 18 | ✅ Completado | Tema dark custom Teatro Real |
| Configurar TailwindCSS 3.4 | ✅ Completado | tailwind.config.js con colores Teatro Real |
| Estructura de carpetas | ✅ Completado | core/, features/, models, services, layouts |
| Environment files | ✅ Completado | environment.ts + environment.prod.ts |
| Proxy config para desarrollo | ✅ Completado | proxy.conf.json → localhost:8080 |

### Verificación Sprint 0

- ✅ Backend arranca sin errores en http://localhost:8080
- ✅ Frontend arranca sin errores en http://localhost:4200
- ✅ Swagger UI accesible en http://localhost:8080/swagger-ui.html
- ✅ H2 Console accesible en http://localhost:8080/h2-console
- ✅ Proxy Frontend → Backend funcionando

---

## Sprint 1: Autenticación + Layout (v2: 4 Roles)

### Backend

| Tarea | Estado | Notas |
|-------|--------|-------|
| Entidad JPA: Usuario | [ ] Pendiente | |
| Entidad JPA: Rol (4 roles v2) | [ ] Pendiente | ADMIN, GESTOR, OPERADOR, VISUALIZADOR |
| Entidad JPA: Departamento (v2: jefe, personal) | [ ] Pendiente | Nuevos campos descripcion, jefeId, personalIds |
| **v2:** Entidad JPA: PermisoModulo | [ ] Pendiente | usuarioId, modulo, nivelAcceso |
| **v2:** Entidad JPA: Temporada | [ ] Pendiente | nombre, fechaInicio, fechaFin, activa |
| Migración V1: Schema inicial | [ ] Pendiente | |
| Migración V2: Datos semilla roles | [ ] Pendiente | |
| SecurityConfig básico | [ ] Pendiente | |
| AuthController (login, me, logout) | [ ] Pendiente | |
| JWT Token generation/validation | [ ] Pendiente | |
| **v2:** PermisoModuloService | [ ] Pendiente | |
| **v2:** TemporadaService + Controller | [ ] Pendiente | |
| Tests de autenticación | [ ] Pendiente | |

### Frontend

| Tarea | Estado | Notas |
|-------|--------|-------|
| AuthService con signals (v2: 4 roles) | [ ] Pendiente | Métodos isAdmin, isGestor, isOperador, isVisualizador |
| Auth Guard + Role Guard | [ ] Pendiente | Carpeta guards/ existe |
| **v2:** ModulePermissionGuard | [ ] Pendiente | Verificar acceso a TEMPO/TOPS/ADMIN |
| Auth Interceptor (JWT) | [ ] Pendiente | |
| Página de Login | [ ] Pendiente | |
| Main Layout (sidebar + header) | ✅ Completado | main-layout.component.ts |
| Sidebar con navegación | ✅ Completado | sidenav.component.ts |
| Header con usuario/logout | ✅ Completado | navbar.component.ts |
| **v2:** NotificationBell en header | [ ] Pendiente | Componente campana notificaciones |
| **v2:** TemporadaSelector en header | [ ] Pendiente | Dropdown selector temporada |
| Footer | ✅ Completado | footer.component.ts |
| **v2:** NotificationService | [ ] Pendiente | Polling + signals |
| **v2:** TemporadaService | [ ] Pendiente | |
| Tests de auth | [ ] Pendiente | |

### Verificación Sprint 1

- [ ] Login funcional (local, OAuth Google en fase posterior)
- [ ] JWT generado y validado
- ✅ Layout principal visible
- ✅ Navegación entre módulos
- [ ] Logout funcional
- [ ] **v2:** Selector de temporada funcional
- [ ] **v2:** Campana de notificaciones visible

---

## Sprint 2: Módulo TEMPO (v2: Landing Excel + Estados + Clone)

### Backend

| Tarea | Estado | Notas |
|-------|--------|-------|
| Entidad JPA: Espacio (v2: color, dimensiones) | ✅ Parcial | Existe, faltan nuevos campos v2 |
| Entidad JPA: TipoActividad | [ ] Pendiente | |
| Entidad JPA: Actividad (v2: temporadaId, descripcion, estado) | [ ] Pendiente | Nuevos campos v2 |
| **v2:** Entidad JPA: ActividadDocumento | [ ] Pendiente | origen: LOCAL/DRIVE_INTRANET |
| **v2:** Migración V4: Updates v2 TEMPO | [ ] Pendiente | |
| EspacioRepository | ✅ Completado | EspacioRepository.java |
| TipoActividadRepository | [ ] Pendiente | |
| ActividadRepository | [ ] Pendiente | |
| CRUD EspacioService (v2: actualizar campos) | ✅ Parcial | Existe, actualizar para v2 |
| CRUD TipoActividadService | [ ] Pendiente | |
| CRUD ActividadService | [ ] Pendiente | |
| **v2:** ActividadService.clone() | [ ] Pendiente | Clonar actividad a nueva fecha |
| **v2:** ActividadService.updateStatus() | [ ] Pendiente | PENDIENTE → EN_TRANSITO → COMPLETADO |
| Filtros y búsqueda actividades | [ ] Pendiente | |
| EspacioController | ✅ Completado | EspacioController.java |
| TipoActividadController | [ ] Pendiente | |
| ActividadController | [ ] Pendiente | |
| **v2:** POST /actividades/{id}/clone | [ ] Pendiente | |
| **v2:** PUT /actividades/{id}/status | [ ] Pendiente | |
| **v2:** GET /signage/global | [ ] Pendiente | Cartelería global |
| DataInitializer (datos semilla) | ✅ Completado | DataInitializer.java |
| Tests TEMPO | [ ] Pendiente | |

### Frontend

| Tarea | Estado | Notas |
|-------|--------|-------|
| Modelos TypeScript TEMPO (v2 actualizados) | [ ] Pendiente | temporadaId, descripcion, estado, etc. |
| ActividadService (v2: clone, updateStatus) | [ ] Pendiente | |
| EspacioService | [ ] Pendiente | |
| TipoActividadService | [ ] Pendiente | |
| **v2:** TEMPO Landing Component | [ ] Pendiente | Contenedor para vistas |
| **v2:** WeeklyExcelView Component | [ ] Pendiente | Vista semanal estilo Excel |
| Componente Calendario (FullCalendar) | [ ] Pendiente | calendario.component.ts existe (placeholder) |
| Vista mensual | [ ] Pendiente | |
| Vista semanal | [ ] Pendiente | |
| Dialog crear/editar actividad (v2: nuevos campos) | [ ] Pendiente | temporada, descripcion |
| **v2:** StatusBadge Component | [ ] Pendiente | Estados almacén |
| **v2:** Actividad Status Control | [ ] Pendiente | Botones cambio estado |
| **v2:** Actividad Clone Dialog | [ ] Pendiente | |
| **v2:** DocumentSourcePicker | [ ] Pendiente | Local vs Drive |
| Filtros por espacio/tipo/temporada | [ ] Pendiente | |
| Lista de espacios (admin, v2: campos nuevos) | [ ] Pendiente | color, capacidad, dimensiones |
| Form espacio (admin) | [ ] Pendiente | |
| Lista tipos actividad (admin) | [ ] Pendiente | |
| Form tipo actividad (admin) | [ ] Pendiente | |
| **v2:** CRUD Departamentos (jefe, personal) | [ ] Pendiente | |
| Tests TEMPO | [ ] Pendiente | |

### Verificación Sprint 2

- [ ] **v2:** Landing TEMPO con vista semanal Excel
- [ ] Calendario visual con actividades
- [ ] Crear/editar/eliminar actividades
- [ ] **v2:** Clonar actividad a otra fecha
- [ ] **v2:** Estados almacén (Pendiente → En tránsito → Completado)
- [ ] Filtrar por espacio, tipo y **temporada**
- [ ] **v2:** Seleccionar documentos de Drive o Local
- [ ] Colores por tipo de actividad
- [ ] CRUD de espacios (admin, con campos v2)
- [ ] CRUD de tipos de actividad (admin)
- [ ] **v2:** CRUD de departamentos (con jefe y personal)

---

## Sprint 3: Módulo TOPS (v2: Landing + Editor Word + Colores)

### Backend

| Tarea | Estado | Notas |
|-------|--------|-------|
| Entidad JPA: Guion (v2: temporadaId) | [ ] Pendiente | |
| Entidad JPA: Acto | [ ] Pendiente | |
| Entidad JPA: Escena | [ ] Pendiente | |
| Entidad JPA: ElementoGuion | [ ] Pendiente | |
| Entidad JPA: ElementoAdjunto (v2: origen, driveFileId) | [ ] Pendiente | |
| **v2:** Entidad JPA: ColorElementoGuion | [ ] Pendiente | Colores configurables |
| Repositorios TOPS | [ ] Pendiente | |
| GuionService (CRUD + bloqueo, v2: filtro temporada) | [ ] Pendiente | |
| Operaciones jerárquicas (crear acto/escena/elemento) | [ ] Pendiente | |
| Reordenar elementos (drag & drop API) | [ ] Pendiente | |
| Vistas (completa, tops, departamento) | [ ] Pendiente | |
| HistorialService (auditoría) | [ ] Pendiente | |
| **v2:** ColorElementoService | [ ] Pendiente | |
| Controllers TOPS | [ ] Pendiente | |
| Tests TOPS | [ ] Pendiente | |

### Frontend

| Tarea | Estado | Notas |
|-------|--------|-------|
| Modelos TypeScript TOPS (v2 actualizados) | [ ] Pendiente | temporadaId, ColorElementoGuion |
| GuionService (v2: filtro temporada, computed misGuiones) | [ ] Pendiente | |
| ElementoService | [ ] Pendiente | |
| **v2:** ColorElementoService | [ ] Pendiente | |
| **v2:** TOPS Landing Component | [ ] Pendiente | 2 listas: temporada + mis guiones |
| Lista de guiones (v2: filtro temporada) | [ ] Pendiente | guiones.component.ts existe (placeholder) |
| Detalle guion (metadata) | [ ] Pendiente | |
| Form crear/editar guion | [ ] Pendiente | |
| Editor principal (v2: estilos Word) | [ ] Pendiente | |
| **v2:** Estilos editor emulando Word | [ ] Pendiente | |
| Panel de Acto (expandible) | [ ] Pendiente | |
| Panel de Escena | [ ] Pendiente | |
| Elemento item (v2: colores configurables) | [ ] Pendiente | |
| Tabla de Pasada | [ ] Pendiente | |
| Dialog crear/editar TOP | [ ] Pendiente | |
| Drag & drop para reordenar | [ ] Pendiente | |
| Indicador de bloqueo | [ ] Pendiente | |
| Vista solo TOPs | [ ] Pendiente | |
| Vista por departamento | [ ] Pendiente | |
| **v2:** Admin colores elementos | [ ] Pendiente | |
| Tests TOPS | [ ] Pendiente | |

### Verificación Sprint 3

- [ ] **v2:** Landing TOPS con 2 listas (temporada + mis guiones)
- [ ] Lista de guiones con filtro por temporada
- [ ] Crear nuevo guion con metadata
- [ ] Editor jerárquico (actos → escenas → elementos)
- [ ] **v2:** Editor con estilo visual tipo Word
- [ ] **v2:** Colores de elementos configurables
- [ ] Tabla de pasada funcional
- [ ] Crear/editar TOPs con todos los campos
- [ ] Drag & drop para reordenar
- [ ] Bloqueo de edición exclusivo
- [ ] Vistas filtradas (global, tops, departamento)

---

## Sprint 4: Integraciones v2 (Drive + Notificaciones + Cartelería Global)

### Backend

| Tarea | Estado | Notas |
|-------|--------|-------|
| Google Calendar sync completo | [ ] Pendiente | |
| **v2:** DriveService (integración intranet) | [ ] Pendiente | browse, search, getFileInfo |
| **v2:** DriveController | [ ] Pendiente | /drive/browse, /drive/search |
| **v2:** NotificacionService | [ ] Pendiente | Crear, marcar leída, broadcast |
| **v2:** NotificacionController | [ ] Pendiente | GET, PUT read, PUT read-all |
| **v2:** Entidad Notificacion | [ ] Pendiente | |
| Webhook para cambios en tiempo real | [ ] Pendiente | |
| ExportWordService (Apache POI) | [ ] Pendiente | |
| NotificationService (email) | [ ] Pendiente | |
| Tests de integración | [ ] Pendiente | |

### Frontend

| Tarea | Estado | Notas |
|-------|--------|-------|
| WebSocketService | [ ] Pendiente | |
| Actualización en tiempo real | [ ] Pendiente | |
| **v2:** DriveService | [ ] Pendiente | |
| **v2:** DriveFileSelector Component | [ ] Pendiente | Modal navegador Drive |
| Descarga exportación Word | [ ] Pendiente | |
| Dashboard con widgets | [ ] Pendiente | home.component.ts existe (placeholder) |
| Notificaciones (snackbar/toast) | [ ] Pendiente | |
| Modo Cartelería por sala | [ ] Pendiente | carteleria.component.ts existe (placeholder) |
| **v2:** Cartelería Global Component | [ ] Pendiente | Vista todas las salas |
| **v2:** Admin Temporadas | [ ] Pendiente | CRUD temporadas |
| **v2:** Admin Permisos Módulo | [ ] Pendiente | Configurar permisos usuarios |
| Tests de integración | [ ] Pendiente | |

### Verificación Sprint 4

- [ ] Sincronización con Google Calendar
- [ ] Updates en tiempo real (WebSocket)
- [ ] **v2:** Navegador Drive intranet funcional
- [ ] **v2:** Sistema de notificaciones funcional
- [ ] Exportar guion a Word
- [ ] Dashboard con actividades del día
- [ ] Notificaciones de cambios
- [ ] Modo cartelería por sala funcional
- [ ] **v2:** Modo cartelería global funcional
- [ ] **v2:** Admin temporadas funcional
- [ ] **v2:** Admin permisos por módulo funcional

---

## Sprint 5: Testing + Deploy

### Backend

| Tarea | Estado | Notas |
|-------|--------|-------|
| Tests unitarios adicionales | [ ] Pendiente | |
| Tests de integración | [ ] Pendiente | |
| Documentación OpenAPI/Swagger | ✅ Completado | Configurado en OpenApiConfig.java |
| Dockerfile + optimización | [ ] Pendiente | |
| Configuración producción (PostgreSQL) | [ ] Pendiente | |
| Scripts de migración de datos | [ ] Pendiente | |

### Frontend

| Tarea | Estado | Notas |
|-------|--------|-------|
| Tests unitarios adicionales | [ ] Pendiente | |
| Tests E2E (Playwright) | [ ] Pendiente | |
| Responsive / Mobile fixes | [ ] Pendiente | |
| Accesibilidad (a11y) | [ ] Pendiente | |
| Optimización bundle | [ ] Pendiente | |
| Configuración producción | [ ] Pendiente | |

### Verificación Sprint 5

- [ ] Cobertura de tests > 70%
- ✅ Documentación API completa (Swagger)
- [ ] Build de producción optimizado
- [ ] Docker images listas
- [ ] Responsive en tablet/móvil
- [ ] MVP v2 completo y funcional

---

## Inventario de Código Existente

### Backend - Archivos Implementados
```
teatro-real-backend/
├── pom.xml                                    ✅ Configurado
├── src/main/java/com/teatroreal/
│   ├── TeatroRealApplication.java            ✅ Main class
│   ├── config/
│   │   ├── OpenApiConfig.java                ✅ Swagger config
│   │   ├── CorsConfig.java                   ✅ CORS habilitado
│   │   └── DataInitializer.java              ✅ Datos semilla
│   ├── controller/
│   │   ├── EspacioController.java            ✅ CRUD Espacios
│   │   └── HealthController.java             ✅ Health check
│   ├── dto/
│   │   ├── ApiResponse.java                  ✅ Response wrapper
│   │   ├── EspacioDTO.java                   ✅ DTO Espacio
│   │   └── HealthResponse.java               ✅ Health DTO
│   ├── entity/
│   │   └── Espacio.java                      ✅ Entidad JPA (actualizar v2)
│   ├── exception/
│   │   └── GlobalExceptionHandler.java       ✅ Manejo errores
│   ├── repository/
│   │   └── EspacioRepository.java            ✅ JPA Repository
│   └── service/
│       └── EspacioService.java               ✅ Lógica negocio
└── src/main/resources/
    └── application.yml                       ✅ Configuración
```

### Frontend - Archivos Implementados
```
teatro-real-frontend/
├── angular.json                              ✅ Configurado + proxy
├── package.json                              ✅ Dependencies + Material
├── proxy.conf.json                           ✅ Proxy → localhost:8080
├── tailwind.config.js                        ✅ Colores Teatro Real
├── src/
│   ├── main.ts                               ✅ Bootstrap
│   ├── styles.scss                           ✅ Estilos + Material theme
│   ├── environments/
│   │   ├── environment.ts                    ✅ Config desarrollo
│   │   └── environment.prod.ts               ✅ Config producción
│   └── app/
│       ├── app.component.ts                  ✅ Root component
│       ├── app.config.ts                     ✅ App config
│       ├── app.routes.ts                     ✅ Rutas definidas
│       ├── core/
│       │   ├── components/
│       │   │   ├── navbar/navbar.component.ts     ✅ Header
│       │   │   ├── sidenav/sidenav.component.ts   ✅ Sidebar
│       │   │   └── footer/footer.component.ts     ✅ Footer
│       │   ├── layouts/
│       │   │   └── main-layout.component.ts       ✅ Layout principal
│       │   ├── models/
│       │   │   └── route.model.ts                 ✅ Modelo rutas
│       │   ├── services/
│       │   │   └── layout.service.ts              ✅ Estado sidebar
│       │   └── guards/                            📁 (vacío)
│       └── features/
│           ├── home/home.component.ts             ✅ Placeholder
│           ├── calendario/calendario.component.ts ✅ Placeholder
│           ├── espacios/espacios.component.ts     ✅ Placeholder
│           ├── producciones/producciones.component.ts ✅ Placeholder
│           ├── guiones/guiones.component.ts       ✅ Placeholder
│           ├── logistica/logistica.component.ts   ✅ Placeholder
│           └── carteleria/carteleria.component.ts ✅ Placeholder
```

### Archivos Pendientes v2 (Nuevos)

**Backend:**
- `entity/Temporada.java`
- `entity/PermisoModulo.java`
- `entity/Notificacion.java`
- `entity/ColorElementoGuion.java`
- `service/NotificacionService.java`
- `service/DriveService.java`
- `service/TemporadaService.java`
- `controller/NotificacionController.java`
- `controller/DriveController.java`
- `controller/TemporadaController.java`
- `controller/SignageController.java`

**Frontend:**
- `shared/components/temporada-selector/`
- `shared/components/notification-bell/`
- `shared/components/status-badge/`
- `shared/components/drive-file-selector/`
- `shared/components/document-source-picker/`
- `core/services/notification.service.ts`
- `core/services/drive.service.ts`
- `core/services/temporada.service.ts`
- `features/tempo/landing/weekly-excel-view/`
- `features/tops/landing/tops-landing.component.ts`
- `features/carteleria/carteleria-global/`
- `features/admin/temporadas/`
- `features/admin/permisos-modulo/`
- `features/admin/colores-elementos/`

---

## Registro de Cambios

| Fecha | Sprint | Cambio | Autor |
|-------|--------|--------|-------|
| 2025-12-11 | - | Documento creado con estado actual | Sistema |
| 2025-12-11 | 0-2 | Marcadas tareas completadas según código existente | Sistema |
| 2025-12-11 | 0 | Angular Material 18 instalado y configurado (tema dark) | Sistema |
| 2025-12-11 | 0 | proxy.conf.json creado y vinculado a angular.json | Sistema |
| 2025-12-11 | 0 | environment.ts y environment.prod.ts creados | Sistema |
| 2025-12-20 | - | **v2:** Actualizado con feedback cliente (v1.3) | Sistema |
| 2025-12-20 | - | **v2:** Añadidas tareas: 4 roles, temporadas, estados almacén | Sistema |
| 2025-12-20 | - | **v2:** Añadidas tareas: landing Excel, landing TOPS, cartelería global | Sistema |
| 2025-12-20 | - | **v2:** Añadidas tareas: Drive intranet, notificaciones, colores config | Sistema |
| 2025-12-20 | - | **v2:** Estimación actualizada: 481h → 640h (+159h) | Sistema |

---

## Bloqueos Actuales

| ID | Descripción | Sprint | Fecha Detectado | Estado |
|----|-------------|--------|-----------------|--------|
| ~~B-001~~ | ~~Angular Material no instalado~~ | 0 | 2025-12-11 | Resuelto |
| ~~B-002~~ | ~~Proxy frontend→backend no configurado~~ | 0 | 2025-12-11 | Resuelto |
| ~~B-003~~ | ~~Environment files no creados~~ | 0 | 2025-12-11 | Resuelto |

---

## Próximas Tareas Prioritarias (v2)

### Fase 1: Completar Sprint 1 (Auth con 4 roles)
1. [ ] Crear entidades Usuario, Rol, Departamento, PermisoModulo, Temporada (Backend)
2. [ ] Implementar JWT básico con validación de roles
3. [ ] AuthService con 4 roles + ModulePermissionGuard (Frontend)
4. [ ] TemporadaService + TemporadaSelector (Frontend)
5. [ ] NotificationService + NotificationBell (Frontend)
6. [ ] Conectar login en frontend

### Fase 2: Sprint 2 TEMPO con features v2
1. [ ] Actualizar entidad Espacio con campos v2 (color, dimensiones)
2. [ ] Crear entidad Actividad con campos v2 (temporadaId, descripcion, estado)
3. [ ] Implementar endpoints clone y status
4. [ ] Landing TEMPO con WeeklyExcelView
5. [ ] StatusBadge + controles de estado almacén
6. [ ] Integrar FullCalendar con filtro temporada

### Fase 3: Sprint 3 TOPS con features v2
1. [ ] Landing TOPS con 2 listas
2. [ ] Editor con estilos Word
3. [ ] Colores configurables para elementos
4. [ ] Filtro por temporada

### Fase 4: Sprint 4 Integraciones v2
1. [ ] DriveService + DriveFileSelector
2. [ ] Sistema notificaciones completo
3. [ ] Cartelería global

---

## Notas y Decisiones Técnicas

### Stack Tecnológico Confirmado
- **Frontend:** Angular 18.2 + Angular Material 18 + TailwindCSS 3.4
- **Backend:** Spring Boot 2.7.18 + Java 8
- **Base de datos:** H2 (desarrollo) / PostgreSQL 16 (producción)
- **Autenticación:** JWT (OAuth 2.0 con Google en fase posterior)
- **Documentación API:** SpringDoc OpenAPI 1.7.0

### URLs de Desarrollo
| Servicio | URL |
|----------|-----|
| Frontend Angular | http://localhost:4200 |
| Backend API | http://localhost:8080/api |
| Swagger UI | http://localhost:8080/swagger-ui.html |
| H2 Console | http://localhost:8080/h2-console |

### Credenciales H2 (Desarrollo)
- **JDBC URL:** jdbc:h2:mem:teatroreal
- **Usuario:** sa
- **Password:** (vacío)

### Decisiones v2
- **4 Roles:** ADMIN (todo), GESTOR (edición), OPERADOR (operaciones limitadas), VISUALIZADOR (solo lectura)
- **Permisos por módulo:** Tabla PermisoModulo para granularidad extra
- **Estados almacén:** Máquina de estados simple PENDIENTE → EN_TRANSITO → COMPLETADO
- **Drive Intranet:** Integración lectura-only para seleccionar documentos
- **Cartelería global:** Vista dashboard de todas las salas en tiempo real

---

## Comandos Útiles

### Backend
```bash
# Desarrollo (Windows)
cd teatro-real-backend
mvnw.cmd spring-boot:run

# Tests
mvnw.cmd test

# Build
mvnw.cmd clean package -DskipTests
```

### Frontend
```bash
# Desarrollo
cd teatro-real-frontend
npm install
npm start

# Tests
npm test

# Build producción
npm run build
```

---

## Documentación de Referencia v2

| Documento | Descripción |
|-----------|-------------|
| `DOC_GENERADA/SINTESIS_REQUISITOS_FINAL_v2.md` | Síntesis completa de requisitos (actualizada) |
| `DOC_GENERADA/PLAN_IMPLEMENTACION_BACKEND_v2.md` | Plan detallado backend (273h) |
| `DOC_GENERADA/PLAN_IMPLEMENTACION_FRONTEND_v2.md` | Plan detallado frontend (367h) |
| `DOC_INICIAL/TR- Requisitos Generales - v1.3.docx` | Requisitos originales con feedback cliente |

---

*Última actualización: 2025-12-20 (v2)*
