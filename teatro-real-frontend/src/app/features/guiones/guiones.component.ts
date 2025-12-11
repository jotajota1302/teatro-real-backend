import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-guiones',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-white">Guiones Técnicos</h1>
          <p class="text-tr-gray-400">Gestión de guiones de regiduría</p>
        </div>
        <div class="flex gap-2">
          <button class="btn-secondary flex items-center gap-2">
            <span class="material-icons text-lg">upload</span>
            Importar
          </button>
          <button class="btn-primary flex items-center gap-2">
            <span class="material-icons text-lg">add</span>
            Nuevo Guión
          </button>
        </div>
      </div>

      <!-- Lista de guiones -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        @for (guion of guiones; track guion.titulo) {
          <div class="card-hover">
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 rounded-lg bg-teatro-carmesi/20 flex items-center justify-center">
                <span class="material-icons text-teatro-carmesi">description</span>
              </div>
              <div class="flex-1">
                <h3 class="text-white font-semibold">{{ guion.titulo }}</h3>
                <p class="text-tr-gray-400 text-sm">{{ guion.produccion }}</p>
                <div class="flex items-center gap-4 mt-2 text-xs text-tr-gray-400">
                  <span>{{ guion.actos }} actos</span>
                  <span>{{ guion.cues }} cues</span>
                  <span>Actualizado: {{ guion.actualizado }}</span>
                </div>
              </div>
              <button class="text-tr-gray-400 hover:text-white">
                <span class="material-icons">more_vert</span>
              </button>
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class GuionesComponent {
  guiones = [
    { titulo: 'Guión de Regiduría', produccion: 'La Traviata', actos: 3, cues: 245, actualizado: '10 Dic 2024' },
    { titulo: 'Guión de Regiduría', produccion: 'Carmen', actos: 4, cues: 312, actualizado: '8 Dic 2024' },
    { titulo: 'Guión de Regiduría', produccion: 'El Barbero de Sevilla', actos: 2, cues: 178, actualizado: '5 Dic 2024' },
    { titulo: 'Guión de Regiduría', produccion: 'Tosca', actos: 3, cues: 198, actualizado: '1 Dic 2024' }
  ];
}
