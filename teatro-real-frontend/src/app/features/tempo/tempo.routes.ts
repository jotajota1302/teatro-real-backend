import { Routes } from '@angular/router';

export const TEMPO_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./tempo-placeholder.component').then(m => m.TempoPlaceholderComponent),
    title: 'Tempo Módulo (placeholder)'
  },
  {
    path: 'espacios',
    loadComponent: () => import('./espacios/espacio-list/espacio-list.component').then(m => m.EspacioListComponent),
    title: 'Espacios',
    data: { nombre: 'Espacios' }
  },
  {
    path: 'calendario',
    loadComponent: () => import('../../shared/components/pantalla-en-desarrollo/pantalla-en-desarrollo.component').then(m => m.PantallaEnDesarrolloComponent),
    title: 'Calendario (en desarrollo)',
    data: { nombre: 'Calendario' }
  },
  {
    path: 'logistica',
    loadComponent: () => import('../../shared/components/pantalla-en-desarrollo/pantalla-en-desarrollo.component').then(m => m.PantallaEnDesarrolloComponent),
    title: 'Logística (en desarrollo)',
    data: { nombre: 'Logística' }
  },
  {
    path: 'carteleria',
    loadComponent: () => import('../../shared/components/pantalla-en-desarrollo/pantalla-en-desarrollo.component').then(m => m.PantallaEnDesarrolloComponent),
    title: 'Cartelería (en desarrollo)',
    data: { nombre: 'Cartelería' }
  }
  // Añadir aquí rutas reales de TEMPO cuando existan los componentes.
];
