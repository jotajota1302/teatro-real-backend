// teatro-real-frontend/src/app/features/tempo/services/tipo-actividad.service.ts

import { Injectable, signal } from '@angular/core';
import { Observable, tap, of, catchError } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { TipoActividad } from '../models/actividad.model';

// Fallback de tipos de actividad cuando el backend no está disponible
// Los IDs deben coincidir con los del seed (V3__seed_espacios_tipoactividad.sql)
const FALLBACK_TIPOS: TipoActividad[] = [
  { id: 'ta-funcion-001', nombre: 'Función', colorHex: '#DC2626', descripcion: 'Funciones de ópera y ballet', aplicaA: 'SALA', orden: 1 },
  { id: 'ta-ensayo-general-002', nombre: 'Ensayo General', colorHex: '#2563EB', descripcion: 'Ensayos generales y parciales', aplicaA: 'SALA', orden: 2 },
  { id: 'ta-montaje-008', nombre: 'Montaje', colorHex: '#EA580C', descripcion: 'Montaje de escenografía', aplicaA: 'AMBOS', orden: 3 },
  { id: 'ta-desmontaje-009', nombre: 'Desmontaje', colorHex: '#F97316', descripcion: 'Desmontaje de producción', aplicaA: 'AMBOS', orden: 4 },
  { id: 'ta-mantenimiento-015', nombre: 'Mantenimiento', colorHex: '#6B7280', descripcion: 'Tareas de mantenimiento', aplicaA: 'AMBOS', orden: 5 },
  { id: 'ta-evento-012', nombre: 'Evento', colorHex: '#F472B6', descripcion: 'Eventos especiales', aplicaA: 'SALA', orden: 6 }
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
      catchError((err) => {
        // Fallback a datos estáticos cuando no hay backend
        this.tiposSignal.set(FALLBACK_TIPOS);
        this.loadingSignal.set(false);
        console.warn('[TipoActividadService] Usando tipos de actividad por defecto:', err?.message || err);
        return of(FALLBACK_TIPOS);
      })
    );
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
