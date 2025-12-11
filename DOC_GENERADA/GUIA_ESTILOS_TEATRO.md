# Guía de Estilos - MVP Teatro Real

## Fuentes de Referencia

Esta guía ha sido extraída del análisis de:
- Web oficial del Teatro Real (teatroreal.es)
- Brandfetch - Activos de marca
- Brandemia - Análisis del rebranding 2018

---

## 1. Paleta de Colores

### Colores Principales

| Nombre | Hex | RGB | Uso |
|--------|-----|-----|-----|
| **Negro Principal** | `#010101` | rgb(1, 1, 1) | Fondos, textos principales |
| **Carmesí Teatro Real** | `#CF102D` | rgb(207, 16, 45) | Acento principal, CTAs, highlights |
| **Blanco** | `#FFFFFF` | rgb(255, 255, 255) | Textos sobre fondo oscuro, fondos claros |

### Colores Secundarios / UI

| Nombre | Hex | RGB | Uso |
|--------|-----|-----|-----|
| **Negro Carbón** | `#232323` | rgb(35, 35, 35) | Footers, fondos secundarios |
| **Negro Suave** | `#080808` | rgb(8, 8, 8) | Banners, overlays |
| **Negro Transparente** | `#000000D6` | rgba(0,0,0,0.84) | Modales, overlays con transparencia |
| **Gris Oscuro** | `#333333` | rgb(51, 51, 51) | Textos secundarios |
| **Gris Medio** | `#666666` | rgb(102, 102, 102) | Textos deshabilitados, placeholders |
| **Gris Claro** | `#F5F5F5` | rgb(245, 245, 245) | Fondos de secciones alternas |

### Paleta Extendida para TEMPO (Código de Colores de Actividades)

Basado en los requisitos del sistema TEMPO:

| Actividad | Color Sugerido | Hex |
|-----------|----------------|-----|
| Función | Azul Teatro | `#1E3A5F` |
| Ensayo | Verde | `#2E7D32` |
| Montaje | Salmón | `#E57373` |
| Pauta Técnica | Gris | `#757575` |
| Evento | Rosa Oscuro | `#AD1457` |
| Nocturnas | Naranja | `#EF6C00` |
| Visitas | Morado | `#7B1FA2` |
| Cargas/Descargas | Amarillo | `#F9A825` |
| Escenario | Blanco/Claro | `#FAFAFA` |
| Cursos | Rosa | `#EC407A` |
| Rueda Prensa | Rojo | `#C62828` |
| Flamenco Real | Morado Claro | `#9C27B0` |

---

## 2. Tipografía

### Tipografía Principal

**Gotham** (Hoefler&Co)
- Familia: Sans-serif geométrica
- Uso: Logotipo, títulos principales, headlines
- Pesos recomendados: Medium, Bold, Black

```css
/* Si se tiene licencia */
font-family: 'Gotham', 'Montserrat', sans-serif;
```

### Alternativa Web (Google Fonts)

**Montserrat** - Alternativa gratuita muy similar a Gotham
- URL: https://fonts.google.com/specimen/Montserrat
- Pesos recomendados: 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)

```css
/* Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap');

font-family: 'Montserrat', sans-serif;
```

### Jerarquía Tipográfica

| Elemento | Tamaño | Peso | Line-height |
|----------|--------|------|-------------|
| H1 (Títulos página) | 32px / 2rem | 700 | 1.2 |
| H2 (Secciones) | 24px / 1.5rem | 600 | 1.3 |
| H3 (Subsecciones) | 20px / 1.25rem | 600 | 1.4 |
| H4 (Cards) | 18px / 1.125rem | 500 | 1.4 |
| Body | 16px / 1rem | 400 | 1.5 |
| Small | 14px / 0.875rem | 400 | 1.5 |
| Caption | 12px / 0.75rem | 400 | 1.4 |

---

## 3. Logo

### Elementos del Logo

El logo del Teatro Real (rediseñado en 2018 por Publicis) consta de:

1. **Monograma TR**: Letras T y R unidas compartiendo un asta vertical
2. **Corona**: Simplificada, posicionada sobre la R
3. **Logotipo completo**: "TEATRO REAL" en Gotham mayúsculas

### Versiones

| Versión | Uso | Fondo |
|---------|-----|-------|
| Logo completo horizontal | Headers, documentos oficiales | Claro |
| Logo completo horizontal invertido | Headers sobre fondo oscuro | Oscuro |
| Monograma solo | Favicon, iconos app, espacios reducidos | Ambos |
| Logo vertical | Aplicaciones especiales | Ambos |

### Área de Protección

- Mantener un margen mínimo equivalente a la altura de la corona alrededor del logo
- No deformar, rotar ni alterar los colores oficiales

### Colores del Logo

| Versión | Monograma | Corona | Texto |
|---------|-----------|--------|-------|
| Positivo (fondo claro) | Negro `#010101` | Carmesí `#CF102D` | Negro `#010101` |
| Negativo (fondo oscuro) | Blanco `#FFFFFF` | Carmesí `#CF102D` | Blanco `#FFFFFF` |
| Monocromático | Negro o Blanco | Negro o Blanco | Negro o Blanco |

---

## 4. Componentes UI

### Botones

#### Botón Primario (CTA)
```css
.btn-primary {
  background-color: #CF102D;
  color: #FFFFFF;
  border: none;
  padding: 12px 24px;
  border-radius: 4px;
  font-family: 'Montserrat', sans-serif;
  font-weight: 600;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: background-color 0.3s ease;
}

.btn-primary:hover {
  background-color: #A00D24;
}
```

#### Botón Secundario
```css
.btn-secondary {
  background-color: transparent;
  color: #010101;
  border: 2px solid #010101;
  padding: 10px 22px;
  border-radius: 4px;
  font-family: 'Montserrat', sans-serif;
  font-weight: 600;
  font-size: 14px;
  text-transform: uppercase;
}

.btn-secondary:hover {
  background-color: #010101;
  color: #FFFFFF;
}
```

#### Botón Terciario (Links)
```css
.btn-tertiary {
  background: none;
  color: #CF102D;
  border: none;
  padding: 8px 0;
  font-family: 'Montserrat', sans-serif;
  font-weight: 500;
  text-decoration: underline;
}
```

### Cards

```css
.card {
  background: #FFFFFF;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: box-shadow 0.3s ease, transform 0.3s ease;
}

.card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.card-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.card-content {
  padding: 16px;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #010101;
  margin-bottom: 8px;
}

.card-meta {
  font-size: 14px;
  color: #666666;
}
```

### Inputs

```css
.input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #CCCCCC;
  border-radius: 4px;
  font-family: 'Montserrat', sans-serif;
  font-size: 16px;
  transition: border-color 0.3s ease;
}

.input:focus {
  outline: none;
  border-color: #CF102D;
  box-shadow: 0 0 0 3px rgba(207, 16, 45, 0.1);
}

.input::placeholder {
  color: #999999;
}

.input-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  font-size: 14px;
  color: #333333;
}
```

### Navegación

```css
.navbar {
  background-color: #010101;
  padding: 16px 24px;
}

.nav-link {
  color: #FFFFFF;
  font-family: 'Montserrat', sans-serif;
  font-weight: 500;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 8px 16px;
  transition: color 0.3s ease;
}

.nav-link:hover {
  color: #CF102D;
}

.nav-link.active {
  color: #CF102D;
  border-bottom: 2px solid #CF102D;
}
```

---

## 5. Espaciado

### Sistema de Espaciado (8px base)

| Token | Valor | Uso |
|-------|-------|-----|
| `space-xs` | 4px | Espaciado mínimo entre elementos inline |
| `space-sm` | 8px | Espaciado entre elementos relacionados |
| `space-md` | 16px | Espaciado estándar entre componentes |
| `space-lg` | 24px | Espaciado entre secciones |
| `space-xl` | 32px | Espaciado entre bloques mayores |
| `space-2xl` | 48px | Separación de secciones principales |
| `space-3xl` | 64px | Márgenes de página |

### Radios de Borde

| Token | Valor | Uso |
|-------|-------|-----|
| `radius-sm` | 4px | Botones, inputs |
| `radius-md` | 8px | Cards, modales |
| `radius-lg` | 16px | Elementos destacados |
| `radius-full` | 50% | Avatares, iconos circulares |

---

## 6. Iconografía

### Estilo Recomendado

- **Estilo**: Línea (outline) con peso consistente
- **Peso de trazo**: 1.5px - 2px
- **Tamaños estándar**: 16px, 20px, 24px, 32px
- **Color**: Heredado del texto o personalizado

### Librerías Sugeridas

1. **Lucide Icons** (recomendada)
   - https://lucide.dev/
   - Estilo limpio, consistente
   - MIT License

2. **Heroicons**
   - https://heroicons.com/
   - Por los creadores de Tailwind

3. **Phosphor Icons**
   - https://phosphoricons.com/
   - Múltiples pesos disponibles

### Iconos Específicos para la App

| Función | Icono sugerido |
|---------|----------------|
| Calendario | `calendar` |
| Producción/Ópera | `music` o `theater` |
| Escenario | `layout` o `square` |
| Departamentos | `users` |
| TOPs/Sincronización | `zap` o `clock` |
| Alertas | `alert-triangle` |
| Configuración | `settings` |
| Búsqueda | `search` |
| Filtros | `filter` |
| Exportar | `download` |
| Editar | `edit-2` |
| Ver | `eye` |
| Notificaciones | `bell` |

---

## 7. Sombras

```css
/* Sistema de sombras */
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-md: 0 2px 8px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 4px 16px rgba(0, 0, 0, 0.15);
--shadow-xl: 0 8px 32px rgba(0, 0, 0, 0.2);

/* Sombra para elementos elevados (modales, dropdowns) */
--shadow-elevated: 0 10px 40px rgba(0, 0, 0, 0.25);
```

---

## 8. Estados y Feedback

### Estados de Elementos Interactivos

| Estado | Descripción |
|--------|-------------|
| Default | Estado inicial |
| Hover | Cursor sobre el elemento |
| Focus | Elemento seleccionado (teclado) |
| Active | Durante clic/tap |
| Disabled | No disponible |
| Loading | En proceso |

### Colores de Estado

| Estado | Color | Hex | Uso |
|--------|-------|-----|-----|
| Éxito | Verde | `#2E7D32` | Confirmaciones, completado |
| Error | Rojo | `#C62828` | Errores, alertas críticas |
| Advertencia | Naranja | `#EF6C00` | Warnings, atención |
| Info | Azul | `#1565C0` | Información, tips |
| Neutro | Gris | `#757575` | Estados inactivos |

---

## 9. Responsive Breakpoints

```css
/* Mobile first approach */
--breakpoint-sm: 640px;   /* Móvil grande */
--breakpoint-md: 768px;   /* Tablet */
--breakpoint-lg: 1024px;  /* Desktop pequeño */
--breakpoint-xl: 1280px;  /* Desktop */
--breakpoint-2xl: 1536px; /* Desktop grande */
```

---

## 10. Aplicación al MVP

### Header de la Aplicación

```
┌─────────────────────────────────────────────────────────────┐
│  [Logo TR]   TEMPO    TOPS    Centro Comando    [Usuario]   │
│  #010101 bg                                                  │
└─────────────────────────────────────────────────────────────┘
```

### Sidebar de Navegación

```
┌──────────────┐
│ [Logo]       │  #FFFFFF bg
├──────────────┤
│ 📅 Calendario│
│ 🎭 Producciones│
│ 📋 Guiones   │
│ 📊 Dashboard │
│ ⚙️ Config    │  #CF102D active
└──────────────┘
```

### Card de Actividad (TEMPO)

```
┌─────────────────────────────────┐
│ ▌ FUNCIÓN                       │  Barra lateral = color tipo
│ Carmen                          │
│ 📅 15 Mar 2025 · 20:00         │
│ 📍 Escenario Principal         │
│                                 │
│ [Ver detalle]  [Editar]        │  Botones secundarios
└─────────────────────────────────┘
```

### Card de TOP (TOPS)

```
┌─────────────────────────────────┐
│ TOP 45                          │  Número destacado
├─────────────────────────────────┤
│ 🎵 p.102, compás 378           │  Ref. partitura
│ 💡 Elec. | M.E.                │  Departamentos
├─────────────────────────────────┤
│ Transición a luz nocturna      │  Descripción
│ Gradual 8 segundos             │
└─────────────────────────────────┘
```

---

## 11. Tokens CSS (Variables)

```css
:root {
  /* Colores principales */
  --color-primary: #CF102D;
  --color-primary-dark: #A00D24;
  --color-primary-light: #E54D64;

  --color-black: #010101;
  --color-white: #FFFFFF;

  /* Grises */
  --color-gray-900: #232323;
  --color-gray-800: #333333;
  --color-gray-600: #666666;
  --color-gray-400: #999999;
  --color-gray-200: #CCCCCC;
  --color-gray-100: #F5F5F5;

  /* Estados */
  --color-success: #2E7D32;
  --color-error: #C62828;
  --color-warning: #EF6C00;
  --color-info: #1565C0;

  /* Tipografía */
  --font-family: 'Montserrat', sans-serif;
  --font-size-base: 16px;
  --line-height-base: 1.5;

  /* Espaciado */
  --space-unit: 8px;
  --space-xs: calc(var(--space-unit) * 0.5);
  --space-sm: var(--space-unit);
  --space-md: calc(var(--space-unit) * 2);
  --space-lg: calc(var(--space-unit) * 3);
  --space-xl: calc(var(--space-unit) * 4);

  /* Bordes */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;

  /* Sombras */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 2px 8px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 4px 16px rgba(0, 0, 0, 0.15);

  /* Transiciones */
  --transition-fast: 150ms ease;
  --transition-normal: 300ms ease;
}
```

---

## 12. Recursos y Enlaces

### Fuentes
- Google Fonts - Montserrat: https://fonts.google.com/specimen/Montserrat
- Gotham (con licencia): https://www.typography.com/fonts/gotham

### Iconos
- Lucide: https://lucide.dev/
- Heroicons: https://heroicons.com/

### Referencias
- Teatro Real Web: https://www.teatroreal.es
- Brandfetch Assets: https://brandfetch.com/teatroreal.es
- Artículo Brandemia: https://brandemia.org/el-teatro-real-de-madrid-renueva-su-logo-al-cumplir-200-anos

---

*Guía de Estilos para MVP - Teatro Real*
*Versión 1.0 - Noviembre 2025*
*Basada en la identidad corporativa oficial del Teatro Real de Madrid*
