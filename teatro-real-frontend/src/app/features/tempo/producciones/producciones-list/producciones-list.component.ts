import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

interface ProduccionMock {
  id: number;
  nombre: string;
  estado: string;
  fecha: string;
  tipo: string;
}

@Component({
  selector: 'app-producciones-list',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="producciones-container">
      <h2 class="producciones-title">Producciones Activas</h2>
      <ul class="producciones-list">
        <li *ngFor="let prod of producciones" class="produccion-item">
          <div class="produccion-header">
            <span class="produccion-nombre">{{ prod.nombre }}</span>
            <span class="produccion-badge badge-en-temporada" *ngIf="prod.estado === 'En temporada'">{{ prod.estado }}</span>
            <span class="produccion-badge badge-finalizada" *ngIf="prod.estado === 'Finalizada'">{{ prod.estado }}</span>
          </div>
          <div class="produccion-details">
            <span class="detail-item">
              <span class="material-icons">event</span>
              {{ prod.fecha }}
            </span>
            <span class="detail-item">
              <span class="material-icons">category</span>
              {{ prod.tipo }}
            </span>
          </div>
        </li>
      </ul>
      <div *ngIf="producciones.length === 0" class="empty-state">No hay producciones activas actualmente.</div>
    </div>
  `,
  styles: [`
    .producciones-container {
      padding: 1.5rem;
    }

    .producciones-title {
      font-size: 1.125rem;
      font-weight: 700;
      margin-bottom: 1rem;
      color: #CF102D;
    }

    .producciones-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .produccion-item {
      background: #f9fafb;
      border-radius: 0.75rem;
      padding: 0.875rem;
      margin-bottom: 0.625rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      transition: transform 0.15s ease;
    }

    .produccion-item:hover {
      transform: translateY(-1px);
    }

    .produccion-header {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
    }

    .produccion-nombre {
      font-weight: 600;
      font-size: 0.9375rem;
      color: #1f2937;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 200px;
    }

    .produccion-badge {
      font-size: 0.65rem;
      font-weight: 600;
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      text-transform: uppercase;
      letter-spacing: 0.025em;
      white-space: nowrap;
    }

    .badge-en-temporada {
      background: #CF102D;
      color: white;
    }

    .badge-finalizada {
      background: #10b981;
      color: white;
    }

    .produccion-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      font-size: 0.75rem;
      color: #6b7280;
    }

    .detail-item {
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .detail-item .material-icons {
      font-size: 14px;
      width: 14px;
      height: 14px;
      color: #9ca3af;
    }

    .empty-state {
      color: #9ca3af;
      padding: 1rem 0;
      text-align: center;
    }

    /* Responsive */
    @media (max-width: 480px) {
      .producciones-container {
        padding: 1rem 0.75rem;
      }

      .producciones-title {
        font-size: 1rem;
      }

      .produccion-item {
        padding: 0.75rem;
      }

      .produccion-nombre {
        max-width: 180px;
        font-size: 0.875rem;
      }

      .produccion-details {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.25rem;
      }
    }

    @media (max-width: 390px) {
      .producciones-container {
        padding: 0.75rem 0.5rem;
      }

      .produccion-nombre {
        max-width: 150px;
      }

      .produccion-badge {
        font-size: 0.6rem;
        padding: 0.15rem 0.375rem;
      }
    }

    /* Touch devices */
    @media (pointer: coarse) {
      .produccion-item {
        min-height: 60px;
      }

      .produccion-item:active {
        transform: scale(0.98);
      }
    }
  `]
})
export class ProduccionesListComponent {
  producciones: ProduccionMock[] = [
    {
      id: 1,
      nombre: 'Carmen',
      estado: 'En temporada',
      fecha: '2026-01-24',
      tipo: 'Ópera'
    },
    {
      id: 2,
      nombre: 'El Lago de los Cisnes',
      estado: 'En temporada',
      fecha: '2026-02-14',
      tipo: 'Ballet'
    },
    {
      id: 3,
      nombre: 'Festival Flamenco',
      estado: 'Finalizada',
      fecha: '2025-12-11',
      tipo: 'Flamenco'
    }
  ];
}
