// teatro-real-frontend/src/app/features/tempo/logistica/logistica.component.ts

import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  LogisticaService,
  LogisticaStatDto,
  OperacionLogisticaDto
} from '../logistica/logistica.service';

const TIPO_FILTROS = ['Todos', 'Cargas', 'Descargas', 'Transportes', 'Otros'];
const ESTADOS_FILTROS = ['Todos', 'PENDIENTE', 'EN_TRANSITO', 'COMPLETADO'];
const ESTADO_LABELS: Record<string, string> = {
  'PENDIENTE': 'Pendiente',
  'EN_TRANSITO': 'En tránsito',
  'COMPLETADO': 'Completado'
};

@Component({
  selector: 'app-logistica',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page">
      <div class="space-y-6">
        <!-- Header -->
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 class="text-3xl font-semibold text-gray-800">Logística de Almacenes</h1>
            <p class="text-gray-500">Gestión de recogidas y salidas de producciones</p>
          </div>
          <div class="flex gap-2">
            <a routerLink="/tempo/movimientos/calendario" class="btn-calendario">
              <span class="material-icons text-lg">calendar_month</span>
              Ver Calendario
            </a>
            <button class="btn-nuevo">
              <span class="material-icons text-lg">add</span>
              Nuevo Movimiento
            </button>
          </div>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <article class="stat-card" *ngFor="let stat of statCards">
            <p class="text-sm text-gray-500 uppercase tracking-wide">{{ stat.label }}</p>
            <p class="text-3xl font-semibold text-gray-800 mt-1">{{ stat.value }}</p>
          </article>
        </div>

        <!-- Filters -->
        <div class="card">
          <div class="flex flex-wrap gap-4 items-end">
            <div>
              <label class="form-label">Tipo</label>
              <select class="form-select" #tipoSelect [value]="selectedTipo" (change)="setTipo(tipoSelect.value)">
                <option *ngFor="let option of tipoFiltros">{{ option }}</option>
              </select>
            </div>
            <div>
              <label class="form-label">Estado</label>
              <select class="form-select" #estadoSelect [value]="selectedEstado" (change)="setEstado(estadoSelect.value)">
                <option *ngFor="let option of estadoFiltros" [value]="option">
                  {{ option === 'Todos' ? option : getEstadoLabel(option) }}
                </option>
              </select>
            </div>
            <button class="btn-secondary ml-auto">
              <span class="material-icons text-sm">filter_list</span>
              Más filtros
            </button>
          </div>
        </div>

        <!-- Operations List -->
        <div class="space-y-4">
          <article *ngFor="let operacion of operacionesFiltradas()" class="card card-hover">
            <div class="flex gap-4">
              <div class="icon-circle" [style.background]="operacion.estadoColor + '20'">
                <span class="material-icons text-2xl" [style.color]="operacion.estadoColor">{{ operacion.icon }}</span>
              </div>
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-1">
                  <h2 class="text-lg font-semibold text-gray-900">{{ operacion.nombre }}</h2>
                  <span class="badge-pill" [style.background]="operacion.estadoColor + '22'" [style.color]="operacion.estadoColor">
                    {{ operacion.estadoLabel || getEstadoLabel(operacion.estado) }}
                  </span>
                </div>
                <p class="text-gray-600 mb-2">
                  {{ operacion.desde }} <span class="text-gray-400">→</span> {{ operacion.hacia }}
                </p>
                <div class="flex flex-wrap gap-4 text-sm text-gray-500">
                  <span class="flex items-center gap-1">
                    <span class="material-icons text-base">calendar_month</span>
                    {{ operacion.fecha }} · {{ operacion.hora }}
                  </span>
                  <span class="flex items-center gap-1">
                    <span class="material-icons text-base">local_shipping</span>
                    {{ operacion.camiones }} camiones
                  </span>
                </div>
                <p class="text-sm text-gray-500 mt-2">{{ operacion.detalle }}</p>
              </div>
              <div class="flex flex-col gap-2">
                <button class="btn-outline" (click)="verDetalle(operacion)">Ver detalle</button>
                <button
                  *ngIf="operacion.estado === 'PENDIENTE'"
                  class="btn-transito"
                  (click)="iniciarTransito(operacion)"
                  [disabled]="procesando">
                  <span class="material-icons text-sm">play_arrow</span>
                  Iniciar Tránsito
                </button>
                <button
                  *ngIf="operacion.estado === 'EN_TRANSITO'"
                  class="btn-completar"
                  (click)="completarOperacion(operacion)"
                  [disabled]="procesando">
                  <span class="material-icons text-sm">check</span>
                  Completar
                </button>
                <button
                  *ngIf="operacion.estado === 'COMPLETADO'"
                  class="btn-secondary-small"
                  (click)="reiniciarOperacion(operacion)"
                  [disabled]="procesando">
                  <span class="material-icons text-sm">replay</span>
                  Reiniciar
                </button>
              </div>
            </div>
          </article>

          <div *ngIf="loading" class="space-y-4">
            <div class="card h-32 animate-pulse bg-gray-200" *ngFor="let i of [1, 2, 3]"></div>
          </div>

          <div *ngIf="!loading && operacionesFiltradas().length === 0" class="card text-center py-12">
            <span class="material-icons text-5xl text-gray-300 mb-2">inventory_2</span>
            <p class="text-gray-500">No hay operaciones que coincidan con los filtros</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      background: #f2f4f7;
    }

    .page {
      background: #f2f4f7;
      padding: 1.5rem 2rem;
      min-height: 100vh;
    }

    .card {
      background: #ffffff;
      border-radius: 1rem;
      border: 1px solid rgba(15, 23, 42, 0.08);
      padding: 1.4rem;
      box-shadow: 0 20px 35px rgba(15, 23, 42, 0.1);
    }

    .card-hover {
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .card-hover:hover {
      transform: translateY(-3px);
      box-shadow: 0 25px 45px rgba(15, 23, 42, 0.15);
    }

    .stat-card {
      border-radius: 0.9rem;
      border: 1px solid rgba(15, 23, 42, 0.08);
      padding: 1.2rem;
      background: #ffffff;
      box-shadow: 0 15px 30px rgba(15, 23, 42, 0.08);
    }

    .form-label {
      display: block;
      font-size: 0.75rem;
      font-weight: 600;
      color: #6b7280;
      margin-bottom: 0.35rem;
      text-transform: uppercase;
      letter-spacing: 0.025em;
    }

    .form-select {
      padding: 0.5rem 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      font-size: 0.875rem;
      background: white;
      color: #374151;
      cursor: pointer;
      min-width: 140px;
    }

    .form-select:focus {
      outline: none;
      border-color: #CF102D;
      box-shadow: 0 0 0 2px rgba(207, 16, 45, 0.1);
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

    .btn-calendario {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      background: white;
      color: #374151;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s;
      text-decoration: none;
    }

    .btn-calendario:hover {
      background: #f3f4f6;
      transform: translateY(-2px);
    }

    .btn-secondary {
      display: flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.5rem 1rem;
      background: #f3f4f6;
      color: #374151;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      font-weight: 500;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-secondary:hover {
      background: #e5e7eb;
    }

    .icon-circle {
      width: 56px;
      height: 56px;
      border-radius: 999px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .badge-pill {
      padding: 0.25rem 0.75rem;
      border-radius: 999px;
      font-weight: 600;
      font-size: 0.7rem;
      letter-spacing: 0.03em;
    }

    .btn-outline {
      padding: 0.5rem 1rem;
      background: transparent;
      color: #374151;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      font-weight: 500;
      font-size: 0.8rem;
      cursor: pointer;
      transition: all 0.2s;
      white-space: nowrap;
    }

    .btn-outline:hover {
      background: #f3f4f6;
    }

    .btn-action {
      padding: 0.5rem 1rem;
      background: #fbbf24;
      color: #1f2937;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.8rem;
      cursor: pointer;
      transition: all 0.2s;
      box-shadow: 0 4px 12px rgba(251, 191, 36, 0.3);
    }

    .btn-action:hover {
      background: #f59e0b;
      transform: translateY(-1px);
    }

    .btn-transito {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      padding: 0.5rem 1rem;
      background: #3B82F6;
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.75rem;
      cursor: pointer;
      transition: all 0.2s;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    }

    .btn-transito:hover:not(:disabled) {
      background: #2563EB;
      transform: translateY(-1px);
    }

    .btn-transito:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-completar {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      padding: 0.5rem 1rem;
      background: #34D399;
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.75rem;
      cursor: pointer;
      transition: all 0.2s;
      box-shadow: 0 4px 12px rgba(52, 211, 153, 0.3);
    }

    .btn-completar:hover:not(:disabled) {
      background: #10B981;
      transform: translateY(-1px);
    }

    .btn-completar:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-secondary-small {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      padding: 0.4rem 0.75rem;
      background: #f3f4f6;
      color: #6B7280;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-weight: 500;
      font-size: 0.7rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-secondary-small:hover:not(:disabled) {
      background: #e5e7eb;
    }

    .btn-secondary-small:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `]
})
export class LogisticaComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  private logisticaService = inject(LogisticaService);

  stats: LogisticaStatDto | null = null;
  operaciones: OperacionLogisticaDto[] = [];
  loading = true;
  procesando = false;

  tipoFiltros = TIPO_FILTROS;
  estadoFiltros = ESTADOS_FILTROS;
  estadoLabels = ESTADO_LABELS;
  selectedTipo = TIPO_FILTROS[0];
  selectedEstado = ESTADOS_FILTROS[0];

  ngOnInit(): void {
    this.logisticaService.obtenerResumen()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: stats => (this.stats = stats),
        error: () => {} // Silencioso - servicio tiene fallback
      });

    this.logisticaService.operacionesRecientes()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: operaciones => {
          this.operaciones = operaciones;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
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

  getEstadoLabel(estado: string): string {
    return this.estadoLabels[estado] || estado;
  }

  verDetalle(operacion: OperacionLogisticaDto): void {
    console.log('Ver detalle:', operacion);
    // TODO: Abrir dialog con detalle de operación
  }

  iniciarTransito(operacion: OperacionLogisticaDto): void {
    if (this.procesando) return;
    this.procesando = true;

    this.logisticaService.iniciarTransito(operacion.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (updated) => {
          this.updateOperacionInList(updated);
          this.refreshStats();
          this.procesando = false;
        },
        error: (err) => {
          console.error('Error al iniciar tránsito:', err);
          this.procesando = false;
        }
      });
  }

  completarOperacion(operacion: OperacionLogisticaDto): void {
    if (this.procesando) return;
    this.procesando = true;

    this.logisticaService.completar(operacion.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (updated) => {
          this.updateOperacionInList(updated);
          this.refreshStats();
          this.procesando = false;
        },
        error: (err) => {
          console.error('Error al completar operación:', err);
          this.procesando = false;
        }
      });
  }

  reiniciarOperacion(operacion: OperacionLogisticaDto): void {
    if (this.procesando) return;
    this.procesando = true;

    this.logisticaService.reiniciar(operacion.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (updated) => {
          this.updateOperacionInList(updated);
          this.refreshStats();
          this.procesando = false;
        },
        error: (err) => {
          console.error('Error al reiniciar operación:', err);
          this.procesando = false;
        }
      });
  }

  private updateOperacionInList(updated: OperacionLogisticaDto): void {
    const index = this.operaciones.findIndex(op => op.id === updated.id);
    if (index !== -1) {
      this.operaciones[index] = updated;
      this.operaciones = [...this.operaciones]; // Trigger change detection
    }
  }

  private refreshStats(): void {
    this.logisticaService.obtenerResumen()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: stats => (this.stats = stats),
        error: () => {}
      });
  }
}
