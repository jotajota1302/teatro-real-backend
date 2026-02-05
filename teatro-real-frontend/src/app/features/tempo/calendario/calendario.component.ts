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
    <div class="cal-shell">
      <!-- Toolbar -->
      <div class="cal-toolbar">
        <div class="cal-info">
          <p class="cal-temporada">{{ temporadaLabel() }}</p>
          <div class="cal-week-title">
            <span>Semana nº {{ semana().numeroSemana }}</span>
          </div>
          <p class="cal-fechas">{{ fechasLabel() }}</p>
        </div>
        <div class="cal-controls">
          <button class="btn-nav" (click)="irSemanaAnterior()" matTooltip="Semana anterior">
            <mat-icon>chevron_left</mat-icon>
          </button>
          <button class="btn-hoy" (click)="irSemanaActual()">Hoy</button>
          <button class="btn-nav" (click)="irSemanaSiguiente()" matTooltip="Semana siguiente">
            <mat-icon>chevron_right</mat-icon>
          </button>
          <button class="btn-nueva" (click)="onNuevaActividadClick()">
            <mat-icon>add</mat-icon>
            Nueva actividad
          </button>
        </div>
      </div>

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
                {{ franja.horaInicio }} – {{ franja.horaFin }}
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
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: auto;
      min-height: 100%;
    }

    /* Shell container */
    .cal-shell {
      background: #ffffff;
      border-radius: 0.75rem;
      padding: 1.5rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      font-family: 'Montserrat', sans-serif;
      color: #1f2937;
      min-height: 400px;
    }

    /* Toolbar */
    .cal-toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
      flex-shrink: 0;
    }

    .cal-info {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .cal-temporada {
      margin: 0;
      font-weight: 600;
      color: #6b7280;
      letter-spacing: 0.08em;
      font-size: 0.75rem;
      text-transform: uppercase;
    }

    .cal-week-title {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 1.5rem;
      font-weight: 700;
      color: #010101;
    }

    .badge {
      font-size: 0.65rem;
      padding: 0.25rem 0.6rem;
      border-radius: 999px;
      background: #d1fae5;
      color: #065f46;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-weight: 600;
    }

    .badge.provisional {
      background: #fef3c7;
      color: #92400e;
    }

    .cal-fechas {
      margin: 0;
      font-size: 0.9rem;
      color: #6b7280;
    }

    .cal-controls {
      display: flex;
      align-items: center;
      gap: 0.5rem;
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

    .btn-nueva {
      margin-left: 0.75rem;
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      padding: 0.45rem 0.9rem;
      border-radius: 0.375rem;
      border: none;
      cursor: pointer;
      font-family: 'Montserrat', sans-serif;
      font-size: 0.8rem;
      font-weight: 600;
      color: #ffffff;
      background: #cf102d;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.18);
      transition: all 0.15s ease;
    }

    .btn-nueva mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .btn-nueva:hover {
      background: #a30d23;
      box-shadow: 0 3px 8px rgba(0, 0, 0, 0.25);
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

    .col-header:last-child {
      border-right: none;
    }

    .col-header.fecha-hora {
      text-align: left;
      padding-left: 1rem;
      min-width: 120px;
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

    .celda-hora {
      padding: 0.5rem 1rem;
      border-right: 1px solid #e5e7eb;
      border-bottom: 1px solid #f3f4f6;
      font-size: 0.75rem;
      font-weight: 500;
      color: #6b7280;
      background: #fafafa;
      min-width: 120px;
    }

    .celda-espacio {
      border-right: 1px solid #e5e7eb;
      border-bottom: 1px solid #f3f4f6;
      min-height: 52px;
      padding: 0.35rem;
      min-width: 140px;
    }

    .celda-espacio:last-child {
      border-right: none;
    }

    /* Activity chips */
    .actividad {
      border-radius: 0.375rem;
      padding: 0.4rem 0.5rem;
      margin-bottom: 0.25rem;
      font-size: 0.75rem;
      line-height: 1.3;
      color: #1f2937;
      border-left: 3px solid;
      cursor: pointer;
      transition: transform 0.15s ease, box-shadow 0.15s ease;
    }

    .actividad:hover {
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
    }

    .actividad:last-child {
      margin-bottom: 0;
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

    /* Responsive */
    @media (max-width: 1200px) {
      .col-header.fecha-hora,
      .celda-hora {
        min-width: 100px;
      }
      .celda-espacio {
        min-width: 120px;
      }
    }

    @media (max-width: 768px) {
      .cal-shell {
        padding: 1rem;
      }

      .cal-toolbar {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
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
        min-width: 80px;
        padding: 0.4rem 0.5rem;
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
  private destroyRef = inject(DestroyRef);
  private dialog = inject(MatDialog);

  // Selected activity for dialog
  selectedActividad = signal<ActividadCalendario | null>(null);

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
    return `120px repeat(${numEspacios}, minmax(140px, 1fr))`;
  });

  // Computed: transform activities to calendar week structure
  semana = computed<SemanaCalendario>(() => {
    const weekStart = this.currentWeekStart();
    const actividades = this.actividadesRaw();
    const espacios = this.espaciosCalendario();

    const dias: DiaCalendario[] = [];
    const diasNombres: NombreDia[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

    for (let i = 0; i < 7; i++) {
      const fecha = addDays(weekStart, i);
      const fechaStr = format(fecha, 'yyyy-MM-dd');

      // Filter activities for this day
      const actividadesDia = actividades.filter(a => a.fecha === fechaStr);

      // Group by unique time slots
      const franjasMap = new Map<string, FranjaCalendario>();

      actividadesDia.forEach(act => {
        const key = `${act.horaInicio}-${act.horaFin}`;
        if (!franjasMap.has(key)) {
          franjasMap.set(key, {
            horaInicio: act.horaInicio,
            horaFin: act.horaFin,
            actividadesPorEspacio: {}
          });
        }

        const franja = franjasMap.get(key)!;
        const originalEspacioId = act.espacio?.id || 0;
        // Map the space ID to the calendar column ID
        const columnaId = this.espacioToColumnaMap[originalEspacioId] || 15; // Default to "Otras Salas"

        if (!franja.actividadesPorEspacio[columnaId]) {
          franja.actividadesPorEspacio[columnaId] = [];
        }

        franja.actividadesPorEspacio[columnaId].push(this.mapToCalendarioActividad(act, columnaId));
      });

      // Sort franjas by hora inicio
      const franjas = Array.from(franjasMap.values()).sort((a, b) =>
        a.horaInicio.localeCompare(b.horaInicio)
      );

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
      id: parseInt(act.id) || 0,
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
      width: '720px',
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

  // Activity colors
  getActividadBgColor(actividad: ActividadCalendario): string {
    if (actividad.colorHex) {
      return actividad.colorHex + '20'; // 20 = ~12% opacity
    }
    // Default colors by type
    const colorMap: Record<string, string> = {
      'FUNCION': '#1E3A5F20',
      'ENSAYO': '#2E7D3220',
      'ENSAYO_PIANO': '#C8E6C940',
      'ENSAYO_MUSICAL': '#FFCDD240',
      'MONTAJE': '#FFE0B2',
      'DESMONTAJE': '#EEEEEE',
      'EVENTO': '#AD145720',
      'EVENTO_EXTERNO': '#BBDEFB',
      'RESERVA': '#C8E6C9',
      'PAUSA_TECNICA': '#E0E0E0'
    };
    return colorMap[actividad.tipo] || '#F3F4F6';
  }

  getActividadBorderColor(actividad: ActividadCalendario): string {
    if (actividad.colorHex) {
      return actividad.colorHex;
    }
    const colorMap: Record<string, string> = {
      'FUNCION': '#1E3A5F',
      'ENSAYO': '#2E7D32',
      'ENSAYO_PIANO': '#4CAF50',
      'ENSAYO_MUSICAL': '#E91E63',
      'MONTAJE': '#FF9800',
      'DESMONTAJE': '#9E9E9E',
      'EVENTO': '#AD1457',
      'EVENTO_EXTERNO': '#2196F3',
      'RESERVA': '#4CAF50',
      'PAUSA_TECNICA': '#757575'
    };
    return colorMap[actividad.tipo] || '#9CA3AF';
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

  trackByActividad(index: number, actividad: ActividadCalendario): number {
    return actividad.id;
  }
}
