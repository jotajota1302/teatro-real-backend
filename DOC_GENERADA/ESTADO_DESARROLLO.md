# Teatro Real - Estado de Desarrollo
  
## Dashboard de Progreso

| Módulo | Estado | Progreso | Última Actualización |
|--------|--------|----------|----------------------|
| **Sprint 0: Setup** | Completado | 100% | 2025-12-11 |
| **Sprint 1: Auth + Layout** | En progreso | 60% | 2025-12-11 |
| **Sprint 2: TEMPO** | En progreso | 25% | 2025-12-11 |
| **Sprint 3: TOPS** | Pendiente | 5% | 2025-12-11 |
| **Sprint 4: Integraciones** | Pendiente | 0% | - |
| **Sprint 5: Testing + Deploy** | Pendiente | 0% | - |

**Progreso Global: ~25%**

---

## Sprint 0: Setup del Proyecto

### Backend (Spring Boot 2.7.18 + Java 8)

| Tarea | Estado | Notas |
|-------|--------|-------|
| Crear proyecto Spring Boot + Maven | [x] Completado | pom.xml configurado |
| Configurar estructura de paquetes | [x] Completado | controller, service, entity, dto, repository, config |
| Configurar H2 para desarrollo | [x] Completado | application.yml |
| Configurar application.yml (dev/prod) | [x] Completado | Puerto 8080, H2 console habilitada |
| Configurar SpringDoc OpenAPI 1.7.0 | [x] Completado | Swagger UI en /swagger-ui.html |

### Frontend (Angular 18.2 + Material 18)

| Tarea | Estado | Notas |
|-------|--------|-------|
| Crear proyecto Angular 18 standalone | [x] Completado | Angular 18.2.0 |
| Configurar Angular Material 18 | [x] Completado | Tema dark custom Teatro Real |
| Configurar TailwindCSS 3.4 | [x] Completado | tailwind.config.js con colores Teatro Real |
| Estructura de carpetas | [x] Completado | core/, features/, models, services, layouts |
| Environment files | [x] Completado | environment.ts + environment.prod.ts |
| Proxy config para desarrollo | [x] Completado | proxy.conf.json → localhost:8080 |

### Verificación Sprint 0

- [x] Backend arranca sin errores en http://localhost:8080
- [x] Frontend arranca sin errores en http://localhost:4200
- [x] Swagger UI accesible en http://localhost:8080/swagger-ui.html
- [x] H2 Console accesible en http://localhost:8080/h2-console
- [x] Proxy Frontend → Backend funcionando

---

## Sprint 1: Autenticación + Layout

### Backend

| Tarea | Estado | Notas |
|-------|--------|-------|
| Entidades JPA: Usuario, Rol, Departamento | [ ] Pendiente | |
| Migración inicial de datos | [ ] Pendiente | |
| SecurityConfig básico | [ ] Pendiente | |
| AuthController (login, me, logout) | [ ] Pendiente | |
| JWT Token generation/validation | [ ] Pendiente | |
| Tests de autenticación | [ ] Pendiente | |

### Frontend

| Tarea | Estado | Notas |
|-------|--------|-------|
| AuthService con signals | [ ] Pendiente | |
| Auth Guard + Role Guard | [ ] Pendiente | Carpeta guards/ existe |
| Auth Interceptor (JWT) | [ ] Pendiente | |
| Página de Login | [ ] Pendiente | |
| Main Layout (sidebar + header) | [x] Completado | main-layout.component.ts |
| Sidebar con navegación | [x] Completado | sidenav.component.ts |
| Header con usuario/logout | [x] Completado | navbar.component.ts |
| Footer | [x] Completado | footer.component.ts |
| Tests de auth | [ ] Pendiente | |

### Verificación Sprint 1

- [ ] Login funcional (local, OAuth Google en fase posterior)
- [ ] JWT generado y validado
- [x] Layout principal visible
- [x] Navegación entre módulos
- [ ] Logout funcional

---

## Sprint 2: Módulo TEMPO

### Backend

| Tarea | Estado | Notas |
|-------|--------|-------|
| Entidad JPA: Espacio | [x] Completado | Espacio.java |
| Entidad JPA: TipoActividad | [ ] Pendiente | |
| Entidad JPA: Actividad | [ ] Pendiente | |
| EspacioRepository | [x] Completado | EspacioRepository.java |
| TipoActividadRepository | [ ] Pendiente | |
| ActividadRepository | [ ] Pendiente | |
| CRUD EspacioService | [x] Completado | EspacioService.java |
| CRUD TipoActividadService | [ ] Pendiente | |
| CRUD ActividadService | [ ] Pendiente | |
| Filtros y búsqueda actividades | [ ] Pendiente | |
| EspacioController | [x] Completado | EspacioController.java |
| TipoActividadController | [ ] Pendiente | |
| ActividadController | [ ] Pendiente | |
| DataInitializer (datos semilla) | [x] Completado | DataInitializer.java |
| Tests TEMPO | [ ] Pendiente | |

### Frontend

| Tarea | Estado | Notas |
|-------|--------|-------|
| Modelos TypeScript TEMPO | [ ] Pendiente | |
| ActividadService | [ ] Pendiente | |
| EspacioService | [ ] Pendiente | |
| TipoActividadService | [ ] Pendiente | |
| Componente Calendario (FullCalendar) | [ ] Pendiente | calendario.component.ts existe (placeholder) |
| Vista mensual | [ ] Pendiente | |
| Vista semanal | [ ] Pendiente | |
| Dialog crear/editar actividad | [ ] Pendiente | |
| Filtros por espacio/tipo | [ ] Pendiente | |
| Lista de espacios (admin) | [ ] Pendiente | espacios.component.ts existe (placeholder) |
| Form espacio (admin) | [ ] Pendiente | |
| Lista tipos actividad (admin) | [ ] Pendiente | |
| Form tipo actividad (admin) | [ ] Pendiente | |
| Tests TEMPO | [ ] Pendiente | |

### Verificación Sprint 2

- [ ] Calendario visual con actividades
- [ ] Crear/editar/eliminar actividades
- [ ] Filtrar por espacio y tipo
- [ ] Colores por tipo de actividad (definidos en tailwind.config.js)
- [ ] CRUD de espacios (admin)
- [ ] CRUD de tipos de actividad (admin)

---

## Sprint 3: Módulo TOPS

### Backend

| Tarea | Estado | Notas |
|-------|--------|-------|
| Entidades JPA: Guion, Acto, Escena, Elemento, Adjunto | [ ] Pendiente | |
| Repositorios TOPS | [ ] Pendiente | |
| GuionService (CRUD + bloqueo) | [ ] Pendiente | |
| Operaciones jerárquicas (crear acto/escena/elemento) | [ ] Pendiente | |
| Reordenar elementos (drag & drop API) | [ ] Pendiente | |
| Vistas (completa, tops, departamento) | [ ] Pendiente | |
| HistorialService (auditoría) | [ ] Pendiente | |
| Controllers TOPS | [ ] Pendiente | |
| Tests TOPS | [ ] Pendiente | |

### Frontend

| Tarea | Estado | Notas |
|-------|--------|-------|
| Modelos TypeScript TOPS | [ ] Pendiente | |
| GuionService | [ ] Pendiente | |
| ElementoService | [ ] Pendiente | |
| Lista de guiones | [ ] Pendiente | guiones.component.ts existe (placeholder) |
| Detalle guion (metadata) | [ ] Pendiente | |
| Form crear/editar guion | [ ] Pendiente | |
| Editor principal | [ ] Pendiente | |
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

## Sprint 4: Integraciones

### Backend

| Tarea | Estado | Notas |
|-------|--------|-------|
| Google Calendar sync completo | [ ] Pendiente | |
| Webhook para cambios en tiempo real | [ ] Pendiente | |
| ExportWordService (Apache POI) | [ ] Pendiente | |
| NotificationService (email) | [ ] Pendiente | |
| Tests de integración | [ ] Pendiente | |

### Frontend

| Tarea | Estado | Notas |
|-------|--------|-------|
| WebSocketService | [ ] Pendiente | |
| Actualización en tiempo real | [ ] Pendiente | |
| Descarga exportación Word | [ ] Pendiente | |
| Dashboard con widgets | [ ] Pendiente | home.component.ts existe (placeholder) |
| Notificaciones (snackbar/toast) | [ ] Pendiente | |
| Modo Cartelería | [ ] Pendiente | carteleria.component.ts existe (placeholder) |
| Tests de integración | [ ] Pendiente | |

### Verificación Sprint 4

- [ ] Sincronización con Google Calendar
- [ ] Updates en tiempo real (WebSocket)
- [ ] Exportar guion a Word
- [ ] Dashboard con actividades del día
- [ ] Notificaciones de cambios
- [ ] Modo cartelería funcional

---

## Sprint 5: Testing + Deploy

### Backend

| Tarea | Estado | Notas |
|-------|--------|-------|
| Tests unitarios adicionales | [ ] Pendiente | |
| Tests de integración | [ ] Pendiente | |
| Documentación OpenAPI/Swagger | [x] Completado | Configurado en OpenApiConfig.java |
| Dockerfile + optimización | [ ] Pendiente | |
| Configuración producción | [ ] Pendiente | |
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
- [x] Documentación API completa (Swagger)
- [ ] Build de producción optimizado
- [ ] Docker images listas
- [ ] Responsive en tablet/móvil
- [ ] MVP completo y funcional

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
│   │   └── Espacio.java                      ✅ Entidad JPA
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

---

## Registro de Cambios

| Fecha | Sprint | Cambio | Autor |
|-------|--------|--------|-------|
| 2025-12-11 | - | Documento creado con estado actual | Sistema |
| 2025-12-11 | 0-2 | Marcadas tareas completadas según código existente | Sistema |
| 2025-12-11 | 0 | Angular Material 18 instalado y configurado (tema dark) | Sistema |
| 2025-12-11 | 0 | proxy.conf.json creado y vinculado a angular.json | Sistema |
| 2025-12-11 | 0 | environment.ts y environment.prod.ts creados | Sistema |

---

## Bloqueos Actuales

| ID | Descripción | Sprint | Fecha Detectado | Estado |
|----|-------------|--------|-----------------|--------|
| ~~B-001~~ | ~~Angular Material no instalado~~ | 0 | 2025-12-11 | Resuelto |
| ~~B-002~~ | ~~Proxy frontend→backend no configurado~~ | 0 | 2025-12-11 | Resuelto |
| ~~B-003~~ | ~~Environment files no creados~~ | 0 | 2025-12-11 | Resuelto |

---

## Próximas Tareas Prioritarias

1. **Sprint 1 - Autenticación:**
   - [ ] Crear entidades Usuario, Rol, Departamento (Backend)
   - [ ] Implementar JWT básico
   - [ ] Conectar login en frontend

2. **Sprint 2 - TEMPO:**
   - [ ] Crear entidades TipoActividad, Actividad (Backend)
   - [ ] Implementar servicios frontend para conectar con API
   - [ ] Integrar FullCalendar

---

## Notas y Decisiones Técnicas

### Stack Tecnológico Confirmado
- **Frontend:** Angular 18.2 + Angular Material 18 (pendiente) + TailwindCSS 3.4
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

*Última actualización: 2025-12-11*
