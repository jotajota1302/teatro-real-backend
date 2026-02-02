# Evolución del Calendario Semanal - TEMPO

## Documento de Especificación v1.0
**Fecha:** 2026-02-02
**Módulo:** TEMPO > Calendario
**Estado:** En desarrollo

---

## 1. Contexto y Decisión del Cliente

### 1.1 Requisito Original (RF-TEMPO-9)

El documento de requisitos especificaba una **vista de calendario semanal tipo Excel** como landing principal del módulo TEMPO:

> "Landing page para usuarios con acceso a TEMPO = Calendario semanal tipo Excel"

### 1.2 Evolución del Diseño

Tras iteraciones con el cliente, se ha definido el diseño final que difiere ligeramente del esquema inicial:

| Aspecto | Diseño Original | Diseño Final (Aprobado) |
|---------|-----------------|-------------------------|
| **Ejes** | Filas = Espacios, Columnas = Días | Filas = Días+Franjas, Columnas = Espacios |
| **Agrupación** | Por espacio | Por día de la semana |
| **Franjas horarias** | Una fila por día | Múltiples franjas por día (consolidadas) |
| **Navegación** | Por semana | Por semana + selector de temporada |

### 1.3 Captura de Referencia

El cliente ha validado el siguiente diseño visual:

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│  TEMPORADA 2025-2026                                           ‹  Hoy  ›        │
│  Semana nº 45  [PROVISIONAL]                                                    │
│  3 Nov 2025 – 9 Nov 2025                                                        │
├──────────────┬────────────┬─────────────┬────────┬───────────┬─────────┬────────┤
│ FECHA / HORA │ ESCENARIO  │ SALA GAYARRE│ S.E.P.E│SALA BALLET│ORQUESTA │ OTRAS  │
├──────────────┼────────────┼─────────────┼────────┼───────────┼─────────┼────────┤
│ Lunes 3/11   │            │             │        │           │         │        │
├──────────────┼────────────┼─────────────┼────────┼───────────┼─────────┼────────┤
│ 01:00 – 08:00│ [Montaje]  │             │        │           │         │        │
│              │ Cambio a   │             │        │           │         │        │
│              │ EVENTO     │             │        │           │         │        │
├──────────────┼────────────┼─────────────┼────────┼───────────┼─────────┼────────┤
│ 08:00 – 08:30│ [Montaje]  │             │        │           │[E.Piano]│        │
│              │ Preparación│             │        │           │ CARMEN  │        │
├──────────────┼────────────┼─────────────┼────────┼───────────┼─────────┼────────┤
│ Martes 4/11  │            │             │        │           │         │        │
├──────────────┼────────────┼─────────────┼────────┼───────────┼─────────┼────────┤
│ ...          │            │             │        │           │         │        │
└──────────────┴────────────┴─────────────┴────────┴───────────┴─────────┴────────┘
```

---

## 2. Especificación Funcional

### 2.1 Estructura de la Vista

#### Header/Toolbar
- **Temporada activa**: Texto "TEMPORADA 2025-2026" (desde TemporadaService)
- **Número de semana**: "Semana nº 45"
- **Badge de estado**: `PROVISIONAL` | `DEFINITIVA` (amarillo/verde)
- **Rango de fechas**: "3 Nov 2025 – 9 Nov 2025"
- **Controles de navegación**: `‹` Anterior | `Hoy` | Siguiente `›`

#### Grid/Tabla
- **Columna 1 (fija)**: FECHA / HORA
  - Separadores de día: "Lunes 3/11", "Martes 4/11", etc.
  - Franjas horarias: "01:00 – 08:00", "08:00 – 08:30", etc.
- **Columnas 2-N**: Un espacio por columna
  - ESCENARIO, SALA GAYARRE, S.E.P.E, SALA BALLET, SALA ORQUESTA/CORO, OTRAS SALAS

#### Celdas de Actividad
- **Chip de actividad** con:
  - Título (nombre de la actividad)
  - Detalle opcional (horario extendido, notas)
  - Color según tipo de actividad
  - Borde según estado (sólido = confirmada, dashed = provisional)

### 2.2 Comportamiento

| Acción | Resultado |
|--------|-----------|
| Click en `‹` | Carga semana anterior |
| Click en `Hoy` | Navega a semana actual |
| Click en `›` | Carga semana siguiente |
| Click en actividad | Abre dialog de detalle/edición |
| Hover en actividad | Muestra tooltip con info completa |

### 2.3 Transformación de Datos

El backend devuelve actividades planas:
```typescript
interface Actividad {
  id: string;
  titulo: string;
  fecha: string;        // "2025-11-03"
  horaInicio: string;   // "08:00"
  horaFin: string;      // "10:00"
  espacio: { id: number; nombre: string; };
  tipoActividad: { nombre: string; colorHex: string; };
  estado: string;
}
```

El componente transforma a estructura de calendario:
```typescript
interface SemanaCalendario {
  numeroSemana: number;
  fechaInicio: string;
  fechaFin: string;
  estado: 'PROVISIONAL' | 'DEFINITIVA';
  dias: DiaCalendario[];
}

interface DiaCalendario {
  nombre: 'Lunes' | 'Martes' | ...;
  fecha: string;
  franjas: FranjaCalendario[];
}

interface FranjaCalendario {
  horaInicio: string;
  horaFin: string;
  actividadesPorEspacio: Record<number, ActividadCalendario[]>;
}
```

---

## 3. Código de Colores

### 3.1 Tipos de Actividad (según GUIA_ESTILOS_TEATRO.md)

| Tipo | Color | Hex | Ejemplo Visual |
|------|-------|-----|----------------|
| Función | Azul Teatro | `#1E3A5F` | ████ |
| Ensayo Piano | Verde claro | `#C8E6C9` | ████ |
| Ensayo Musical | Rosa | `#FFCDD2` | ████ |
| Montaje | Salmón/Naranja | `#FFE0B2` | ████ |
| Desmontaje | Gris claro | `#EEEEEE` | ████ |
| Evento Externo | Azul claro | `#BBDEFB` | ████ |
| Reserva | Verde menta | `#C8E6C9` | ████ |
| Pausa Técnica | Gris | `#E0E0E0` | ████ |

### 3.2 Estados de Actividad

| Estado | Estilo del Borde |
|--------|------------------|
| PROVISIONAL | `border-style: dashed` |
| CONFIRMADA | `border-style: solid` |
| CANCELADA | `opacity: 0.5; text-decoration: line-through` |

---

## 4. Integración con Backend

### 4.1 Endpoint Principal

```
GET /api/actividades/search?fechaInicio=2025-11-03&fechaFin=2025-11-09
```

**Parámetros opcionales:**
- `temporadaId`: Filtrar por temporada
- `espacioId`: Filtrar por espacio específico
- `tipoActividadId`: Filtrar por tipo

### 4.2 Espacios (columnas)

Los espacios se obtienen de:
```
GET /api/espacios
```

El orden de las columnas sigue el orden devuelto por el backend (configurable por `orden` en la entidad Espacio).

---

## 5. Estilos y Design System

### 5.1 Tokens CSS a Utilizar

```css
/* Colores principales */
--color-primary: #CF102D;        /* Carmesí Teatro Real */
--color-black: #010101;          /* Negro principal */
--color-white: #FFFFFF;

/* Grises para la tabla */
--color-gray-100: #F5F5F5;       /* Fondo filas alternas */
--color-gray-200: #E5E7EB;       /* Bordes de celdas */
--color-gray-800: #1F2937;       /* Texto principal */

/* Badge provisional */
--color-warning-bg: #FDE68A;     /* Fondo badge provisional */
--color-warning-text: #92400E;   /* Texto badge provisional */

/* Tipografía */
--font-family: 'Montserrat', sans-serif;
```

### 5.2 Clases Reutilizables

El componente debe usar las clases del design system cuando sea posible:
- `.btn-circle` para botones de navegación
- `.badge` para estados
- Colores de actividad desde `tipoActividad.colorHex`

---

## 6. Componentes Relacionados

| Componente | Ubicación | Responsabilidad |
|------------|-----------|-----------------|
| `CalendarioComponent` | `features/tempo/calendario/` | Vista principal semanal |
| `WeeklyExcelViewComponent` | `features/tempo/landing/` | Vista alternativa (legacy) |
| `ActividadService` | `features/tempo/services/` | Gestión de datos |
| `EspacioService` | `features/tempo/services/` | Lista de espacios |
| `TemporadaService` | `core/services/` | Temporada activa |

---

## 7. Roadmap de Implementación

### Fase 1: Funcionalidad Básica (Actual)
- [x] Estructura HTML del grid
- [x] Datos mock para validación visual
- [ ] Conexión con ActividadService
- [ ] Conexión con EspacioService
- [ ] Navegación entre semanas funcional

### Fase 2: Interactividad
- [ ] Click en actividad abre dialog de detalle
- [ ] Hover tooltip con información completa
- [ ] Drag & drop para mover actividades (futuro)

### Fase 3: Filtros y Búsqueda
- [ ] Selector de temporada integrado
- [ ] Filtro por tipo de actividad
- [ ] Búsqueda por nombre de evento

---

## 8. Notas Técnicas

### 8.1 Agrupación de Franjas

Las franjas horarias se generan dinámicamente basándose en las horas de inicio/fin únicas de las actividades del día. No se muestran franjas vacías para optimizar espacio.

### 8.2 Responsividad

- **Desktop (>1200px)**: Todas las columnas visibles
- **Tablet (900-1200px)**: Scroll horizontal, columnas reducidas
- **Mobile (<900px)**: Solo 3 espacios visibles, resto con scroll

### 8.3 Performance

- Usar `trackBy` en ngFor para optimizar renderizado
- Computed signals para transformación de datos
- Lazy loading del módulo TEMPO

---

*Documento mantenido por el equipo de desarrollo*
*Última actualización: 2026-02-02*
