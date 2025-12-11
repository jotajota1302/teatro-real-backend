import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-logistica',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-white">Logística</h1>
          <p class="text-tr-gray-400">Gestión de cargas, descargas y transportes</p>
        </div>
        <div class="flex gap-2">
          <button class="btn-primary flex items-center gap-2">
            <span class="material-icons text-lg">add</span>
            Nueva Operación
          </button>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="card">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-actividad-cargas/20 flex items-center justify-center">
              <span class="material-icons text-actividad-cargas">local_shipping</span>
            </div>
            <div>
              <p class="text-tr-gray-400 text-sm">Cargas Pendientes</p>
              <p class="text-xl font-bold text-white">3</p>
            </div>
          </div>
        </div>
        <div class="card">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-estado-exito/20 flex items-center justify-center">
              <span class="material-icons text-estado-exito">check_circle</span>
            </div>
            <div>
              <p class="text-tr-gray-400 text-sm">Completadas Hoy</p>
              <p class="text-xl font-bold text-white">5</p>
            </div>
          </div>
        </div>
        <div class="card">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-estado-advertencia/20 flex items-center justify-center">
              <span class="material-icons text-estado-advertencia">schedule</span>
            </div>
            <div>
              <p class="text-tr-gray-400 text-sm">En Tránsito</p>
              <p class="text-xl font-bold text-white">2</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Lista de operaciones -->
      <div class="card">
        <h3 class="text-lg font-semibold text-white mb-4">Operaciones Recientes</h3>
        <div class="space-y-3">
          @for (op of operaciones; track op.id) {
            <div class="flex items-center gap-4 p-3 rounded-lg bg-teatro-negro">
              <div class="w-10 h-10 rounded-lg flex items-center justify-center" [style.background-color]="op.color + '20'">
                <span class="material-icons" [style.color]="op.color">{{ op.icon }}</span>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-white font-medium">{{ op.descripcion }}</p>
                <p class="text-tr-gray-400 text-sm">{{ op.produccion }} · {{ op.fecha }}</p>
              </div>
              <span class="badge" [style.background-color]="op.estadoColor + '20'" [style.color]="op.estadoColor">
                {{ op.estado }}
              </span>
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class LogisticaComponent {
  operaciones = [
    { id: 1, descripcion: 'Carga de escenografía', produccion: 'La Traviata', fecha: 'Hoy 14:00', estado: 'Pendiente', estadoColor: '#EF6C00', icon: 'upload', color: '#F9A825' },
    { id: 2, descripcion: 'Descarga de vestuario', produccion: 'Carmen', fecha: 'Hoy 10:00', estado: 'Completado', estadoColor: '#2E7D32', icon: 'download', color: '#2E7D32' },
    { id: 3, descripcion: 'Transporte de instrumentos', produccion: 'Orquesta', fecha: 'Ayer', estado: 'Completado', estadoColor: '#2E7D32', icon: 'local_shipping', color: '#1565C0' }
  ];
}
