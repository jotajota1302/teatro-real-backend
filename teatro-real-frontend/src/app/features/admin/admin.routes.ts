import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./admin-placeholder.component').then(m => m.AdminPlaceholderComponent),
    title: 'Admin Módulo (placeholder)'
  }
  // Añadir aquí rutas reales de Admin cuando existan los componentes.
];
