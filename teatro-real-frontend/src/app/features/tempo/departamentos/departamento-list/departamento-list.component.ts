// Listado de departamentos (standalone, Angular Material Table, mock servicio)
// Debe mostrar codigo, nombre, color, jefe, personal y acciones
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { Departamento } from '../../models/actividad.model';
// import { DepartamentoService } from '../../services/departamento.service';

@Component({
  selector: 'app-departamento-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule
  ],
  template: `
    <div class="depto-list-container">
      <div class="list-header">
        <h2 class="list-title">Departamentos</h2>
        <button mat-raised-button color="primary" class="btn-nuevo" (click)="abrirForm()">
          <mat-icon>add</mat-icon>
          <span>Nuevo departamento</span>
        </button>
      </div>

      <!-- Mobile cards view -->
      <div class="mobile-cards">
        <div class="depto-card" *ngFor="let depto of departamentos()">
          <div class="card-color-bar" [style.background]="depto.colorHex"></div>
          <div class="card-content">
            <div class="card-header">
              <span class="card-codigo">{{ depto.codigo }}</span>
              <span class="card-nombre">{{ depto.nombre }}</span>
            </div>
            <div class="card-row" *ngIf="depto.jefe">
              <mat-icon>person</mat-icon>
              <span>{{ depto.jefe.nombre }}</span>
            </div>
            <div class="card-row card-personal" *ngIf="depto.personal?.length">
              <mat-icon>groups</mat-icon>
              <span>{{ getPersonal(depto) }}</span>
            </div>
          </div>
          <div class="card-actions">
            <button mat-icon-button color="primary" (click)="abrirForm(depto)" aria-label="Editar">
              <mat-icon>edit</mat-icon>
            </button>
            <button mat-icon-button color="warn" (click)="eliminar(depto)" aria-label="Eliminar">
              <mat-icon>delete</mat-icon>
            </button>
          </div>
        </div>
      </div>

      <!-- Desktop table view -->
      <div class="table-scroll-wrapper">
        <table mat-table [dataSource]="departamentos()" class="depto-table" multiTemplateDataRows>
          <ng-container matColumnDef="codigo">
            <th mat-header-cell *matHeaderCellDef>Código</th>
            <td mat-cell *matCellDef="let depto">{{ depto.codigo }}</td>
          </ng-container>
          <ng-container matColumnDef="nombre">
            <th mat-header-cell *matHeaderCellDef>Nombre</th>
            <td mat-cell *matCellDef="let depto">{{ depto.nombre }}</td>
          </ng-container>
          <ng-container matColumnDef="colorHex">
            <th mat-header-cell *matHeaderCellDef>Color</th>
            <td mat-cell *matCellDef="let depto">
              <span class="color-swatch" [style.background]="depto.colorHex"></span>
              <span class="color-code">{{ depto.colorHex }}</span>
            </td>
          </ng-container>
          <ng-container matColumnDef="jefe">
            <th mat-header-cell *matHeaderCellDef>Jefe</th>
            <td mat-cell *matCellDef="let depto">{{ depto.jefe?.nombre ?? '-' }}</td>
          </ng-container>
          <ng-container matColumnDef="personal">
            <th mat-header-cell *matHeaderCellDef>Personal</th>
            <td mat-cell *matCellDef="let depto" class="personal-cell">{{ getPersonal(depto) }}</td>
          </ng-container>
          <ng-container matColumnDef="acciones">
            <th mat-header-cell *matHeaderCellDef>Acciones</th>
            <td mat-cell *matCellDef="let depto">
              <button mat-icon-button color="primary" (click)="abrirForm(depto)">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button color="warn" (click)="eliminar(depto)">
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
    .depto-list-container {
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

    .depto-table {
      width: 100%;
      min-width: 650px;
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

    .personal-cell {
      max-width: 200px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    /* Mobile cards - hidden by default */
    .mobile-cards {
      display: none;
    }

    .depto-card {
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
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
    }

    .card-codigo {
      font-size: 0.7rem;
      font-weight: 700;
      color: white;
      background: #6b7280;
      padding: 0.125rem 0.375rem;
      border-radius: 4px;
      text-transform: uppercase;
    }

    .card-nombre {
      font-weight: 600;
      font-size: 0.9375rem;
      color: #1f2937;
    }

    .card-row {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      font-size: 0.8rem;
      color: #6b7280;
      margin-bottom: 0.25rem;
    }

    .card-row mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      color: #9ca3af;
    }

    .card-personal {
      font-size: 0.75rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .card-actions {
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 0.5rem;
      gap: 0.25rem;
    }

    /* Mobile: show cards, hide table */
    @media (max-width: 768px) {
      .depto-list-container {
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
export class DepartamentoListComponent {
  // private departamentoService = inject(DepartamentoService);
  dialog = inject(MatDialog);

  // Simulación: mock departamentos
  departamentos = signal<Departamento[]>([
    {
      id: 1, codigo: 'PROD', nombre: 'Producción', ambito: 'TEATRO', colorHex: '#67c23a',
      jefe: { 
        id: 'u1', email: '', nombre: 'Laura Soto', 
        rol: { id: 1, nombre: 'JEFE', descripcion: 'Jefe del departamento', permisos: [] } 
      },
      personal: [
        { id: 'u3', email: '', nombre: 'Nuria Pérez', rol: { id: 2, nombre: 'PERSONAL', descripcion: 'Miembro del departamento', permisos: [] } },
        { id: 'u4', email: '', nombre: 'Javi Díaz', rol: { id: 2, nombre: 'PERSONAL', descripcion: 'Miembro del departamento', permisos: [] } }
      ]
    }
  ]);
  columnas = ['codigo', 'nombre', 'colorHex', 'jefe', 'personal', 'acciones'];

  getPersonal(dep: Departamento): string {
    return dep.personal?.map(p => p.nombre).join(', ') ?? '-';
  }

  abrirForm(depto?: Departamento): void {
    import('../departamento-form/departamento-form.component').then(({ DepartamentoFormComponent }) => {
      this.dialog.open(DepartamentoFormComponent, {
        data: depto ? { initial: depto } : undefined,
        width: '550px'
      });
    });
  }

  eliminar(depto: Departamento): void {
    if (confirm(`¿Eliminar departamento "${depto.nombre}"?`)) {
      // this.departamentoService.delete(depto.id).subscribe();
      // Simulación
      this.departamentos.update(list => list.filter(d => d.id !== depto.id));
    }
  }
}
