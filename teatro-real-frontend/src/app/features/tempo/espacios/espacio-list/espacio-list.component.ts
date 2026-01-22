// Listado de espacios admin (standalone, Angular Material Table, CRUD)
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
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
    MatDialogModule,
    MatProgressBarModule
  ],
  template: `
    <section class="space-y-5">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p class="text-xs uppercase tracking-[0.3em] text-gray-500">Módulo TEMPO</p>
          <h2 class="text-2xl font-semibold">Gestión de espacios</h2>
        </div>
        <button mat-raised-button color="primary" (click)="abrirForm()">
          <mat-icon>add</mat-icon>
          Nuevo espacio
        </button>
      </div>

      <mat-progress-bar *ngIf="espacioService.loading()" mode="indeterminate" color="accent"></mat-progress-bar>

      <div *ngIf="!espacioService.loading() && espacioService.espacios().length === 0" class="rounded-xl border border-dashed border-gray-300 p-6 text-center text-sm text-gray-600">
        No hay espacios registrados todavía. Pulsa el botón “Nuevo espacio” para empezar.
      </div>

      <div *ngIf="espacioService.espacios().length > 0" class="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table mat-table [dataSource]="espacioService.espacios()" class="min-w-full" multiTemplateDataRows>

          <ng-container matColumnDef="nombre">
            <th mat-header-cell *matHeaderCellDef class="font-semibold">Nombre</th>
            <td mat-cell *matCellDef="let espacio">{{ espacio.nombre }}</td>
          </ng-container>

          <ng-container matColumnDef="tipo">
            <th mat-header-cell *matHeaderCellDef class="font-semibold">Tipo</th>
            <td mat-cell *matCellDef="let espacio">{{ espacio.tipo }}</td>
          </ng-container>

          <ng-container matColumnDef="capacidad">
            <th mat-header-cell *matHeaderCellDef class="font-semibold">Capacidad</th>
            <td mat-cell *matCellDef="let espacio">{{ espacio.capacidad ?? '-' }}</td>
          </ng-container>

          <ng-container matColumnDef="ubicacion">
            <th mat-header-cell *matHeaderCellDef class="font-semibold">Ubicación</th>
            <td mat-cell *matCellDef="let espacio">{{ espacio.ubicacion ?? '-' }}</td>
          </ng-container>

          <ng-container matColumnDef="color">
            <th mat-header-cell *matHeaderCellDef class="font-semibold">Color</th>
            <td mat-cell *matCellDef="let espacio" class="flex items-center gap-2">
              <span class="inline-block h-5 w-5 rounded-sm border" [style.background]="espacio.color || '#d1d5db'"></span>
              <span class="text-xs text-gray-500">{{ espacio.color || 'Sin color' }}</span>
            </td>
          </ng-container>

          <ng-container matColumnDef="acciones">
            <th mat-header-cell *matHeaderCellDef class="font-semibold text-right">Acciones</th>
            <td mat-cell *matCellDef="let espacio" class="text-right">
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
    </section>
  `
})
export class EspacioListComponent implements OnInit {
  espacioService = inject(EspacioService);
  dialog = inject(MatDialog);

  columnas = ['nombre', 'tipo', 'capacidad', 'ubicacion', 'color', 'acciones'];

  ngOnInit(): void {
    this.espacioService.loadEspacios().subscribe();
  }

  abrirForm(espacio?: Espacio): void {
    import('../espacio-form/espacio-form.component').then(({ EspacioFormComponent }) => {
      this.dialog.open(EspacioFormComponent, {
        data: espacio ? { initial: espacio } : undefined,
        width: '520px'
      });
    });
  }

  eliminar(espacio: Espacio): void {
    if (confirm(`¿Eliminar el espacio "${espacio.nombre}"?`)) {
      this.espacioService.delete(espacio.id).subscribe();
    }
  }
}
