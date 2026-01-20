import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    // Si no existe aún LoginComponent, habrá que crearlo como placeholder.
    component: LoginComponent
  },
  // Puedes añadir más rutas aquí según crezcan los features de auth.
];
