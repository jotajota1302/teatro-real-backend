import { CanActivateFn, ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Modulo } from '../auth/auth.models';

export const modulePermissionGuard: CanActivateFn = (route: ActivatedRouteSnapshot): boolean | UrlTree => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const modulo = route.data['modulo'] as Modulo | undefined;
  if (!modulo) return true; // Si no se especifica el módulo, no bloquea

  return auth.canAccessModule(modulo) ? true : router.createUrlTree(['/tempo/espacios']);
};
