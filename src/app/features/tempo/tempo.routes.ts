import { Routes } from '@angular/router';

export const TEMPO_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./tempo-placeholder.component').then(m => m.TempoPlaceholderComponent),
    title: 'Tempo Módulo (placeholder)'
  }
  // Añadir aquí rutas reales de TEMPO cuando existan los componentes.
];
