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

---

# Evolutivo: Aprobación de Reservas de Salas (Pantalla)

> Usa este bloque para crear la petición de evolutivo completa siguiendo el TEMPLATE_EVOLUTIVO.md. Está orientado a frontend (UI + integración con API). Coloca esta especificación en el ticket/request para desarrollo frontend.

## 1. Título corto
Aprobación de Reservas de Salas (TEMPO)

## 2. Resumen ejecutivo (1-2 frases)
Crear una pantalla en TEMPO donde gestores puedan revisar, aprobar o rechazar reservas de sala pendientes. Mejora el flujo operativo y evita solapamientos de reservas.

## 3. Objetivo
Permitir a usuarios con permisos gestionar (aprobar/rechazar) reservas de salas desde una vista centralizada, con detalles, filtros por sala y fecha, acciones individuales y en lote, y feedback de estado inmediato.

## 4. Contexto / Antecedentes
- Módulo / ruta: features/tempo -> reservas/aprobacion
  - Ruta propuesta: /tempo/reservas/aprobacion
- Estado actual: Existe gestión de espacios y calendario, y endpoints básicos de actividades/espacios. No hay pantalla dedicada para aprobar reservas operativas.
- Dependencias:
  - Endpoint GET /api/reservas?estado=PENDIENTE (backend)
  - POST /api/reservas/{id}/approve, POST /api/reservas/{id}/reject
  - Espacios: GET /api/espacios para mostrar nombres de sala.
  - Guards: modulePermissionGuard data: { modulo: 'TEMPO' } y roleGuard para roles gestores.

## 5. Alcance (qué incluye / qué queda fuera)
- Incluye:
  - Nueva pantalla standalone: ReservasAprobacionComponent (features/tempo/reservas-aprobacion)
  - Servicio ReservaService consumiendo endpoints necesarios (signals).
  - Tabla/listado con paginación simple, filtros por sala/fecha, búsqueda por solicitante.
  - Modal/Drawer con detalles de la reserva y acciones Approve/Reject.
  - Acciones en lote (seleccionar varias reservas y aprobar/rechazar).
  - Toasts/snackbars y manejo básico de errores.
  - Tests unitarios y e2e para flujo principal.
- No incluye:
  - Diseño visual complejo (seguir guidelines Material + Tailwind).
  - Lógica avanzada de conflicto/solapamiento (backend debe decidir).
  - Integración con notificaciones externas (email/SMS) — backend.

## 6. User story(s)
- Principal: "Como gestor de reservas, quiero ver las reservas pendientes para revisar y aprobar o rechazar, para asegurar que la ocupación de salas esté controlada."
- Variantes:
  - Como gestor quiero filtrar por sala y fecha.
  - Como gestor quiero aprobar múltiples reservas seleccionadas.

## 7. Prioridad
normal / alta (configurable por producto)

## 8. Criterios de aceptación (AC) — imprescindibles y testables
1. AC-1: Existe ruta /tempo/reservas/aprobacion accesible solo para usuarios con permiso TEMPO y rol GESTOR_RESERVAS.
2. AC-2: Al abrir la pantalla se muestra una lista de reservas con estado PENDIENTE obtenidas de GET /api/reservas?estado=PENDIENTE.
3. AC-3: Cada fila muestra: ID, sala (nombre), fecha, hora inicio/fin, solicitante, motivo corto y acciones (Ver / Aprobar / Rechazar).
4. AC-4: Click en "Ver" abre un MatDialog/Drawer con todos los detalles y botones "Aprobar" y "Rechazar" que llaman a los endpoints correspondientes y actualizan la lista.
5. AC-5: Aprobar/Rechazar muestra un snackbar con resultado y elimina/actualiza la reserva en la vista sin recargar toda la página.
6. AC-6: Soporta selección múltiple y acción "Aprobar seleccionadas" que llama a POST /api/reservas/bulk-approve (si existe) o hace llamadas concurrentes; mostrar confirmación antes de ejecutar.
7. AC-7: Filtros por sala y fecha funcionan y persisten en query params (e.g. ?sala=ID&fecha=2026-01-26).
8. AC-8: Errores 401/403 manejados por interceptor (redirigir según reglas) y errores 500 muestran mensaje genérico "Error procesando la petición".
9. AC-9: Tests e2e cubren flujo: cargar pantalla, filtrar, abrir detalle, aprobar reserva, comprobar que ya no aparece.

Pruebas manuales:
- Cargar pantalla con al menos 3 reservas pendientes.
- Aprobar una reserva y verificar snackbar y que desaparece de la lista.
- Rechazar con motivo (opcional) y verificar estado.

## 9. Permisos / Guards
- Guard requerido: modulePermissionGuard + roleGuard
- data esperada: { modulo: 'TEMPO' } y roles: ['GESTOR_RESERVAS', 'ADMIN']

## 10. API / Backend (si aplica)
- Endpoint(s) consumidos desde frontend:
  - GET /api/reservas?estado=PENDIENTE&espacioId={id}&fecha={yyyy-MM-dd}&page={n}&size={m}
    - Response: [{ id, espacio: { id, nombre }, fecha, horaInicio, horaFin, solicitante: { id,nombre }, motivo, detalles, estado }]
  - GET /api/espacios -> [{ id, nombre }]
  - POST /api/reservas/{id}/approve -> 200 / 204 (actualiza estado)
  - POST /api/reservas/{id}/reject { reason?: string } -> 200 / 204
  - POST /api/reservas/bulk-approve -> { ids: string[] }  (opcional; si no existe, frontend ejecuta llamadas individuales)
- Comportamiento esperado ante errores:
  - 401/403 gestionados por interceptor.
  - 409 (conflicto de solapamiento) → mostrar modal con información y dejar elección al usuario.
  - Timeouts → mostrar mensaje "Tiempo de espera agotado".

## 11. Mock de datos (ejemplos JSON)
Reservas:
[
  {
    "id": "r1",
    "espacio": { "id": "s1", "nombre": "Sala Principal" },
    "fecha": "2026-02-10",
    "horaInicio": "10:00",
    "horaFin": "12:00",
    "solicitante": { "id":"u1","nombre":"María López" },
    "motivo": "Ensayo general",
    "detalles": "Necesitan piano, micrófono",
    "estado": "PENDIENTE"
  },
  {
    "id": "r2",
    "espacio": { "id": "s2", "nombre": "Sala 2" },
    "fecha": "2026-02-11",
    "horaInicio": "09:00",
    "horaFin": "11:00",
    "solicitante": { "id":"u2","nombre":"Carlos Ruiz" },
    "motivo": "Reunión técnica",
    "detalles": "",
    "estado": "PENDIENTE"
  }
]

Espacios:
[
  { "id": "s1", "nombre": "Sala Principal" },
  { "id": "s2", "nombre": "Sala 2" }
]

## 12. Componentes a crear / modificar (nombres y paths sugeridos)
- Nuevo:
  - features/tempo/reservas-aprobacion/reservas-aprobacion.component.ts (standalone)
  - features/tempo/reservas-aprobacion/reserva-detalle.dialog.ts (standalone MatDialog)
  - features/tempo/reservas-aprobacion/reserva.service.ts (signals + métodos load/pending/approve/reject)
- Modificar:
  - features/tempo/tempo.routes.ts → añadir ruta lazy/load component a /reservas/aprobacion
  - shared/components/table.component.ts (si existe, para consistencia)

## 13. Diseño y UI
- Controles:
  - MatFormField + MatSelect (filtro por sala)
  - MatDatepicker (filtro por fecha)
  - MatTable o lista con MatList + MatCheckbox para selección múltiple
  - MatDialog para detalle y confirmación
  - MatSnackBar para feedback
  - Buttons: "Aprobar", "Rechazar", "Aprobar seleccionadas"
- Bibliotecas: Angular Material, Tailwind para utilidades
- Texto visibles (i18n):
  - reservas.aprobacion.titulo = "Aprobación de reservas"
  - reservas.aprobacion.filtro.sala = "Sala"
  - reservas.aprobacion.filtro.fecha = "Fecha"
  - reservas.aprobacion.acciones.aprobar = "Aprobar"
  - reservas.aprobacion.acciones.rechazar = "Rechazar"
  - reservas.aprobacion.vacio = "No hay reservas pendientes"
- Comportamiento:
  - Persistir filtros en query params.
  - Al aprobar/rechazar actualizar signals para que la UI re-renderice automáticamente.
  - Mostrar estado de carga y placeholders.

## 14. Internationalization (i18n)
- Claves y textos a extraer:
  - reservas.aprobacion.titulo = "Aprobación de reservas"
  - reservas.aprobacion.buscar = "Buscar"
  - reservas.aprobacion.confirmar.aprobar = "¿Confirmas aprobar {count} reservas?"
  - reservas.aprobacion.notificaciones.aprobado = "Reserva aprobada"
  - reservas.aprobacion.notificaciones.rechazado = "Reserva rechazada"

## 15. Accesibilidad
- ARIA roles para tabla/lista.
- Order tab: filtros → lista → acciones.
- Focus management: focus al abrir dialog y volver al control origen al cerrar.
- Contraste: botones principales con --teatro-crimson y texto blanco.

## 16. Tests requeridos
- Unitarios:
  - ReservaService: loadPending(), approve(), reject() (mocks ApiService).
  - ReservasAprobacionComponent: renderizado, filtros, llamada a servicio y updates de signals.
- E2E:
  - Flujo principal: navegar a la ruta, filtrar, abrir detalle, aprobar y verificar eliminación de la fila.
- Coverage mínima deseada: 80% en nuevos módulos.

## 17. Entregables
- Código: componentes, servicio, tests.
- PR con descripción, capturas y pasos de QA.
- Notas de QA con endpoints usados y mocks.
- Actualización de i18n.

## 18. Branch / PR (opcional)
- Branch sugerido: feature/tempo-aprobacion-reservas
- Base: develop

## 19. Estimación y deadline
- Estimación: 2-3 días (frontend + tests)
- Fecha objetivo: (definir por producto)

## 20. Checklist de desarrollo
- [ ] Crear componente standalone ReservasAprobacionComponent
- [ ] Implementar ReservaService con Signals
- [ ] Consumir endpoints y gestionar errores
- [ ] Añadir estilo con Tailwind + Angular Material
- [ ] Tests unitarios y e2e
- [ ] Documentar i18n
- [ ] Abrir PR con screenshots

## 21. Notas adicionales / Adjuntos
- Adjuntar mockups (si el cliente proporciona) y confirmar contrato de endpoints con backend.
- Si el backend no provee bulk-approve, usar ejecución concurrente con control de errores y mostrar progreso.

---
