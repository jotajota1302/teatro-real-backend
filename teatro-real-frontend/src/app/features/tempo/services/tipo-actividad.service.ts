// teatro-real-frontend/src/app/features/tempo/services/tipo-actividad.service.ts

import { Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
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

  tipos = this.tiposSignal.asReadonly();
  loading = this.loadingSignal.asReadonly();

  constructor(private api: ApiService) {}

  /**
   * Carga todos los tipos de actividad posibles.
   */
  loadTiposActividad(): Observable<TipoActividad[]> {
    this.loadingSignal.set(true);
    return this.api.get<TipoActividad[]>('/tipos-actividad').pipe(
      tap(tipos => {
        this.tiposSignal.set(tipos);
        this.loadingSignal.set(false);
      })
    );
  }

  /**
   * Devuelve tipo de actividad por ID.
   */
  getById(id: number): Observable<TipoActividad> {
    return this.api.get<TipoActividad>(`/tipos-actividad/${id}`);
  }

  /**
   * Crea nuevo tipo de actividad.
   */
  create(data: Partial<TipoActividad>): Observable<TipoActividad> {
    return this.api.post<TipoActividad>('/tipos-actividad', data).pipe(
      tap(nuevo => {
        this.tiposSignal.update(list => [...list, nuevo]);
      })
    );
  }

  /**
   * Actualiza un tipo de actividad existente.
   */
  update(id: number, data: Partial<TipoActividad>): Observable<TipoActividad> {
    return this.api.put<TipoActividad>(`/tipos-actividad/${id}`, data).pipe(
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
  delete(id: number): Observable<void> {
    return this.api.delete<void>(`/tipos-actividad/${id}`).pipe(
      tap(() => {
        this.tiposSignal.update(list => list.filter(t => t.id !== id));
      })
    );
  }
}
