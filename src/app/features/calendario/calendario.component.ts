import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-white">Calendario</h1>
          <p class="text-tr-gray-400">Gestión de actividades y eventos</p>
        </div>
        <div class="flex gap-2">
          <button class="btn-secondary flex items-center gap-2">
            <span class="material-icons text-lg">filter_list</span>
            Filtros
          </button>
          <button class="btn-primary flex items-center gap-2">
            <span class="material-icons text-lg">add</span>
            Nueva Actividad
          </button>
        </div>
      </div>

      <!-- Placeholder del calendario -->
      <div class="card min-h-[600px] flex items-center justify-center">
        <div class="text-center">
          <span class="material-icons text-6xl text-tr-gray-600 mb-4">calendar_month</span>
          <p class="text-tr-gray-400">Aquí se integrará el calendario completo</p>
          <p class="text-tr-gray-600 text-sm mt-2">FullCalendar / Angular Calendar</p>
        </div>
      </div>
    </div>
  `
})
export class CalendarioComponent {}
