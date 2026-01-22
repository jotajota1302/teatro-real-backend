Nivel de detalle requerido para replicar dashboard y módulo TEMPO en Sandra
================================================================================

Fuentes principales:
- CONTEXTOS_JJ_PROYECTO/dashboard-replication-guide.md
- CONTEXTOS_JJ_PROYECTO/tempo-replication-guide.md
- CONTEXTOS_JJ_PROYECTO/tempo-replication-backend.md

Resumen de tareas
-----------------

### 1. Dashboard (Vista Global)

- Componente Angular (`DashboardComponent` o `HomeComponent`).
  - Header con título “Vista Global”, subtítulo y botón "Nueva Actividad".
  - Grid de estadísticas (4 tarjetas: Actividades Hoy, Espacios Ocupados, Producciones Activas, Notificaciones).
  - Grid principal (actividades 2/3 ancho, próximos eventos 1/3).
  - Badge tipo actividad con color calculado y barra indicadora vertical.
  - Material Icons (`<span class="material-icons">add</span>`).
  - Cargar datos desde servicio: stats, todayActivities, upcomingEvents.
- Servicio `DashboardService`:
  - DTOs: `DashboardOverviewDto`, `StatDto`, `ActivityDto`, `EventDto`.
  - Método `getOverview()` -> `GET /api/v1/dashboard/overview`.
- Estilos globales:
  - `.card`, `.badge`, `.btn-primary`, `.bg-teatro-negro`, `text-tr-gray-400`.
  - Tokens de colores `teatro.carmesi`, `teatro.negro`, `tr-gray-*`.
- Backend:
  - `DashboardController` con `@GetMapping("/api/v1/dashboard/overview")`.
  - `DashboardService` con datos en mock igual que frontend (independiente de entidades reales).
  - Respuesta envuelta en `ApiResponse<DashboardOverviewDto>` (timestamp, success, message, data).
  - Documentar con SpringDoc (`@Operation`).

### 2. Módulo TEMPO

#### 2.a Rutas

- Rutas globales en `app.routes.ts`/layout principal (MainLayoutComponent):
  - `/tempo/espacios`, `/tempo/calendario`, `/tempo/producciones`, `/tempo/guiones`, `/tempo/logistica`, `/tempo/carteleria`.
  - Routes usan `loadComponent` y se alojan en `src/app/features/tempo/...`.
- Sidebar con `routerLink="/tempo/...` y clase activa `bg-teatro-carmesi`.

#### 2.b Espacios
- Frontend:
  - `EspaciosComponent` con header y botón “Nuevo Espacio”.
  - Grid responsive (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`).
  - Tarjetas con icono (Material Icons), nombre, tipo y indicador verde/rojo (`Disponible`/`Ocupado`).
  - Datos mock: 6 elementos (Escenario Principal, Sala Gayarre, etc.).
  - `EspaciosService` -> `GET /api/v1/espacios`.
- Backend:
  - Entidad `Espacio` (id, nombre, tipo, descripcion, capacidad, activo, createdAt, updatedAt).
  - DTO `EspacioDto` (nombre, tipo, icon, disponible).
  - `EspacioRepository` con filtros `findByActivoTrue`, `findByTipo`, `findByNombreContainingIgnoreCase`.
  - `EspacioService` CRUD.
  - `EspacioController` con endpoints GET/POST/PUT/DELETE + `/activos`.
  - `DataInitializer` prepopula 6 espacios.

#### 2.c Calendario
- Frontend:
  - `CalendarioComponent`: header, botones “Filtros” y “Nueva Actividad”.
  - Placeholder grande con icono `calendar_month`, texto y mención a FullCalendar.
  - `CalendarioService` -> `GET /api/v1/calendario/actividades`.
  - DTO `CalendarioEventDto` (id, titulo, inicio, fin, espacio, tipo).
- Backend:
  - `EventoCalendario` entidad.
  - `CalendarioEventDto`.
  - `CalendarioRepository`, `CalendarioService`.
  - Endpoint `GET /api/v1/calendario/actividades`, `GET /{id}`, `POST`.
  - Opcional `/filters`.

#### 2.d Logística
- Frontend:
  - `LogisticaComponent`: header con botón “Nueva Operación”.
  - Tres tarjetas resumen (`Cargas Pendientes`, `Completadas Hoy`, `En Tránsito`) con iconos y colores (`actividad-cargas`, `estado-exito`, `estado-advertencia`).
  - Lista de operaciones recientes con icono y badge de estado (`estadoColor + "20"`).
  - `LogisticaService` -> `GET /api/v1/logistica/summary`, `/operaciones`.
  - DTOs `LogisticaStatDto`, `OperacionLogisticaDto`.
- Backend:
  - Entidad `OperacionLogistica`.
  - `LogisticaStatDto`, `OperacionLogisticaDto`.
  - `LogisticaController` con endpoints `/summary`, `/operaciones`, `POST /operaciones`.

#### 2.e Cartelería
- Frontend:
  - `CarteleriaComponent`: header, botones “Vista previa”, “Publicar”.
  - Grid responsive con tarjetas (preview `aspect-video`, icono `tv`, nombre, ubicación, estado activo/inactivo con colores #3BC14A / #EF6C00).
  - `CarteleriaService` -> `GET /api/v1/carteleria/pantallas`.
  - DTO `PantallaCarteleriaDto`.
- Backend:
  - Entidad `PantallaCarteleria`.
  - `PantallaCarteleriaDto`.
  - `CarteleriaController`: GET `/pantallas`, POST `/pantallas/{id}/publish`, `/pantallas/{id}/preview`.

### 3. Estilos y recursos comunes
- Asegurar Material Icons en `index.html`.
- Clases globales en `src/styles.scss`.
- Tokens: `.btn-primary`, `.btn-secondary`, `.card`, `.card-hover`, `.badge`, `.bg-teatro-negro`, `.tr-gray-*`, `.actividad-*`, `.estado-*`.
- Tailwind configurado o equivalentes SCSS.

### 4. Integración backend/frontend
- Proxy Angular a backend (proxy.conf.json).
- Documentación OpenAPI/Swagger generada en backend.
- `CorsConfig`, `OpenApiConfig`, `DataInitializer` replicados del doc.
- Respuesta backend uniforme `ApiResponse<T>`.

### 5. Pruebas y documentación
- Tests unitarios en Angular para servicios (mock `HttpClient`).
- Pruebas en backend (MockMvc/unitarios) para controladores.
- Documentar endpoints y estructura en README/Swagger.

Checklist general
-----------------
- [ ] Dashboard replicado (UI + DTOs + endpoint).
- [ ] Rutas TEMPO definidas y sidebar conectado.
- [ ] Componentes: Espacios, Calendario, Logística, Cartelería.
- [ ] Servicios Angular y modelos DTO.
- [ ] Endpoints backend y DTOs.
- [ ] Configuraciones (CORS, Swagger, DataInitializer).
- [ ] Material Icons y estilos globales.
- [ ] Tests y documentación.

---

Con este archivo quedan plasmados todos los pasos y detalles extraídos de las guías. ¿Confirmas que lo que he preparado cubre tus necesidades antes de cambiar a Act Mode?
