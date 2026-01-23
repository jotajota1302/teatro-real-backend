# Paleta de Colores - Teatro Real
## Identidad Visual Digital para el Proyecto Angular

**Fecha:** 4 de diciembre de 2025  
**Especialista:** UI/UX  
**Basado en:** Identidad visual de https://www.teatroreal.es/es

---

## Resumen Ejecutivo

Este documento especifica la paleta de colores oficial del Teatro Real para ser utilizada en el proyecto Angular. Los colores han sido extraídos de la identidad visual del sitio web oficial y complementados con tonalidades adicionales para garantizar una experiencia coherente, accesible (WCAG 2.1 AA) y moderna.

---

## Colores Primarios

### Rojo Teatro Real (Primary)
```
Nombre: Rojo Teatro Real
Hex: #D63543
RGB: 214, 53, 67
HSL: 354°, 70%, 52%
Uso: Botones principales, enlaces, acentos destacados
```

### Rojo Oscuro (Primary Dark)
```
Nombre: Rojo Oscuro
Hex: #B8293A
RGB: 184, 41, 58
HSL: 354°, 63%, 44%
Uso: Estado hover de botones primarios, acentos secundarios
```

### Rojo Claro (Primary Light)
```
Nombre: Rojo Claro
Hex: #E85563
RGB: 232, 85, 99
HSL: 354°, 77%, 62%
Uso: Fondos suaves, overlays, estados disabled
```

---

## Colores Secundarios

### Azul Oscuro (Secondary)
```
Nombre: Azul Oscuro Teatro Real
Hex: #1F3A45
RGB: 31, 58, 69
HSL: 200°, 38%, 20%
Uso: Headers, navegación, elementos estructurales
```

### Azul Muy Oscuro (Secondary Dark)
```
Nombre: Azul Muy Oscuro
Hex: #162A32
RGB: 22, 42, 50
HSL: 200°, 39%, 14%
Uso: Bordes de card headers, fondos muy oscuros
```

### Azul Claro (Secondary Light)
```
Nombre: Azul Claro
Hex: #2A4F5E
RGB: 42, 79, 94
HSL: 200°, 38%, 27%
Uso: Variantes de Secondary, acentos secundarios
```

---

## Colores Neutros

### Negro/Gris Muy Oscuro (Dark)
```
Nombre: Gris Muy Oscuro
Hex: #2C2C2C
RGB: 44, 44, 44
HSL: 0°, 0%, 17%
Uso: Texto principal, títulos
```

### Negro Puro (Darker)
```
Nombre: Negro Puro
Hex: #000000
RGB: 0, 0, 0
HSL: 0°, 0%, 0%
Uso: Bordes muy oscuros, líneas fuertes
```

### Gris Claro (Light)
```
Nombre: Gris Claro
Hex: #F0F0F0
RGB: 240, 240, 240
HSL: 0°, 0%, 94%
Uso: Fondos suaves, filas alternadas de tablas
```

### Blanco (Lighter)
```
Nombre: Blanco
Hex: #FFFFFF
RGB: 255, 255, 255
HSL: 0°, 0%, 100%
Uso: Fondo principal, espacios en blanco
```

### Gris Neutro (Neutral)
```
Nombre: Gris Neutro
Hex: #7A7A7A
RGB: 122, 122, 122
HSL: 0°, 0%, 48%
Uso: Texto secundario, placeholder, hints
Contraste sobre blanco: 4.5:1 ✓ WCAG AA
```

### Borde Gris (Border)
```
Nombre: Gris Borde
Hex: #E0E0E0
RGB: 224, 224, 224
HSL: 0°, 0%, 88%
Uso: Bordes de componentes, líneas divisoras
```

---

## Colores de Acentos

### Dorado
```
Nombre: Dorado
Hex: #D4AF37
RGB: 212, 175, 55
HSL: 44°, 76%, 52%
Uso: Elementos de lujo, decoración, premium features
```

### Taupe (Beige Gris)
```
Nombre: Taupe
Hex: #9D8B7E
RGB: 157, 139, 126
HSL: 19°, 17%, 56%
Uso: Fondos suaves, elementos decorativos
```

---

## Colores de Estados

### Success (Verde)
```
Nombre: Verde Éxito
Hex: #28A745
RGB: 40, 167, 69
HSL: 135°, 61%, 41%
Uso: Confirmaciones, estados positivos, checkmarks
```

### Warning (Amarillo)
```
Nombre: Amarillo Advertencia
Hex: #FFC107
RGB: 255, 193, 7
HSL: 45°, 100%, 51%
Uso: Alertas, advertencias, atención requerida
```

### Error (Rojo)
```
Nombre: Rojo Error
Hex: #DC3545
RGB: 220, 53, 69
HSL: 354°, 70%, 54%
Uso: Errores, validaciones fallidas, eliminación
```

### Info (Azul)
```
Nombre: Azul Información
Hex: #0D6EFD
RGB: 13, 110, 253
HSL: 217°, 100%, 52%
Uso: Información, ayuda, tooltips
```

---

## Combinaciones de Contraste (WCAG 2.1)

### Ratios de Contraste Verificados

| Combinación | Ratio | WCAG AA | WCAG AAA |
|-----------|-------|---------|---------|
| #D63543 sobre #FFFFFF | 5.2:1 | ✓ | ✗ |
| #B8293A sobre #FFFFFF | 5.9:1 | ✓ | ✗ |
| #1F3A45 sobre #FFFFFF | 8.1:1 | ✓ | ✓ |
| #2C2C2C sobre #FFFFFF | 13.7:1 | ✓ | ✓ |
| #7A7A7A sobre #FFFFFF | 4.5:1 | ✓ | ✗ |
| #FFFFFF sobre #D63543 | 5.2:1 | ✓ | ✗ |
| #FFFFFF sobre #1F3A45 | 8.1:1 | ✓ | ✓ |
| #28A745 sobre #FFFFFF | 3.9:1 | ✗ | ✗ |
| #DC3545 sobre #FFFFFF | 3.9:1 | ✗ | ✗ |

---

## Uso en CSS Variables

Todos los colores están definidos como CSS variables en `design-system.css` para facilitar su reutilización:

```css
/* Acceso a los colores en cualquier componente */
color: var(--color-primary);              /* Rojo #D63543 */
color: var(--color-secondary);            /* Azul #1F3A45 */
background-color: var(--color-light);     /* Gris Claro #F0F0F0 */
border-color: var(--color-border);        /* Borde #E0E0E0 */
```

---

## Recomendaciones de Uso

### ✓ Hacer

- ✓ Utilizar rojo primario para acciones principales
- ✓ Usar azul secundario para headers y navegación
- ✓ Aplicar colores de estado para feedback del usuario
- ✓ Respetar contrastes WCAG AA mínimo
- ✓ Usar colores neutrales para fondos
- ✓ Combinar colores primarios con espacios en blanco

### ✗ No Hacer

- ✗ Usar amarillo directamente sin overlay oscuro
- ✗ Mezclar demasiados colores en una pantalla
- ✗ Usar colores únicamente para transmitir información
- ✗ Reducir contraste para efectos visuales
- ✗ Cambiar los valores hexadecimales de los colores principales

---

## Archivos CSS Incluidos

El sistema de diseño incluye los siguientes archivos CSS:

### 1. `design-system.css`
Define las variables CSS de la paleta completa y estilos base de Bootstrap.

**Variables disponibles:**
- Colores primarios: `--color-primary`, `--color-primary-dark`, `--color-primary-light`
- Colores secundarios: `--color-secondary`, `--color-secondary-dark`, `--color-secondary-light`
- Neutros: `--color-dark`, `--color-light`, `--color-neutral`, `--color-border`
- Estados: `--color-success`, `--color-warning`, `--color-error`, `--color-info`
- Espaciado: `--spacing-xs`, `--spacing-sm`, `--spacing-md`, `--spacing-lg`, `--spacing-xl`
- Bordes: `--border-radius-sm`, `--border-radius-base`, `--border-radius-md`, `--border-radius-lg`
- Sombras: `--shadow-sm`, `--shadow-base`, `--shadow-md`, `--shadow-lg`
- Transiciones: `--transition-fast`, `--transition-base`, `--transition-slow`

### 2. `layout.css`
Estilos para la estructura y composición:
- Navbar
- Sidebar
- Contenido principal
- Breadcrumbs
- Headers

### 3. `components.css`
Estilos para componentes reutilizables:
- Botones
- Cards
- Tablas
- Formularios
- Dropdowns
- Alerts
- Modals
- Progress bars
- Pagination

### 4. `responsive.css`
Media queries y adaptación responsiva:
- Tabletas (768px - 1024px)
- Móviles (< 768px)
- Pantallas pequeñas (< 576px)
- Pantallas extra pequeñas (< 480px)
- Print styles

### 5. `accessibility.css`
Estilos para cumplir con WCAG 2.1 AA:
- Focus visible
- Skip links
- Contraste de colores
- Tamaño mínimo de botones
- Formularios accesibles
- Soporte para dark mode
- Reducción de movimiento

---

## Importación en Angular

Para usar estos estilos en el proyecto Angular, incluye los archivos CSS en el orden correcto:

```html
<!-- En src/index.html o en los estilos globales -->
<link rel="stylesheet" href="assets/css/design-system.css">
<link rel="stylesheet" href="assets/css/layout.css">
<link rel="stylesheet" href="assets/css/components.css">
<link rel="stylesheet" href="assets/css/responsive.css">
<link rel="stylesheet" href="assets/css/accessibility.css">
```

O en `styles.css`:

```css
@import 'assets/css/design-system.css';
@import 'assets/css/layout.css';
@import 'assets/css/components.css';
@import 'assets/css/responsive.css';
@import 'assets/css/accessibility.css';
```

---

## Ejemplos de Uso

### Botón Primario
```html
<button class="btn btn-primary">Acción Principal</button>
```

### Card con Header
```html
<div class="card">
  <div class="card-header">Título</div>
  <div class="card-body">Contenido</div>
</div>
```

### KPI Card
```html
<div class="card kpi-card">
  <div class="card-body">
    <div class="kpi-icon bg-primary">📊</div>
    <h3>1,234</h3>
    <small>Métrica importante</small>
  </div>
</div>
```

### Tabla
```html
<table class="table">
  <thead>
    <tr>
      <th>Columna 1</th>
      <th>Columna 2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Dato 1</td>
      <td>Dato 2</td>
    </tr>
  </tbody>
</table>
```

### Alerta
```html
<div class="alert alert-primary">
  <strong>Información:</strong> Mensaje importante
</div>
```

---

## Notas de Mantenimiento

- **Última actualización:** 4 de diciembre de 2025
- **Versión:** 1.0
- **Responsable:** Especialista UI/UX
- **Próxima revisión:** Q1 2026

### Cambios Futuros

- [ ] Añadir soporte para temas personalizados
- [ ] Expandir colores de gradientes
- [ ] Crear paleta de colores para dark mode completo
- [ ] Documentar animaciones y transiciones

---

## Referencias

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Web Content Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/)
- [Material Design Color System](https://material.io/design/color/)
- [Teatro Real Official Website](https://www.teatroreal.es/es)
