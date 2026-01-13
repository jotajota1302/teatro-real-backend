import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Usuario, AuthResponse, PermisoModulo, Modulo } from './auth.models';
import { environment } from '../../../environments/environment';

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

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.loadStoredAuth();
  }

  // --- Login Google
  loginWithGoogle(): void {
    window.location.href = `${this.API_URL}/google`;
  }

  // --- Callback OAuth
  handleAuthCallback(token: string) {
    return this.http.get<AuthResponse>(`${this.API_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` }
    }).pipe(
      tap(response => {
        this.setAuth(response.token, response.usuario);
        this.loadPermisosModulo();
      })
    );
  }

  logout(): void {
    this.clearAuth();
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return this.tokenSignal();
  }

  hasRole(roles: string[]): boolean {
    const user = this.currentUserSignal();
    return user ? roles.includes(user.rol.nombre) : false;
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

  // --- Persistencia localStorage
  private setAuth(token: string, usuario: Usuario): void {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_user', JSON.stringify(usuario));
    this.tokenSignal.set(token);
    this.currentUserSignal.set(usuario);
  }

  private clearAuth(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    this.tokenSignal.set(null);
    this.currentUserSignal.set(null);
    this.permisosModuloSignal.set([]);
  }

  private loadStoredAuth(): void {
    const token = localStorage.getItem('auth_token');
    const userStr = localStorage.getItem('auth_user');
    if (token && userStr) {
      this.tokenSignal.set(token);
      this.currentUserSignal.set(JSON.parse(userStr));
      this.loadPermisosModulo();
    }
  }

  // --- Carga de permisos (por módulo)
  private loadPermisosModulo(): void {
    this.http.get<PermisoModulo[]>(`${environment.apiUrl}/usuarios/me/permisos-modulo`)
      .subscribe(permisos => {
        this.permisosModuloSignal.set(permisos);
      });
  }
}
