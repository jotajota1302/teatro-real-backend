import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface MovimientoMock {
  id: number;
  descripcion: string;
  estado: string;
  fecha: string;
  origen: string;
  destino: string;
}

@Component({
  selector: 'app-movimientos-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h2 class="text-lg font-bold mb-4 text-teatro-crimson">Movimientos Pendientes</h2>
      <ul>
        <li *ngFor="let mov of movimientos" class="mb-2 bg-teatro-gray-900 p-3 rounded-lg shadow-sm flex flex-col gap-1">
          <div>
            <span class="font-semibold">{{ mov.descripcion }}</span>
            <span class="ml-2 text-xs px-2 py-1 bg-teatro-warning text-white rounded" *ngIf="mov.estado === 'En tránsito'">{{ mov.estado }}</span>
            <span class="ml-2 text-xs px-2 py-1 bg-teatro-crimson-dark text-white rounded" *ngIf="mov.estado === 'Pendiente'">{{ mov.estado }}</span>
          </div>
          <div class="text-teatro-gray-200 text-xs">
            Fecha: {{ mov.fecha }} | Origen: {{ mov.origen }} | Destino: {{ mov.destino }}
          </div>
        </li>
      </ul>
      <div *ngIf="movimientos.length === 0" class="text-teatro-gray-400 py-3">No hay movimientos pendientes actualmente.</div>
    </div>
  `,
  styles: ``
})
export class MovimientosListComponent {
  movimientos: MovimientoMock[] = [
    {
      id: 1,
      descripcion: 'Traslado de escenografía “Carmen”',
      estado: 'En tránsito',
      fecha: '2026-01-22',
      origen: 'Almacén Principal',
      destino: 'Escenario Central'
    },
    {
      id: 2,
      descripcion: 'Entrega de equipación iluminación',
      estado: 'Pendiente',
      fecha: '2026-01-23',
      origen: 'Proveedor X',
      destino: 'Sala de Ensayo 1'
    },
    {
      id: 3,
      descripcion: 'Movimiento de vestuario',
      estado: 'Pendiente',
      fecha: '2026-01-25',
      origen: 'Vestuario',
      destino: 'Camerinos'
    }
  ];
}
