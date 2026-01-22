// Listado de tipos de actividad (standalone, Angular Material Table, CRUD)
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { TipoActividadService } from '../../services/tipo-actividad.service';
import { TipoActividad } from '../../models/actividad.model';

@Component({
  selector: 'app-tipo-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule
  ],
  template: `
    <div>
      <h2 class="text-lg font-semibold mb-4">Tipos de Actividad</h2>
      <button mat-raised-button color="primary" (click)="abrirForm()">
        <mat-icon>add</mat-icon>
        Nuevo tipo
      </button>
      <table mat-table [dataSource]="tipoActividadService.tipos()" class="mt-4 w-full" multiTemplateDataRows>
        <ng-container matColumnDef="nombre">
          <th mat-header-cell *matHeaderCellDef>Nombre</th>
          <td mat-cell *matCellDef="let tipo">{{ tipo.nombre }}</td>
        </ng-container>
        <ng-container matColumnDef="colorHex">
          <th mat-header-cell *matHeaderCellDef>Color</th>
          <td mat-cell *matCellDef="let tipo">
            <span class="inline-block w-6 h-6 rounded-sm border" [style.background]="tipo.colorHex"></span>
            <span class="ml-1 text-xs text-gray-500">{{ tipo.colorHex }}</span>
          </td>
        </ng-container>
        <ng-container matColumnDef="descripcion">
          <th mat-header-cell *matHeaderCellDef>Descripción</th>
          <td mat-cell *matCellDef="let tipo">{{ tipo.descripcion ?? '-' }}</td>
        </ng-container>
        <ng-container matColumnDef="orden">
          <th mat-header-cell *matHeaderCellDef>Orden</th>
          <td mat-cell *matCellDef="let tipo">{{ tipo.orden }}</td>
        </ng-container>
        <ng-container matColumnDef="acciones">
          <th mat-header-cell *matHeaderCellDef>Acciones</th>
          <td mat-cell *matCellDef="let tipo">
            <button mat-icon-button color="primary" (click)="abrirForm(tipo)">
              <mat-icon>edit</mat-icon>
            </button>
            <button mat-icon-button color="warn" (click)="eliminar(tipo)">
              <mat-icon>delete</mat-icon>
            </button>
          </td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="columnas"></tr>
        <tr mat-row *matRowDef="let row; columns: columnas"></tr>
      </table>
    </div>
  `
})
export class TipoListComponent {
  tipoActividadService = inject(TipoActividadService);
  dialog = inject(MatDialog);

  columnas = ['nombre', 'colorHex', 'descripcion', 'orden', 'acciones'];

  abrirForm(tipo?: TipoActividad): void {
    // Lazy load dinámico del form
    import('../tipo-form/tipo-form.component').then(({ TipoFormComponent }) => {
      this.dialog.open(TipoFormComponent, {
        data: tipo ? { initial: tipo } : undefined,
        width: '450px'
      });
    });
  }

  eliminar(tipo: TipoActividad): void {
    if (confirm(`¿Eliminar el tipo de actividad "${tipo.nombre}"?`)) {
      this.tipoActividadService.delete(tipo.id).subscribe();
    }
  }
}
