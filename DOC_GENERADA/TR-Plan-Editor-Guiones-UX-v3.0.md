# Plan de Editor de Guiones - Document Canvas v3.0
## Teatro Real - Aplicacion Frontend (teatro-real-app)

**Version:** 3.0
**Fecha:** Enero 2026
**Proyecto:** teatro-real-app (Frontend con Supabase)
**Concepto:** Editor tipo Word - "Document Canvas"

---

## 1. Principio de Diseno Fundamental

> **"Si parece un documento, se siente como un documento, pero vive en la nube"**

El objetivo es crear una experiencia de edicion que **emule la familiaridad de Microsoft Word** para minimizar la resistencia al cambio de los usuarios del Teatro Real, mientras los datos se gestionan desde Supabase.

### 1.1 Lo que NO queremos

- Interfaces tipicas de aplicacion web (cards, accordions, chips)
- Modales para cada edicion
- Aspecto de "admin panel" o CRUD
- Separacion visual entre secciones con cards

### 1.2 Lo que SI queremos

- Un lienzo vertical continuo tipo documento
- Aspecto de pagina impresa (fondo blanco, margenes)
- Click directo para editar (inline editing)
- Tablas que se comportan como en Word
- Scroll fluido como documento real

---

## 2. Stack Tecnologico

| Categoria | Tecnologia | Version |
|-----------|------------|---------|
| Framework | React | 18.2.0 |
| Build Tool | Vite | 5.1.4 |
| CSS | TailwindCSS | 3.4.1 |
| Backend/DB | Supabase | 2.86.0 |
| Editor Rico | TipTap | 3.13.0 |
| Drag & Drop | @dnd-kit | 6.3.1 |
| Exportacion | docx | 9.5.1 |

---

## 3. Arquitectura Visual: Document Canvas

### 3.1 Estructura General

```
+------------------------------------------------------------------+
|  TOOLBAR MINIMALISTA (solo iconos esenciales)                    |
|  [< Volver]  CARMEN - Guion Tecnico    [Guardar] [Exportar Word] |
+------------------------------------------------------------------+
|                                                                   |
|  +------------------------------------------------------------+  |
|  |                                                             |  |
|  |                    === PAGINA A4 ===                        |  |
|  |                    (max-width: 210mm)                       |  |
|  |                    (padding: 25mm)                          |  |
|  |                    (fondo blanco)                           |  |
|  |                    (sombra suave)                           |  |
|  |                                                             |  |
|  |  CARMEN                                                     |  |
|  |  Opera en cuatro actos                                      |  |
|  |  GEORGES BIZET                                              |  |
|  |  ---------------------------------------------------------  |  |
|  |  Produccion: Teatro Real                                    |  |
|  |  Director de Escena: Damiano Michieletto                    |  |
|  |  Director Musical: Eun Sun Kim                              |  |
|  |  ---------------------------------------------------------  |  |
|  |                                                             |  |
|  |  PASADA ACTO I                                              |  |
|  |  +--------+----------+----------------------------------+   |  |
|  |  | DPTO   | LUGAR    | DESCRIPCION                     |   |  |
|  |  +--------+----------+----------------------------------+   |  |
|  |  | M.E.   | Varas    | Telon negro de boca V-0...      |   |  |
|  |  | M.E.   | Plataf.  | Rosas 1-4 en posicion...        |   |  |
|  |  | MAQ.   | Escena   | Tableros suelo base...          |   |  |
|  |  +--------+----------+----------------------------------+   |  |
|  |                                                             |  |
|  |  ACTO I                                                     |  |
|  |  ---------------------------------------------------------  |  |
|  |                                                             |  |
|  |  ESCENA: PRELUDE (c. 4')                                    |  |
|  |  +----------+-----+--------+----------------+------------+  |  |
|  |  | PIE      | TOP | DPTO   | QUIEN/QUE      | OBSERV.    |  |  |
|  |  +----------+-----+--------+----------------+------------+  |  |
|  |  | 4/5/4    | E   | F0     | 1 Actriz Madre | Mantilla + |  |  |
|  |  | 4/5/4    |100.5| ELEC.  | MEM. 100 (4")  | 1/2 cuerpo |  |  |
|  |  +----------+-----+--------+----------------+------------+  |  |
|  |                                                             |  |
|  +------------------------------------------------------------+  |
|                                                                   |
+------------------------------------------------------------------+
```

### 3.2 Estilos CSS del Documento

```css
/* Contenedor principal - fondo gris como Word */
.document-viewport {
  background: #e8e8e8;
  min-height: 100vh;
  padding: 40px;
  overflow-y: auto;
}

/* Pagina del documento - simula hoja A4 */
.document-page {
  background: white;
  max-width: 210mm; /* Ancho A4 */
  margin: 0 auto;
  padding: 25mm;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  min-height: 297mm; /* Alto A4 */
  font-family: 'Times New Roman', Times, serif;
  font-size: 11pt;
  line-height: 1.4;
  color: #000;
}

/* Titulos tipo Word */
.document-title {
  font-size: 18pt;
  font-weight: bold;
  text-align: center;
  margin-bottom: 6pt;
}

.document-subtitle {
  font-size: 12pt;
  text-align: center;
  margin-bottom: 12pt;
}

/* Tablas tipo Word */
.word-table {
  width: 100%;
  border-collapse: collapse;
  margin: 12pt 0;
  font-size: 10pt;
}

.word-table th,
.word-table td {
  border: 1px solid #000;
  padding: 4px 6px;
  text-align: left;
  vertical-align: top;
}

.word-table th {
  background: #f0f0f0;
  font-weight: bold;
}

/* Celdas editables */
.editable-cell {
  cursor: text;
  min-height: 1.2em;
  outline: none;
}

.editable-cell:hover {
  background: #fffde7;
}

.editable-cell:focus {
  background: #fff9c4;
  outline: 2px solid #1976d2;
}

/* Titulos de seccion */
.section-title {
  font-size: 14pt;
  font-weight: bold;
  margin-top: 18pt;
  margin-bottom: 6pt;
  border-bottom: 1px solid #000;
  padding-bottom: 3pt;
}

.scene-title {
  font-size: 11pt;
  font-weight: bold;
  margin-top: 12pt;
  margin-bottom: 6pt;
  text-transform: uppercase;
}
```

---

## 4. Componentes React

### 4.1 Jerarquia de Componentes

```
<DocumentEditor>
  ├── <DocumentToolbar />           // Barra superior minimalista
  └── <DocumentViewport>            // Fondo gris, scroll
        └── <DocumentPage>          // Pagina blanca A4
              ├── <HeaderBlock />   // Encabezado del guion
              ├── <PasadaBlock />   // Tabla de pasada
              ├── <ActoBlock>       // Titulo de acto
              │     └── <EscenaBlock>  // Escena con tabla de TOPs
              │           └── <TopsTable>
              │                 └── <EditableRow />
              └── <AddSectionButton /> // Anadir nueva seccion
```

### 4.2 Componente Principal: DocumentEditor

```jsx
function DocumentEditor({ produccionId }) {
  return (
    <div className="document-viewport">
      <DocumentToolbar />
      <div className="document-page">
        <HeaderBlock />

        {actos.map(acto => (
          <ActoBlock key={acto.id} acto={acto}>
            <PasadaBlock pasada={acto.pasada} />

            {acto.escenas.map(escena => (
              <EscenaBlock key={escena.id} escena={escena}>
                <TopsTable elementos={escena.elementos} />
              </EscenaBlock>
            ))}
          </ActoBlock>
        ))}
      </div>
    </div>
  );
}
```

### 4.3 Componente: EditableCell (Click-to-Edit)

```jsx
function EditableCell({ value, onChange, className }) {
  const [editing, setEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const inputRef = useRef(null);

  const handleClick = () => {
    setEditing(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleBlur = () => {
    setEditing(false);
    if (localValue !== value) {
      onChange(localValue);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      inputRef.current?.blur();
    }
    if (e.key === 'Tab') {
      // Navegar a siguiente celda (como Word)
      e.preventDefault();
      handleBlur();
      // Logica para mover a siguiente celda
    }
    if (e.key === 'Escape') {
      setLocalValue(value);
      setEditing(false);
    }
  };

  return (
    <td className={`editable-cell ${className}`} onClick={handleClick}>
      {editing ? (
        <input
          ref={inputRef}
          type="text"
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="w-full border-none bg-transparent outline-none"
        />
      ) : (
        <span>{value || '\u00A0'}</span> // Non-breaking space si vacio
      )}
    </td>
  );
}
```

### 4.4 Componente: TopsTable (Tabla de TOPs)

```jsx
function TopsTable({ elementos, onUpdate, onAdd, onDelete }) {
  return (
    <table className="word-table">
      <thead>
        <tr>
          <th style={{width: '12%'}}>PIE</th>
          <th style={{width: '8%'}}>TOP</th>
          <th style={{width: '10%'}}>DPTO</th>
          <th style={{width: '35%'}}>QUIEN/QUE</th>
          <th style={{width: '35%'}}>OBSERVACIONES</th>
        </tr>
      </thead>
      <tbody>
        {elementos.map((elem, index) => (
          <tr key={elem.id} className="group">
            <EditableCell
              value={elem.pie}
              onChange={(v) => onUpdate(elem.id, 'pie', v)}
            />
            <EditableCell
              value={elem.tipo === 'TOP' ? elem.numero : elem.tipo}
              onChange={(v) => onUpdate(elem.id, 'numero', v)}
              className={elem.tipo === 'TOP' ? 'font-bold text-red-700' : ''}
            />
            <EditableCell
              value={elem.departamento}
              onChange={(v) => onUpdate(elem.id, 'departamento', v)}
            />
            <EditableCell
              value={elem.descripcion}
              onChange={(v) => onUpdate(elem.id, 'descripcion', v)}
            />
            <EditableCell
              value={elem.observaciones}
              onChange={(v) => onUpdate(elem.id, 'observaciones', v)}
            />
          </tr>
        ))}
        {/* Fila para anadir nuevo elemento */}
        <tr className="add-row opacity-50 hover:opacity-100">
          <td colSpan="5" className="text-center text-gray-500 cursor-pointer py-2"
              onClick={onAdd}>
            + Anadir fila (Tab desde ultima celda)
          </td>
        </tr>
      </tbody>
    </table>
  );
}
```

---

## 5. Interacciones Clave (Comportamiento Word)

### 5.1 Atajos de Teclado

| Atajo | Accion | Igual que Word |
|-------|--------|----------------|
| `Tab` | Siguiente celda | Si |
| `Shift+Tab` | Celda anterior | Si |
| `Enter` | Confirmar edicion | Si |
| `Escape` | Cancelar edicion | Si |
| `Ctrl+B` | Negrita | Si |
| `Ctrl+Z` | Deshacer | Si |
| `Ctrl+Y` | Rehacer | Si |
| `Ctrl+S` | Guardar | Si |
| `Ctrl+P` | Imprimir | Si |

### 5.2 Click-to-Edit

```
Estado Normal:              Click:                   Editando:
+------------------+       +------------------+     +------------------+
| Telon negro...   |  -->  | Telon negro...   | --> | [Telon negro...|]|
+------------------+       +------------------+     +------------------+
                           (cursor: text)           (input con focus)
```

### 5.3 Navegacion con Tab (Como Excel/Word)

```
Tab en celda 1 --> Focus en celda 2 --> Focus en celda 3
     |                  |                     |
     v                  v                     v
+----+----+----+   +----+----+----+    +----+----+----+
|[A ]| B  | C  |   | A  |[B ]| C  |    | A  | B  |[C ]|
+----+----+----+   +----+----+----+    +----+----+----+

Tab en ultima celda de fila --> Nueva fila creada automaticamente
```

### 5.4 Hover para Acciones

```
Mouse sobre fila:
+------------------+------------------+------------------+
| contenido        | contenido        | [x] <- delete    |
+------------------+------------------+------------------+
                                       (aparece on hover)
```

---

## 6. Exportacion a Word

### 6.1 Objetivo

Generar un documento .docx que sea **visualmente identico** al editor, para compartir con otros teatros.

### 6.2 Implementacion con docx.js

```javascript
import { Document, Paragraph, Table, TableRow, TableCell, TextRun } from 'docx';

function exportToWord(guion) {
  const doc = new Document({
    sections: [{
      children: [
        // Titulo
        new Paragraph({
          children: [new TextRun({ text: guion.titulo, bold: true, size: 36 })],
          alignment: 'center',
        }),
        // Subtitulo
        new Paragraph({
          children: [new TextRun({ text: guion.subtitulo, size: 24 })],
          alignment: 'center',
        }),
        // Metadatos
        ...generateMetadataTable(guion),
        // Actos
        ...guion.actos.flatMap(acto => generateActoSection(acto)),
      ],
    }],
  });

  return Packer.toBlob(doc);
}
```

---

## 7. Modelo de Datos (Mapeo a Supabase)

### 7.1 Estructura del Guion

```
GUION (tabla: guiones)
├── id, produccion_id, version, estado
│
├── ENCABEZADO (campos directos en guion)
│   ├── titulo, subtitulo, compositor
│   └── director_escena, director_musical
│
└── ACTOS (tabla: actos)
    ├── id, guion_id, nombre, orden
    │
    ├── PASADA (tabla: pasada_items)
    │   └── id, acto_id, departamento, lugar, descripcion, orden
    │
    └── ESCENAS (tabla: escenas)
        ├── id, acto_id, nombre, descripcion, orden
        │
        └── ELEMENTOS (tabla: elementos_guion)
            └── id, escena_id, tipo, pie, numero, departamento,
                descripcion, observaciones, orden
```

### 7.2 Tipos de Elementos

| Tipo | Codigo | Color | Descripcion |
|------|--------|-------|-------------|
| TOP | numero (101, 102...) | Rojo/negrita | Accion tecnica sincronizada |
| Entrada | E | Verde | Entrada de personaje |
| Mutis | M | Ambar | Salida de personaje |
| Interno | INT | Azul | Movimiento interno |
| Aviso | AVI | Purpura | Aviso previo |

---

## 8. Plan de Implementacion

### Fase 1: Document Canvas Basico (3-4 dias)
- [ ] Viewport con fondo gris y pagina blanca centrada
- [ ] Estilos CSS tipo documento Word
- [ ] Header del guion editable
- [ ] Estructura basica de secciones

### Fase 2: Tablas Editables (3-4 dias)
- [ ] Componente EditableCell con click-to-edit
- [ ] Navegacion con Tab entre celdas
- [ ] Tabla de Pasada
- [ ] Tabla de TOPs por escena

### Fase 3: CRUD y Persistencia (2-3 dias)
- [ ] Conexion con Supabase
- [ ] Auto-guardado (debounced)
- [ ] Crear/eliminar filas
- [ ] Crear/eliminar secciones

### Fase 4: Exportacion y Polish (2-3 dias)
- [ ] Exportar a Word (.docx)
- [ ] Atajos de teclado completos
- [ ] Indicador de guardado
- [ ] Optimizacion de rendimiento

---

## 9. Criterios de Exito

| Criterio | Objetivo |
|----------|----------|
| **Familiaridad** | Usuario dice "se parece a Word" en primeros 5 segundos |
| **Edicion** | Click en celda = editar inmediatamente |
| **Navegacion** | Tab funciona exactamente como en Word/Excel |
| **Exportacion** | Documento .docx identico visualmente |
| **Rendimiento** | Sin lag al escribir en celdas |

---

## 10. Diferencias con Version Anterior

| Aspecto | Version Anterior | Version Document Canvas |
|---------|------------------|------------------------|
| Layout | Cards y Accordions | Pagina continua tipo A4 |
| Edicion | Modales y dialogs | Click-to-edit inline |
| Aspecto | Material Design | Documento Word |
| Navegacion | Clicks en botones | Tab entre celdas |
| Tipografia | Sans-serif moderna | Serif (Times New Roman) |
| Fondo | Blanco uniforme | Gris con pagina blanca |

---

*Este documento define el enfoque "Document Canvas" para el editor de guiones del Teatro Real, priorizando la familiaridad con Microsoft Word sobre las convenciones de UI web moderna.*
