// teatro-real-frontend/src/app/core/services/global-error.handler.ts

import { ErrorHandler, Injectable, inject, NgZone } from '@angular/core';
import { BackendStatusService } from './backend-status.service';

/**
 * Manejador de errores global que previene que errores no capturados tumben la app.
 * Clasifica errores y evita spam en consola cuando el backend está caído.
 */
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private backendStatus = inject(BackendStatusService);
  private ngZone = inject(NgZone);

  // Evitar spam de errores repetidos
  private lastErrorMessage = '';
  private lastErrorTime = 0;
  private readonly ERROR_DEBOUNCE_MS = 5000;

  handleError(error: any): void {
    // Obtener mensaje de error
    const errorMessage = this.extractErrorMessage(error);

    // Debounce de errores repetidos
    const now = Date.now();
    if (errorMessage === this.lastErrorMessage && (now - this.lastErrorTime) < this.ERROR_DEBOUNCE_MS) {
      return; // Ignorar error repetido
    }
    this.lastErrorMessage = errorMessage;
    this.lastErrorTime = now;

    // Clasificar el error
    if (this.isNetworkError(error)) {
      this.handleNetworkError(error);
    } else if (this.isHttpError(error)) {
      this.handleHttpError(error);
    } else if (this.isChunkLoadError(error)) {
      this.handleChunkLoadError(error);
    } else {
      // Error de aplicación - logear pero no tumbar
      console.error('[App Error]', errorMessage);
    }
  }

  private extractErrorMessage(error: any): string {
    if (error?.message) return error.message;
    if (error?.rejection?.message) return error.rejection.message;
    if (typeof error === 'string') return error;
    return 'Unknown error';
  }

  private isNetworkError(error: any): boolean {
    const message = this.extractErrorMessage(error).toLowerCase();
    return (
      error?.status === 0 ||
      error?.rejection?.status === 0 ||
      message.includes('network error') ||
      message.includes('failed to fetch') ||
      message.includes('net::err') ||
      message.includes('econnrefused') ||
      message.includes('timeout')
    );
  }

  private isHttpError(error: any): boolean {
    return error?.status !== undefined && error?.status !== 0;
  }

  private isChunkLoadError(error: any): boolean {
    const message = this.extractErrorMessage(error).toLowerCase();
    return message.includes('chunkloaderror') || message.includes('loading chunk');
  }

  private handleNetworkError(error: any): void {
    // No logear cada error de red - el BackendStatusService se encarga
    this.backendStatus.reportError(error);

    // Solo mostrar aviso cuando pasa a offline
    if (this.backendStatus.isOffline()) {
      console.warn('[Network] Backend no disponible - trabajando en modo offline');
    }
  }

  private handleHttpError(error: any): void {
    const status = error?.status || error?.rejection?.status;

    switch (status) {
      case 401:
      case 403:
        // Auth errors - ya manejados por el interceptor
        break;
      case 404:
        console.warn('[HTTP 404] Recurso no encontrado');
        break;
      case 500:
      case 502:
      case 503:
        console.error('[HTTP 5xx] Error del servidor');
        this.backendStatus.reportError(error);
        break;
      default:
        console.warn(`[HTTP ${status}] Error de petición`);
    }
  }

  private handleChunkLoadError(error: any): void {
    console.warn('[Chunk] Error cargando módulo - posible actualización pendiente');
    // Opcional: Recargar la página tras un tiempo
    // this.ngZone.runOutsideAngular(() => {
    //   setTimeout(() => window.location.reload(), 3000);
    // });
  }
}
