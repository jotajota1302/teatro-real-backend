import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

type EstadoActividad = 'PENDIENTE' | 'EN_TRANSITO' | 'COMPLETADO';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="px-2 py-1 rounded-full text-xs font-medium"
          [ngClass]="getStatusClass()">
      {{ getStatusLabel() }}
    </span>
  `
})
export class StatusBadgeComponent {
  estado = input.required<EstadoActividad>();

  getStatusClass(): string {
    switch (this.estado()) {
      case 'PENDIENTE':
        return 'bg-orange-100 text-orange-800';
      case 'EN_TRANSITO':
        return 'bg-blue-100 text-blue-800';
      case 'COMPLETADO':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusLabel(): string {
    switch (this.estado()) {
      case 'PENDIENTE': return 'Pendiente';
      case 'EN_TRANSITO': return 'En tránsito';
      case 'COMPLETADO': return 'Completado';
      default: return this.estado();
    }
  }
}
