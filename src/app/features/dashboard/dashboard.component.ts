import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeeklyExcelViewComponent } from '../../features/tempo/landing/weekly-excel-view/weekly-excel-view.component';

function getMonday(d: Date): Date {
  // Devuelve el lunes de la semana del día dado
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  date.setDate(diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
function formatDay(date: Date): string {
  return date.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'numeric'
  });
}
function formatWeekRange(start: Date): string {
  const end = addDays(start, 5);
  return `Semana del ${start.getDate()} al ${end.getDate()} de ${start.toLocaleDateString('es-ES', { month: 'long' })}`;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, WeeklyExcelViewComponent],
  template: `
    <div class="dashboard-wrapper">
      <h1 class="main-title">Panel de gestión</h1>
      <section class="agenda-container">
        <h2 class="agenda-title">Agenda semanal (TEMPO)</h2>
        <div class="agenda-bar">
          <button class="arrow-btn" (click)="irSemanaAnterior()">&#x2039;</button>
          <span class="semana">{{ semanaLabel }}</span>
          <button class="arrow-btn" (click)="irSemanaSiguiente()">&#x203A;</button>
        </div>

        <div class="agenda-table-wrapper">
          <div class="agenda-table">
            <div class="agenda-header">
              <div class="espacio-cell">Espacio</div>
              <div class="day-cell" *ngFor="let d of days">
                {{ d }}
              </div>
            </div>
            <div class="agenda-rows">
              <div class="agenda-row" *ngFor="let espacio of espacios">
                <div class="espacio-cell">{{espacio}}</div>
                <div class="agenda-day-cell" *ngFor="let d of days">
                  <!-- Aquí irían las actividades, ahora es solo demo -->
                  <div class="actividad-placeholder"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="info-msg">
          Consulta y gestiona todas las actividades musicales y de almacén programadas para la temporada y semana actual.
          <br>
          <strong>Usa el menú lateral para acceder a TEMPO o crear nuevas actividades, o cambia de módulo para acceder a TOPS.</strong>
        </div>
      </section>

      <!-- Vista tipo Excel semanal (nuevo) -->
      <section class="excelview-container" style="margin-top: 32px;">
        <h2 class="agenda-title" style="color: #21aca3;">Vista tipo Excel semanal</h2>
        <div class="excelview-table-wrapper">
          <app-weekly-excel-view></app-weekly-excel-view>
        </div>
      </section>

    </div>
  `,
  styles: [`
    .dashboard-wrapper {
      max-width: 1200px;
      margin: 0 auto;
      padding: 6px 20px 0 20px;
      font-family: 'Segoe UI', Arial, sans-serif;
      background: #fafbfc;
      box-sizing: border-box;
    }
    .main-title {
      margin-top: 0;
      font-size: 2.1rem;
      font-weight: 600;
      color: #7d0251;
      text-shadow: 0 2px 8px #ffffff3a;
      margin-bottom: 12px;
      word-break: break-word;
    }
    .agenda-container {
      background: #fff;
      padding: 18px 12px;
      border-radius: 11px;
      box-shadow: 0 4px 32px #0001;
      margin: 0 auto 32px auto;
      min-width: 0;
      overflow-x: auto;
    }
    .excelview-container {
      margin-top: 32px;
      margin-bottom: 24px;
      padding-bottom: 26px;
      background: #fff;
      box-shadow: 0 4px 32px #0001;
      min-width: 0;
      overflow-x: auto;
      /* SIN border-radius para que la tabla no se corte */
      border-radius: 0;
      padding-left: 0;
      padding-right: 0;
      padding-top: 18px;
    }
    .agenda-title {
      font-size: 1.4rem;
      font-weight: 500;
      margin-bottom: 12px;
      letter-spacing: 0.5px;
      color: #6366f1;
    }
    .agenda-bar {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: 12px;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }
    .arrow-btn {
      background: none;
      border: none;
      font-size: 2rem;
      cursor: pointer;
      color: #7d0251;
      margin: 0 8px;
      flex-shrink: 0;
    }
    .semana {
      font-size: 1.17rem;
      font-weight: 500;
      flex: 1;
      min-width: 180px;
    }
    .agenda-table-wrapper, .excelview-table-wrapper {
      width: 100%;
      overflow-x: auto;
      min-width: 0;
    }
    .agenda-table {
      width: 100%;
      margin-bottom: 24px;
      min-width: 540px;
    }
    .agenda-header, .agenda-row {
      display: grid;
      grid-template-columns: 120px repeat(6, minmax(82px,1fr));
      align-items: center;
      min-width: 0;
    }
    .agenda-header { background: #ecebfa; font-weight: bold; border-radius: 8px 8px 0 0; }
    .agenda-row { background: #f8f8fa; border-bottom: 1px solid #dedede; }
    .espacio-cell { padding: 12px; color: #222345; font-weight: 500; background: #f7f1fa; word-break: break-word; }
    .day-cell, .agenda-day-cell { padding: 10px; text-align: center; min-width: 0; }
    .day-cell { color: #405cd1; letter-spacing: 0.4px; background: #e9e6fb; }
    .agenda-day-cell { min-height: 38px; background: #fcfcff; }
    .actividad-placeholder {
      margin: 0 auto;
      width: 30px; height: 8px;
      background: #e7e4eb;
      border-radius: 4px;
    }
    .info-msg {
      margin-top: 16px;
      text-align: center;
      font-size: 1rem;
      color: #5c506c;
      font-weight: 400;
    }
    @media (max-width: 980px) {
      .dashboard-wrapper {
        padding: 10px 4vw;
      }
      .main-title { font-size: 1.35rem; }
      .agenda-container { padding: 7px 1vw; }
      .excelview-container { padding-left: 0; padding-right: 0; }
      .agenda-table { min-width: 380px; font-size: 0.89em; }
      .agenda-header, .agenda-row {
        grid-template-columns: 80px repeat(6, minmax(60px, 1fr));
      }
      .excelview-table-wrapper, .agenda-table-wrapper { padding-bottom: 10px; }
    }
    @media (max-width: 680px) {
      .dashboard-wrapper { padding: 3px 2vw; }
      .main-title { font-size: 1.1rem; }
      .agenda-title { font-size: 1.04rem; }
      .agenda-table { min-width: 310px; font-size: 0.8em; }
      .agenda-container { padding: 4px 1vw; }
      .excelview-container { padding-left: 0; padding-right: 0; }
      .agenda-header, .agenda-row {
        grid-template-columns: 56px repeat(6, minmax(44px,1fr));
      }
    }
  `]
})
export class DashboardComponent {
  espacios = [
    'Sala Principal',
    'Sala de Ensayo',
    'Almacén',
    'Camerinos'
  ];

  currentWeekMonday: Date;
  days: string[] = [];
  semanaLabel = '';

  constructor() {
    this.currentWeekMonday = getMonday(new Date());
    this.actualizarSemana();
  }

  irSemanaAnterior() {
    this.currentWeekMonday = addDays(this.currentWeekMonday, -7);
    this.actualizarSemana();
  }
  irSemanaSiguiente() {
    this.currentWeekMonday = addDays(this.currentWeekMonday, 7);
    this.actualizarSemana();
  }
  actualizarSemana() {
    this.days = [];
    for (let i = 0; i < 6; i++) {
      this.days.push(formatDay(addDays(this.currentWeekMonday, i)));
    }
    this.semanaLabel = formatWeekRange(this.currentWeekMonday);
  }
}
