// WeeklyExcelViewComponent: Visor semanal tipo Excel para TEMPO
import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActividadService } from '../../services/actividad.service';
import { EspacioService } from '../../services/espacio.service';
import { addDays, startOfWeek, format } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Componente para mostrar la vista semanal de actividades
 * Estilo Excel: filas = espacios, columnas = días de la semana
 * Accesibilidad y navegación por semana integradas
 */
@Component({
  selector: 'app-weekly-excel-view',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule],
  template: `
    <div class="weekly-view">
      <!-- Navegación de semanas -->
      <div class="flex justify-between items-center mb-4">
        <button mat-icon-button aria-label="Semana anterior" (click)="previousWeek()">
          <mat-icon>chevron_left</mat-icon>
        </button>
        <span class="text-lg font-semibold">
          Semana del {{ weekStart() | date:'d MMM':'':'es' }}
          al {{ weekEnd() | date:'d MMM yyyy':'':'es' }}
        </span>
        <button mat-icon-button aria-label="Semana siguiente" (click)="nextWeek()">
          <mat-icon>chevron_right</mat-icon>
        </button>
      </div>

      <!-- Tabla Excel semanal -->
      <div class="overflow-x-auto">
        <table class="excel-table w-full border-collapse" aria-label="Vista semanal de actividades">
          <thead>
            <tr>
              <th class="sticky left-0 bg-gray-100 z-10 p-2 border min-w-[150px]">
                Espacio
              </th>
              @for (day of weekDays(); track day.date) {
                <th class="p-2 border min-w-[140px]"
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
                <td class="sticky left-0 bg-white z-10 p-2 border font-medium"
                    [style.border-left-color]="espacio.color"
                    [style.border-left-width]="'4px'">
                  {{ espacio.nombre }}
                </td>
                @for (day of weekDays(); track day.date) {
                  <td class="p-1 border align-top min-h-[80px]"
                      [class.bg-blue-50]="isToday(day.date)">
                    @for (act of getActividadesForCell(espacio.id, day.date); track act.id) {
                      <div class="activity-chip text-xs p-1 mb-1 rounded cursor-pointer"
                           [style.background-color]="act.tipoActividad.colorHex + '20'"
                           [style.border-left-color]="act.tipoActividad.colorHex"
                           [style.border-left-width]="'3px'"
                           tabindex="0"
                           role="button"
                           aria-label="Ver detalle de {{ act.titulo }}"
                           (click)="openActividad(act)">
                        <div class="font-medium truncate">{{ act.titulo }}</div>
                        <div class="text-gray-500">
                          {{ act.horaInicio }} - {{ act.horaFin }}
                        </div>
                      </div>
                    }
                  </td>
                }
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .excel-table {
      font-size: 0.875rem;
    }
    .activity-chip {
      transition: transform 0.1s;
    }
    .activity-chip:focus {
      outline: 2px solid #e94560;
      outline-offset: 2px;
    }
    .activity-chip:hover {
      transform: scale(1.02);
    }
  `]
})
export class WeeklyExcelViewComponent {
  private actividadService = inject(ActividadService);
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
    }).subscribe();
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

  openActividad(actividad: any): void {
    // Aquí se puede abrir un dialog de detalle/edición
    // Por ahora es solo navegable/clickable para extensión futura
  }
}
