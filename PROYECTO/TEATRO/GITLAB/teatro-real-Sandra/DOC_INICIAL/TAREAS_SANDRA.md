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
