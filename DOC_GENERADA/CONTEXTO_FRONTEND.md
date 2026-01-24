# CONTEXTO FRONTEND - Teatro Real

> Documento de referencia para agentes de codificación. Angular 18.2 + Standalone Components + Signals.

## Stack Tecnológico

| Tecnología | Versión | Uso |
|------------|---------|-----|
| Angular | 18.2 | Framework principal |
| TypeScript | 5.5 | Lenguaje |
| TailwindCSS | 3.4 | Estilos utility-first |
| Angular Material | 18 | Componentes UI |
| FullCalendar | 6 | Calendario |
| RxJS | 7.8 | Observables (API calls) |
| Signals | Built-in | Estado reactivo |

## Estructura de Carpetas

```
src/app/
├── core/                    # Servicios singleton y configuración
│   ├── auth/               # AuthService, guards, interceptor, models
│   ├── guards/             # roleGuard, modulePermissionGuard
│   └── services/           # ApiService, BackendStatusService, etc.
├── features/               # Módulos funcionales (lazy loaded)
│   ├── tempo/              # Calendario, espacios, actividades, logística
│   ├── tops/               # Guiones técnicos (placeholder)
│   ├── carteleria/         # Signage digital
│   └── admin/              # Gestión usuarios (placeholder)
├── layout/                 # MainLayout, Header, Sidebar
├── shared/                 # Componentes reutilizables
├── app.routes.ts           # Rutas principales
└── app.config.ts           # Providers globales
```

## Patrones Obligatorios

### 1. Standalone Components (SIN NgModules)

```typescript
@Component({
  selector: 'app-ejemplo',
  standalone: true,
  imports: [CommonModule, MatButtonModule, OtroComponent],
  template: `...`,
  styles: [`...`]
})
export class EjemploComponent { }
```

### 2. Signals para Estado

```typescript
// Estado privado
private itemsSignal = signal<Item[]>([]);
private loadingSignal = signal(false);

// Exposición pública read-only
items = this.itemsSignal.asReadonly();
loading = this.loadingSignal.asReadonly();

// Computed para derivados
itemsActivos = computed(() => this.itemsSignal().filter(i => i.activo));

// Actualización
this.itemsSignal.set(nuevosItems);
this.itemsSignal.update(list => [...list, nuevoItem]);
```

### 3. Inyección con inject()

```typescript
export class MiComponent {
  private service = inject(MiService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
}
```

### 4. Template Syntax (@if, @for)

```html
@if (loading()) {
  <mat-spinner />
} @else {
  @for (item of items(); track item.id) {
    <div>{{ item.nombre }}</div>
  } @empty {
    <p>No hay items</p>
  }
}
```

### 5. Servicios con Signals + Observables

```typescript
@Injectable({ providedIn: 'root' })
export class ItemService {
  private api = inject(ApiService);
  private itemsSignal = signal<Item[]>([]);

  items = this.itemsSignal.asReadonly();

  loadItems(): Observable<Item[]> {
    return this.api.get<Item[]>('/api/items').pipe(
      tap(items => this.itemsSignal.set(items)),
      catchError(err => {
        console.warn('Error cargando items');
        return of(this.itemsSignal()); // Retorna cache
      })
    );
  }

  create(request: ItemRequest): Observable<Item> {
    return this.api.post<Item>('/api/items', request).pipe(
      tap(item => this.itemsSignal.update(list => [...list, item]))
    );
  }
}
```

### 6. Desuscripción con takeUntilDestroyed

```typescript
ngOnInit() {
  this.service.loadItems()
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe();
}
```

## Autenticación

### AuthService (Signals)

```typescript
// Signals públicas
currentUser: Signal<Usuario | null>
isAuthenticated: Signal<boolean>
isAdmin: Signal<boolean>

// Métodos
login(email, password): Observable<void>
logout(): void  // Fire-and-forget, limpia estado primero
devLogin(): void  // Solo desarrollo
```

### Guards

```typescript
// authGuard - Verifica autenticación
canActivate: [authGuard]

// roleGuard - Verifica roles específicos
canActivate: [roleGuard], data: { roles: ['ADMIN', 'GESTOR'] }

// modulePermissionGuard - Verifica acceso a módulo
canActivate: [modulePermissionGuard], data: { modulo: 'TEMPO' }
```

### Interceptor (authInterceptor)

- Agrega `Authorization: Bearer {token}` a peticiones
- Timeout 15 segundos
- 401 → Redirige a login
- 403 → Redirige a acceso-denegado
- Errores de red → Reporta a BackendStatusService

## Rutas (Lazy Loading)

```typescript
export const routes: Routes = [
  { path: '', redirectTo: 'tempo/espacios', pathMatch: 'full' },
  { path: 'auth', loadChildren: () => import('./features/auth/auth.routes') },
  {
    path: '',
    loadComponent: () => import('./layout/main-layout/main-layout.component'),
    canActivate: [authGuard],
    children: [
      { path: 'tempo', loadChildren: ..., canActivate: [modulePermissionGuard], data: { modulo: 'TEMPO' } },
      { path: 'tops', loadChildren: ..., data: { modulo: 'TOPS' } },
      { path: 'admin', loadChildren: ..., canActivate: [roleGuard], data: { roles: ['ADMIN'] } }
    ]
  }
];
```

## Estilos

### Colores Institucionales

```css
--teatro-black: #010101;
--teatro-crimson: #CF102D;  /* Primario */
--teatro-white: #FFFFFF;
```

### TailwindCSS + Inline Styles

```typescript
template: `
  <div class="flex flex-col lg:flex-row gap-4 p-6 bg-gray-100">
    <button class="bg-[#CF102D] text-white px-4 py-2 rounded">
      Acción
    </button>
  </div>
`,
styles: [`
  :host ::ng-deep .mat-mdc-form-field { ... }
`]
```

## API Calls (ApiService)

```typescript
// GET
this.api.get<Item[]>('/api/items', { param: 'value' })

// POST
this.api.post<Item>('/api/items', requestBody)

// PUT
this.api.put<Item>('/api/items/123', requestBody)

// DELETE
this.api.delete<void>('/api/items/123')
```

## Convenciones de Naming

| Tipo | Convención | Ejemplo |
|------|-----------|---------|
| Componentes | `NombreComponent` | `CalendarioComponent` |
| Servicios | `NombreService` | `ActividadService` |
| Guards | `nombreGuard` | `authGuard` |
| Signals privadas | `nombreSignal` | `actividadesSignal` |
| Signals públicas | `nombre` (readonly) | `actividades` |
| Interfaces | `Nombre` o `NombreDTO` | `Actividad`, `ActividadRequest` |

## Estructura de Componente Típico

```typescript
@Component({
  selector: 'app-mi-componente',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  template: `
    @if (loading()) {
      <mat-spinner />
    } @else {
      @for (item of items(); track item.id) {
        <div (click)="seleccionar(item)">{{ item.nombre }}</div>
      }
    }
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class MiComponente implements OnInit {
  // 1. Inyecciones
  private service = inject(MiService);
  private destroyRef = inject(DestroyRef);

  // 2. Signals locales
  loading = signal(false);
  selectedId = signal<string | null>(null);

  // 3. Computed
  items = computed(() => this.service.items());

  // 4. Lifecycle
  ngOnInit() {
    this.cargarDatos();
  }

  // 5. Métodos públicos
  seleccionar(item: Item) {
    this.selectedId.set(item.id);
  }

  // 6. Métodos privados
  private cargarDatos() {
    this.loading.set(true);
    this.service.loadItems()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loading.set(false))
      )
      .subscribe();
  }
}
```

## Módulos Implementados

| Módulo | Estado | Ubicación |
|--------|--------|-----------|
| TEMPO (Calendario) | 95% | `features/tempo/` |
| TEMPO (Espacios) | 95% | `features/tempo/espacios/` |
| TEMPO (Logística) | 30% | `features/tempo/logistica/` |
| TOPS (Guiones) | 5% | `features/tops/` (placeholder) |
| Cartelería | 100% | `features/carteleria/` |
| Admin | 5% | `features/admin/` (placeholder) |

## Comandos de Desarrollo

```bash
npm start          # http://localhost:4200 (proxy a :8080)
npm run build      # Build producción
```
