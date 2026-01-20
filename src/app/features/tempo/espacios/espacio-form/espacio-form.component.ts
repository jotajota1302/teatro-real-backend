// Formulario para crear/editar espacios (standalone, Angular Material + ColorPicker)
import { Component, inject, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { EspacioService } from '../../services/espacio.service';
import { Espacio } from '../../models/actividad.model';
// Importa el ColorPicker si existe en shared/components/color-picker/
import { ColorPickerComponent } from '../../../../shared/components/color-picker/color-picker.component';

@Component({
  selector: 'app-espacio-form',
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
    <h2 mat-dialog-title>{{ esEdicion ? 'Editar espacio' : 'Nuevo espacio' }}</h2>
    <form [formGroup]="form" (ngSubmit)="guardar()" mat-dialog-content class="flex flex-col gap-4 mt-2">
      <mat-form-field appearance="outline">
        <mat-label>Nombre</mat-label>
        <input matInput formControlName="nombre" required maxlength="40">
        <mat-error *ngIf="form.controls['nombre'].invalid && form.controls['nombre'].touched">
          El nombre es obligatorio (máx 40 caracteres)
        </mat-error>
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Tipo</mat-label>
        <mat-select formControlName="tipo" required>
          <mat-option value="SALA">Sala</mat-option>
          <mat-option value="ALMACEN">Almacén</mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Capacidad</mat-label>
        <input matInput type="number" formControlName="capacidad" min="0">
        <mat-error *ngIf="form.controls['capacidad'].invalid && form.controls['capacidad'].touched">
          La capacidad debe ser un número ≥ 0
        </mat-error>
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Ubicación</mat-label>
        <input matInput formControlName="ubicacion">
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Orden</mat-label>
        <input matInput type="number" formControlName="orden" min="0">
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Dimensiones</mat-label>
        <input matInput formControlName="dimensiones">
      </mat-form-field>

      <app-color-picker formControlName="color"></app-color-picker>

      <div class="flex justify-end gap-3 mt-5" mat-dialog-actions>
        <button mat-button mat-dialog-close type="button">Cancelar</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">
          {{ esEdicion ? 'Actualizar' : 'Crear' }}
        </button>
      </div>
    </form>
  `
})
export class EspacioFormComponent {
  form: FormGroup;
  esEdicion: boolean = false;

  private dialogRef = inject(MatDialogRef<EspacioFormComponent>);
  private espacioService = inject(EspacioService);

  constructor() {
    const data = inject(MAT_DIALOG_DATA, { optional: true }) as { initial?: Espacio };
    this.esEdicion = !!(data && data.initial);
    this.form = inject(FormBuilder).group({
      nombre: [data?.initial?.nombre ?? '', [Validators.required, Validators.maxLength(40)]],
      tipo: [data?.initial?.tipo ?? 'SALA', Validators.required],
      capacidad: [data?.initial?.capacidad ?? null, [Validators.min(0)]],
      ubicacion: [data?.initial?.ubicacion ?? ''],
      orden: [data?.initial?.orden ?? 0, [Validators.min(0)]],
      dimensiones: [data?.initial?.dimensiones ?? ''],
      color: [data?.initial?.color ?? '#c9a227']
    });
  }

  guardar(): void {
    if (this.form.invalid) return;
    const datos = this.form.value;
    if (this.esEdicion) {
      this.espacioService.update(datos.id, datos).subscribe(() => this.dialogRef.close(true));
    } else {
      this.espacioService.create(datos).subscribe(() => this.dialogRef.close(true));
    }
  }
}
