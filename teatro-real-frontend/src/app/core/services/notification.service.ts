import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, interval } from 'rxjs';
// Importar Notificacion si se dispone, si no dejar tipo any
// import { Notificacion } from './notification.models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly API_URL = `${environment.apiUrl}/notificaciones`;

  private notificacionesSignal = signal<any[]>([]);
  private loadingSignal = signal(false);

  notificaciones = this.notificacionesSignal.asReadonly();
  loading = this.loadingSignal.asReadonly();

  // Contador de no leídas
  unreadCount = computed(() =>
    this.notificacionesSignal().filter(n => !n.leida).length
  );

  constructor(private http: HttpClient) {
    // Polling cada 30 segundos
    interval(30000).subscribe(() => this.loadNotificaciones().subscribe());
    // Cargar notificaciones al arrancar
    this.loadNotificaciones().subscribe();
  }

  loadNotificaciones(): Observable<any[]> {
    this.loadingSignal.set(true);
    return this.http.get<any[]>(this.API_URL).pipe(
      tap(notificaciones => {
        this.notificacionesSignal.set(notificaciones);
        this.loadingSignal.set(false);
      })
    );
  }

  marcarLeida(id: number): Observable<any> {
    return this.http.put<any>(`${this.API_URL}/${id}/read`, {}).pipe(
      tap(updated => {
        this.notificacionesSignal.update(list =>
          list.map(n => n.id === id ? updated : n)
        );
      })
    );
  }

  marcarTodasLeidas(): Observable<void> {
    return this.http.put<void>(`${this.API_URL}/read-all`, {}).pipe(
      tap(() => {
        this.notificacionesSignal.update(list =>
          list.map(n => ({ ...n, leida: true }))
        );
      })
    );
  }
}
