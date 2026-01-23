// Componente standalone para control y transición de estado actividad almacén
import { Component, input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';
import { ActividadService } from '../../services/actividad.service';

type EstadoActividad = 'PENDIENTE' | 'EN_TRANSITO' | 'COMPLETADO';

@Component({
  selector: 'app-actividad-status-control',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, StatusBadgeComponent],
  template: `
    <div class="flex items-center gap-2">
      <app-status-badge [estado]="estado()"></app-status-badge>
      <ng-container *ngIf="siguienteEstado">
        <button mat-stroked-button color="primary" size="small"
          [attr.aria-label]="'Cambiar a ' + siguienteEstadoLabel"
          (click)="transicionar()">
          Cambiar a {{ siguienteEstadoLabel }}
          <mat-icon>arrow_forward</mat-icon>
        </button>
      </ng-container>
    </div>
  `
})
export class ActividadStatusControlComponent {
  actividadId = input.required<string>();
  estado = input.required<EstadoActividad>();

  private actividadService = inject(ActividadService);

  get siguienteEstado(): EstadoActividad | null {
    switch (this.estado()) {
      case 'PENDIENTE':
        return 'EN_TRANSITO';
      case 'EN_TRANSITO':
        return 'COMPLETADO';
      default:
        return null;
    }
  }

  get siguienteEstadoLabel(): string {
    switch (this.siguienteEstado) {
      case 'EN_TRANSITO': return 'En tránsito';
      case 'COMPLETADO': return 'Completado';
      default: return '';
    }
  }

  transicionar(): void {
    if (!this.siguienteEstado) return;
    this.actividadService
      .updateStatus(this.actividadId(), this.siguienteEstado)
      .subscribe();
  }
}
