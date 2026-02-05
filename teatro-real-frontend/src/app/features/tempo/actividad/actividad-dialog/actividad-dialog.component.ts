// Dialogo standalone para crear/editar actividad - Diseño Teatro Real
import { Component, inject, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
    FormsModule,
    MatDialogModule
  ],
  template: `
    <div class="modal-content">
      <div class="modal-header">
        <h2 class="modal-title">{{ isEditMode ? 'Editar Actividad' : 'Nueva Actividad' }}</h2>
        <button class="btn-close" (click)="onCancel()">
          <span class="material-icons">close</span>
        </button>
      </div>

      <form (ngSubmit)="submit()">
        <!-- Título -->
        <div class="form-group">
          <label class="form-label">Título *</label>
          <input type="text" class="form-input" [(ngModel)]="formData.titulo" name="titulo" required placeholder="Ej: Ensayo general La Traviata">
        </div>

        <!-- Tipo y Espacio -->
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Tipo *</label>
            <select class="form-select" [(ngModel)]="formData.tipoActividadId" name="tipoActividadId" required>
              <option [ngValue]="null">Seleccionar...</option>
              <option *ngFor="let tipo of tiposActividad" [ngValue]="tipo.id">{{ tipo.nombre }}</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Espacio *</label>
            <select class="form-select" [(ngModel)]="formData.espacioId" name="espacioId" required>
              <option [ngValue]="null">Seleccionar...</option>
              <option *ngFor="let espacio of espaciosFiltrados" [ngValue]="espacio.id">{{ espacio.nombre }}</option>
            </select>
          </div>
        </div>

        <!-- Fecha, Hora inicio, Hora fin -->
        <div class="form-row form-row--three">
          <div class="form-group">
            <label class="form-label">Fecha *</label>
            <input type="date" class="form-input" [(ngModel)]="formData.fecha" name="fecha" required>
          </div>
          <div class="form-group">
            <label class="form-label">Inicio *</label>
            <select class="form-select" [(ngModel)]="formData.horaInicio" name="horaInicio" required>
              <option value="">--:--</option>
              <option *ngFor="let hora of horasDisponibles" [value]="hora">{{ hora }}</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Fin *</label>
            <select class="form-select" [(ngModel)]="formData.horaFin" name="horaFin" required>
              <option value="">--:--</option>
              <option *ngFor="let hora of horasDisponibles" [value]="hora">{{ hora }}</option>
            </select>
          </div>
        </div>

        <!-- Departamento -->
        <div class="form-group">
          <label class="form-label">Departamento</label>
          <select class="form-select" [(ngModel)]="formData.departamentoId" name="departamentoId">
            <option [ngValue]="null">Sin asignar</option>
            <option *ngFor="let dep of departamentos" [ngValue]="dep.id">{{ dep.nombre }}</option>
          </select>
        </div>

        <!-- Notas -->
        <div class="form-group">
          <label class="form-label">Notas</label>
          <textarea class="form-input form-textarea" [(ngModel)]="formData.descripcion" name="descripcion" placeholder="Añadir notas..." rows="2"></textarea>
        </div>

        <div class="modal-actions">
          <button *ngIf="isEditMode && !confirmingDelete" type="button" class="btn-delete" (click)="confirmDelete()">
            <span class="material-icons">delete</span>
            Eliminar
          </button>
          <div *ngIf="confirmingDelete" class="delete-confirm">
            <span class="delete-confirm-text">¿Eliminar?</span>
            <button type="button" class="btn-confirm-delete" (click)="deleteActividad()">Sí</button>
            <button type="button" class="btn-cancel-delete" (click)="cancelDelete()">No</button>
          </div>
          <div class="spacer"></div>
          <button type="button" class="btn-cancel" (click)="onCancel()">Cancelar</button>
          <button type="submit" class="btn-save" [disabled]="isSubmitting || !isFormValid()">
            {{ isSubmitting ? 'Guardando...' : (isEditMode ? 'Guardar' : 'Crear') }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    :host ::ng-deep .mat-mdc-dialog-container .mdc-dialog__surface {
      border-radius: 16px !important;
      overflow: visible !important;
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25) !important;
    }

    .modal-content {
      background: white;
      border-radius: 16px;
      padding: 1.5rem;
      width: calc(100% - 2rem);
      max-width: 560px;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid #e5e7eb;
    }

    .modal-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: #1f2937;
      margin: 0;
    }

    .btn-close {
      width: 32px;
      height: 32px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: none;
      cursor: pointer;
      background: #f3f4f6;
      color: #374151;
      transition: all 0.2s;
    }

    .btn-close:hover {
      background: #e5e7eb;
    }

    .btn-close .material-icons {
      font-size: 20px;
    }

    .form-group {
      margin-bottom: 0.75rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.75rem;
    }

    .form-row--three {
      grid-template-columns: 1.3fr 0.85fr 0.85fr;
    }

    .form-label {
      display: block;
      font-size: 0.7rem;
      font-weight: 600;
      margin-bottom: 0.3rem;
      text-transform: uppercase;
      letter-spacing: 0.025em;
      color: #6b7280;
    }

    .form-input, .form-select {
      width: 100%;
      padding: 0.5rem 0.75rem;
      border-radius: 6px;
      font-size: 0.875rem;
      transition: all 0.2s;
      background: white;
      border: 1px solid #d1d5db;
      color: #1f2937;
      font-family: inherit;
    }

    .form-input:focus, .form-select:focus {
      outline: none;
      border-color: #CF102D;
      box-shadow: 0 0 0 2px rgba(207, 16, 45, 0.15);
    }

    .form-input::placeholder {
      color: #9ca3af;
    }

    .form-select {
      cursor: pointer;
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E");
      background-position: right 0.5rem center;
      background-repeat: no-repeat;
      background-size: 1.25rem;
      padding-right: 2rem;
    }

    .form-textarea {
      resize: none;
      min-height: 60px;
    }

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid #e5e7eb;
    }

    .btn-cancel {
      padding: 0.5rem 1rem;
      border-radius: 6px;
      font-weight: 500;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s;
      background: white;
      border: 1px solid #d1d5db;
      color: #374151;
    }

    .btn-cancel:hover {
      background: #f3f4f6;
      border-color: #9ca3af;
    }

    .btn-save {
      padding: 0.5rem 1.25rem;
      border-radius: 6px;
      font-weight: 600;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s;
      background: #CF102D;
      color: white;
      border: none;
    }

    .btn-save:hover:not(:disabled) {
      background: #a80d25;
    }

    .btn-save:disabled {
      background: #e5e7eb;
      color: #9ca3af;
      cursor: not-allowed;
    }

    .spacer {
      flex: 1;
    }

    .btn-delete {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      padding: 0.5rem 0.75rem;
      border-radius: 6px;
      font-weight: 500;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s;
      background: white;
      border: 1px solid #fca5a5;
      color: #dc2626;
    }

    .btn-delete:hover {
      background: #fef2f2;
      border-color: #f87171;
    }

    .btn-delete .material-icons {
      font-size: 18px;
    }

    .delete-confirm {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .delete-confirm-text {
      font-size: 0.875rem;
      color: #dc2626;
      font-weight: 500;
    }

    .btn-confirm-delete {
      padding: 0.35rem 0.75rem;
      border-radius: 4px;
      font-weight: 600;
      font-size: 0.8rem;
      cursor: pointer;
      background: #dc2626;
      color: white;
      border: none;
      transition: all 0.2s;
    }

    .btn-confirm-delete:hover {
      background: #b91c1c;
    }

    .btn-cancel-delete {
      padding: 0.35rem 0.75rem;
      border-radius: 4px;
      font-weight: 500;
      font-size: 0.8rem;
      cursor: pointer;
      background: #f3f4f6;
      color: #374151;
      border: 1px solid #d1d5db;
      transition: all 0.2s;
    }

    .btn-cancel-delete:hover {
      background: #e5e7eb;
    }
  `]
})
export class ActividadDialogComponent implements OnInit {
  isEditMode = false;
  isSubmitting = false;
  confirmingDelete = false;
  tiposActividad: TipoActividad[] = [];
  espacios: Espacio[] = [];
  espaciosFiltrados: Espacio[] = [];
  temporadas: Temporada[] = [];
  departamentos: Departamento[] = [];
  horasDisponibles: string[] = this.generarHoras();

  formData = {
    titulo: '',
    tipoActividadId: null as number | null,
    espacioId: null as number | null,
    fecha: '',
    horaInicio: '',
    horaFin: '',
    departamentoId: null as number | null,
    descripcion: ''
  };

  private dialogRef = inject(MatDialogRef<ActividadDialogComponent>);
  private actividadService = inject(ActividadService);
  private espacioService = inject(EspacioService);
  private tipoActividadService = inject(TipoActividadService);
  private temporadaService = inject(TemporadaService);
  private departamentoService = inject(DepartamentoService);

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.loadFormData();

    if (this.data && this.data.mode === 'edit' && this.data.actividad) {
      this.isEditMode = true;
      Object.assign(this.formData, this.data.actividad);
    } else if (this.data && this.data.defaultDate) {
      this.formData.fecha = this.data.defaultDate;
    }
  }

  loadFormData(): void {
    this.tipoActividadService.loadTiposActividad().subscribe({
      next: () => {
        this.tiposActividad = this.tipoActividadService.tipos();
      },
      error: (err) => console.error('Error cargando tipos de actividad:', err)
    });

    this.espacioService.loadEspacios().subscribe({
      next: () => {
        this.espacios = this.espacioService.espacios();
        this.espaciosFiltrados = this.espacios.filter(
          espacio => !espacio.nombre.toLowerCase().includes('almacen')
        );
      },
      error: (err) => console.error('Error cargando espacios:', err)
    });

    this.temporadaService.ensureLoaded();
    if (typeof this.temporadaService.temporadas === 'function') {
      this.temporadas = this.temporadaService.temporadas();
    }

    this.departamentoService.loadDepartamentos().subscribe({
      next: () => {
        this.departamentos = this.departamentoService.departamentos();
      },
      error: (err) => console.error('Error cargando departamentos:', err)
    });
  }

  isFormValid(): boolean {
    return !!(
      this.formData.titulo &&
      this.formData.tipoActividadId &&
      this.formData.espacioId &&
      this.formData.fecha &&
      this.formData.horaInicio &&
      this.formData.horaFin
    );
  }

  submit(): void {
    if (!this.isFormValid() || this.isSubmitting) return;

    this.isSubmitting = true;

    const temporadaActual = this.temporadaService.selectedTemporada()
      || this.temporadaService.temporadaActiva?.()
      || this.temporadas[0];
    const temporadaNombre = temporadaActual?.nombre || '2024/2025';

    const actividadData: ActividadFormData = {
      titulo: this.formData.titulo,
      tipoActividadId: this.formData.tipoActividadId!,
      espacioId: this.formData.espacioId!,
      fecha: this.formData.fecha,
      horaInicio: this.formData.horaInicio,
      horaFin: this.formData.horaFin,
      temporada: temporadaNombre,
      departamentoId: this.formData.departamentoId || undefined,
      descripcion: this.formData.descripcion || undefined
    };

    if (this.isEditMode && this.data?.actividadId) {
      this.actividadService.update(this.data.actividadId, actividadData).subscribe({
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

  confirmDelete(): void {
    this.confirmingDelete = true;
  }

  cancelDelete(): void {
    this.confirmingDelete = false;
  }

  deleteActividad(): void {
    if (!this.data?.actividadId) return;

    this.isSubmitting = true;
    this.actividadService.delete(this.data.actividadId).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.dialogRef.close({ deleted: true });
      },
      error: (err) => {
        console.error('Error eliminando actividad:', err);
        this.isSubmitting = false;
        this.confirmingDelete = false;
      }
    });
  }

  private generarHoras(): string[] {
    const horas: string[] = [];
    for (let h = 7; h <= 23; h++) {
      for (let m = 0; m < 60; m += 30) {
        horas.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
      }
    }
    return horas;
  }
}
