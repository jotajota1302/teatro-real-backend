# Guía de replicación del dashboard actual

Este documento describe **con detalle el dashboard que vemos hoy en `teatro-real-frontend`** para que, únicamente con esta guía, sepas qué construir y cómo adaptarlo en la rama **Sandra** (Angular + Spring Boot) sin perder ningún detalle funcional, visual ni de datos.

---

## 1. Visión general del dashboard actual

El componente `home.component.ts` (standalone) presenta una **Vista Global** dividida en:

1. **Encabezado con título y acción** (`"Vista Global"` y botón “Nueva Actividad”).
2. **Grid de estadísticas** con 4 tarjetas: actividades de hoy, espacios ocupados, producciones activas y notificaciones.
3. **Grid principal con dos zonas**:
   - **Lista de "Actividades de Hoy"** (columna Ancha / 2/3 del ancho).
   - **Panel de "Próximos eventos"** (columna estrecha / 1/3 del ancho).

La UI usa exclusivamente clases utility de **Tailwind CSS** y unas pocas utilidades propias (`btn-primary`, `.card`, `.badge`), así que el resultado es limpio, responsivo y basado en el sistema de diseño corporativo.

---

## 2. Estructura del DOM y secciones

```html
<div class="space-y-6">
  <!-- Header -->
  <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-white">Vista Global</h1>
      <p class="text-tr-gray-400">Resumen de actividades del Teatro Real</p>
    </div>
    <div class="flex gap-2">
      <button class="btn-primary flex items-center gap-2">
        <span class="material-icons text-lg">add</span>
        Nueva Actividad
      </button>
    </div>
  </div>

  <!-- Stats Grid -->
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    <!-- 4 tarjetas -->
  </div>

  <!-- Content Grid -->
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <div class="lg:col-span-2 card">Actividades de hoy</div>
    <div class="card">Próximos eventos</div>
  </div>
</div>
```

**Clases clave a replicar**:
- `.card`: fondo oscuro con padding, borde redondeado y sombra.
- `.btn-primary`: botón carmesí con icono.
- `.badge`: pildora con color derivado del tipo de actividad.
- Utilities como `flex`, `grid`, `gap`, `text-white`, `bg-teatro-negro`, `hover:bg-tr-gray-900`, etc.

Adicionalmente se emplean los **Material Icons** dentro de `<span class="material-icons">`.

---

## 3. Modelo de datos (fuente fija en frontend)

```ts
interface StatCard {
  title: string;
  value: string;
  icon: string;
  color: string; // color hexa para icono y fondo
}

interface Activity {
  title: string;
  location: string;
  time: string;
  type: string;
  color: string;
}

interface UpcomingEvent {
  title: string;
  date: string;
}
```

Datos actuales:

### Estadísticas
1. { title: 'Actividades Hoy', value: '12', icon: 'event', color: '#CF102D' }
2. { title: 'Espacios Ocupados', value: '8/15', icon: 'location_city', color: '#1E3A5F' }
3. { title: 'Producciones Activas', value: '4', icon: 'music_note', color: '#2E7D32' }
4. { title: 'Notificaciones', value: '3', icon: 'notifications', color: '#EF6C00' }

### Actividades de hoy (lista)
- Ensayo - La Traviata (Escenario Principal · 10:00-14:00) [tipo `Ensayo`, color `#2E7D32`]
- Función - Carmen (Sala Principal · 20:00-23:00) [tipo `Función`, color `#1E3A5F`]
- Montaje - El Barbero de Sevilla (Sala Gayarre · 09:00-18:00) [tipo `Montaje`, color `#E57373`]
- Visita Guiada (Recorrido General · 11:00-12:30) [tipo `Visita`, color `#7B1FA2`]

Cada actividad muestra un indicador vertical coloreado, nombre truncado y una **badge** (tipo) con color derivado del `color` + opacidad.

### Próximos eventos
- Estreno - Tosca · 15 Dic 2024
- Concierto de Navidad · 22 Dic 2024
- Gala de Fin de Año · 31 Dic 2024

---

## 4. Estilos y tokens visuales

**Tailwind config** (colores principales):
- `teatro.carmesi`: #CF102D
- `teatro.negro`: #010101
- `teatro.negro-carbon`: #232323
- `tr-gray-*`: grises corporativos

Otros tokens:
- Botones carmesí (hover con `#2563eb`).
- Cartas con fondo `bg-teatro-negro` y `hover:bg-tr-gray-900`.
- Texto principal en `text-white`, descripciones en `text-tr-gray-400`.

Para replicarlo en la rama Sandra, asegúrate de:
1. Tener configurado Tailwind o equivalentes (SCSS con mixins).
2. Incluir Material Icons vía `<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />` o paquete local.
3. Replicar clases `.btn-primary`, `.card`, `.badge` (pueden ser SCSS globales o component styles).

---

## 5. Dependencias necesarias

- **Angular 18** (Standalone components y Signals).
- **Tailwind CSS** (clases utilities): replicar configuración (colores + fuentes).
- **Material Icons** (para iconografía).
- **RxJS**: si conectas a servicios.
- **Backend**: Spring Boot + endpoints REST.

---

## 6. Contrato de backend propuesto

Crea un endpoint REST (ejemplo `GET /api/v1/dashboard/overview`) que devuelva:

```json
{
  "stats": [
    { "title": "Actividades Hoy", "value": "12", "icon": "event", "color": "#CF102D" },
    ...
  ],
  "todayActivities": [
    {
      "title": "Ensayo - La Traviata",
      "location": "Escenario Principal",
      "time": "10:00 - 14:00",
      "type": "Ensayo",
      "color": "#2E7D32"
    },
    ...
  ],
  "upcomingEvents": [
    { "title": "Estreno - Tosca", "date": "15 Dic 2024" },
    ...
  ]
}
```

**Consideraciones backend (Spring Boot)**:
- DTOs: `DashboardOverviewDto`, `StatDto`, `ActivityDto`, `EventDto`.
- Servicio que agregue:
  - Conteos de actividades (posiblemente desde entidad `Actividad`).
  - Cálculo de espacios ocupados (`Espacio` con flag `ocupado`).
  - Producciones activas.
  - Notificaciones (p.ej. `Alert`).
- Posibilidad de cachear o agregar `@Scheduled` si es costoso.

---

## 7. Plan de implementación en la rama Sandra

### Frontend (Angular + SCSS)
1. **Crear componente `dashboard` (o reutilizar `home`)**:
   - Arquitectura: `DashboardComponent`/`HomeComponent`.
   - Template replicando estructura descrita en la sección 2.
   - Estilos: definir clases globales `.card`, `.badge`, `.btn-primary` en `styles.scss` o dentro del componente.
2. **Servicio `DashboardService`**:
   - Método `getOverview(): Observable<DashboardOverviewDto>`.
   - Conectar con `HttpClient` a `GET /api/v1/dashboard/overview`.
3. **Modelos TypeScript** (interfaces replicando DTOs).
4. **Integración con Angular Signals** (opcional) o `RxJS` para estado.
5. **Cargar datos**:
   - En `ngOnInit`, suscribirse al servicio y poblar `stats`, `todayActivities`, `upcomingEvents`.
   - Mostrar estados de carga (`Skeletons` o `*ngIf`).
6. **Botón "Nueva Actividad"**:
   - Puede abrir modal o redirigir a formulario (en la guía se indica placeholder).
7. **Accesibilidad**:
   - Labels visibles, contrastes altos.
   - `aria-live` en notificaciones si se agregan más adelante.

### Backend (Spring Boot)
1. **Controlador `DashboardController`**:
   - Endpoint `@GetMapping("/api/v1/dashboard/overview")`.
   - Retorna DTO con listas.
2. **Servicio `DashboardService`**:
   - Inyectar repositorios de `Actividad`, `Espacio`, etc.
   - Construir listas con los datos del día actual.
3. **Repositorios**:
   - Métodos personalizados para contar `actividadesHoy`, `espaciosDisponibles`, etc.
4. **DTOs + MapStruct** (opcional) para mapear entidades.
5. **Pruebas unitarias**:
   - Mockear repositorios.
   - Verificar que el endpoint devuelva datos coherentes.
6. **Datos simulados**:
   - En fase inicial, puedes devolver datos fijos idénticos a los del frontend para validar UI.

---

## 8. Checklist para replicación exacta

- [ ] Copiar markup y clases tal cual (header + grids).
- [ ] Crear servicios DTO + endpoint backend con datos simulados.
- [ ] Importar Tailwind (o replicar utilidades) y Material Icons.
- [ ] Definir colores oficiales en `styles.scss` si no se usa Tailwind.
- [ ] Conectar componente frontend a backend y manejar carga/errores.
- [ ] Asegurar responsividad (grids 1, 2, 4 columnas).
- [ ] Validar con pruebas de integración Angular (si aplica).
- [ ] Documentar cualquier desviación para futuras revisiones.

---

## 9. Recomendaciones adicionales

- Mantén los datos del dashboard en un centro de verdad (`DashboardService`), así si se requieren actualizaciones (websocket, polling) solo se tocan 2 capas.
- Puedes exponer datos en forma de **DTOs enriquecidos** (icono, color) para evitar lógica pesada en frontend.
- Aplica caching a nivel backend si la consulta se ejecuta con frecuencia.
- Extiende la guía si se añaden más secciones (p.ej. timeline) indicando la fuente y la lógica de datos.

---

Con esta guía tienes la estructura, los datos, los estilos, los contratos REST y el plan de acción tanto del frontend como del backend para replicar el dashboard “tal cual” en la rama Sandra. Si te parece bien, puedo seguir con la implementación de los archivos necesarios o prepararte las tareas detalladas. ¿Quieres que pase a Act Mode y comencemos a crear los artefactos concretos?
