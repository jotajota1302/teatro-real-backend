import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-carteleria',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-white">Cartelería Digital</h1>
          <p class="text-tr-gray-400">Gestión de pantallas y contenidos</p>
        </div>
        <div class="flex gap-2">
          <button class="btn-secondary flex items-center gap-2">
            <span class="material-icons text-lg">visibility</span>
            Vista previa
          </button>
          <button class="btn-primary flex items-center gap-2">
            <span class="material-icons text-lg">publish</span>
            Publicar
          </button>
        </div>
      </div>

      <!-- Grid de pantallas -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        @for (pantalla of pantallas; track pantalla.nombre) {
          <div class="card-hover">
            <div class="aspect-video bg-teatro-negro rounded-lg mb-3 flex items-center justify-center border border-tr-gray-800">
              <span class="material-icons text-4xl text-tr-gray-600">tv</span>
            </div>
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-white font-medium">{{ pantalla.nombre }}</h3>
                <p class="text-tr-gray-400 text-sm">{{ pantalla.ubicacion }}</p>
              </div>
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full" [class.bg-estado-exito]="pantalla.activa" [class.bg-estado-error]="!pantalla.activa"></span>
                <span class="text-xs" [class.text-estado-exito]="pantalla.activa" [class.text-estado-error]="!pantalla.activa">
                  {{ pantalla.activa ? 'Activa' : 'Inactiva' }}
                </span>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class CarteleriaComponent {
  pantallas = [
    { nombre: 'Pantalla Vestíbulo', ubicacion: 'Entrada principal', activa: true },
    { nombre: 'Pantalla Foyer', ubicacion: 'Foyer planta baja', activa: true },
    { nombre: 'Pantalla Palcos', ubicacion: 'Pasillo palcos', activa: true },
    { nombre: 'Pantalla Cafetería', ubicacion: 'Zona descanso', activa: false },
    { nombre: 'Pantalla Backstage', ubicacion: 'Zona técnica', activa: true },
    { nombre: 'Pantalla Exterior', ubicacion: 'Fachada', activa: true }
  ];
}
