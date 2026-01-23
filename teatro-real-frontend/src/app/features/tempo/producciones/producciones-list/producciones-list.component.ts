import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ProduccionMock {
  id: number;
  nombre: string;
  estado: string;
  fecha: string;
  tipo: string;
}

@Component({
  selector: 'app-producciones-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h2 class="text-lg font-bold mb-4 text-teatro-crimson">Producciones Activas</h2>
      <ul>
        <li *ngFor="let prod of producciones" class="mb-2 bg-teatro-gray-900 p-3 rounded-lg shadow-sm flex flex-col gap-1">
          <div>
            <span class="font-semibold">{{ prod.nombre }}</span>
            <span class="ml-2 text-xs px-2 py-1 bg-teatro-crimson-dark text-white rounded" *ngIf="prod.estado === 'En temporada'">{{ prod.estado }}</span>
            <span class="ml-2 text-xs px-2 py-1 bg-teatro-success text-white rounded" *ngIf="prod.estado === 'Finalizada'">{{ prod.estado }}</span>
          </div>
          <div class="text-teatro-gray-200 text-xs">Fecha: {{ prod.fecha }} | Tipo: {{ prod.tipo }}</div>
        </li>
      </ul>
      <div *ngIf="producciones.length === 0" class="text-teatro-gray-400 py-3">No hay producciones activas actualmente.</div>
    </div>
  `,
  styles: ``
})
export class ProduccionesListComponent {
  producciones: ProduccionMock[] = [
    {
      id: 1,
      nombre: 'Carmen',
      estado: 'En temporada',
      fecha: '2026-01-24',
      tipo: 'Ópera'
    },
    {
      id: 2,
      nombre: 'El Lago de los Cisnes',
      estado: 'En temporada',
      fecha: '2026-02-14',
      tipo: 'Ballet'
    },
    {
      id: 3,
      nombre: 'Festival Flamenco',
      estado: 'Finalizada',
      fecha: '2025-12-11',
      tipo: 'Flamenco'
    }
  ];
}
