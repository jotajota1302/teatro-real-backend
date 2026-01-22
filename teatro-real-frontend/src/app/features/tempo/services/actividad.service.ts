// teatro-real-frontend/src/app/features/tempo/services/actividad.service.ts

import { Injectable, signal, computed } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { Actividad, ActividadFormData, CalendarioFilter } from '../models/actividad.model';

/**
 * Servicio de gestión para Actividad (TEMPO).
 * Usa signals y computed para un flujo 100% reactivo.
 */
@Injectable({ providedIn: 'root' })
export class ActividadService {
  /** Lista de actividades obtenidas */
  private actividadesSignal = signal<Actividad[]>([]);
  /** Estado de carga global */
  private loadingSignal = signal(false);
  /** Fecha seleccionada para vista de día/semanal */
  private selectedDateSignal = signal<Date>(new Date());

  /** Exposición pública de actividades */
  actividades = this.actividadesSignal.asReadonly();
  loading = this.loadingSignal.asReadonly();
  selectedDate = this.selectedDateSignal.asReadonly();

  /** Actividades filtradas del día (para use en vista diaria/semanal) */
  actividadesDelDia = computed(() => {
    const fecha = this.selectedDateSignal().toISOString().split('T')[0];
    return this.actividadesSignal().filter(a => a.fecha === fecha);
  });

  constructor(private api: ApiService) {}

  /**
   * Carga las actividades filtrando por múltiples parámetros.
   */
  loadActividades(filter: CalendarioFilter): Observable<Actividad[]> {
    this.loadingSignal.set(true);
    return this.api.get<Actividad[]>('/api/actividades/search', filter).pipe(
      tap(actividades => {
        this.actividadesSignal.set(actividades);
        this.loadingSignal.set(false);
      })
    );
  }

  /**
   * Obtiene una actividad concreta por ID.
   */
  getById(id: string): Observable<Actividad> {
    return this.api.get<Actividad>(`/actividades/${id}`);
  }

  /**
   * Registra una nueva actividad.
   */
  create(data: ActividadFormData): Observable<Actividad> {
    return this.api.post<Actividad>('/actividades', data).pipe(
      tap(nueva => {
        this.actividadesSignal.update(list => [...list, nueva]);
      })
    );
  }

  /**
   * Actualiza una actividad existente.
   */
  update(id: string, data: ActividadFormData): Observable<Actividad> {
    return this.api.put<Actividad>(`/actividades/${id}`, data).pipe(
      tap(updated => {
        this.actividadesSignal.update(list =>
          list.map(a => a.id === id ? updated : a)
        );
      })
    );
  }

  /**
   * Elimina una actividad.
   */
  delete(id: string): Observable<void> {
    return this.api.delete<void>(`/actividades/${id}`).pipe(
      tap(() => {
        this.actividadesSignal.update(list => list.filter(a => a.id !== id));
      })
    );
  }

  /**
   * Clona una actividad a otra fecha.
   */
  clone(id: string, nuevaFecha: string): Observable<Actividad> {
    return this.api.post<Actividad>(`/actividades/${id}/clone`, { nuevaFecha }).pipe(
      tap(clonada => {
        this.actividadesSignal.update(list => [...list, clonada]);
      })
    );
  }

  /**
   * Cambia el estado logístico de una actividad de almacén.
   */
  updateStatus(id: string, estado: 'PENDIENTE' | 'EN_TRANSITO' | 'COMPLETADO'): Observable<Actividad> {
    return this.api.put<Actividad>(`/actividades/${id}/status`, { estado }).pipe(
      tap(updated => {
        this.actividadesSignal.update(list =>
          list.map(a => a.id === id ? updated : a)
        );
      })
    );
  }

  /**
   * Cambia la fecha seleccionada para el filtro.
   */
  setSelectedDate(date: Date): void {
    this.selectedDateSignal.set(date);
  }

  /**
   * Exporta el calendario de actividades en formato descargable (ej: Excel/pdf).
   */
  exportCalendario(filter: CalendarioFilter): Observable<Blob> {
    return this.api.downloadBlob('/actividades/export', filter);
  }
}
