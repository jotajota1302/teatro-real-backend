// Formulario alta/edición de departamento (standalone, Angular Material, ColorPicker)
// Mock usuarios; pendiente integrar UserService real.
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Departamento, Usuario } from '../../models/actividad.model';
// import { DepartamentoService } from '../../services/departamento.service';
import { ColorPickerComponent } from '../../../../shared/components/color-picker/color-picker.component';

@Component({
  selector: 'app-departamento-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    ColorPickerComponent
  ],
  template: `
    <h2 mat-dialog-title>{{ esEdicion ? 'Editar departamento' : 'Nuevo departamento' }}</h2>
    <form [formGroup]="form" (ngSubmit)="guardar()" mat-dialog-content class="flex flex-col gap-4 mt-2">
      <mat-form-field appearance="outline">
        <mat-label>Código</mat-label>
        <input matInput formControlName="codigo" required maxlength="8">
        <mat-error *ngIf="form.controls['codigo'].invalid && form.controls['codigo'].touched">
          Código obligatorio (máx 8).
        </mat-error>
      </mat-form-field>
      <mat-form-field appearance="outline">
        <mat-label>Nombre</mat-label>
        <input matInput formControlName="nombre" required maxlength="40">
        <mat-error *ngIf="form.controls['nombre'].invalid && form.controls['nombre'].touched">
          Nombre obligatorio (máx 40).
        </mat-error>
      </mat-form-field>
      <mat-form-field appearance="outline">
        <mat-label>Ámbito</mat-label>
        <input matInput formControlName="ambito">
      </mat-form-field>
      <mat-form-field appearance="outline">
        <mat-label>Color</mat-label>
        <app-color-picker formControlName="colorHex"></app-color-picker>
      </mat-form-field>
      <mat-form-field appearance="outline">
        <mat-label>Jefe</mat-label>
        <mat-select formControlName="jefeId">
          <mat-option *ngFor="let user of usuarios" [value]="user.id">{{ user.nombre }}</mat-option>
        </mat-select>
      </mat-form-field>
      <mat-form-field appearance="outline">
        <mat-label>Personal</mat-label>
        <mat-select formControlName="personalIds" multiple>
          <mat-option *ngFor="let user of usuarios" [value]="user.id">{{ user.nombre }}</mat-option>
        </mat-select>
      </mat-form-field>
      <mat-form-field appearance="outline">
        <mat-label>Descripción</mat-label>
        <input matInput formControlName="descripcion" maxlength="100">
      </mat-form-field>
      <div class="flex justify-end gap-3 mt-5" mat-dialog-actions>
        <button mat-button mat-dialog-close type="button">Cancelar</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">
          {{ esEdicion ? 'Actualizar' : 'Crear' }}
        </button>
      </div>
    </form>
  `
})
export class DepartamentoFormComponent {
  form: FormGroup;
  esEdicion: boolean = false;
  usuarios: Usuario[] = [
    { id: 'u1', email: '', nombre: 'Laura Soto', rol: { id: 1, nombre: 'GESTOR', descripcion:'', permisos: [] } },
    { id: 'u2', email: '', nombre: 'Marcos Vela', rol: { id: 2, nombre: 'OPERADOR', descripcion:'', permisos: [] } },
    { id: 'u3', email: '', nombre: 'Nuria Pérez', rol: { id: 2, nombre: 'GESTOR', descripcion: '', permisos: [] } },
    { id: 'u4', email: '', nombre: 'Javi Díaz', rol: { id: 3, nombre: 'OPERADOR', descripcion: '', permisos: [] } },
  ];
  // private departamentoService = inject(DepartamentoService);
  private dialogRef = inject(MatDialogRef<DepartamentoFormComponent>);

  constructor() {
    const data = inject(MAT_DIALOG_DATA, { optional: true }) as { initial?: Partial<Departamento> };
    this.esEdicion = !!(data && data.initial);
    this.form = inject(FormBuilder).group({
      codigo: [data?.initial?.codigo ?? '', [Validators.required, Validators.maxLength(8)]],
      nombre: [data?.initial?.nombre ?? '', [Validators.required, Validators.maxLength(40)]],
      ambito: [data?.initial?.ambito ?? ''],
      colorHex: [data?.initial?.colorHex ?? '#e94560'],
      jefeId: [data?.initial?.jefeId ?? null],
      personalIds: [data?.initial?.personalIds ?? []],
      descripcion: [data?.initial?.descripcion ?? '', [Validators.maxLength(100)]]
    });
  }

  guardar(): void {
    if (this.form.invalid) return;
    const datos = this.form.value;
    // if (this.esEdicion) {
    //   this.departamentoService.update(datos.id, datos).subscribe(() => this.dialogRef.close(true));
    // } else {
    //   this.departamentoService.create(datos).subscribe(() => this.dialogRef.close(true));
    // }
    // Simulación:
    this.dialogRef.close(datos);
  }
}
