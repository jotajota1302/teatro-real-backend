import { Routes } from '@angular/router';
import { MainLayoutComponent } from './core/layouts/main-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),
        title: 'Vista Global - Teatro Real'
      },
      {
        path: 'calendario',
        loadComponent: () => import('./features/calendario/calendario.component').then(m => m.CalendarioComponent),
        title: 'Calendario - Teatro Real'
      },
      {
        path: 'espacios',
        loadComponent: () => import('./features/espacios/espacios.component').then(m => m.EspaciosComponent),
        title: 'Espacios - Teatro Real'
      },
      {
        path: 'producciones',
        loadComponent: () => import('./features/producciones/producciones.component').then(m => m.ProduccionesComponent),
        title: 'Producciones - Teatro Real'
      },
      {
        path: 'guiones',
        loadComponent: () => import('./features/guiones/guiones.component').then(m => m.GuionesComponent),
        title: 'Guiones Técnicos - Teatro Real'
      },
      {
        path: 'logistica',
        loadComponent: () => import('./features/logistica/logistica.component').then(m => m.LogisticaComponent),
        title: 'Logística - Teatro Real'
      },
      {
        path: 'carteleria',
        loadComponent: () => import('./features/carteleria/carteleria.component').then(m => m.CarteleriaComponent),
        title: 'Cartelería - Teatro Real'
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];
