import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-producciones',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-white">Producciones</h1>
          <p class="text-tr-gray-400">Gestión de óperas y espectáculos</p>
        </div>
        <div class="flex gap-2">
          <button class="btn-primary flex items-center gap-2">
            <span class="material-icons text-lg">add</span>
            Nueva Producción
          </button>
        </div>
      </div>

      <!-- Lista de producciones -->
      <div class="space-y-4">
        @for (produccion of producciones; track produccion.titulo) {
          <div class="card-hover">
            <div class="flex flex-col md:flex-row md:items-center gap-4">
              <div class="w-full md:w-32 h-20 rounded-lg bg-gradient-to-br from-teatro-carmesi to-teatro-carmesi-dark flex items-center justify-center">
                <span class="material-icons text-4xl text-white/50">music_note</span>
              </div>
              <div class="flex-1">
                <h3 class="text-white font-semibold text-lg">{{ produccion.titulo }}</h3>
                <p class="text-tr-gray-400">{{ produccion.compositor }} · {{ produccion.temporada }}</p>
                <div class="flex flex-wrap gap-2 mt-2">
                  <span class="badge bg-actividad-funcion/20 text-actividad-funcion">{{ produccion.funciones }} funciones</span>
                  <span class="badge bg-actividad-ensayo/20 text-actividad-ensayo">{{ produccion.ensayos }} ensayos</span>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <button class="btn-secondary text-sm">Ver detalles</button>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class ProduccionesComponent {
  producciones = [
    { titulo: 'La Traviata', compositor: 'Giuseppe Verdi', temporada: '2024-2025', funciones: 12, ensayos: 8 },
    { titulo: 'Carmen', compositor: 'Georges Bizet', temporada: '2024-2025', funciones: 10, ensayos: 6 },
    { titulo: 'El Barbero de Sevilla', compositor: 'Gioachino Rossini', temporada: '2024-2025', funciones: 8, ensayos: 5 },
    { titulo: 'Tosca', compositor: 'Giacomo Puccini', temporada: '2024-2025', funciones: 6, ensayos: 4 }
  ];
}
