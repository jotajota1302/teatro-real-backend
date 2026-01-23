import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { switchMap, tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { Usuario, PermisoModulo, Modulo, RolNombre, AuthResponse } from './auth.models';
import { environment } from '../../../environments/environment';
import { BackendStatusService } from '../services/backend-status.service';

interface LoginTokenResponse {
  token: string;
}

interface UsuarioResponse {
  id: number;
  nombre: string;
  email: string;
  rol: RolNombre;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API_URL = `${environment.apiUrl}/auth`;

  // Signals privadas v2
  private currentUserSignal = signal<Usuario | null>(null);
  private tokenSignal = signal<string | null>(null);
  private permisosModuloSignal = signal<PermisoModulo[]>([]);

  // Computed públicos v2
  currentUser = this.currentUserSignal.asReadonly();
  isAuthenticated = computed(() => !!this.tokenSignal());

  isAdmin = computed(() => this.currentUserSignal()?.rol.nombre === 'ADMIN');
  isGestor = computed(() =>
    ['ADMIN', 'GESTOR'].includes(this.currentUserSignal()?.rol.nombre || '')
  );
  isOperador = computed(() =>
    ['ADMIN', 'GESTOR', 'OPERADOR'].includes(this.currentUserSignal()?.rol.nombre || '')
  );
  isVisualizador = computed(() =>
    this.currentUserSignal()?.rol.nombre === 'VISUALIZADOR'
  );

  private backendStatus = inject(BackendStatusService);

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.loadStoredAuth();
  }

  // --- Login tradicional
  login(email: string, password: string) {
    return this.http.post<LoginTokenResponse>(`${this.API_URL}/login`, { email, password }).pipe(
      switchMap(res =>
        this.http.get<UsuarioResponse>(`${environment.apiUrl}/usuarios/me`, {
          headers: { Authorization: `Bearer ${res.token}` }
        }).pipe(
          tap(usuarioResp => {
            const usuario: Usuario = {
              id: usuarioResp.id.toString(),
              email: usuarioResp.email,
              nombre: usuarioResp.nombre,
              rol: {
                id: 1,
                nombre: usuarioResp.rol,
                descripcion: usuarioResp.rol,
                permisos: []
              },
              activo: true
            };
            this.setAuth(res.token, usuario);
            this.loadPermisosModulo();
          })
        )
      )
    );
  }

  // --- Login Google
  loginWithGoogle(): void {
    window.location.href = `${this.API_URL}/google`;
  }

  // --- Login DEV (solo desarrollo - bypass sin backend)
  devLogin(): void {
    const devUser: Usuario = {
      id: 'dev-admin-001',
      email: 'admin@teatroreal.es',
      nombre: 'Admin (DEV)',
      rol: {
        id: 1,
        nombre: 'ADMIN',
        descripcion: 'Administrador de desarrollo',
        permisos: []
      },
      activo: true
    };
    const devToken = 'dev-token-' + Date.now();
    this.setAuth(devToken, devUser);
    this.router.navigate(['/']);
  }

  // --- Callback OAuth
  handleAuthCallback(token: string) {
    return this.http.get<LoginTokenResponse>(`${this.API_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` }
    }).pipe(
      switchMap(response =>
        this.http.get<UsuarioResponse>(`${environment.apiUrl}/usuarios/me`, {
          headers: { Authorization: `Bearer ${response.token}` }
        }).pipe(
          tap(usuarioResp => {
            const usuario: Usuario = {
              id: usuarioResp.id.toString(),
              email: usuarioResp.email,
              nombre: usuarioResp.nombre,
              rol: {
                id: 1,
                nombre: usuarioResp.rol,
                descripcion: usuarioResp.rol,
                permisos: []
              },
              activo: true
            };
            this.setAuth(response.token, usuario);
            this.loadPermisosModulo();
          })
        )
      )
    );
  }

  // Logout: primero llama al backend, después limpia FE
  logout(): void {
    this.http.post(`${this.API_URL}/logout`, {}).subscribe({
      next: () => {
        this.clearAuth();
        this.router.navigate(['/auth/login']);
      },
      error: () => {
        // Si da error, igual limpia estado y redirige
        this.clearAuth();
        this.router.navigate(['/auth/login']);
      }
    });
  }

  getToken(): string | null {
    return this.tokenSignal();
  }

  hasRole(roles: string[]): boolean {
    const user = this.currentUserSignal();
    return user && user.rol && user.rol.nombre
      ? roles.includes(user.rol.nombre)
      : false;
  }

  // --- Permisos por módulo (signals)
  canAccessModule(modulo: Modulo): boolean {
    const permisos = this.permisosModuloSignal();
    const permiso = permisos.find(p => p.modulo === modulo);
    return permiso ? permiso.nivelAcceso !== 'NINGUNO' : false;
  }

  canWriteModule(modulo: Modulo): boolean {
    const permisos = this.permisosModuloSignal();
    const permiso = permisos.find(p => p.modulo === modulo);
    return permiso ? ['ESCRITURA', 'COMPLETO'].includes(permiso.nivelAcceso) : false;
  }

  // --- Persistencia localStorage protegida para SSR/Node
  private setAuth(token: string, usuario: Usuario): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('auth_token', token);
      localStorage.setItem('auth_user', JSON.stringify(usuario));
    }
    this.tokenSignal.set(token);
    this.currentUserSignal.set(usuario);
  }

  private clearAuth(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
    }
    this.tokenSignal.set(null);
    this.currentUserSignal.set(null);
    this.permisosModuloSignal.set([]);
  }

  private loadStoredAuth(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('auth_token');
      const userStr = localStorage.getItem('auth_user');
      if (token && userStr) {
        this.tokenSignal.set(token);
        this.currentUserSignal.set(JSON.parse(userStr));
        this.loadPermisosModulo();
      }
    }
  }

  // --- Carga de permisos (por módulo)
  private loadPermisosModulo(): void {
    const token = this.tokenSignal();
    if (!token) return;

    // Si el backend está offline, usar permisos por defecto inmediatamente
    if (this.backendStatus.isOffline()) {
      this.setDefaultPermisos();
      return;
    }

    this.http.get<PermisoModulo[]>(`${environment.apiUrl}/usuarios/me/permisos-modulo`, {
      headers: { Authorization: `Bearer ${token}` }
    }).pipe(
      catchError(() => {
        // Fallback silencioso
        return of(null);
      })
    ).subscribe({
      next: permisos => {
        if (permisos) {
          this.permisosModuloSignal.set(permisos);
          this.backendStatus.reportSuccess();
        } else {
          this.setDefaultPermisos();
        }
      }
    });
  }

  /**
   * Establece permisos por defecto según el rol del usuario.
   * Usado cuando el backend no está disponible.
   */
  private setDefaultPermisos(): void {
    const user = this.currentUserSignal();
    const userId = user?.id || 'dev';
    if (user?.rol?.nombre === 'ADMIN') {
      this.permisosModuloSignal.set([
        { id: 1, usuarioId: userId, modulo: 'TEMPO', nivelAcceso: 'COMPLETO' },
        { id: 2, usuarioId: userId, modulo: 'TOPS', nivelAcceso: 'COMPLETO' },
        { id: 3, usuarioId: userId, modulo: 'ADMIN', nivelAcceso: 'COMPLETO' }
      ]);
    } else {
      this.permisosModuloSignal.set([
        { id: 1, usuarioId: userId, modulo: 'TEMPO', nivelAcceso: 'LECTURA' },
        { id: 2, usuarioId: userId, modulo: 'TOPS', nivelAcceso: 'LECTURA' }
      ]);
    }
  }
}
