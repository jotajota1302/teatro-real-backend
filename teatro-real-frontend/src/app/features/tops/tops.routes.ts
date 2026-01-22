import { Routes } from '@angular/router';

export const TOPS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./tops-placeholder.component').then(m => m.TopsPlaceholderComponent),
    title: 'TOPS Módulo (placeholder)'
  },
  {
    path: 'producciones',
    loadComponent: () => import('../../shared/components/pantalla-en-desarrollo/pantalla-en-desarrollo.component').then(m => m.PantallaEnDesarrolloComponent),
    title: 'Producciones (en desarrollo)',
    data: { nombre: 'Producciones' }
  },
  {
    path: 'guiones-tecnicos',
    loadComponent: () => import('../../shared/components/pantalla-en-desarrollo/pantalla-en-desarrollo.component').then(m => m.PantallaEnDesarrolloComponent),
    title: 'Guiones Técnicos (en desarrollo)',
    data: { nombre: 'Guiones Técnicos' }
  },
  {
    path: 'guiones-new',
    loadComponent: () => import('../../shared/components/pantalla-en-desarrollo/pantalla-en-desarrollo.component').then(m => m.PantallaEnDesarrolloComponent),
    title: 'Guiones NEW (en desarrollo)',
    data: { nombre: 'Guiones NEW' }
  },
  {
    path: 'editor-guiones',
    loadComponent: () => import('../../shared/components/pantalla-en-desarrollo/pantalla-en-desarrollo.component').then(m => m.PantallaEnDesarrolloComponent),
    title: 'Editor de Guiones (en desarrollo)',
    data: { nombre: 'Editor de Guiones' }
  }
  // Añadir aquí rutas reales de TOPS cuando existan los componentes.
];
