// teatro-real-frontend/src/app/core/services/backend-status.service.ts

import { Injectable, signal, computed, inject, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription, interval } from 'rxjs';
import { environment } from '../../../environments/environment';

export type BackendStatus = 'online' | 'offline' | 'checking' | 'unknown';

/**
 * Servicio centralizado para gestionar el estado de conexión con el backend.
 * Evita que la app genere errores constantes cuando el backend no está disponible.
 * También incluye keep-alive para evitar que el backend de Render se duerma.
 */
@Injectable({ providedIn: 'root' })
export class BackendStatusService implements OnDestroy {
  private http = inject(HttpClient);

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
  // Intervalo de keep-alive: 5 minutos (evita que Render duerma el servicio)
  private readonly KEEP_ALIVE_INTERVAL = 5 * 60 * 1000;

  private keepAliveSubscription?: Subscription;

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

  /**
   * Inicia el keep-alive que hace ping al backend periódicamente.
   * Evita que el servicio de Render se duerma por inactividad.
   */
  startKeepAlive(): void {
    if (this.keepAliveSubscription) {
      return; // Ya está activo
    }

    console.info('[BackendStatus] Iniciando keep-alive (cada 5 minutos)');

    // Ping inicial
    this.pingHealth();

    // Ping periódico
    this.keepAliveSubscription = interval(this.KEEP_ALIVE_INTERVAL).subscribe(() => {
      this.pingHealth();
    });
  }

  /**
   * Detiene el keep-alive.
   */
  stopKeepAlive(): void {
    if (this.keepAliveSubscription) {
      this.keepAliveSubscription.unsubscribe();
      this.keepAliveSubscription = undefined;
      console.info('[BackendStatus] Keep-alive detenido');
    }
  }

  /**
   * Hace ping al endpoint de health del backend.
   */
  private pingHealth(): void {
    this.http.get<{ status: string }>(`${environment.apiUrl}/health`).subscribe({
      next: () => {
        this.reportSuccess();
        console.debug('[BackendStatus] Keep-alive ping OK');
      },
      error: (err) => {
        this.reportError(err);
        console.warn('[BackendStatus] Keep-alive ping falló', err.status);
      }
    });
  }

  ngOnDestroy(): void {
    this.stopKeepAlive();
  }
}
