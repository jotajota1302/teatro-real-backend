import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
// QUITAMOS referencia directa a AuthService para evitar ciclo

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

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const token = getStoredToken();

  // Si ya tiene el header Authorization, no modificar nada
  let obs: Observable<HttpEvent<any>>;
  if (token && !req.headers.has('Authorization')) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    obs = next(cloned);
  } else {
    obs = next(req);
  }

  // Si la respuesta es 401 o 403, limpia el estado y redirige a login
  return obs.pipe(
    catchError((err: any) => {
      if (err instanceof HttpErrorResponse && (err.status === 401 || err.status === 403)) {
        clearStoredAuth();
        window.location.href = '/auth/login';
      }
      return throwError(() => err);
    })
  );
};
