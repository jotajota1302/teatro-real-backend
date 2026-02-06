// Listado de espacios admin (standalone, Angular Material Table, CRUD)
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { EspacioService } from '../../services/espacio.service';
import { Espacio } from '../../models/actividad.model';

@Component({
  selector: 'app-espacio-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule
  ],
  template: `
    <div class="espacio-list-container">
      <div class="list-header">
        <h2 class="list-title">Espacios</h2>
        <button mat-raised-button color="primary" class="btn-nuevo" (click)="abrirForm()">
          <mat-icon>add</mat-icon>
          <span class="btn-text">Nuevo espacio</span>
        </button>
      </div>

      <!-- Mobile cards view -->
      <div class="mobile-cards">
        <div class="espacio-card" *ngFor="let espacio of espacioService.espacios()">
          <div class="card-color-bar" [style.background]="espacio.color"></div>
          <div class="card-content">
            <div class="card-header">
              <span class="card-nombre">{{ espacio.nombre }}</span>
              <span class="card-tipo">{{ espacio.tipo }}</span>
            </div>
            <div class="card-details">
              <span class="card-capacidad" *ngIf="espacio.capacidad">
                <mat-icon>people</mat-icon> {{ espacio.capacidad }}
              </span>
              <span class="card-color-code">{{ espacio.color }}</span>
            </div>
          </div>
          <div class="card-actions">
            <button mat-icon-button color="primary" (click)="abrirForm(espacio)" aria-label="Editar">
              <mat-icon>edit</mat-icon>
            </button>
            <button mat-icon-button color="warn" (click)="eliminar(espacio)" aria-label="Eliminar">
              <mat-icon>delete</mat-icon>
            </button>
          </div>
        </div>
      </div>

      <!-- Desktop table view -->
      <div class="table-scroll-wrapper">
        <table mat-table [dataSource]="espacioService.espacios()" class="espacios-table" multiTemplateDataRows>
          <ng-container matColumnDef="nombre">
            <th mat-header-cell *matHeaderCellDef>Nombre</th>
            <td mat-cell *matCellDef="let espacio">{{ espacio.nombre }}</td>
          </ng-container>
          <ng-container matColumnDef="tipo">
            <th mat-header-cell *matHeaderCellDef>Tipo</th>
            <td mat-cell *matCellDef="let espacio">{{ espacio.tipo }}</td>
          </ng-container>
          <ng-container matColumnDef="capacidad">
            <th mat-header-cell *matHeaderCellDef>Capacidad</th>
            <td mat-cell *matCellDef="let espacio">{{ espacio.capacidad ?? '-' }}</td>
          </ng-container>
          <ng-container matColumnDef="color">
            <th mat-header-cell *matHeaderCellDef>Color</th>
            <td mat-cell *matCellDef="let espacio">
              <span class="color-swatch" [style.background]="espacio.color"></span>
              <span class="color-code">{{ espacio.color }}</span>
            </td>
          </ng-container>
          <ng-container matColumnDef="acciones">
            <th mat-header-cell *matHeaderCellDef>Acciones</th>
            <td mat-cell *matCellDef="let espacio">
              <button mat-icon-button color="primary" (click)="abrirForm(espacio)">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button color="warn" (click)="eliminar(espacio)">
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="columnas"></tr>
          <tr mat-row *matRowDef="let row; columns: columnas"></tr>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .espacio-list-container {
      padding: 1rem;
    }

    .list-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      flex-wrap: wrap;
      gap: 0.75rem;
    }

    .list-title {
      font-size: 1.125rem;
      font-weight: 600;
      margin: 0;
    }

    .btn-nuevo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    /* Table wrapper with scroll */
    .table-scroll-wrapper {
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      border-radius: 8px;
      background: white;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    .espacios-table {
      width: 100%;
      min-width: 500px;
    }

    .color-swatch {
      display: inline-block;
      width: 24px;
      height: 24px;
      border-radius: 4px;
      border: 1px solid rgba(0,0,0,0.1);
      vertical-align: middle;
    }

    .color-code {
      margin-left: 0.5rem;
      font-size: 0.75rem;
      color: #6b7280;
    }

    /* Mobile cards - hidden by default */
    .mobile-cards {
      display: none;
    }

    .espacio-card {
      display: flex;
      background: white;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      margin-bottom: 0.75rem;
      overflow: hidden;
    }

    .card-color-bar {
      width: 6px;
      flex-shrink: 0;
    }

    .card-content {
      flex: 1;
      padding: 0.75rem;
      min-width: 0;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.35rem;
    }

    .card-nombre {
      font-weight: 600;
      font-size: 0.9375rem;
      color: #1f2937;
    }

    .card-tipo {
      font-size: 0.75rem;
      color: #6b7280;
      background: #f3f4f6;
      padding: 0.125rem 0.5rem;
      border-radius: 4px;
    }

    .card-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      font-size: 0.75rem;
      color: #6b7280;
    }

    .card-capacidad {
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .card-capacidad mat-icon {
      font-size: 14px;
      width: 14px;
      height: 14px;
    }

    .card-actions {
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 0.5rem;
      gap: 0.25rem;
    }

    /* Mobile: show cards, hide table */
    @media (max-width: 640px) {
      .espacio-list-container {
        padding: 0.75rem;
      }

      .list-header {
        flex-direction: column;
        align-items: stretch;
      }

      .btn-nuevo {
        width: 100%;
        justify-content: center;
      }

      .table-scroll-wrapper {
        display: none;
      }

      .mobile-cards {
        display: block;
      }

      .card-actions button {
        width: 40px;
        height: 40px;
      }
    }

    /* Touch devices */
    @media (pointer: coarse) {
      .card-actions button {
        min-width: 44px;
        min-height: 44px;
      }

      .btn-nuevo {
        min-height: 44px;
      }
    }
  `]
})
export class EspacioListComponent {
  espacioService = inject(EspacioService);
  dialog = inject(MatDialog);

  columnas = ['nombre', 'tipo', 'capacidad', 'color', 'acciones'];

  abrirForm(espacio?: Espacio): void {
    // Lazy load dinámico del form para no crear dependencia circular
    import('../espacio-form/espacio-form.component').then(({ EspacioFormComponent }) => {
      this.dialog.open(EspacioFormComponent, {
        data: espacio ? { initial: espacio } : undefined,
        width: '500px'
      });
    });
  }

  eliminar(espacio: Espacio): void {
    if (confirm(`¿Eliminar el espacio "${espacio.nombre}"?`)) {
      this.espacioService.delete(espacio.id).subscribe();
    }
  }
}
