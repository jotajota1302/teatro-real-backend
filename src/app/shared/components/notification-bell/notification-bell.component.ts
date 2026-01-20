import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { NotificationService } from '../../../core/services/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notification-bell',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatBadgeModule,
    MatMenuModule,
    MatButtonModule,
    MatDividerModule
  ],
  template: `
    <button mat-icon-button [matMenuTriggerFor]="notificationMenu"
            [matBadge]="notificationService.unreadCount()"
            [matBadgeHidden]="notificationService.unreadCount() === 0"
            matBadgeColor="warn"
            matBadgeSize="small"
            aria-label="Notificaciones"
            aria-haspopup="true"
            aria-controls="notification-menu"
            type="button">
      <mat-icon>notifications</mat-icon>
    </button>

    <mat-menu #notificationMenu="matMenu" class="notification-menu w-80" id="notification-menu">
      <div class="p-3 flex justify-between items-center border-b">
        <span class="font-semibold">Notificaciones</span>
        <button *ngIf="notificationService.unreadCount() > 0"
                mat-button color="primary"
                (click)="markAllRead($event)">
          Marcar todas leídas
        </button>
      </div>
      <ng-container *ngIf="notificationService.notificaciones().length === 0; else notifList">
        <div class="p-4 text-center text-gray-500">
          No hay notificaciones
        </div>
      </ng-container>
      <ng-template #notifList>
        <div class="max-h-96 overflow-y-auto">
          <div *ngFor="let notif of notificationService.notificaciones() | slice:0:10; trackBy:trackById"
               class="notification-item p-3 border-b cursor-pointer"
               [class.bg-blue-50]="!notif.leida"
               (click)="onNotificationClick(notif)"
               role="menuitem"
               tabindex="0"
               [attr.aria-label]="notif.titulo + (notif.leida ? ' leída' : ' no leída')"
          >
            <div class="flex items-start gap-2">
              <mat-icon [ngClass]="getIconClass(notif.tipo)">
                {{ getIcon(notif.tipo) }}
              </mat-icon>
              <div class="flex-1">
                <p class="font-medium text-sm">{{ notif.titulo }}</p>
                <p class="text-xs text-gray-500 mt-1">{{ notif.mensaje }}</p>
                <p class="text-xs text-gray-400 mt-1">
                  {{ notif.createdAt | date:'short' }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </ng-template>
    </mat-menu>
  `,
  styles: [`
    .notification-menu {
      max-height: 400px;
      overflow-y: auto;
    }
  `]
})
export class NotificationBellComponent {
  notificationService = inject(NotificationService);
  private router = inject(Router);

  trackById = (_: number, notif: any) => notif.id;

  getIcon(tipo: string): string {
    switch (tipo) {
      case 'INFO': return 'info';
      case 'WARNING': return 'warning';
      case 'ERROR': return 'error';
      case 'CAMBIO_GUION': return 'description';
      case 'ACTIVIDAD_MODIFICADA': return 'event';
      default: return 'notifications';
    }
  }

  getIconClass(tipo: string): string {
    switch (tipo) {
      case 'INFO': return 'text-blue-500';
      case 'WARNING': return 'text-yellow-500';
      case 'ERROR': return 'text-red-500';
      default: return 'text-gray-500';
    }
  }

  markAllRead(event: Event): void {
    event.stopPropagation();
    this.notificationService.marcarTodasLeidas().subscribe();
  }

  onNotificationClick(notif: any): void {
    if (!notif.leida) {
      this.notificationService.marcarLeida(notif.id).subscribe();
    }
    // Navegación contextual según tipo
    if (notif.entidadTipo === 'GUION' && notif.entidadId) {
      this.router.navigate(['/tops/editor', notif.entidadId]);
    } else if (notif.entidadTipo === 'ACTIVIDAD' && notif.entidadId) {
      this.router.navigate(['/tempo/actividad', notif.entidadId]);
    }
  }
}
