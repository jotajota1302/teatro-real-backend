// Dialogo standalone para crear/editar actividad con todos los campos v2
import { Component, inject, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActividadFormData, TipoActividad, Espacio, Departamento, Temporada } from '../../models/actividad.model';
import { ActividadService } from '../../services/actividad.service';
import { EspacioService } from '../../services/espacio.service';
import { TipoActividadService } from '../../services/tipo-actividad.service';
// TemporadaService: usar si existe, si no comentar la integración hasta implementarse
// import { TemporadaService } from '../../../core/services/temporada.service';

@Component({
  selector: 'app-actividad-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatDatepickerModule,
    MatButtonModule, MatIconModule, MatCheckboxModule, MatAutocompleteModule,
    MatSlideToggleModule, MatTooltipModule
  ],
  template: `
    <h2 mat-dialog-title>
      {{ isEditMode ? 'Editar actividad' : 'Nueva actividad' }}
    </h2>
    <form [formGroup]="form" (ngSubmit)="submit()" autocomplete="off"
          mat-dialog-content class="grid gap-4 grid-cols-1 md:grid-cols-2 mt-2">
      <!-- Información general -->
      <mat-form-field appearance="outline" class="col-span-2">
        <mat-label>Título</mat-label>
        <input matInput formControlName="titulo" required maxlength="60">
      </mat-form-field>
      <mat-form-field appearance="outline">
        <mat-label>Tipo de actividad</mat-label>
        <mat-select formControlName="tipoActividadId" required>
          <mat-option *ngFor="let tipo of tiposActividad" [value]="tipo.id">
            {{ tipo.nombre }}
          </mat-option>
        </mat-select>
      </mat-form-field>
      <mat-form-field appearance="outline">
        <mat-label>Espacio</mat-label>
        <mat-select formControlName="espacioId" required>
          <mat-option *ngFor="let espacio of espacios" [value]="espacio.id">
            {{ espacio.nombre }}
          </mat-option>
        </mat-select>
      </mat-form-field>
      <mat-form-field appearance="outline">
        <mat-label>Departamento</mat-label>
        <mat-select formControlName="departamentoId">
          <mat-option [value]="null">- Sin departamento -</mat-option>
          <mat-option *ngFor="let dep of departamentos" [value]="dep.id">
            {{ dep.nombre }}
          </mat-option>
        </mat-select>
      </mat-form-field>
      <mat-form-field appearance="outline">
        <mat-label>Temporada</mat-label>
        <mat-select formControlName="temporadaId">
          <mat-option [value]="null">- Sin temporada -</mat-option>
          <mat-option *ngFor="let temp of temporadas" [value]="temp.id">
            {{ temp.nombre }}
          </mat-option>
        </mat-select>
      </mat-form-field>
      <mat-form-field appearance="outline">
        <mat-label>Fecha</mat-label>
        <input matInput [matDatepicker]="picker" formControlName="fecha" required>
        <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
        <mat-datepicker #picker></mat-datepicker>
      </mat-form-field>
      <mat-form-field appearance="outline">
        <mat-label>Hora inicio</mat-label>
        <input matInput type="time" formControlName="horaInicio" required>
      </mat-form-field>
      <mat-form-field appearance="outline">
        <mat-label>Hora fin</mat-label>
        <input matInput type="time" formControlName="horaFin" required>
      </mat-form-field>
      <!-- Campos almacén -->
      <mat-form-field appearance="outline">
        <mat-label>Tipo movimiento almacén</mat-label>
        <mat-select formControlName="tipoMovimiento">
          <mat-option [value]="null">- Ninguno -</mat-option>
          <mat-option value="RECOGIDA">Recogida</mat-option>
          <mat-option value="SALIDA">Salida</mat-option>
        </mat-select>
      </mat-form-field>
      <mat-form-field appearance="outline">
        <mat-label>Nº camiones</mat-label>
        <input matInput type="number" min="0" formControlName="numCamiones">
      </mat-form-field>
      <mat-form-field appearance="outline">
        <mat-label>Lugar origen</mat-label>
        <input matInput formControlName="lugarOrigen">
      </mat-form-field>
      <mat-form-field appearance="outline">
        <mat-label>Lugar destino</mat-label>
        <input matInput formControlName="lugarDestino">
      </mat-form-field>
      <mat-form-field appearance="outline">
        <mat-label>Producción (nombre)</mat-label>
        <input matInput formControlName="produccionNombre">
      </mat-form-field>
      <!-- Descripción y notas -->
      <mat-form-field appearance="outline" class="col-span-2">
        <mat-label>Descripción</mat-label>
        <textarea matInput rows="2" formControlName="descripcion"></textarea>
      </mat-form-field>
      <mat-form-field appearance="outline" class="col-span-2">
        <mat-label>Notas</mat-label>
        <textarea matInput rows="2" formControlName="notas"></textarea>
      </mat-form-field>
      <!-- Documentos: integración futura (fuera del scope base) -->
      <!-- Botones -->
      <div class="col-span-2 flex justify-end items-center gap-4 mt-2" mat-dialog-actions>
        <button mat-button mat-dialog-close type="button">Cancelar</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">
          {{ isEditMode ? 'Actualizar' : 'Crear' }}
        </button>
      </div>
    </form>
  `
})
export class ActividadDialogComponent {
  form: FormGroup;
  isEditMode = false;
  tiposActividad: TipoActividad[] = [];
  espacios: Espacio[] = [];
  temporadas: Temporada[] = [];
  departamentos: Departamento[] = [];

  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<ActividadDialogComponent>);
  private actividadService = inject(ActividadService);
  private espacioService = inject(EspacioService);
  private tipoActividadService = inject(TipoActividadService);
  // private temporadaService = inject(TemporadaService);

  constructor() {
    this.form = this.fb.group({
      titulo: ['', [Validators.required, Validators.maxLength(60)]],
      tipoActividadId: [null, Validators.required],
      espacioId: [null, Validators.required],
      departamentoId: [null],
      temporadaId: [null],
      fecha: [null, Validators.required],
      horaInicio: ['', Validators.required],
      horaFin: ['', Validators.required],
      descripcion: [''],
      notas: [''],
      tipoMovimiento: [null],
      numCamiones: [null],
      lugarOrigen: [''],
      lugarDestino: [''],
      produccionNombre: ['']
    });
    this.loadFormData();
    // Modo edición: si se recibe data, precargar
    const data = this.dialogRef._containerInstance?._config?.data as ActividadFormData | undefined;
    if (data) {
      this.isEditMode = true;
      this.form.patchValue(data);
    }
  }

  loadFormData(): void {
    // Lógica con signals y loaders (sólo si los servicios existen y devuelven signal/arrays, adaptar según implementación real).

    if (typeof this.tipoActividadService.tipos === 'function') {
      this.tiposActividad = this.tipoActividadService.tipos();
    }
    if (typeof this.espacioService.espacios === 'function') {
      this.espacios = this.espacioService.espacios();
    }
    // Temporada: integrar si el service existe, si no array vacío
    // if (typeof this.temporadaService.temporadas === 'function') {
    //   this.temporadas = this.temporadaService.temporadas();
    // }
    this.temporadas = [];
    this.departamentos = [];
  }

  submit(): void {
    if (this.form.invalid) return;
    const raw = this.form.value;
    if (this.isEditMode) {
      this.actividadService.update(raw.id, raw).subscribe(() => this.dialogRef.close(true));
    } else {
      this.actividadService.create(raw).subscribe(() => this.dialogRef.close(true));
    }
  }
}
