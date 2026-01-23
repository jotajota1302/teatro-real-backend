import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackendStatusService } from '../../core/services/backend-status.service';

/**
 * Indicador visual del estado de conexión con el backend.
 * Muestra una barra de aviso cuando el backend no está disponible.
 */
@Component({
  selector: 'app-backend-status-indicator',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (showBanner()) {
      <div class="backend-status-banner" [class.offline]="isOffline()" [class.checking]="isChecking()">
        <div class="banner-content">
          @if (isOffline()) {
            <span class="material-icons">cloud_off</span>
            <span class="message">Servidor no disponible - Trabajando en modo local</span>
            <button class="retry-btn" (click)="retry()">
              <span class="material-icons">refresh</span>
              Reintentar
            </button>
          } @else if (isChecking()) {
            <span class="material-icons spin">sync</span>
            <span class="message">Reconectando con el servidor...</span>
          }
        </div>
      </div>
    }
  `,
  styles: [`
    .backend-status-banner {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 9999;
      padding: 8px 16px;
      font-size: 0.875rem;
      font-weight: 500;
      display: flex;
      justify-content: center;
      animation: slideDown 0.3s ease-out;
    }

    @keyframes slideDown {
      from {
        transform: translateY(-100%);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    .offline {
      background: linear-gradient(90deg, #DC2626, #B91C1C);
      color: white;
    }

    .checking {
      background: linear-gradient(90deg, #F59E0B, #D97706);
      color: white;
    }

    .banner-content {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .material-icons {
      font-size: 18px;
    }

    .spin {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .message {
      margin-right: 8px;
    }

    .retry-btn {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 4px 12px;
      background: rgba(255, 255, 255, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.4);
      border-radius: 4px;
      color: white;
      font-size: 0.75rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .retry-btn:hover {
      background: rgba(255, 255, 255, 0.3);
    }

    .retry-btn .material-icons {
      font-size: 14px;
    }
  `]
})
export class BackendStatusIndicatorComponent {
  private backendStatus = inject(BackendStatusService);

  isOffline = computed(() => this.backendStatus.status() === 'offline');
  isChecking = computed(() => this.backendStatus.status() === 'checking');
  showBanner = computed(() => this.isOffline() || this.isChecking());

  retry(): void {
    this.backendStatus.forceRetry();
  }
}
