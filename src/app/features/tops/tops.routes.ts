import { Routes } from '@angular/router';

export const TOPS_ROUTES: Routes = [
  {
    path: '',
    // Componente/contenedor dummy por defecto para Tops
    component: class TopsPlaceholderComponent {},
    title: 'TOPS Módulo (placeholder)'
  }
  // Añadir aquí rutas reales de TOPS cuando existan los componentes.
];
