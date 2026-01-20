import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    // Componente/contenedor dummy por defecto para Admin
    component: class AdminPlaceholderComponent {},
    title: 'Admin Módulo (placeholder)'
  }
  // Añadir aquí rutas reales de Admin cuando existan los componentes.
];
