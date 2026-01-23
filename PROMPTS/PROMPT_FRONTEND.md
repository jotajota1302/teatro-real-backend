# Template: Desarrollo Frontend (Angular)

## Instrucciones de Uso
Copia este template y rellena las secciones marcadas con `[...]`.

---

## PROMPT

```
## Contexto del Proyecto

Estoy desarrollando el frontend del **Sistema de Gestión del Teatro Real** con:
- **Angular 18.2** con Standalone Components
- **TypeScript 5.5**
- **TailwindCSS 3.4** para estilos
- **Angular Material 18** (cuando se instale) para componentes UI
- **Signals** para gestión de estado reactivo
- **RxJS 7.8** para operaciones asíncronas

### Estructura del Proyecto
```
teatro-real-frontend/src/app/
├── core/                    # Singleton services, guards, interceptors
│   ├── auth/               # AuthService, guards, interceptor
│   ├── services/           # ApiService, NotificationService
│   └── guards/             # RoleGuard, UnsavedChangesGuard
├── shared/                  # Componentes reutilizables
│   ├── components/         # ConfirmDialog, LoadingSpinner, etc.
│   ├── pipes/              # TimeFormatPipe, TruncatePipe
│   └── directives/         # ClickOutsideDirective
├── layout/                  # Layout principal
│   ├── main-layout/        # Contenedor principal
│   ├── sidebar/            # Navegación lateral
│   └── header/             # Cabecera
├── features/                # Módulos de funcionalidad
│   ├── auth/               # Login, callback
│   ├── dashboard/          # Dashboard principal
│   ├── tempo/              # Módulo TEMPO (calendario)
│   ├── tops/               # Módulo TOPS (guiones)
│   ├── admin/              # Módulo Admin
│   └── carteleria/         # Modo cartelería
└── environments/            # Configuración por entorno
```

### Convenciones a Seguir
- Componentes standalone (NO NgModules)
- Signals para estado local y computed
- Inyección con `inject()` en lugar de constructor
- Servicios con `signal()` para estado reactivo
- Control flow con `@if`, `@for`, `@switch` (nueva sintaxis Angular 17+)
- Lazy loading para rutas de features

### Paleta de Colores (TailwindCSS)
- Primary: `teatro-primary` (#1a1a2e)
- Secondary: `teatro-secondary` (#16213e)
- Accent: `teatro-accent` (#e94560)
- Gold: `teatro-gold` (#c9a227)

### Colores de Actividades
| Tipo | Color | Clase Tailwind |
|------|-------|----------------|
| Función | #0000FF | `bg-blue-600` |
| Ensayo | #008000 | `bg-green-600` |
| Montaje | #FA8072 | `bg-red-300` |
| Eventos | #FF1493 | `bg-pink-500` |

---

## Solicitud de Desarrollo

### Módulo
[core | shared | layout | features/auth | features/tempo | features/tops | features/admin]

### Tipo de Desarrollo
[Componente | Servicio | Guard | Interceptor | Pipe | Directiva | Página completa]

### Descripción
[Describe qué necesitas desarrollar]

### Requisito de Referencia
[RF-TEMPO-X | RF-TOPS-X | RF-ADMIN-X] - [Nombre del requisito]

### Especificaciones

#### Componente (si aplica)
- **Selector:** `app-[nombre]`
- **Ruta:** `src/app/[módulo]/[componente]/`
- **Inputs:**
  | Input | Tipo | Descripción |
  |-------|------|-------------|
  | [input1] | [tipo] | [descripción] |
- **Outputs:**
  | Output | Tipo | Descripción |
  |--------|------|-------------|
  | [output1] | `EventEmitter<tipo>` | [descripción] |

#### Servicio (si aplica)
- **Nombre:** `[Nombre]Service`
- **Ruta:** `src/app/[módulo]/services/`
- **Signals:**
  | Signal | Tipo | Descripción |
  |--------|------|-------------|
  | [signal1] | `Signal<tipo>` | [descripción] |
- **Métodos:**
  | Método | Retorno | Descripción |
  |--------|---------|-------------|
  | [método1] | [tipo] | [descripción] |

#### Modelo/Interface (si aplica)
```typescript
export interface [Nombre] {
  [campo1]: [tipo];
  [campo2]: [tipo];
}
```

### Diseño UI (si aplica)
- [Descripción del diseño esperado]
- [Comportamiento responsive]
- [Estados: loading, empty, error]

### Interacción con API
- **Endpoint:** `[método] /api/[recurso]`
- **Request:** [descripción]
- **Response:** [descripción]

### Criterios de Aceptación
- [ ] [Criterio 1]
- [ ] [Criterio 2]
- [ ] Componente standalone
- [ ] Estilos con TailwindCSS
- [ ] Manejo de estados (loading, error, empty)
- [ ] Responsive (mobile, tablet, desktop)

---

## Archivos de Referencia
- Ver modelos en: DOC_GENERADA/PLAN_IMPLEMENTACION_FRONTEND.md (sección 3)
- Ver servicios en: DOC_GENERADA/PLAN_IMPLEMENTACION_FRONTEND.md (sección 4-5)
- Ver componentes en: DOC_GENERADA/PLAN_IMPLEMENTACION_FRONTEND.md (sección 6)
```

---

## Ejemplos de Uso

### Ejemplo 1: Componente de Calendario (TEMPO)

```
## Solicitud de Desarrollo

### Módulo
features/tempo

### Tipo de Desarrollo
Página completa + Componentes

### Descripción
Implementar el componente de calendario para visualizar y gestionar actividades del teatro.

### Requisito de Referencia
RF-TEMPO-1 - CRUD de Actividades

### Especificaciones

#### Componente Principal
- **Selector:** `app-calendario`
- **Ruta:** `src/app/features/tempo/calendario/`

#### Inputs
| Input | Tipo | Descripción |
|-------|------|-------------|
| espacioId | number \| null | Filtrar por espacio (opcional) |
| tipoActividadId | number \| null | Filtrar por tipo (opcional) |

#### Outputs
| Output | Tipo | Descripción |
|--------|------|-------------|
| actividadClick | EventEmitter<Actividad> | Al hacer click en actividad |
| fechaSelect | EventEmitter<Date> | Al seleccionar fecha |

#### Modelo
```typescript
export interface Actividad {
  id: string;
  titulo: string;
  tipoActividad: TipoActividad;
  espacio: Espacio;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  departamento?: Departamento;
  notas?: string;
}

export interface TipoActividad {
  id: number;
  nombre: string;
  colorHex: string;
}
```

### Diseño UI
- Vista mensual por defecto
- Selector de vista: mes/semana/día
- Eventos coloreados según tipo de actividad
- Click en evento abre modal de detalle
- Click en día vacío abre modal de creación
- Filtros por espacio y tipo en header

### Interacción con API
- **GET** `/api/actividades?fechaInicio=X&fechaFin=Y` - Listar actividades
- **POST** `/api/actividades` - Crear actividad
- **PUT** `/api/actividades/{id}` - Actualizar actividad
- **DELETE** `/api/actividades/{id}` - Eliminar actividad

### Criterios de Aceptación
- [ ] Vista de calendario mensual funcional
- [ ] Eventos muestran color según tipo
- [ ] Filtros por espacio y tipo
- [ ] Modal de creación/edición de actividad
- [ ] Loading state mientras carga
- [ ] Responsive en tablet y desktop
```

### Ejemplo 2: AuthService con Signals

```
## Solicitud de Desarrollo

### Módulo
core/auth

### Tipo de Desarrollo
Servicio

### Descripción
Implementar el servicio de autenticación usando Signals para gestión de estado.

### Requisito de Referencia
RF-ADMIN-1 - Gestión de Usuarios y Roles

### Especificaciones

#### Servicio
- **Nombre:** `AuthService`
- **Ruta:** `src/app/core/auth/auth.service.ts`

#### Signals
| Signal | Tipo | Descripción |
|--------|------|-------------|
| currentUser | Signal<Usuario \| null> | Usuario autenticado |
| isAuthenticated | Signal<boolean> | Computed: hay usuario |
| isAdmin | Signal<boolean> | Computed: rol es ADMIN |
| isColaborador | Signal<boolean> | Computed: rol es ADMIN o COLABORADOR |

#### Métodos
| Método | Retorno | Descripción |
|--------|---------|-------------|
| loginWithGoogle() | void | Redirige a OAuth Google |
| handleCallback(token) | Observable<AuthResponse> | Procesa callback OAuth |
| logout() | void | Cierra sesión |
| getToken() | string \| null | Obtiene JWT del storage |
| hasRole(roles) | boolean | Verifica roles permitidos |

#### Modelo
```typescript
export interface Usuario {
  id: string;
  email: string;
  nombre: string;
  avatarUrl?: string;
  rol: Rol;
  departamento?: Departamento;
}

export interface Rol {
  id: number;
  nombre: 'ADMIN' | 'COLABORADOR' | 'CONSULTA';
  permisos: string[];
}

export interface AuthResponse {
  token: string;
  usuario: Usuario;
}
```

### Criterios de Aceptación
- [ ] Signals para estado de autenticación
- [ ] Persistencia en localStorage
- [ ] Método loginWithGoogle funcional
- [ ] Computed signals para roles
- [ ] Integración con AuthInterceptor
- [ ] Integración con AuthGuard
```

### Ejemplo 3: Sidebar de Navegación

```
## Solicitud de Desarrollo

### Módulo
layout

### Tipo de Desarrollo
Componente

### Descripción
Implementar el sidebar de navegación principal con menú colapsable.

### Especificaciones

#### Componente
- **Selector:** `app-sidebar`
- **Ruta:** `src/app/layout/sidebar/`

#### Inputs
| Input | Tipo | Descripción |
|-------|------|-------------|
| collapsed | boolean | Si está colapsado |

#### Outputs
| Output | Tipo | Descripción |
|--------|------|-------------|
| toggleCollapse | EventEmitter<void> | Al hacer toggle |

### Diseño UI
- Logo Teatro Real en la parte superior
- Menú de navegación:
  - Dashboard (icono home)
  - TEMPO > Calendario, Espacios, Tipos (submenú)
  - TOPS > Guiones (submenú)
  - Admin > Usuarios, Departamentos (solo si es ADMIN)
- Usuario actual y botón logout en la parte inferior
- Colapsable: solo iconos cuando collapsed=true
- Colores: fondo teatro-primary, texto blanco, hover teatro-gold

### Criterios de Aceptación
- [ ] Navegación con RouterLink
- [ ] Submenús expandibles
- [ ] Indicador de ruta activa
- [ ] Ocultar Admin si no es rol ADMIN
- [ ] Modo colapsado funcional
- [ ] Responsive: oculto en mobile, drawer en tablet
```
