import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../../core/services/theme.service';

interface MovimientoMock {
  id: number;
  descripcion: string;
  estado: string;
  fecha: string;
  origen: string;
  destino: string;
}

@Component({
  selector: 'app-movimientos-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page" [class]="isDark() ? 'page-dark' : 'page-light'">
      <div class="space-y-6">
        <!-- Header -->
        <div>
          <h1 class="text-3xl font-semibold" [class]="isDark() ? 'text-white' : 'text-gray-800'">Movimientos Pendientes</h1>
          <p [class]="isDark() ? 'text-gray-400' : 'text-gray-500'">Gestión de movimientos en el teatro</p>
        </div>

        <!-- Movimientos List -->
        <div class="movimientos-scroll-container" [class]="isDark() ? 'scroll-container-dark' : 'scroll-container-light'">
          <div class="space-y-4">
            <article *ngFor="let mov of movimientos" [class]="isDark() ? 'card-dark card-hover' : 'card card-hover'">
            <div class="flex gap-4">
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-1">
                  <h2 class="text-lg font-semibold" [class]="isDark() ? 'text-white' : 'text-gray-900'">{{ mov.descripcion }}</h2>
                  <span class="badge-pill" [ngClass]="getEstadoClass(mov.estado)">
                    {{ mov.estado }}
                  </span>
                </div>
                <p class="mb-2" [class]="isDark() ? 'text-gray-300' : 'text-gray-600'">
                  {{ mov.origen }} <span [class]="isDark() ? 'text-gray-500' : 'text-gray-400'">→</span> {{ mov.destino }}
                </p>
                <div class="flex flex-wrap gap-4 text-sm" [class]="isDark() ? 'text-gray-400' : 'text-gray-500'">
                  <span class="flex items-center gap-1">
                    <span class="material-icons text-base">calendar_month</span>
                    {{ mov.fecha }}
                  </span>
                </div>
              </div>
            </div>
          </article>

          <div *ngIf="movimientos.length === 0" [class]="isDark() ? 'card-dark text-center py-12' : 'card text-center py-12'">
            <span class="material-icons text-5xl mb-2" [class]="isDark() ? 'text-gray-600' : 'text-gray-300'">inventory_2</span>
            <p [class]="isDark() ? 'text-gray-400' : 'text-gray-500'">No hay movimientos pendientes actualmente.</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .page {
      padding: 1.5rem 2rem;
      min-height: 100vh;
    }

    .page-light {
      background: #f2f4f7;
    }

    .page-dark {
      background: #1a1a1a;
      border-radius: 1rem;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .card {
      background: #ffffff;
      border-radius: 1rem;
      border: 1px solid rgba(15, 23, 42, 0.08);
      padding: 1.4rem;
      box-shadow: 0 20px 35px rgba(15, 23, 42, 0.1);
    }

    .card-dark {
      background: #1a1a1a;
      border-radius: 1rem;
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 1.4rem;
      box-shadow: 0 20px 35px rgba(0, 0, 0, 0.3);
    }

    .card-hover {
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .card-hover:hover {
      transform: translateY(-3px);
      box-shadow: 0 25px 45px rgba(15, 23, 42, 0.15);
    }

    .card-dark.card-hover:hover {
      box-shadow: 0 25px 45px rgba(0, 0, 0, 0.4);
    }

    .badge-pill {
      padding: 0.25rem 0.75rem;
      border-radius: 999px;
      font-weight: 600;
      font-size: 0.7rem;
      letter-spacing: 0.03em;
      white-space: nowrap;
    }

    .badge-en-transito {
      background: rgba(251, 191, 36, 0.2);
      color: #fbbf24;
    }

    .badge-pendiente {
      background: rgba(207, 16, 45, 0.2);
      color: #CF102D;
    }

    .theater-white {
      color: #ffffff;
    }

    .theater-gray-300 {
      color: #d1d5db;
    }

    .theater-gray-400 {
      color: #9ca3af;
    }

    .theater-gray-500 {
      color: #6b7280;
    }

    /* Scroll Container Styles */
    .movimientos-scroll-container {
      max-height: 600px;
      overflow-y: auto;
      overflow-x: hidden;
      border-radius: 1rem;
      padding-right: 0.5rem;
    }

    .scroll-container-light {
      /* Scrollbar para webkit (Chrome, Safari, Edge) */
    }

    .scroll-container-light::-webkit-scrollbar {
      width: 14px;
    }

    .scroll-container-light::-webkit-scrollbar-track {
      background: #e5e7eb;
      border-radius: 10px;
    }

    .scroll-container-light::-webkit-scrollbar-thumb {
      background: #6b7280;
      border-radius: 10px;
      border: 2px solid #e5e7eb;
    }

    .scroll-container-light::-webkit-scrollbar-thumb:hover {
      background: #4b5563;
    }

    /* Scrollbar para Firefox */
    .scroll-container-light {
      scrollbar-color: #6b7280 #e5e7eb;
      scrollbar-width: thin;
    }

    .scroll-container-dark {
      /* Scrollbar para webkit (Chrome, Safari, Edge) */
    }

    .scroll-container-dark::-webkit-scrollbar {
      width: 14px;
    }

    .scroll-container-dark::-webkit-scrollbar-track {
      background: #2d2d2d;
      border-radius: 10px;
    }

    .scroll-container-dark::-webkit-scrollbar-thumb {
      background: #666666;
      border-radius: 10px;
      border: 2px solid #2d2d2d;
    }

    .scroll-container-dark::-webkit-scrollbar-thumb:hover {
      background: #888888;
    }

    /* Scrollbar para Firefox (tema oscuro) */
    .scroll-container-dark {
      scrollbar-color: #666666 #2d2d2d;
      scrollbar-width: thin;
    }

    /* ================================================
       RESPONSIVE - Mobile Optimization (iPhone 16)
       ================================================ */

    @media (max-width: 768px) {
      .page {
        padding: 1rem 1.25rem;
      }

      .page h1 {
        font-size: 1.5rem !important;
      }

      .movimientos-scroll-container {
        max-height: 65vh;
        padding-right: 0.25rem;
      }

      .card, .card-dark {
        padding: 1rem;
      }
    }

    @media (max-width: 480px) {
      .page {
        padding: 0.75rem;
        min-height: auto;
      }

      .page h1 {
        font-size: 1.375rem !important;
      }

      .page p {
        font-size: 0.875rem;
      }

      .movimientos-scroll-container {
        max-height: 70vh;
        -webkit-overflow-scrolling: touch;
        overscroll-behavior: contain;
        padding-right: 0;
      }

      .card, .card-dark {
        padding: 0.875rem;
        border-radius: 0.75rem;
      }

      .card h2, .card-dark h2 {
        font-size: 1rem !important;
      }

      .badge-pill {
        font-size: 0.65rem;
        padding: 0.2rem 0.5rem;
      }

      .flex.gap-4 {
        gap: 0.75rem;
      }

      .space-y-4 > * + * {
        margin-top: 0.75rem;
      }
    }

    /* iPhone 16 Pro (390px) */
    @media (max-width: 390px) {
      .page {
        padding: 0.625rem;
      }

      .page h1 {
        font-size: 1.25rem !important;
      }

      .movimientos-scroll-container {
        max-height: 72vh;
      }

      .card, .card-dark {
        padding: 0.75rem;
      }
    }

    /* Touch devices */
    @media (pointer: coarse) {
      .movimientos-scroll-container {
        -webkit-overflow-scrolling: touch;
        touch-action: pan-y;
      }

      .card, .card-dark {
        touch-action: pan-y;
      }

      .card-hover:active {
        transform: scale(0.98);
      }
    }
  `]
})
export class MovimientosListComponent {
  private themeService = inject(ThemeService);
  isDark = this.themeService.isDark;

  movimientos: MovimientoMock[] = [
    {
      id: 1,
      descripcion: 'Traslado de escenografía "Carmen"',
      estado: 'En tránsito',
      fecha: '2026-01-22',
      origen: 'Almacén Principal',
      destino: 'Escenario Central'
    },
    {
      id: 2,
      descripcion: 'Entrega de equipación iluminación',
      estado: 'Pendiente',
      fecha: '2026-01-23',
      origen: 'Proveedor X',
      destino: 'Sala de Ensayo 1'
    },
    {
      id: 3,
      descripcion: 'Movimiento de vestuario',
      estado: 'Pendiente',
      fecha: '2026-01-25',
      origen: 'Vestuario',
      destino: 'Camerinos'
    }
  ];

  getEstadoClass(estado: string): string {
    if (estado === 'En tránsito') {
      return 'badge-en-transito';
    } else if (estado === 'Pendiente') {
      return 'badge-pendiente';
    }
    return '';
  }
}
