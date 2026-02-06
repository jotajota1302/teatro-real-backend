// teatro-real-frontend/src/app/features/tempo/services/actividad.service.ts

import { Injectable, signal, computed, inject } from '@angular/core';
import { Observable, tap, of, catchError, map } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { BackendStatusService } from '../../../core/services/backend-status.service';
import { Actividad, ActividadFormData, CalendarioFilter } from '../models/actividad.model';

/**
 * Servicio de gestión para Actividad (TEMPO).
 * Usa signals y computed para un flujo 100% reactivo.
 */
@Injectable({ providedIn: 'root' })
export class ActividadService {
  private backendStatus = inject(BackendStatusService);

  /** Lista de actividades obtenidas */
  private actividadesSignal = signal<Actividad[]>([]);
  /** Estado de carga global */
  private loadingSignal = signal(false);
  /** Estado de error */
  private errorSignal = signal<string | null>(null);
  /** Fecha seleccionada para vista de día/semanal */
  private selectedDateSignal = signal<Date>(new Date());

  /** Exposición pública de actividades */
  actividades = this.actividadesSignal.asReadonly();
  loading = this.loadingSignal.asReadonly();
  error = this.errorSignal.asReadonly();
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
    this.errorSignal.set(null);

    // Limpiar valores undefined/null para evitar que se serialicen mal
    const cleanFilter: Record<string, string> = {};
    Object.entries(filter).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        cleanFilter[key] = String(value);
      }
    });

    return this.api.get<Actividad[]>('/api/actividades/search', cleanFilter).pipe(
      tap(actividades => {
        this.actividadesSignal.set(actividades);
        this.loadingSignal.set(false);
        this.backendStatus.reportSuccess();
      }),
      catchError(err => {
        this.loadingSignal.set(false);
        this.errorSignal.set('No se pudieron cargar las actividades');
        // No limpiar actividades existentes - mantener cache
        console.warn('[ActividadService] Error cargando actividades:', err?.message || err);
        return of(this.actividadesSignal()); // Retornar datos en cache
      })
    );
  }

  /**
   * Obtiene una actividad concreta por ID.
   */
  getById(id: string): Observable<Actividad> {
    return this.api.get<Actividad>(`/api/actividades/${id}`);
  }

  /**
   * Registra una nueva actividad.
   */
  create(data: ActividadFormData): Observable<Actividad> {
    return this.api.post<Actividad>('/api/actividades', data).pipe(
      tap(nueva => {
        this.actividadesSignal.update(list => [...list, nueva]);
      })
    );
  }

  /**
   * Actualiza una actividad existente.
   */
  update(id: string, data: ActividadFormData): Observable<Actividad> {
    return this.api.put<Actividad>(`/api/actividades/${id}`, data).pipe(
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
    return this.api.delete<void>(`/api/actividades/${id}`).pipe(
      tap(() => {
        this.actividadesSignal.update(list => list.filter(a => a.id !== id));
      })
    );
  }

  /**
   * Clona una actividad a otra fecha.
   */
  clone(id: string, nuevaFecha: string): Observable<Actividad> {
    return this.api.post<Actividad>(`/api/actividades/${id}/clone`, { nuevaFecha }).pipe(
      tap(clonada => {
        this.actividadesSignal.update(list => [...list, clonada]);
      })
    );
  }

  /**
   * Cambia el estado logístico de una actividad de almacén.
   */
  updateStatus(id: string, estado: 'PENDIENTE' | 'EN_TRANSITO' | 'COMPLETADO'): Observable<Actividad> {
    return this.api.put<Actividad>(`/api/actividades/${id}/status`, { estado }).pipe(
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
    return this.api.downloadBlob('/api/actividades/export', filter);
  }

  /**
   * Busca actividades que tengan conflicto de horario con los parámetros dados.
   * Retorna actividades en el mismo espacio, fecha y con horario solapado.
   */
  checkConflicts(espacioId: number, fecha: string, horaInicio: string, horaFin: string, excludeId?: string): Observable<Actividad[]> {
    return this.api.get<Actividad[]>('/api/actividades/search', {
      espacioId: String(espacioId),
      fechaInicio: fecha,
      fechaFin: fecha
    }).pipe(
      catchError(() => of([])),
      map((actividades: Actividad[]) => {
        return actividades.filter(a => {
          // Excluir la actividad que estamos editando
          if (excludeId && a.id === excludeId) return false;
          // Verificar solapamiento de horarios
          return this.horariosSeSuperponen(horaInicio, horaFin, a.horaInicio, a.horaFin);
        });
      })
    );
  }

  /**
   * Verifica si dos rangos de horarios se superponen.
   */
  private horariosSeSuperponen(inicio1: string, fin1: string, inicio2: string, fin2: string): boolean {
    const toMinutes = (hora: string): number => {
      const [h, m] = hora.split(':').map(Number);
      return h * 60 + m;
    };
    const start1 = toMinutes(inicio1);
    const end1 = toMinutes(fin1);
    const start2 = toMinutes(inicio2);
    const end2 = toMinutes(fin2);

    // Hay solapamiento si uno empieza antes de que el otro termine
    return start1 < end2 && start2 < end1;
  }
}
