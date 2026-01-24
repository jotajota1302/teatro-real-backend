import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { BackendStatusService } from '../services/backend-status.service';
import { Router } from '@angular/router';

function getStoredToken(): string | null {
  if (typeof window !== 'undefined' && window.localStorage) {
    return localStorage.getItem('auth_token');
  }
  return null;
}

function clearStoredAuth() {
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  }
}

// Rutas que no requieren autenticación
const PUBLIC_ROUTES = ['/auth/login', '/auth/callback', '/carteleria'];

// Timeout para peticiones (15 segundos)
const REQUEST_TIMEOUT = 15000;

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const backendStatus = inject(BackendStatusService);
  const router = inject(Router);
  const token = getStoredToken();

  // Si el backend está offline y no es una ruta crítica, devolver error inmediato
  // IMPORTANTE: Devolvemos throwError en vez de EMPTY para que los observables completen
  // y los componentes puedan manejar el estado de error correctamente
  if (!backendStatus.shouldAllowRequest() && !isHealthCheck(req.url)) {
    return throwError(() => new HttpErrorResponse({
      error: 'Backend offline',
      status: 0,
      statusText: 'Service Unavailable',
      url: req.url
    }));
  }

  // Clonar request con token si existe
  let clonedReq = req;
  if (token && !req.headers.has('Authorization')) {
    clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(clonedReq).pipe(
    // Timeout para evitar peticiones colgadas
    timeout(REQUEST_TIMEOUT),

    catchError((error: any) => {
      // Error de timeout
      if (error.name === 'TimeoutError') {
        console.warn(`[Interceptor] Timeout en petición: ${req.url}`);
        backendStatus.reportError(error);
        return throwError(() => new HttpErrorResponse({
          error: 'Request timeout',
          status: 0,
          statusText: 'Timeout',
          url: req.url
        }));
      }

      // Error de red (backend caído, sin conexión, etc.)
      // NO reportar errores de logout (fire-and-forget, no debe afectar el estado)
      if (isNetworkError(error) && !isLogoutRequest(req.url)) {
        backendStatus.reportError(error);
        // NO redirigir a login - simplemente reportar el error
      }
      if (isNetworkError(error)) {
        return throwError(() => error);
      }

      // Error HTTP válido
      if (error instanceof HttpErrorResponse) {
        backendStatus.reportSuccess(); // El backend respondió

        switch (error.status) {
          case 401:
            // Token inválido o expirado - solo si NO estamos ya en login
            if (!isPublicRoute(router.url)) {
              clearStoredAuth();
              router.navigate(['/auth/login'], { queryParams: { reason: 'session_expired' } });
            }
            break;

          case 403:
            // Sin permisos - NO redirigir si es ruta de auth (logout, login, etc.)
            if (!isPublicRoute(router.url) && !isAuthRequest(req.url)) {
              router.navigate(['/acceso-denegado']);
            }
            break;

          // Otros errores HTTP se propagan normalmente
        }
      }

      return throwError(() => error);
    })
  );
};

/**
 * Determina si es un error de red (backend no disponible).
 */
function isNetworkError(error: any): boolean {
  // status === 0 indica error de red (CORS, sin conexión, backend caído)
  if (error?.status === 0) return true;

  const message = (error?.message || '').toLowerCase();
  return (
    message.includes('network error') ||
    message.includes('failed to fetch') ||
    message.includes('net::err') ||
    message.includes('econnrefused')
  );
}

/**
 * Verifica si la URL actual es una ruta pública.
 */
function isPublicRoute(url: string): boolean {
  return PUBLIC_ROUTES.some(route => url.startsWith(route));
}

/**
 * Verifica si es una petición de health check.
 */
function isHealthCheck(url: string): boolean {
  return url.includes('/health') || url.includes('/actuator');
}

/**
 * Verifica si es una petición a rutas de autenticación.
 * Estas rutas no deben redirigir a acceso-denegado en caso de error.
 */
function isAuthRequest(url: string): boolean {
  return url.includes('/api/auth/') || url.includes('/api/usuarios/me');
}

/**
 * Verifica si es una petición de logout.
 * El logout es fire-and-forget y no debe afectar el BackendStatusService.
 */
function isLogoutRequest(url: string): boolean {
  return url.includes('/auth/logout');
}
