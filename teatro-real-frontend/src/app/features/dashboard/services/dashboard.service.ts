import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DashboardOverviewResponse } from '../models/dashboard.model';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  constructor(private readonly http: HttpClient) {}

  getOverview(): Observable<DashboardOverviewResponse> {
    return this.http.get<DashboardOverviewResponse>('/api/v1/dashboard/overview');
  }
}
