// Dialogo standalone para clonar una actividad a otra fecha.
// Permite elegir fecha destino, valida, y realiza la clonación usando ActividadService.
import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActividadService } from '../../services/actividad.service';

@Component({
  selector: 'app-actividad-clone-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule, MatFormFieldModule, MatInputModule, MatDatepickerModule,
    MatButtonModule, MatIconModule
  ],
  template: `
    <h2 mat-dialog-title>Clonar actividad por fecha</h2>
    <form [formGroup]="form" (ngSubmit)="submit()" mat-dialog-content
          class="flex flex-col gap-4 mt-1">
      <mat-form-field appearance="outline">
        <mat-label>Nueva fecha destino</mat-label>
        <input matInput [matDatepicker]="picker" formControlName="fechaDestino" required>
        <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
        <mat-datepicker #picker></mat-datepicker>
        <mat-error *ngIf="form.get('fechaDestino')?.hasError('required')">
          Selecciona una fecha
        </mat-error>
        <mat-error *ngIf="form.get('fechaDestino')?.hasError('min')">
          No se puede elegir una fecha pasada
        </mat-error>
      </mat-form-field>
      <div class="flex justify-end gap-4" mat-dialog-actions>
        <button mat-button mat-dialog-close type="button">Cancelar</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">
          Clonar
        </button>
      </div>
    </form>
  `
})
export class ActividadCloneDialogComponent {
  @Input({ required: true }) actividadId!: string;

  form: FormGroup;
  private dialogRef = inject(MatDialogRef<ActividadCloneDialogComponent>);
  private actividadService = inject(ActividadService);

  constructor() {
    this.form = inject(FormBuilder).group({
      fechaDestino: [null, [Validators.required, this.noPasadasValidator]]
    });
  }

  noPasadasValidator = (control: any) => {
    if (!control.value) return null;
    const inputDate = new Date(control.value);
    const today = new Date();
    today.setHours(0,0,0,0);
    return inputDate < today ? { min: true } : null;
  };

  submit(): void {
    if (this.form.invalid) return;
    const fecha = this.form.value.fechaDestino;
    // formato yyyy-MM-dd
    const fechaISO = fecha instanceof Date
      ? fecha.toISOString().split('T')[0]
      : fecha;
    this.actividadService.clone(this.actividadId, fechaISO).subscribe(() => {
      this.dialogRef.close(true);
    });
  }
}
