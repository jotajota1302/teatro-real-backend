import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-wrapper">
      <h1 class="main-title">Panel de gestión</h1>
      <section class="agenda-container">
        <h2 class="agenda-title">Agenda semanal (TEMPO)</h2>
        <div class="agenda-bar">
          <button class="arrow-btn">&#x2039;</button>
          <span class="semana">Semana del 19 al 25 de enero</span>
          <button class="arrow-btn">&#x203A;</button>
        </div>

        <div class="agenda-table">
          <div class="agenda-header">
            <div class="espacio-cell">Espacio</div>
            <div class="day-cell" *ngFor="let d of days">
              {{d.label}}
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

        <div class="info-msg">
          Consulta y gestiona todas las actividades musicales y de almacén programadas para la temporada y semana actual.
          <br>
          <strong>Usa el menú lateral para acceder a TEMPO o crear nuevas actividades, o cambia de módulo para acceder a TOPS.</strong>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .dashboard-wrapper {
      padding: 6px 18px 0 18px;
      font-family: 'Segoe UI', Arial, sans-serif;
      background: #fafbfc;
    }
    .main-title {
      margin-top: 0;
      font-size: 2.1rem;
      font-weight: 600;
      color: #7d0251;
      text-shadow: 0 2px 8px #ffffff3a;
      margin-bottom: 12px;
    }
    .agenda-container {
      background: #fff;
      padding: 18px 12px;
      border-radius: 11px;
      box-shadow: 0 4px 32px #0001;
      max-width: 1200px;
      margin: 0 auto;
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
    }
    .arrow-btn {
      background: none;
      border: none;
      font-size: 2rem;
      cursor: pointer;
      color: #7d0251;
      margin: 0 8px;
    }
    .semana {
      font-size: 1.17rem;
      font-weight: 500;
      flex: 1;
    }
    .agenda-table {
      width: 100%;
      margin-bottom: 24px;
      overflow-x: auto;
    }
    .agenda-header, .agenda-row {
      display: grid;
      grid-template-columns: 160px repeat(6, 1fr);
      align-items: center;
    }
    .agenda-header { background: #ecebfa; font-weight: bold; border-radius: 8px 8px 0 0; }
    .agenda-row { background: #f8f8fa; border-bottom: 1px solid #dedede; }
    .espacio-cell { padding: 12px; color: #222345; font-weight: 500; background: #f7f1fa; }
    .day-cell, .agenda-day-cell { padding: 10px; text-align: center; }
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
    @media (max-width: 900px) {
      .agenda-container { padding: 10px 3vw; }
      .main-title { font-size: 1.45rem; }
    }
  `]
})
export class DashboardComponent {
  days = [
    { label: 'lunes 19/1' },
    { label: 'martes 20/1' },
    { label: 'miércoles 21/1' },
    { label: 'jueves 22/1' },
    { label: 'viernes 23/1' },
    { label: 'sábado 24/1' }
  ];
  espacios = [
    'Sala Principal',
    'Sala de Ensayo',
    'Almacén',
    'Camerinos'
  ];
}
