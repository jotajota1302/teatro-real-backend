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
    <div>
      <h2 class="text-lg font-semibold mb-4">Departamentos</h2>
      <button mat-raised-button color="primary" (click)="abrirForm()">
        <mat-icon>add</mat-icon>
        Nuevo departamento
      </button>
      <table mat-table [dataSource]="departamentos()" class="mt-4 w-full" multiTemplateDataRows>
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
            <span class="inline-block w-6 h-6 rounded-sm border" [style.background]="depto.colorHex"></span>
            <span class="ml-1 text-xs text-gray-500">{{ depto.colorHex }}</span>
          </td>
        </ng-container>
        <ng-container matColumnDef="jefe">
          <th mat-header-cell *matHeaderCellDef>Jefe</th>
          <td mat-cell *matCellDef="let depto">{{ depto.jefe?.nombre ?? '-' }}</td>
        </ng-container>
        <ng-container matColumnDef="personal">
          <th mat-header-cell *matHeaderCellDef>Personal</th>
          <td mat-cell *matCellDef="let depto">{{ getPersonal(depto) }}</td>
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
  `
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
