# Teatro Real - Plan de Implementación Frontend v2
## Angular 18.2 + Angular Material 18 + TailwindCSS 3.4

---
**Stack:** Angular 18.2 | TypeScript 5.5 | Angular Material 18 | TailwindCSS 3.4 | RxJS 7.8
**Fecha:** 2025-12-11
**Última actualización:** 2025-12-20 (v2 - Incorpora feedback cliente v1.3)

> **Estado actual:** Proyecto Angular creado con standalone components, TailwindCSS y Angular Material configurados.

---

## Changelog v1 → v2

| Área | Cambio | Impacto |
|------|--------|---------|
| **Modelos Auth** | Roles: COLABORADOR → GESTOR, nuevos OPERADOR, VISUALIZADOR | Actualizar tipos y guards |
| **Modelos TEMPO** | Nuevos campos: temporada, descripcion en Actividad | Actualizar interfaces y formularios |
| **Modelos TEMPO** | Espacio: nuevos campos color, capacidad, dimensiones | Actualizar interfaces y formularios |
| **Modelos TEMPO** | Departamento: nuevos campos descripcion, jefe, personal | Actualizar interfaces y formularios |
| **Modelos TEMPO** | Estado actividades almacén: PENDIENTE → EN_TRANSITO → COMPLETADO | Nueva UI de estados |
| **TEMPO Landing** | Nueva: Vista semanal estilo Excel (como landing) | Nuevo componente |
| **TEMPO Features** | Clonar actividades | Nuevo botón y servicio |
| **TEMPO Docs** | Documentos de 2 fuentes: Drive intranet + Local | Selector de origen documento |
| **TOPS Modelos** | Organización por Temporadas | Nuevo selector temporada |
| **TOPS Landing** | Nueva: 2 listas (guiones temporada + mis guiones) | Nuevo componente landing |
| **TOPS Editor** | Emular formato Word exacto | Ajustar estilos editor |
| **TOPS Colores** | Colores configurables para elementos | Nueva entidad + selector |
| **Cartelería** | Nueva vista global (todas las salas) | Nuevo componente |
| **Notificaciones** | Sistema notificaciones en header | Nuevo servicio + componente |
| **Drive** | Integración navegador Drive intranet | Nuevo componente selector |
| **Horas** | Estimación actualizada | +51h respecto a v1 |

---

## 1. Arquitectura del Frontend (Actualizada v2)

### 1.1 Estructura del Proyecto

```
teatro-real-frontend/
├── angular.json
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── proxy.conf.json                    # NUEVO: Proxy para desarrollo
├── src/
│   ├── main.ts
│   ├── index.html
│   ├── styles.scss
│   │
│   ├── app/
│   │   ├── app.component.ts
│   │   ├── app.config.ts
│   │   ├── app.routes.ts
│   │   │
│   │   ├── core/                          # Singleton services, guards, interceptors
│   │   │   ├── auth/
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── auth.guard.ts
│   │   │   │   ├── auth.interceptor.ts
│   │   │   │   ├── role.guard.ts          # ACTUALIZADO: 4 roles
│   │   │   │   └── auth.models.ts         # ACTUALIZADO: nuevos roles
│   │   │   ├── services/
│   │   │   │   ├── api.service.ts
│   │   │   │   ├── notification.service.ts # NUEVO: Sistema notificaciones
│   │   │   │   ├── drive.service.ts        # NUEVO: Integración Drive
│   │   │   │   ├── temporada.service.ts    # NUEVO: Gestión temporadas
│   │   │   │   └── websocket.service.ts
│   │   │   └── guards/
│   │   │       ├── module-permission.guard.ts  # NUEVO: Permisos por módulo
│   │   │       └── unsaved-changes.guard.ts
│   │   │
│   │   ├── shared/                        # Componentes reutilizables
│   │   │   ├── components/
│   │   │   │   ├── confirm-dialog/
│   │   │   │   ├── loading-spinner/
│   │   │   │   ├── breadcrumb/
│   │   │   │   ├── data-table/
│   │   │   │   ├── color-picker/
│   │   │   │   ├── file-upload/
│   │   │   │   ├── empty-state/
│   │   │   │   ├── temporada-selector/     # NUEVO: Selector de temporada
│   │   │   │   ├── drive-file-selector/    # NUEVO: Selector archivos Drive
│   │   │   │   ├── document-source-picker/ # NUEVO: Selector origen documento
│   │   │   │   ├── notification-bell/      # NUEVO: Campana notificaciones
│   │   │   │   └── status-badge/           # NUEVO: Badge de estados
│   │   │   ├── pipes/
│   │   │   │   ├── time-format.pipe.ts
│   │   │   │   └── truncate.pipe.ts
│   │   │   ├── directives/
│   │   │   │   └── click-outside.directive.ts
│   │   │   └── shared.module.ts
│   │   │
│   │   ├── layout/                        # Layout principal
│   │   │   ├── main-layout/
│   │   │   │   ├── main-layout.component.ts
│   │   │   │   ├── main-layout.component.html
│   │   │   │   └── main-layout.component.scss
│   │   │   ├── sidebar/
│   │   │   │   ├── sidebar.component.ts
│   │   │   │   └── sidebar.component.html
│   │   │   ├── header/
│   │   │   │   ├── header.component.ts    # ACTUALIZADO: incluye notificaciones
│   │   │   │   └── header.component.html
│   │   │   └── footer/
│   │   │
│   │   ├── features/                      # Módulos de funcionalidad
│   │   │   │
│   │   │   ├── auth/                      # Autenticación
│   │   │   │   ├── login/
│   │   │   │   │   ├── login.component.ts
│   │   │   │   │   └── login.component.html
│   │   │   │   └── auth.routes.ts
│   │   │   │
│   │   │   ├── dashboard/                 # Dashboard principal
│   │   │   │   ├── dashboard.component.ts
│   │   │   │   ├── dashboard.component.html
│   │   │   │   ├── widgets/
│   │   │   │   │   ├── actividades-hoy/
│   │   │   │   │   ├── proximas-funciones/
│   │   │   │   │   └── estadisticas/
│   │   │   │   └── dashboard.routes.ts
│   │   │   │
│   │   │   ├── tempo/                     # Módulo TEMPO
│   │   │   │   ├── tempo.routes.ts
│   │   │   │   ├── services/
│   │   │   │   │   ├── actividad.service.ts  # ACTUALIZADO: clone, status
│   │   │   │   │   ├── espacio.service.ts
│   │   │   │   │   └── tipo-actividad.service.ts
│   │   │   │   ├── models/
│   │   │   │   │   ├── actividad.model.ts    # ACTUALIZADO: nuevos campos
│   │   │   │   │   ├── espacio.model.ts      # ACTUALIZADO: color, capacidad
│   │   │   │   │   └── tipo-actividad.model.ts
│   │   │   │   ├── state/
│   │   │   │   │   └── tempo.store.ts
│   │   │   │   ├── landing/                  # NUEVO: Landing semanal
│   │   │   │   │   ├── tempo-landing.component.ts
│   │   │   │   │   └── weekly-excel-view/    # Vista estilo Excel
│   │   │   │   ├── calendario/
│   │   │   │   │   ├── calendario.component.ts
│   │   │   │   │   ├── calendario.component.html
│   │   │   │   │   ├── calendario.component.scss
│   │   │   │   │   ├── vista-mensual/
│   │   │   │   │   ├── vista-semanal/
│   │   │   │   │   └── vista-diaria/
│   │   │   │   ├── actividad/
│   │   │   │   │   ├── actividad-list/
│   │   │   │   │   ├── actividad-form/       # ACTUALIZADO: nuevos campos
│   │   │   │   │   ├── actividad-detail/
│   │   │   │   │   ├── actividad-clone-dialog/  # NUEVO: Dialog clonar
│   │   │   │   │   └── actividad-status/        # NUEVO: Control estados almacén
│   │   │   │   ├── espacios/
│   │   │   │   │   ├── espacio-list/
│   │   │   │   │   └── espacio-form/         # ACTUALIZADO: nuevos campos
│   │   │   │   ├── tipos-actividad/
│   │   │   │       ├── tipo-list/
│   │   │   │       └── tipo-form/
│   │   │   │   └── logistica/                 # NUEVO: Módulo Logística (almacén)
│   │   │   │       ├── logistica.component.ts    # Dashboard con estadísticas
│   │   │   │       ├── logistica.component.html
│   │   │   │       ├── logistica.component.scss
│   │   │   │       ├── services/
│   │   │   │       │   └── logistica.service.ts  # CRUD operaciones + filtros
│   │   │   │       ├── models/
│   │   │   │       │   ├── operacion-logistica.model.ts
│   │   │   │       │   └── camion.model.ts
│   │   │   │       ├── operacion-list/           # Lista operaciones con filtros
│   │   │   │       ├── operacion-form/           # Dialog crear/editar operación
│   │   │   │       └── camion-management/        # Gestión de camiones
│   │   │   │
│   │   │   ├── tops/                      # Módulo TOPS
│   │   │   │   ├── tops.routes.ts
│   │   │   │   ├── services/
│   │   │   │   │   ├── guion.service.ts      # ACTUALIZADO: filtro temporada
│   │   │   │   │   ├── elemento.service.ts
│   │   │   │   │   └── color-elemento.service.ts  # NUEVO: Colores config
│   │   │   │   ├── models/
│   │   │   │   │   ├── guion.model.ts        # ACTUALIZADO: temporadaId
│   │   │   │   │   ├── acto.model.ts
│   │   │   │   │   ├── escena.model.ts
│   │   │   │   │   ├── elemento.model.ts
│   │   │   │   │   └── color-elemento.model.ts   # NUEVO
│   │   │   │   ├── state/
│   │   │   │   │   └── tops.store.ts
│   │   │   │   ├── landing/                  # NUEVO: Landing TOPS
│   │   │   │   │   ├── tops-landing.component.ts
│   │   │   │   │   ├── guiones-temporada-list/
│   │   │   │   │   └── mis-guiones-list/
│   │   │   │   ├── guion/
│   │   │   │   │   ├── guion-list/
│   │   │   │   │   ├── guion-detail/
│   │   │   │   │   └── guion-form/
│   │   │   │   ├── editor/
│   │   │   │   │   ├── editor.component.ts   # ACTUALIZADO: estilo Word
│   │   │   │   │   ├── editor.component.html
│   │   │   │   │   ├── editor.component.scss # ACTUALIZADO: emular Word
│   │   │   │   │   ├── acto-panel/
│   │   │   │   │   ├── escena-panel/
│   │   │   │   │   ├── elemento-item/        # ACTUALIZADO: colores config
│   │   │   │   │   ├── pasada-table/
│   │   │   │   │   └── top-form-dialog/
│   │   │   │   ├── colores/                  # NUEVO: Config colores
│   │   │   │   │   ├── color-config-list/
│   │   │   │   │   └── color-config-form/
│   │   │   │   └── vistas/
│   │   │   │       ├── vista-global/
│   │   │   │       ├── vista-tops/
│   │   │   │       └── vista-departamento/
│   │   │   │
│   │   │   ├── admin/                     # Módulo Admin
│   │   │   │   ├── admin.routes.ts
│   │   │   │   ├── usuarios/
│   │   │   │   │   ├── usuario-list/
│   │   │   │   │   └── usuario-form/         # ACTUALIZADO: 4 roles
│   │   │   │   ├── departamentos/
│   │   │   │   │   ├── departamento-list/
│   │   │   │   │   └── departamento-form/    # ACTUALIZADO: jefe, personal
│   │   │   │   ├── temporadas/               # NUEVO: Gestión temporadas
│   │   │   │   │   ├── temporada-list/
│   │   │   │   │   └── temporada-form/
│   │   │   │   ├── permisos-modulo/          # NUEVO: Permisos por módulo
│   │   │   │   │   └── permisos-config/
│   │   │   │   └── colores-elementos/        # NUEVO: Config colores TOPS
│   │   │   │       └── colores-config/
│   │   │   │
│   │   │   └── carteleria/                # Modo Cartelería
│   │   │       ├── carteleria.routes.ts      # NUEVO: rutas actualizadas
│   │   │       ├── carteleria-global/        # NUEVO: Vista global
│   │   │       │   └── carteleria-global.component.ts
│   │   │       └── carteleria-sala/          # Vista por sala
│   │   │           └── carteleria-sala.component.ts
│   │   │
│   │   └── environments/
│   │       ├── environment.ts
│   │       └── environment.prod.ts
│   │
│   └── assets/
│       ├── images/
│       ├── icons/
│       └── i18n/
│
└── e2e/
```

### 1.2 Dependencias Principales (package.json)

```json
{
  "name": "teatro-real-frontend",
  "version": "0.0.0",
  "scripts": {
    "ng": "ng",
    "start": "ng serve",
    "build": "ng build",
    "watch": "ng build --watch --configuration development",
    "test": "ng test"
  },
  "private": true,
  "dependencies": {
    "@angular/animations": "^18.2.0",
    "@angular/cdk": "^18.2.0",
    "@angular/common": "^18.2.0",
    "@angular/compiler": "^18.2.0",
    "@angular/core": "^18.2.0",
    "@angular/forms": "^18.2.0",
    "@angular/material": "^18.2.0",
    "@angular/platform-browser": "^18.2.0",
    "@angular/platform-browser-dynamic": "^18.2.0",
    "@angular/router": "^18.2.0",
    "rxjs": "~7.8.0",
    "tslib": "^2.3.0",
    "zone.js": "~0.14.10"
  },
  "devDependencies": {
    "@angular-devkit/build-angular": "^18.2.21",
    "@angular/cli": "^18.2.21",
    "@angular/compiler-cli": "^18.2.0",
    "@types/jasmine": "~5.1.0",
    "autoprefixer": "^10.4.22",
    "jasmine-core": "~5.2.0",
    "karma": "~6.4.0",
    "karma-chrome-launcher": "~3.2.0",
    "karma-coverage": "~2.2.0",
    "karma-jasmine": "~5.1.0",
    "karma-jasmine-html-reporter": "~2.1.0",
    "postcss": "^8.5.6",
    "tailwindcss": "^3.4.19",
    "typescript": "~5.5.2"
  }
}
```

### 1.3 Dependencias Adicionales (a añadir)

```bash
# FullCalendar (para módulo TEMPO)
npm install @fullcalendar/angular @fullcalendar/core @fullcalendar/daygrid @fullcalendar/timegrid @fullcalendar/interaction

# Utilidades adicionales
npm install date-fns file-saver
npm install -D @types/file-saver
```

---

## 2. Configuración Base

### 2.1 app.config.ts (Standalone Components)

```typescript
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

import { routes } from './app.routes';
import { authInterceptor } from './core/auth/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),
    provideAnimationsAsync(),
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } }
  ]
};
```

### 2.2 app.routes.ts (Actualizado v2)

```typescript
import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { modulePermissionGuard } from './core/guards/module-permission.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: '',
    loadComponent: () => import('./layout/main-layout/main-layout.component')
      .then(m => m.MainLayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component')
          .then(m => m.DashboardComponent)
      },
      {
        path: 'tempo',
        loadChildren: () => import('./features/tempo/tempo.routes').then(m => m.TEMPO_ROUTES),
        canActivate: [modulePermissionGuard],
        data: { modulo: 'TEMPO' }
      },
      {
        path: 'tops',
        loadChildren: () => import('./features/tops/tops.routes').then(m => m.TOPS_ROUTES),
        canActivate: [modulePermissionGuard],
        data: { modulo: 'TOPS' }
      },
      {
        path: 'admin',
        loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES),
        canActivate: [roleGuard],
        data: { roles: ['ADMIN'] }
      }
    ]
  },
  // NUEVO v2: Cartelería global
  {
    path: 'carteleria/global',
    loadComponent: () => import('./features/carteleria/carteleria-global/carteleria-global.component')
      .then(m => m.CarteleriaGlobalComponent)
  },
  // Cartelería por sala
  {
    path: 'carteleria/:espacioId',
    loadComponent: () => import('./features/carteleria/carteleria-sala/carteleria-sala.component')
      .then(m => m.CarteleriaSalaComponent)
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
```

### 2.3 Tailwind Config (Actualizado v2)

```javascript
// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'teatro': {
          'primary': '#1a1a2e',
          'secondary': '#16213e',
          'accent': '#e94560',
          'gold': '#c9a227'
        },
        // Colores de actividades
        'actividad': {
          'funcion': '#0000FF',
          'ensayo': '#008000',
          'montaje': '#FA8072',
          'pauta': '#808080',
          'cargas': '#FFFF00',
          'eventos': '#FF1493',
          'cursos': '#FFC0CB',
          'visitas': '#800080',
          'nocturnas': '#FFA500',
          'prensa': '#FF0000',
          'flamenco': '#DDA0DD'
        },
        // NUEVO v2: Estados de actividad almacén
        'estado': {
          'pendiente': '#FFA500',    // Naranja
          'en-transito': '#3B82F6',  // Azul
          'completado': '#22C55E'    // Verde
        }
      }
    },
  },
  plugins: [],
}
```

---

## 3. Modelos TypeScript (Actualizados v2)

### 3.1 Modelos Auth (Actualizado - 4 roles)

```typescript
// core/auth/auth.models.ts
export interface Usuario {
  id: string;
  email: string;
  nombre: string;
  avatarUrl?: string;
  rol: Rol;
  departamento?: Departamento;
  activo: boolean;
  ultimoAcceso?: Date;
}

// ACTUALIZADO v2: 4 roles
export interface Rol {
  id: number;
  nombre: 'ADMIN' | 'GESTOR' | 'OPERADOR' | 'VISUALIZADOR';
  descripcion: string;
  permisos: string[];
}

export interface AuthResponse {
  token: string;
  usuario: Usuario;
}

// NUEVO v2: Permisos por módulo
export interface PermisoModulo {
  id: number;
  usuarioId: string;
  modulo: 'TEMPO' | 'TOPS' | 'ADMIN';
  nivelAcceso: 'LECTURA' | 'ESCRITURA' | 'COMPLETO' | 'NINGUNO';
}
```

### 3.2 Modelos TEMPO (Actualizado v2)

```typescript
// features/tempo/models/actividad.model.ts
export interface Actividad {
  id: string;
  titulo: string;
  tipoActividad: TipoActividad;
  espacio: Espacio;
  fecha: string; // ISO date
  horaInicio: string; // HH:mm
  horaFin: string;
  departamento?: Departamento;
  notas?: string;
  // NUEVO v2: Campos adicionales
  temporadaId?: number;
  temporada?: Temporada;
  descripcion?: string;
  // Campos almacén
  tipoMovimiento?: 'RECOGIDA' | 'SALIDA';
  numCamiones?: number;
  lugarOrigen?: string;
  lugarDestino?: string;
  produccionNombre?: string;
  // NUEVO v2: Estado para actividades de almacén
  estado?: 'PENDIENTE' | 'EN_TRANSITO' | 'COMPLETADO';
  // Documentos (ACTUALIZADO v2: doble origen)
  documentos?: ActividadDocumento[];
  // Audit
  createdBy?: Usuario;
  createdAt?: Date;
  updatedAt?: Date;
}

// NUEVO v2: Documento con origen
export interface ActividadDocumento {
  id: number;
  actividadId: string;
  nombre: string;
  url: string;
  origen: 'LOCAL' | 'DRIVE_INTRANET';
  driveFileId?: string;  // Si origen es DRIVE_INTRANET
  orden: number;
}

export interface ActividadFormData {
  titulo: string;
  tipoActividadId: number;
  espacioId: number;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  departamentoId?: number;
  notas?: string;
  // NUEVO v2
  temporadaId?: number;
  descripcion?: string;
  // Almacén
  tipoMovimiento?: 'RECOGIDA' | 'SALIDA';
  numCamiones?: number;
  lugarOrigen?: string;
  lugarDestino?: string;
  produccionNombre?: string;
}

// ACTUALIZADO v2: Espacio con nuevos campos
export interface Espacio {
  id: number;
  nombre: string;
  tipo: 'SALA' | 'ALMACEN';
  googleCalendarId?: string;
  capacidad?: number;
  ubicacion?: string;
  activo: boolean;
  orden: number;
  // NUEVO v2
  color?: string;
  dimensiones?: string;
}

export interface TipoActividad {
  id: number;
  nombre: string;
  colorHex: string;
  aplicaA: 'SALA' | 'ALMACEN' | 'AMBOS';
  descripcion?: string;
  orden: number;
}

// ACTUALIZADO v2: Departamento con jefe y personal
export interface Departamento {
  id: number;
  codigo: string;
  nombre: string;
  ambito: string;
  colorHex?: string;
  // NUEVO v2
  descripcion?: string;
  jefeId?: string;
  jefe?: Usuario;
  personalIds?: string[];
  personal?: Usuario[];
}

// NUEVO v2: Temporada
export interface Temporada {
  id: number;
  nombre: string;      // ej: "2024/2025"
  fechaInicio: string;
  fechaFin: string;
  activa: boolean;
}

export interface CalendarioFilter {
  espacioId?: number;
  tipoActividadId?: number;
  departamentoId?: number;
  temporadaId?: number;  // NUEVO v2
  fechaInicio: string;
  fechaFin: string;
}
```

### 3.2.1 Modelos Logística (Nuevo)

```typescript
// features/tempo/logistica/models/operacion-logistica.model.ts

export type TipoOperacion = 'RECOGIDA' | 'SALIDA';
export type EstadoOperacion = 'PROGRAMADO' | 'EN_TRANSITO' | 'COMPLETADO' | 'CANCELADO';

export interface OperacionLogistica {
  id: number;
  nombre: string;
  tipo: TipoOperacion;
  estado: EstadoOperacion;
  origen: string;           // Ubicación de origen
  destino: string;          // Ubicación de destino
  fechaProgramada: string;  // ISO date
  fechaEjecucion?: string;  // ISO date (cuando se completó)
  camiones: Camion[];
  descripcion?: string;
  responsable?: string;
  actividadId?: number;     // Relación opcional con actividad
  createdAt: string;
  updatedAt: string;
}

export interface Camion {
  id: number;
  matricula: string;
  capacidad: number;        // En m³ o kg
  conductor?: string;
  estado: 'DISPONIBLE' | 'EN_RUTA' | 'MANTENIMIENTO';
}

export interface LogisticaStats {
  programados: number;
  enTransito: number;
  completados: number;
  camionesHoy: number;
}

export interface LogisticaFilter {
  tipo?: TipoOperacion;
  estado?: EstadoOperacion;
  fechaInicio?: string;
  fechaFin?: string;
}
```

### 3.3 Modelos TOPS (Actualizado v2)

```typescript
// features/tops/models/guion.model.ts
export interface Guion {
  id: string;
  produccionNombre: string;
  compania?: string;
  productor?: string;
  responsableEdicion?: string;
  directorEscena?: string;
  directorMusical?: string;
  version: number;
  versionNombre?: string;
  lockedBy?: Usuario;
  lockedAt?: Date;
  estado: 'BORRADOR' | 'EN_REVISION' | 'FINAL';
  actos: Acto[];
  // NUEVO v2: Asociación a temporada
  temporadaId?: number;
  temporada?: Temporada;
  createdBy?: Usuario;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Acto {
  id: string;
  guionId: string;
  numero: number;
  titulo?: string;
  orden: number;
  escenas: Escena[];
}

export interface Escena {
  id: string;
  actoId: string;
  numero?: number;
  titulo?: string;
  esPasada: boolean;
  orden: number;
  elementos: ElementoGuion[];
}

export interface ElementoGuion {
  id: string;
  escenaId: string;
  tipo: TipoElemento;
  codigo: string;
  parentId?: string;
  refPartituraPagina?: number;
  refPartituraLinea?: number;
  refPartituraCompas?: string;
  refTimecode?: string;
  descripcion?: string;
  observaciones?: string;
  lugar?: string;
  orden: number;
  // NUEVO v2: Color configurable
  colorConfig?: ColorElementoGuion;
  departamentos: Departamento[];
  adjuntos: ElementoAdjunto[];
  children?: ElementoGuion[];
}

export type TipoElemento = 'TOP' | 'ENTRADA' | 'MUTIS' | 'INTERNO' | 'AVISO' | 'PASADA_ITEM';

export interface ElementoAdjunto {
  id: number;
  elementoId: string;
  tipo: 'IMAGEN' | 'DOCUMENTO';
  url: string;
  nombreArchivo: string;
  origen: 'LOCAL' | 'DRIVE_INTRANET';  // NUEVO v2
  driveFileId?: string;
  orden: number;
}

// NUEVO v2: Configuración de colores para elementos
export interface ColorElementoGuion {
  id: number;
  tipoElemento: TipoElemento;
  colorFondo: string;
  colorTexto: string;
  colorBorde?: string;
  descripcion?: string;
}

export interface HistorialCambio {
  id: number;
  guionId: string;
  usuario: Usuario;
  accion: 'CREAR' | 'MODIFICAR' | 'ELIMINAR' | 'BLOQUEAR' | 'DESBLOQUEAR';
  entidad: string;
  entidadId?: string;
  detalle?: any;
  createdAt: Date;
}
```

### 3.4 Modelos Notificaciones (Nuevo v2)

```typescript
// core/services/notification.models.ts
export interface Notificacion {
  id: number;
  usuarioId: string;
  tipo: 'INFO' | 'WARNING' | 'ERROR' | 'CAMBIO_GUION' | 'ACTIVIDAD_MODIFICADA';
  titulo: string;
  mensaje: string;
  entidadTipo?: string;
  entidadId?: string;
  leida: boolean;
  createdAt: Date;
}
```

### 3.5 Modelos Drive (Nuevo v2)

```typescript
// core/services/drive.models.ts
export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  webViewLink?: string;
  downloadUrl?: string;
  size?: number;
  modifiedTime?: Date;
  parents?: string[];
}

export interface DriveFolder {
  id: string;
  name: string;
  path: string;
  children?: (DriveFile | DriveFolder)[];
}
```

---

## 4. Servicios Core (Actualizados v2)

### 4.1 AuthService (Actualizado - 4 roles)

```typescript
// core/auth/auth.service.ts
import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Usuario, AuthResponse, PermisoModulo } from './auth.models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API_URL = `${environment.apiUrl}/auth`;

  private currentUserSignal = signal<Usuario | null>(null);
  private tokenSignal = signal<string | null>(null);
  private permisosModuloSignal = signal<PermisoModulo[]>([]);

  currentUser = this.currentUserSignal.asReadonly();
  isAuthenticated = computed(() => !!this.tokenSignal());

  // ACTUALIZADO v2: 4 roles
  isAdmin = computed(() => this.currentUserSignal()?.rol.nombre === 'ADMIN');
  isGestor = computed(() =>
    ['ADMIN', 'GESTOR'].includes(this.currentUserSignal()?.rol.nombre || '')
  );
  isOperador = computed(() =>
    ['ADMIN', 'GESTOR', 'OPERADOR'].includes(this.currentUserSignal()?.rol.nombre || '')
  );
  isVisualizador = computed(() =>
    this.currentUserSignal()?.rol.nombre === 'VISUALIZADOR'
  );

  // NUEVO v2: Verificar permiso en módulo
  canAccessModule(modulo: 'TEMPO' | 'TOPS' | 'ADMIN'): boolean {
    const permisos = this.permisosModuloSignal();
    const permiso = permisos.find(p => p.modulo === modulo);
    return permiso ? permiso.nivelAcceso !== 'NINGUNO' : false;
  }

  canWriteModule(modulo: 'TEMPO' | 'TOPS' | 'ADMIN'): boolean {
    const permisos = this.permisosModuloSignal();
    const permiso = permisos.find(p => p.modulo === modulo);
    return permiso ? ['ESCRITURA', 'COMPLETO'].includes(permiso.nivelAcceso) : false;
  }

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.loadStoredAuth();
  }

  loginWithGoogle(): void {
    window.location.href = `${this.API_URL}/google`;
  }

  handleAuthCallback(token: string) {
    return this.http.get<AuthResponse>(`${this.API_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` }
    }).pipe(
      tap(response => {
        this.setAuth(response.token, response.usuario);
        this.loadPermisosModulo();
      })
    );
  }

  logout(): void {
    this.clearAuth();
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return this.tokenSignal();
  }

  hasRole(roles: string[]): boolean {
    const user = this.currentUserSignal();
    return user ? roles.includes(user.rol.nombre) : false;
  }

  private loadPermisosModulo(): void {
    this.http.get<PermisoModulo[]>(`${environment.apiUrl}/usuarios/me/permisos-modulo`)
      .subscribe(permisos => {
        this.permisosModuloSignal.set(permisos);
      });
  }

  private setAuth(token: string, usuario: Usuario): void {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_user', JSON.stringify(usuario));
    this.tokenSignal.set(token);
    this.currentUserSignal.set(usuario);
  }

  private clearAuth(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    this.tokenSignal.set(null);
    this.currentUserSignal.set(null);
    this.permisosModuloSignal.set([]);
  }

  private loadStoredAuth(): void {
    const token = localStorage.getItem('auth_token');
    const userStr = localStorage.getItem('auth_user');
    if (token && userStr) {
      this.tokenSignal.set(token);
      this.currentUserSignal.set(JSON.parse(userStr));
      this.loadPermisosModulo();
    }
  }
}
```

### 4.2 NotificationService (Nuevo v2)

```typescript
// core/services/notification.service.ts
import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, interval } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Notificacion } from './notification.models';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly API_URL = `${environment.apiUrl}/notificaciones`;

  private notificacionesSignal = signal<Notificacion[]>([]);
  private loadingSignal = signal(false);

  notificaciones = this.notificacionesSignal.asReadonly();
  loading = this.loadingSignal.asReadonly();

  // Contador de no leídas
  unreadCount = computed(() =>
    this.notificacionesSignal().filter(n => !n.leida).length
  );

  constructor(private http: HttpClient) {
    // Polling cada 30 segundos
    interval(30000).subscribe(() => this.loadNotificaciones().subscribe());
  }

  loadNotificaciones(): Observable<Notificacion[]> {
    this.loadingSignal.set(true);
    return this.http.get<Notificacion[]>(this.API_URL).pipe(
      tap(notificaciones => {
        this.notificacionesSignal.set(notificaciones);
        this.loadingSignal.set(false);
      })
    );
  }

  marcarLeida(id: number): Observable<Notificacion> {
    return this.http.put<Notificacion>(`${this.API_URL}/${id}/read`, {}).pipe(
      tap(updated => {
        this.notificacionesSignal.update(list =>
          list.map(n => n.id === id ? updated : n)
        );
      })
    );
  }

  marcarTodasLeidas(): Observable<void> {
    return this.http.put<void>(`${this.API_URL}/read-all`, {}).pipe(
      tap(() => {
        this.notificacionesSignal.update(list =>
          list.map(n => ({ ...n, leida: true }))
        );
      })
    );
  }
}
```

### 4.3 DriveService (Nuevo v2)

```typescript
// core/services/drive.service.ts
import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DriveFile, DriveFolder } from './drive.models';

@Injectable({ providedIn: 'root' })
export class DriveService {
  private readonly API_URL = `${environment.apiUrl}/drive`;

  private currentFolderSignal = signal<DriveFolder | null>(null);
  private filesSignal = signal<DriveFile[]>([]);
  private loadingSignal = signal(false);

  currentFolder = this.currentFolderSignal.asReadonly();
  files = this.filesSignal.asReadonly();
  loading = this.loadingSignal.asReadonly();

  constructor(private http: HttpClient) {}

  browse(folderId?: string): Observable<DriveFolder> {
    this.loadingSignal.set(true);
    const url = folderId ? `${this.API_URL}/browse/${folderId}` : `${this.API_URL}/browse`;

    return this.http.get<DriveFolder>(url).pipe(
      tap(folder => {
        this.currentFolderSignal.set(folder);
        this.loadingSignal.set(false);
      })
    );
  }

  search(query: string): Observable<DriveFile[]> {
    return this.http.get<DriveFile[]>(`${this.API_URL}/search`, {
      params: { q: query }
    }).pipe(
      tap(files => this.filesSignal.set(files))
    );
  }

  getFileInfo(fileId: string): Observable<DriveFile> {
    return this.http.get<DriveFile>(`${this.API_URL}/files/${fileId}`);
  }
}
```

### 4.4 TemporadaService (Nuevo v2)

```typescript
// core/services/temporada.service.ts
import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Temporada } from '../../features/tempo/models/actividad.model';

@Injectable({ providedIn: 'root' })
export class TemporadaService {
  private readonly API_URL = `${environment.apiUrl}/temporadas`;

  private temporadasSignal = signal<Temporada[]>([]);
  private selectedTemporadaSignal = signal<Temporada | null>(null);

  temporadas = this.temporadasSignal.asReadonly();
  selectedTemporada = this.selectedTemporadaSignal.asReadonly();

  // Temporada activa (actual)
  temporadaActiva = computed(() =>
    this.temporadasSignal().find(t => t.activa) || null
  );

  constructor(private http: HttpClient) {
    this.loadTemporadas().subscribe();
  }

  loadTemporadas(): Observable<Temporada[]> {
    return this.http.get<Temporada[]>(this.API_URL).pipe(
      tap(temporadas => {
        this.temporadasSignal.set(temporadas);
        // Seleccionar temporada activa por defecto
        const activa = temporadas.find(t => t.activa);
        if (activa && !this.selectedTemporadaSignal()) {
          this.selectedTemporadaSignal.set(activa);
        }
      })
    );
  }

  selectTemporada(temporada: Temporada): void {
    this.selectedTemporadaSignal.set(temporada);
  }

  create(data: Partial<Temporada>): Observable<Temporada> {
    return this.http.post<Temporada>(this.API_URL, data);
  }

  update(id: number, data: Partial<Temporada>): Observable<Temporada> {
    return this.http.put<Temporada>(`${this.API_URL}/${id}`, data);
  }

  setActiva(id: number): Observable<Temporada> {
    return this.http.put<Temporada>(`${this.API_URL}/${id}/activar`, {});
  }
}
```

---

## 5. Servicios de Dominio (Actualizados v2)

### 5.1 ActividadService (Actualizado v2)

```typescript
// features/tempo/services/actividad.service.ts
import { Injectable, signal, computed } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { Actividad, ActividadFormData, CalendarioFilter } from '../models/actividad.model';

@Injectable({ providedIn: 'root' })
export class ActividadService {
  private actividadesSignal = signal<Actividad[]>([]);
  private loadingSignal = signal(false);
  private selectedDateSignal = signal<Date>(new Date());

  actividades = this.actividadesSignal.asReadonly();
  loading = this.loadingSignal.asReadonly();
  selectedDate = this.selectedDateSignal.asReadonly();

  actividadesDelDia = computed(() => {
    const fecha = this.selectedDateSignal().toISOString().split('T')[0];
    return this.actividadesSignal().filter(a => a.fecha === fecha);
  });

  constructor(private api: ApiService) {}

  loadActividades(filter: CalendarioFilter): Observable<Actividad[]> {
    this.loadingSignal.set(true);
    return this.api.get<Actividad[]>('/actividades', filter).pipe(
      tap(actividades => {
        this.actividadesSignal.set(actividades);
        this.loadingSignal.set(false);
      })
    );
  }

  getById(id: string): Observable<Actividad> {
    return this.api.get<Actividad>(`/actividades/${id}`);
  }

  create(data: ActividadFormData): Observable<Actividad> {
    return this.api.post<Actividad>('/actividades', data).pipe(
      tap(nueva => {
        this.actividadesSignal.update(list => [...list, nueva]);
      })
    );
  }

  update(id: string, data: ActividadFormData): Observable<Actividad> {
    return this.api.put<Actividad>(`/actividades/${id}`, data).pipe(
      tap(updated => {
        this.actividadesSignal.update(list =>
          list.map(a => a.id === id ? updated : a)
        );
      })
    );
  }

  delete(id: string): Observable<void> {
    return this.api.delete<void>(`/actividades/${id}`).pipe(
      tap(() => {
        this.actividadesSignal.update(list => list.filter(a => a.id !== id));
      })
    );
  }

  // NUEVO v2: Clonar actividad
  clone(id: string, nuevaFecha: string): Observable<Actividad> {
    return this.api.post<Actividad>(`/actividades/${id}/clone`, { nuevaFecha }).pipe(
      tap(clonada => {
        this.actividadesSignal.update(list => [...list, clonada]);
      })
    );
  }

  // NUEVO v2: Cambiar estado (actividades almacén)
  updateStatus(id: string, estado: 'PENDIENTE' | 'EN_TRANSITO' | 'COMPLETADO'): Observable<Actividad> {
    return this.api.put<Actividad>(`/actividades/${id}/status`, { estado }).pipe(
      tap(updated => {
        this.actividadesSignal.update(list =>
          list.map(a => a.id === id ? updated : a)
        );
      })
    );
  }

  setSelectedDate(date: Date): void {
    this.selectedDateSignal.set(date);
  }

  exportCalendario(filter: CalendarioFilter): Observable<Blob> {
    return this.api.downloadBlob('/actividades/export');
  }
}
```

### 5.1.1 LogisticaService (Nuevo)

```typescript
// features/tempo/logistica/services/logistica.service.ts
import { Injectable, signal, computed, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApiService } from '../../../../core/services/api.service';
import {
  OperacionLogistica,
  LogisticaStats,
  LogisticaFilter,
  Camion
} from '../models/operacion-logistica.model';

@Injectable({ providedIn: 'root' })
export class LogisticaService {
  private api = inject(ApiService);

  // Signals
  private operacionesSignal = signal<OperacionLogistica[]>([]);
  private statsSignal = signal<LogisticaStats>({
    programados: 0,
    enTransito: 0,
    completados: 0,
    camionesHoy: 0
  });
  private filterSignal = signal<LogisticaFilter>({});

  // Public computed
  readonly operaciones = this.operacionesSignal.asReadonly();
  readonly stats = this.statsSignal.asReadonly();
  readonly filter = this.filterSignal.asReadonly();

  // Operaciones filtradas
  readonly operacionesFiltradas = computed(() => {
    const ops = this.operacionesSignal();
    const f = this.filterSignal();

    return ops.filter(op => {
      if (f.tipo && op.tipo !== f.tipo) return false;
      if (f.estado && op.estado !== f.estado) return false;
      return true;
    });
  });

  // API calls
  loadOperaciones(): Observable<OperacionLogistica[]> {
    return this.api.get<OperacionLogistica[]>('/logistica/operaciones').pipe(
      tap(data => this.operacionesSignal.set(data))
    );
  }

  loadStats(): Observable<LogisticaStats> {
    return this.api.get<LogisticaStats>('/logistica/stats').pipe(
      tap(data => this.statsSignal.set(data))
    );
  }

  createOperacion(data: Partial<OperacionLogistica>): Observable<OperacionLogistica> {
    return this.api.post<OperacionLogistica>('/logistica/operaciones', data);
  }

  updateOperacion(id: number, data: Partial<OperacionLogistica>): Observable<OperacionLogistica> {
    return this.api.put<OperacionLogistica>(`/logistica/operaciones/${id}`, data);
  }

  updateEstado(id: number, estado: string): Observable<OperacionLogistica> {
    return this.api.put<OperacionLogistica>(`/logistica/operaciones/${id}/estado`, { estado });
  }

  deleteOperacion(id: number): Observable<void> {
    return this.api.delete<void>(`/logistica/operaciones/${id}`);
  }

  // Camiones
  loadCamiones(): Observable<Camion[]> {
    return this.api.get<Camion[]>('/logistica/camiones');
  }

  // Filtros
  setFilter(filter: LogisticaFilter): void {
    this.filterSignal.set(filter);
  }

  clearFilter(): void {
    this.filterSignal.set({});
  }
}
```

### 5.2 GuionService (Actualizado v2)

```typescript
// features/tops/services/guion.service.ts
import { Injectable, signal, computed, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/auth/auth.service';
import { Guion, Acto, Escena, ElementoGuion, HistorialCambio } from '../models/guion.model';

@Injectable({ providedIn: 'root' })
export class GuionService {
  private api = inject(ApiService);
  private auth = inject(AuthService);

  private guionesSignal = signal<Guion[]>([]);
  private currentGuionSignal = signal<Guion | null>(null);
  private loadingSignal = signal(false);
  private editingSignal = signal(false);

  guiones = this.guionesSignal.asReadonly();
  currentGuion = this.currentGuionSignal.asReadonly();
  loading = this.loadingSignal.asReadonly();
  editing = this.editingSignal.asReadonly();

  isLockedByOther = computed(() => {
    const guion = this.currentGuionSignal();
    const currentUser = this.auth.currentUser();
    return guion?.lockedBy != null && guion.lockedBy.id !== currentUser?.id;
  });

  // NUEVO v2: Guiones de la temporada seleccionada
  guionesTemporada = computed(() => {
    // Filtrar por temporada activa/seleccionada
    return this.guionesSignal();
  });

  // NUEVO v2: Mis guiones (donde soy responsable de edición)
  misGuiones = computed(() => {
    const currentUser = this.auth.currentUser();
    return this.guionesSignal().filter(g =>
      g.createdBy?.id === currentUser?.id ||
      g.responsableEdicion === currentUser?.nombre
    );
  });

  loadGuiones(temporadaId?: number): Observable<Guion[]> {
    this.loadingSignal.set(true);
    const params = temporadaId ? { temporadaId } : {};

    return this.api.get<Guion[]>('/guiones', params).pipe(
      tap(guiones => {
        this.guionesSignal.set(guiones);
        this.loadingSignal.set(false);
      })
    );
  }

  getById(id: string): Observable<Guion> {
    this.loadingSignal.set(true);
    return this.api.get<Guion>(`/guiones/${id}`).pipe(
      tap(guion => {
        this.currentGuionSignal.set(guion);
        this.loadingSignal.set(false);
      })
    );
  }

  create(data: Partial<Guion>): Observable<Guion> {
    return this.api.post<Guion>('/guiones', data);
  }

  update(id: string, data: Partial<Guion>): Observable<Guion> {
    return this.api.put<Guion>(`/guiones/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.api.delete<void>(`/guiones/${id}`);
  }

  lock(id: string): Observable<Guion> {
    return this.api.post<Guion>(`/guiones/${id}/lock`, {}).pipe(
      tap(guion => {
        this.currentGuionSignal.set(guion);
        this.editingSignal.set(true);
      })
    );
  }

  unlock(id: string): Observable<Guion> {
    return this.api.post<Guion>(`/guiones/${id}/unlock`, {}).pipe(
      tap(guion => {
        this.currentGuionSignal.set(guion);
        this.editingSignal.set(false);
      })
    );
  }

  createActo(guionId: string, data: Partial<Acto>): Observable<Acto> {
    return this.api.post<Acto>(`/guiones/${guionId}/actos`, data);
  }

  createEscena(actoId: string, data: Partial<Escena>): Observable<Escena> {
    return this.api.post<Escena>(`/actos/${actoId}/escenas`, data);
  }

  createElemento(escenaId: string, data: Partial<ElementoGuion>): Observable<ElementoGuion> {
    return this.api.post<ElementoGuion>(`/escenas/${escenaId}/elementos`, data);
  }

  updateElemento(id: string, data: Partial<ElementoGuion>): Observable<ElementoGuion> {
    return this.api.put<ElementoGuion>(`/elementos/${id}`, data);
  }

  deleteElemento(id: string): Observable<void> {
    return this.api.delete<void>(`/elementos/${id}`);
  }

  reordenar(guionId: string, updates: {id: string, orden: number}[]): Observable<void> {
    return this.api.put<void>(`/guiones/${guionId}/reordenar`, { updates });
  }

  getVistaCompleta(id: string): Observable<Guion> {
    return this.api.get<Guion>(`/guiones/${id}/vista/completa`);
  }

  getVistaTops(id: string): Observable<ElementoGuion[]> {
    return this.api.get<ElementoGuion[]>(`/guiones/${id}/vista/tops`);
  }

  getVistaDepartamento(id: string, codigo: string): Observable<ElementoGuion[]> {
    return this.api.get<ElementoGuion[]>(`/guiones/${id}/vista/departamento/${codigo}`);
  }

  getHistorial(id: string): Observable<HistorialCambio[]> {
    return this.api.get<HistorialCambio[]>(`/guiones/${id}/historial`);
  }

  exportWord(id: string): Observable<Blob> {
    return this.api.downloadBlob(`/guiones/${id}/export`);
  }
}
```

### 5.3 ColorElementoService (Nuevo v2)

```typescript
// features/tops/services/color-elemento.service.ts
import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ColorElementoGuion, TipoElemento } from '../models/guion.model';

@Injectable({ providedIn: 'root' })
export class ColorElementoService {
  private readonly API_URL = `${environment.apiUrl}/colores-elemento`;

  private coloresSignal = signal<ColorElementoGuion[]>([]);

  colores = this.coloresSignal.asReadonly();

  constructor(private http: HttpClient) {
    this.loadColores().subscribe();
  }

  loadColores(): Observable<ColorElementoGuion[]> {
    return this.http.get<ColorElementoGuion[]>(this.API_URL).pipe(
      tap(colores => this.coloresSignal.set(colores))
    );
  }

  getColorForTipo(tipo: TipoElemento): ColorElementoGuion | undefined {
    return this.coloresSignal().find(c => c.tipoElemento === tipo);
  }

  update(id: number, data: Partial<ColorElementoGuion>): Observable<ColorElementoGuion> {
    return this.http.put<ColorElementoGuion>(`${this.API_URL}/${id}`, data).pipe(
      tap(updated => {
        this.coloresSignal.update(list =>
          list.map(c => c.id === id ? updated : c)
        );
      })
    );
  }
}
```

---

## 6. Componentes Nuevos v2

### 6.1 TemporadaSelector Component

```typescript
// shared/components/temporada-selector/temporada-selector.component.ts
import { Component, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TemporadaService } from '../../../core/services/temporada.service';
import { Temporada } from '../../../features/tempo/models/actividad.model';

@Component({
  selector: 'app-temporada-selector',
  standalone: true,
  imports: [CommonModule, MatSelectModule, MatFormFieldModule],
  template: `
    <mat-form-field class="w-48">
      <mat-label>Temporada</mat-label>
      <mat-select
        [value]="temporadaService.selectedTemporada()"
        (selectionChange)="onTemporadaChange($event.value)">
        @for (temporada of temporadaService.temporadas(); track temporada.id) {
          <mat-option [value]="temporada">
            {{ temporada.nombre }}
            @if (temporada.activa) {
              <span class="text-green-600 text-sm ml-2">(Actual)</span>
            }
          </mat-option>
        }
      </mat-select>
    </mat-form-field>
  `
})
export class TemporadaSelectorComponent {
  temporadaService = inject(TemporadaService);
  temporadaChange = output<Temporada>();

  onTemporadaChange(temporada: Temporada): void {
    this.temporadaService.selectTemporada(temporada);
    this.temporadaChange.emit(temporada);
  }
}
```

### 6.2 NotificationBell Component

```typescript
// shared/components/notification-bell/notification-bell.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { NotificationService } from '../../../core/services/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notification-bell',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatBadgeModule,
    MatMenuModule,
    MatButtonModule,
    MatDividerModule
  ],
  template: `
    <button mat-icon-button [matMenuTriggerFor]="notificationMenu"
            [matBadge]="notificationService.unreadCount()"
            [matBadgeHidden]="notificationService.unreadCount() === 0"
            matBadgeColor="warn"
            matBadgeSize="small">
      <mat-icon>notifications</mat-icon>
    </button>

    <mat-menu #notificationMenu="matMenu" class="notification-menu w-80">
      <div class="p-3 flex justify-between items-center border-b">
        <span class="font-semibold">Notificaciones</span>
        @if (notificationService.unreadCount() > 0) {
          <button mat-button color="primary"
                  (click)="markAllRead($event)">
            Marcar todas leídas
          </button>
        }
      </div>

      @if (notificationService.notificaciones().length === 0) {
        <div class="p-4 text-center text-gray-500">
          No hay notificaciones
        </div>
      } @else {
        @for (notif of notificationService.notificaciones().slice(0, 10); track notif.id) {
          <div class="notification-item p-3 border-b cursor-pointer hover:bg-gray-50"
               [class.bg-blue-50]="!notif.leida"
               (click)="onNotificationClick(notif)">
            <div class="flex items-start gap-2">
              <mat-icon [class]="getIconClass(notif.tipo)">
                {{ getIcon(notif.tipo) }}
              </mat-icon>
              <div class="flex-1">
                <p class="font-medium text-sm">{{ notif.titulo }}</p>
                <p class="text-xs text-gray-500 mt-1">{{ notif.mensaje }}</p>
                <p class="text-xs text-gray-400 mt-1">
                  {{ notif.createdAt | date:'short' }}
                </p>
              </div>
            </div>
          </div>
        }
      }
    </mat-menu>
  `,
  styles: [`
    .notification-menu {
      max-height: 400px;
      overflow-y: auto;
    }
  `]
})
export class NotificationBellComponent {
  notificationService = inject(NotificationService);
  private router = inject(Router);

  getIcon(tipo: string): string {
    switch (tipo) {
      case 'INFO': return 'info';
      case 'WARNING': return 'warning';
      case 'ERROR': return 'error';
      case 'CAMBIO_GUION': return 'description';
      case 'ACTIVIDAD_MODIFICADA': return 'event';
      default: return 'notifications';
    }
  }

  getIconClass(tipo: string): string {
    switch (tipo) {
      case 'INFO': return 'text-blue-500';
      case 'WARNING': return 'text-yellow-500';
      case 'ERROR': return 'text-red-500';
      default: return 'text-gray-500';
    }
  }

  markAllRead(event: Event): void {
    event.stopPropagation();
    this.notificationService.marcarTodasLeidas().subscribe();
  }

  onNotificationClick(notif: any): void {
    if (!notif.leida) {
      this.notificationService.marcarLeida(notif.id).subscribe();
    }

    // Navegar según el tipo
    if (notif.entidadTipo === 'GUION' && notif.entidadId) {
      this.router.navigate(['/tops/editor', notif.entidadId]);
    } else if (notif.entidadTipo === 'ACTIVIDAD' && notif.entidadId) {
      this.router.navigate(['/tempo/actividad', notif.entidadId]);
    }
  }
}
```

### 6.3 DriveFileSelector Component

```typescript
// shared/components/drive-file-selector/drive-file-selector.component.ts
import { Component, inject, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DriveService } from '../../../core/services/drive.service';
import { DriveFile, DriveFolder } from '../../../core/services/drive.models';

@Component({
  selector: 'app-drive-file-selector',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatProgressBarModule
  ],
  template: `
    <h2 mat-dialog-title>Seleccionar archivo de Drive</h2>

    <mat-dialog-content class="min-w-[400px]">
      @if (driveService.loading()) {
        <mat-progress-bar mode="indeterminate"></mat-progress-bar>
      }

      <!-- Breadcrumb -->
      <div class="flex items-center gap-1 mb-4 text-sm">
        <button mat-button (click)="navigateToRoot()">
          <mat-icon>home</mat-icon>
        </button>
        @for (crumb of breadcrumbs(); track crumb.id) {
          <span>/</span>
          <button mat-button (click)="navigateTo(crumb.id)">
            {{ crumb.name }}
          </button>
        }
      </div>

      <!-- File list -->
      <mat-selection-list [multiple]="false" (selectionChange)="onSelect($event)">
        @for (item of currentItems(); track item.id) {
          <mat-list-option [value]="item">
            <mat-icon matListItemIcon>
              {{ isFolder(item) ? 'folder' : getFileIcon(item) }}
            </mat-icon>
            <span matListItemTitle>{{ item.name }}</span>
          </mat-list-option>
        }
      </mat-selection-list>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-raised-button color="primary"
              [disabled]="!selectedFile()"
              (click)="confirm()">
        Seleccionar
      </button>
    </mat-dialog-actions>
  `
})
export class DriveFileSelectorComponent {
  driveService = inject(DriveService);
  private dialogRef = inject(MatDialogRef<DriveFileSelectorComponent>);

  breadcrumbs = signal<{id: string, name: string}[]>([]);
  currentItems = signal<(DriveFile | DriveFolder)[]>([]);
  selectedFile = signal<DriveFile | null>(null);

  constructor() {
    this.loadRoot();
  }

  loadRoot(): void {
    this.driveService.browse().subscribe(folder => {
      this.currentItems.set(folder.children || []);
      this.breadcrumbs.set([]);
    });
  }

  navigateTo(folderId: string): void {
    this.driveService.browse(folderId).subscribe(folder => {
      this.currentItems.set(folder.children || []);
      // Update breadcrumbs...
    });
  }

  navigateToRoot(): void {
    this.loadRoot();
  }

  isFolder(item: any): boolean {
    return item.mimeType === 'application/vnd.google-apps.folder';
  }

  getFileIcon(item: DriveFile): string {
    if (item.mimeType?.includes('image')) return 'image';
    if (item.mimeType?.includes('pdf')) return 'picture_as_pdf';
    if (item.mimeType?.includes('document')) return 'description';
    return 'insert_drive_file';
  }

  onSelect(event: any): void {
    const selected = event.options[0]?.value;
    if (selected && !this.isFolder(selected)) {
      this.selectedFile.set(selected);
    } else if (selected && this.isFolder(selected)) {
      this.navigateTo(selected.id);
    }
  }

  confirm(): void {
    this.dialogRef.close(this.selectedFile());
  }
}
```

### 6.4 StatusBadge Component (Estados Almacén)

```typescript
// shared/components/status-badge/status-badge.component.ts
import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

type EstadoActividad = 'PENDIENTE' | 'EN_TRANSITO' | 'COMPLETADO';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="px-2 py-1 rounded-full text-xs font-medium"
          [ngClass]="getStatusClass()">
      {{ getStatusLabel() }}
    </span>
  `
})
export class StatusBadgeComponent {
  estado = input.required<EstadoActividad>();

  getStatusClass(): string {
    switch (this.estado()) {
      case 'PENDIENTE':
        return 'bg-orange-100 text-orange-800';
      case 'EN_TRANSITO':
        return 'bg-blue-100 text-blue-800';
      case 'COMPLETADO':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusLabel(): string {
    switch (this.estado()) {
      case 'PENDIENTE': return 'Pendiente';
      case 'EN_TRANSITO': return 'En tránsito';
      case 'COMPLETADO': return 'Completado';
      default: return this.estado();
    }
  }
}
```

### 6.5 Weekly Excel View Component (TEMPO Landing)

```typescript
// features/tempo/landing/weekly-excel-view/weekly-excel-view.component.ts
import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActividadService } from '../../services/actividad.service';
import { EspacioService } from '../../services/espacio.service';
import { addDays, startOfWeek, format } from 'date-fns';
import { es } from 'date-fns/locale';

@Component({
  selector: 'app-weekly-excel-view',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule],
  template: `
    <div class="weekly-view">
      <!-- Week navigation -->
      <div class="flex justify-between items-center mb-4">
        <button mat-icon-button (click)="previousWeek()">
          <mat-icon>chevron_left</mat-icon>
        </button>
        <span class="text-lg font-semibold">
          Semana del {{ weekStart() | date:'d MMM':'':'es' }}
          al {{ weekEnd() | date:'d MMM yyyy':'':'es' }}
        </span>
        <button mat-icon-button (click)="nextWeek()">
          <mat-icon>chevron_right</mat-icon>
        </button>
      </div>

      <!-- Excel-style table -->
      <div class="overflow-x-auto">
        <table class="excel-table w-full border-collapse">
          <thead>
            <tr>
              <th class="sticky left-0 bg-gray-100 z-10 p-2 border min-w-[150px]">
                Espacio
              </th>
              @for (day of weekDays(); track day.date) {
                <th class="p-2 border min-w-[140px]"
                    [class.bg-blue-50]="isToday(day.date)">
                  <div class="text-sm font-medium">{{ day.dayName }}</div>
                  <div class="text-xs text-gray-500">{{ day.date | date:'d/M' }}</div>
                </th>
              }
            </tr>
          </thead>
          <tbody>
            @for (espacio of espacioService.espacios(); track espacio.id) {
              <tr>
                <td class="sticky left-0 bg-white z-10 p-2 border font-medium"
                    [style.border-left-color]="espacio.color"
                    [style.border-left-width]="'4px'">
                  {{ espacio.nombre }}
                </td>
                @for (day of weekDays(); track day.date) {
                  <td class="p-1 border align-top min-h-[80px]"
                      [class.bg-blue-50]="isToday(day.date)">
                    @for (act of getActividadesForCell(espacio.id, day.date); track act.id) {
                      <div class="activity-chip text-xs p-1 mb-1 rounded cursor-pointer"
                           [style.background-color]="act.tipoActividad.colorHex + '20'"
                           [style.border-left-color]="act.tipoActividad.colorHex"
                           [style.border-left-width]="'3px'"
                           (click)="openActividad(act)">
                        <div class="font-medium truncate">{{ act.titulo }}</div>
                        <div class="text-gray-500">
                          {{ act.horaInicio }} - {{ act.horaFin }}
                        </div>
                      </div>
                    }
                  </td>
                }
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .excel-table {
      font-size: 0.875rem;
    }
    .activity-chip {
      transition: transform 0.1s;
    }
    .activity-chip:hover {
      transform: scale(1.02);
    }
  `]
})
export class WeeklyExcelViewComponent {
  private actividadService = inject(ActividadService);
  espacioService = inject(EspacioService);

  currentWeekStart = signal(startOfWeek(new Date(), { weekStartsOn: 1 }));

  weekStart = computed(() => this.currentWeekStart());
  weekEnd = computed(() => addDays(this.currentWeekStart(), 6));

  weekDays = computed(() => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = addDays(this.currentWeekStart(), i);
      days.push({
        date,
        dayName: format(date, 'EEEE', { locale: es })
      });
    }
    return days;
  });

  constructor() {
    this.loadWeekData();
  }

  loadWeekData(): void {
    const start = format(this.weekStart(), 'yyyy-MM-dd');
    const end = format(this.weekEnd(), 'yyyy-MM-dd');
    this.actividadService.loadActividades({
      fechaInicio: start,
      fechaFin: end
    }).subscribe();
  }

  previousWeek(): void {
    this.currentWeekStart.update(d => addDays(d, -7));
    this.loadWeekData();
  }

  nextWeek(): void {
    this.currentWeekStart.update(d => addDays(d, 7));
    this.loadWeekData();
  }

  isToday(date: Date): boolean {
    return format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
  }

  getActividadesForCell(espacioId: number, date: Date): any[] {
    const dateStr = format(date, 'yyyy-MM-dd');
    return this.actividadService.actividades().filter(
      a => a.espacio.id === espacioId && a.fecha === dateStr
    );
  }

  openActividad(actividad: any): void {
    // Open actividad detail/edit dialog
  }
}
```

### 6.6 TOPS Landing Component

```typescript
// features/tops/landing/tops-landing.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { GuionService } from '../services/guion.service';
import { TemporadaService } from '../../../core/services/temporada.service';
import { TemporadaSelectorComponent } from '../../../shared/components/temporada-selector/temporada-selector.component';

@Component({
  selector: 'app-tops-landing',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatChipsModule,
    TemporadaSelectorComponent
  ],
  template: `
    <div class="tops-landing p-4">
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">TOPS - Guiones</h1>
        <div class="flex items-center gap-4">
          <app-temporada-selector
            (temporadaChange)="onTemporadaChange($event)">
          </app-temporada-selector>
          <button mat-raised-button color="primary" routerLink="/tops/nuevo">
            <mat-icon>add</mat-icon>
            Nuevo Guion
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Guiones de la Temporada -->
        <mat-card>
          <mat-card-header>
            <mat-card-title>
              <mat-icon class="mr-2">theater_comedy</mat-icon>
              Guiones de la Temporada
            </mat-card-title>
            <mat-card-subtitle>
              {{ temporadaService.selectedTemporada()?.nombre }}
            </mat-card-subtitle>
          </mat-card-header>
          <mat-card-content class="pt-4">
            @if (guionService.loading()) {
              <div class="text-center py-4">Cargando...</div>
            } @else if (guionService.guionesTemporada().length === 0) {
              <div class="text-center py-8 text-gray-500">
                No hay guiones en esta temporada
              </div>
            } @else {
              @for (guion of guionService.guionesTemporada(); track guion.id) {
                <div class="guion-item p-3 border-b hover:bg-gray-50 cursor-pointer"
                     [routerLink]="['/tops/editor', guion.id]">
                  <div class="flex justify-between items-start">
                    <div>
                      <h3 class="font-medium">{{ guion.produccionNombre }}</h3>
                      <p class="text-sm text-gray-500">
                        {{ guion.compania }} | {{ guion.directorEscena }}
                      </p>
                    </div>
                    <mat-chip [ngClass]="getEstadoClass(guion.estado)">
                      {{ guion.estado }}
                    </mat-chip>
                  </div>
                </div>
              }
            }
          </mat-card-content>
        </mat-card>

        <!-- Mis Guiones -->
        <mat-card>
          <mat-card-header>
            <mat-card-title>
              <mat-icon class="mr-2">person</mat-icon>
              Mis Guiones
            </mat-card-title>
            <mat-card-subtitle>
              Guiones donde soy responsable de edición
            </mat-card-subtitle>
          </mat-card-header>
          <mat-card-content class="pt-4">
            @if (guionService.misGuiones().length === 0) {
              <div class="text-center py-8 text-gray-500">
                No tienes guiones asignados
              </div>
            } @else {
              @for (guion of guionService.misGuiones(); track guion.id) {
                <div class="guion-item p-3 border-b hover:bg-gray-50 cursor-pointer"
                     [routerLink]="['/tops/editor', guion.id]">
                  <div class="flex justify-between items-start">
                    <div>
                      <h3 class="font-medium">{{ guion.produccionNombre }}</h3>
                      <p class="text-sm text-gray-500">
                        v{{ guion.version }} |
                        {{ guion.updatedAt | date:'short' }}
                      </p>
                    </div>
                    @if (guion.lockedBy) {
                      <mat-icon class="text-yellow-500" matTooltip="En edición">
                        lock
                      </mat-icon>
                    }
                  </div>
                </div>
              }
            }
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `
})
export class TopsLandingComponent implements OnInit {
  guionService = inject(GuionService);
  temporadaService = inject(TemporadaService);

  ngOnInit(): void {
    const temporadaId = this.temporadaService.selectedTemporada()?.id;
    this.guionService.loadGuiones(temporadaId).subscribe();
  }

  onTemporadaChange(temporada: any): void {
    this.guionService.loadGuiones(temporada.id).subscribe();
  }

  getEstadoClass(estado: string): string {
    switch (estado) {
      case 'BORRADOR': return 'bg-gray-100';
      case 'EN_REVISION': return 'bg-yellow-100';
      case 'FINAL': return 'bg-green-100';
      default: return '';
    }
  }
}
```

### 6.7 Cartelería Global Component

```typescript
// features/carteleria/carteleria-global/carteleria-global.component.ts
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { interval, Subscription } from 'rxjs';
import { ActividadService } from '../../tempo/services/actividad.service';
import { EspacioService } from '../../tempo/services/espacio.service';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

@Component({
  selector: 'app-carteleria-global',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="carteleria-global h-screen bg-teatro-primary text-white overflow-hidden">
      <!-- Header -->
      <div class="header bg-teatro-secondary p-4 flex justify-between items-center">
        <img src="assets/images/teatro-real-logo.png" alt="Teatro Real" class="h-12">
        <div class="text-center">
          <div class="text-3xl font-bold">{{ currentDate | date:'EEEE, d MMMM yyyy':'':'es' }}</div>
          <div class="text-5xl font-bold text-teatro-gold">{{ currentTime }}</div>
        </div>
        <div class="w-12"></div>
      </div>

      <!-- Grid de salas -->
      <div class="grid grid-cols-3 gap-4 p-4 h-[calc(100vh-120px)] overflow-hidden">
        @for (espacio of espacioService.espacios(); track espacio.id) {
          <div class="sala-card rounded-lg p-4"
               [style.background-color]="espacio.color || '#2a2a4e'"
               [style.border-left]="'4px solid ' + (espacio.color || '#c9a227')">
            <h2 class="text-xl font-bold mb-3 text-teatro-gold">
              {{ espacio.nombre }}
            </h2>

            @if (getActividadesEspacio(espacio.id).length === 0) {
              <div class="text-gray-400 text-center py-8">
                Sin actividades programadas
              </div>
            } @else {
              <div class="space-y-2 overflow-y-auto max-h-[calc(100%-60px)]">
                @for (act of getActividadesEspacio(espacio.id); track act.id) {
                  <div class="actividad-item p-3 rounded"
                       [style.background-color]="act.tipoActividad.colorHex + '30'"
                       [style.border-left]="'3px solid ' + act.tipoActividad.colorHex"
                       [class.animate-pulse]="isCurrentActivity(act)">
                    <div class="text-lg font-semibold">{{ act.titulo }}</div>
                    <div class="text-sm opacity-80">
                      {{ act.horaInicio }} - {{ act.horaFin }}
                    </div>
                    @if (act.departamento) {
                      <div class="text-xs mt-1 opacity-60">
                        {{ act.departamento.nombre }}
                      </div>
                    }
                  </div>
                }
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .carteleria-global {
      font-family: 'Inter', sans-serif;
    }
    .sala-card {
      transition: transform 0.3s;
    }
    .actividad-item {
      transition: all 0.3s;
    }
  `]
})
export class CarteleriaGlobalComponent implements OnInit, OnDestroy {
  private actividadService = inject(ActividadService);
  espacioService = inject(EspacioService);

  currentDate = new Date();
  currentTime = format(new Date(), 'HH:mm:ss');

  private timerSub?: Subscription;
  private refreshSub?: Subscription;

  ngOnInit(): void {
    this.espacioService.loadEspacios().subscribe();
    this.loadTodayActivities();

    // Update time every second
    this.timerSub = interval(1000).subscribe(() => {
      this.currentTime = format(new Date(), 'HH:mm:ss');
      this.currentDate = new Date();
    });

    // Refresh activities every 5 minutes
    this.refreshSub = interval(300000).subscribe(() => {
      this.loadTodayActivities();
    });
  }

  ngOnDestroy(): void {
    this.timerSub?.unsubscribe();
    this.refreshSub?.unsubscribe();
  }

  loadTodayActivities(): void {
    const today = format(new Date(), 'yyyy-MM-dd');
    this.actividadService.loadActividades({
      fechaInicio: today,
      fechaFin: today
    }).subscribe();
  }

  getActividadesEspacio(espacioId: number): any[] {
    return this.actividadService.actividades()
      .filter(a => a.espacio.id === espacioId)
      .sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));
  }

  isCurrentActivity(actividad: any): boolean {
    const now = format(new Date(), 'HH:mm');
    return actividad.horaInicio <= now && actividad.horaFin > now;
  }
}
```

---

## 7. Plan de Desarrollo Frontend (Actualizado v2)

### Sprint 1: Setup + Auth (1 semana) - Sin cambios
| Tarea | Horas |
|-------|-------|
| Crear proyecto Angular 18 (standalone) | 2h |
| Configurar Angular Material + TailwindCSS | 4h |
| Estructura de carpetas y routing | 4h |
| Implementar AuthService + Guards (4 roles) | 8h |
| Login con Google (OAuth) | 6h |
| Layout principal (sidebar, header) | 8h |
| **NUEVO v2:** Componente NotificationBell en header | 4h |
| Tests de auth | 4h |
| **Total Sprint 1** | **40h** (+6h) |

### Sprint 2: Módulo TEMPO (2 semanas) - Actualizado
| Tarea | Horas |
|-------|-------|
| Modelos TypeScript TEMPO (actualizados v2) | 4h |
| ActividadService + EspacioService (con clone, status) | 8h |
| **NUEVO v2:** TemporadaService | 4h |
| **NUEVO v2:** Landing semanal estilo Excel | 12h |
| Componente Calendario (FullCalendar) | 12h |
| Vistas: mensual, semanal, diaria | 8h |
| Dialog creación/edición actividad (nuevos campos) | 10h |
| **NUEVO v2:** Control de estados almacén (StatusBadge) | 4h |
| **NUEVO v2:** Botón clonar actividad | 3h |
| Filtros por espacio/tipo/departamento/temporada | 8h |
| **NUEVO v2:** Selector origen documento (Local/Drive) | 6h |
| CRUD Espacios (campos actualizados) | 8h |
| CRUD Tipos Actividad | 4h |
| **NUEVO v2:** CRUD Departamentos (jefe, personal) | 6h |
| Tests TEMPO | 6h |
| **Total Sprint 2** | **103h** (+44h) |

### Sprint 3: Módulo TOPS (2 semanas) - Actualizado
| Tarea | Horas |
|-------|-------|
| Modelos TypeScript TOPS (actualizados v2) | 4h |
| GuionService + ElementoService (con temporada) | 10h |
| **NUEVO v2:** ColorElementoService | 4h |
| **NUEVO v2:** Landing TOPS (2 listas) | 8h |
| Lista de guiones (filtro por temporada) | 6h |
| Editor de guion (estructura) | 16h |
| **NUEVO v2:** Estilos editor emulando Word | 8h |
| Panel de Acto expandible | 6h |
| Panel de Escena con elementos | 8h |
| **NUEVO v2:** Colores configurables en elementos | 4h |
| Tabla de Pasada | 8h |
| Dialog TOP (crear/editar) | 10h |
| Drag & drop para reordenar | 8h |
| Bloqueo de edición (indicador) | 4h |
| Vistas (global, tops, departamento) | 10h |
| **NUEVO v2:** Admin colores elementos | 4h |
| Tests TOPS | 8h |
| **Total Sprint 3** | **126h** (+30h) |

### Sprint 4: Integraciones + Polish (1.5 semanas) - Actualizado
| Tarea | Horas |
|-------|-------|
| WebSocket para updates en tiempo real | 8h |
| **NUEVO v2:** NotificationService + polling | 4h |
| Exportación Word (llamada API + descarga) | 4h |
| Dashboard con widgets | 8h |
| **NUEVO v2:** DriveService + DriveFileSelector | 8h |
| Modo Cartelería por sala | 6h |
| **NUEVO v2:** Cartelería Global (todas las salas) | 8h |
| **NUEVO v2:** Admin temporadas | 4h |
| **NUEVO v2:** Admin permisos por módulo | 4h |
| Responsive / Mobile | 8h |
| Accesibilidad (a11y) | 4h |
| **Total Sprint 4** | **66h** (+24h) |

### Sprint 5: Testing + Deploy (1 semana) - Sin cambios significativos
| Tarea | Horas |
|-------|-------|
| Tests unitarios adicionales | 10h |
| Tests E2E (Cypress/Playwright) | 10h |
| Optimización bundle (lazy loading) | 4h |
| Configuración producción | 4h |
| Documentación componentes | 4h |
| **Total Sprint 5** | **32h** (+4h) |

---

## 8. Resumen de Estimación Frontend v2

| Fase | Horas v1 | Horas v2 | Delta |
|------|----------|----------|-------|
| Sprint 1: Setup + Auth | 34h | 40h | +6h |
| Sprint 2: TEMPO | 59h | 103h | +44h |
| Sprint 3: TOPS | 96h | 126h | +30h |
| Sprint 4: Integraciones + Polish | 42h | 66h | +24h |
| Sprint 5: Testing + Deploy | 28h | 32h | +4h |
| **TOTAL FRONTEND** | **259h** | **367h** | **+108h** |

### Desglose de horas adicionales v2:

| Feature Nueva | Horas |
|---------------|-------|
| Sistema 4 roles + permisos módulo | 10h |
| Landing TEMPO semanal Excel | 12h |
| Estados almacén + StatusBadge | 7h |
| Clonar actividades | 3h |
| Selector origen documento (Drive) | 14h |
| CRUD Departamentos mejorado | 6h |
| TemporadaService + selector | 8h |
| Landing TOPS (2 listas) | 8h |
| Estilos editor Word | 8h |
| Colores configurables elementos | 8h |
| Sistema notificaciones | 8h |
| Cartelería global | 8h |
| Admin temporadas | 4h |
| Admin permisos módulo | 4h |
| **Total nuevas features** | **108h** |

---

## 9. Comandos de Desarrollo

```bash
# Desarrollo (arranca en http://localhost:4200)
npm start

# Build producción
npm run build

# Build con watch
npm run watch

# Tests
npm test
```

### Dependencias adicionales:

```bash
# FullCalendar (para módulo TEMPO)
npm install @fullcalendar/angular @fullcalendar/core @fullcalendar/daygrid @fullcalendar/timegrid @fullcalendar/interaction

# Date utilities
npm install date-fns

# File utilities
npm install file-saver
npm install -D @types/file-saver
```

---

## 10. Consideraciones UI/UX (Actualizado v2)

### 10.1 Paleta de Colores
- **Primary:** Teatro Real gold (#c9a227)
- **Secondary:** Azul oscuro (#1a1a2e)
- **Accent:** Rojo (#e94560)
- **Background:** Blanco/Gris claro
- **Estados almacén:**
  - Pendiente: Naranja (#FFA500)
  - En tránsito: Azul (#3B82F6)
  - Completado: Verde (#22C55E)

### 10.2 Nuevos Componentes UI v2
- **TemporadaSelector:** Dropdown en header para cambiar temporada
- **NotificationBell:** Icono campana con badge contador
- **StatusBadge:** Chip coloreado para estados
- **DriveFileSelector:** Modal para navegar Drive intranet
- **WeeklyExcelView:** Tabla estilo Excel para calendario semanal

### 10.3 Responsive Breakpoints
- **Mobile:** < 768px
- **Tablet:** 768px - 1024px
- **Desktop:** > 1024px
- **Cartelería:** Optimizado para pantallas grandes (1920x1080+)

### 10.4 Accesibilidad
- Contraste WCAG AA
- Navegación por teclado
- ARIA labels en componentes interactivos
- Focus visible
- Estados de color complementados con iconos/texto

---

## 11. Estado Actual del Proyecto

### Completado:
- [x] Proyecto Angular 18.2 creado
- [x] Standalone components configurados
- [x] TailwindCSS 3.4 instalado y configurado
- [x] Angular Material 18 instalado
- [x] SCSS como preprocesador de estilos
- [x] Estructura base de carpetas
- [x] Proxy para desarrollo configurado
- [x] Environments configurados

### Pendiente (próximos pasos v2):
- [ ] Actualizar AuthService con 4 roles
- [ ] Crear módulo permisos por módulo
- [ ] Implementar NotificationService + NotificationBell
- [ ] Crear TemporadaService + TemporadaSelector
- [ ] Implementar DriveService + DriveFileSelector
- [ ] Actualizar modelos TypeScript (v2)
- [ ] Crear Landing TEMPO (vista semanal Excel)
- [ ] Implementar estados almacén (StatusBadge)
- [ ] Crear Landing TOPS (2 listas)
- [ ] Actualizar editor TOPS (estilos Word, colores config)
- [ ] Implementar Cartelería Global
- [ ] Admin temporadas, permisos, colores

---

*Plan de Implementación Frontend v2 - Teatro Real*
*Angular 18.2 + Angular Material 18 + TailwindCSS 3.4*
*Actualizado: 2025-12-20 (incorpora feedback cliente v1.3)*
