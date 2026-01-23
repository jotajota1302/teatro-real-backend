import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { modulePermissionGuard } from './core/guards/module-permission.guard';

// NOTA: Cambia los imports de features/layout a la ruta real cuando existan los componentes.
// De momento, esto es un ejemplo funcional-modelo, ajustar a la estructura final de carpetas y componentes.

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'tempo/espacios',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    // Aquí debería ir el lazy load real a las rutas de auth.
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: '',
    // Aquí debería ir el main layout real
    loadComponent: () => import('./layout/main-layout/main-layout.component')
      .then(m => m.MainLayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component')
          .then(m => m.DashboardComponent)
      },
      {
        path: 'tempo',
        loadChildren: () => import('./features/tempo/tempo.routes').then(m => m.TEMPO_ROUTES),
        canActivate: [modulePermissionGuard],
        data: { modulo: 'TEMPO' }
      },
      {
        path: 'tops',
        loadChildren: () => import('./features/tops/tops.routes').then(m => m.TOPS_ROUTES),
        canActivate: [modulePermissionGuard],
        data: { modulo: 'TOPS' }
      },
      {
        path: 'admin',
        loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES),
        canActivate: [roleGuard],
        data: { roles: ['ADMIN'] }
      }
    ]
  },
  // Ejemplo: cartelería global
  {
    path: 'carteleria/global',
    loadComponent: () => import('./features/carteleria/carteleria-global/carteleria-global.component')
      .then(m => m.CarteleriaGlobalComponent)
  },
  // Ejemplo: cartelería por sala
  {
    path: 'carteleria/:espacioId',
    loadComponent: () => import('./features/carteleria/carteleria-sala/carteleria-sala.component')
      .then(m => m.CarteleriaSalaComponent)
  },
  {
    path: 'acceso-denegado',
    loadComponent: () => import('./shared/acceso-denegado.component').then(m => m.AccesoDenegadoComponent)
  },
  {
    path: '**',
    redirectTo: 'tempo/espacios'
  }
];
