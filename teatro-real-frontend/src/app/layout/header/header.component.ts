import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// Importar los componentes standalone de NotificationBell y TemporadaSelector
import { NotificationBellComponent } from '../../shared/components/notification-bell/notification-bell.component';
import { TemporadaSelectorComponent } from '../../shared/components/temporada-selector/temporada-selector.component';

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
      <div class="flex items-center gap-4">
        <app-temporada-selector></app-temporada-selector>
        <app-notification-bell></app-notification-bell>
        <!-- Aquí pueden añadirse en el futuro más widgets como usuario/menú/avatar/etc -->
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
  `]
})
export class HeaderComponent {}
