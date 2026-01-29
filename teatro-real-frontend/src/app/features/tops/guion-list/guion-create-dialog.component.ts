// teatro-real-frontend/src/app/features/tops/guion-list/guion-create-dialog.component.ts

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { GuionService } from '../services/guion.service';
import { TemporadaService } from '../../../core/services/temporada.service';
import { GuionFormData } from '../models/guion.model';

/**
 * Dialog para crear nuevo guion
 */
@Component({
  selector: 'app-guion-create-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule
  ],
  template: `
    <h2 mat-dialog-title>Nuevo Guion Técnico</h2>

    <mat-dialog-content>
      <form [formGroup]="form" class="flex flex-col gap-4">
        <mat-form-field appearance="outline">
          <mat-label>Nombre de la Producción</mat-label>
          <input matInput formControlName="produccionNombre" placeholder="Ej: La Traviata" required>
          @if (form.get('produccionNombre')?.hasError('required')) {
            <mat-error>El nombre es obligatorio</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Temporada</mat-label>
          <input matInput formControlName="temporada" placeholder="Ej: 2024/2025" required>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Compañía</mat-label>
          <input matInput formControlName="compania" placeholder="Teatro Real">
        </mat-form-field>

        <div class="grid grid-cols-2 gap-4">
          <mat-form-field appearance="outline">
            <mat-label>Director de Escena</mat-label>
            <input matInput formControlName="directorEscena">
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Director Musical</mat-label>
            <input matInput formControlName="directorMusical">
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline">
          <mat-label>Compositor</mat-label>
          <input matInput formControlName="compositor">
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Número de Actos</mat-label>
          <mat-select formControlName="numActos">
            <mat-option [value]="1">1 Acto</mat-option>
            <mat-option [value]="2">2 Actos</mat-option>
            <mat-option [value]="3">3 Actos</mat-option>
            <mat-option [value]="4">4 Actos</mat-option>
            <mat-option [value]="5">5 Actos</mat-option>
          </mat-select>
        </mat-form-field>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-flat-button color="primary"
              [disabled]="form.invalid || saving"
              (click)="onSubmit()">
        @if (saving) {
          <mat-spinner diameter="20" class="mr-2"></mat-spinner>
        }
        Crear Guion
      </button>
    </mat-dialog-actions>
  `
})
export class GuionCreateDialogComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<GuionCreateDialogComponent>);
  private guionService = inject(GuionService);
  private temporadaService = inject(TemporadaService);

  saving = false;

  form: FormGroup = this.fb.group({
    produccionNombre: ['', Validators.required],
    temporada: [this.temporadaService.temporadaActiva()?.nombre || ''],
    compania: ['Teatro Real'],
    directorEscena: [''],
    directorMusical: [''],
    compositor: [''],
    numActos: [3]
  });

  onSubmit(): void {
    if (this.form.invalid) return;

    this.saving = true;
    const { numActos, ...formData } = this.form.value;

    this.guionService.create(formData as GuionFormData, numActos).subscribe({
      next: (guion) => {
        this.saving = false;
        this.dialogRef.close(guion);
      },
      error: (err) => {
        this.saving = false;
        console.error('Error creando guion:', err);
      }
    });
  }
}
