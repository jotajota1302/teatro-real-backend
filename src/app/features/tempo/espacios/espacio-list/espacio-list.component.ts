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
    <div>
      <h2 class="text-lg font-semibold mb-4">Espacios</h2>
      <button mat-raised-button color="primary" (click)="abrirForm()">
        <mat-icon>add</mat-icon>
        Nuevo espacio
      </button>
      <table mat-table [dataSource]="espacioService.espacios()" class="mt-4 w-full" multiTemplateDataRows>
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
            <span class="inline-block w-6 h-6 rounded-sm border" [style.background]="espacio.color"></span>
            <span class="ml-1 text-xs text-gray-500">{{ espacio.color }}</span>
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
  `
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
