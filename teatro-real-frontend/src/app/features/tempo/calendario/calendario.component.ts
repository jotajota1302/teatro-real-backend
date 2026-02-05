import { Component, OnInit, inject, signal, computed, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { ActividadDialogComponent } from '../actividad/actividad-dialog/actividad-dialog.component';
import { ActividadService } from '../services/actividad.service';
import { EspacioService } from '../services/espacio.service';
import { TemporadaService } from '../../../core/services/temporada.service';
import { ThemeService } from '../../../core/services/theme.service';
import { Actividad, Espacio } from '../models/actividad.model';
import {
  ActividadCalendario,
  DiaCalendario,
  EspacioCalendario,
  FranjaCalendario,
  SemanaCalendario,
  NombreDia
} from '../models/calendario.model';

import { addDays, startOfWeek, format, getISOWeek, getYear, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatDialogModule,
    ActividadDialogComponent
  ],
  template: `
    <div class="page-container" [ngClass]="isDark() ? 'page-dark' : 'page-light'">
      <!-- Fixed Header -->
      <div class="fixed-header">
        <!-- Title row - same structure as Espacios/Cartelería -->
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h1 class="text-3xl font-semibold" [class]="isDark() ? 'text-white' : 'text-title-light'">Calendario</h1>
            <p [class]="isDark() ? 'text-gray-400' : 'text-subtitle-light'">{{ temporadaLabel() }}</p>
          </div>
          <button class="btn-action-primary" (click)="onNuevaActividadClick()">
            <mat-icon>add</mat-icon>
            Nueva actividad
          </button>
        </div>
        <!-- Navigation toolbar -->
        <div class="cal-toolbar" [class.cal-toolbar-dark]="isDark()">
          <div class="cal-week-nav">
            <button class="btn-nav" [class.btn-nav-dark]="isDark()" (click)="irSemanaAnterior()" matTooltip="Semana anterior">
              <mat-icon>chevron_left</mat-icon>
            </button>
            <div class="cal-week-label" [class.cal-week-label-dark]="isDark()">Semana {{ semana().numeroSemana }}</div>
            <button class="btn-nav" [class.btn-nav-dark]="isDark()" (click)="irSemanaSiguiente()" matTooltip="Semana siguiente">
              <mat-icon>chevron_right</mat-icon>
            </button>
          </div>
          <div class="cal-fechas" [class.cal-fechas-dark]="isDark()">{{ fechasLabel() }}</div>
          <button class="btn-hoy" [class.btn-hoy-dark]="isDark()" (click)="irSemanaActual()">Hoy</button>
        </div>
      </div>

      <!-- Scrollable Content -->
      <div class="scrollable-content">
        <div class="cal-grid-wrapper">
          <!-- Loading indicator -->
          <div class="cal-loading" *ngIf="loading()">
            <mat-spinner diameter="40"></mat-spinner>
            <span>Cargando actividades...</span>
          </div>

          <!-- Grid -->
          <div class="cal-scroll" *ngIf="!loading()">
            <div class="cal-grid" [style.grid-template-columns]="gridColumns()">
          <!-- Header row -->
          <div class="col-header fecha-hora">FECHA / HORA</div>
          <div class="col-header" *ngFor="let espacio of espaciosCalendario()">
            {{ espacio.nombre }}
          </div>

          <!-- Days and time slots -->
          <ng-container *ngFor="let dia of semana().dias; trackBy: trackByDia">
            <!-- Day separator -->
            <div class="dia-separator">
              {{ dia.nombre }} {{ dia.fecha | date:'d/MM' }}
            </div>

            <!-- Time slots for this day -->
            <ng-container *ngFor="let franja of dia.franjas; trackBy: trackByFranja">
              <div class="celda-hora">
                {{ franja.horaInicio.split(':')[0] }}
              </div>
              <div
                class="celda-espacio"
                *ngFor="let espacio of espaciosCalendario(); trackBy: trackByEspacio"
              >
                <ng-container *ngIf="franja.actividadesPorEspacio[espacio.id] as actividades">
                  <div
                    *ngFor="let actividad of actividades; trackBy: trackByActividad"
                    class="actividad"
                    [style.background-color]="getActividadBgColor(actividad)"
                    [style.border-color]="getActividadBorderColor(actividad)"
                    [style.height.px]="getActividadHeight(actividad)"
                    [style.top.px]="getActividadTop(actividad)"
                    [class.estado-provisional]="actividad.estado === 'PROVISIONAL'"
                    [class.estado-confirmada]="actividad.estado === 'CONFIRMADA'"
                    [class.estado-cancelada]="actividad.estado === 'CANCELADA'"
                    [matTooltip]="getActividadTooltip(actividad)"
                    (click)="onActividadClick(actividad)"
                  >
                    <div class="actividad-titulo">{{ actividad.titulo }}</div>
                    <div class="actividad-detalle" *ngIf="actividad.detalle">
                      {{ actividad.detalle }}
                    </div>
                  </div>
                </ng-container>
              </div>
            </ng-container>
          </ng-container>

            <!-- Empty state if no activities -->
            <div class="empty-state" *ngIf="semana().dias.length === 0 || allDaysEmpty()">
              <mat-icon>event_busy</mat-icon>
              <p>No hay actividades para esta semana</p>
            </div>
          </div>
        </div>
        </div>
      </div>

      <!-- Activity detail dialog overlay -->
      <div class="dialog-overlay" *ngIf="selectedActividad()" (click)="closeDialog()">
        <div class="dialog-content" (click)="$event.stopPropagation()">
          <div class="dialog-header" [style.background-color]="getActividadBgColor(selectedActividad()!)"
               [style.border-left-color]="getActividadBorderColor(selectedActividad()!)">
            <h2 class="dialog-title">{{ selectedActividad()?.titulo }}</h2>
            <button class="dialog-close" (click)="closeDialog()">
              <mat-icon>close</mat-icon>
            </button>
          </div>
          <div class="dialog-body">
            <div class="dialog-row">
              <mat-icon>schedule</mat-icon>
              <div>
                <strong>Horario</strong>
                <p>{{ selectedActividad()?.horaInicio }} - {{ selectedActividad()?.horaFin }}</p>
              </div>
            </div>
            <div class="dialog-row">
              <mat-icon>event</mat-icon>
              <div>
                <strong>Fecha</strong>
                <p>{{ selectedActividad()?.fecha | date:'EEEE, d MMMM yyyy':'':'es' }}</p>
              </div>
            </div>
            <div class="dialog-row" *ngIf="getEspacioNombre(selectedActividad()?.espacioId)">
              <mat-icon>place</mat-icon>
              <div>
                <strong>Espacio</strong>
                <p>{{ getEspacioNombre(selectedActividad()?.espacioId) }}</p>
              </div>
            </div>
            <div class="dialog-row" *ngIf="selectedActividad()?.detalle">
              <mat-icon>notes</mat-icon>
              <div>
                <strong>Detalles</strong>
                <p>{{ selectedActividad()?.detalle }}</p>
              </div>
            </div>
          </div>
          <div class="dialog-actions">
            <button class="btn-dialog-delete" *ngIf="!confirmingDelete()" (click)="confirmDeleteActividad()">
              <mat-icon>delete</mat-icon>
              Eliminar
            </button>
            <div class="delete-confirm-inline" *ngIf="confirmingDelete()">
              <span>¿Eliminar?</span>
              <button class="btn-confirm-yes" (click)="deleteActividad()">Sí</button>
              <button class="btn-confirm-no" (click)="cancelDeleteActividad()">No</button>
            </div>
            <div class="dialog-actions-spacer"></div>
            <button class="btn-dialog-edit" (click)="editActividad()">
              <mat-icon>edit</mat-icon>
              Editar
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
    }

    /* Layout - same as Cartelería */
    .page-container {
      display: flex;
      flex-direction: column;
      height: 100%;
      font-family: 'Montserrat', sans-serif;
    }

    .page-light {
      background: #f2f4f7;
      color: #1f2937;
    }

    .page-container.page-dark {
      background: #1a1a1a;
      border-radius: 1rem;
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #e5e7eb;
    }

    .fixed-header {
      flex-shrink: 0;
      padding: 1.5rem 2rem 0 2rem;
    }

    /* Text colors - same as Espacios/Cartelería */
    .text-title-light { color: #1f2937; }
    .text-subtitle-light { color: #6b7280; }

    .scrollable-content {
      flex: 1;
      overflow-y: auto;
      padding: 0 2rem 2rem 2rem;
    }

    .cal-grid-wrapper {
      background: #ffffff;
      border-radius: 0.75rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    .page-dark .cal-grid-wrapper {
      background: #1a1a1a;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    /* Toolbar */
    .cal-toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
      flex-shrink: 0;
      background: #ffffff;
      border-radius: 0.75rem;
      padding: 0.75rem 1rem;
      margin-bottom: 1rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }

    .cal-toolbar.cal-toolbar-dark {
      background: #1a1a1a;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .cal-week-nav {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .cal-week-label {
      font-size: 1rem;
      font-weight: 600;
      color: #1f2937;
      min-width: 100px;
      text-align: center;
    }

    .cal-week-label.cal-week-label-dark {
      color: #ffffff;
    }

    .cal-fechas {
      font-size: 0.9rem;
      font-weight: 500;
      color: #374151;
      text-align: center;
      flex: 1;
    }

    .cal-fechas.cal-fechas-dark {
      color: #e5e7eb;
    }

    .btn-nav {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border: 1px solid #e5e7eb;
      background: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      color: #374151;
    }

    .btn-nav:hover {
      border-color: #cf102d;
      color: #cf102d;
      background: #fef2f2;
    }

    .btn-nav.btn-nav-dark {
      background: #262626;
      border-color: #374151;
      color: #e5e7eb;
    }

    .btn-nav.btn-nav-dark:hover {
      border-color: #cf102d;
      color: #cf102d;
      background: #3f3f3f;
    }

    .btn-nav mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .btn-hoy {
      padding: 0.5rem 1rem;
      border-radius: 0.375rem;
      border: 1px solid #e5e7eb;
      background: white;
      cursor: pointer;
      font-family: 'Montserrat', sans-serif;
      font-size: 0.875rem;
      font-weight: 500;
      color: #374151;
      transition: all 0.2s ease;
    }

    .btn-hoy:hover {
      border-color: #cf102d;
      color: #cf102d;
      background: #fef2f2;
    }

    .btn-hoy.btn-hoy-dark {
      background: #262626;
      border-color: #374151;
      color: #e5e7eb;
    }

    .btn-hoy.btn-hoy-dark:hover {
      border-color: #cf102d;
      color: #cf102d;
      background: #3f3f3f;
    }

    .btn-nueva {
      margin-left: 0.75rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      border: none;
      cursor: pointer;
      font-family: 'Montserrat', sans-serif;
      font-size: 0.875rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #ffffff;
      background: #cf102d;
      box-shadow: 0 4px 12px rgba(207, 16, 45, 0.3);
      transition: all 0.2s ease;
    }

    .btn-nueva mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .btn-nueva:hover {
      background: #a80d25;
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(207, 16, 45, 0.4);
    }

    /* Loading */
    .cal-loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      padding: 3rem;
      color: #6b7280;
    }

    /* Scroll container */
    .cal-scroll {
      flex: 1;
      overflow-x: auto;
      overflow-y: visible;
    }

    /* Grid */
    .cal-grid {
      display: grid;
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
      overflow: hidden;
      min-width: fit-content;
    }

    .page-dark .cal-grid {
      border-color: #374151;
    }

    .col-header {
      background: #f9fafb;
      padding: 0.75rem 0.5rem;
      text-align: center;
      border-right: 1px solid #e5e7eb;
      border-bottom: 1px solid #e5e7eb;
      font-weight: 600;
      font-size: 0.7rem;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      color: #374151;
      position: sticky;
      top: 0;
      z-index: 10;
    }

    .page-dark .col-header {
      background: #262626;
      border-color: #374151;
      color: #9ca3af;
    }

    .col-header:last-child {
      border-right: none;
    }

    .col-header.fecha-hora {
      text-align: center;
      min-width: 60px;
      max-width: 60px;
    }

    .dia-separator {
      grid-column: 1 / -1;
      background: #f3f4f6;
      padding: 0.5rem 1rem;
      font-weight: 700;
      font-size: 0.85rem;
      color: #1f2937;
      border-bottom: 1px solid #e5e7eb;
      text-transform: capitalize;
    }

    .page-dark .dia-separator {
      background: #262626;
      color: #e5e7eb;
      border-color: #374151;
    }

    .celda-hora {
      padding: 0.5rem 0.5rem;
      border-right: 1px solid #e5e7eb;
      border-bottom: none;
      font-size: 0.7rem;
      font-weight: 600;
      color: #9ca3af;
      background: #fafafa;
      min-width: 60px;
      max-width: 60px;
      min-height: 52px;
      display: flex;
      align-items: flex-start;
      justify-content: center;
    }

    .page-dark .celda-hora {
      background: #1f1f1f;
      border-color: #374151;
      color: #6b7280;
    }

    .celda-espacio {
      border-right: 1px solid #e5e7eb;
      border-bottom: 1px solid #e5e7eb;
      min-height: 52px;
      padding: 0;
      min-width: 140px;
      position: relative;
      overflow: visible;
      background: #ffffff;
    }

    .page-dark .celda-espacio {
      background: #1a1a1a;
      border-color: #374151;
    }

    .celda-espacio:last-child {
      border-right: none;
    }

    /* Activity chips */
    .actividad {
      border-radius: 0.375rem;
      padding: 0.4rem 0.5rem;
      margin-bottom: 0;
      font-size: 0.75rem;
      line-height: 1.3;
      color: #1f2937;
      border-left: 3px solid;
      cursor: pointer;
      transition: transform 0.15s ease, box-shadow 0.15s ease;
      position: absolute;
      left: 4px;
      right: 4px;
      z-index: 1;
      box-shadow: 0 0 0 3px #ffffff;
    }

    .actividad:hover {
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
      z-index: 5;
    }

    .actividad-titulo {
      font-weight: 600;
      margin-bottom: 2px;
    }

    .actividad-detalle {
      font-size: 0.65rem;
      color: #4b5563;
      opacity: 0.9;
    }

    /* Activity states */
    .estado-provisional {
      border-left-style: dashed;
    }

    .estado-confirmada {
      border-left-style: solid;
    }

    .estado-cancelada {
      opacity: 0.5;
      text-decoration: line-through;
    }

    /* Empty state */
    .empty-state {
      grid-column: 1 / -1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 3rem;
      color: #9ca3af;
    }

    .empty-state mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 1rem;
    }

    /* Dialog overlay */
    .dialog-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      animation: fadeIn 0.2s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .dialog-content {
      background: white;
      border-radius: 0.75rem;
      min-width: 360px;
      max-width: 480px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
      animation: slideUp 0.2s ease;
      overflow: hidden;
    }

    @keyframes slideUp {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }

    .dialog-header {
      padding: 1.25rem 1.5rem;
      border-left: 4px solid;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 1rem;
    }

    .dialog-title {
      margin: 0;
      font-size: 1.125rem;
      font-weight: 700;
      color: #1f2937;
      line-height: 1.4;
    }

    .dialog-close {
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.25rem;
      border-radius: 0.375rem;
      color: #6b7280;
      transition: all 0.15s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .dialog-close:hover {
      background: rgba(0, 0, 0, 0.05);
      color: #1f2937;
    }

    .dialog-close mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .dialog-body {
      padding: 1rem 1.5rem 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .dialog-row {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
    }

    .dialog-row mat-icon {
      color: #CF102D;
      font-size: 20px;
      width: 20px;
      height: 20px;
      margin-top: 2px;
      flex-shrink: 0;
    }

    .dialog-row div {
      flex: 1;
    }

    .dialog-row strong {
      font-size: 0.75rem;
      font-weight: 600;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      display: block;
      margin-bottom: 0.125rem;
    }

    .dialog-row p {
      margin: 0;
      font-size: 0.9375rem;
      color: #1f2937;
    }

    .dialog-actions {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem 1.5rem;
      border-top: 1px solid #e5e7eb;
      background: #f9fafb;
    }

    .dialog-actions-spacer {
      flex: 1;
    }

    .btn-dialog-edit,
    .btn-dialog-delete {
      display: flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      font-family: 'Montserrat', sans-serif;
      font-size: 0.8rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-dialog-edit {
      background: #CF102D;
      color: white;
      border: none;
    }

    .btn-dialog-edit:hover {
      background: #a80d25;
    }

    .btn-dialog-edit mat-icon,
    .btn-dialog-delete mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .btn-dialog-delete {
      background: white;
      color: #dc2626;
      border: 1px solid #fca5a5;
    }

    .btn-dialog-delete:hover {
      background: #fef2f2;
      border-color: #f87171;
    }

    .delete-confirm-inline {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .delete-confirm-inline span {
      font-size: 0.85rem;
      color: #dc2626;
      font-weight: 500;
    }

    .btn-confirm-yes,
    .btn-confirm-no {
      padding: 0.35rem 0.75rem;
      border-radius: 4px;
      font-family: 'Montserrat', sans-serif;
      font-size: 0.8rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-confirm-yes {
      background: #dc2626;
      color: white;
      border: none;
    }

    .btn-confirm-yes:hover {
      background: #b91c1c;
    }

    .btn-confirm-no {
      background: #f3f4f6;
      color: #374151;
      border: 1px solid #d1d5db;
    }

    .btn-confirm-no:hover {
      background: #e5e7eb;
    }

    /* Responsive */
    @media (max-width: 1200px) {
      .celda-espacio {
        min-width: 120px;
      }
    }

    @media (max-width: 768px) {
      .fixed-header {
        padding: 1rem;
      }

      .scrollable-content {
        padding: 0 1rem 1rem 1rem;
      }

      .cal-toolbar {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }

      .cal-fechas-center {
        width: 100%;
        justify-content: flex-start;
      }

      .cal-controls {
        width: 100%;
        justify-content: flex-end;
      }

      .cal-week-title {
        font-size: 1.25rem;
      }

      .col-header.fecha-hora,
      .celda-hora {
        min-width: 50px;
        max-width: 50px;
      }

      .celda-espacio {
        min-width: 100px;
      }

      .actividad {
        font-size: 0.7rem;
        padding: 0.3rem 0.4rem;
      }
    }
  `]
})
export class CalendarioComponent implements OnInit {
  private actividadService = inject(ActividadService);
  private espacioService = inject(EspacioService);
  private temporadaService = inject(TemporadaService);
  private themeService = inject(ThemeService);
  private destroyRef = inject(DestroyRef);
  private dialog = inject(MatDialog);

  // Theme
  isDark = this.themeService.isDark;

  // Selected activity for dialog
  selectedActividad = signal<ActividadCalendario | null>(null);
  confirmingDelete = signal(false);

  // Current week start (Monday)
  private currentWeekStart = signal<Date>(startOfWeek(new Date(), { weekStartsOn: 1 }));

  // Loading state
  loading = signal(false);

  // Raw activities from backend
  private actividadesRaw = signal<Actividad[]>([]);

  // Fixed calendar columns in the exact order from the design
  private readonly columnasCalendario: EspacioCalendario[] = [
    { id: 1, nombre: 'ESCENARIO', codigo: 'ESCENARIO' },
    { id: 5, nombre: 'SALA GAYARRE', codigo: 'SALA_GAYARRE' },
    { id: 14, nombre: 'S.E.P.E', codigo: 'SEPE' },
    { id: 4, nombre: 'SALA BALLET', codigo: 'SALA_BALLET' },
    { id: 2, nombre: 'SALA ORQUESTA / CORO', codigo: 'ORQUESTA_CORO' },
    { id: 15, nombre: 'OTRAS SALAS', codigo: 'OTRAS' }
  ];

  // Mapping from actual database space IDs to calendar column IDs
  private readonly espacioToColumnaMap: Record<number, number> = {
    1: 1,   // Escenario -> ESCENARIO
    5: 5,   // Sala Gayarre -> SALA GAYARRE
    14: 14, // S.E.P.E -> S.E.P.E
    4: 4,   // Sala de Ensayo Ballet -> SALA BALLET
    2: 2,   // Sala Orquesta/Coro -> SALA ORQUESTA / CORO
    3: 2,   // Sala de Ensayo Coro -> SALA ORQUESTA / CORO (merged)
    15: 15, // Otras Salas -> OTRAS SALAS
    // Default any other sala to "Otras Salas"
  };

  // Computed: espacios for calendar columns (fixed columns)
  espaciosCalendario = computed<EspacioCalendario[]>(() => {
    return this.columnasCalendario;
  });

  // Grid columns CSS
  gridColumns = computed(() => {
    const numEspacios = this.espaciosCalendario().length;
    return `60px repeat(${numEspacios}, minmax(140px, 1fr))`;
  });

  // Computed: transform activities to calendar week structure
  semana = computed<SemanaCalendario>(() => {
    const weekStart = this.currentWeekStart();
    const actividades = this.actividadesRaw();
    const espacios = this.espaciosCalendario();

    const dias: DiaCalendario[] = [];
    const diasNombres: NombreDia[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

    // Fixed time slots (07:00 to 23:00, one hour per slot)
    const franjasFijas: Array<{horaInicio: string, horaFin: string}> = [];
    for (let h = 7; h < 24; h++) {
      franjasFijas.push({
        horaInicio: `${h.toString().padStart(2, '0')}:00`,
        horaFin: `${((h + 1) % 24).toString().padStart(2, '0')}:00`
      });
    }

    for (let i = 0; i < 7; i++) {
      const fecha = addDays(weekStart, i);
      const fechaStr = format(fecha, 'yyyy-MM-dd');

      // Filter activities for this day
      const actividadesDia = actividades.filter(a => a.fecha === fechaStr);

      // Create fixed hour slots
      const franjas: FranjaCalendario[] = franjasFijas.map(franja => {
        const franjaObj: FranjaCalendario = {
          horaInicio: franja.horaInicio,
          horaFin: franja.horaFin,
          actividadesPorEspacio: {}
        };

        // Find activities that START in this hour slot
        const hora = parseInt(franja.horaInicio.split(':')[0]);

        actividadesDia.forEach(act => {
          const actHoraInicio = parseInt(act.horaInicio.split(':')[0]);

          // Only add activities that start in this hour
          if (actHoraInicio === hora) {
            const originalEspacioId = act.espacio?.id || 0;
            const columnaId = this.espacioToColumnaMap[originalEspacioId] || 15;

            if (!franjaObj.actividadesPorEspacio[columnaId]) {
              franjaObj.actividadesPorEspacio[columnaId] = [];
            }

            const actividadConEstilo = this.mapToCalendarioActividad(act, columnaId);
            // Calculate position and height based on duration
            const [ih, im] = act.horaInicio.split(':').map(Number);
            const [fh, fm] = act.horaFin.split(':').map(Number);
            const duracionMin = (fh * 60 + fm) - (ih * 60 + im);
            const heightPx = (duracionMin / 60) * 52; // 52px per hour
            const offsetMin = im; // minutes offset from hour start
            const topPx = (offsetMin / 60) * 52;

            (actividadConEstilo as any).heightPx = heightPx;
            (actividadConEstilo as any).topPx = topPx;

            franjaObj.actividadesPorEspacio[columnaId].push(actividadConEstilo);
          }
        });

        return franjaObj;
      });

      dias.push({
        nombre: diasNombres[i],
        fecha: fechaStr,
        franjas
      });
    }

    return {
      numeroSemana: getISOWeek(weekStart),
      anioSemana: getYear(weekStart),
      fechaInicio: format(weekStart, 'yyyy-MM-dd'),
      fechaFin: format(addDays(weekStart, 6), 'yyyy-MM-dd'),
      estado: 'DEFINITIVA',
      dias
    };
  });

  // Computed: temporada label
  temporadaLabel = computed(() => {
    const temporada = this.temporadaService.temporadaActiva();
    return temporada ? `TEMPORADA ${temporada.nombre}` : 'TEMPORADA 2025-2026';
  });

  // Computed: date range label
  fechasLabel = computed(() => {
    const weekStart = this.currentWeekStart();
    const weekEnd = addDays(weekStart, 6);
    return `${format(weekStart, 'd MMM yyyy', { locale: es })} – ${format(weekEnd, 'd MMM yyyy', { locale: es })}`;
  });

  ngOnInit(): void {
    // Ensure temporadas are loaded for the header label
    this.temporadaService.ensureLoaded();
    this.loadData();
  }

  private loadData(): void {
    this.loading.set(true);

    // Load espacios first
    this.espacioService.loadEspacios().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: () => this.loadActividades(),
      error: () => this.loadActividades() // Load activities even if spaces fail
    });
  }

  private loadActividades(): void {
    const weekStart = this.currentWeekStart();
    const fechaInicio = format(weekStart, 'yyyy-MM-dd');
    const fechaFin = format(addDays(weekStart, 6), 'yyyy-MM-dd');

    this.actividadService.loadActividades({ fechaInicio, fechaFin }).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (actividades) => {
        this.actividadesRaw.set(actividades);
        this.loading.set(false);
      },
      error: () => {
        this.actividadesRaw.set([]);
        this.loading.set(false);
      }
    });
  }

  private mapToCalendarioActividad(act: Actividad, columnaId?: number): ActividadCalendario {
    // Map tipo from tipoActividad
    const tipoNombre = act.tipoActividad?.nombre?.toUpperCase().replace(/\s+/g, '_') || 'OTRO';

    return {
      id: act.id,
      fecha: act.fecha,
      horaInicio: act.horaInicio,
      horaFin: act.horaFin,
      espacioId: columnaId ?? act.espacio?.id ?? 0,
      tipo: tipoNombre as any,
      estado: 'CONFIRMADA',
      titulo: act.titulo,
      detalle: act.produccionNombre || act.notas || undefined,
      colorHex: act.tipoActividad?.colorHex
    };
  }

  // Navigation
  irSemanaAnterior(): void {
    this.currentWeekStart.update(d => addDays(d, -7));
    this.loadActividades();
  }

  irSemanaActual(): void {
    this.currentWeekStart.set(startOfWeek(new Date(), { weekStartsOn: 1 }));
    this.loadActividades();
  }

  irSemanaSiguiente(): void {
    this.currentWeekStart.update(d => addDays(d, 7));
    this.loadActividades();
  }

  onNuevaActividadClick(): void {
    const weekStart = this.currentWeekStart();
    const today = new Date();
    const weekEnd = addDays(weekStart, 6);

    const defaultDate =
      today >= weekStart && today <= weekEnd ? today : weekStart;

    const dialogRef = this.dialog.open(ActividadDialogComponent, {
      width: 'auto',
      maxWidth: '600px',
      panelClass: 'actividad-dialog-panel',
      backdropClass: 'actividad-dialog-backdrop',
      data: {
        mode: 'create',
        defaultDate: format(defaultDate, 'yyyy-MM-dd')
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadActividades();
      }
    });
  }

  // Activity colors - solid opaque to cover grid lines
  getActividadBgColor(actividad: ActividadCalendario): string {
    if (actividad.colorHex) {
      return this.lightenColor(actividad.colorHex, 0.85);
    }
    // Default SOLID OPAQUE colors by type
    const colorMap: Record<string, string> = {
      'FUNCION': '#FEF3C7',
      'ENSAYO': '#DBEAFE',
      'ENSAYO_PIANO': '#C8E6C9',
      'ENSAYO_MUSICAL': '#FFCDD2',
      'MONTAJE': '#FFE0B2',
      'MONTAJE_ESCENOGRAFIA': '#FFE0B2',
      'DESMONTAJE': '#EEEEEE',
      'EVENTO': '#F3E5F5',
      'EVENTO_EXTERNO': '#BBDEFB',
      'EVENTO_PRIVADO': '#F8BBD0',
      'RESERVA': '#C8E6C9',
      'RESERVA_TECNICA': '#C8E6C9',
      'PAUSA_TECNICA': '#E0E0E0'
    };
    return colorMap[actividad.tipo] || '#F5F5F5';
  }

  private lightenColor(hex: string, amount: number): string {
    hex = hex.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const newR = Math.round(r + (255 - r) * amount);
    const newG = Math.round(g + (255 - g) * amount);
    const newB = Math.round(b + (255 - b) * amount);
    return '#' + [newR, newG, newB].map(x => x.toString(16).padStart(2, '0')).join('').toUpperCase();
  }

  getActividadBorderColor(actividad: ActividadCalendario): string {
    if (actividad.colorHex) {
      return actividad.colorHex;
    }
    const colorMap: Record<string, string> = {
      'FUNCION': '#f59e0b',
      'ENSAYO': '#3b82f6',
      'ENSAYO_PIANO': '#3b82f6',
      'ENSAYO_MUSICAL': '#ef4444',
      'MONTAJE': '#f97316',
      'MONTAJE_ESCENOGRAFIA': '#f97316',
      'DESMONTAJE': '#6b7280',
      'EVENTO': '#a855f7',
      'EVENTO_EXTERNO': '#6366f1',
      'EVENTO_PRIVADO': '#ec4899',
      'RESERVA': '#10b981',
      'RESERVA_TECNICA': '#10b981',
      'PAUSA_TECNICA': '#6b7280'
    };
    return colorMap[actividad.tipo] || '#9ca3af';
  }

  getActividadHeight(actividad: any): number {
    return actividad.heightPx || 52;
  }

  getActividadTop(actividad: any): number {
    return actividad.topPx || 0;
  }

  getActividadTooltip(actividad: ActividadCalendario): string {
    let tooltip = actividad.titulo;
    tooltip += `\n${actividad.horaInicio} - ${actividad.horaFin}`;
    if (actividad.detalle) {
      tooltip += `\n${actividad.detalle}`;
    }
    return tooltip;
  }

  onActividadClick(actividad: ActividadCalendario): void {
    this.selectedActividad.set(actividad);
  }

  closeDialog(): void {
    this.selectedActividad.set(null);
    this.confirmingDelete.set(false);
  }

  editActividad(): void {
    const actividad = this.selectedActividad();
    if (!actividad) return;

    this.closeDialog();

    const dialogRef = this.dialog.open(ActividadDialogComponent, {
      width: 'auto',
      maxWidth: '600px',
      panelClass: 'actividad-dialog-panel',
      backdropClass: 'actividad-dialog-backdrop',
      data: {
        mode: 'edit',
        actividadId: String(actividad.id),
        actividad: {
          titulo: actividad.titulo,
          tipoActividadId: null,
          espacioId: actividad.espacioId,
          fecha: actividad.fecha,
          horaInicio: actividad.horaInicio,
          horaFin: actividad.horaFin,
          descripcion: actividad.detalle || ''
        }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadActividades();
      }
    });
  }

  confirmDeleteActividad(): void {
    this.confirmingDelete.set(true);
  }

  cancelDeleteActividad(): void {
    this.confirmingDelete.set(false);
  }

  deleteActividad(): void {
    const actividad = this.selectedActividad();
    if (!actividad) return;

    this.actividadService.delete(String(actividad.id)).subscribe({
      next: () => {
        this.closeDialog();
        this.loadActividades();
      },
      error: (err) => {
        console.error('Error eliminando actividad:', err);
        this.confirmingDelete.set(false);
      }
    });
  }

  getEspacioNombre(espacioId: number | undefined): string {
    if (!espacioId) return '';
    const espacio = this.espaciosCalendario().find(e => e.id === espacioId);
    return espacio?.nombre || '';
  }

  allDaysEmpty(): boolean {
    return this.semana().dias.every(d => d.franjas.length === 0);
  }

  // TrackBy functions for performance
  trackByDia(index: number, dia: DiaCalendario): string {
    return dia.fecha;
  }

  trackByFranja(index: number, franja: FranjaCalendario): string {
    return `${franja.horaInicio}-${franja.horaFin}`;
  }

  trackByEspacio(index: number, espacio: EspacioCalendario): number {
    return espacio.id;
  }

  trackByActividad(index: number, actividad: ActividadCalendario): string {
    return actividad.id;
  }
}
