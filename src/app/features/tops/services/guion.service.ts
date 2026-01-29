// teatro-real-frontend/src/app/features/tops/services/guion.service.ts

import { Injectable, signal, computed, inject } from '@angular/core';
import { Observable, tap, of, catchError, throwError } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { BackendStatusService } from '../../../core/services/backend-status.service';
import {
  Guion,
  GuionCompleto,
  GuionFormData,
  PasadaItem,
  PasadaItemFormData,
  Escena,
  EscenaFormData,
  ElementoGuion,
  ElementoGuionFormData,
  Acto,
  ActoFormData,
  EstadoGuion
} from '../models/guion.model';

/**
 * Servicio de gestión para Guiones Técnicos (TOPS).
 * Usa signals para un flujo reactivo.
 */
@Injectable({ providedIn: 'root' })
export class GuionService {
  private backendStatus = inject(BackendStatusService);

  // ==================== Signals de Estado ====================

  /** Lista de guiones (vista lista) */
  private guionesSignal = signal<Guion[]>([]);
  /** Guion actual completo (editor) */
  private guionActualSignal = signal<GuionCompleto | null>(null);
  /** Estado de carga */
  private loadingSignal = signal(false);
  /** Estado de error */
  private errorSignal = signal<string | null>(null);
  /** Temporada actual para filtrar */
  private temporadaActualSignal = signal<string>('');

  // ==================== Exposición Pública ====================

  guiones = this.guionesSignal.asReadonly();
  guionActual = this.guionActualSignal.asReadonly();
  loading = this.loadingSignal.asReadonly();
  error = this.errorSignal.asReadonly();
  temporadaActual = this.temporadaActualSignal.asReadonly();

  /** Guiones filtrados por temporada actual */
  guionesFiltrados = computed(() => {
    const temporada = this.temporadaActualSignal();
    if (!temporada) return this.guionesSignal();
    return this.guionesSignal().filter(g => g.temporada === temporada);
  });

  /** Verifica si el guion actual está bloqueado */
  isGuionLocked = computed(() => {
    return this.guionActualSignal()?.locked ?? false;
  });

  /** Nombre del usuario que bloqueó el guion */
  lockedByNombre = computed(() => {
    return this.guionActualSignal()?.lockedByNombre ?? null;
  });

  constructor(private api: ApiService) {}

  // ==================== CRUD Guiones ====================

  /**
   * Carga la lista de guiones, opcionalmente filtrada por temporada
   */
  loadGuiones(temporada?: string): Observable<Guion[]> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    const params: Record<string, string> = {};
    if (temporada) {
      params['temporada'] = temporada;
      this.temporadaActualSignal.set(temporada);
    }

    return this.api.get<Guion[]>('/api/guiones', params).pipe(
      tap(guiones => {
        this.guionesSignal.set(guiones);
        this.loadingSignal.set(false);
        this.backendStatus.reportSuccess();
      }),
      catchError(err => {
        this.loadingSignal.set(false);
        this.errorSignal.set('No se pudieron cargar los guiones');
        console.warn('[GuionService] Error cargando guiones:', err?.message || err);
        return of(this.guionesSignal());
      })
    );
  }

  /**
   * Obtiene un guion por ID (metadata solamente)
   */
  getById(id: string): Observable<Guion> {
    return this.api.get<Guion>(`/api/guiones/${id}`);
  }

  /**
   * Obtiene un guion completo con todo el árbol (para editor)
   */
  getByIdCompleto(id: string): Observable<GuionCompleto> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.api.get<GuionCompleto>(`/api/guiones/${id}/completo`).pipe(
      tap(guion => {
        this.guionActualSignal.set(guion);
        this.loadingSignal.set(false);
        this.backendStatus.reportSuccess();
      }),
      catchError(err => {
        this.loadingSignal.set(false);
        this.errorSignal.set('No se pudo cargar el guion');
        console.error('[GuionService] Error cargando guion completo:', err);
        return throwError(() => err);
      })
    );
  }

  /**
   * Crea un nuevo guion con N actos iniciales
   */
  create(data: GuionFormData, numActos: number = 3): Observable<Guion> {
    return this.api.post<Guion>(`/api/guiones?numActos=${numActos}`, data).pipe(
      tap(nuevo => {
        this.guionesSignal.update(list => [...list, nuevo]);
      })
    );
  }

  /**
   * Actualiza un guion existente
   */
  update(id: string, data: GuionFormData): Observable<Guion> {
    return this.api.put<Guion>(`/api/guiones/${id}`, data).pipe(
      tap(updated => {
        this.guionesSignal.update(list =>
          list.map(g => g.id === id ? updated : g)
        );
        // Actualizar guion actual si coincide
        if (this.guionActualSignal()?.id === id) {
          this.guionActualSignal.update(g => g ? { ...g, ...updated } : null);
        }
      })
    );
  }

  /**
   * Elimina un guion
   */
  delete(id: string): Observable<void> {
    return this.api.delete<void>(`/api/guiones/${id}`).pipe(
      tap(() => {
        this.guionesSignal.update(list => list.filter(g => g.id !== id));
        if (this.guionActualSignal()?.id === id) {
          this.guionActualSignal.set(null);
        }
      })
    );
  }

  // ==================== Lock/Unlock ====================

  /**
   * Bloquea un guion para edición exclusiva
   */
  lockGuion(id: string): Observable<Guion> {
    return this.api.post<Guion>(`/api/guiones/${id}/lock`, {}).pipe(
      tap(updated => {
        this.guionesSignal.update(list =>
          list.map(g => g.id === id ? updated : g)
        );
        if (this.guionActualSignal()?.id === id) {
          this.guionActualSignal.update(g => g ? {
            ...g,
            locked: updated.locked,
            lockedByNombre: updated.lockedByNombre,
            lockedById: updated.lockedById,
            lockedAt: updated.lockedAt
          } : null);
        }
      })
    );
  }

  /**
   * Desbloquea un guion
   */
  unlockGuion(id: string): Observable<Guion> {
    return this.api.delete<Guion>(`/api/guiones/${id}/lock`).pipe(
      tap(updated => {
        this.guionesSignal.update(list =>
          list.map(g => g.id === id ? updated : g)
        );
        if (this.guionActualSignal()?.id === id) {
          this.guionActualSignal.update(g => g ? {
            ...g,
            locked: false,
            lockedByNombre: undefined,
            lockedById: undefined,
            lockedAt: undefined
          } : null);
        }
      })
    );
  }

  /**
   * Fuerza el desbloqueo de un guion (admin)
   */
  forceUnlock(id: string): Observable<Guion> {
    return this.api.delete<Guion>(`/api/guiones/${id}/lock/force`).pipe(
      tap(updated => {
        this.guionesSignal.update(list =>
          list.map(g => g.id === id ? updated : g)
        );
      })
    );
  }

  // ==================== Estado del Guion ====================

  /**
   * Cambia el estado del guion
   */
  cambiarEstado(id: string, estado: EstadoGuion): Observable<Guion> {
    return this.api.put<Guion>(`/api/guiones/${id}/estado`, { estado }).pipe(
      tap(updated => {
        this.guionesSignal.update(list =>
          list.map(g => g.id === id ? updated : g)
        );
        if (this.guionActualSignal()?.id === id) {
          this.guionActualSignal.update(g => g ? { ...g, estado: updated.estado } : null);
        }
      })
    );
  }

  // ==================== Pasada Items ====================

  /**
   * Crea un nuevo item de pasada
   */
  createPasadaItem(actoId: string, data: PasadaItemFormData): Observable<PasadaItem> {
    return this.api.post<PasadaItem>(`/api/actos/${actoId}/pasada`, data).pipe(
      tap(nuevo => this.updatePasadaInGuion(actoId, items => [...items, nuevo]))
    );
  }

  /**
   * Inserta un item de pasada en posición específica
   */
  insertPasadaItem(actoId: string, orden: number, data: PasadaItemFormData): Observable<PasadaItem> {
    return this.api.post<PasadaItem>(`/api/actos/${actoId}/pasada/insert?orden=${orden}`, data).pipe(
      tap(nuevo => {
        // Actualizar estado local: incrementar orden de items >= posición y añadir el nuevo
        this.updatePasadaInGuion(actoId, items => {
          const updated = items.map(item =>
            item.orden >= orden ? { ...item, orden: item.orden + 1 } : item
          );
          return [...updated, nuevo].sort((a, b) => a.orden - b.orden);
        });
      })
    );
  }

  /**
   * Actualiza un item de pasada
   */
  updatePasadaItem(actoId: string, id: string, data: PasadaItemFormData): Observable<PasadaItem> {
    return this.api.put<PasadaItem>(`/api/actos/${actoId}/pasada/${id}`, data).pipe(
      tap(updated => this.updatePasadaInGuion(actoId, items =>
        items.map(item => item.id === id ? updated : item)
      ))
    );
  }

  /**
   * Elimina un item de pasada
   */
  deletePasadaItem(actoId: string, id: string): Observable<void> {
    return this.api.delete<void>(`/api/actos/${actoId}/pasada/${id}`).pipe(
      tap(() => this.updatePasadaInGuion(actoId, items =>
        items.filter(item => item.id !== id)
      ))
    );
  }

  // ==================== Escenas ====================

  /**
   * Crea una nueva escena
   */
  createEscena(actoId: string, data: EscenaFormData): Observable<Escena> {
    return this.api.post<Escena>(`/api/actos/${actoId}/escenas`, data).pipe(
      tap(nueva => this.updateEscenasInGuion(actoId, escenas => [...escenas, { ...nueva, elementos: [] }]))
    );
  }

  /**
   * Actualiza una escena
   */
  updateEscena(actoId: string, id: string, data: EscenaFormData): Observable<Escena> {
    return this.api.put<Escena>(`/api/actos/${actoId}/escenas/${id}`, data).pipe(
      tap(updated => this.updateEscenasInGuion(actoId, escenas =>
        escenas.map(e => e.id === id ? { ...e, ...updated } : e)
      ))
    );
  }

  /**
   * Elimina una escena
   */
  deleteEscena(actoId: string, id: string): Observable<void> {
    return this.api.delete<void>(`/api/actos/${actoId}/escenas/${id}`).pipe(
      tap(() => this.updateEscenasInGuion(actoId, escenas =>
        escenas.filter(e => e.id !== id)
      ))
    );
  }

  // ==================== Elementos ====================

  /**
   * Crea un nuevo elemento de guion
   */
  createElemento(escenaId: string, data: ElementoGuionFormData): Observable<ElementoGuion> {
    return this.api.post<ElementoGuion>(`/api/escenas/${escenaId}/elementos`, data).pipe(
      tap(nuevo => this.updateElementosInGuion(escenaId, elementos => [...elementos, nuevo]))
    );
  }

  /**
   * Actualiza un elemento de guion
   */
  updateElemento(escenaId: string, id: string, data: ElementoGuionFormData): Observable<ElementoGuion> {
    return this.api.put<ElementoGuion>(`/api/escenas/${escenaId}/elementos/${id}`, data).pipe(
      tap(updated => this.updateElementosInGuion(escenaId, elementos =>
        elementos.map(e => e.id === id ? updated : e)
      ))
    );
  }

  /**
   * Elimina un elemento de guion
   */
  deleteElemento(escenaId: string, id: string): Observable<void> {
    return this.api.delete<void>(`/api/escenas/${escenaId}/elementos/${id}`).pipe(
      tap(() => this.updateElementosInGuion(escenaId, elementos =>
        elementos.filter(e => e.id !== id)
      ))
    );
  }

  // ==================== Helpers para actualizar guion actual ====================

  private updatePasadaInGuion(actoId: string, updater: (items: PasadaItem[]) => PasadaItem[]): void {
    this.guionActualSignal.update(guion => {
      if (!guion) return null;
      return {
        ...guion,
        actos: guion.actos.map(acto =>
          acto.id === actoId
            ? { ...acto, pasada: updater(acto.pasada) }
            : acto
        )
      };
    });
  }

  private updateEscenasInGuion(actoId: string, updater: (escenas: Escena[]) => Escena[]): void {
    this.guionActualSignal.update(guion => {
      if (!guion) return null;
      return {
        ...guion,
        actos: guion.actos.map(acto =>
          acto.id === actoId
            ? { ...acto, escenas: updater(acto.escenas) }
            : acto
        )
      };
    });
  }

  private updateElementosInGuion(escenaId: string, updater: (elementos: ElementoGuion[]) => ElementoGuion[]): void {
    this.guionActualSignal.update(guion => {
      if (!guion) return null;
      return {
        ...guion,
        actos: guion.actos.map(acto => ({
          ...acto,
          escenas: acto.escenas.map(escena =>
            escena.id === escenaId
              ? { ...escena, elementos: updater(escena.elementos) }
              : escena
          )
        }))
      };
    });
  }

  // ==================== Utilidades ====================

  /**
   * Limpia el guion actual
   */
  clearGuionActual(): void {
    this.guionActualSignal.set(null);
  }

  /**
   * Cambia la temporada de filtro
   */
  setTemporada(temporada: string): void {
    this.temporadaActualSignal.set(temporada);
  }

  /**
   * Limpia el error
   */
  clearError(): void {
    this.errorSignal.set(null);
  }
}
