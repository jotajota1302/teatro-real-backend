import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface Rol {
  id: number;
  nombre: string;
  descripcion: string;
  permisos?: string[];
}

export interface Usuario {
  id: string;
  email: string;
  nombre: string;
  avatarUrl?: string;
  rol?: Rol;
  activo: boolean;
  ultimoAcceso?: string;
}

export interface PermisoModulo {
  id: number;
  usuarioId: string;
  modulo: 'TEMPO' | 'TOPS' | 'ADMIN';
  nivelAcceso: 'LECTURA' | 'ESCRITURA' | 'COMPLETO' | 'NINGUNO';
}

export interface UsuarioCreateRequest {
  email: string;
  nombre: string;
  password: string;
  rolId: number;
}

export interface UsuarioUpdateRequest {
  email?: string;
  nombre?: string;
  password?: string;
  activo?: boolean;
  rolId?: number;
}

export interface PermisoModuloRequest {
  modulo: string;
  nivelAcceso: string;
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly API_URL = `${environment.apiUrl}`;
  private http = inject(HttpClient);

  // State signals
  usuarios = signal<Usuario[]>([]);
  roles = signal<Rol[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  // ==================== Usuarios ====================

  loadUsuarios(): Observable<Usuario[]> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.get<Usuario[]>(`${this.API_URL}/usuarios`).pipe(
      tap(usuarios => {
        this.usuarios.set(usuarios);
        this.loading.set(false);
      }),
      catchError(err => {
        this.error.set(err.message || 'Error al cargar usuarios');
        this.loading.set(false);
        return of([]);
      })
    );
  }

  getUsuario(id: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.API_URL}/usuarios/${id}`);
  }

  createUsuario(request: UsuarioCreateRequest): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.API_URL}/usuarios`, request);
  }

  updateUsuario(id: string, request: UsuarioUpdateRequest): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.API_URL}/usuarios/${id}`, request);
  }

  deleteUsuario(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/usuarios/${id}`);
  }

  // ==================== Permisos ====================

  getPermisosModulo(usuarioId: string): Observable<PermisoModulo[]> {
    return this.http.get<PermisoModulo[]>(`${this.API_URL}/usuarios/${usuarioId}/permisos-modulo`);
  }

  updatePermisosModulo(usuarioId: string, permisos: PermisoModuloRequest[]): Observable<PermisoModulo[]> {
    return this.http.put<PermisoModulo[]>(`${this.API_URL}/usuarios/${usuarioId}/permisos-modulo`, permisos);
  }

  // ==================== Roles ====================

  loadRoles(): Observable<Rol[]> {
    return this.http.get<Rol[]>(`${this.API_URL}/roles`).pipe(
      tap(roles => this.roles.set(roles)),
      catchError(() => of([]))
    );
  }
}
