import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, catchError } from 'rxjs';
import { DashboardOverviewResponse } from '../models/dashboard.model';

// Datos de fallback cuando el backend no está disponible
const FALLBACK_DASHBOARD: DashboardOverviewResponse = {
  stats: [
    { title: 'Actividades Hoy', value: '-', icon: 'event', color: '#CF102D' },
    { title: 'Espacios Activos', value: '-', icon: 'meeting_room', color: '#1E3A5F' },
    { title: 'Producción Actual', value: '-', icon: 'theater_comedy', color: '#2E7D32' },
    { title: 'Notificaciones', value: '-', icon: 'notifications', color: '#E57373' }
  ],
  todayActivities: [],
  upcomingEvents: []
};

@Injectable({ providedIn: 'root' })
export class DashboardService {
  constructor(private readonly http: HttpClient) {}

  getOverview(): Observable<DashboardOverviewResponse> {
    return this.http.get<DashboardOverviewResponse>('/api/v1/dashboard/overview').pipe(
      catchError(() => {
        console.warn('[DashboardService] Backend no disponible - usando datos vacíos');
        return of(FALLBACK_DASHBOARD);
      })
    );
  }
}
