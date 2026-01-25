// teatro-real-frontend/src/app/features/tempo/services/tipo-actividad.service.ts

import { Injectable, signal } from '@angular/core';
import { Observable, tap, throwError, catchError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiService } from '../../../core/services/api.service';
import { TipoActividad } from '../models/actividad.model';

/**
 * Servicio para gestión CRUD de tipos de actividad (ensayo, función, etc) módulo TEMPO.
 * Patrón: signals + métodos asíncronos.
 */
@Injectable({ providedIn: 'root' })
export class TipoActividadService {
  private tiposSignal = signal<TipoActividad[]>([]);
  private loadingSignal = signal(false);
  private errorSignal = signal<string | null>(null);

  tipos = this.tiposSignal.asReadonly();
  loading = this.loadingSignal.asReadonly();
  error = this.errorSignal.asReadonly();

  constructor(private api: ApiService) {}

  /**
   * Carga todos los tipos de actividad posibles.
   */
  loadTiposActividad(): Observable<TipoActividad[]> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    // El backend devuelve directamente un array de TipoActividadResponse
    return this.api.get<TipoActividad[]>('/api/tipo-actividades').pipe(
      tap(tipos => {
        // Mapear los campos del backend preservando el ID original
        const mapped = tipos.map((t: any, index: number) => ({
          id: t.id, // Preservar el ID original del backend (UUID string)
          nombre: t.nombre,
          colorHex: t.colorHex,
          descripcion: t.descripcion || '',
          aplicaA: t.aplicaA || 'AMBOS',
          orden: t.orden || index + 1
        }));
        this.tiposSignal.set(mapped);
        this.loadingSignal.set(false);
      }),
      catchError((error: HttpErrorResponse) => {
        this.loadingSignal.set(false);
        const errorMsg = this.getErrorMessage(error);
        this.errorSignal.set(errorMsg);
        console.warn('[TipoActividadService] Error cargando tipos:', errorMsg);
        return throwError(() => new Error(errorMsg));
      })
    );
  }

  private getErrorMessage(error: HttpErrorResponse): string {
    if (error.status === 0) {
      return 'No se puede conectar con el servidor. Verifique que el backend está en ejecución.';
    } else if (error.status === 404) {
      return 'Recurso no encontrado';
    } else if (error.status === 500) {
      return 'Error interno del servidor';
    }
    return error.error?.message || 'Error de conexión con el servidor';
  }

  /**
   * Devuelve tipo de actividad por ID.
   */
  getById(id: string | number): Observable<TipoActividad> {
    return this.api.get<TipoActividad>(`/api/tipo-actividades/${id}`);
  }

  /**
   * Crea nuevo tipo de actividad.
   */
  create(data: Partial<TipoActividad>): Observable<TipoActividad> {
    return this.api.post<TipoActividad>('/api/tipo-actividades', data).pipe(
      tap(nuevo => {
        this.tiposSignal.update(list => [...list, nuevo]);
      })
    );
  }

  /**
   * Actualiza un tipo de actividad existente.
   */
  update(id: string | number, data: Partial<TipoActividad>): Observable<TipoActividad> {
    return this.api.put<TipoActividad>(`/api/tipo-actividades/${id}`, data).pipe(
      tap(updated => {
        this.tiposSignal.update(list =>
          list.map(t => t.id === id ? updated : t)
        );
      })
    );
  }

  /**
   * Elimina un tipo de actividad.
   */
  delete(id: string | number): Observable<void> {
    return this.api.delete<void>(`/api/tipo-actividades/${id}`).pipe(
      tap(() => {
        this.tiposSignal.update(list => list.filter(t => t.id !== id));
      })
    );
  }
}
