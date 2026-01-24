import { Routes } from '@angular/router';

export const TEMPO_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'actividad',
    pathMatch: 'full'
  },
  {
    path: 'actividad',
    loadComponent: () => import('./actividad/actividad-status-control/actividad-status-control.component').then(m => m.ActividadStatusControlComponent),
    title: 'Actividades'
  },
  {
    path: 'espacios',
    loadComponent: () => import('./espacios/espacios-dashboard/espacios-dashboard.component').then(m => m.EspaciosDashboardComponent),
    title: 'Espacios'
  },
  {
    path: 'producciones',
    loadComponent: () => import('./producciones/producciones-list/producciones-list.component').then(m => m.ProduccionesListComponent),
    title: 'Producciones'
  },
  {
    path: 'movimientos',
    loadComponent: () => import('./logistica/logistica.component').then(m => m.LogisticaComponent),
    title: 'Logística – Teatro Real'
  },
  {
    path: 'movimientos/calendario',
    loadComponent: () => import('./logistica/logistica-calendario.component').then(m => m.LogisticaCalendarioComponent),
    title: 'Calendario Logística – Teatro Real'
  },
  {
    path: 'calendario',
    loadComponent: () => import('./calendario/calendario.component').then(m => m.CalendarioComponent),
    title: 'Calendario'
  },
  {
    path: 'departamentos',
    loadComponent: () => import('./departamentos/departamento-list/departamento-list.component').then(m => m.DepartamentoListComponent),
    title: 'Departamentos'
  },
  {
    path: 'tipos-actividad',
    loadComponent: () => import('./tipos-actividad/tipo-list/tipo-list.component').then(m => m.TipoListComponent),
    title: 'Tipos de Actividad'
  },
  {
    path: 'carteleria',
    loadComponent: () => import('./carteleria/carteleria-dashboard.component').then(m => m.CarteleriaDashboardComponent),
    title: 'Cartelería Digital'
  },
];
