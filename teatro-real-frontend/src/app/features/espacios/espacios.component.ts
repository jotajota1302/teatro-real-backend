import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-espacios',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-white">Espacios</h1>
          <p class="text-tr-gray-400">Gestión de salas y ubicaciones del teatro</p>
        </div>
        <div class="flex gap-2">
          <button class="btn-primary flex items-center gap-2">
            <span class="material-icons text-lg">add</span>
            Nuevo Espacio
          </button>
        </div>
      </div>

      <!-- Grid de espacios -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        @for (espacio of espacios; track espacio.nombre) {
          <div class="card-hover cursor-pointer">
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 rounded-lg bg-teatro-carmesi/20 flex items-center justify-center">
                <span class="material-icons text-teatro-carmesi">{{ espacio.icon }}</span>
              </div>
              <div class="flex-1">
                <h3 class="text-white font-semibold">{{ espacio.nombre }}</h3>
                <p class="text-tr-gray-400 text-sm">{{ espacio.tipo }}</p>
                <div class="flex items-center gap-2 mt-2">
                  <span class="w-2 h-2 rounded-full" [class.bg-estado-exito]="espacio.disponible" [class.bg-estado-error]="!espacio.disponible"></span>
                  <span class="text-xs" [class.text-estado-exito]="espacio.disponible" [class.text-estado-error]="!espacio.disponible">
                    {{ espacio.disponible ? 'Disponible' : 'Ocupado' }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class EspaciosComponent {
  espacios = [
    { nombre: 'Escenario Principal', tipo: 'Escenario', icon: 'theater_comedy', disponible: false },
    { nombre: 'Sala Gayarre', tipo: 'Sala de ensayos', icon: 'meeting_room', disponible: true },
    { nombre: 'Sala Barbieri', tipo: 'Sala de ensayos', icon: 'meeting_room', disponible: true },
    { nombre: 'Foso de Orquesta', tipo: 'Espacio técnico', icon: 'music_note', disponible: false },
    { nombre: 'Camerinos Principales', tipo: 'Camerinos', icon: 'person', disponible: true },
    { nombre: 'Almacén de Vestuario', tipo: 'Almacén', icon: 'inventory_2', disponible: true }
  ];
}
