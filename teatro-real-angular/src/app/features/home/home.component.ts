import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-white">Vista Global</h1>
          <p class="text-tr-gray-400">Resumen de actividades del Teatro Real</p>
        </div>
        <div class="flex gap-2">
          <button class="btn-primary flex items-center gap-2">
            <span class="material-icons text-lg">add</span>
            Nueva Actividad
          </button>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        @for (stat of stats; track stat.title) {
          <div class="card">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-lg flex items-center justify-center" [style.background-color]="stat.color + '20'">
                <span class="material-icons text-2xl" [style.color]="stat.color">{{ stat.icon }}</span>
              </div>
              <div>
                <p class="text-tr-gray-400 text-sm">{{ stat.title }}</p>
                <p class="text-2xl font-bold text-white">{{ stat.value }}</p>
              </div>
            </div>
          </div>
        }
      </div>

      <!-- Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Actividades de hoy -->
        <div class="lg:col-span-2 card">
          <h3 class="text-lg font-semibold text-white mb-4">Actividades de Hoy</h3>
          <div class="space-y-3">
            @for (activity of todayActivities; track activity.title) {
              <div class="flex items-center gap-4 p-3 rounded-lg bg-teatro-negro hover:bg-tr-gray-900 transition-colors">
                <div class="w-1 h-12 rounded-full" [style.background-color]="activity.color"></div>
                <div class="flex-1 min-w-0">
                  <p class="text-white font-medium truncate">{{ activity.title }}</p>
                  <p class="text-tr-gray-400 text-sm">{{ activity.location }} · {{ activity.time }}</p>
                </div>
                <span class="badge" [style.background-color]="activity.color + '20'" [style.color]="activity.color">
                  {{ activity.type }}
                </span>
              </div>
            }
          </div>
        </div>

        <!-- Próximos eventos -->
        <div class="card">
          <h3 class="text-lg font-semibold text-white mb-4">Próximos Eventos</h3>
          <div class="space-y-4">
            @for (event of upcomingEvents; track event.title) {
              <div class="border-l-2 border-teatro-carmesi pl-4">
                <p class="text-white font-medium">{{ event.title }}</p>
                <p class="text-tr-gray-400 text-sm">{{ event.date }}</p>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `
})
export class HomeComponent {
  stats = [
    { title: 'Actividades Hoy', value: '12', icon: 'event', color: '#CF102D' },
    { title: 'Espacios Ocupados', value: '8/15', icon: 'location_city', color: '#1E3A5F' },
    { title: 'Producciones Activas', value: '4', icon: 'music_note', color: '#2E7D32' },
    { title: 'Notificaciones', value: '3', icon: 'notifications', color: '#EF6C00' }
  ];

  todayActivities = [
    { title: 'Ensayo - La Traviata', location: 'Escenario Principal', time: '10:00 - 14:00', type: 'Ensayo', color: '#2E7D32' },
    { title: 'Función - Carmen', location: 'Sala Principal', time: '20:00 - 23:00', type: 'Función', color: '#1E3A5F' },
    { title: 'Montaje - El Barbero de Sevilla', location: 'Sala Gayarre', time: '09:00 - 18:00', type: 'Montaje', color: '#E57373' },
    { title: 'Visita Guiada', location: 'Recorrido General', time: '11:00 - 12:30', type: 'Visita', color: '#7B1FA2' }
  ];

  upcomingEvents = [
    { title: 'Estreno - Tosca', date: '15 Dic 2024' },
    { title: 'Concierto de Navidad', date: '22 Dic 2024' },
    { title: 'Gala de Fin de Año', date: '31 Dic 2024' }
  ];
}
