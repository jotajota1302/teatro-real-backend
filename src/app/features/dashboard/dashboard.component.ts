import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsyncPipe, NgIf, NgFor } from '@angular/common';
import { Observable } from 'rxjs';
import { DashboardService } from './services/dashboard.service';
import { DashboardOverviewResponse, Stat, Activity, Event } from './models/dashboard.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgIf, NgFor, AsyncPipe],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-white">Vista Global</h1>
          <p class="text-tr-gray-400">Resumen de actividades del Teatro Real</p>
        </div>
        <button class="btn-primary flex items-center gap-2">
          <span class="material-icons text-lg">add</span>
          Nueva Actividad
        </button>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" *ngIf="overview$ | async as overview">
        <div class="card" *ngFor="let stat of overview.stats">
          <div class="flex items-center gap-3">
            <span class="material-icons text-xl" [style.color]="stat.color">{{ stat.icon }}</span>
            <div>
              <p class="text-sm text-tr-gray-400">{{ stat.title }}</p>
              <p class="text-lg font-semibold">{{ stat.value }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6" *ngIf="overview$ | async as overview">
        <div class="lg:col-span-2 card">
          <h2 class="text-white font-semibold text-lg mb-4">Actividades de hoy</h2>
          <div class="space-y-4">
            <div class="flex gap-3 items-start" *ngFor="let activity of overview.todayActivities">
              <div class="w-1.5 rounded-full" [style.background]="activity.color"></div>
              <div class="flex-1">
                <div class="flex items-center justify-between">
                  <h3 class="text-white font-medium truncate">{{ activity.title }}</h3>
                  <span class="badge" [style.background]="activity.color + '33'">{{ activity.type }}</span>
                </div>
                <p class="text-tr-gray-400">{{ activity.location }} · {{ activity.time }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="card">
          <h2 class="text-white font-semibold text-lg mb-4">Próximos eventos</h2>
          <ul class="space-y-3">
            <li *ngFor="let event of overview.upcomingEvents" class="flex items-center justify-between">
              <span>{{ event.title }}</span>
              <span class="text-tr-gray-400">{{ event.date }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .text-tr-gray-400 { color: #bdc6d3; }
    .btn-primary {
      background: #CF102D;
      color: white;
      padding: 0.65rem 1.25rem;
      border-radius: 999px;
      border: none;
      font-weight: 500;
      transition: background 0.3s ease;
    }
    .btn-primary:hover { background: #a10b23; }
    .card {
      background: #0d0e15;
      padding: 1.25rem;
      border-radius: 0.75rem;
      box-shadow: 0 35px 120px rgba(0,0,0,0.45);
    }
    .badge {
      padding: 0.1rem 0.65rem;
      border-radius: 999px;
      font-size: 0.75rem;
      color: #fff;
    }
  `]
})
export class DashboardComponent implements OnInit {
  overview$: Observable<DashboardOverviewResponse>;

  constructor(private dashboardService: DashboardService) {
    this.overview$ = this.dashboardService.getOverview();
  }

  ngOnInit(): void {}
}
