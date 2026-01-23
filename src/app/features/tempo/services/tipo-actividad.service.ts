// teatro-real-frontend/src/app/features/tempo/services/tipo-actividad.service.ts

import { Injectable, signal } from '@angular/core';
import { Observable, tap, of, catchError } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { TipoActividad } from '../models/actividad.model';

// Fallback de tipos de actividad cuando el backend no está disponible
const FALLBACK_TIPOS: TipoActividad[] = [
  { id: 1, nombre: 'Función', colorHex: '#1E3A5F', descripcion: 'Funciones de ópera y ballet', aplicaA: 'SALA', orden: 1 },
  { id: 2, nombre: 'Ensayo', colorHex: '#2E7D32', descripcion: 'Ensayos generales y parciales', aplicaA: 'SALA', orden: 2 },
  { id: 3, nombre: 'Montaje', colorHex: '#E57373', descripcion: 'Montaje de escenografía', aplicaA: 'AMBOS', orden: 3 },
  { id: 4, nombre: 'Desmontaje', colorHex: '#FFB74D', descripcion: 'Desmontaje de producción', aplicaA: 'AMBOS', orden: 4 },
  { id: 5, nombre: 'Mantenimiento', colorHex: '#9E9E9E', descripcion: 'Tareas de mantenimiento', aplicaA: 'AMBOS', orden: 5 },
  { id: 6, nombre: 'Evento', colorHex: '#7B1FA2', descripcion: 'Eventos especiales', aplicaA: 'SALA', orden: 6 }
];

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
    return this.api.get<TipoActividad[]>('/tipo-actividades').pipe(
      tap(tipos => {
        this.tiposSignal.set(tipos);
        this.loadingSignal.set(false);
      }),
      catchError(() => {
        // Fallback a datos estáticos cuando no hay backend
        this.tiposSignal.set(FALLBACK_TIPOS);
        this.loadingSignal.set(false);
        console.warn('[TipoActividadService] Usando tipos de actividad por defecto');
        return of(FALLBACK_TIPOS);
      })
    );
  }

  /**
   * Devuelve tipo de actividad por ID.
   */
  getById(id: number): Observable<TipoActividad> {
    return this.api.get<TipoActividad>(`/tipo-actividades/${id}`);
  }

  /**
   * Crea nuevo tipo de actividad.
   */
  create(data: Partial<TipoActividad>): Observable<TipoActividad> {
    return this.api.post<TipoActividad>('/tipo-actividades', data).pipe(
      tap(nuevo => {
        this.tiposSignal.update(list => [...list, nuevo]);
      })
    );
  }

  /**
   * Actualiza un tipo de actividad existente.
   */
  update(id: number, data: Partial<TipoActividad>): Observable<TipoActividad> {
    return this.api.put<TipoActividad>(`/tipo-actividades/${id}`, data).pipe(
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
    return this.api.delete<void>(`/tipo-actividades/${id}`).pipe(
      tap(() => {
        this.tiposSignal.update(list => list.filter(t => t.id !== id));
      })
    );
  }
}
