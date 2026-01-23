import { CanActivateFn, ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Modulo } from '../auth/auth.models';

export const modulePermissionGuard: CanActivateFn = (route: ActivatedRouteSnapshot): boolean | UrlTree => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const modulo = route.data['modulo'] as Modulo | undefined;
  if (!modulo) return true; // Si no se especifica el módulo, no bloquea

  // Redirigir a acceso-denegado en lugar de una ruta con guard
  // para evitar loops de redirección
  return auth.canAccessModule(modulo) ? true : router.createUrlTree(['/acceso-denegado']);
};
