# Guía de replicación del módulo TEMPO

Este documento recoge **toda la información de implementación actual del módulo TEMPO** que existe en `teatro-real-frontend` (carpetas `espacios`, `calendario`, `logistica` y `carteleria`), además de la configuración de rutas que conecta con el backend. El objetivo es que, con esta guía, puedas recrear exactamente ese módulo dentro de la rama **Sandra** (Angular + Spring Boot) manteniendo estructura, datos, estilos y contratos REST.

---

## 1. Rutas activas para TEMPO

Todas las rutas están registradas en `src/app/app.routes.ts` dentro del layout principal (`MainLayoutComponent`). Las rutas relacionadas con TEMPO son:

| Ruta | Componente | Título |
|------|------------|--------|
| `/espacios` | `EspaciosComponent` | “Espacios – Teatro Real” |
| `/calendario` | `CalendarioComponent` | “Calendario – Teatro Real” |
| `/producciones` | `ProduccionesComponent` | “Producciones – Teatro Real” |
| `/guiones` | `GuionesComponent` | “Guiones Técnicos – Teatro Real” |
| `/logistica` | `LogisticaComponent` | “Logística – Teatro Real” |
| `/carteleria` | `CarteleriaComponent` | “Cartelería – Teatro Real” |

Estas rutas se exponen a través del router principal y se encargan de cargar mediante `loadComponent` los componentes standalone correspondientes. Mantén la misma estructura de rutas en la rama Sandra para que los enlaces del sidebar (`routerLink="/tempo/espacios"`, etc.) sigan funcionando tras adaptar el módulo.

---

## 2. SUBMÓDULO: Espacios

### Visión visual
- Encabezado con título “Espacios” y descripción.
- Botón “Nuevo Espacio” con clase `btn-primary`.
- Grid responsivo (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`) con tarjetas que muestran icono (Material Icons), nombre, tipo y un indicador de disponibilidad:
  - Punto y texto (`Disponible`/`Ocupado`) cambian clases (`bg-estado-exito`/`bg-estado-error`).
  - Tarjeta usa `card-hover` para feedback visual.
- Sidebar anclado a la izquierda con el elemento activo resaltado en rojo (`bg-teatro-carmesi`) y texto/icono blancos como pivote de navegación.
- Los cards de espacios tienen fondo gris oscuro, bordes redondeados y spacing amplio; el icono se acompaña de un círculo rojo o verde según el estado, reforzando la información visual del estado.

### Datos mock actuales
```ts
[
  { nombre: 'Escenario Principal', tipo: 'Escenario', icon: 'theater_comedy', disponible: false },
  { nombre: 'Sala Gayarre', tipo: 'Sala de ensayos', icon: 'meeting_room', disponible: true },
  { nombre: 'Sala Barbieri', tipo: 'Sala de ensayos', icon: 'meeting_room', disponible: true },
  { nombre: 'Foso de Orquesta', tipo: 'Espacio técnico', icon: 'music_note', disponible: false },
  { nombre: 'Camerinos Principales', tipo: 'Camerinos', icon: 'person', disponible: true },
  { nombre: 'Almacén de Vestuario', tipo: 'Almacén', icon: 'inventory_2', disponible: true }
]
```

### Adaptación prevista
- **Frontend (Angular)**:
  - Crear `EspaciosComponent` que renderice el grid y consuma `EspaciosService`.
  - Definir interfaz `EspacioDto { nombre, tipo, icon, disponible }`.
  - Aplicar clases de estado en función del boolean `disponible`.
- **Backend (Spring Boot)**:
  - Endpoint `GET /api/v1/espacios` que devuelva la lista de espacios con estado actual.
  - Repositorio `EspacioRepository`, entidad `Espacio` (nombre, tipo, icono, disponible).
  - Posible `POST /api/v1/espacios` para crear nuevos registros.

---

## 3. SUBMÓDULO: Calendario

### UI actual
- Header “Calendario” + descripción.
- Botones “Filtros” (secundario) y “Nueva Actividad” (primario).
- Placeholder de 600px con icono `calendar_month`, texto descriptivo y mención a `FullCalendar`.
- El placeholder ocupa casi toda la anchura disponible, con bordes redondeados y un tono gris muy oscuro; los botones superiores tienen sombra sutil y colores diferenciados (gris para secundario, rojo para primario) para indicar jerarquía.
- El sidebar muestra el elemento activo en rojo, manteniendo coherencia visual con demás secciones.

### Guía de réplica
- **Frontend**:
  - Mantener estructura actual y preparar transición a calendario real (FullCalendar o Angular Calendar).
  - Botones conectados a acciones futuras (mostrar filtros, diálogo para nueva actividad).
- **Backend**:
  - Endpoint `GET /api/v1/calendario/actividades` con DTO `CalendarioEventDto { id, titulo, inicio, fin, espacio, tipo }`.
  - Posibles filtros por fecha/espacio y POST para crear nuevas actividades.

---

## 4. SUBMÓDULO: Logística

### Layout
- Header “Logística” con botón “Nueva Operación”.
- Tres tarjetas de resumen (`Cargas Pendientes`, `Completadas Hoy`, `En Tránsito`) con iconos y colores definidos (`actividad-cargas`, `estado-exito`, `estado-advertencia`).
- Lista de operaciones recientes:
  - Cada entrada muestra icono (color `op.color`), descripción, producción y fecha.
  - Badge de estado con fondo `estadoColor + '20'`.
  - El card de operaciones recientes tiene fondo negro intenso, separadores simples y badges con bordes completamente redondeados; los estados (“Pendiente”, “Completado”) usan color saturado para mantener la claridad.

### Datos fijos
```ts
[
  {
    id: 1,
    descripcion: 'Carga de escenografía',
    produccion: 'La Traviata',
    fecha: 'Hoy 14:00',
    estado: 'Pendiente',
    estadoColor: '#EF6C00',
    icon: 'upload',
    color: '#F9A825'
  },
  {
    id: 2,
    descripcion: 'Descarga de vestuario',
    produccion: 'Carmen',
    fecha: 'Hoy 10:00',
    estado: 'Completado',
    estadoColor: '#2E7D32',
    icon: 'download',
    color: '#2E7D32'
  },
  {
    id: 3,
    descripcion: 'Transporte de instrumentos',
    produccion: 'Orquesta',
    fecha: 'Ayer',
    estado: 'Completado',
    estadoColor: '#2E7D32',
    icon: 'local_shipping',
    color: '#1565C0'
  }
]
```

### Plan de réplica
- **Frontend**: `LogisticaComponent` y servicios (`LogisticaService`) consumiendo:
  - `GET /api/v1/logistica/summary` -> estadísticas.
  - `GET /api/v1/logistica/operaciones` -> lista de operaciones.
- **Backend**:
  - Controller con endpoints listados.
  - Entidad `OperacionLogistica` con campos relevantes y estado.
  - DTOs `LogisticaStatDto`, `OperacionLogisticaDto`.

---

## 5. SUBMÓDULO: Cartelería

### Interfaz
- Header “Cartelería Digital” con botones “Vista previa” (secundario) y “Publicar” (primario).
- Grid responsive con tarjetas que muestran:
  - Mini preview (cuadro `aspect-video` con icono `tv`).
  - Nombre y ubicación.
  - Indicador activo/inactivo (círculo + texto con clases `estado-exito`/`estado-error`).
- El sidebar mantiene el botón activo en rojo mientras que cada tarjeta de pantalla tiene bordes grises, sombra sutil y un fondo negro intenso; el icono de monitor se centra en un área amplia y los textos tienen jerarquía clara (nombre en blanco y ubicación en gris).
- Los estados “Activa/Inactiva” usan puntos y textos con colores verde (#3BC14A) o rojo (#EF6C00) brillantes para mejorar la legibilidad.

### Datos
Seis pantallas (Vestíbulo, Foyer, Palcos, Cafetería, Backstage, Exterior) con nombre, ubicación y boolean `activa`.

### Adaptación
- **Frontend**: `CarteleriaComponent` con `CarteleriaService` (`GET /api/v1/carteleria/pantallas`).
- **Backend**: Controlador `CarteleriaController` que devuelva las pantallas con su estado y permita operaciones (preview/publicación).

---

## 6. Estilos comunes y tokens

Si no se usa Tailwind en la rama Sandra, reproduce las clases más importantes en SCSS global:
- `.card`, `.card-hover`
- `.badge`
- `.btn-primary`, `.btn-secondary`
- Tokens de color: `teatro-carmesi`, `teatro-negro`, `tr-gray-*`, `actividad-*`, `estado-*`.

Incluye Material Icons en el `<head>` para iconografía.

---

## 7. Contratos backend recomendados

| Endpoint | Descripción | Respuesta esperada |
|----------|-------------|--------------------|
| `GET /api/v1/espacios` | Lista de espacios | `[EspacioDto]` |
| `GET /api/v1/calendario/actividades` | Eventos | `[CalendarioEventDto]` |
| `GET /api/v1/logistica/summary` | Stats logísticos | `{ cargasPendientes, completadasHoy, enTransito }` |
| `GET /api/v1/logistica/operaciones` | Operaciones recientes | `[OperacionLogisticaDto]` |
| `GET /api/v1/carteleria/pantallas` | Estado pantallas | `[PantallaCarteleriaDto]` |

---

## 8. Plan de implementación en rama Sandra

1. **Backend (Spring Boot)**:
   - Crear paquetes `tempo.controller`, `tempo.service`, `tempo.dto`, `tempo.repository`.
   - Mapear entidades `Espacio`, `OperacionLogistica`, `PantallaCarteleria`, `Actividad`.
   - Crear endpoints listados y documentarlos (SpringDoc).

2. **Frontend (Angular + SCSS)**:
   - Componentes en `src/app/features/tempo/espacios`, etc. con loadComponent en `app.routes.ts`.
   - Servicios `EspaciosService`, `LogisticaService`, `CarteleriaService`, `CalendarioService`.
   - Interfaces TS para DTOs.
   - Estilos comunes en `styles.scss`.

3. **Pruebas**:
   - Tests unitarios de servicios y componentes.
   - Tests de integración/rest en backend.

---

## 9. Referencias de código Java + Angular

### Espacios

**Spring Boot (Controlador + DTO)**
```java
@RestController
@RequestMapping("/api/v1/espacios")
@RequiredArgsConstructor
public class EspacioController {
  private final EspacioService espacioService;

  @GetMapping
  public List<EspacioDto> listarEspacios() {
    return espacioService.listarEspacios();
  }
}

@Data
public class EspacioDto {
  private String nombre;
  private String tipo;
  private String icon;
  private boolean disponible;
}
```

**Angular (Servicio)**
```ts
export interface EspacioDto {
  nombre: string;
  tipo: string;
  icon: string;
  disponible: boolean;
}

@Injectable({ providedIn: 'root' })
export class EspaciosService {
  constructor(private readonly http: HttpClient) {}

  obtenerEspacios(): Observable<EspacioDto[]> {
    return this.http.get<EspacioDto[]>('/api/v1/espacios');
  }
}
```

### Calendario

**Spring Boot**
```java
@GetMapping("/calendario/actividades")
public List<CalendarioEventDto> actividades() {
  return calendarioService.buscarActividades();
}
```

```java
@Data
public class CalendarioEventDto {
  private Long id;
  private String titulo;
  private LocalDateTime inicio;
  private LocalDateTime fin;
  private String espacio;
  private String tipo;
}
```

**Angular**
```ts
export interface CalendarioEventDto {
  id: number;
  titulo: string;
  inicio: string;
  fin: string;
  espacio: string;
  tipo: string;
}

@Injectable({ providedIn: 'root' })
export class CalendarioService {
  constructor(private readonly http: HttpClient) {}

  obtenerEventos(): Observable<CalendarioEventDto[]> {
    return this.http.get<CalendarioEventDto[]>('/api/v1/calendario/actividades');
  }
}
```

### Logística

**Spring Boot**
```java
@RestController
@RequestMapping("/api/v1/logistica")
@RequiredArgsConstructor
public class LogisticaController {
  private final LogisticaService service;

  @GetMapping("/summary")
  public LogisticaStatDto resumen() {
    return service.obtenerEstadisticas();
  }

  @GetMapping("/operaciones")
  public List<OperacionLogisticaDto> operaciones() {
    return service.obtenerOperaciones();
  }
}
```

**Angular**
```ts
export interface OperacionLogisticaDto {
  id: number;
  descripcion: string;
  produccion: string;
  fecha: string;
  estado: string;
  estadoColor: string;
  icon: string;
  color: string;
}

@Injectable({ providedIn: 'root' })
export class LogisticaService {
  constructor(private readonly http: HttpClient) {}

  operacionesRecientes(): Observable<OperacionLogisticaDto[]> {
    return this.http.get<OperacionLogisticaDto[]>('/api/v1/logistica/operaciones');
  }
}
```

### Cartelería

**Spring Boot**
```java
@GetMapping("/carteleria/pantallas")
public List<PantallaCarteleriaDto> listarPantallas() {
  return carteleriaService.listarPantallas();
}
```

```java
@Data
public class PantallaCarteleriaDto {
  private String nombre;
  private String ubicacion;
  private boolean activa;
}
```

**Angular**
```ts
export interface PantallaCarteleriaDto {
  nombre: string;
  ubicacion: string;
  activa: boolean;
}

@Injectable({ providedIn: 'root' })
export class CarteleriaService {
  constructor(private readonly http: HttpClient) {}

  pantallas(): Observable<PantallaCarteleriaDto[]> {
    return this.http.get<PantallaCarteleriaDto[]>('/api/v1/carteleria/pantallas');
  }
}
```

---

## 10. Checklist

- [ ] Routes definidas como en `app.routes.ts`.
- [ ] Componentes replicando markup, clases y datos actuales.
- [ ] Servicios Angular consumiendo los endpoints REST.
- [ ] Endpoints backend implementados con DTOs y datos coherentes.
- [ ] Estilos globales o Tailwind configurados con tokens de color.
- [ ] Material Icons disponibles.
- [ ] Documentación del nuevo módulo TEMPO en Swagger y en esta guía si se agrega más funcionalidad.

---

Con esta guía tienes toda la información de código (componentes, rutas, datos) y arquitectura (backend REST, servicios, estilos) para reconstruir el módulo TEMPO en la rama Sandra **tal cual** se ve en la rama principal. ¿Quieres que ahora comencemos con la implementación concreta en Act Mode? Si necesitas ampliar alguna sección o incluir diagramas, puedo prepararlos antes de pasar a la codificación.
