# Plan de Diseño UI/UX - Editor de Guiones Técnicos
## Teatro Real - Módulo TOPS

**Versión:** 2.0 (Actualizado)
**Fecha:** 19/01/2026
**Autor:** Equipo de Desarrollo
**Proyecto:** Teatro Real - Gestión Interna

> **Changelog v1 → v2:**
> - Modelo de datos validado con implementación real en Supabase
> - Esquema `teatro_real` con tablas: producciones, guiones, actos, escenas, elementos_guion, pasada_items
> - Prototipo funcional en React como referencia
> - Colores de departamento dinámicos desde BD
> - Sistema de temporadas implementado
> - Estructura jerárquica: Producción → Guión → Actos → Escenas → Elementos

---

## 1. Resumen Ejecutivo

Este documento presenta el plan de diseño para el **Editor de Guiones Técnicos** del módulo TOPS, basado en una implementación validada con datos reales de la ópera "Carmen".

### Objetivo Principal
Diseñar una interfaz que permita a los usuarios del Teatro Real editar guiones técnicos con la misma fluidez y familiaridad que tienen actualmente con Microsoft Word, eliminando la resistencia al cambio y garantizando la adopción del nuevo sistema.

### Principio de Diseño Clave
> "Si parece un documento, se siente como un documento, pero vive en la nube"

### Stack Tecnológico Destino
| Capa | Tecnología |
|------|------------|
| **Frontend** | Angular 18.2 + TypeScript 5.5 |
| **UI Framework** | Angular Material 18 + TailwindCSS 3.4 |
| **Backend** | Spring Boot 2.7.18 + Java 8 |
| **Base de Datos** | PostgreSQL 16 (esquema `teatro_real`) |
| **Estado** | Angular Signals |

### Referencia de Implementación
Se ha validado el modelo con un prototipo en React + Supabase que sirve como referencia funcional.

---

## 2. Modelo de Datos Validado

### 2.1 Diagrama Entidad-Relación

```
┌─────────────────┐
│  producciones   │
├─────────────────┤
│ id (UUID) PK    │
│ nombre          │
│ compositor      │
│ temporada       │
│ compania        │
│ director_escena │
│ director_musical│
└────────┬────────┘
         │ 1:N
         ▼
┌─────────────────┐
│    guiones      │
├─────────────────┤
│ id (UUID) PK    │
│ produccion_id FK│
│ nombre          │
│ version         │
│ estado          │
└────────┬────────┘
         │ 1:N
         ▼
┌─────────────────┐
│     actos       │
├─────────────────┤
│ id (UUID) PK    │
│ guion_id FK     │
│ nombre          │
│ numero          │
│ orden           │
│ duracion        │
└────────┬────────┘
         │
    ┌────┴────┐
    │ 1:N     │ 1:N
    ▼         ▼
┌─────────┐ ┌──────────────┐
│ escenas │ │ pasada_items │
├─────────┤ ├──────────────┤
│ id      │ │ id           │
│ acto_id │ │ acto_id      │
│ numero  │ │ departamento │
│ nombre  │ │ lugar        │
│ orden   │ │ descripcion  │
└────┬────┘ │ imagen       │
     │ 1:N  │ orden        │
     ▼      └──────────────┘
┌──────────────────┐
│ elementos_guion  │
├──────────────────┤
│ id               │
│ escena_id        │
│ tipo             │
│ numero           │
│ ref_pagina       │
│ descripcion      │
│ observaciones    │
│ imagen           │
│ criticidad       │
│ orden            │
└──────────────────┘
```

### 2.2 Tablas SQL (PostgreSQL)

#### Tabla: `teatro_real.producciones`
```sql
CREATE TABLE teatro_real.producciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(255) NOT NULL,
    compositor VARCHAR(255),
    temporada VARCHAR(20) NOT NULL,  -- "2025-2026"
    compania VARCHAR(255),
    director_escena VARCHAR(255),
    director_musical VARCHAR(255),
    imagen_portada TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Tabla: `teatro_real.guiones`
```sql
CREATE TABLE teatro_real.guiones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    produccion_id UUID REFERENCES teatro_real.producciones(id) ON DELETE CASCADE,
    nombre VARCHAR(255) NOT NULL,
    version INTEGER DEFAULT 1,
    estado VARCHAR(20) DEFAULT 'BORRADOR',  -- BORRADOR, EN_REVISION, FINAL
    responsable_edicion VARCHAR(255),
    locked_by UUID,
    locked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Tabla: `teatro_real.actos`
```sql
CREATE TABLE teatro_real.actos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guion_id UUID REFERENCES teatro_real.guiones(id) ON DELETE CASCADE,
    nombre VARCHAR(100) NOT NULL,  -- "Acto I", "Acto II"
    numero INTEGER NOT NULL,
    orden INTEGER NOT NULL,
    duracion VARCHAR(20),  -- "55'"
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Tabla: `teatro_real.escenas`
```sql
CREATE TABLE teatro_real.escenas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    acto_id UUID REFERENCES teatro_real.actos(id) ON DELETE CASCADE,
    numero INTEGER NOT NULL,
    nombre VARCHAR(500) NOT NULL,  -- 'N°1: INTRODUCTION "SUR LA PLACE..."'
    orden INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Tabla: `teatro_real.elementos_guion`
```sql
CREATE TABLE teatro_real.elementos_guion (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    escena_id UUID REFERENCES teatro_real.escenas(id) ON DELETE CASCADE,
    tipo VARCHAR(20) NOT NULL,  -- TOP, ENTRADA, MUTIS, INTERNO, AVISO
    numero VARCHAR(20) NOT NULL,
    ref_pagina VARCHAR(50),      -- "6/1/1"
    ref_compas VARCHAR(50),
    ref_timecode VARCHAR(20),
    descripcion TEXT,
    observaciones TEXT,
    imagen TEXT,
    criticidad VARCHAR(20) DEFAULT 'normal',
    orden INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Tabla: `teatro_real.pasada_items`
```sql
CREATE TABLE teatro_real.pasada_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    acto_id UUID REFERENCES teatro_real.actos(id) ON DELETE CASCADE,
    departamento VARCHAR(50) NOT NULL,  -- ME, MAQ, UTIL, ELEC, AV
    lugar VARCHAR(255),
    descripcion TEXT,
    imagen TEXT,
    orden INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Tabla: `teatro_real.colores_departamento`
```sql
CREATE TABLE teatro_real.colores_departamento (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo VARCHAR(20) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    color_fondo VARCHAR(7) NOT NULL,
    color_texto VARCHAR(7) NOT NULL,
    orden INTEGER DEFAULT 0,
    activo BOOLEAN DEFAULT TRUE
);

-- Datos iniciales
INSERT INTO teatro_real.colores_departamento (codigo, nombre, color_fondo, color_texto, orden) VALUES
('ME', 'Maquinaria Escénica', '#1E40AF', '#FFFFFF', 1),
('MAQ', 'Maquinaria', '#7C3AED', '#FFFFFF', 2),
('UTIL', 'Utilería', '#059669', '#FFFFFF', 3),
('ELEC', 'Electricidad', '#DC2626', '#FFFFFF', 4),
('AV', 'Audiovisuales', '#D97706', '#FFFFFF', 5),
('SAST', 'Sastrería', '#DB2777', '#FFFFFF', 6),
('ESCENA', 'Escena', '#0891B2', '#FFFFFF', 7),
('PLATAF', 'Plataformas', '#4F46E5', '#FFFFFF', 8),
('FOSOS', 'Fosos', '#6366F1', '#FFFFFF', 9);
```

---

## 3. Estructura del Guión (Ejemplo: Carmen)

### 3.1 Jerarquía de Datos Real

```
PRODUCCIÓN: Carmen
└── GUIÓN: Guión de Regiduria v1
    ├── ACTO I (c. 55')
    │   ├── PASADA ACTO I
    │   │   ├── ME - VARAS: "TELÓN NEGRO DE BOCA V-0..."
    │   │   ├── PLATAF - VERDES: "ROSAS 1-4 EN POSICIÓN..."
    │   │   ├── FOSOS: "FOSO ORQUESTA MEDIANO..."
    │   │   ├── ESCENA: "TABLEROS SUELO BASE..."
    │   │   ├── UTIL - LADO C: "MESA LADO CARLOS..."
    │   │   └── ELEC - SALA: "CANAL 900 + PASILLOS..."
    │   │
    │   ├── N°1: INTRODUCTION (C. 6')
    │   │   ├── TOP 104: "FADE OUT CAÑÓN MADRE..." [6/5/2]
    │   │   ├── TOP 106: "MORALES SALE COMISARÍA" [11/1/3]
    │   │   └── ENTRADA E: "MICAELA entra" [14/4/2]
    │   │
    │   ├── N°2: MARCHE ET CHOEUR (C. 3')
    │   ├── N°3: CHŒUR ET SCÈNE (C. 6')
    │   ├── N°4: HABANERA (C. 5')
    │   ├── N°5: SCÈNE (C. 2')
    │   ├── N°6: RÉCITATIF ET DUO (C. 10')
    │   ├── N°7: CHŒUR (C. 3')
    │   ├── N°8: RÉCITATIF, CHANSON (C. 3')
    │   ├── N°9: RÉCITATIF, CHANSON ET DUO (C. 5')
    │   └── N°10: FINAL (C. 3')
    │
    ├── ACTO II - 7 escenas (N°11 - N°17)
    ├── ACTO III - 6 escenas (N°18 - N°23)
    └── ACTO IV - 2 escenas (N°24 - N°25)
```

### 3.2 Tipos de Elementos

| Tipo | Código | Descripción | Color |
|------|--------|-------------|-------|
| **TOP** | 101, 102... | Acción técnica numerada | Azul |
| **ENTRADA** | E | Entrada de personaje | Verde |
| **MUTIS** | M | Salida de personaje | Rojo |
| **INTERNO** | I | Acción interna | Amarillo |
| **AVISO** | A | Aviso preventivo | Naranja |

---

## 4. Diseño de Interfaz

### 4.1 Vista Principal del Editor

```
┌──────────────────────────────────────────────────────────────────────────┐
│  [←] CARMEN - Guión de Regiduria          Temporada: [2025-2026 ▼]       │
│  ─────────────────────────────────────────────────────────────────────── │
│  [Exportar Word] [Filtrar ▼]                            [Guardar]        │
├──────────────┬───────────────────────────────────────────────────────────┤
│              │                                                           │
│  ESTRUCTURA  │   ┌─────────────────────────────────────────────────┐     │
│              │   │  CARMEN                                         │     │
│  ▼ Acto I    │   │  Georges Bizet                                  │     │
│    • Pasada  │   │  Temporada: 2025-2026                           │     │
│    • N°1     │   │  Dir. Escena: D. Michieletto                    │     │
│    • N°2     │   │  Dir. Musical: Eun Sun Kim                      │     │
│    ...       │   └─────────────────────────────────────────────────┘     │
│  ▶ Acto II   │                                                           │
│  ▶ Acto III  │   ┌─────────────────────────────────────────────────┐     │
│  ▶ Acto IV   │   │  PASADA ACTO I                                  │     │
│              │   ├─────────────────────────────────────────────────┤     │
│  ───────────-│   │ DPTO   │ LUGAR  │ DESCRIPCIÓN                   │     │
│              │   ├────────┼────────┼──────────────────────────────-┤     │
│  COLORES     │   │ ME     │ VARAS  │ TELÓN NEGRO DE BOCA V-0...    │     │
│  ● ME  Azul  │   │ PLATAF │ VERDES │ ROSAS 1-4 EN POSICIÓN...      │     │
│  ● UTIL Verde│   │ ESCENA │        │ TABLEROS SUELO BASE...        │     │
│  ● ELEC Rojo │   └─────────────────────────────────────────────────┘     │
│              │                                                           │
│              │   ┌─────────────────────────────────────────────────┐     │
│              │   │  N°1: INTRODUCTION "SUR LA PLACE..." (C. 6')   │     │
│              │   ├─────────────────────────────────────────────────┤     │
│              │   │ PIE    │ TOP │ DESCRIPCIÓN          │ OBSERV.  │     │
│              │   ├────────┼─────┼──────────────────────┼──────────┤     │
│              │   │ 6/5/2  │ 104 │ FADE OUT CAÑÓN MADRE │          │     │
│              │   │ 11/1/3 │ 106 │ MORALES SALE...      │          │     │
│              │   │ 14/4/2 │ E   │ MICAELA entra        │ CARTA... │     │
│              │   └─────────────────────────────────────────────────┘     │
└──────────────┴───────────────────────────────────────────────────────────┘
```

### 4.2 Componentes del Layout

#### A) Header con Info de Producción
- Nombre de la obra + compositor
- Temporada (selector)
- Director de escena y musical
- Botones: Guardar, Exportar Word

#### B) Sidebar - Navegación
- Árbol colapsable: Actos → Escenas
- Click para navegar a sección
- Leyenda de colores por departamento

#### C) Canvas - Contenido Principal
- Bloques de PASADA por acto
- Bloques de ESCENA con tabla de elementos
- Edición inline (click para editar)

---

## 5. Arquitectura Angular

### 5.1 Estructura de Archivos

```
src/app/features/tops/
├── tops.routes.ts
├── services/
│   ├── produccion.service.ts
│   ├── guion.service.ts
│   ├── acto.service.ts
│   ├── escena.service.ts
│   ├── elemento.service.ts
│   ├── pasada.service.ts
│   └── colores-departamento.service.ts
├── models/
│   ├── produccion.model.ts
│   ├── guion.model.ts
│   ├── acto.model.ts
│   ├── escena.model.ts
│   ├── elemento-guion.model.ts
│   ├── pasada-item.model.ts
│   └── color-departamento.model.ts
├── state/
│   └── tops.store.ts
├── pages/
│   ├── guiones-list/
│   └── guion-editor/
└── components/
    ├── toolbar/
    ├── sidebar/
    ├── canvas/
    │   ├── header-produccion/
    │   ├── acto-section/
    │   ├── escena-block/
    │   ├── pasada-table/
    │   └── elementos-table/
    └── shared/
        └── inline-edit/
```

### 5.2 Modelos TypeScript

```typescript
// produccion.model.ts
export interface Produccion {
  id: string;
  nombre: string;
  compositor?: string;
  temporada: string;
  compania?: string;
  directorEscena?: string;
  directorMusical?: string;
}

// guion.model.ts
export interface Guion {
  id: string;
  produccionId: string;
  produccion?: Produccion;
  nombre: string;
  version: number;
  estado: 'BORRADOR' | 'EN_REVISION' | 'FINAL';
  actos?: Acto[];
}

// acto.model.ts
export interface Acto {
  id: string;
  guionId: string;
  nombre: string;
  numero: number;
  orden: number;
  duracion?: string;
  escenas?: Escena[];
  pasadaItems?: PasadaItem[];
}

// escena.model.ts
export interface Escena {
  id: string;
  actoId: string;
  numero: number;
  nombre: string;
  orden: number;
  elementos?: ElementoGuion[];
}

// elemento-guion.model.ts
export type TipoElemento = 'TOP' | 'ENTRADA' | 'MUTIS' | 'INTERNO' | 'AVISO';

export interface ElementoGuion {
  id: string;
  escenaId: string;
  tipo: TipoElemento;
  numero: string;
  refPagina?: string;
  descripcion?: string;
  observaciones?: string;
  imagen?: string;
  criticidad: 'normal' | 'alta' | 'critica';
  orden: number;
}

// pasada-item.model.ts
export interface PasadaItem {
  id: string;
  actoId: string;
  departamento: string;
  lugar?: string;
  descripcion?: string;
  imagen?: string;
  orden: number;
}

// color-departamento.model.ts
export interface ColorDepartamento {
  id: string;
  codigo: string;
  nombre: string;
  colorFondo: string;
  colorTexto: string;
  orden: number;
  activo: boolean;
}
```

### 5.3 Estado con Signals

```typescript
// state/tops.store.ts
@Injectable({ providedIn: 'root' })
export class TopsStore {
  // Estado principal
  private guionSignal = signal<Guion | null>(null);
  private actosSignal = signal<Acto[]>([]);
  private coloresSignal = signal<ColorDepartamento[]>([]);
  private loadingSignal = signal<boolean>(false);

  // Estado UI
  private selectedActoSignal = signal<string | null>(null);
  private collapsedActosSignal = signal<Set<string>>(new Set());

  // Lecturas públicas
  guion = this.guionSignal.asReadonly();
  actos = this.actosSignal.asReadonly();
  colores = this.coloresSignal.asReadonly();
  loading = this.loadingSignal.asReadonly();

  // Computed
  coloresPorCodigo = computed(() => {
    const map = new Map<string, ColorDepartamento>();
    this.coloresSignal().forEach(c => map.set(c.codigo, c));
    return map;
  });

  // Actions
  setGuion(guion: Guion) { this.guionSignal.set(guion); }
  setActos(actos: Acto[]) { this.actosSignal.set(actos); }
  setColores(colores: ColorDepartamento[]) { this.coloresSignal.set(colores); }

  toggleActoCollapsed(actoId: string) {
    this.collapsedActosSignal.update(set => {
      const newSet = new Set(set);
      newSet.has(actoId) ? newSet.delete(actoId) : newSet.add(actoId);
      return newSet;
    });
  }
}
```

---

## 6. API REST Backend

### 6.1 Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/producciones` | Listar producciones |
| GET | `/api/producciones/{id}` | Detalle producción |
| GET | `/api/guiones` | Listar guiones |
| GET | `/api/guiones/{id}/full` | Guión completo con actos, escenas, elementos |
| POST | `/api/guiones/{id}/lock` | Bloquear para edición |
| POST | `/api/guiones/{id}/unlock` | Desbloquear |
| GET | `/api/guiones/{id}/export/word` | Exportar a Word |
| GET | `/api/actos/{actoId}/escenas` | Escenas de un acto |
| GET | `/api/actos/{actoId}/pasada-items` | Pasada items de un acto |
| GET | `/api/escenas/{escenaId}/elementos` | Elementos de una escena |
| POST | `/api/escenas/{escenaId}/elementos` | Crear elemento |
| PUT | `/api/elementos/{id}` | Actualizar elemento |
| DELETE | `/api/elementos/{id}` | Eliminar elemento |
| PATCH | `/api/elementos/reorder` | Reordenar elementos |
| GET | `/api/config/colores-departamento` | Colores configurados |

### 6.2 Response: GET /api/guiones/{id}/full

```json
{
  "id": "uuid",
  "nombre": "Guión de Regiduria",
  "version": 1,
  "estado": "BORRADOR",
  "produccion": {
    "nombre": "Carmen",
    "compositor": "Georges Bizet",
    "temporada": "2025-2026",
    "directorEscena": "Damiano Michieletto"
  },
  "actos": [
    {
      "id": "uuid",
      "nombre": "Acto I",
      "numero": 1,
      "duracion": "55'",
      "pasadaItems": [
        {
          "departamento": "ME",
          "lugar": "VARAS",
          "descripcion": "TELÓN NEGRO DE BOCA V-0..."
        }
      ],
      "escenas": [
        {
          "numero": 1,
          "nombre": "N°1: INTRODUCTION...",
          "elementos": [
            {
              "tipo": "TOP",
              "numero": "104",
              "refPagina": "6/5/2",
              "descripcion": "FADE OUT CAÑÓN MADRE"
            }
          ]
        }
      ]
    }
  ]
}
```

---

## 7. Funcionalidades

### 7.1 Edición Inline
- Click en celda para editar
- Tab para siguiente celda
- Enter para guardar
- Escape para cancelar

### 7.2 Drag & Drop
- Reordenar elementos dentro de escena
- Reordenar escenas dentro de acto
- CDK DragDropModule

### 7.3 Auto-guardado
```typescript
// Debounce 2 segundos después de cada cambio
changes$.pipe(
  debounceTime(2000),
  switchMap(changes => this.guionService.update(id, changes))
).subscribe();
```

### 7.4 Filtros por Departamento
```html
<mat-chip-listbox multiple>
  <mat-chip-option *ngFor="let dpto of departamentos"
                   [selected]="filtrosDpto.has(dpto.codigo)"
                   (click)="toggleFiltro(dpto.codigo)">
    {{ dpto.nombre }}
  </mat-chip-option>
</mat-chip-listbox>
```

### 7.5 Exportar a Word
- Backend genera .docx con Apache POI
- Mismo formato visual que editor
- Incluye imágenes embebidas

---

## 8. Plan de Implementación

### Sprint 1: Backend Base
- [ ] Crear esquema `teatro_real` en PostgreSQL
- [ ] Entidades JPA
- [ ] Repositorios Spring Data
- [ ] Controllers REST básicos

### Sprint 2: Frontend Estructura
- [ ] Módulo TOPS con routing
- [ ] Servicios Angular
- [ ] TopsStore con signals
- [ ] Componentes base

### Sprint 3: Editor MVP
- [ ] Visualización de guión completo
- [ ] Tablas de pasada y elementos
- [ ] Edición inline básica
- [ ] Guardado manual

### Sprint 4: Editor Avanzado
- [ ] Drag & drop
- [ ] Auto-guardado
- [ ] Filtros
- [ ] Colores configurables

### Sprint 5: Colaboración y Export
- [ ] Bloqueo de edición
- [ ] Exportar a Word
- [ ] Historial de cambios

---

## 9. Datos de Prueba

### Carmen - Resumen
| Métrica | Valor |
|---------|-------|
| Actos | 4 |
| Escenas totales | 25 |
| Elementos por escena | 5-15 aprox |
| Pasada items por acto | 8-12 aprox |
| Departamentos | 9 |

### Escenas por Acto
- **Acto I**: 10 escenas (N°1 - N°10)
- **Acto II**: 7 escenas (N°11 - N°17)
- **Acto III**: 6 escenas (N°18 - N°23)
- **Acto IV**: 2 escenas (N°24 - N°25)

---

## 10. Referencias

### Prototipo Funcional
- **Ubicación**: `teatro-real-app/src/pages/dashboard/guiones-new.jsx`
- **Stack**: React + Vite + Supabase
- **Estado**: Funcional con datos de Carmen

### Scripts SQL
- **Carga de datos**: `scripts/update-guion.sql`
- **Limpieza duplicados**: `scripts/cleanup-duplicados.sql`

### Base de Datos
- **Proyecto Supabase**: Teatro Real
- **Schema**: `teatro_real`
- **Tablas**: producciones, guiones, actos, escenas, elementos_guion, pasada_items, colores_departamento

---

*Documento actualizado el 19/01/2026*
*Basado en implementación validada con datos reales de Carmen*
