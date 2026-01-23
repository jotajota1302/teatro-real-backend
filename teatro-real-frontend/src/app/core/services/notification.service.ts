import { Injectable, signal, computed } from '@angular/core';
import { Observable, of } from 'rxjs';

/**
 * Servicio de notificaciones - DESHABILITADO TEMPORALMENTE.
 * No hace peticiones al backend para evitar errores cuando no está disponible.
 * TODO: Rehabilitar cuando el backend de notificaciones esté listo.
 */
@Injectable({ providedIn: 'root' })
export class NotificationService {
  private notificacionesSignal = signal<any[]>([]);
  private loadingSignal = signal(false);

  notificaciones = this.notificacionesSignal.asReadonly();
  loading = this.loadingSignal.asReadonly();

  unreadCount = computed(() =>
    this.notificacionesSignal().filter(n => !n.leida).length
  );

  constructor() {
    // NO hacer peticiones al backend - servicio deshabilitado
  }

  loadNotificaciones(): Observable<any[]> {
    // Retornar lista vacía sin hacer peticiones
    return of([]);
  }

  marcarLeida(id: number): Observable<any> {
    // Actualizar solo localmente
    this.notificacionesSignal.update(list =>
      list.map(n => n.id === id ? { ...n, leida: true } : n)
    );
    return of({ id, leida: true });
  }

  marcarTodasLeidas(): Observable<void> {
    this.notificacionesSignal.update(list =>
      list.map(n => ({ ...n, leida: true }))
    );
    return of(undefined);
  }
}
