# Guía Rápida - Sistema de Diseño CSS
## Para Desarrolladores Angular - Teatro Real

---

## ⚡ Quick Start (5 minutos)

### 1. Copiar los archivos CSS
```bash
# Los archivos deben estar en:
src/assets/css/
├── design-system.css
├── layout.css
├── components.css
├── responsive.css
└── accessibility.css
```

### 2. Importar en styles.css
```css
@import 'assets/css/design-system.css';
@import 'assets/css/layout.css';
@import 'assets/css/components.css';
@import 'assets/css/responsive.css';
@import 'assets/css/accessibility.css';
```

### 3. ¡Ya está listo!
```html
<button class="btn btn-primary">Mi botón</button>
```

---

## 🎨 Colores Principales

```css
/* Rojo Teatro Real (Primario) */
color: var(--color-primary);           /* #D63543 */
color: var(--color-primary-dark);      /* #B8293A */
color: var(--color-primary-light);     /* #E85563 */

/* Azul Oscuro (Secundario) */
color: var(--color-secondary);         /* #1F3A45 */
color: var(--color-secondary-dark);    /* #162A32 */

/* Colores de Estado */
color: var(--color-success);           /* #28A745 - Verde */
color: var(--color-warning);           /* #FFC107 - Amarillo */
color: var(--color-error);             /* #DC3545 - Rojo */
color: var(--color-info);              /* #0D6EFD - Azul */
```

---

## 🔲 Espaciado

```css
/* Usa estas variables para padding y margin */
margin: var(--spacing-md);             /* 16px */
padding: var(--spacing-lg);            /* 24px */

/* Valores disponibles */
--spacing-xs:   4px
--spacing-sm:   8px
--spacing-md:  16px
--spacing-lg:  24px
--spacing-xl:  32px
```

---

## 🔘 Botones

### Primario
```html
<button class="btn btn-primary">Acción Principal</button>
```

### Secundario
```html
<button class="btn btn-secondary">Acción Secundaria</button>
```

### Icono (44x44px accesible)
```html
<button class="btn-icon" title="Cerrar">✕</button>
```

### Deshabilitado
```html
<button class="btn btn-primary" disabled>Deshabilitado</button>
```

---

## 📦 Cards

### Card Simple
```html
<div class="card">
  <div class="card-body">
    Contenido aquí
  </div>
</div>
```

### Card con Header
```html
<div class="card">
  <div class="card-header">Título</div>
  <div class="card-body">Contenido</div>
  <div class="card-footer">Pie</div>
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

---

## 📋 Tablas

### Tabla Básica
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

### Tabla con Rayas
```html
<table class="table table-striped">
  <!-- Contenido -->
</table>
```

---

## 📝 Formularios

### Input
```html
<div class="mb-3">
  <label for="email" class="form-label">Email</label>
  <input type="email" class="form-control" id="email">
</div>
```

### Select
```html
<div class="mb-3">
  <label for="select" class="form-label">Opción</label>
  <select class="form-select" id="select">
    <option>Selecciona...</option>
    <option>Opción 1</option>
  </select>
</div>
```

### Checkbox
```html
<div class="form-check">
  <input type="checkbox" class="form-check-input" id="check">
  <label class="form-check-label" for="check">
    Acepto los términos
  </label>
</div>
```

### Radio
```html
<div class="form-check">
  <input type="radio" class="form-check-input" id="radio">
  <label class="form-check-label" for="radio">
    Opción
  </label>
</div>
```

---

## 🔔 Alertas

### Alert Primaria
```html
<div class="alert alert-primary">
  <strong>Información:</strong> Mensaje importante
</div>
```

### Alert de Éxito
```html
<div class="alert alert-success">
  <strong>¡Éxito!</strong> Operación completada
</div>
```

### Alert de Advertencia
```html
<div class="alert alert-warning">
  <strong>Advertencia:</strong> Verifica esto
</div>
```

### Alert de Error
```html
<div class="alert alert-danger">
  <strong>Error:</strong> Algo salió mal
</div>
```

### Alert de Información
```html
<div class="alert alert-info">
  <strong>Info:</strong> Información adicional
</div>
```

---

## 🏷️ Badges

### Badge Primario
```html
<span class="badge bg-primary">Nuevo</span>
```

### Badge de Éxito
```html
<span class="badge bg-success">Activo</span>
```

### Badge de Advertencia
```html
<span class="badge bg-warning">Pendiente</span>
```

### Badge de Error
```html
<span class="badge bg-danger">Crítico</span>
```

---

## 📍 Breadcrumbs

```html
<nav aria-label="breadcrumb">
  <ol class="breadcrumb">
    <li class="breadcrumb-item"><a href="/">Inicio</a></li>
    <li class="breadcrumb-item"><a href="/funciones">Funciones</a></li>
    <li class="breadcrumb-item active">La Traviata</li>
  </ol>
</nav>
```

---

## 🎬 Modals

```html
<div class="modal" id="miModal">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Título</h5>
        <button class="btn-close" data-dismiss="modal"></button>
      </div>
      <div class="modal-body">
        Contenido del modal
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
        <button class="btn btn-primary">Aceptar</button>
      </div>
    </div>
  </div>
</div>
```

---

## 📊 Progress Bar

### Progress Simple
```html
<div class="progress">
  <div class="progress-bar" role="progressbar" style="width: 50%"></div>
</div>
```

### Progress con Etiqueta
```html
<div class="progress">
  <div class="progress-bar" role="progressbar" style="width: 75%">
    75%
  </div>
</div>
```

### Progress Coloreado
```html
<div class="progress">
  <div class="progress-bar bg-success" role="progressbar" style="width: 100%"></div>
</div>
```

---

## 🔗 Navegación

### Navbar Básica
```html
<nav class="navbar">
  <div class="navbar-brand">Teatro Real</div>
  <div class="nav">
    <a class="nav-link" href="/">Inicio</a>
    <a class="nav-link" href="/funciones">Funciones</a>
  </div>
</nav>
```

### Sidebar
```html
<div class="sidebar">
  <div class="sidebar-header">
    <h5>Menú</h5>
  </div>
  <nav>
    <a class="nav-link" href="/dashboard">Dashboard</a>
    <a class="nav-link" href="/funciones">Funciones</a>
    <a class="nav-link" href="/reservas">Reservas</a>
  </nav>
</div>
```

---

## 📱 Responsividad

### Ocultar en Móviles
```html
<div class="d-none d-md-block">
  Solo visible en desktop/tablet
</div>
```

### Mostrar Solo en Móviles
```html
<div class="d-md-none">
  Solo visible en móviles
</div>
```

### Ajustar Tamaño de Texto
```html
<!-- El tamaño se reduce automáticamente en móviles -->
<h1>Título</h1>
```

---

## ♿ Accesibilidad

### Skip Link (agregado automáticamente)
El sistema incluye un link para saltar al contenido principal

### Focus Visible
```css
/* Automático - no requiere configuración */
button:focus-visible {
  outline: 2px solid var(--color-primary);
}
```

### Contraste WCAG AA
```css
/* Todos los colores del sistema tienen contraste verificado */
/* Ratio mínimo: 4.5:1 para texto normal */
```

### Tamaño Mínimo de Botones
```html
<!-- Todos los botones son mínimo 44x44px -->
<button class="btn">Accesible</button>
```

---

## 🌙 Dark Mode

El sistema detecta automáticamente la preferencia de dark mode:

```html
<!-- No requiere código adicional -->
<!-- El navegador aplica automáticamente los estilos dark -->
```

Para forzar dark mode en desarrollo:
```css
@media (prefers-color-scheme: dark) {
  /* Estilos para dark mode */
}
```

---

## ⚙️ Variables de Configuración

### Font Family
```css
--font-family-base: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

### Border Radius
```css
--border-radius-sm: 0.25rem;      /* 4px */
--border-radius-base: 0.375rem;   /* 6px */
--border-radius-md: 0.5rem;       /* 8px */
--border-radius-lg: 1rem;         /* 16px */
```

### Sombras
```css
--shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1);
--shadow-base: 0 2px 8px rgba(0, 0, 0, 0.12);
--shadow-md: 0 4px 12px rgba(0, 0, 0, 0.15);
--shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.2);
```

### Transiciones
```css
--transition-fast: 150ms;
--transition-base: 300ms;
--transition-slow: 500ms;
```

---

## 💡 Tips Útiles

### 1. Siempre usa variables CSS
```css
/* ✓ Bien */
color: var(--color-primary);

/* ✗ Evitar */
color: #D63543;
```

### 2. Usa flexbox para layouts
```css
display: flex;
justify-content: center;
align-items: center;
gap: var(--spacing-md);
```

### 3. Mantén la accesibilidad
```html
<!-- ✓ Bien -->
<label for="email">Email:</label>
<input id="email" type="email">

<!-- ✗ Evitar -->
<input type="email" placeholder="Email">
```

### 4. Usa las clases del sistema
```html
<!-- ✓ Bien -->
<div class="alert alert-success"></div>

<!-- ✗ Evitar -->
<div style="background: green; padding: 10px;"></div>
```

### 5. Respeta el orden de imports
```css
/* Orden correcto */
@import 'design-system.css';      /* 1. Variables */
@import 'layout.css';             /* 2. Estructura */
@import 'components.css';         /* 3. Componentes */
@import 'responsive.css';         /* 4. Responsive */
@import 'accessibility.css';      /* 5. Accesibilidad */
```

---

## 🆘 Troubleshooting Rápido

| Problema | Solución |
|----------|----------|
| Estilos no se aplican | Verifica el orden de imports |
| Colores incorrectos | Usa `var(--color-*)` en lugar de hexadecimales |
| No se ve el focus | Comprueba que `accessibility.css` está importado |
| No es responsivo | Verifica que `responsive.css` está incluido |
| Botón muy pequeño | Añade `class="btn"` al elemento |
| Tabla sin estilos | Añade `class="table"` a la tabla |

---

## 📚 Documentación Completa

Para más detalles, consulta:
- 📄 `DOCUMENTACIÓN/paleta-colores-teatro-real.md` - Especificación completa de colores
- 📄 `PROYECTO/TEATRO/assets/css/README.md` - Guía técnica detallada
- 📄 `PROYECTO/TEATRO/INDEX_ARCHIVOS_CSS.md` - Índice de archivos

---

## 🚀 Ejemplo Completo

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Teatro Real</title>
  <!-- Importar sistema de diseño -->
  <style>
    @import 'assets/css/design-system.css';
    @import 'assets/css/layout.css';
    @import 'assets/css/components.css';
    @import 'assets/css/responsive.css';
    @import 'assets/css/accessibility.css';
  </style>
</head>
<body>
  <!-- Navegación -->
  <nav class="navbar">
    <div class="navbar-brand">Teatro Real</div>
    <div class="nav">
      <a class="nav-link" href="/">Inicio</a>
      <a class="nav-link" href="/funciones">Funciones</a>
    </div>
  </nav>

  <!-- Contenido Principal -->
  <main class="container mt-5">
    <h1>Bienvenido al Teatro Real</h1>
    
    <!-- Sección de Alertas -->
    <div class="alert alert-info">
      <strong>Información:</strong> Sistema de diseño cargado correctamente
    </div>

    <!-- Sección de Cards -->
    <div class="row">
      <div class="col-md-6 mb-4">
        <div class="card">
          <div class="card-header">
            <h5>Funciones Próximas</h5>
          </div>
          <div class="card-body">
            <p>Consulta nuestras próximas funciones</p>
            <button class="btn btn-primary">Ver más</button>
          </div>
        </div>
      </div>
      
      <div class="col-md-6 mb-4">
        <div class="card kpi-card">
          <div class="card-body">
            <div class="kpi-icon bg-primary">🎭</div>
            <h3>125</h3>
            <small>Funciones este año</small>
          </div>
        </div>
      </div>
    </div>

    <!-- Sección de Tabla -->
    <div class="card mt-4">
      <div class="card-header">
        <h5>Últimas Funciones</h5>
      </div>
      <div class="card-body">
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Obra</th>
              <th>Fecha</th>
              <th>Horario</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>La Traviata</td>
              <td>15/12/2025</td>
              <td>19:30</td>
              <td><button class="btn btn-sm btn-primary">Reservar</button></td>
            </tr>
            <tr>
              <td>Don Giovanni</td>
              <td>20/12/2025</td>
              <td>20:00</td>
              <td><button class="btn btn-sm btn-primary">Reservar</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </main>

  <!-- Footer -->
  <footer class="footer mt-5">
    <div class="container">
      <p>&copy; 2025 Teatro Real. Todos los derechos reservados.</p>
    </div>
  </footer>
</body>
</html>
```

---

## 📞 Contacto y Soporte

- **Documentación completa:** Consulta los archivos MD en la carpeta del proyecto
- **Problemas de estilos:** Verifica que todos los CSS estén importados
- **Accesibilidad:** Revisa los criterios WCAG 2.1 AA en la documentación
- **Responsividad:** Prueba en diferentes dispositivos (mobile, tablet, desktop)

---

## ✨ Características Destacadas

✅ **Paleta de colores del Teatro Real** - Colores profesionales y coherentes  
✅ **Responsive design** - Funciona en cualquier dispositivo  
✅ **Accesibilidad WCAG 2.1 AA** - Cumple normativas internacionales  
✅ **Dark mode** - Soporte automático para modo oscuro  
✅ **Variables CSS** - Fácil de personalizar y mantener  
✅ **Componentes reutilizables** - Ahorra tiempo de desarrollo  

---

**Versión:** 1.0  
**Fecha:** 4 de diciembre de 2025  
**Estado:** ✅ Listo para usar
