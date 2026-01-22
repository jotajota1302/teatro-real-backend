// Formulario para crear/editar tipos de actividad (standalone + ColorPicker)
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TipoActividadService } from '../../services/tipo-actividad.service';
import { TipoActividad } from '../../models/actividad.model';
import { ColorPickerComponent } from '../../../../shared/components/color-picker/color-picker.component';

@Component({
  selector: 'app-tipo-form',
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
    <h2 mat-dialog-title>{{ esEdicion ? 'Editar tipo de actividad' : 'Nuevo tipo de actividad' }}</h2>
    <form [formGroup]="form" (ngSubmit)="guardar()" mat-dialog-content class="flex flex-col gap-4 mt-2">
      <mat-form-field appearance="outline">
        <mat-label>Nombre</mat-label>
        <input matInput formControlName="nombre" required maxlength="40">
        <mat-error *ngIf="form.controls['nombre'].invalid && form.controls['nombre'].touched">
          El nombre es obligatorio (máx 40 caracteres)
        </mat-error>
      </mat-form-field>
      <mat-form-field appearance="outline">
        <mat-label>Color</mat-label>
        <app-color-picker formControlName="colorHex"></app-color-picker>
      </mat-form-field>
      <mat-form-field appearance="outline">
        <mat-label>Aplicar a</mat-label>
        <mat-select formControlName="aplicaA" required>
          <mat-option value="SALA">Sala</mat-option>
          <mat-option value="ALMACEN">Almacén</mat-option>
          <mat-option value="AMBOS">Ambos</mat-option>
        </mat-select>
      </mat-form-field>
      <mat-form-field appearance="outline">
        <mat-label>Descripción</mat-label>
        <input matInput formControlName="descripcion" maxlength="60">
      </mat-form-field>
      <mat-form-field appearance="outline">
        <mat-label>Orden</mat-label>
        <input matInput type="number" formControlName="orden" min="0">
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
export class TipoFormComponent {
  form: FormGroup;
  esEdicion: boolean = false;
  private dialogRef = inject(MatDialogRef<TipoFormComponent>);
  private tipoActividadService = inject(TipoActividadService);

  constructor() {
    const data = inject(MAT_DIALOG_DATA, { optional: true }) as { initial?: TipoActividad };
    this.esEdicion = !!(data && data.initial);
    this.form = inject(FormBuilder).group({
      nombre: [data?.initial?.nombre ?? '', [Validators.required, Validators.maxLength(40)]],
      colorHex: [data?.initial?.colorHex ?? '#e94560', Validators.required],
      aplicaA: [data?.initial?.aplicaA ?? 'SALA', Validators.required],
      descripcion: [data?.initial?.descripcion ?? '', [Validators.maxLength(60)]],
      orden: [data?.initial?.orden ?? 0, [Validators.min(0)]]
    });
  }

  guardar(): void {
    if (this.form.invalid) return;
    const datos = this.form.value;
    if (this.esEdicion) {
      this.tipoActividadService.update(datos.id, datos).subscribe(() => this.dialogRef.close(true));
    } else {
      this.tipoActividadService.create(datos).subscribe(() => this.dialogRef.close(true));
    }
  }
}
