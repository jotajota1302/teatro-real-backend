// WeeklyExcelViewComponent: Visor semanal tipo Excel para TEMPO
import { Component, inject, signal, computed, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActividadService } from '../../services/actividad.service';
import { EspacioService } from '../../services/espacio.service';
import { addDays, startOfWeek, format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe utilitario para traducir estado
 */
@Pipe({ name: 'estadoToLabel', standalone: true })
export class EstadoToLabelPipe implements PipeTransform {
  transform(value: string): string {
    switch (value) {
      case 'PENDIENTE': return 'Pendiente';
      case 'EN_TRANSITO': return 'En tránsito';
      case 'COMPLETADO': return 'Completado';
      default: return value ?? '';
    }
  }
}

/**
 * Componente para mostrar la vista semanal de actividades
 * Estilo Excel: filas = espacios, columnas = días de la semana
 * Accesibilidad y navegación por semana integradas
 */
@Component({
  selector: 'app-weekly-excel-view',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, EstadoToLabelPipe],
  template: `
    <div class="weekly-view">
      <!-- Navegación de semanas -->
      <div class="flex justify-between items-center mb-4 nav-row">
        <button mat-icon-button aria-label="Semana anterior" (click)="previousWeek()">
          <mat-icon>chevron_left</mat-icon>
        </button>
        <span *ngIf="weekStart() && weekEnd()" class="text-lg font-semibold week-range">
          Semana del {{ weekStart() | date:'d MMM':'':'es' }}
          al {{ weekEnd() | date:'d MMM yyyy':'':'es' }}
        </span>
        <span *ngIf="!weekStart() || !weekEnd()" class="text-lg font-semibold week-range"></span>
        <button mat-icon-button aria-label="Semana siguiente" (click)="nextWeek()">
          <mat-icon>chevron_right</mat-icon>
        </button>
      </div>

      <ng-container *ngIf="(espacioService.espacios()?.length ?? 0) > 0; else noSpaces">
        <div class="overflow-x-auto excel-scroll-wrap">
          <table class="excel-table w-full border-collapse" aria-label="Vista semanal de actividades">
            <thead>
              <tr>
                <th class="sticky left-0 bg-gray-100 z-10 p-2 border excel-th espacio-th">
                  Espacio
                </th>
                @for (day of weekDays(); track day.date) {
                  <th class="p-2 border excel-th"
                      [class.bg-blue-50]="isToday(day.date)">
                    <div class="text-sm font-medium">{{ day.dayName }}</div>
                    <div class="text-xs text-gray-500">{{ day.date | date:'d/M' }}</div>
                  </th>
                }
              </tr>
            </thead>
            <tbody>
              @for (espacio of espacioService.espacios(); track espacio.id) {
                <tr>
                  <td class="sticky left-0 bg-white z-10 p-2 border font-medium espacio-td"
                      [style.border-left-color]="espacio.color"
                      [style.border-left-width]="'4px'">
                    {{ espacio.nombre }}
                  </td>
                  @for (day of weekDays(); track day.date) {
                    <td class="p-1 border align-top min-h-[56px] excel-td"
                        [class.bg-blue-50]="isToday(day.date)">
                      <ng-container *ngIf="getActividadesForCell(espacio.id, day.date).length > 0; else noActsInCell">
                        <div *ngFor="let act of getActividadesForCell(espacio.id, day.date)" class="activity-chip text-xs p-1 mb-1 rounded cursor-pointer"
                             [style.background-color]="act.tipoActividad?.colorHex ? act.tipoActividad.colorHex + '20' : '#e9e9e9'"
                             [style.border-left-color]="act.tipoActividad?.colorHex ?? '#bbb'"
                             [style.border-left-width]="'3px'"
                             tabindex="0"
                             role="button"
                             [attr.aria-label]="'Ver detalle de ' + act.titulo"
                             (click)="openActividad(act)">
                          <div class="badge-row">
                            <span class="badge-estado" *ngIf="act.estado"
                              [ngClass]="act.estado">{{ act.estado | estadoToLabel }}</span>
                            <span class="tipo-badge"
                                  [style.backgroundColor]="act.tipoActividad?.colorHex ?? '#ccc'">
                              {{ act.tipoActividad?.nombre }}
                            </span>
                          </div>
                          <div class="font-medium truncate">{{ act.titulo }}</div>
                          <div class="text-gray-500">
                            {{ act.horaInicio }} - {{ act.horaFin }}
                          </div>
                        </div>
                      </ng-container>
                      <ng-template #noActsInCell>
                        <span class="no-acts-placeholder">Sin actividades</span>
                      </ng-template>
                    </td>
                  }
                </tr>
              }
            </tbody>
          </table>
        </div>
        <div *ngIf="allCellsEmpty()" class="empty-week-msg">
          No hay actividades para la semana seleccionada
        </div>
      </ng-container>
      <ng-template #noSpaces>
        <div class="text-center p-4 text-gray-500">No hay espacios registrados</div>
      </ng-template>
    </div>
  `,
  styles: [`
    .weekly-view {
      max-width: 100vw;
      width: 100%;
      margin: 0 auto;
      box-sizing: border-box;
      padding: 0;
    }
    .excel-scroll-wrap {
      max-width: 100vw;
      overflow-x: auto;
      padding-bottom: 8px;
    }
    .excel-table {
      width: 100%;
      min-width: 0;
      font-size: 0.94rem;
      border-spacing: 0;
      table-layout: auto;
    }
    .excel-th, .excel-td {
      min-width: 70px;
      max-width: 150px;
      word-break: break-word;
      overflow-wrap: anywhere;
    }
    .espacio-th, .espacio-td {
      min-width: 68px;
      max-width: 120px;
      word-break: break-word;
      overflow-wrap: break-word;
    }
    .nav-row {
      flex-wrap: wrap;
      gap: 3vw;
      padding-left: 24px;
      padding-right: 24px;
      box-sizing: border-box;
    }
    .week-range {
      min-width: 180px;
      word-break: break-word;
      font-size: 1rem;
    }
    .activity-chip {
      transition: transform 0.1s;
      margin-bottom: 6px;
      background: #fcfcfc;
      border-left: 3px solid #888;
      display: block;
      padding: 5px 7px 5px 4px;
    }
    .activity-chip:focus {
      outline: 2px solid #e94560;
      outline-offset: 2px;
    }
    .activity-chip:hover {
      transform: scale(1.025);
      background: #f3fafd;
    }
    .badge-row {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 2px;
    }
    .tipo-badge {
      color: #fff;
      border-radius: 6px;
      font-size: 0.74em;
      padding: 1px 7px;
      margin-right: 8px;
      background: #888;
      font-weight: 600;
      box-shadow: 0 1px 3px #0001;
      text-shadow: 0 1px 5px #0002;
    }
    .badge-estado {
      display: inline-block;
      padding: 1px 6px;
      border-radius: 6px;
      font-size: 0.72em;
      color: #222;
      font-weight: 500;
      background: #f6e4ee;
      text-transform: capitalize;
      margin-right: 5px;
    }
    .badge-estado.PENDIENTE { background: #f9edde; color: #b3701e; }
    .badge-estado.EN_TRANSITO { background: #e5eef7; color: #1967b3; }
    .badge-estado.COMPLETADO { background: #e2f9df; color: #2a9c43; }
    .no-acts-placeholder {
      color: #bdbdbd;
      font-size: 0.93em;
      font-style: italic;
      display: block;
      min-height: 18px;
      text-align: center;
      margin: 8px 0;
    }
    .empty-week-msg {
      text-align: center;
      color: #959595;
      font-size: 1.08em;
      margin: 21px auto 0 auto;
      padding: 12px;
      background: #f6fafd;
      border-radius: 9px;
      max-width: 380px;
    }
    @media (max-width: 1100px) {
      .excel-table { font-size: 0.85rem; }
      .excel-th, .excel-td { min-width: 54px; max-width: 110px; }
      .espacio-th, .espacio-td { min-width: 36px; max-width: 80px; }
      .week-range { font-size: 0.9rem; min-width: 116px; }
      .nav-row { padding-left: 13px; padding-right: 13px; }
    }
    @media (max-width: 800px) {
      .weekly-view { padding: 0 2vw; }
      .excel-table { font-size: 0.77rem; }
      .excel-th, .excel-td { min-width: 36px; max-width: 75px; }
      .espacio-th, .espacio-td { min-width: 26px; max-width: 48px; }
      .week-range { font-size: 0.8rem; min-width: 60px; }
      .activity-chip { font-size: 0.7em; }
      .nav-row { padding-left: 8px; padding-right: 8px; }
      .empty-week-msg { font-size: 0.98em; }
    }
    @media (max-width: 600px) {
      .weekly-view { padding: 0 0.2vw; }
      .excel-table { font-size: 0.66rem; }
      .excel-th, .excel-td { min-width: 24px; max-width: 52px; }
      .espacio-th, .espacio-td { min-width: 18px; max-width: 32px; }
      .week-range { font-size: 0.7rem; min-width: 38px;}
      .nav-row { padding-left: 4px; padding-right: 4px; }
    }
  `]
})
export class WeeklyExcelViewComponent {
  private actividadService = inject(ActividadService);
  private destroyRef = inject(DestroyRef);
  espacioService = inject(EspacioService);
  // Semana seleccionada (arranca en lunes actual)
  currentWeekStart = signal(startOfWeek(new Date(), { weekStartsOn: 1 }));

  weekStart = computed(() => this.currentWeekStart());
  weekEnd = computed(() => addDays(this.currentWeekStart(), 6));

  weekDays = computed(() => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = addDays(this.currentWeekStart(), i);
      days.push({
        date,
        dayName: format(date, 'EEEE', { locale: es })
      });
    }
    return days;
  });

  constructor() {
    this.loadWeekData();
  }

  loadWeekData(): void {
    const start = format(this.weekStart(), 'yyyy-MM-dd');
    const end = format(this.weekEnd(), 'yyyy-MM-dd');
    this.actividadService.loadActividades({
      fechaInicio: start,
      fechaFin: end
    }).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: () => {},
      error: (err) => {
        console.warn('[WeeklyExcel] Error cargando actividades:', err?.message || err);
      }
    });
    // EspacioService lo llama el landing
  }

  previousWeek(): void {
    this.currentWeekStart.update(d => addDays(d, -7));
    this.loadWeekData();
  }

  nextWeek(): void {
    this.currentWeekStart.update(d => addDays(d, 7));
    this.loadWeekData();
  }

  isToday(date: Date): boolean {
    return format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
  }

  getActividadesForCell(espacioId: number, date: Date): any[] {
    const dateStr = format(date, 'yyyy-MM-dd');
    return this.actividadService.actividades().filter(
      a => a.espacio.id === espacioId && a.fecha === dateStr
    );
  }

  allCellsEmpty(): boolean {
    const actividades = this.actividadService.actividades();
    return !actividades || actividades.length === 0;
  }

  openActividad(actividad: any): void {
    // Aquí se puede abrir un dialog de detalle/edición
    // Por ahora es solo navegable/clickable para extensión futura
  }
}
