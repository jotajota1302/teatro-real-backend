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
    <div class="calendario-container">
      <div class="filtros flex gap-4 items-end mb-6">
        <div>
          <label for="filtro-espacio" class="block text-xs font-medium text-gray-600">Espacio</label>
          <select id="filtro-espacio" class="border rounded p-1 w-36"
            [value]="selectedEspacioId()" (change)="onEspacioChange($event)">
            <option value="">Todos</option>
            <option *ngFor="let espacio of espacios()" [value]="espacio.id">
              {{espacio.nombre}}
            </option>
          </select>
        </div>
        <div>
          <label for="filtro-tipo" class="block text-xs font-medium text-gray-600">Tipo Actividad</label>
          <select id="filtro-tipo" class="border rounded p-1 w-44"
            [value]="selectedTipoId()" (change)="onTipoChange($event)">
            <option value="">Todos</option>
            <option *ngFor="let tipo of tipos()" [value]="tipo.id">
              {{tipo.nombre}}
            </option>
          </select>
        </div>
        <div>
          <label for="filtro-temporada" class="block text-xs font-medium text-gray-600">Temporada</label>
          <select id="filtro-temporada" class="border rounded p-1 w-40"
            [value]="selectedTemporadaId()" (change)="onTemporadaChange($event)">
            <option value="">Todas</option>
            <option *ngFor="let temp of temporadas()" [value]="temp.id">
              {{temp.nombre}}
            </option>
          </select>
        </div>
        <button class="ml-auto border rounded px-3 py-1 bg-gray-100 hover:bg-gray-200 text-sm" (click)="resetFiltros()">
          Limpiar filtros
        </button>
      </div>

      <full-calendar
        [options]="calendarOptions()"
        style="background: #fff; border-radius: 14px; box-shadow: 0 2px 8px rgba(0,0,0,0.02);"
      ></full-calendar>
    </div>
  `,
  styles: [`
    .calendario-container {
      min-height: 580px;
      background: #fafafa;
      border-radius: 8px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.05);
      padding: 2rem;
      width: 100%;
      max-width: 1100px;
      margin: 0 auto;
      box-sizing: border-box;
    }
    .filtros select {
      min-width: 100px;
      font-size: 0.93rem;
    }
    :host ::ng-deep .fc {
      font-size: 1rem;
      font-family: inherit;
    }
    :host ::ng-deep .fc-toolbar-title {
      font-weight: 600;
    }
    :host ::ng-deep .fc-day-today {
      background-color: #ffe9b3 !important;
    }
  `]
})
export class CalendarioComponent {
  // Inyecta servicios de dominio
  private actividadService = inject(ActividadService);
  private espacioService = inject(EspacioService);
  private tipoActividadService = inject(TipoActividadService);
  private temporadaService = inject(TemporadaService);

  // State signals para filtros seleccionados (ahora públicas)
  selectedEspacioId = signal<string | ''>('');
  selectedTipoId = signal<string | ''>('');
  selectedTemporadaId = signal<string | ''>('');

  // Signals públicas para el template
  espacios = this.espacioService.espacios;
  tipos = this.tipoActividadService.tipos;
  temporadas = this.temporadaService.temporadas;

  constructor() {
    // Carga espacios/tipos si no hay (evita recargar si ya están en memoria)
    if (this.espacioService.espacios().length === 0) {
      this.espacioService.loadEspacios().subscribe();
    }
    if (this.tipoActividadService.tipos().length === 0) {
      this.tipoActividadService.loadTiposActividad().subscribe();
    }

    this.loadActividades();

    // Recarga actividades al cambiar filtro (con el último rango)
    effect(() => {
      this.loadActividades();
    }, { allowSignalWrites: true });
  }

  // Carga actividades para un rango opcional de fechas, aplicando filtros
  loadActividades(rangoInicio?: string, rangoFin?: string): void {
    const inicio = rangoInicio ?? this.rangeStart();
    const fin = rangoFin ?? this.rangeEnd();
    this.actividadService.loadActividades({
      fechaInicio: inicio,
      fechaFin: fin,
      espacioId: this.selectedEspacioId() ? Number(this.selectedEspacioId()) : undefined,
      tipoActividadId: this.selectedTipoId() ? Number(this.selectedTipoId()) : undefined,
      temporadaId: this.selectedTemporadaId() ? Number(this.selectedTemporadaId()) : undefined
    }).subscribe();
  }

  // Event handler: filtro espacio
  onEspacioChange(e: Event): void {
    const val = (e.target as HTMLSelectElement).value;
    this.selectedEspacioId.set(val);
  }
  // Event handler: filtro tipo
  onTipoChange(e: Event): void {
    const val = (e.target as HTMLSelectElement).value;
    this.selectedTipoId.set(val);
  }
  // Event handler: filtro temporada
  onTemporadaChange(e: Event): void {
    const val = (e.target as HTMLSelectElement).value;
    this.selectedTemporadaId.set(val);
  }
  // Limpiar filtros (todos a '')
  resetFiltros(): void {
    this.selectedEspacioId.set('');
    this.selectedTipoId.set('');
    this.selectedTemporadaId.set('');
  }

  // Opciones calculadas de FullCalendar segun los datos filtrados
  // Añade un signal para el rango actualmente visible (inicialmente el mes actual)
  private rangeStart = signal<string>(new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0,10));
  private rangeEnd = signal<string>(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().slice(0,10));

  calendarOptions = computed(() => {
    const self = this;
    const actividades = this.actividadService.actividades();
    const eventos = actividades.map(act => {
      return {
        id: act.id,
        title: act.titulo,
        start: act.fecha + 'T' + act.horaInicio,
        end: act.fecha + 'T' + act.horaFin,
        color: act.tipoActividad?.colorHex || '#888',
        extendedProps: {
          espacio: act.espacio?.nombre,
          tipo: act.tipoActividad?.nombre,
          departamento: act.departamento?.nombre,
          estado: act.estado,
        }
      };
    });

    return {
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
      locale: esLocale,
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
        // Se llama cada vez que cambias de mes/semana/día en el calendario
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
          `Título: ${info.event.title}\nEspacio: ${info.event.extendedProps.espacio}\nTipo: ${info.event.extendedProps.tipo}`
        );
      },
      eventDrop: (info: any) => {
        alert('Arrastrado a: ' + info.event.startStr);
      }
    };
  });
}
