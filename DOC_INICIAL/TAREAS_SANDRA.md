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
- [ ] **`NotificationService` (polling cada 30s)**  
      **Horas:** 2h  
      **Notas:** Implementar con signals y temporizador.
- [ ] **Componente `NotificationBell` (header)**  
      **Horas:** 2h  
      **Notas:** Icono con badge de número de notificaciones, dropdown de detalle.
- [ ] **Actualizar `Header` con `NotificationBell` + `TemporadaSelector`**  
      **Horas:** 2h  
      **Notas:** Integrar ambos componentes en la barra de navegación.

### Viernes S1
- [ ] **Componentes shared: `StatusBadge`, `ColorPicker`**  
      **Horas:** 3h  
      **Notas:** Componentes reutilizables (design system básico).
- [ ] **Tests unitarios Auth frontend (Jasmine)**  
      **Horas:** 2h  
      **Notas:** Tests de `AuthService` y flujo básico de autenticación.

---

## Semana 2 – Módulo TEMPO Completo

### Lunes S2
- [ ] **Modelos TypeScript TEMPO (`actividad.model.ts` completo)**  
      **Horas:** 2h  
      **Notas:** Definir interfaces v2 alineadas con backend.
- [ ] **`ActividadService` + `EspacioService` + `TipoActividadService`**  
      **Horas:** 4h  
      **Notas:** Servicios con métodos v2 para CRUD y filtros principales.

### Martes S2
- [ ] **Instalar y configurar FullCalendar**  
      **Horas:** 2h  
      **Notas:** Añadir dependencias npm, configurar módulo y tipos.
- [ ] **`CalendarioComponent` base con FullCalendar**  
      **Horas:** 4h  
      **Notas:** Integrar eventos, vistas (semanal/mensual) y carga de datos desde API.

### Miércoles S2
- [ ] **Componente `WeeklyExcelView` (landing TEMPO)**  
      **Horas:** 5h  
      **Notas:** Tabla tipo Excel con vista semanal de actividades.
- [ ] **Componente contenedor `TEMPO Landing`**  
      **Horas:** 2h  
      **Notas:** Layout con tabs: vista Excel / vista Calendario.

### Jueves S2
- [ ] **Dialog de Actividad (crear/editar) con campos v2**  
      **Horas:** 4h  
      **Notas:** `MatDialog` con formulario completo de actividad.
- [ ] **`Actividad Status Control` (botones de transición de estados)**  
      **Horas:** 2h  
      **Notas:** Controles para cambios de estado de almacén.
- [ ] **Dialog de clonado de Actividad (`Actividad Clone Dialog`)**  
      **Horas:** 2h  
      **Notas:** Selector de fecha destino y llamada al endpoint de clonación.

### Viernes S2
- [ ] **Admin: Lista + Form de `Espacios`**  
      **Horas:** 3h  
      **Notas:** Tabla (Material table) + formulario CRUD.
- [ ] **Admin: Lista + Form de `TiposActividad`**  
      **Horas:** 2h  
      **Notas:** Incluir selector de color (color picker).
- [ ] **Admin: Lista + Form de `Departamentos` (jefe, personal)**  
      **Horas:** 3h  
      **Notas:** Formularios con selects de usuarios (jefe y personal).

---

## Semana 3 – TOPS + Integraciones + Cierre

### Lunes S3
- [ ] **Modelos TypeScript TOPS (`guion.model.ts` completo)**  
      **Horas:** 2h  
      **Notas:** Interfaces v2 para Guion, Acto, Escena, Elemento, etc.
- [ ] **`GuionService` (con filtro por temporada y `misGuiones`)**  
      **Horas:** 3h  
      **Notas:** Incluir computed signals para filtros y listas derivadas.
- [ ] **Componente `TOPS Landing` (2 listas)**  
      **Horas:** 3h  
      **Notas:** Listas: guiones por temporada y “Mis guiones”.

### Martes S3
- [ ] **Lista de Guiones con filtro por temporada**  
      **Horas:** 2h  
      **Notas:** Material table con filtros y paginación básica.
- [ ] **Editor de Guion – estructura base**  
      **Horas:** 4h  
      **Notas:** Componente contenedor para la edición jerárquica del guion.
- [ ] **Estilos del editor emulando Word**  
      **Horas:** 2h  
      **Notas:** CSS específico para simular aspecto de documento.

### Miércoles S3
- [ ] **Panel de Acto expandible (CDK accordion)**  
      **Horas:** 2h  
      **Notas:** Cada acto como panel expandible/colapsable.
- [ ] **Panel de Escena con elementos**  
      **Horas:** 3h  
      **Notas:** Lista de elementos de guion en cada escena, preparada para drag & drop.
- [ ] **Elemento de guion con colores configurables**  
      **Horas:** 2h  
      **Notas:** Item que usa los colores configurables (`ColorElementoService`).

### Jueves S3
- [ ] **Dialog TOP (crear/editar elemento de guion)**  
      **Horas:** 3h  
      **Notas:** Formulario completo para alta/edición de elemento.
- [ ] **Drag & drop de elementos (CDK)**  
      **Horas:** 3h  
      **Notas:** Permitir reordenar elementos dentro de escenas.
- [ ] **Componente de Cartelería Global**  
      **Horas:** 3h  
      **Notas:** Vista agregada de cartelería de todas las salas.

### Viernes S3
- [ ] **Vista “solo TOPs” + Vista por departamento**  
      **Horas:** 3h  
      **Notas:** Filtros para mostrar solo TOPs y segmentar por departamento.
- [ ] **Admin: Temporadas (CRUD)**  
      **Horas:** 2h  
      **Notas:** Lista y formulario de mantenimiento de temporadas.
- [ ] **Fixes y ajustes finales frontend**  
      **Horas:** 2h  
      **Notas:** Corrección de bugs detectados, pulido de UX/UI.
