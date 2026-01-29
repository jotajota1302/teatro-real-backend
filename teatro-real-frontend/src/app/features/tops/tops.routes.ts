// teatro-real-frontend/src/app/features/tops/tops.routes.ts

import { Routes } from '@angular/router';

export const TOPS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./guion-list/guion-list.component').then(m => m.GuionListComponent),
    title: 'Guiones Técnicos - TOPS'
  },
  {
    path: ':id',
    loadComponent: () => import('./editor/guion-editor.component').then(m => m.GuionEditorComponent),
    title: 'Editor de Guion - TOPS'
  }
];
