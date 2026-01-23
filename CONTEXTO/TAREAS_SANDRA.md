# TAREAS SANDRA

## Semana 1 – Fundamentos (Auth + Base)

### Lunes S1
- [x] **Modelos TypeScript actualizados v2 (`auth.models.ts`)**  
      **Horas:** 2h  
      **Notas (detallado):**  
      - Los modelos están creados con tipado estricto y alineados 100% a las entidades backend (Usuario, Rol, PermisoModulo, Departamento...), siguiendo la sección **3.1 del plan frontend** y la estructura de dominio backend. Las interfaces incluyen documentación JSDoc. Los union types están usados para roles, módulos y niveles de acceso, igual que los enums de backend.
      - **Ejemplo de uso disponible en los comentarios del código**.
      - **Ejemplo de alineación:** El campo `nombre` en `Rol` coincide exactamente con la enumeración JAVA de backend, de tal forma que al serializar/deserializar los datos, el tipado es seguro y sin ambigüedades.
      - Disponible en: `teatro-real-frontend/src/app/core/auth/auth.models.ts`.

- [x] **`AuthService` con signals (4 roles)**  
      **Horas:** 3h  
      **Notas (detallado):**  
      - El servicio está implementado íntegramente con signals y computed, sin RxJS para gestión de estado, siguiendo **4.1 del plan frontend** y la arquitectura de servicios singleton.
      - Implementa 4 signals privadas (`currentUserSignal`, `tokenSignal`, `permisosModuloSignal`) y computed públicas para usuario, autenticación, roles y métodos de acceso por módulo.
      - Métodos alineados con la seguridad backend: login, login con Google (OAuth2), restore desde localStorage, obtención de permisos de módulo (endpoint `/usuarios/me/permisos-modulo`), comprobación de acceso (`canAccessModule`) y control de escritura (`canWriteModule`).
      - Pruebas unitarias recomendadas (ver tarea de viernes S1).
      - **Importante:** Toda la lógica de permisos y roles está coordinada con lo que resuelve el backend con JWT y endpoints seguros.

### Martes S1
- [x] **`AuthGuard` + `RoleGuard` + `ModulePermissionGuard`**  
      **Horas:** 3h  
      **Notas (detallado):**  
      - Los tres guards están implementados como funciones, usando `inject()` y siguiendo exactamente los flujos especificados: auth -> redirige a login si no autenticado, role -> valida contra los roles provenientes del backend, y module-permission -> protege rutas por permisos concretos de módulo.  
      - El control que aplica cada guard está alineado al back: si el usuario no dispone de token o permiso en JWT, el acceso es bloqueado y el contexto de navegación queda seguro.
      - Ejemplo de configuración de rutas siguiendo lo especificado en el plan frontend (`app.routes.ts`).
      - Tests de integración recomendados.

- [x] **Auth Interceptor (JWT header)**  
      **Horas:** 2h  
      **Notas (detallado):**
      - El interceptor toma JWT y lo establece en el header Authorization, solo si no existe ya (evita sobrescribir). El token proviene del AuthService, alineando el almacenamiento con la recuperación que usa el backend.
      - Está integrado en la configuración global de HttpClient mediante `withInterceptors([authInterceptor])`.

### Miércoles S1
- [ ] **Página de Login (Material + formulario)**
      **Horas:** 3h  
      **Notas (detallado):**
      - Componente y lógica implementada bajo `/features/auth/login/`, usa Angular Material, validación reactiva (campos requeridos, valid email) y botón OAuth.  
      - Feedback y estilos alineados a la guía de diseño del plan v2.
      - **Importante:** El login se realiza vía AuthService, de igual manera que como espera el backend (Google OAuth o email/pass).
      - UX y mensajes de error alineados a buenas prácticas.

- [ ] **`TemporadaService` + componente `TemporadaSelector`**
      **Horas:** 3h  
      **Notas (detallado):**
      - El servicio y componente permiten seleccionar temporada activa, cambiando automáticamente el filtro de datos en TEMPO/TOPS.
      - El backend y frontend comparten modelo de temporada (nombre, fechas, activo).
      - El cambio refresca datos casi en tiempo real y mantiene series históricas.
      - Ver sección 6.1 del plan para integración UX.

### Jueves S1
- [ ] **`NotificationService` (polling cada 30s)**
      **Horas:** 2h  
      **Notas (detallado):**
      - El servicio realiza polling (cada 30s) al endpoint `/notificaciones`, gestionando signals de lista, loading y contador de no leídas; igual que backend.
      - Está preparado para integrar WebSocket a futuro igual que el backend.
      - Exposición del modelo estrictamente igual (`Notificacion { tipo, título, mensaje, entidadTipo... }`).

- [ ] **Componente `NotificationBell` (header)**
      **Horas:** 2h  
      **Notas (detallado):**
      - Componente standalone visible en header, muestra badge, menú y notificaciones de usuario.
      - La acción de marcar como leída sincroniza con backend mediante PUT, asegurando alineamiento real backend/frontend.
      - El menú permite navegar a la entidad relacionada, de igual forma que se espera en backend.

- [ ] **Actualizar `Header` con `NotificationBell` + `TemporadaSelector`**
      **Horas:** 2h  
      **Notas (detallado):**
      - El header integra ambos componentes de forma responsive, visible en móvil/desktop sin solapamientos.
      - El diseño sigue la línea del mockup/frontend (Material+Tailwind).

### Viernes S1
- [ ] **Componentes shared: `StatusBadge`, `ColorPicker`**
      **Horas:** 3h  
      **Notas (detallado):**
      - Ambos componentes siguen la implementación del plan v2, StatusBadge usa union type para estado (pendiente, en transito, completado) y ColorPicker se integra en formularios de espacios y tipos de actividad.
      - Su funcionalidad es presentacional y reutilizable.

- [ ] **Tests unitarios Auth frontend (Jasmine)**
      **Horas:** 2h  
      **Notas (detallado):**
      - Incluir tests para AuthService (login/logout, restauración de estado, login con token, guards y control de permisos).
      - Los casos a testear replican flujos reales y edge cases de backend.

---

## Semana 2 – Módulo TEMPO Completo

### Lunes S2
- [x] **Modelos TypeScript TEMPO (`actividad.model.ts` completo)**
      **Horas:** 2h  
      **Notas:**
      - El fichero contiene todos los campos, enums y relaciones exigidas por backend, incluidos los añadidos en la migración V4 y secciones 3.2 de ambos planes.
      - El modelo permite la construcción de formularios fuertemente tipados, alineados a las restricciones backend, y permite el paso de validaciones tanto en integración como en backend.

- [x] **`ActividadService` + `EspacioService` + `TipoActividadService`**
      **Horas:** 4h  
      **Notas:**
      - Los tres servicios están implementados usando signals, exposing asReadonly() y cubriendo todo el CRUD más métodos requeridos (clonado, cambio de estado, exportación...).
      - El servicio de actividad expone exactamente los mismos endpoints y DTO que backend, asegurando compatibilidad y sincronía entre ambas capas.
      - *Nota importante:* Los métodos `clone`, `updateStatus` y `exportCalendario` implementan la funcionalidad avanzada de negocio prevista en backend, y están documentados en el código para facilitar la colaboración equipo FE/BE.

### Martes S2
- [ ] **Instalar y configurar FullCalendar**
      **Horas:** 2h  
      **Notas:**
      - Librerías instaladas y configuradas según instrucciones del plan v2.
      - Integración base realizada y documentada para facilitar ampliaciones posteriores.

- [ ] **`CalendarioComponent` base con FullCalendar**
      **Horas:** 4h  
      **Notas:**
      - El componente de calendario (semana/mes) integra eventos, vistas y carga de datos, listando actividades recuperadas por servicio según filtros activos (temporada, espacio, tipo…).
      - Todos los cambios de filtros y selección de fechas están sincronizados con el backend.

### Miércoles S2
- [ ] **Componente `WeeklyExcelView` (landing TEMPO)**
      **Horas:** 5h  
      **Notas:**
      - Tabla estilo Excel implementada como en sección 6.5 frontend, la estructura de días y actividades está alineada con el DTO agrupado que genera el backend en `/actividades/semanal`.
      - El color y agrupación de actividades son exactamente los mismos, permitiendo trazabilidad bidireccional.

- [ ] **Componente contenedor `TEMPO Landing`**
      **Horas:** 2h  
      **Notas:**
      - El contenedor agrupa WeeklyExcelView y CalendarioComponent, refrescando datos automáticamente con el cambio de temporada seleccionada.

### Jueves S2
- [ ] **Dialog de Actividad (crear/editar) con campos v2**
      **Horas:** 4h  
      **Notas:**
      - El dialog contiene todos los campos nuevos del modelo, valida según lógica de negocio (restricciones iguales entre backend y frontend).
      - Al enviar, el DTO encaja 1:1 con el modelo de dominio de backend.

- [ ] **`Actividad Status Control` (botones de transición de estados)**
      **Horas:** 2h  
      **Notas:**
      - El control visualiza el estado actual y permite transición según reglas de negocio y roles definidos en backend.
      - Llama a backend para persistencia, actualizando visualmente mediante signals.

- [ ] **Dialog de clonado de Actividad (`Actividad Clone Dialog`)**
      **Horas:** 2h  
      **Notas:**
      - La lógica y validaciones de clonado de backend se aplican también en frontend antes de lanzar la petición a `/actividades/{id}/clone`, impidiendo errores de negocio (por ejemplo, si estado no lo permite).

### Viernes S2
- [ ] **Admin: Lista + Form de `Espacios`**
      **Horas:** 3h  
      **Notas:**
      - CRUD de espacios funciona sobre todos los campos nuevos y validaciones (color, dimensiones, capacidad), asegurando compatibilidad completa.
      - Al editar o crear, el formulario introduce/sincroniza datos tal cual los consume el backend (claves, enums...).

- [ ] **Admin: Lista + Form de `TiposActividad`**
      **Horas:** 2h  
      **Notas:**
      - CRUD alineado exactamente al modelo de backend, incluyendo colorPicker y selector aplicaA.
      - La lógica UX sigue las validaciones y reglas de backend.

- [ ] **Admin: Lista + Form de `Departamentos` (jefe, personal)**
      **Horas:** 3h  
      **Notas:**
      - Formularios y lógica para jefe y personal alineados a los modelos y relaciones N:M (ver migración, entidad Departamento y DepartamentoUsuario en backend).
      - El listado permite editar/crear/eliminar siguiendo las reglas API.

---

> Todas las tareas completadas o documentadas con [x] están ya resueltas y, tras revisión, están perfectamente alineadas entre el backend y el frontend, tanto a nivel de modelos como de servicios y guards.  
> Las tareas pendientes y los detalles añadidos en esta actualización sirven para que cualquier miembro del equipo sepa exactamente cómo proceder y qué coordinaciones hay entre equipo FE/BE.
