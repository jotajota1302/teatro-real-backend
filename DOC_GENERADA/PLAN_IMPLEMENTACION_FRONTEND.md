# Teatro Real - Plan de Implementación Frontend
## Angular 18 + Angular Material + TailwindCSS

---
**Stack:** Angular 18 | TypeScript | Angular Material | TailwindCSS | RxJS
**Fecha:** 2025-12-11

---

## 1. Arquitectura del Frontend

### 1.1 Estructura del Proyecto

```
teatro-real-frontend/
├── angular.json
├── package.json
├── tailwind.config.js
├── tsconfig.json
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
│   │   │   │   └── auth.models.ts
│   │   │   ├── services/
│   │   │   │   ├── api.service.ts
│   │   │   │   ├── notification.service.ts
│   │   │   │   └── websocket.service.ts
│   │   │   └── guards/
│   │   │       ├── role.guard.ts
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
│   │   │   │   └── empty-state/
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
│   │   │   │   ├── header.component.ts
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
│   │   │   │   │   ├── actividad.service.ts
│   │   │   │   │   ├── espacio.service.ts
│   │   │   │   │   └── tipo-actividad.service.ts
│   │   │   │   ├── models/
│   │   │   │   │   ├── actividad.model.ts
│   │   │   │   │   ├── espacio.model.ts
│   │   │   │   │   └── tipo-actividad.model.ts
│   │   │   │   ├── state/                 # Estado con signals
│   │   │   │   │   └── tempo.store.ts
│   │   │   │   ├── calendario/
│   │   │   │   │   ├── calendario.component.ts
│   │   │   │   │   ├── calendario.component.html
│   │   │   │   │   ├── calendario.component.scss
│   │   │   │   │   ├── vista-mensual/
│   │   │   │   │   ├── vista-semanal/
│   │   │   │   │   └── vista-diaria/
│   │   │   │   ├── actividad/
│   │   │   │   │   ├── actividad-list/
│   │   │   │   │   ├── actividad-form/
│   │   │   │   │   └── actividad-detail/
│   │   │   │   ├── espacios/
│   │   │   │   │   ├── espacio-list/
│   │   │   │   │   └── espacio-form/
│   │   │   │   └── tipos-actividad/
│   │   │   │       ├── tipo-list/
│   │   │   │       └── tipo-form/
│   │   │   │
│   │   │   ├── tops/                      # Módulo TOPS
│   │   │   │   ├── tops.routes.ts
│   │   │   │   ├── services/
│   │   │   │   │   ├── guion.service.ts
│   │   │   │   │   └── elemento.service.ts
│   │   │   │   ├── models/
│   │   │   │   │   ├── guion.model.ts
│   │   │   │   │   ├── acto.model.ts
│   │   │   │   │   ├── escena.model.ts
│   │   │   │   │   └── elemento.model.ts
│   │   │   │   ├── state/
│   │   │   │   │   └── tops.store.ts
│   │   │   │   ├── guion/
│   │   │   │   │   ├── guion-list/
│   │   │   │   │   ├── guion-detail/
│   │   │   │   │   └── guion-form/
│   │   │   │   ├── editor/
│   │   │   │   │   ├── editor.component.ts
│   │   │   │   │   ├── editor.component.html
│   │   │   │   │   ├── editor.component.scss
│   │   │   │   │   ├── acto-panel/
│   │   │   │   │   ├── escena-panel/
│   │   │   │   │   ├── elemento-item/
│   │   │   │   │   ├── pasada-table/
│   │   │   │   │   └── top-form-dialog/
│   │   │   │   └── vistas/
│   │   │   │       ├── vista-global/
│   │   │   │       ├── vista-tops/
│   │   │   │       └── vista-departamento/
│   │   │   │
│   │   │   ├── admin/                     # Módulo Admin
│   │   │   │   ├── admin.routes.ts
│   │   │   │   ├── usuarios/
│   │   │   │   │   ├── usuario-list/
│   │   │   │   │   └── usuario-form/
│   │   │   │   └── departamentos/
│   │   │   │       ├── departamento-list/
│   │   │   │       └── departamento-form/
│   │   │   │
│   │   │   └── carteleria/                # Modo Cartelería
│   │   │       ├── carteleria.component.ts
│   │   │       └── carteleria.component.html
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
  "version": "1.0.0",
  "scripts": {
    "ng": "ng",
    "start": "ng serve",
    "build": "ng build",
    "build:prod": "ng build --configuration production",
    "test": "ng test",
    "lint": "ng lint",
    "e2e": "ng e2e"
  },
  "dependencies": {
    "@angular/animations": "^18.0.0",
    "@angular/cdk": "^18.0.0",
    "@angular/common": "^18.0.0",
    "@angular/compiler": "^18.0.0",
    "@angular/core": "^18.0.0",
    "@angular/forms": "^18.0.0",
    "@angular/material": "^18.0.0",
    "@angular/platform-browser": "^18.0.0",
    "@angular/platform-browser-dynamic": "^18.0.0",
    "@angular/router": "^18.0.0",
    "rxjs": "~7.8.0",
    "tslib": "^2.6.0",
    "zone.js": "~0.14.0",

    "@fullcalendar/angular": "^6.1.0",
    "@fullcalendar/core": "^6.1.0",
    "@fullcalendar/daygrid": "^6.1.0",
    "@fullcalendar/timegrid": "^6.1.0",
    "@fullcalendar/interaction": "^6.1.0",

    "@angular/cdk/drag-drop": "^18.0.0",
    "date-fns": "^3.0.0",
    "file-saver": "^2.0.5"
  },
  "devDependencies": {
    "@angular/cli": "^18.0.0",
    "@angular/compiler-cli": "^18.0.0",
    "@angular-devkit/build-angular": "^18.0.0",
    "@types/file-saver": "^2.0.7",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "typescript": "~5.4.0",
    "karma": "~6.4.0",
    "karma-chrome-launcher": "~3.2.0",
    "karma-coverage": "~2.2.0",
    "karma-jasmine": "~5.1.0",
    "jasmine-core": "~5.1.0"
  }
}
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

### 2.2 app.routes.ts

```typescript
import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
import { roleGuard } from './core/guards/role.guard';

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
        loadChildren: () => import('./features/tempo/tempo.routes').then(m => m.TEMPO_ROUTES)
      },
      {
        path: 'tops',
        loadChildren: () => import('./features/tops/tops.routes').then(m => m.TOPS_ROUTES)
      },
      {
        path: 'admin',
        loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES),
        canActivate: [roleGuard],
        data: { roles: ['ADMIN'] }
      }
    ]
  },
  {
    path: 'carteleria/:espacioId',
    loadComponent: () => import('./features/carteleria/carteleria.component')
      .then(m => m.CarteleriaComponent)
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
```

### 2.3 Tailwind Config

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
        }
      }
    },
  },
  plugins: [],
}
```

---

## 3. Modelos TypeScript

### 3.1 Modelos Auth

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

export interface Rol {
  id: number;
  nombre: 'ADMIN' | 'COLABORADOR' | 'CONSULTA';
  descripcion: string;
  permisos: string[];
}

export interface AuthResponse {
  token: string;
  usuario: Usuario;
}
```

### 3.2 Modelos TEMPO

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
  // Campos almacén
  tipoMovimiento?: 'RECOGIDA' | 'SALIDA';
  numCamiones?: number;
  lugarOrigen?: string;
  lugarDestino?: string;
  produccionNombre?: string;
  // Documentos
  documentos?: ActividadDocumento[];
  // Audit
  createdBy?: Usuario;
  createdAt?: Date;
  updatedAt?: Date;
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
  tipoMovimiento?: 'RECOGIDA' | 'SALIDA';
  numCamiones?: number;
  lugarOrigen?: string;
  lugarDestino?: string;
  produccionNombre?: string;
}

export interface Espacio {
  id: number;
  nombre: string;
  tipo: 'SALA' | 'ALMACEN';
  googleCalendarId?: string;
  capacidad?: number;
  ubicacion?: string;
  activo: boolean;
  orden: number;
}

export interface TipoActividad {
  id: number;
  nombre: string;
  colorHex: string;
  aplicaA: 'SALA' | 'ALMACEN' | 'AMBOS';
  descripcion?: string;
  orden: number;
}

export interface Departamento {
  id: number;
  codigo: string;
  nombre: string;
  ambito: string;
  colorHex?: string;
}

export interface CalendarioFilter {
  espacioId?: number;
  tipoActividadId?: number;
  departamentoId?: number;
  fechaInicio: string;
  fechaFin: string;
}
```

### 3.3 Modelos TOPS

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
  lugar?: string; // Para pasadas
  orden: number;
  departamentos: Departamento[];
  adjuntos: ElementoAdjunto[];
  children?: ElementoGuion[]; // Sub-TOPs
}

export type TipoElemento = 'TOP' | 'ENTRADA' | 'MUTIS' | 'INTERNO' | 'AVISO' | 'PASADA_ITEM';

export interface ElementoAdjunto {
  id: number;
  elementoId: string;
  tipo: 'IMAGEN' | 'DOCUMENTO';
  url: string;
  nombreArchivo: string;
  orden: number;
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

---

## 4. Servicios Core

### 4.1 AuthService

```typescript
// core/auth/auth.service.ts
import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Usuario, AuthResponse } from './auth.models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API_URL = `${environment.apiUrl}/auth`;

  // Signals para estado reactivo
  private currentUserSignal = signal<Usuario | null>(null);
  private tokenSignal = signal<string | null>(null);

  // Computed signals
  currentUser = this.currentUserSignal.asReadonly();
  isAuthenticated = computed(() => !!this.tokenSignal());
  isAdmin = computed(() => this.currentUserSignal()?.rol.nombre === 'ADMIN');
  isColaborador = computed(() =>
    ['ADMIN', 'COLABORADOR'].includes(this.currentUserSignal()?.rol.nombre || '')
  );

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
  }

  private loadStoredAuth(): void {
    const token = localStorage.getItem('auth_token');
    const userStr = localStorage.getItem('auth_user');
    if (token && userStr) {
      this.tokenSignal.set(token);
      this.currentUserSignal.set(JSON.parse(userStr));
    }
  }
}
```

### 4.2 API Service Base

```typescript
// core/services/api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  get<T>(endpoint: string, params?: any): Observable<T> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }
    return this.http.get<T>(`${this.baseUrl}${endpoint}`, { params: httpParams });
  }

  post<T>(endpoint: string, body: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${endpoint}`, body);
  }

  put<T>(endpoint: string, body: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}${endpoint}`, body);
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}${endpoint}`);
  }

  upload<T>(endpoint: string, file: File, fieldName = 'file'): Observable<T> {
    const formData = new FormData();
    formData.append(fieldName, file);
    return this.http.post<T>(`${this.baseUrl}${endpoint}`, formData);
  }

  downloadBlob(endpoint: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}${endpoint}`, {
      responseType: 'blob'
    });
  }
}
```

### 4.3 WebSocket Service

```typescript
// core/services/websocket.service.ts
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { environment } from '../../../environments/environment';

export interface WsMessage<T = any> {
  type: string;
  payload: T;
}

@Injectable({ providedIn: 'root' })
export class WebSocketService {
  private socket$: WebSocketSubject<WsMessage> | null = null;
  private messagesSubject = new Subject<WsMessage>();

  connect(token: string): void {
    if (!this.socket$) {
      this.socket$ = webSocket({
        url: `${environment.wsUrl}?token=${token}`,
        openObserver: {
          next: () => console.log('WebSocket connected')
        },
        closeObserver: {
          next: () => {
            console.log('WebSocket closed');
            this.socket$ = null;
          }
        }
      });

      this.socket$.subscribe({
        next: (msg) => this.messagesSubject.next(msg),
        error: (err) => console.error('WebSocket error:', err)
      });
    }
  }

  disconnect(): void {
    this.socket$?.complete();
    this.socket$ = null;
  }

  onMessage<T>(type: string): Observable<T> {
    return new Observable(observer => {
      this.messagesSubject.subscribe(msg => {
        if (msg.type === type) {
          observer.next(msg.payload as T);
        }
      });
    });
  }

  send(type: string, payload: any): void {
    this.socket$?.next({ type, payload });
  }
}
```

---

## 5. Servicios de Dominio

### 5.1 ActividadService

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

  // Computed: actividades del día seleccionado
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

  setSelectedDate(date: Date): void {
    this.selectedDateSignal.set(date);
  }

  exportCalendario(filter: CalendarioFilter): Observable<Blob> {
    return this.api.downloadBlob('/actividades/export');
  }
}
```

### 5.2 GuionService

```typescript
// features/tops/services/guion.service.ts
import { Injectable, signal, computed } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { Guion, Acto, Escena, ElementoGuion, HistorialCambio } from '../models/guion.model';

@Injectable({ providedIn: 'root' })
export class GuionService {
  private guionesSignal = signal<Guion[]>([]);
  private currentGuionSignal = signal<Guion | null>(null);
  private loadingSignal = signal(false);
  private editingSignal = signal(false);

  guiones = this.guionesSignal.asReadonly();
  currentGuion = this.currentGuionSignal.asReadonly();
  loading = this.loadingSignal.asReadonly();
  editing = this.editingSignal.asReadonly();

  // Computed: verificar si el guion está bloqueado por otro usuario
  isLockedByOther = computed(() => {
    const guion = this.currentGuionSignal();
    // Comparar con usuario actual
    return guion?.lockedBy != null;
  });

  constructor(private api: ApiService) {}

  loadGuiones(): Observable<Guion[]> {
    this.loadingSignal.set(true);
    return this.api.get<Guion[]>('/guiones').pipe(
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

  // Bloqueo de edición
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

  // Operaciones en estructura
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

  // Reordenar (drag & drop)
  reordenar(guionId: string, updates: {id: string, orden: number}[]): Observable<void> {
    return this.api.put<void>(`/guiones/${guionId}/reordenar`, { updates });
  }

  // Vistas
  getVistaCompleta(id: string): Observable<Guion> {
    return this.api.get<Guion>(`/guiones/${id}/vista/completa`);
  }

  getVistaTops(id: string): Observable<ElementoGuion[]> {
    return this.api.get<ElementoGuion[]>(`/guiones/${id}/vista/tops`);
  }

  getVistaDepartamento(id: string, codigo: string): Observable<ElementoGuion[]> {
    return this.api.get<ElementoGuion[]>(`/guiones/${id}/vista/departamento/${codigo}`);
  }

  // Historial
  getHistorial(id: string): Observable<HistorialCambio[]> {
    return this.api.get<HistorialCambio[]>(`/guiones/${id}/historial`);
  }

  // Exportar
  exportWord(id: string): Observable<Blob> {
    return this.api.downloadBlob(`/guiones/${id}/export`);
  }
}
```

---

## 6. Componentes Principales

### 6.1 Calendario Component

```typescript
// features/tempo/calendario/calendario.component.ts
import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventClickArg, DateSelectArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

import { ActividadService } from '../services/actividad.service';
import { EspacioService } from '../services/espacio.service';
import { ActividadFormDialogComponent } from '../actividad/actividad-form/actividad-form-dialog.component';

@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [
    CommonModule,
    FullCalendarModule,
    MatDialogModule,
    MatButtonModule,
    MatSelectModule
  ],
  template: `
    <div class="calendario-container">
      <div class="calendario-header flex justify-between items-center mb-4">
        <h1 class="text-2xl font-bold">Calendario de Actividades</h1>

        <div class="filters flex gap-4">
          <mat-select placeholder="Filtrar por espacio"
                      (selectionChange)="onEspacioChange($event.value)">
            <mat-option [value]="null">Todos los espacios</mat-option>
            @for (espacio of espacioService.espacios(); track espacio.id) {
              <mat-option [value]="espacio.id">{{ espacio.nombre }}</mat-option>
            }
          </mat-select>

          <button mat-raised-button color="primary" (click)="openNewActividad()">
            + Nueva Actividad
          </button>
        </div>
      </div>

      <full-calendar [options]="calendarOptions()" />
    </div>
  `,
  styleUrl: './calendario.component.scss'
})
export class CalendarioComponent implements OnInit {
  private actividadService = inject(ActividadService);
  protected espacioService = inject(EspacioService);
  private dialog = inject(MatDialog);

  calendarOptions = signal<CalendarOptions>({
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    locale: 'es',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    weekends: true,
    events: [],
    select: (selectInfo) => this.handleDateSelect(selectInfo),
    eventClick: (clickInfo) => this.handleEventClick(clickInfo),
    datesSet: (dateInfo) => this.loadActividades(dateInfo.startStr, dateInfo.endStr)
  });

  ngOnInit(): void {
    this.espacioService.loadEspacios().subscribe();
  }

  loadActividades(start: string, end: string): void {
    this.actividadService.loadActividades({
      fechaInicio: start,
      fechaFin: end
    }).subscribe(actividades => {
      const events = actividades.map(a => ({
        id: a.id,
        title: a.titulo,
        start: `${a.fecha}T${a.horaInicio}`,
        end: `${a.fecha}T${a.horaFin}`,
        backgroundColor: a.tipoActividad.colorHex,
        extendedProps: { actividad: a }
      }));

      this.calendarOptions.update(opts => ({ ...opts, events }));
    });
  }

  handleDateSelect(selectInfo: DateSelectArg): void {
    this.openNewActividad(selectInfo.startStr);
  }

  handleEventClick(clickInfo: EventClickArg): void {
    const actividad = clickInfo.event.extendedProps['actividad'];
    this.openEditActividad(actividad);
  }

  openNewActividad(fecha?: string): void {
    const dialogRef = this.dialog.open(ActividadFormDialogComponent, {
      width: '600px',
      data: { fecha }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Recargar calendario
        this.loadActividades(
          this.calendarOptions().events?.[0]?.start as string,
          this.calendarOptions().events?.[0]?.end as string
        );
      }
    });
  }

  openEditActividad(actividad: any): void {
    const dialogRef = this.dialog.open(ActividadFormDialogComponent, {
      width: '600px',
      data: { actividad }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Actualizar evento en calendario
      }
    });
  }

  onEspacioChange(espacioId: number | null): void {
    // Aplicar filtro
  }
}
```

### 6.2 Editor de Guion Component

```typescript
// features/tops/editor/editor.component.ts
import { Component, OnInit, OnDestroy, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { GuionService } from '../services/guion.service';
import { Guion, Acto, Escena, ElementoGuion } from '../models/guion.model';
import { ActoPanelComponent } from './acto-panel/acto-panel.component';
import { TopFormDialogComponent } from './top-form-dialog/top-form-dialog.component';

@Component({
  selector: 'app-guion-editor',
  standalone: true,
  imports: [
    CommonModule,
    DragDropModule,
    MatExpansionModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    ActoPanelComponent
  ],
  template: `
    <div class="editor-container h-full flex flex-col">
      <!-- Header -->
      <div class="editor-header bg-white shadow-sm p-4 flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold">{{ guion()?.produccionNombre }}</h1>
          <p class="text-gray-500">
            {{ guion()?.directorEscena }} | {{ guion()?.directorMusical }}
          </p>
        </div>

        <div class="actions flex gap-2">
          @if (!editing()) {
            <button mat-raised-button color="primary"
                    (click)="startEditing()"
                    [disabled]="isLockedByOther()">
              <mat-icon>edit</mat-icon>
              Editar
            </button>
          } @else {
            <button mat-stroked-button (click)="stopEditing()">
              <mat-icon>lock_open</mat-icon>
              Terminar edición
            </button>
          }

          <button mat-button [matMenuTriggerFor]="exportMenu">
            <mat-icon>download</mat-icon>
            Exportar
          </button>
          <mat-menu #exportMenu="matMenu">
            <button mat-menu-item (click)="exportWord()">Word (.docx)</button>
            <button mat-menu-item (click)="exportPdf()">PDF</button>
          </mat-menu>
        </div>
      </div>

      @if (isLockedByOther()) {
        <div class="bg-yellow-100 p-3 text-yellow-800 flex items-center gap-2">
          <mat-icon>warning</mat-icon>
          Este guion está siendo editado por {{ guion()?.lockedBy?.nombre }}
        </div>
      }

      <!-- Content -->
      <div class="editor-content flex-1 overflow-auto p-4">
        @if (loading()) {
          <div class="flex justify-center p-8">
            <mat-spinner></mat-spinner>
          </div>
        } @else {
          <div cdkDropList
               (cdkDropListDropped)="onActoDrop($event)"
               [cdkDropListDisabled]="!editing()">
            @for (acto of guion()?.actos; track acto.id) {
              <app-acto-panel
                [acto]="acto"
                [editing]="editing()"
                (elementoClick)="onElementoClick($event)"
                (addElemento)="onAddElemento($event)"
                cdkDrag
              />
            }
          </div>

          @if (editing()) {
            <button mat-stroked-button class="mt-4" (click)="addActo()">
              <mat-icon>add</mat-icon>
              Añadir Acto
            </button>
          }
        }
      </div>
    </div>
  `,
  styleUrl: './editor.component.scss'
})
export class EditorComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private guionService = inject(GuionService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  guion = this.guionService.currentGuion;
  loading = this.guionService.loading;
  editing = this.guionService.editing;
  isLockedByOther = this.guionService.isLockedByOther;

  private guionId: string = '';

  ngOnInit(): void {
    this.guionId = this.route.snapshot.params['id'];
    this.guionService.getById(this.guionId).subscribe();
  }

  ngOnDestroy(): void {
    // Si estamos editando, liberar el bloqueo
    if (this.editing()) {
      this.guionService.unlock(this.guionId).subscribe();
    }
  }

  startEditing(): void {
    this.guionService.lock(this.guionId).subscribe({
      next: () => {
        this.snackBar.open('Modo edición activado', 'OK', { duration: 2000 });
      },
      error: (err) => {
        this.snackBar.open('No se pudo bloquear el guion', 'OK', { duration: 3000 });
      }
    });
  }

  stopEditing(): void {
    this.guionService.unlock(this.guionId).subscribe({
      next: () => {
        this.snackBar.open('Edición finalizada', 'OK', { duration: 2000 });
      }
    });
  }

  onActoDrop(event: CdkDragDrop<Acto[]>): void {
    const actos = [...(this.guion()?.actos || [])];
    moveItemInArray(actos, event.previousIndex, event.currentIndex);

    const updates = actos.map((a, i) => ({ id: a.id, orden: i }));
    this.guionService.reordenar(this.guionId, updates).subscribe();
  }

  addActo(): void {
    const nuevoNumero = (this.guion()?.actos?.length || 0) + 1;
    this.guionService.createActo(this.guionId, {
      numero: nuevoNumero,
      titulo: `Acto ${nuevoNumero}`,
      orden: nuevoNumero - 1
    }).subscribe(() => {
      this.guionService.getById(this.guionId).subscribe();
    });
  }

  onElementoClick(elemento: ElementoGuion): void {
    const dialogRef = this.dialog.open(TopFormDialogComponent, {
      width: '700px',
      data: { elemento, editing: this.editing() }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.guionService.getById(this.guionId).subscribe();
      }
    });
  }

  onAddElemento(escena: Escena): void {
    const dialogRef = this.dialog.open(TopFormDialogComponent, {
      width: '700px',
      data: { escenaId: escena.id, editing: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.guionService.getById(this.guionId).subscribe();
      }
    });
  }

  exportWord(): void {
    this.guionService.exportWord(this.guionId).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${this.guion()?.produccionNombre}_guion.docx`;
      a.click();
    });
  }

  exportPdf(): void {
    // Implementar exportación PDF
  }
}
```

---

## 7. Plan de Desarrollo Frontend

### Sprint 1: Setup + Auth (1 semana)
| Tarea | Horas |
|-------|-------|
| Crear proyecto Angular 18 (standalone) | 2h |
| Configurar Angular Material + TailwindCSS | 4h |
| Estructura de carpetas y routing | 4h |
| Implementar AuthService + Guards | 6h |
| Login con Google (OAuth) | 6h |
| Layout principal (sidebar, header) | 8h |
| Tests de auth | 4h |
| **Total Sprint 1** | **34h** |

### Sprint 2: Módulo TEMPO (1.5 semanas)
| Tarea | Horas |
|-------|-------|
| Modelos TypeScript TEMPO | 3h |
| ActividadService + EspacioService | 6h |
| Componente Calendario (FullCalendar) | 12h |
| Vistas: mensual, semanal, diaria | 8h |
| Dialog creación/edición actividad | 8h |
| Filtros por espacio/tipo/departamento | 6h |
| CRUD Espacios (admin) | 6h |
| CRUD Tipos Actividad (admin) | 4h |
| Tests TEMPO | 6h |
| **Total Sprint 2** | **59h** |

### Sprint 3: Módulo TOPS (2 semanas)
| Tarea | Horas |
|-------|-------|
| Modelos TypeScript TOPS | 4h |
| GuionService + ElementoService | 8h |
| Lista de guiones | 6h |
| Editor de guion (estructura) | 16h |
| Panel de Acto expandible | 6h |
| Panel de Escena con elementos | 8h |
| Tabla de Pasada | 8h |
| Dialog TOP (crear/editar) | 10h |
| Drag & drop para reordenar | 8h |
| Bloqueo de edición (indicador) | 4h |
| Vistas (global, tops, departamento) | 10h |
| Tests TOPS | 8h |
| **Total Sprint 3** | **96h** |

### Sprint 4: Integraciones + Polish (1 semana)
| Tarea | Horas |
|-------|-------|
| WebSocket para updates en tiempo real | 8h |
| Exportación Word (llamada API + descarga) | 4h |
| Dashboard con widgets | 8h |
| Notificaciones (toasts, badges) | 4h |
| Modo Cartelería | 6h |
| Responsive / Mobile | 8h |
| Accesibilidad (a11y) | 4h |
| **Total Sprint 4** | **42h** |

### Sprint 5: Testing + Deploy (0.5 semanas)
| Tarea | Horas |
|-------|-------|
| Tests unitarios adicionales | 8h |
| Tests E2E (Cypress/Playwright) | 8h |
| Optimización bundle (lazy loading) | 4h |
| Configuración producción | 4h |
| Documentación componentes | 4h |
| **Total Sprint 5** | **28h** |

---

## 8. Resumen de Estimación Frontend

| Fase | Horas |
|------|-------|
| Sprint 1: Setup + Auth | 34h |
| Sprint 2: TEMPO | 59h |
| Sprint 3: TOPS | 96h |
| Sprint 4: Integraciones + Polish | 42h |
| Sprint 5: Testing + Deploy | 28h |
| **TOTAL FRONTEND** | **259h** |

---

## 9. Comandos de Desarrollo

```bash
# Crear proyecto
ng new teatro-real-frontend --standalone --routing --style=scss

# Añadir Angular Material
ng add @angular/material

# Añadir TailwindCSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init

# Instalar dependencias adicionales
npm install @fullcalendar/angular @fullcalendar/core @fullcalendar/daygrid @fullcalendar/timegrid @fullcalendar/interaction
npm install date-fns file-saver
npm install -D @types/file-saver

# Desarrollo
ng serve

# Build producción
ng build --configuration production

# Tests
ng test
ng e2e
```

---

## 10. Consideraciones UI/UX

### 10.1 Paleta de Colores
- **Primary:** Teatro Real gold (#c9a227)
- **Secondary:** Azul oscuro (#1a1a2e)
- **Accent:** Rojo (#e94560)
- **Background:** Blanco/Gris claro
- **Colores de actividades:** Según código definido en requisitos

### 10.2 Tipografía
- **Headings:** Inter o Roboto (bold)
- **Body:** Inter o Roboto (regular)
- **Monospace:** Para códigos de TOP

### 10.3 Responsive Breakpoints
- **Mobile:** < 768px
- **Tablet:** 768px - 1024px
- **Desktop:** > 1024px

### 10.4 Accesibilidad
- Contraste WCAG AA
- Navegación por teclado
- ARIA labels en componentes interactivos
- Focus visible

---

*Plan de Implementación Frontend - Teatro Real*
*Angular 18 + Angular Material + TailwindCSS*
*Fecha: 2025-12-11*
