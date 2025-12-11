# Teatro Real - Frontend

Frontend del Sistema de Gestión Interna del Teatro Real, desarrollado con Angular 18 y Tailwind CSS.

## Tecnologías

- **Angular 18** con Standalone Components
- **Tailwind CSS** - Framework de estilos
- **Angular Signals** - Estado reactivo
- **TypeScript 5.5**

## Requisitos

- Node.js 18+
- npm 9+

## Instalación

```bash
cd teatro-real-frontend
npm install
```

## Desarrollo

```bash
npm start
# o
ng serve
```

Navegar a `http://localhost:4200/`

## Build

```bash
ng build
```

Los artefactos de build se generan en `dist/teatro-real-frontend/`.

## Estructura

```
src/
├── app/
│   ├── core/
│   │   ├── components/     # Sidenav, Navbar, Footer
│   │   ├── layouts/        # MainLayout
│   │   └── services/       # LayoutService
│   └── features/
│       ├── home/
│       ├── calendario/
│       ├── espacios/
│       ├── producciones/
│       ├── guiones/
│       ├── logistica/
│       └── carteleria/
├── styles.scss
└── main.ts
```

## Paleta de Colores

- **Carmesí Teatro Real**: `#CF102D`
- **Negro**: `#010101`
- **Negro Carbón**: `#232323`
