import { Component, inject, signal, computed, DestroyRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { FullCalendarModule } from '@fullcalendar/angular';
import esLocale from '@fullcalendar/core/locales/es';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

import { ActividadService } from '../services/actividad.service';
import { EspacioService } from '../services/espacio.service';
import { TipoActividadService } from '../services/tipo-actividad.service';
import { TemporadaService } from '../../../core/services/temporada.service';
import { ThemeService } from '../../../core/services/theme.service';

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
    <div class="page" [class]="isDark() ? 'page-dark' : 'page-light'">
      <!-- Header - mismo estilo que Espacios -->
      <div class="header-section">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 class="text-3xl font-semibold" [class]="isDark() ? 'text-white' : 'text-gray-800'">Calendario de Actividades</h1>
            <p [class]="isDark() ? 'text-gray-400' : 'text-gray-500'">Visualiza y gestiona todas las actividades del Teatro Real</p>
          </div>
          <button class="btn-nuevo" (click)="abrirModalNuevaActividad()">
            <span class="material-icons text-lg">add</span>
            Nueva Actividad
          </button>
        </div>
      </div>

      <!-- Filtros compactos -->
      <div class="filters-section" [class]="isDark() ? 'filters-dark' : 'filters-light'">
        <div class="flex flex-wrap gap-3 items-center">
          <select [class]="isDark() ? 'form-select-sm-dark' : 'form-select-sm'" [value]="selectedEspacioId()" (change)="onEspacioChange($event)">
            <option value="">Todos los espacios</option>
            <option *ngFor="let espacio of espacios()" [value]="espacio.id">{{ espacio.nombre }}</option>
          </select>
          <select [class]="isDark() ? 'form-select-sm-dark' : 'form-select-sm'" [value]="selectedTipoId()" (change)="onTipoChange($event)">
            <option value="">Todos los tipos</option>
            <option *ngFor="let tipo of tipos()" [value]="tipo.id">{{ tipo.nombre }}</option>
          </select>
          <select [class]="isDark() ? 'form-select-sm-dark' : 'form-select-sm'" [value]="selectedTemporadaId()" (change)="onTemporadaChange($event)">
            <option value="">Todas las temporadas</option>
            <option *ngFor="let temp of temporadas()" [value]="temp.id">{{ temp.nombre }}</option>
          </select>
          <button [class]="isDark() ? 'btn-sm-secondary-dark' : 'btn-sm-secondary'" (click)="resetFiltros()">Limpiar</button>
        </div>
      </div>

      <!-- Calendario - ocupa el resto del espacio -->
      <div class="calendar-wrapper" [class]="isDark() ? 'calendar-wrapper-dark' : 'calendar-wrapper-light'">
        @if (actividadService.loading()) {
          <div class="loading-overlay" [class]="isDark() ? 'loading-overlay-dark' : ''">
            <div class="animate-spin w-8 h-8 border-4 border-[#CF102D] border-t-transparent rounded-full"></div>
          </div>
        }
        <full-calendar [options]="calendarOptions()"></full-calendar>
      </div>

      <!-- Modal Nueva Actividad -->
      @if (modalAbierto()) {
        <div class="modal-overlay" (click)="cerrarModal()">
          <div [class]="isDark() ? 'modal-content modal-dark' : 'modal-content'" (click)="$event.stopPropagation()">
            <div class="modal-header" [class]="isDark() ? 'modal-header-dark' : ''">
              <h2 [class]="isDark() ? 'text-white' : ''">Nueva Actividad</h2>
              <button class="modal-close" [class]="isDark() ? 'modal-close-dark' : ''" (click)="cerrarModal()">
                <span class="material-icons">close</span>
              </button>
            </div>
            <div class="modal-body">
              <div class="form-group">
                <label [class]="isDark() ? 'text-gray-300' : ''">Título *</label>
                <input type="text" [class]="isDark() ? 'input-dark' : ''" [value]="formData().titulo" (input)="updateForm('titulo', $event)" placeholder="Nombre de la actividad">
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label [class]="isDark() ? 'text-gray-300' : ''">Tipo de Actividad *</label>
                  <select [class]="isDark() ? 'input-dark' : ''" [value]="formData().tipoActividadId" (change)="updateForm('tipoActividadId', $event)">
                    <option value="">Seleccionar tipo</option>
                    <option *ngFor="let tipo of tipos()" [value]="tipo.id">{{ tipo.nombre }}</option>
                  </select>
                </div>
                <div class="form-group">
                  <label [class]="isDark() ? 'text-gray-300' : ''">Espacio *</label>
                  <select [class]="isDark() ? 'input-dark' : ''" [value]="formData().espacioId" (change)="updateForm('espacioId', $event)">
                    <option value="">Seleccionar espacio</option>
                    <option *ngFor="let esp of espacios()" [value]="esp.id">{{ esp.nombre }}</option>
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label [class]="isDark() ? 'text-gray-300' : ''">Fecha *</label>
                <input type="date" [class]="isDark() ? 'input-dark' : ''" [value]="formData().fecha" (input)="updateForm('fecha', $event)">
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label [class]="isDark() ? 'text-gray-300' : ''">Hora Inicio *</label>
                  <input type="time" [class]="isDark() ? 'input-dark' : ''" [value]="formData().horaInicio" (input)="updateForm('horaInicio', $event)">
                </div>
                <div class="form-group">
                  <label [class]="isDark() ? 'text-gray-300' : ''">Hora Fin *</label>
                  <input type="time" [class]="isDark() ? 'input-dark' : ''" [value]="formData().horaFin" (input)="updateForm('horaFin', $event)">
                </div>
              </div>

              <div class="form-group">
                <label [class]="isDark() ? 'text-gray-300' : ''">Descripción</label>
                <textarea rows="3" [class]="isDark() ? 'input-dark' : ''" [value]="formData().descripcion" (input)="updateForm('descripcion', $event)" placeholder="Notas adicionales..."></textarea>
              </div>
            </div>
            <div class="modal-footer" [class]="isDark() ? 'modal-footer-dark' : ''">
              <button [class]="isDark() ? 'btn-cancel-dark' : 'btn-cancel'" (click)="cerrarModal()">Cancelar</button>
              <button class="btn-save" (click)="guardarActividad()" [disabled]="guardando()">
                @if (guardando()) {
                  <span class="animate-spin mr-2">⏳</span>
                }
                Crear Actividad
              </button>
            </div>
          </div>
        </div>
      }
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
      padding: 1.5rem 2rem;
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
      margin-bottom: 1.5rem;
    }

    .stat-inline {
      color: #6b7280;
    }

    .filters-section {
      flex-shrink: 0;
      border-radius: 0.9rem;
      padding: 1.2rem;
      margin-bottom: 1.5rem;
    }

    .filters-light {
      background: #ffffff;
      border: 1px solid rgba(15, 23, 42, 0.08);
      box-shadow: 0 15px 30px rgba(15, 23, 42, 0.08);
    }

    .filters-dark {
      background: #1a1a1a;
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
    }

    .form-select-sm {
      padding: 0.4rem 0.6rem;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-size: 0.8rem;
      background: white;
      color: #374151;
      cursor: pointer;
      min-width: 140px;
    }

    .form-select-sm:focus {
      outline: none;
      border-color: #CF102D;
    }

    .form-select-sm-dark {
      padding: 0.4rem 0.6rem;
      border: 1px solid #374151;
      border-radius: 6px;
      font-size: 0.8rem;
      background: #262626;
      color: #e5e7eb;
      cursor: pointer;
      min-width: 140px;
    }

    .form-select-sm-dark:focus {
      outline: none;
      border-color: #CF102D;
    }

    .form-select-sm-dark option {
      background: #262626;
      color: #e5e7eb;
    }

    .btn-sm-primary {
      display: flex;
      align-items: center;
      padding: 0.4rem 0.6rem;
      background: #CF102D;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
    }

    .btn-sm-primary:hover {
      background: #a80d25;
    }

    .btn-sm-secondary {
      padding: 0.4rem 0.75rem;
      background: #f3f4f6;
      color: #374151;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-size: 0.8rem;
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
      font-size: 0.8rem;
      cursor: pointer;
    }

    .btn-sm-secondary-dark:hover {
      background: #333333;
    }

    .btn-nuevo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      background: #CF102D;
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      cursor: pointer;
      transition: all 0.2s;
      box-shadow: 0 4px 12px rgba(207, 16, 45, 0.3);
    }

    .btn-nuevo:hover {
      background: #a80d25;
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(207, 16, 45, 0.4);
    }

    /* Modal styles */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      backdrop-filter: blur(2px);
    }

    .modal-content {
      background: white;
      border-radius: 12px;
      width: 90%;
      max-width: 500px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
    }

    .modal-dark {
      background: #1a1a1a;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid #e5e7eb;
    }

    .modal-header-dark {
      border-bottom-color: #333;
    }

    .modal-header h2 {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 600;
      color: #1f2937;
    }

    .modal-close {
      background: none;
      border: none;
      color: #6b7280;
      cursor: pointer;
      padding: 0.25rem;
      border-radius: 4px;
    }

    .modal-close:hover {
      background: #f3f4f6;
      color: #1f2937;
    }

    .modal-close-dark {
      color: #9ca3af;
    }

    .modal-close-dark:hover {
      background: #333;
      color: #e5e7eb;
    }

    .modal-body {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }

    .form-group label {
      font-size: 0.875rem;
      font-weight: 500;
      color: #374151;
    }

    .form-group input,
    .form-group select,
    .form-group textarea {
      padding: 0.6rem 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      font-size: 0.875rem;
      background: white;
      color: #1f2937;
      transition: border-color 0.2s;
    }

    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: #CF102D;
      box-shadow: 0 0 0 3px rgba(207, 16, 45, 0.1);
    }

    .input-dark {
      background: #262626 !important;
      border-color: #374151 !important;
      color: #e5e7eb !important;
    }

    .input-dark:focus {
      border-color: #CF102D !important;
    }

    .input-dark option {
      background: #262626;
      color: #e5e7eb;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
      padding: 1rem 1.5rem;
      border-top: 1px solid #e5e7eb;
      background: #f9fafb;
      border-radius: 0 0 12px 12px;
    }

    .modal-footer-dark {
      background: #0d0d0d;
      border-top-color: #333;
    }

    .btn-cancel {
      padding: 0.6rem 1rem;
      background: white;
      color: #374151;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
    }

    .btn-cancel:hover {
      background: #f3f4f6;
    }

    .btn-cancel-dark {
      padding: 0.6rem 1rem;
      background: #262626;
      color: #e5e7eb;
      border: 1px solid #374151;
      border-radius: 8px;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
    }

    .btn-cancel-dark:hover {
      background: #333;
    }

    .btn-save {
      display: flex;
      align-items: center;
      padding: 0.6rem 1.25rem;
      background: #CF102D;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
    }

    .btn-save:hover:not(:disabled) {
      background: #a80d25;
    }

    .btn-save:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .calendar-wrapper {
      flex: 1 1 0;
      min-height: 0;
      border-radius: 1rem;
      padding: 1.4rem;
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .calendar-wrapper-light {
      background: #ffffff;
      border: 1px solid rgba(15, 23, 42, 0.08);
      box-shadow: 0 20px 35px rgba(15, 23, 42, 0.1);
    }

    .calendar-wrapper-dark {
      background: #1a1a1a;
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 20px 35px rgba(0, 0, 0, 0.3);
    }

    .calendar-wrapper full-calendar {
      flex: 1 1 0;
      min-height: 0;
    }

    .loading-overlay {
      position: absolute;
      inset: 0;
      background: rgba(255, 255, 255, 0.9);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10;
    }

    .loading-overlay-dark {
      background: rgba(26, 26, 26, 0.9);
    }

    /* FullCalendar overrides - altura completa */
    :host ::ng-deep .fc {
      font-family: inherit;
      height: 100% !important;
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
    /* Hacer que todo el día quepa sin scroll */
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

    /* Hacer que el timegrid-body ocupe todo el espacio */
    :host ::ng-deep .fc-timegrid-body {
      height: 100% !important;
    }

    /* La tabla de slots debe ocupar todo el alto disponible */
    :host ::ng-deep .fc-timegrid-slots table {
      height: 100% !important;
    }

    /* Slots de tiempo - altura automática para que quepan todos */
    /* Con 32 slots (16 horas x 2), cada uno será ~2% del alto */
    :host ::ng-deep .fc-timegrid-slot {
      height: auto !important;
      min-height: 0 !important;
    }

    :host ::ng-deep .fc-timegrid-slot-label {
      vertical-align: middle;
      font-size: 0.65rem !important;
      padding: 0 4px !important;
    }

    /* Ajustar la columna de eventos para que coincida con los slots */
    :host ::ng-deep .fc-timegrid-cols {
      height: 100% !important;
    }

    :host ::ng-deep .fc-timegrid-cols table {
      height: 100% !important;
    }

    :host ::ng-deep .fc-timegrid-col {
      height: 100% !important;
    }

    :host ::ng-deep .fc-toolbar-title {
      font-size: 1.1rem !important;
      font-weight: 600;
      color: #1f2937;
    }

    :host ::ng-deep .fc-toolbar {
      margin-bottom: 0.75rem !important;
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

    /* Día actual - destacado con amarillo suave y borde */
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

    :host ::ng-deep .fc-event {
      border-radius: 4px;
      padding: 2px 6px;
      font-size: 0.75rem;
      cursor: pointer;
      border: none !important;
      margin-bottom: 2px;
    }

    /* Eventos como bloques - texto blanco legible */
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

    /* Link "+X más" */
    :host ::ng-deep .fc-daygrid-more-link {
      color: #CF102D !important;
      font-weight: 600;
      font-size: 0.75rem;
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

    /* Asegurar que todo el calendario tenga texto oscuro */
    :host ::ng-deep .fc {
      color: #374151;
    }

    :host ::ng-deep .fc-toolbar-title {
      color: #1f2937 !important;
    }

    /* Estilos para vista semanal/diaria (timeGrid) */
    :host ::ng-deep .fc-timegrid-slot-label {
      font-size: 0.75rem;
      font-weight: 500;
      color: #6b7280;
    }

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
export class CalendarioComponent implements OnInit {
  // Inyecta servicios de dominio
  actividadService = inject(ActividadService);
  private espacioService = inject(EspacioService);
  private tipoActividadService = inject(TipoActividadService);
  private temporadaService = inject(TemporadaService);
  private destroyRef = inject(DestroyRef);
  private themeService = inject(ThemeService);

  // Dark mode
  isDark = this.themeService.isDark;

  // State signals para filtros seleccionados
  selectedEspacioId = signal<string | ''>('');
  selectedTipoId = signal<string | ''>('');
  selectedTemporadaId = signal<string | ''>('');

  // State signals para modal de nueva actividad
  modalAbierto = signal(false);
  guardando = signal(false);
  formData = signal({
    titulo: '',
    tipoActividadId: '',
    espacioId: '',
    fecha: new Date().toISOString().slice(0, 10),
    horaInicio: '09:00',
    horaFin: '13:00',
    descripcion: ''
  });

  // Signals públicas para el template
  espacios = this.espacioService.espacios;
  tipos = this.tipoActividadService.tipos;
  temporadas = this.temporadaService.temporadas;

  // Signal para el rango actualmente visible
  private rangeStart = signal<string>(new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0,10));
  private rangeEnd = signal<string>(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().slice(0,10));

  // Flag para evitar carga inicial múltiple - FullCalendar disparará datesSet
  private initialLoadDone = false;

  constructor() {
    // Solo cargamos datos de catálogo (espacios/tipos), NO actividades
    // Las actividades se cargarán cuando FullCalendar dispare datesSet()
  }

  ngOnInit(): void {
    // Carga espacios/tipos/temporadas si no hay - con gestión de suscripción
    if (this.espacioService.espacios().length === 0) {
      this.espacioService.loadEspacios()
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe();
    }
    if (this.tipoActividadService.tipos().length === 0) {
      this.tipoActividadService.loadTiposActividad()
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe();
    }
    // Cargar temporadas con lazy load
    this.temporadaService.ensureLoaded();
    // NOTA: NO llamamos loadActividades() aquí - FullCalendar lo hará via datesSet
  }

  // Carga actividades para un rango opcional de fechas
  loadActividades(rangoInicio?: string, rangoFin?: string): void {
    const inicio = rangoInicio ?? this.rangeStart();
    const fin = rangoFin ?? this.rangeEnd();

    const filtro = {
      fechaInicio: inicio,
      fechaFin: fin,
      espacioId: this.selectedEspacioId() ? Number(this.selectedEspacioId()) : undefined,
      tipoActividadId: this.selectedTipoId() || undefined, // UUID string - no convertir a número
      temporadaId: this.selectedTemporadaId() ? Number(this.selectedTemporadaId()) : undefined
    };

    this.actividadService.loadActividades(filtro).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: () => {
        this.initialLoadDone = true;
      },
      error: (err) => {
        this.initialLoadDone = true;
        console.error('[Calendario] ❌ Error cargando actividades:', err);
      }
    });
  }

  // Event handlers - ahora disparan carga explícitamente
  onEspacioChange(e: Event): void {
    const val = (e.target as HTMLSelectElement).value;
    this.selectedEspacioId.set(val);
    this.loadActividades(); // Carga explícita al cambiar filtro
  }

  onTipoChange(e: Event): void {
    const val = (e.target as HTMLSelectElement).value;
    this.selectedTipoId.set(val);
    this.loadActividades(); // Carga explícita al cambiar filtro
  }

  onTemporadaChange(e: Event): void {
    const val = (e.target as HTMLSelectElement).value;
    this.selectedTemporadaId.set(val);
    this.loadActividades(); // Carga explícita al cambiar filtro
  }

  resetFiltros(): void {
    this.selectedEspacioId.set('');
    this.selectedTipoId.set('');
    this.selectedTemporadaId.set('');
    this.loadActividades(); // Carga explícita al resetear
  }

  // --- Métodos del modal de nueva actividad ---
  abrirModalNuevaActividad(): void {
    // Reset form con valores por defecto
    this.formData.set({
      titulo: '',
      tipoActividadId: this.tipos()[0]?.id?.toString() || '',
      espacioId: this.espacios()[0]?.id?.toString() || '',
      fecha: new Date().toISOString().slice(0, 10),
      horaInicio: '09:00',
      horaFin: '13:00',
      descripcion: ''
    });
    this.modalAbierto.set(true);
  }

  cerrarModal(): void {
    this.modalAbierto.set(false);
  }

  updateForm(field: string, event: Event): void {
    const value = (event.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement).value;
    this.formData.update(f => ({ ...f, [field]: value }));
  }

  guardarActividad(): void {
    const form = this.formData();

    // Validación básica
    if (!form.titulo || !form.tipoActividadId || !form.espacioId || !form.fecha) {
      alert('Por favor, completa los campos obligatorios');
      return;
    }

    this.guardando.set(true);

    const actividadData = {
      titulo: form.titulo,
      tipoActividadId: form.tipoActividadId,
      espacioId: Number(form.espacioId),
      fecha: form.fecha,
      horaInicio: form.horaInicio,
      horaFin: form.horaFin,
      descripcion: form.descripcion || undefined
    };

    this.actividadService.create(actividadData).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: () => {
        this.guardando.set(false);
        this.cerrarModal();
        // Recargar actividades para ver la nueva
        this.loadActividades();
      },
      error: (err) => {
        this.guardando.set(false);
        console.error('[Calendario] Error creando actividad:', err);
        alert('Error al crear la actividad: ' + (err.message || 'Error desconocido'));
      }
    });
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
        horaInicio: act.horaInicio,
        horaFin: act.horaFin,
        descripcion: act.descripcion
      }
    }));

    return {
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
      locale: esLocale,
      height: 'parent', // 'parent' funciona mejor con flex containers
      expandRows: true, // Expande las filas para llenar todo el espacio disponible
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      },
      editable: true,
      selectable: true,
      themeSystem: 'standard',
      events: eventos,
      // No mostrar días de otros meses
      showNonCurrentDates: false,
      fixedWeekCount: false,
      // Mostrar máximo 3 eventos, luego "+X más"
      dayMaxEvents: 3,
      // Configuración por vista
      views: {
        dayGridMonth: {
          displayEventTime: false // Ocultar hora en vista mes (se ve al hacer clic)
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
      slotEventOverlap: false, // Evitar superposición de eventos
      slotDuration: '00:30:00', // Slots de 30 minutos
      // Formato de etiquetas de hora en la columna izquierda
      slotLabelFormat: {
        hour: '2-digit' as const,
        minute: '2-digit' as const,
        hour12: false
      },
      // Mostrar línea de hora actual
      nowIndicator: true,
      // Tooltip al pasar el ratón
      eventDidMount(info: any) {
        const props = info.event.extendedProps;
        const hora = `${props.horaInicio || ''} - ${props.horaFin || ''}`;
        info.el.setAttribute('title',
          `${info.event.title}\n📍 ${props.espacio || 'Sin espacio'}\n🕐 ${hora}\n📋 ${props.tipo || 'Sin tipo'}`
        );
      },
      datesSet(arg: any) {
        // Solo cargar si el rango ha cambiado realmente
        const newStart = arg.startStr.slice(0, 10);
        const newEnd = arg.endStr.slice(0, 10);
        const currentStart = self.rangeStart();
        const currentEnd = self.rangeEnd();

        if (newStart !== currentStart || newEnd !== currentEnd) {
          self.rangeStart.set(newStart);
          self.rangeEnd.set(newEnd);
          self.loadActividades(newStart, newEnd);
        } else if (!self.initialLoadDone) {
          // Primera carga cuando el calendario se inicializa
          self.loadActividades(newStart, newEnd);
        }
      },
      eventClick: (info: any) => {
        const props = info.event.extendedProps;
        const hora = `${props.horaInicio || ''} - ${props.horaFin || ''}`;

        // Modal con mejor formato
        const modal = document.createElement('div');
        modal.innerHTML = `
          <div style="position:fixed;inset:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:9999">
            <div style="background:white;border-radius:12px;padding:24px;max-width:400px;width:90%;box-shadow:0 20px 40px rgba(0,0,0,0.3)">
              <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
                <div style="width:12px;height:12px;border-radius:50%;background:${info.event.backgroundColor}"></div>
                <h3 style="margin:0;font-size:1.25rem;color:#1f2937">${info.event.title}</h3>
              </div>
              <div style="display:grid;gap:12px;color:#4b5563">
                <div style="display:flex;align-items:center;gap:8px">
                  <span style="font-size:1.2rem">📍</span>
                  <span><strong>Espacio:</strong> ${props.espacio || 'No asignado'}</span>
                </div>
                <div style="display:flex;align-items:center;gap:8px">
                  <span style="font-size:1.2rem">🕐</span>
                  <span><strong>Horario:</strong> ${hora}</span>
                </div>
                <div style="display:flex;align-items:center;gap:8px">
                  <span style="font-size:1.2rem">📋</span>
                  <span><strong>Tipo:</strong> ${props.tipo || 'No especificado'}</span>
                </div>
                <div style="display:flex;align-items:center;gap:8px">
                  <span style="font-size:1.2rem">📊</span>
                  <span><strong>Estado:</strong> ${props.estado || 'Pendiente'}</span>
                </div>
                ${props.descripcion ? `
                <div style="margin-top:8px;padding-top:12px;border-top:1px solid #e5e7eb">
                  <p style="margin:0;font-size:0.875rem;color:#6b7280">${props.descripcion}</p>
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
      },
      eventDrop: (info: any) => {
        // TODO: Implementar persistencia del drag & drop
      }
    };
  });
}
