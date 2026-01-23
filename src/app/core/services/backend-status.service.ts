// teatro-real-frontend/src/app/core/services/backend-status.service.ts

import { Injectable, signal, computed } from '@angular/core';

export type BackendStatus = 'online' | 'offline' | 'checking' | 'unknown';

/**
 * Servicio centralizado para gestionar el estado de conexión con el backend.
 * Evita que la app genere errores constantes cuando el backend no está disponible.
 */
@Injectable({ providedIn: 'root' })
export class BackendStatusService {
  private statusSignal = signal<BackendStatus>('unknown');
  private lastCheckSignal = signal<Date | null>(null);
  private errorCountSignal = signal<number>(0);
  private consecutiveErrorsSignal = signal<number>(0);

  // Públicos
  status = this.statusSignal.asReadonly();
  lastCheck = this.lastCheckSignal.asReadonly();
  errorCount = this.errorCountSignal.asReadonly();

  isOnline = computed(() => this.statusSignal() === 'online');
  isOffline = computed(() => this.statusSignal() === 'offline');

  // Umbral para considerar backend caído (3 errores consecutivos)
  private readonly ERROR_THRESHOLD = 3;
  // Tiempo mínimo entre checks (30 segundos)
  private readonly MIN_CHECK_INTERVAL = 30000;

  /**
   * Reporta un error de red/conexión.
   * Después de N errores consecutivos, marca el backend como offline.
   */
  reportError(error: any): void {
    this.errorCountSignal.update(c => c + 1);
    this.consecutiveErrorsSignal.update(c => c + 1);

    if (this.consecutiveErrorsSignal() >= this.ERROR_THRESHOLD) {
      this.statusSignal.set('offline');
      console.warn(`[BackendStatus] Backend marcado como OFFLINE después de ${this.ERROR_THRESHOLD} errores consecutivos`);
    }
  }

  /**
   * Reporta una respuesta exitosa del backend.
   * Resetea el contador de errores y marca como online.
   */
  reportSuccess(): void {
    this.consecutiveErrorsSignal.set(0);
    if (this.statusSignal() !== 'online') {
      this.statusSignal.set('online');
      console.info('[BackendStatus] Backend ONLINE');
    }
    this.lastCheckSignal.set(new Date());
  }

  /**
   * Determina si se debe permitir una petición HTTP.
   * Retorna false si el backend está offline para evitar errores innecesarios.
   */
  shouldAllowRequest(): boolean {
    const status = this.statusSignal();

    // Si está offline, verificar si ha pasado suficiente tiempo para reintentar
    if (status === 'offline') {
      const lastCheck = this.lastCheckSignal();
      if (lastCheck) {
        const elapsed = Date.now() - lastCheck.getTime();
        if (elapsed < this.MIN_CHECK_INTERVAL) {
          return false;
        }
      }
    }

    return true;
  }

  /**
   * Fuerza un reintento marcando el estado como checking.
   */
  forceRetry(): void {
    this.statusSignal.set('checking');
    this.consecutiveErrorsSignal.set(0);
    console.info('[BackendStatus] Forzando reintento de conexión');
  }

  /**
   * Resetea todo el estado (útil para logout o cambio de contexto).
   */
  reset(): void {
    this.statusSignal.set('unknown');
    this.errorCountSignal.set(0);
    this.consecutiveErrorsSignal.set(0);
    this.lastCheckSignal.set(null);
  }
}
