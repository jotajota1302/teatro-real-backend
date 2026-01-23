import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../core/services/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notification-bell',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="notification-wrapper">
      <button class="bell-button"
              (click)="toggleMenu()"
              [class.has-unread]="notificationService.unreadCount() > 0"
              aria-label="Notificaciones"
              type="button">
        <span class="material-icons">notifications</span>
        @if (notificationService.unreadCount() > 0) {
          <span class="badge">{{ notificationService.unreadCount() > 9 ? '9+' : notificationService.unreadCount() }}</span>
        }
      </button>

      @if (isOpen()) {
        <div class="menu-overlay" (click)="closeMenu()"></div>
        <div class="notification-menu">
          <div class="menu-header">
            <span class="menu-title">Notificaciones</span>
            @if (notificationService.unreadCount() > 0) {
              <button class="mark-read-btn" (click)="markAllRead($event)">
                Marcar leídas
              </button>
            }
          </div>

          @if (notificationService.notificaciones().length === 0) {
            <div class="empty-state">
              <span class="material-icons empty-icon">notifications_none</span>
              <p>No hay notificaciones</p>
            </div>
          } @else {
            <div class="notification-list">
              @for (notif of notificationService.notificaciones() | slice:0:10; track notif.id) {
                <div class="notification-item"
                     [class.unread]="!notif.leida"
                     (click)="onNotificationClick(notif)">
                  <div class="notif-icon" [class]="getIconClass(notif.tipo)">
                    <span class="material-icons">{{ getIcon(notif.tipo) }}</span>
                  </div>
                  <div class="notif-content">
                    <p class="notif-title">{{ notif.titulo }}</p>
                    <p class="notif-message">{{ notif.mensaje }}</p>
                    <p class="notif-time">{{ notif.createdAt | date:'short' }}</p>
                  </div>
                </div>
              }
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .notification-wrapper {
      position: relative;
    }

    .bell-button {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
      position: relative;
    }

    .bell-button:hover {
      background: rgba(255, 255, 255, 0.2);
    }

    .bell-button .material-icons {
      font-size: 22px;
    }

    .badge {
      position: absolute;
      top: -4px;
      right: -4px;
      min-width: 18px;
      height: 18px;
      padding: 0 5px;
      background: #CF102D;
      color: white;
      font-size: 11px;
      font-weight: 700;
      border-radius: 9px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid #1a1a2e;
    }

    .menu-overlay {
      position: fixed;
      inset: 0;
      z-index: 999;
    }

    .notification-menu {
      position: absolute;
      top: calc(100% + 8px);
      right: 0;
      width: 320px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
      z-index: 1000;
      overflow: hidden;
    }

    .menu-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      background: #f8f9fa;
      border-bottom: 1px solid #e5e7eb;
    }

    .menu-title {
      font-weight: 600;
      font-size: 14px;
      color: #1f2937;
    }

    .mark-read-btn {
      background: none;
      border: none;
      color: #CF102D;
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      padding: 4px 8px;
      border-radius: 4px;
      transition: background 0.2s;
    }

    .mark-read-btn:hover {
      background: rgba(207, 16, 45, 0.1);
    }

    .empty-state {
      padding: 32px 16px;
      text-align: center;
      color: #9ca3af;
    }

    .empty-icon {
      font-size: 40px;
      margin-bottom: 8px;
      opacity: 0.5;
    }

    .empty-state p {
      font-size: 14px;
    }

    .notification-list {
      max-height: 320px;
      overflow-y: auto;
    }

    .notification-item {
      display: flex;
      gap: 12px;
      padding: 12px 16px;
      cursor: pointer;
      transition: background 0.2s;
      border-bottom: 1px solid #f3f4f6;
    }

    .notification-item:hover {
      background: #f9fafb;
    }

    .notification-item.unread {
      background: #eff6ff;
    }

    .notification-item.unread:hover {
      background: #dbeafe;
    }

    .notif-icon {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .notif-icon .material-icons {
      font-size: 20px;
    }

    .notif-icon.info {
      background: #dbeafe;
      color: #2563eb;
    }

    .notif-icon.warning {
      background: #fef3c7;
      color: #d97706;
    }

    .notif-icon.error {
      background: #fee2e2;
      color: #dc2626;
    }

    .notif-icon.default {
      background: #f3f4f6;
      color: #6b7280;
    }

    .notif-content {
      flex: 1;
      min-width: 0;
    }

    .notif-title {
      font-size: 13px;
      font-weight: 600;
      color: #1f2937;
      margin: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .notif-message {
      font-size: 12px;
      color: #6b7280;
      margin: 4px 0 0;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .notif-time {
      font-size: 11px;
      color: #9ca3af;
      margin: 4px 0 0;
    }
  `]
})
export class NotificationBellComponent {
  notificationService = inject(NotificationService);
  private router = inject(Router);

  isOpen = signal(false);

  toggleMenu(): void {
    this.isOpen.update(v => !v);
  }

  closeMenu(): void {
    this.isOpen.set(false);
  }

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
      case 'INFO': return 'info';
      case 'WARNING': return 'warning';
      case 'ERROR': return 'error';
      default: return 'default';
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
    this.closeMenu();
    // Navegación contextual según tipo
    if (notif.entidadTipo === 'GUION' && notif.entidadId) {
      this.router.navigate(['/tops/editor', notif.entidadId]);
    } else if (notif.entidadTipo === 'ACTIVIDAD' && notif.entidadId) {
      this.router.navigate(['/tempo/actividad', notif.entidadId]);
    }
  }
}
