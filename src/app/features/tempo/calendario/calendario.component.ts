import { Component, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FullCalendarModule } from '@fullcalendar/angular';
import esLocale from '@fullcalendar/core/locales/es';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

import { ActividadService } from '../services/actividad.service';
import { EspacioService } from '../services/espacio.service';
import { TipoActividadService } from '../services/tipo-actividad.service';
import { TemporadaService } from '../../../core/services/temporada.service';

/**
 * Componente Calendario con FullCalendar integrado.
 * - Filtrado por espacio y tipo de actividad
 * - Muestra eventos reales conectados vía signals/servicio
 * - Drag&drop listo, feedback visual, estilos institucionales
 */
@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [CommonModule, FullCalendarModule],
  template: `
    <div class="page">
      <div class="space-y-6">
        <!-- Header -->
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 class="text-3xl font-semibold text-gray-800">Calendario de Actividades</h1>
            <p class="text-gray-500">Visualiza y gestiona las actividades programadas</p>
          </div>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <article class="stat-card">
            <p class="text-sm text-gray-500 uppercase tracking-wide">Actividades Mes</p>
            <p class="text-3xl font-semibold text-gray-800 mt-1">{{ actividadService.actividades().length }}</p>
          </article>
          <article class="stat-card">
            <p class="text-sm text-gray-500 uppercase tracking-wide">Espacios</p>
            <p class="text-3xl font-semibold text-blue-600 mt-1">{{ espacios().length }}</p>
          </article>
          <article class="stat-card">
            <p class="text-sm text-gray-500 uppercase tracking-wide">Tipos</p>
            <p class="text-3xl font-semibold text-green-600 mt-1">{{ tipos().length }}</p>
          </article>
          <article class="stat-card">
            <p class="text-sm text-gray-500 uppercase tracking-wide">Cargando</p>
            <p class="text-3xl font-semibold mt-1" [class.text-yellow-600]="actividadService.loading()" [class.text-gray-400]="!actividadService.loading()">
              {{ actividadService.loading() ? 'Sí' : 'No' }}
            </p>
          </article>
        </div>

        <!-- Filtros -->
        <div class="card">
          <div class="flex flex-wrap gap-4 items-end">
            <div>
              <label for="filtro-espacio" class="form-label">Espacio</label>
              <select id="filtro-espacio" class="form-select"
                [value]="selectedEspacioId()" (change)="onEspacioChange($event)">
                <option value="">Todos los espacios</option>
                <option *ngFor="let espacio of espacios()" [value]="espacio.id">
                  {{ espacio.nombre }}
                </option>
              </select>
            </div>
            <div>
              <label for="filtro-tipo" class="form-label">Tipo Actividad</label>
              <select id="filtro-tipo" class="form-select"
                [value]="selectedTipoId()" (change)="onTipoChange($event)">
                <option value="">Todos los tipos</option>
                <option *ngFor="let tipo of tipos()" [value]="tipo.id">
                  {{ tipo.nombre }}
                </option>
              </select>
            </div>
            <div>
              <label for="filtro-temporada" class="form-label">Temporada</label>
              <select id="filtro-temporada" class="form-select"
                [value]="selectedTemporadaId()" (change)="onTemporadaChange($event)">
                <option value="">Todas</option>
                <option *ngFor="let temp of temporadas()" [value]="temp.id">
                  {{ temp.nombre }}
                </option>
              </select>
            </div>
            <button class="btn-secondary" (click)="resetFiltros()">
              <span class="material-icons text-sm">clear</span>
              Limpiar
            </button>
            <button class="btn-primary ml-auto" (click)="loadActividades()">
              <span class="material-icons text-sm">refresh</span>
              Recargar
            </button>
          </div>
        </div>

        <!-- Calendario -->
        <div class="card calendar-card">
          @if (actividadService.loading()) {
            <div class="loading-overlay">
              <div class="animate-spin w-8 h-8 border-4 border-[#CF102D] border-t-transparent rounded-full"></div>
              <p class="mt-2 text-gray-500">Cargando actividades...</p>
            </div>
          }
          <full-calendar [options]="calendarOptions()"></full-calendar>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      background: #f2f4f7;
    }

    .page {
      background: #f2f4f7;
      padding: 2rem;
      min-height: 100vh;
    }

    .card {
      background: #ffffff;
      border-radius: 1rem;
      border: 1px solid rgba(15, 23, 42, 0.08);
      padding: 1.25rem;
      box-shadow: 0 4px 12px rgba(15, 23, 42, 0.06);
    }

    .calendar-card {
      position: relative;
      padding: 1rem;
    }

    .stat-card {
      border-radius: 0.9rem;
      border: 1px solid rgba(15, 23, 42, 0.08);
      padding: 1rem 1.25rem;
      background: #ffffff;
      box-shadow: 0 4px 12px rgba(15, 23, 42, 0.06);
    }

    .form-label {
      display: block;
      font-size: 0.75rem;
      font-weight: 600;
      color: #6b7280;
      margin-bottom: 0.35rem;
      text-transform: uppercase;
      letter-spacing: 0.025em;
    }

    .form-select {
      padding: 0.5rem 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      font-size: 0.875rem;
      background: white;
      cursor: pointer;
      min-width: 160px;
    }

    .form-select:focus {
      outline: none;
      border-color: #CF102D;
      box-shadow: 0 0 0 2px rgba(207, 16, 45, 0.1);
    }

    .btn-primary {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: #CF102D;
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-primary:hover {
      background: #a80d25;
    }

    .btn-secondary {
      display: flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.5rem 1rem;
      background: #f3f4f6;
      color: #374151;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      font-weight: 500;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-secondary:hover {
      background: #e5e7eb;
    }

    .loading-overlay {
      position: absolute;
      inset: 0;
      background: rgba(255, 255, 255, 0.9);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 10;
      border-radius: 1rem;
    }

    /* FullCalendar overrides */
    :host ::ng-deep .fc {
      font-family: inherit;
    }

    :host ::ng-deep .fc-toolbar-title {
      font-size: 1.25rem !important;
      font-weight: 600;
      color: #1f2937;
    }

    :host ::ng-deep .fc-button-primary {
      background-color: #CF102D !important;
      border-color: #CF102D !important;
    }

    :host ::ng-deep .fc-button-primary:hover {
      background-color: #a80d25 !important;
      border-color: #a80d25 !important;
    }

    :host ::ng-deep .fc-button-primary:not(:disabled).fc-button-active {
      background-color: #8a0b1e !important;
      border-color: #8a0b1e !important;
    }

    :host ::ng-deep .fc-day-today {
      background-color: rgba(207, 16, 45, 0.08) !important;
    }

    :host ::ng-deep .fc-event {
      border-radius: 4px;
      padding: 2px 4px;
      font-size: 0.8rem;
      cursor: pointer;
    }

    :host ::ng-deep .fc-daygrid-day-number {
      font-weight: 500;
      color: #374151;
    }

    :host ::ng-deep .fc-col-header-cell-cushion {
      font-weight: 600;
      color: #6b7280;
      text-transform: uppercase;
      font-size: 0.75rem;
    }
  `]
})
export class CalendarioComponent {
  // Inyecta servicios de dominio
  actividadService = inject(ActividadService);
  private espacioService = inject(EspacioService);
  private tipoActividadService = inject(TipoActividadService);
  private temporadaService = inject(TemporadaService);

  // State signals para filtros seleccionados
  selectedEspacioId = signal<string | ''>('');
  selectedTipoId = signal<string | ''>('');
  selectedTemporadaId = signal<string | ''>('');

  // Signals públicas para el template
  espacios = this.espacioService.espacios;
  tipos = this.tipoActividadService.tipos;
  temporadas = this.temporadaService.temporadas;

  // Signal para el rango actualmente visible
  private rangeStart = signal<string>(new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0,10));
  private rangeEnd = signal<string>(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().slice(0,10));

  constructor() {
    // Carga espacios/tipos si no hay
    if (this.espacioService.espacios().length === 0) {
      this.espacioService.loadEspacios().subscribe();
    }
    if (this.tipoActividadService.tipos().length === 0) {
      this.tipoActividadService.loadTiposActividad().subscribe();
    }

    this.loadActividades();

    // Recarga actividades al cambiar filtro
    effect(() => {
      // Lee los valores para crear dependencia
      this.selectedEspacioId();
      this.selectedTipoId();
      this.selectedTemporadaId();
      this.loadActividades();
    }, { allowSignalWrites: true });
  }

  // Carga actividades para un rango opcional de fechas
  loadActividades(rangoInicio?: string, rangoFin?: string): void {
    const inicio = rangoInicio ?? this.rangeStart();
    const fin = rangoFin ?? this.rangeEnd();
    this.actividadService.loadActividades({
      fechaInicio: inicio,
      fechaFin: fin,
      espacioId: this.selectedEspacioId() ? Number(this.selectedEspacioId()) : undefined,
      tipoActividadId: this.selectedTipoId() ? Number(this.selectedTipoId()) : undefined,
      temporadaId: this.selectedTemporadaId() ? Number(this.selectedTemporadaId()) : undefined
    }).subscribe({
      next: (data) => console.log('Actividades cargadas:', data.length),
      error: (err) => console.error('Error cargando actividades:', err)
    });
  }

  // Event handlers
  onEspacioChange(e: Event): void {
    const val = (e.target as HTMLSelectElement).value;
    this.selectedEspacioId.set(val);
  }

  onTipoChange(e: Event): void {
    const val = (e.target as HTMLSelectElement).value;
    this.selectedTipoId.set(val);
  }

  onTemporadaChange(e: Event): void {
    const val = (e.target as HTMLSelectElement).value;
    this.selectedTemporadaId.set(val);
  }

  resetFiltros(): void {
    this.selectedEspacioId.set('');
    this.selectedTipoId.set('');
    this.selectedTemporadaId.set('');
  }

  // Opciones calculadas de FullCalendar
  calendarOptions = computed(() => {
    const self = this;
    const actividades = this.actividadService.actividades();

    const eventos = actividades.map(act => ({
      id: act.id,
      title: act.titulo,
      start: act.fecha + 'T' + act.horaInicio,
      end: act.fecha + 'T' + act.horaFin,
      color: act.tipoActividad?.colorHex || '#CF102D',
      extendedProps: {
        espacio: act.espacio?.nombre,
        tipo: act.tipoActividad?.nombre,
        departamento: act.departamento?.nombre,
        estado: act.estado,
      }
    }));

    return {
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
      locale: esLocale,
      height: 'auto',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      },
      editable: true,
      selectable: true,
      themeSystem: 'standard',
      events: eventos,
      datesSet(arg: any) {
        self.rangeStart.set(arg.startStr);
        self.rangeEnd.set(arg.endStr);
        self.actividadService.loadActividades({
          fechaInicio: arg.startStr,
          fechaFin: arg.endStr,
          espacioId: self.selectedEspacioId() ? Number(self.selectedEspacioId()) : undefined,
          tipoActividadId: self.selectedTipoId() ? Number(self.selectedTipoId()) : undefined,
          temporadaId: self.selectedTemporadaId() ? Number(self.selectedTemporadaId()) : undefined
        }).subscribe();
      },
      eventClick: (info: any) => {
        alert(
          `Título: ${info.event.title}\nEspacio: ${info.event.extendedProps.espacio}\nTipo: ${info.event.extendedProps.tipo}\nEstado: ${info.event.extendedProps.estado}`
        );
      },
      eventDrop: (info: any) => {
        alert('Arrastrado a: ' + info.event.startStr);
      }
    };
  });
}
