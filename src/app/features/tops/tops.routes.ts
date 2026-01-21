import { Routes } from '@angular/router';

export const TOPS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./tops-placeholder.component').then(m => m.TopsPlaceholderComponent),
    title: 'TOPS Módulo (placeholder)'
  }
  // Añadir aquí rutas reales de TOPS cuando existan los componentes.
];
