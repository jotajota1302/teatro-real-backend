import { Component, inject, signal, computed, DestroyRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { FullCalendarModule } from '@fullcalendar/angular';
import esLocale from '@fullcalendar/core/locales/es';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarOptions, EventInput } from '@fullcalendar/core';

import { LogisticaService, OperacionLogisticaDto } from './logistica.service';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-logistica-calendario',
  standalone: true,
  imports: [CommonModule, FullCalendarModule, RouterLink],
  template: `
    <div class="page" [class]="isDark() ? 'page-dark' : 'page-light'">
      <!-- Header compacto -->
      <div class="header-section">
        <div class="flex items-center justify-between">
          <h1 class="text-2xl font-semibold" [class]="isDark() ? 'text-white' : 'text-gray-800'">Calendario Logística</h1>
          <div class="flex gap-2">
            <a routerLink="/tempo/movimientos" [class]="isDark() ? 'btn-secondary-sm-dark' : 'btn-secondary-sm'">
              <span class="material-icons text-base">list</span>
              Lista
            </a>
            <button class="btn-nuevo-sm" (click)="abrirModalNuevaOperacion()">
              <span class="material-icons text-base">add</span>
              Nueva
            </button>
          </div>
        </div>
      </div>

      <!-- Filtros compactos -->
      <div class="filters-section" [class]="isDark() ? 'filters-dark' : 'filters-light'">
        <div class="flex flex-wrap gap-3 items-center">
          <select [class]="isDark() ? 'form-select-sm-dark' : 'form-select-sm'" [value]="selectedTipo()" (change)="onTipoChange($event)">
            <option value="">Todos los tipos</option>
            <option value="ENTRADA">Recogidas</option>
            <option value="SALIDA">Salidas</option>
            <option value="INTERNO">Transportes</option>
          </select>
          <select [class]="isDark() ? 'form-select-sm-dark' : 'form-select-sm'" [value]="selectedEstado()" (change)="onEstadoChange($event)">
            <option value="">Todos los estados</option>
            <option value="PENDIENTE">Pendiente</option>
            <option value="EN_TRANSITO">En tránsito</option>
            <option value="COMPLETADO">Completado</option>
          </select>
          <button [class]="isDark() ? 'btn-sm-secondary-dark' : 'btn-sm-secondary'" (click)="resetFiltros()">Limpiar</button>
        </div>
      </div>

      <!-- Calendario -->
      <div class="calendar-wrapper" [class]="isDark() ? 'calendar-wrapper-dark' : 'calendar-wrapper-light'">
        @if (loading()) {
          <div class="loading-overlay" [class]="isDark() ? 'loading-overlay-dark' : ''">
            <div class="animate-spin w-8 h-8 border-4 border-[#CF102D] border-t-transparent rounded-full"></div>
          </div>
        }
        <full-calendar [options]="calendarOptions()"></full-calendar>
      </div>

    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
      overflow: hidden;
    }

    .page {
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;
      padding: 1rem 2rem;
    }

    .page-light {
      background: #f2f4f7;
    }

    .page-dark {
      background: #1a1a1a;
      border-radius: 1rem;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .header-section {
      flex-shrink: 0;
      margin-bottom: 0.75rem;
    }

    .filters-section {
      flex-shrink: 0;
      border-radius: 0.75rem;
      padding: 0.75rem 1rem;
      margin-bottom: 0.75rem;
    }

    .filters-light {
      background: #ffffff;
      border: 1px solid rgba(15, 23, 42, 0.08);
      box-shadow: 0 10px 20px rgba(15, 23, 42, 0.06);
    }

    .filters-dark {
      background: #1a1a1a;
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
    }

    .calendar-wrapper {
      flex: 1 1 0;
      min-height: 0;
      border-radius: 0.75rem;
      padding: 0.75rem;
      overflow: hidden;
      position: relative;
      display: flex;
      flex-direction: column;
    }

    .calendar-wrapper-light {
      background: #ffffff;
      border: 1px solid rgba(15, 23, 42, 0.08);
      box-shadow: 0 15px 30px rgba(15, 23, 42, 0.08);
    }

    .calendar-wrapper-dark {
      background: #1a1a1a;
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
    }

    .calendar-wrapper full-calendar {
      flex: 1 1 0;
      min-height: 0;
    }

    .loading-overlay {
      position: absolute;
      inset: 0;
      background: rgba(255,255,255,0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10;
    }

    .loading-overlay-dark {
      background: rgba(26, 26, 26, 0.9);
    }

    .btn-nuevo-sm {
      display: flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.4rem 0.75rem;
      background: #CF102D;
      color: white;
      border: none;
      border-radius: 6px;
      font-weight: 600;
      font-size: 0.8rem;
      cursor: pointer;
      transition: all 0.2s;
      box-shadow: 0 2px 8px rgba(207, 16, 45, 0.25);
    }

    .btn-nuevo-sm:hover {
      background: #a80d25;
    }

    .btn-secondary-sm {
      display: flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.4rem 0.75rem;
      background: white;
      color: #374151;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-weight: 500;
      font-size: 0.8rem;
      cursor: pointer;
      transition: all 0.2s;
      text-decoration: none;
    }

    .btn-secondary-sm:hover {
      background: #f3f4f6;
    }

    .btn-secondary-sm-dark {
      display: flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.4rem 0.75rem;
      background: #262626;
      color: #e5e7eb;
      border: 1px solid #374151;
      border-radius: 6px;
      font-weight: 500;
      font-size: 0.8rem;
      cursor: pointer;
      transition: all 0.2s;
      text-decoration: none;
    }

    .btn-secondary-sm-dark:hover {
      background: #333333;
    }

    .form-select-sm {
      padding: 0.4rem 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-size: 0.85rem;
      background: white;
      color: #374151;
      cursor: pointer;
      min-width: 140px;
    }

    .form-select-sm:focus {
      outline: none;
      border-color: #CF102D;
      box-shadow: 0 0 0 2px rgba(207, 16, 45, 0.1);
    }

    .form-select-sm-dark {
      padding: 0.4rem 0.75rem;
      border: 1px solid #374151;
      border-radius: 6px;
      font-size: 0.85rem;
      background: #262626;
      color: #e5e7eb;
      cursor: pointer;
      min-width: 140px;
    }

    .form-select-sm-dark:focus {
      outline: none;
      border-color: #CF102D;
      box-shadow: 0 0 0 2px rgba(207, 16, 45, 0.2);
    }

    .form-select-sm-dark option {
      background: #262626;
      color: #e5e7eb;
    }

    .btn-sm-secondary {
      padding: 0.4rem 0.75rem;
      background: #f3f4f6;
      color: #374151;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-size: 0.85rem;
      cursor: pointer;
    }

    .btn-sm-secondary:hover {
      background: #e5e7eb;
    }

    .btn-sm-secondary-dark {
      padding: 0.4rem 0.75rem;
      background: #262626;
      color: #e5e7eb;
      border: 1px solid #374151;
      border-radius: 6px;
      font-size: 0.85rem;
      cursor: pointer;
    }

    .btn-sm-secondary-dark:hover {
      background: #333333;
    }

    /* FullCalendar overrides - altura completa */
    :host ::ng-deep .fc {
      font-family: inherit;
      height: 100% !important;
      color: #374151;
    }

    :host ::ng-deep .fc-view-harness {
      height: 100% !important;
    }

    :host ::ng-deep .fc-view-harness-active > .fc-view {
      height: 100% !important;
    }

    :host ::ng-deep .fc-scrollgrid {
      height: 100% !important;
      border-radius: 8px !important;
      border: 1px solid #e5e7eb !important;
    }

    :host ::ng-deep .fc-scrollgrid-liquid {
      height: 100% !important;
    }

    :host ::ng-deep .fc-scrollgrid > tbody {
      height: 100%;
    }

    :host ::ng-deep .fc-scrollgrid-section-body {
      height: 100%;
    }

    :host ::ng-deep .fc-scrollgrid-section-body > td {
      height: 100%;
    }

    :host ::ng-deep .fc-scroller-harness {
      height: 100% !important;
    }

    :host ::ng-deep .fc-scrollgrid td:last-child {
      border-right: none !important;
    }

    :host ::ng-deep .fc-scrollgrid tr:last-child td {
      border-bottom: none !important;
    }

    :host ::ng-deep .fc-theme-standard td,
    :host ::ng-deep .fc-theme-standard th {
      border-color: #e5e7eb !important;
    }

    /* === Vista MES (dayGridMonth) === */
    :host ::ng-deep .fc-dayGridMonth-view {
      height: 100% !important;
    }

    :host ::ng-deep .fc-dayGridMonth-view .fc-daygrid {
      height: 100% !important;
    }

    :host ::ng-deep .fc-dayGridMonth-view .fc-scroller {
      height: 100% !important;
      overflow: hidden !important;
    }

    :host ::ng-deep .fc-dayGridMonth-view .fc-daygrid-body {
      height: 100% !important;
      width: 100% !important;
    }

    :host ::ng-deep .fc-dayGridMonth-view .fc-scrollgrid-sync-table {
      height: 100% !important;
    }

    /* Ocultar celdas vacías de otros meses */
    :host ::ng-deep .fc-day-other {
      background: #f8f9fa !important;
      visibility: hidden;
    }

    :host ::ng-deep .fc-daygrid-body-unbalanced .fc-daygrid-day-events {
      min-height: 2em;
    }

    :host ::ng-deep .fc-daygrid-body-natural .fc-daygrid-day-events {
      margin-bottom: 0;
    }

    /* === Vistas SEMANA y DÍA (timeGrid) === */
    :host ::ng-deep .fc-timeGridWeek-view,
    :host ::ng-deep .fc-timeGridDay-view {
      height: 100% !important;
      overflow: hidden !important;
    }

    :host ::ng-deep .fc-timeGridWeek-view .fc-scrollgrid,
    :host ::ng-deep .fc-timeGridDay-view .fc-scrollgrid {
      height: 100% !important;
    }

    /* El scroller NO debe hacer scroll - todo debe caber */
    :host ::ng-deep .fc-timeGridWeek-view .fc-scroller,
    :host ::ng-deep .fc-timeGridDay-view .fc-scroller {
      overflow: hidden !important;
      position: relative !important;
      height: 100% !important;
    }

    :host ::ng-deep .fc-timeGridWeek-view .fc-scroller-liquid-absolute,
    :host ::ng-deep .fc-timeGridDay-view .fc-scroller-liquid-absolute {
      position: relative !important;
      overflow: hidden !important;
      height: 100% !important;
    }

    :host ::ng-deep .fc-timegrid-body {
      height: 100% !important;
    }

    :host ::ng-deep .fc-timegrid-slots table {
      height: 100% !important;
    }

    /* Slots de tiempo - altura automática para que quepan todos */
    :host ::ng-deep .fc-timegrid-slot {
      height: auto !important;
      min-height: 0 !important;
    }

    :host ::ng-deep .fc-timegrid-slot-label {
      vertical-align: middle;
      font-size: 0.65rem !important;
      padding: 0 4px !important;
      font-weight: 500;
      color: #6b7280;
    }

    :host ::ng-deep .fc-timegrid-cols {
      height: 100% !important;
    }

    :host ::ng-deep .fc-timegrid-cols table {
      height: 100% !important;
    }

    :host ::ng-deep .fc-timegrid-col {
      height: 100% !important;
    }

    /* Toolbar */
    :host ::ng-deep .fc-toolbar-title {
      font-size: 1.1rem !important;
      font-weight: 600;
      color: #1f2937;
    }

    :host ::ng-deep .fc-toolbar {
      margin-bottom: 0.5rem !important;
    }

    :host ::ng-deep .fc-button {
      padding: 0.3rem 0.6rem !important;
      font-size: 0.8rem !important;
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

    /* Día actual - destacado con amarillo suave */
    :host ::ng-deep .fc-day-today {
      background-color: rgba(251, 191, 36, 0.15) !important;
    }

    :host ::ng-deep .fc-day-today .fc-daygrid-day-number {
      background: #CF102D;
      color: white !important;
      border-radius: 50%;
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
    }

    /* Eventos */
    :host ::ng-deep .fc-event {
      border-radius: 4px;
      padding: 2px 6px;
      font-size: 0.75rem;
      cursor: pointer;
      border: none !important;
      margin-bottom: 2px;
    }

    :host ::ng-deep .fc-daygrid-event {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    :host ::ng-deep .fc-event-title {
      color: white !important;
      font-weight: 500;
    }

    :host ::ng-deep .fc-event-time {
      color: rgba(255,255,255,0.9) !important;
      font-weight: 400;
    }

    :host ::ng-deep .fc-event:hover {
      filter: brightness(1.1);
      transform: scale(1.02);
      transition: all 0.15s ease;
    }

    :host ::ng-deep .fc-daygrid-more-link {
      color: #CF102D !important;
      font-weight: 600;
      font-size: 0.75rem;
    }

    :host ::ng-deep .fc-daygrid-event-dot {
      display: none !important;
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

    /* Estilos para vista semanal/diaria (timeGrid) */
    :host ::ng-deep .fc-timegrid-event {
      border-radius: 4px;
      border: none !important;
      box-shadow: 0 1px 3px rgba(0,0,0,0.2);
    }

    :host ::ng-deep .fc-timegrid-event .fc-event-main {
      padding: 4px 6px;
    }

    :host ::ng-deep .fc-timegrid-event .fc-event-title {
      font-weight: 500;
      font-size: 0.75rem;
    }

    :host ::ng-deep .fc-timegrid-event .fc-event-time {
      font-size: 0.7rem;
      opacity: 0.9;
    }

    /* Línea de hora actual */
    :host ::ng-deep .fc-timegrid-now-indicator-line {
      border-color: #CF102D !important;
      border-width: 2px;
    }

    :host ::ng-deep .fc-timegrid-now-indicator-arrow {
      border-color: #CF102D !important;
    }

    /* ========================================= */
    /* DARK MODE FULLCALENDAR OVERRIDES */
    /* ========================================= */
    :host ::ng-deep .calendar-wrapper-dark .fc {
      color: #e5e7eb;
    }

    :host ::ng-deep .calendar-wrapper-dark .fc-toolbar-title {
      color: #e5e7eb !important;
    }

    :host ::ng-deep .calendar-wrapper-dark .fc-scrollgrid {
      border-color: #374151 !important;
    }

    :host ::ng-deep .calendar-wrapper-dark .fc-theme-standard td,
    :host ::ng-deep .calendar-wrapper-dark .fc-theme-standard th {
      border-color: #374151 !important;
    }

    :host ::ng-deep .calendar-wrapper-dark .fc-col-header-cell-cushion {
      color: #9ca3af;
    }

    :host ::ng-deep .calendar-wrapper-dark .fc-daygrid-day-number {
      color: #e5e7eb;
    }

    :host ::ng-deep .calendar-wrapper-dark .fc-day-other {
      background: #0d0d0d !important;
    }

    :host ::ng-deep .calendar-wrapper-dark .fc-day-today {
      background-color: rgba(207, 16, 45, 0.15) !important;
    }

    :host ::ng-deep .calendar-wrapper-dark .fc-daygrid-more-link {
      color: #CF102D !important;
    }

    :host ::ng-deep .calendar-wrapper-dark .fc-timegrid-slot-label {
      color: #9ca3af;
    }

    :host ::ng-deep .calendar-wrapper-dark .fc-button-primary {
      background-color: #CF102D !important;
      border-color: #CF102D !important;
    }

    :host ::ng-deep .calendar-wrapper-dark .fc-button-primary:hover {
      background-color: #a80d25 !important;
      border-color: #a80d25 !important;
    }

    :host ::ng-deep .calendar-wrapper-dark .fc-button-primary:not(:disabled).fc-button-active {
      background-color: #8a0b1e !important;
      border-color: #8a0b1e !important;
    }
  `]
})
export class LogisticaCalendarioComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  private logisticaService = inject(LogisticaService);
  private themeService = inject(ThemeService);

  isDark = this.themeService.isDark;
  operaciones = signal<OperacionLogisticaDto[]>([]);
  loading = signal(true);
  selectedTipo = signal('');
  selectedEstado = signal('');

  // Computed: eventos filtrados para el calendario
  calendarEvents = computed<EventInput[]>(() => {
    let ops = this.operaciones();

    // Filtrar por tipo
    if (this.selectedTipo()) {
      ops = ops.filter(op => op.tipoMovimiento === this.selectedTipo());
    }

    // Filtrar por estado
    if (this.selectedEstado()) {
      ops = ops.filter(op => op.estado === this.selectedEstado());
    }

    return ops.map(op => this.toCalendarEvent(op));
  });

  // Opciones del calendario
  calendarOptions = computed<CalendarOptions>(() => ({
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    locale: esLocale,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    height: 'parent',
    expandRows: true,
    themeSystem: 'standard',
    events: this.calendarEvents(),
    eventClick: this.onEventClick.bind(this),
    datesSet: this.onDatesSet.bind(this),
    // No mostrar días de otros meses
    showNonCurrentDates: false,
    fixedWeekCount: false,
    // Mostrar máximo 3 eventos, luego "+X más"
    dayMaxEvents: 3,
    moreLinkClick: 'popover',
    // Configuración por vista
    views: {
      dayGridMonth: {
        displayEventTime: false
      },
      timeGridWeek: {
        dayHeaderFormat: { weekday: 'short' as const, day: 'numeric' as const }
      },
      timeGridDay: {
        dayHeaderFormat: { weekday: 'long' as const, day: 'numeric' as const, month: 'long' as const }
      }
    },
    // Forzar eventos como bloques de color
    eventDisplay: 'block',
    // Mostrar solo hora de inicio en el bloque
    eventTimeFormat: {
      hour: '2-digit' as const,
      minute: '2-digit' as const,
      hour12: false
    },
    // Configuración para vista semanal/diaria
    slotMinTime: '08:00:00', // Empezar a las 8:00
    slotMaxTime: '24:00:00', // Terminar a medianoche
    slotEventOverlap: false,
    slotDuration: '00:30:00',
    slotLabelFormat: {
      hour: '2-digit' as const,
      minute: '2-digit' as const,
      hour12: false
    },
    // Mostrar línea de hora actual
    nowIndicator: true
  }));

  ngOnInit(): void {
    this.loadOperaciones();
  }

  private loadOperaciones(): void {
    this.loading.set(true);

    // Cargar operaciones del mes actual
    const now = new Date();
    const inicio = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    const fin = new Date(now.getFullYear(), now.getMonth() + 2, 0).toISOString().split('T')[0];

    this.logisticaService.getCalendario(inicio, fin)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (ops) => {
          this.operaciones.set(ops);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
        }
      });
  }

  onDatesSet(dateInfo: any): void {
    // Recargar cuando cambian las fechas visibles
    const inicio = dateInfo.startStr.split('T')[0];
    const fin = dateInfo.endStr.split('T')[0];

    this.loading.set(true);
    this.logisticaService.getCalendario(inicio, fin)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (ops) => {
          this.operaciones.set(ops);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
        }
      });
  }

  onEventClick(info: any): void {
    const op = info.event.extendedProps.operacion as OperacionLogisticaDto;
    if (!op) return;

    const hora = `${op.hora || '??:??'} - ${op.horaFin || '??:??'}`;
    const tipoLabel = op.tipo || 'Operación';

    // Modal con información de la operación
    const modal = document.createElement('div');
    modal.innerHTML = `
      <div style="position:fixed;inset:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:9999">
        <div style="background:white;border-radius:12px;padding:24px;max-width:420px;width:90%;box-shadow:0 20px 40px rgba(0,0,0,0.3)">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
            <div style="width:12px;height:12px;border-radius:50%;background:${info.event.backgroundColor}"></div>
            <h3 style="margin:0;font-size:1.25rem;color:#1f2937">${op.nombre}</h3>
          </div>
          <div style="display:grid;gap:12px;color:#4b5563">
            <div style="display:flex;align-items:center;gap:8px">
              <span style="font-size:1.2rem">📦</span>
              <span><strong>Tipo:</strong> ${tipoLabel}</span>
            </div>
            <div style="display:flex;align-items:center;gap:8px">
              <span style="font-size:1.2rem">📅</span>
              <span><strong>Fecha:</strong> ${op.fecha}</span>
            </div>
            <div style="display:flex;align-items:center;gap:8px">
              <span style="font-size:1.2rem">🕐</span>
              <span><strong>Horario:</strong> ${hora}</span>
            </div>
            <div style="display:flex;align-items:center;gap:8px">
              <span style="font-size:1.2rem">📍</span>
              <span><strong>Origen:</strong> ${op.desde || 'No especificado'}</span>
            </div>
            <div style="display:flex;align-items:center;gap:8px">
              <span style="font-size:1.2rem">🎯</span>
              <span><strong>Destino:</strong> ${op.hacia || 'No especificado'}</span>
            </div>
            <div style="display:flex;align-items:center;gap:8px">
              <span style="font-size:1.2rem">🚚</span>
              <span><strong>Camiones:</strong> ${op.camiones || 0}</span>
            </div>
            <div style="display:flex;align-items:center;gap:8px">
              <span style="font-size:1.2rem">📊</span>
              <span><strong>Estado:</strong> <span style="color:${op.estadoColor};font-weight:600">${op.estadoLabel}</span></span>
            </div>
            ${op.detalle ? `
            <div style="margin-top:8px;padding-top:12px;border-top:1px solid #e5e7eb">
              <p style="margin:0;font-size:0.875rem;color:#6b7280">${op.detalle}</p>
            </div>` : ''}
          </div>
          <button onclick="this.closest('div[style*=fixed]').remove()"
            style="margin-top:20px;width:100%;padding:10px;background:#CF102D;color:white;border:none;border-radius:8px;font-weight:600;cursor:pointer">
            Cerrar
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  onTipoChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedTipo.set(select.value);
  }

  onEstadoChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedEstado.set(select.value);
  }

  resetFiltros(): void {
    this.selectedTipo.set('');
    this.selectedEstado.set('');
  }

  abrirModalNuevaOperacion(): void {
    // TODO: Implementar modal de nueva operación
    console.log('Abrir modal nueva operación');
  }

  private toCalendarEvent(op: OperacionLogisticaDto): EventInput {
    // Colores según tipo de movimiento
    const colors: Record<string, string> = {
      'ENTRADA': '#34D399',  // Verde - Recogida
      'SALIDA': '#F87171',   // Rosa - Salida
      'INTERNO': '#FBBF24'   // Amarillo - Transporte
    };

    // Construir título con info relevante
    const camionesInfo = op.camiones ? ` (${op.camiones} cam.)` : '';
    const title = `${op.nombre}${camionesInfo}`;

    // Hora de inicio y fin
    const horaInicio = op.hora || '08:00';
    let horaFin = op.horaFin;

    // Si no hay hora fin, calcular 2 horas después por defecto
    if (!horaFin) {
      const [h, m] = horaInicio.split(':').map(Number);
      horaFin = `${String(Math.min(h + 2, 23)).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    }

    return {
      id: op.id,
      title,
      start: `${op.fecha}T${horaInicio}`,
      end: `${op.fecha}T${horaFin}`,
      backgroundColor: colors[op.tipoMovimiento || ''] || '#6B7280',
      borderColor: colors[op.tipoMovimiento || ''] || '#6B7280',
      extendedProps: {
        operacion: op
      }
    };
  }
}
