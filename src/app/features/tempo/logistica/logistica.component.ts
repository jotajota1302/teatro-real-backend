// teatro-real-frontend/src/app/features/tempo/logistica/logistica.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LogisticaService,
  LogisticaStatDto,
  OperacionLogisticaDto
} from '../logistica/logistica.service';

const TIPO_FILTROS = ['Todos', 'Cargas', 'Descargas', 'Transportes', 'Otros'];
const ESTADOS_FILTROS = ['Todos', 'Programado', 'En tránsito', 'Completado', 'Pendiente'];

@Component({
  selector: 'app-logistica',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <div class="header">
        <div>
          <p class="eyebrow">Tempo</p>
          <h1>Logística de Almacenes</h1>
          <p>Gestión de recogidas y salidas de producciones</p>
        </div>
        <button class="btn-primary">
          <span class="material-icons">add</span>
          Nuevo movimiento
        </button>
      </div>

      <div class="stats-grid">
        <article class="stat-card" *ngFor="let stat of statCards">
          <p class="label">{{ stat.label }}</p>
          <p class="value">{{ stat.value }}</p>
        </article>
      </div>

      <div class="filters">
        <label>
          <span>Tipo</span>
          <select #tipoSelect [value]="selectedTipo" (change)="setTipo(tipoSelect.value)">
            <option *ngFor="let option of tipoFiltros">{{ option }}</option>
          </select>
        </label>
        <label>
          <span>Estado</span>
          <select #estadoSelect [value]="selectedEstado" (change)="setEstado(estadoSelect.value)">
            <option *ngFor="let option of estadoFiltros">{{ option }}</option>
          </select>
        </label>
        <div class="spacer"></div>
        <button class="btn-secondary">Filtros</button>
      </div>

      <section class="operations">
        <article *ngFor="let operacion of operacionesFiltradas()" class="operation-card">
          <div class="operation-main">
            <div class="icon-circle" [style.background]="operacion.estadoColor + '20'">
              <span class="material-icons" [style.color]="operacion.estadoColor">{{ operacion.icon }}</span>
            </div>
            <div class="operation-body">
              <div class="operation-heading">
                <h2>{{ operacion.nombre }}</h2>
                <span class="badge" [style.background]="operacion.estadoColor + '22'">
                  {{ operacion.estado }}
                </span>
              </div>
              <p class="operation-route">
                {{ operacion.desde }} → {{ operacion.hacia }}
              </p>
              <div class="operation-meta">
                <span class="meta-item">
                  <span class="material-icons">calendar_month</span>
                  {{ operacion.fecha }} · {{ operacion.hora }}
                </span>
                <span class="meta-item">
                  <span class="material-icons">local_shipping</span>
                  {{ operacion.camiones }} camiones
                </span>
              </div>
              <p class="operation-detail">{{ operacion.detalle }}</p>
            </div>
          </div>
          <div class="operation-actions">
            <button class="btn-border">Ver detalle</button>
            <button class="btn-yellow">Iniciar</button>
          </div>
        </article>

        <div *ngIf="loading" class="loading-placeholder">
          <div class="skeleton" *ngFor="let i of [1, 2, 3]"></div>
        </div>
      </section>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        padding: 2rem;
        background: #f2f4f7;
        min-height: 100vh;
      }

      .page {
        max-width: 1100px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        gap: 1.8rem;
      }

      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
      }

      .eyebrow {
        text-transform: uppercase;
        color: #8b96ac;
        font-size: 0.75rem;
        letter-spacing: 0.3em;
        margin-bottom: 0.3rem;
      }

      .header h1 {
        font-size: 2.4rem;
        margin: 0;
      }

      .header p {
        margin: 0;
        color: #6b7280;
        font-size: 0.95rem;
      }

      .btn-primary {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        background: linear-gradient(135deg, #f0364d, #c6002b);
        color: white;
        border: none;
        border-radius: 999px;
        padding: 0.95rem 1.8rem;
        font-weight: 700;
        font-size: 0.95rem;
        cursor: pointer;
        box-shadow: 0 10px 25px rgba(224, 54, 77, 0.35);
      }

      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
      }

      .stat-card {
        background: white;
        border-radius: 1rem;
        padding: 1.2rem;
        box-shadow: 0 18px 35px rgba(15, 23, 42, 0.1);
        display: flex;
        flex-direction: column;
        gap: 0.2rem;
      }

      .stat-card .label {
        text-transform: uppercase;
        letter-spacing: 0.2em;
        font-size: 0.75rem;
        color: #8692a7;
      }

      .stat-card .value {
        font-size: 2rem;
        font-weight: 700;
        color: #1f2937;
      }

      .filters {
        background: white;
        border-radius: 1rem;
        padding: 1rem 1.4rem;
        display: flex;
        align-items: center;
        gap: 1rem;
        box-shadow: 0 12px 25px rgba(15, 23, 42, 0.08);
      }

      .filters label {
        display: flex;
        flex-direction: column;
        font-size: 0.85rem;
        color: #515c6f;
      }

      select {
        margin-top: 0.25rem;
        border-radius: 0.75rem;
        border: 1px solid #d1d5db;
        background: #f8fafc;
        padding: 0.5rem 1rem;
        font-size: 0.95rem;
      }

      .spacer {
        flex: 1;
      }

      .btn-secondary {
        background: transparent;
        border: 1px solid #c1c7d5;
        border-radius: 999px;
        padding: 0.65rem 1.6rem;
        font-weight: 600;
        color: #334155;
        cursor: pointer;
      }

      .operations {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .operation-card {
        background: white;
        border-radius: 1.5rem;
        padding: 1.4rem 1.6rem;
        box-shadow: 0 25px 45px rgba(15, 23, 42, 0.15);
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .operation-main {
        display: flex;
        gap: 1rem;
        align-items: flex-start;
      }

      .icon-circle {
        width: 56px;
        height: 56px;
        border-radius: 999px;
        display: grid;
        place-items: center;
      }

      .operation-heading {
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      .operation-heading h2 {
        margin: 0;
        font-size: 1.3rem;
        font-weight: 700;
      }

      .badge {
        padding: 0.2rem 0.9rem;
        border-radius: 999px;
        font-size: 0.7rem;
        font-weight: 700;
        color: #0f172a;
      }

      .operation-route {
        margin: 0.3rem 0;
        color: #475569;
        font-size: 0.95rem;
      }

      .operation-meta {
        display: flex;
        gap: 1.4rem;
        flex-wrap: wrap;
        color: #6b7280;
        font-size: 0.9rem;
      }

      .operation-meta .meta-item {
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;
      }

      .operation-detail {
        margin: 0;
        color: #4b5563;
        font-size: 0.9rem;
      }

      .operation-actions {
        display: flex;
        gap: 0.6rem;
      }

      .btn-border, .btn-yellow {
        flex: 1;
        border-radius: 999px;
        padding: 0.75rem 1.2rem;
        border: 1px solid transparent;
        font-weight: 600;
        cursor: pointer;
      }

      .btn-border {
        background: transparent;
        border-color: #c1c7d5;
        color: #334155;
      }

      .btn-yellow {
        background: #f7c948;
        color: #1c1c1c;
        box-shadow: 0 15px 30px rgba(248, 177, 56, 0.25);
      }

      .loading-placeholder {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }

      .skeleton {
        height: 110px;
        border-radius: 1rem;
        background: linear-gradient(90deg, #e5e7eb, #f3f4f6, #e5e7eb);
        animation: shimmer 1.2s infinite;
      }

      @keyframes shimmer {
        0% {
          background-position: -200px 0;
        }
        100% {
          background-position: 200px 0;
        }
      }

      @media (max-width: 900px) {
        .filters {
          flex-direction: column;
          align-items: stretch;
        }

        .operation-meta {
          flex-direction: column;
        }

        .btn-primary {
          width: 100%;
          justify-content: center;
        }
      }
    `
  ]
})
export class LogisticaComponent implements OnInit {
  stats: LogisticaStatDto | null = null;
  operaciones: OperacionLogisticaDto[] = [];
  loading = true;

  tipoFiltros = TIPO_FILTROS;
  estadoFiltros = ESTADOS_FILTROS;
  selectedTipo = TIPO_FILTROS[0];
  selectedEstado = ESTADOS_FILTROS[0];

  constructor(private readonly logisticaService: LogisticaService) {}

  ngOnInit(): void {
    this.logisticaService.obtenerResumen().subscribe(stats => (this.stats = stats));
    this.logisticaService.operacionesRecientes().subscribe(operaciones => {
      this.operaciones = operaciones;
      this.loading = false;
    });
  }

  get statCards() {
    return [
      { label: 'Programados', value: this.stats?.programados ?? '-' },
      { label: 'En tránsito', value: this.stats?.enTransito ?? '-' },
      { label: 'Completados', value: this.stats?.completados ?? '-' },
      { label: 'Camiones hoy', value: this.stats?.camionesHoy ?? '-' }
    ];
  }

  setTipo(tipo: string): void {
    this.selectedTipo = tipo;
  }

  setEstado(estado: string): void {
    this.selectedEstado = estado;
  }

  operacionesFiltradas(): OperacionLogisticaDto[] {
    return this.operaciones.filter(op => {
      const tipoMatch = this.selectedTipo === 'Todos' || (op.tipo ?? 'Otros') === this.selectedTipo;
      const estadoMatch = this.selectedEstado === 'Todos' || op.estado === this.selectedEstado;
      return tipoMatch && estadoMatch;
    });
  }
}
