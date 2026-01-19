# TAREAS SANDRA

## Semana 1 – Fundamentos (Auth + Base)

### Lunes S1
- [ ] **Modelos TypeScript actualizados v2 (`auth.models.ts`)**  
      **Horas:** 2h  
      **Notas (detallado):** Basarse en `DOC_GENERADA/PLAN_IMPLEMENTACION_FRONTEND_v2.md` (Sección **3.1 Modelos Auth**).  
      **Contexto repo:** actualmente no existe `src/app/core/auth/` en el proyecto, por lo que hay que **crear la carpeta** y el fichero.  
      **Ruta a crear:** `teatro-real-frontend/src/app/core/auth/auth.models.ts`  
      **Contenido mínimo (exports):**
      - `Usuario` con: `id, email, nombre, avatarUrl?, rol, departamento?, activo, ultimoAcceso?`
      - `Rol` con 4 roles v2: `nombre: 'ADMIN' | 'GESTOR' | 'OPERADOR' | 'VISUALIZADOR'` (+ `id, descripcion, permisos: string[]`)  
        *(Importante: v2 cambia COLABORADOR → GESTOR y añade OPERADOR + VISUALIZADOR)*
      - `AuthResponse` con: `{ token: string; usuario: Usuario }`
      - `PermisoModulo` con:
        - `modulo: 'TEMPO' | 'TOPS' | 'ADMIN'`
        - `nivelAcceso: 'LECTURA' | 'ESCRITURA' | 'COMPLETO' | 'NINGUNO'`
      **Criterios de aceptación:**
      - Tipos de `rol.nombre`, `modulo` y `nivelAcceso` deben ser **union types** (no `string`).
      - Compila en TypeScript sin errores y queda alineado con el plan v2.

- [ ] **`AuthService` con signals (4 roles)**  
      **Horas:** 3h  
      **Notas (detallado):** Basarse en `DOC_GENERADA/PLAN_IMPLEMENTACION_FRONTEND_v2.md` (Sección **4.1 AuthService**).  
      **Ruta a crear:** `teatro-real-frontend/src/app/core/auth/auth.service.ts`  
      **Dependencias:** `HttpClient`, `Router`, `environment.apiUrl` (en este repo: `'/api'`) + modelos de `auth.models.ts`.  
      **Signals privadas requeridas:**
      - `currentUserSignal = signal<Usuario | null>(null)`
      - `tokenSignal = signal<string | null>(null)`
      - `permisosModuloSignal = signal<PermisoModulo[]>([])`
      **Computed públicos requeridos:**
      - `currentUser = this.currentUserSignal.asReadonly()`
      - `isAuthenticated = computed(() => !!this.tokenSignal())`
      - `isAdmin`, `isGestor`, `isOperador`, `isVisualizador` (según plan v2)
      **Métodos públicos requeridos:**
      - `loginWithGoogle(): void` → redirige a `${environment.apiUrl}/auth/google` (o equivalente usando `API_URL = ${environment.apiUrl}/auth`).
      - `handleAuthCallback(token: string)` → `GET ${environment.apiUrl}/auth/me` con header `Authorization: Bearer ...`; en `tap`: `setAuth(...)` + `loadPermisosModulo()`.
      - `logout(): void` → `clearAuth()` y navegar a `/auth/login`.
      - `getToken(): string | null`
      - `hasRole(roles: string[]): boolean`
      - `canAccessModule(modulo)` → `nivelAcceso !== 'NINGUNO'`
      - `canWriteModule(modulo)` → `nivelAcceso in ['ESCRITURA','COMPLETO']`
      **Persistencia (como en plan v2):**
      - Guardar en `localStorage`: `auth_token` y `auth_user`
      - Al iniciar: `loadStoredAuth()` hidrata signals y dispara `loadPermisosModulo()`
      **Criterios de aceptación:**
      - Implementación basada en **signals + computed** (no subjects como base).
      - Roles exactamente: `ADMIN | GESTOR | OPERADOR | VISUALIZADOR`.
      - Permisos por módulo operativos vía `canAccessModule/canWriteModule`.

### Martes S1
- [ ] **`AuthGuard` + `RoleGuard` + `ModulePermissionGuard`**  
      **Horas:** 3h  
      **Notas (detallado):**  
      - **Ficheros a crear/actualizar:**  
        - `teatro-real-frontend/src/app/core/auth/auth.guard.ts` → `authGuard` (guard funcional con `CanActivateFn`).  
        - `teatro-real-frontend/src/app/core/guards/role.guard.ts` → `roleGuard` (guard funcional).  
        - `teatro-real-frontend/src/app/core/guards/module-permission.guard.ts` → `modulePermissionGuard` (guard funcional).  
        - Crear carpeta `src/app/core/guards/` si no existe.  
      - **Requisitos técnicos:**  
        - Implementar los 3 guards como **funciones** usando `inject()` (`AuthService`, `Router`).  
        - `authGuard`: si `!auth.isAuthenticated()` ⇒ devolver `router.createUrlTree(['/auth/login'])`, si no ⇒ `true`.  
        - `roleGuard`: leer `route.data['roles']` (array) y validar con `auth.hasRole(roles)`; si no cumple ⇒ `router.createUrlTree(['/dashboard'])`.  
        - `modulePermissionGuard`: leer `route.data['modulo']` (`'TEMPO' | 'TOPS' | 'ADMIN'`) y validar con `auth.canAccessModule(modulo)`; si no cumple ⇒ `router.createUrlTree(['/dashboard'])`.  
      - **Integración con routing (según plan v2, sección 2.2):**  
        - Actualizar `app.routes.ts` para:  
          - Proteger el layout principal con `canActivate: [authGuard]`.  
          - Proteger `/admin` con `canActivate: [roleGuard]` + `data: { roles: ['ADMIN'] }`.  
          - Proteger `/tempo` y `/tops` con `canActivate: [modulePermissionGuard]` + `data: { modulo: 'TEMPO' | 'TOPS' }`.  
      - **Criterios de aceptación:**  
        - Usuario no autenticado que navega a rutas protegidas ⇒ redirigido a `/auth/login`.  
        - Usuario sin rol `ADMIN` intentando `/admin` ⇒ redirigido a `/dashboard`.  
        - Usuario sin permiso para módulo `TEMPO`/`TOPS` ⇒ redirigido a `/dashboard`.  
        - Código en TypeScript sin errores, usando `inject()` y guards funcionales (no clases).  

- [ ] **Auth Interceptor (JWT header)**  
      **Horas:** 2h  
      **Notas (detallado):**  
      - **Fichero a crear:** `teatro-real-frontend/src/app/core/auth/auth.interceptor.ts` exportando `authInterceptor: HttpInterceptorFn`.  
      - **Comportamiento:**  
        - Usar `inject(AuthService)` para obtener el token vía `auth.getToken()`.  
        - Si hay token y la request no tiene `Authorization`, clonar la request y añadir header `Authorization: Bearer <token>`.  
        - Si no hay token, dejar la request intacta.  
      - **Integración con `app.config.ts`:**  
        - Actualizar `app.config.ts` para registrar `authInterceptor` con `provideHttpClient(withInterceptors([authInterceptor]))`, alineado con el plan v2 (sección 2.1).  
      - **Criterios de aceptación:**  
        - Todas las peticiones HTTP autenticadas salen con header `Authorization: Bearer ...`.  
        - No se pisa un header `Authorization` existente.  
        - Compila en TypeScript y se ejecuta correctamente en runtime.

### Miércoles S1
- [ ] **Página de Login (Material + formulario)**  
      **Horas:** 3h  
      **Notas:** Componente standalone, formulario reactivo, validaciones básicas.
- [ ] **`TemporadaService` + componente `TemporadaSelector`**  
      **Horas:** 3h  
      **Notas:** Selector de temporada con dropdown.

### Jueves S1
- [ ] **`NotificationService` (polling cada 30s, signals)**  
      **Horas:** 2h  
      **Notas (detallado):**
        - Implementar el servicio `NotificationService` en `src/app/core/services/notification.service.ts` con signals y polling por temporizador cada 30 segundos.
        - Utilizar el patrón moderno Angular: signals privadas, computed para contador de no leídas.
        - Métodos requeridos: `loadNotificaciones()`, `marcarLeida(id:number)`, `marcarTodasLeidas()`, polling automático en constructor.
        - Endpoints esperados alineados a REST `/notificaciones`, `/notificaciones/{id}/read`, `/notificaciones/read-all`.
        - Fuente de detalle, estructura y ejemplo de código: `DOC_GENERADA/PLAN_IMPLEMENTACION_FRONTEND_v2.md` sección 4.2.
        - Criterios de aceptación:
            - Polling automático.
            - Actualización instantánea de signals/contadores.
            - Código TypeScript sin errores.
            - 100% reactivo via signals + computed, sin subjects.
      ---
- [ ] **Componente `NotificationBell` (header)**  
      **Horas:** 2h  
      **Notas (detallado):**
        - Crear `NotificationBell` como componente standalone en `src/app/shared/components/notification-bell/notification-bell.component.ts`.
        - Debe mostrar un icono de campana (`bell`), badge con contador de notificaciones no leídas, desplegable con listado de notificaciones con scroll, acción para marcar todas leídas, callback de navegación por tipo.
        - Integrado visualmente según la guía y ejemplo de PLAN_IMPLEMENTACION_FRONTEND_v2.md sección 6.2.
        - Accesible: atributos ARIA, focusables, roles y feedback screen-reader.
        - Testing básico manual con mock si no hay backend listo.
        - Inputs/props: sin props, accede a signals íntegramente vía `NotificationService`.
        - Estructura del menú y feedback basado en el ejemplo de plan.
      ---
- [ ] **Actualizar `Header` con `NotificationBell` + `TemporadaSelector`**  
      **Horas:** 2h  
      **Notas (detallado):**
        - Incorporar los componentes `NotificationBell` y `TemporadaSelector` en el header principal (`src/app/layout/header/header.component.ts`).
        - Garantizar distribución visual correcta (extremo derecho, sin romper la UX).
        - ART: El Navbar debe estar alineado con la guía de estilos institucional (negro/carmesí), manejo de responsive.
        - Ambos componentes deben ser accesibles y usables desde teclado.
        - Criterios de aceptación: visualmente alineado con la web real y la guía, funcionalidad real/fake si backend no está disponible.
        - Ver referencias y detalles de integración en PLAN_IMPLEMENTACION_FRONTEND_v2.md sección 6.2 y 6.1.

### Viernes S1
- [ ] **Componentes shared: `StatusBadge`, `ColorPicker`**  
      **Horas:** 3h  
      **Notas (detallado):**
        - Implementar ambos componentes en `src/app/shared/components/`.
        - **StatusBadge**: ver detalles exactos en `PLAN_IMPLEMENTACION_FRONTEND_v2.md` sección 6.4 y ejemplos. 
            - Chip/Badge tipado para 3 estados almacén: `'PENDIENTE' | 'EN_TRANSITO' | 'COMPLETADO'`.
            - Inputs: `estado: EstadoActividad` (union type).
            - Estilos: fondo y texto según color institucional (`bg-orange-100`, `bg-blue-100`, `bg-green-100`, etc.).
            - Uso: en listas y detalles donde se represente el estado de actividad almacén.
            - Export standalone y testabilidad.
        - **ColorPicker**: se debe crear un componente base de selector de color reutilizable (ver mención en plan, presente junto a `status-badge`, usado en mantenimiento de Tipos de Actividad, TOPS, admin colores...).
            - Ubicación: `src/app/shared/components/color-picker/color-picker.component.ts`.
            - Debe integrarse luego con formularios usando Angular Material y poder aceptar paletas institucionales.
            - Referencia: plan sección 6.4, consultar Design System/ejemplo Material si procede.
        - Ambos componentes deben tener ejemplos de uso y test básico.
      ---
- [ ] **Tests unitarios Auth frontend (Jasmine)**  
      **Horas:** 2h  
      **Notas (detallado):**
        - Realizar tests unitarios para el servicio de autenticación (`AuthService`) y su flujo principal: login/logout/guardar usuario/roles/permiso módulo.
        - Herramienta: Jasmine (integración Angular estándar).
        - Estructura típica: `src/app/core/auth/auth.service.spec.ts`.
        - Cobertura: pathways principales y validaciones edge.
        - Ver plan sección 4.1 y ejemplo de plan de testing básico frontend.
        - Importante: los tests deberán ejecutarse correctamente en el entorno del repositorio con los mocks necesarios.
      ---
	  
## Semana 2: Módulo TEMPO Completo

### Lunes S2

| Dev | Tarea | Horas | Con Agente |
|-----|-------|-------|------------|
| **Fran** | Entidad TipoActividad + Repository + Service + Controller | 4h | CRUD completo |
| **Fran** | Entidad Actividad (v2: temporadaId, descripcion, estado) | 3h | Con enums |
| **Sandra** | Modelos TypeScript TEMPO (actividad.model.ts completo) | 2h |  
**Descripción técnica:**  
- Crear/actualizar `teatro-real-frontend/src/app/features/tempo/models/actividad.model.ts` siguiendo el Plan v2 (`DOC_GENERADA/PLAN_IMPLEMENTACION_FRONTEND_v2.md`, sección **3.2**).  
- El modelo debe incluir **todos los campos actualizados v2**:  
  - **Actividad:**  
    - `id: string`, `titulo: string`, `tipoActividad: TipoActividad`, `espacio: Espacio`, `fecha: string`, `horaInicio: string`, `horaFin: string`  
    - `departamento?: Departamento`, `notas?: string`
    - **NUEVO v2:** `temporadaId?: number`, `temporada?: Temporada`, `descripcion?: string`
    - **Almacén:** `tipoMovimiento?: 'RECOGIDA' | 'SALIDA'`, `numCamiones?: number`, `lugarOrigen?: string`, `lugarDestino?: string`, `produccionNombre?: string`
    - **Estados almacén:** `estado?: 'PENDIENTE' | 'EN_TRANSITO' | 'COMPLETADO'`
    - **Documentos:** `documentos?: ActividadDocumento[]` (con origen LOCAL/DRIVE_INTRANET)
    - **Audit:** `createdBy?: Usuario`, `createdAt?: Date`, `updatedAt?: Date`
  - **ActividadFormData:** incluye los campos requeridos para crear/editar.
  - **ActividadDocumento:** incluye campo `origen`, `orden`, y asociación a `actividadId`.
  - **Espacio, TipoActividad, Departamento, Temporada:** Importar y definir interfaces según detalle de plan v2, incluyendo nuevos campos (color, capacidades, jefe/personal, descripción, etc.).
- Todos los tipos y enums deben ser **union types** (no `string` libre).  
- Separar cada interface con comentario y explicar para qué sirve cada una (añadir docstrings).
-  
**Criterios de aceptación:**  
- Campos, relaciones y tipos deben coincidir exactamente con el plan v2.
- Deben estar presentes los nuevos campos y entidades asociadas en v2.
- Compila sin errores TypeScript.
-  
**Referencia completa:**  
Ver ejemplo práctico y estructura en sección 3.2 del plan (`actividad.model.ts`, `espacio.model.ts`, `tipo-actividad.model.ts`).

| **Sandra** | ActividadService + EspacioService + TipoActividadService | 4h |  
**Descripción técnica:**  
- Implementar y documentar en `teatro-real-frontend/src/app/features/tempo/services/` lo siguiente:
  - `actividad.service.ts` (**ver plan v2 sección 5.1**):  
    - Basarse en el código ejemplo completo del plan.
    - Uso de **signals** (`actividadSignal`, etc.), integración con signals y computed.
    - Métodos requeridos:  
      - Carga (`loadActividades(filter: CalendarioFilter)`),  
      - CRUD completo,  
      - Métodos especiales: `clone(id, nuevaFecha)`, `updateStatus(id, estado)`,  
      - Filtros por fecha, espacio, actividad, departamento y temporada.
    - Toda la lógica reactiva debe ser con signals/computed, no subjects.
    - Correcta actualización de la lista tras alta/edición/borrado.
  - `espacio.service.ts`, `tipo-actividad.service.ts`:  
    - Estructura y métodos análogos (cargar, listar, crear, editar, borrar).  
    - Fields y métodos alineados con la estructura de los modelos v2.
    - Sugiere uso de signals/computed igual.
-  
**Criterios de aceptación:**  
- Los servicios deben estar alineados a la estructura, métodos y lógica del plan v2.
- Uso de signals/computed como reactividad principal.
- Todos los endpoints y campos alineados a actividad, espacio y tipoActividad v2.
- Tests pasan/compila correctamente.
-  
**Referencia completa:**  
Ver `features/tempo/services/actividad.service.ts` y sección 5.1 del plan.
| **Sergio** | Review: Modelos TEMPO alineados | 1h | EOD |

**Entregable:** Capa de datos TEMPO completa

### Martes S2

| Dev | Tarea | Horas | Con Agente |
|-----|-------|-------|------------|
| **Fran** | ActividadController: CRUD + filtros (espacio, tipo, temporada, fecha) | 4h | Query params |
| **Fran** | POST /actividades/{id}/clone | 2h | Clonar a nueva fecha |
| **Fran** | PUT /actividades/{id}/status | 2h | Máquina estados almacén |
| **Sandra** | Instalar y configurar FullCalendar | 2h | npm + módulos |
  **Desglose técnico (según Plan v2):**
  - Instalar en `teatro-real-frontend` los paquetes npm:
    - `@fullcalendar/angular`
    - `@fullcalendar/core`
    - `@fullcalendar/daygrid`
    - `@fullcalendar/timegrid`
    - `@fullcalendar/interaction`
  - (Recomendados también): `date-fns`, `file-saver`, `@types/file-saver` (dev).
  - Usar el siguiente comando y añadirlo a la documentación interna:
    ```bash
    npm install @fullcalendar/angular @fullcalendar/core @fullcalendar/daygrid @fullcalendar/timegrid @fullcalendar/interaction
    npm install date-fns file-saver
    npm install -D @types/file-saver
    ```
  - Comprobar versiones compatibles con Angular 18.
  - Objetivo: dejar preparado el entorno para integración con FullCalendar en Angular 18+ standalone components.
| **Sandra** | CalendarioComponent base con FullCalendar | 4h | Eventos + vistas |
  **Desglose técnico (según Plan v2):**
  - Crear el componente standalone en `teatro-real-frontend/src/app/features/tempo/calendario/calendario.component.ts`.
  - Importar y configurar FullCalendar para Angular, integrando los plugins dayGrid, timeGrid e interaction, usando la API recomendada por FullCalendar y Angular >=18.
  - Mostrar al menos:
    - Vista mensual y semanal (usando dayGrid y timeGrid).
    - Eventos cargados desde el backend usando ActividadService (`loadActividades()`), representando actividades TEMPO.
    - Configurar el componente para que el usuario pueda cambiar de vista (mes, semana, día) y navegar entre fechas.
    - Cada evento debe mostrar: título, horaInicio-horaFin y tipo/color según la actividad.
  - Usar signals para la gestión reactiva de los eventos.
  - Estilos: aplicar la paleta de colores institucional y seguir buenas prácticas de responsividad y accesibilidad como se describe en el Plan v2 (secciones 1.3, 10 y 6.5).
  - Referencia directa de estructura y ejemplos en el Plan v2. 
  - El componente debe ser fácilmente integrable en la landing TEMPO y permitir futura extensión con más funcionalidades (drag&drop, selección avanzada o filtros).
| **Sergio** | Review: API TEMPO + Calendario base | 1h | EOD |

**Entregable:** API TEMPO completa + Calendario visual

### Miércoles S2

| Dev | Tarea | Horas | Con Agente |
|-----|-------|-------|------------|
| **Fran** | Entidad ActividadDocumento (origen: LOCAL/DRIVE) | 2h | |
| **Fran** | Endpoint upload documentos actividad | 3h | MultipartFile |
| **Fran** | GET /signage/global (cartelería todas las salas) | 2h | DTO especial |
| **Sandra** | WeeklyExcelView component (landing TEMPO) | 5h | Tabla estilo Excel |
  **Desglose técnico (según Plan v2):**
  - Crear un componente standalone en `teatro-real-frontend/src/app/features/tempo/landing/weekly-excel-view/weekly-excel-view.component.ts`.
  - Debe renderizar una tabla tipo Excel semanal: filas = espacios, columnas = días de la semana.
  - Mostrar todas las actividades de la semana: cada celda incluye chips con las actividades de ese día y espacio (color y mini-chip configurado por tipoActividad/colorHex).
  - Navegación entre semanas (prev/next), usando signals para semana seleccionada.
  - Integración: usa signals de `ActividadService` y `EspacioService` (carga inicial y filters).
  - Responsivo (scroll-x en tablas), barra sticky para espacio y cabecera.
  - Accesibilidad: buen contraste, focus visible y roles ARIA básicos.
  - Opcional: handler para seleccionar/clickar actividad que permita ampliar funcionalidad.
  - Referencia y ejemplo detallado: sección 6.5 del Plan v2.
| **Sandra** | TEMPO Landing component (contenedor) | 2h | Tabs: Excel / Calendario |
  **Desglose técnico (según Plan v2):**
  - Crear un componente standalone en `teatro-real-frontend/src/app/features/tempo/landing/tempo-landing.component.ts`.
  - Actúa como "contenedor" de vistas, mostrando dos tabs principales: 
    - Vista semanal tipo Excel (componente WeeklyExcelView)
    - Vista Calendario (componente CalendarioComponent o rutas relacionadas)
  - Tabs mediante Angular Material `MatTabGroup` o solución standalone según el stack.
  - UX: cambiar entre vistas debe ser instantáneo; mantener el estado de semana/vista seleccionada.
  - Accesible desde teclado, responsivo y siguiendo la guía de estilos del proyecto.
  - Punto único de entrada para futuras extensiones (filtros globales, acciones contextuales).
  - Referencia y estructura ejemplo: ver organización de landing en sección 6.5 y organización del plan v2.
| **Sergio** | **CHECKPOINT:** Landing TEMPO funcionando | 2h | Test manual |

**Entregable:** Landing TEMPO con vista semanal Excel

### Jueves S2

| Dev | Tarea | Horas | Con Agente |
|-----|-------|-------|------------|
| **Fran** | Migración V3: Datos semilla (espacios, tipos actividad) | 2h | INSERT realistas |
| **Fran** | Tests ActividadService (clone, status) | 3h | JUnit |
| **Sandra** | Dialog Actividad (crear/editar) con campos v2 | 4h | Material Dialog |
  **Desglose técnico (según Plan v2):**
  - Crear componente standalone `actividad-dialog` en `src/app/features/tempo/actividad/actividad-dialog/actividad-dialog.component.ts`.
  - Implementar formulario reactivo para crear y editar actividades (todos los campos de modelo v2).
  - Formulario con validaciones, agrupado por bloques: información general, tipo, espacio, horario, almacén, documentos y notas.
  - Reutilizar los modelos `ActividadFormData`, `TipoActividad`, `Espacio`, `Departamento`, etc.; usar selects, pickers y controles de Angular Material.
  - Integración bidireccional: al abrir para editar una actividad, se precargan los datos.
  - UX accesible y responsivo; uso de MatDialog; paleta de colores institucional.
  - Integración con botón “nuevo” y edición en la landing/calandario.
  - Ver ejemplo y convenciones en el Plan v2 sección “Dialog creación/edición actividad”.

| **Sandra** | Actividad Status Control (botones transición estados) | 2h | Para almacén |
  **Desglose técnico (según Plan v2):**
  - Desarrollar componente standalone `actividad-status-control` en `src/app/features/tempo/actividad/actividad-status-control/actividad-status-control.component.ts`.
  - Muestra el estado actual (‘PENDIENTE’, ‘EN_TRANSITO’, ‘COMPLETADO’) con un chip (usa StatusBadge).
  - Incluye botones para transición de estado (sólo transiciones permitidas: PENDIENTE→EN_TRANSITO→COMPLETADO), con feedback y accesibilidad.
  - Llama al método `updateStatus` de `ActividadService` y actualiza la UI tras cada cambio.
  - Integración para mostrarse en el detalle y en el formulario de actividad tipo almacén.
  - UX claro, visible y accesible para teclado y lector de pantalla.
  - Referencia: componente StatusBadge y sección “Control de estados almacén” del plan v2.
| **Sandra** | Actividad Clone Dialog | 2h | Selector fecha destino |
  **Desglose técnico (según Plan v2):**
  - Crear componente standalone `actividad-clone-dialog` en `src/app/features/tempo/actividad/actividad-clone-dialog/actividad-clone-dialog.component.ts`.
  - Dialog que permite seleccionar una fecha de destino (date picker) y clonar una actividad existente a esa fecha.
  - Incluye validación de fecha (no fechas pasadas, no solapamiento si aplica).
  - Al confirmar, usa el método `clone(id, nuevaFecha)` de `ActividadService`.
  - Mensajes claros para el usuario, confirmación y feedback, accesibilidad de teclado.
  - Integrar este dialog con las acciones de “clonar” en la UI de actividad (lista, detalle y calendario).
  - Ejemplo y estructura en sección “Botón clonar actividad” del plan v2.
| **Sergio** | Review: Flujos actividad completos | 1h | EOD |

**Entregable:** CRUD actividades completo con estados y clone

### Viernes S2

| Dev | Tarea | Horas | Con Agente |
|-----|-------|-------|------------|
| **Fran** | Admin: CRUD Espacios (con campos v2) | 3h | Controller completo |
| **Fran** | Admin: CRUD TiposActividad | 2h | Controller completo |
| **Sandra** | Admin: Lista + Form Espacios | 3h | Material table + form |
  **Desglose técnico (según Plan v2):**
  - Implementar listado y formulario standalone en `src/app/features/tempo/espacios/espacio-list/espacio-list.component.ts` y `espacio-form/espacio-form.component.ts`.
  - Listado con Angular Material Table: mostrar nombre, tipo, capacidad, color y acciones (editar, borrar).
  - Formulario reactivo para alta/edición, incluye todos los campos v2 (ver modelo Espacio).
  - Selección de color institucional vía ColorPicker (integrar con paleta y colorHex).
  - Validación en campos clave (nombre obligatorio, capacidad ≥ 0).
  - Usar servicio `EspacioService` (cargar, crear, editar, borrar).
  - Accesibilidad: focus en primer campo, labels, navegación teclado completa.
  - Ver ejemplos de estructura, validación y UX en el plan v2 (sección 6.4 y 5.1 para CRUD).
  - Exportar ambos componentes como standalone para facilitar test y reutilización.
| **Sandra** | Admin: Lista + Form TiposActividad | 2h | Con color picker |
  **Desglose técnico (según Plan v2):**
  - Crear componentes standalone `tipo-list/tipo-list.component.ts` (tabla) y `tipo-form/tipo-form.component.ts` (formulario).
  - Material Table: mostrar nombre, color, descripción y acciones.
  - Formulario reactivo para crear/editar tipo de actividad, conexión con servicio (`TipoActividadService` CRUD).
  - Selector de color usando el componente ColorPicker institucional.
  - Validación: nombre obligatorio, color requerido, orden numérico no negativo.
  - Integrar paleta predefinida según guía; UX claro y accesible, testabilidad.
  - Estructura (y autoimport) alineada a la práctica de features/tempo/tipos-actividad.
  - Ver ejemplos de formulario/tabla CRUD en la sección 6.4 del plan v2.
| **Sandra** | Admin: Lista + Form Departamentos (jefe, personal) | 3h | Con selects usuarios |
  **Desglose técnico (según Plan v2):**
  - Componentes standalone ubicados en `src/app/features/tempo/departamentos/departamento-list/departamento-list.component.ts` y `departamento-form/departamento-form.component.ts`.
  - Tabla lista todos los departamentos con campos: código, nombre, color, jefe (usuario), personal y acciones.
  - Uso de Material Autocomplete/Select para jefe y personal (usuarios del sistema).
  - Formularios permiten crear/editar departamentos, asociando jefe (usuario) y múltiples usuarios como personal.
  - ColorPicker para colorHex, validaciones en codigo y nombre, integración con servicio DepartamentoService.
  - Garantizar accesibilidad completa y feedback UX.
  - Ver ejemplos y estructura CRUD en sección 6.4 y nota sobre relaciones usuarios-departamentos del plan v2.
  - Preparar ambos como standalone, ready to test y reutilizar desde el módulo Admin.
| **Sergio** | **SPRINT REVIEW S2** | 2h | Demo TEMPO completo |

### Entregables Semana 2 ✓
- [ ] Landing TEMPO con vista semanal Excel
- [ ] Calendario FullCalendar integrado
- [ ] CRUD actividades con estados almacén
- [ ] Clonar actividades funcionando
- [ ] Admin: Espacios, Tipos, Departamentos
- [ ] Filtros por temporada operativos

---
