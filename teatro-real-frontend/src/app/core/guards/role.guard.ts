import { CanActivateFn, ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../auth/auth.service';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot): boolean | UrlTree => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // Si no hay autenticación, dejar que authGuard maneje la redirección
  // Esto evita race conditions durante el logout
  if (!auth.isAuthenticated()) {
    return true; // authGuard se encargará de redirigir a login
  }

  const roles = route.data['roles'] as string[] | undefined;

  if (!roles || !Array.isArray(roles) || roles.length === 0) {
    // Si no se define roles en la ruta, permite el acceso (para evitar bloquear accidentalmente)
    return true;
  }

  return auth.hasRole(roles) ? true : router.createUrlTree(['/acceso-denegado']);
};
