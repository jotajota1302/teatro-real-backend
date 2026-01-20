import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// Importar los componentes standalone de NotificationBell y TemporadaSelector
import { NotificationBellComponent } from '../../shared/components/notification-bell/notification-bell.component';
import { TemporadaSelectorComponent } from '../../shared/components/temporada-selector/temporada-selector.component';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, NotificationBellComponent, TemporadaSelectorComponent],
  template: `
    <header class="w-full flex items-center justify-between py-2 px-6 bg-teatro-primary shadow-md z-20">
      <div class="flex items-center gap-3">
        <img src="/assets/images/teatro-real-logo.png" alt="Teatro Real" class="h-10 mr-2" />
        <span class="font-bold text-xl text-teatro-gold">Teatro Real</span>
      </div>
      <div class="flex items-center gap-4 h-12">
        <div class="flex items-center h-11 self-center">
          <app-temporada-selector></app-temporada-selector>
        </div>
        <app-notification-bell class="self-center"></app-notification-bell>
        <button 
          class="btn-logout-theater-real"
          (click)="logout()"
          title="Cerrar sesión"
          aria-label="Cerrar sesión"
        >
          Logout
        </button>
      </div>
    </header>
  `,
  styles: [`
    header {
      min-height: 60px;
    }
    .bg-teatro-primary {
      background-color: #1a1a2e;
    }
    .text-teatro-gold {
      color: #c9a227;
    }
    .btn-logout-theater-real {
      background: transparent;
      color: #CF102D;
      border: 2px solid #CF102D;
      padding: 7px 18px;
      min-width: 0;
      min-height: 32px;
      border-radius: 4px;
      font-family: 'Montserrat', sans-serif;
      font-weight: 600;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      transition: background 0.2s, color 0.2s;
      cursor: pointer;
      outline: none;
      line-height: 1.2;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .btn-logout-theater-real:hover, .btn-logout-theater-real:focus {
      background: #CF102D;
      color: #fff;
    }
  `]
})
export class HeaderComponent {
  constructor(private authService: AuthService) {}

  logout() {
    this.authService.logout();
  }
}
