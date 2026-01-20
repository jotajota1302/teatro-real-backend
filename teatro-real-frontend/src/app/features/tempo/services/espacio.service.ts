// teatro-real-frontend/src/app/features/tempo/services/espacio.service.ts

import { Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { Espacio } from '../models/actividad.model';

/**
 * Servicio para gestión CRUD de espacios (salas, almacenes, etc) módulo TEMPO.
 * Patrón: signals + métodos asíncronos.
 */
@Injectable({ providedIn: 'root' })
export class EspacioService {
  private espaciosSignal = signal<Espacio[]>([]);
  private loadingSignal = signal(false);

  espacios = this.espaciosSignal.asReadonly();
  loading = this.loadingSignal.asReadonly();

  constructor(private api: ApiService) {}

  /**
   * Carga todos los espacios disponibles.
   */
  loadEspacios(): Observable<Espacio[]> {
    this.loadingSignal.set(true);
    return this.api.get<Espacio[]>('/espacios').pipe(
      tap(espacios => {
        this.espaciosSignal.set(espacios);
        this.loadingSignal.set(false);
      })
    );
  }

  /**
   * Devuelve un espacio por ID.
   */
  getById(id: number): Observable<Espacio> {
    return this.api.get<Espacio>(`/espacios/${id}`);
  }

  /**
   * Crea nuevo espacio.
   */
  create(data: Partial<Espacio>): Observable<Espacio> {
    return this.api.post<Espacio>('/espacios', data).pipe(
      tap(nuevo => {
        this.espaciosSignal.update(list => [...list, nuevo]);
      })
    );
  }

  /**
   * Actualiza un espacio existente.
   */
  update(id: number, data: Partial<Espacio>): Observable<Espacio> {
    return this.api.put<Espacio>(`/espacios/${id}`, data).pipe(
      tap(updated => {
        this.espaciosSignal.update(list =>
          list.map(e => e.id === id ? updated : e)
        );
      })
    );
  }

  /**
   * Elimina un espacio.
   */
  delete(id: number): Observable<void> {
    return this.api.delete<void>(`/espacios/${id}`).pipe(
      tap(() => {
        this.espaciosSignal.update(list => list.filter(e => e.id !== id));
      })
    );
  }
}
