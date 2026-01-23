import { CanActivateFn, ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../auth/auth.service';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot): boolean | UrlTree => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const roles = route.data['roles'] as string[] | undefined;

  if (!roles || !Array.isArray(roles) || roles.length === 0) {
    // Si no se define roles en la ruta, permite el acceso (para evitar bloquear accidentalmente)
    return true;
  }

  return auth.hasRole(roles) ? true : router.createUrlTree(['/acceso-denegado']);
};
