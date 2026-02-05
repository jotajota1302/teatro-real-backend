// Dialogo standalone para crear/editar actividad - Diseño Teatro Real
import { Component, inject, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActividadFormData, TipoActividad, Espacio, Departamento, Temporada } from '../../models/actividad.model';
import { ActividadService } from '../../services/actividad.service';
import { EspacioService } from '../../services/espacio.service';
import { TipoActividadService } from '../../services/tipo-actividad.service';
import { TemporadaService } from '../../../../core/services/temporada.service';
import { DepartamentoService } from '../../../../core/services/departamento.service';

@Component({
  selector: 'app-actividad-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="tr-dialog">
      <header class="tr-dialog__header">
        <h1 class="tr-dialog__title">
          {{ isEditMode ? 'Editar Actividad' : 'Nueva Actividad' }}
        </h1>
      </header>

      <form [formGroup]="form" (ngSubmit)="submit()" class="tr-dialog__body">
        <!-- TÍTULO -->
        <div class="tr-field tr-field--full">
          <div class="tr-field__label">Título de la Actividad</div>
          <mat-form-field appearance="outline" class="tr-field__control">
            <input
              matInput
              formControlName="titulo"
              placeholder="Título de la Actividad"
              maxlength="100"
            />
            <mat-error *ngIf="form.get('titulo')?.hasError('required')">
              El título es obligatorio
            </mat-error>
          </mat-form-field>
        </div>

        <!-- TIPO DE ACTIVIDAD / ESPACIO -->
        <div class="tr-field-row">
          <div class="tr-field">
            <div class="tr-field__label">Tipo de Actividad</div>
            <mat-form-field appearance="outline" class="tr-field__control">
              <mat-select formControlName="tipoActividadId" placeholder="Selecciona un tipo">
                <mat-option *ngFor="let tipo of tiposActividad" [value]="tipo.id">
                  {{ tipo.nombre }}
                </mat-option>
              </mat-select>
              <mat-error *ngIf="form.get('tipoActividadId')?.hasError('required')">
                Selecciona un tipo
              </mat-error>
            </mat-form-field>
          </div>

          <div class="tr-field">
            <div class="tr-field__label">Espacio</div>
            <mat-form-field appearance="outline" class="tr-field__control">
              <mat-select formControlName="espacioId" placeholder="Selecciona un espacio">
                <mat-option *ngFor="let espacio of espaciosFiltrados" [value]="espacio.id">
                  {{ espacio.nombre }}
                </mat-option>
              </mat-select>
              <mat-error *ngIf="form.get('espacioId')?.hasError('required')">
                Selecciona un espacio
              </mat-error>
            </mat-form-field>
          </div>
        </div>

        <!-- DEPARTAMENTO -->
        <div class="tr-field tr-field--full">
          <div class="tr-field__label">Departamento</div>
          <mat-form-field appearance="outline" class="tr-field__control">
            <mat-select formControlName="departamentoId" placeholder="Selecciona un departamento">
              <mat-option [value]="null">- Sin departamento -</mat-option>
              <mat-option *ngFor="let dep of departamentos" [value]="dep.id">
                {{ dep.nombre }}
              </mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <!-- FECHA -->
        <div class="tr-field tr-field--full">
          <div class="tr-field__label">Fecha</div>
          <mat-form-field appearance="outline" class="tr-field__control">
            <input
              matInput
              [matDatepicker]="picker"
              formControlName="fecha"
              placeholder="06/02/2026"
            />
            <mat-datepicker-toggle matIconSuffix [for]="picker">
              <mat-icon matDatepickerToggleIcon>calendar_today</mat-icon>
            </mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
            <mat-error *ngIf="form.get('fecha')?.hasError('required')">
              La fecha es obligatoria
            </mat-error>
          </mat-form-field>
        </div>

        <!-- HORAS -->
        <div class="tr-field-row">
          <div class="tr-field">
            <div class="tr-field__label">Hora Inicio</div>
            <mat-form-field appearance="outline" class="tr-field__control">
              <input
                matInput
                type="time"
                formControlName="horaInicio"
                placeholder="09:00"
              />
              <mat-icon matIconSuffix class="time-icon">schedule</mat-icon>
              <mat-error *ngIf="form.get('horaInicio')?.hasError('required')">
                Hora obligatoria
              </mat-error>
            </mat-form-field>
          </div>

          <div class="tr-field">
            <div class="tr-field__label">Hora Fin</div>
            <mat-form-field appearance="outline" class="tr-field__control">
              <input
                matInput
                type="time"
                formControlName="horaFin"
                placeholder="13:00"
              />
              <mat-icon matIconSuffix class="time-icon">schedule</mat-icon>
              <mat-error *ngIf="form.get('horaFin')?.hasError('required')">
                Hora obligatoria
              </mat-error>
            </mat-form-field>
          </div>
        </div>

        <!-- DESCRIPCIÓN -->
        <div class="tr-field tr-field--full">
          <div class="tr-field__label">Descripción</div>
          <mat-form-field appearance="outline" class="tr-field__control tr-field__control--textarea">
            <textarea
              matInput
              formControlName="descripcion"
              rows="3"
              placeholder="Añade una descripción..."
            ></textarea>
          </mat-form-field>
        </div>

        <!-- BOTONES -->
        <footer class="tr-dialog__footer">
          <button
            type="button"
            mat-stroked-button
            (click)="onCancel()"
            class="btn btn--secondary"
          >
            CANCELAR
          </button>

          <button
            type="submit"
            mat-raised-button
            [disabled]="form.invalid || isSubmitting"
            class="btn btn--primary"
          >
            {{ isSubmitting ? 'GUARDANDO...' : (isEditMode ? 'GUARDAR CAMBIOS' : 'CREAR ACTIVIDAD') }}
          </button>
        </footer>
      </form>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap');

    :host {
      font-family: 'Montserrat', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }

    .tr-dialog {
      width: 100%;
      max-width: 960px;
      background: #ffffff;
      border-radius: 12px;
      padding: 16px 32px 16px;
      display: flex;
      flex-direction: column;
    }

    .tr-dialog__header {
      margin-bottom: 6px;
    }

    .tr-dialog__title {
      margin: 0;
      font-size: 26px;
      font-weight: 700;
      color: #111827;
    }

    .tr-dialog__body {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .tr-field-row {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 16px;
    }

    .tr-field {
      width: 100%;
    }

    .tr-field--full {
      width: 100%;
    }

    .tr-field__label {
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.02em;
      color: #374151;
      margin-bottom: 4px;
    }

    .tr-field__control {
      width: 100%;
    }

    .tr-field__control--textarea ::ng-deep textarea.mat-mdc-input-element {
      min-height: 90px;
      resize: vertical;
    }

    /* Ajustes generales de mat-form-field dentro del diálogo */
    .tr-dialog ::ng-deep .mat-mdc-form-field {
      width: 100%;
      font-family: 'Montserrat', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }

    .tr-dialog ::ng-deep .mat-mdc-text-field-wrapper {
      background-color: #ffffff !important;
      border-radius: 8px !important;
    }

    .tr-dialog ::ng-deep .mdc-text-field--outlined .mdc-notched-outline__leading,
    .tr-dialog ::ng-deep .mdc-text-field--outlined .mdc-notched-outline__notch,
    .tr-dialog ::ng-deep .mdc-text-field--outlined .mdc-notched-outline__trailing {
      border-color: #d1d5db !important;
      border-width: 1px !important;
    }

    .tr-dialog ::ng-deep .mdc-text-field--outlined:hover:not(.mdc-text-field--focused) .mdc-notched-outline__leading,
    .tr-dialog ::ng-deep .mdc-text-field--outlined:hover:not(.mdc-text-field--focused) .mdc-notched-outline__notch,
    .tr-dialog ::ng-deep .mdc-text-field--outlined:hover:not(.mdc-text-field--focused) .mdc-notched-outline__trailing {
      border-color: #9ca3af !important;
    }

    .tr-dialog ::ng-deep .mdc-text-field--focused .mdc-notched-outline__leading,
    .tr-dialog ::ng-deep .mdc-text-field--focused .mdc-notched-outline__notch,
    .tr-dialog ::ng-deep .mdc-text-field--focused .mdc-notched-outline__trailing {
      border-color: #cf102d !important;
      border-width: 2px !important;
    }

    .tr-dialog ::ng-deep .mat-mdc-floating-label {
      color: #6b7280 !important;
      font-weight: 500 !important;
    }

    .tr-dialog ::ng-deep .mdc-text-field--focused .mat-mdc-floating-label {
      color: #cf102d !important;
    }

    .tr-dialog ::ng-deep .mat-mdc-input-element,
    .tr-dialog ::ng-deep .mat-mdc-select-value {
      font-family: 'Montserrat', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
      color: #111827 !important;
      font-size: 14px;
    }

    .tr-dialog ::ng-deep .mat-mdc-input-element::placeholder {
      color: #9ca3af !important;
    }

    .tr-dialog ::ng-deep .mat-mdc-select-arrow {
      color: #9ca3af !important;
    }

    .tr-dialog ::ng-deep .mdc-text-field--focused .mat-mdc-select-arrow {
      color: #cf102d !important;
    }

    .time-icon {
      color: #6b7280;
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    /* Botones */
    .tr-dialog__footer {
      display: flex;
      justify-content: flex-end;
      gap: 16px;
      margin-top: 8px;
    }

    .btn {
      min-width: 140px;
      height: 44px;
      padding: 0 20px;
      border-radius: 6px;
      border: none;
      font-family: 'Montserrat', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 14px;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      cursor: pointer;
      transition: background-color 0.15s ease, color 0.15s ease,
                  box-shadow 0.15s ease, transform 0.05s ease;
    }

    .btn--secondary {
      background: #ffffff;
      color: #111827;
      border: 2px solid #111827;
    }

    .btn--secondary:hover {
      background: #111827;
      color: #ffffff;
    }

    .btn--primary {
      background: #cf102d;
      color: #ffffff;
      box-shadow: 0 4px 14px rgba(207, 16, 45, 0.35);
    }

    .btn--primary:hover:not(:disabled) {
      background: #a00d24;
      box-shadow: 0 6px 18px rgba(207, 16, 45, 0.45);
      transform: translateY(-1px);
    }

    .btn--primary:disabled {
      background: #d1d5db !important;
      color: #9ca3af !important;
      box-shadow: none !important;
      cursor: not-allowed;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .tr-dialog {
        padding: 20px 16px;
        border-radius: 0;
        max-width: 100%;
      }

      .tr-dialog__title {
        font-size: 22px;
      }

      .tr-field-row {
        grid-template-columns: 1fr;
      }

      .tr-dialog__footer {
        flex-direction: column-reverse;
      }

      .btn {
        width: 100%;
      }
    }
  `]
})
export class ActividadDialogComponent implements OnInit {
  form: FormGroup;
  isEditMode = false;
  isSubmitting = false;
  tiposActividad: TipoActividad[] = [];
  espacios: Espacio[] = [];
  espaciosFiltrados: Espacio[] = [];
  temporadas: Temporada[] = [];
  departamentos: Departamento[] = [];

  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<ActividadDialogComponent>);
  private actividadService = inject(ActividadService);
  private espacioService = inject(EspacioService);
  private tipoActividadService = inject(TipoActividadService);
  private temporadaService = inject(TemporadaService);
  private departamentoService = inject(DepartamentoService);

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.form = this.fb.group({
      titulo: ['', [Validators.required, Validators.maxLength(100)]],
      tipoActividadId: [null, Validators.required],
      espacioId: [null, Validators.required],
      departamentoId: [null],
      fecha: [null, Validators.required],
      horaInicio: ['', Validators.required],
      horaFin: ['', Validators.required],
      descripcion: ['']
    });
  }

  ngOnInit(): void {
    this.loadFormData();

    if (this.data && this.data.mode === 'edit' && this.data.actividad) {
      this.isEditMode = true;
      this.form.patchValue(this.data.actividad);
    } else if (this.data && this.data.defaultDate) {
      this.form.patchValue({
        fecha: new Date(this.data.defaultDate)
      });
    }
  }

  loadFormData(): void {
    this.tipoActividadService.loadTiposActividad().subscribe({
      next: () => {
        this.tiposActividad = this.tipoActividadService.tipos();
        console.log('Tipos de actividad cargados:', this.tiposActividad);
      },
      error: (err) => console.error('Error cargando tipos de actividad:', err)
    });

    this.espacioService.loadEspacios().subscribe({
      next: () => {
        this.espacios = this.espacioService.espacios();
        this.espaciosFiltrados = this.espacios.filter(
          espacio => !espacio.nombre.toLowerCase().includes('almacen')
        );
        console.log('Espacios cargados:', this.espaciosFiltrados);
      },
      error: (err) => console.error('Error cargando espacios:', err)
    });

    if (typeof this.temporadaService.temporadas === 'function') {
      this.temporadas = this.temporadaService.temporadas();
    }

    this.departamentoService.loadDepartamentos().subscribe({
      next: () => {
        this.departamentos = this.departamentoService.departamentos();
        console.log('Departamentos cargados:', this.departamentos);
      },
      error: (err) => console.error('Error cargando departamentos:', err)
    });
  }

  submit(): void {
    if (this.form.invalid || this.isSubmitting) return;
    
    this.isSubmitting = true;
    const formValue = this.form.value;
    
    // Formatear fecha a ISO string (yyyy-MM-dd)
    const fechaISO = formValue.fecha instanceof Date 
      ? formValue.fecha.toISOString().split('T')[0]
      : formValue.fecha;
    
    // Construir el objeto de datos para enviar al backend
    const actividadData: ActividadFormData = {
      titulo: formValue.titulo,
      tipoActividadId: formValue.tipoActividadId,
      espacioId: formValue.espacioId,
      fecha: fechaISO,
      horaInicio: formValue.horaInicio,
      horaFin: formValue.horaFin,
      departamentoId: formValue.departamentoId || undefined,
      descripcion: formValue.descripcion || undefined
    };
    
    if (this.isEditMode && (this.data?.actividadId || formValue.id)) {
      const id = this.data.actividadId || formValue.id;
      this.actividadService.update(id, actividadData).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.dialogRef.close(true);
        },
        error: (err) => {
          console.error('Error actualizando actividad:', err);
          this.isSubmitting = false;
        }
      });
    } else {
      this.actividadService.create(actividadData).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.dialogRef.close(true);
        },
        error: (err) => {
          console.error('Error creando actividad:', err);
          this.isSubmitting = false;
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
