// teatro-real-frontend/src/app/features/tempo/logistica/logistica.component.ts

import { Component, OnInit, inject, DestroyRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  LogisticaService,
  LogisticaStatDto,
  OperacionLogisticaDto,
  CrearOperacionDto
} from '../logistica/logistica.service';
import { ThemeService } from '../../../core/services/theme.service';

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
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="page-container" [ngClass]="isDark() ? 'page-dark' : 'page-light'">
      <!-- Fixed Header -->
      <div class="fixed-header">
        <!-- Title row - same structure as Espacios/Cartelería -->
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h1 class="text-3xl font-semibold" [class]="isDark() ? 'text-white' : 'text-title-light'">Logística de Almacenes</h1>
            <p [class]="isDark() ? 'text-gray-400' : 'text-subtitle-light'">Gestión de recogidas y salidas de producciones</p>
          </div>
          <div class="flex flex-wrap items-center justify-end gap-2">
            <a routerLink="/tempo/movimientos" class="btn-action-secondary">
              <span class="material-icons">warehouse</span>
              Calendario Almacenes
            </a>
            <button class="btn-action-primary" (click)="openModal()">
              <span class="material-icons">add</span>
              Nuevo Movimiento
            </button>
          </div>
        </div>

        <!-- Error Banner -->
        <div *ngIf="backendError" class="error-banner" [class.error-banner-dark]="isDark()">
          <div class="error-banner-content">
            <span class="material-icons">cloud_off</span>
            <div class="error-banner-text">
              <p class="error-title">Servidor no disponible</p>
              <p class="error-message">{{ backendError }}</p>
            </div>
            <button (click)="retryConnection()" class="retry-btn">
              <span class="material-icons">refresh</span>
              Reintentar
            </button>
          </div>
        </div>

        <!-- Stats -->
        <div class="stats-grid" *ngIf="!backendError">
          <article class="stat-card" [class.stat-card-dark]="isDark()" *ngFor="let stat of statCards">
            <p class="stat-label" [class.text-gray-400]="isDark()">{{ stat.label }}</p>
            <p class="stat-value" [class.text-white]="isDark()">{{ stat.value }}</p>
          </article>
        </div>
      </div>

      <!-- Scrollable Content -->
      <div class="scrollable-content">
        <!-- Filters -->
        <div class="filters-card" [class.filters-card-dark]="isDark()">
          <div class="filters-row">
            <div class="filter-group">
              <label class="form-label" [class.form-label-dark]="isDark()">Tipo</label>
              <select class="form-select" [class.form-select-dark]="isDark()" #tipoSelect [value]="selectedTipo" (change)="setTipo(tipoSelect.value)">
                <option *ngFor="let option of tipoFiltros">{{ option }}</option>
              </select>
            </div>
            <div class="filter-group">
              <label class="form-label" [class.form-label-dark]="isDark()">Estado</label>
              <select class="form-select" [class.form-select-dark]="isDark()" #estadoSelect [value]="selectedEstado" (change)="setEstado(estadoSelect.value)">
                <option *ngFor="let option of estadoFiltros" [value]="option">
                  {{ option === 'Todos' ? option : getEstadoLabel(option) }}
                </option>
              </select>
            </div>
            <button class="btn-secondary" [class.btn-secondary-dark]="isDark()" (click)="toggleFiltrosAvanzados()">
              <span class="material-icons">{{ showFiltrosAvanzados() ? 'expand_less' : 'expand_more' }}</span>
              {{ showFiltrosAvanzados() ? 'Menos filtros' : 'Más filtros' }}
            </button>
          </div>

          <!-- Filtros avanzados expandibles -->
          <div *ngIf="showFiltrosAvanzados()" class="advanced-filters" [class.advanced-filters-dark]="isDark()">
            <div class="advanced-filters-grid">
              <div class="filter-group">
                <label class="form-label" [class.form-label-dark]="isDark()">Fecha desde</label>
                <input type="date" class="form-input" [class.form-input-dark]="isDark()" [(ngModel)]="filtroFechaDesde">
              </div>
              <div class="filter-group">
                <label class="form-label" [class.form-label-dark]="isDark()">Fecha hasta</label>
                <input type="date" class="form-input" [class.form-input-dark]="isDark()" [(ngModel)]="filtroFechaHasta">
              </div>
              <div class="filter-group">
                <label class="form-label" [class.form-label-dark]="isDark()">Producción</label>
                <input type="text" class="form-input" [class.form-input-dark]="isDark()" [(ngModel)]="filtroProduccion" placeholder="Buscar producción...">
              </div>
              <div class="filter-group">
                <label class="form-label" [class.form-label-dark]="isDark()">Origen/Destino</label>
                <input type="text" class="form-input" [class.form-input-dark]="isDark()" [(ngModel)]="filtroLugar" placeholder="Buscar lugar...">
              </div>
            </div>
            <div class="advanced-filters-actions">
              <button class="btn-secondary" [class.btn-secondary-dark]="isDark()" (click)="limpiarFiltros()">
                <span class="material-icons">clear</span>
                Limpiar
              </button>
              <button class="btn-nuevo btn-small" (click)="aplicarFiltros()">
                <span class="material-icons">search</span>
                Aplicar
              </button>
            </div>
          </div>
        </div>

        <!-- Operations List -->
        <div class="operations-list">
            <article *ngFor="let operacion of operacionesFiltradas()" [class]="isDark() ? 'card-dark card-hover' : 'card card-hover'">
            <div class="flex gap-4">
              <div class="icon-circle" [style.background]="operacion.estadoColor + '20'">
                <span class="material-icons text-2xl" [style.color]="operacion.estadoColor">{{ operacion.icon }}</span>
              </div>
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-1">
                  <h2 class="text-lg font-semibold" [class]="isDark() ? 'text-white' : 'text-gray-900'">{{ operacion.nombre }}</h2>
                  <span class="badge-pill" [style.background]="operacion.estadoColor + '22'" [style.color]="operacion.estadoColor">
                    {{ operacion.estadoLabel || getEstadoLabel(operacion.estado) }}
                  </span>
                </div>
                <p class="mb-2" [class]="isDark() ? 'text-gray-300' : 'text-gray-600'">
                  {{ operacion.desde }} <span [class]="isDark() ? 'text-gray-500' : 'text-gray-400'">→</span> {{ operacion.hacia }}
                </p>
                <div class="flex flex-wrap gap-4 text-sm" [class]="isDark() ? 'text-gray-400' : 'text-gray-500'">
                  <span class="flex items-center gap-1">
                    <span class="material-icons text-base">calendar_month</span>
                    {{ operacion.fecha }} · {{ operacion.hora }}
                  </span>
                  <span class="flex items-center gap-1">
                    <span class="material-icons text-base">local_shipping</span>
                    {{ operacion.camiones }} camiones
                  </span>
                </div>
                <p class="text-sm mt-2" [class]="isDark() ? 'text-gray-400' : 'text-gray-500'">{{ operacion.detalle }}</p>
              </div>
              <div class="flex flex-col gap-2">
                <button [class]="isDark() ? 'btn-outline-dark' : 'btn-outline'" (click)="verDetalle(operacion)">Ver detalle</button>
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
                  [class]="isDark() ? 'btn-secondary-small-dark' : 'btn-secondary-small'"
                  (click)="reiniciarOperacion(operacion)"
                  [disabled]="procesando">
                  <span class="material-icons text-sm">replay</span>
                  Reiniciar
                </button>
              </div>
            </div>
          </article>

          <div *ngIf="loading" class="space-y-4">
            <div [class]="isDark() ? 'card-dark h-32 animate-pulse' : 'card h-32 animate-pulse bg-gray-200'" *ngFor="let i of [1, 2, 3]"></div>
          </div>

          <div *ngIf="!loading && operacionesFiltradas().length === 0" [class]="isDark() ? 'card-dark text-center py-12' : 'card text-center py-12'">
            <span class="material-icons text-5xl mb-2" [class]="isDark() ? 'text-gray-600' : 'text-gray-300'">inventory_2</span>
            <p [class]="isDark() ? 'text-gray-400' : 'text-gray-500'">No hay operaciones que coincidan con los filtros</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Nuevo Movimiento -->
    <div class="modal-overlay" *ngIf="showModal()" (click)="closeModal()">
      <div class="modal-content" [class]="isDark() ? 'modal-dark' : 'modal-light'" (click)="$event.stopPropagation()">
        <div class="modal-header" [class]="isDark() ? 'border-gray-700' : 'border-gray-200'">
          <h2 class="text-lg font-semibold" [class]="isDark() ? 'text-white' : 'text-gray-900'">Nuevo Movimiento</h2>
          <button class="btn-close" [class]="isDark() ? 'btn-close-dark' : 'btn-close-light'" (click)="closeModal()">
            <span class="material-icons">close</span>
          </button>
        </div>

        <form (ngSubmit)="guardarMovimiento()">
          <!-- Tipo de movimiento -->
          <div class="form-group">
            <label [class]="isDark() ? 'form-label-dark' : 'form-label'">Tipo de Movimiento *</label>
            <div class="flex gap-2">
              <button type="button"
                      class="tipo-btn"
                      [class.tipo-btn-active]="formData.tipoMovimiento === 'ENTRADA'"
                      [class.tipo-btn-dark]="isDark() && formData.tipoMovimiento !== 'ENTRADA'"
                      (click)="formData.tipoMovimiento = 'ENTRADA'">
                <span class="material-icons">arrow_back</span>
                Recogida
              </button>
              <button type="button"
                      class="tipo-btn"
                      [class.tipo-btn-active]="formData.tipoMovimiento === 'SALIDA'"
                      [class.tipo-btn-dark]="isDark() && formData.tipoMovimiento !== 'SALIDA'"
                      (click)="formData.tipoMovimiento = 'SALIDA'">
                <span class="material-icons">arrow_forward</span>
                Salida
              </button>
              <button type="button"
                      class="tipo-btn"
                      [class.tipo-btn-active]="formData.tipoMovimiento === 'INTERNO'"
                      [class.tipo-btn-dark]="isDark() && formData.tipoMovimiento !== 'INTERNO'"
                      (click)="formData.tipoMovimiento = 'INTERNO'">
                <span class="material-icons">swap_horiz</span>
                Interno
              </button>
            </div>
          </div>

          <!-- Producción -->
          <div class="form-group">
            <label [class]="isDark() ? 'form-label-dark' : 'form-label'">Producción *</label>
            <input type="text" [class]="isDark() ? 'form-input-dark' : 'form-input'" [(ngModel)]="formData.produccionNombre" name="produccion" required placeholder="Ej: La Traviata">
          </div>

          <!-- Origen y Destino -->
          <div class="grid grid-cols-2 gap-4">
            <div class="form-group">
              <label [class]="isDark() ? 'form-label-dark' : 'form-label'">Origen *</label>
              <input type="text" [class]="isDark() ? 'form-input-dark' : 'form-input'" [(ngModel)]="formData.lugarOrigen" name="origen" required placeholder="Ej: Arganda-Nave">
            </div>
            <div class="form-group">
              <label [class]="isDark() ? 'form-label-dark' : 'form-label'">Destino *</label>
              <input type="text" [class]="isDark() ? 'form-input-dark' : 'form-input'" [(ngModel)]="formData.lugarDestino" name="destino" required placeholder="Ej: Teatro Real">
            </div>
          </div>

          <!-- Fecha y Hora -->
          <div class="grid grid-cols-3 gap-4">
            <div class="form-group">
              <label [class]="isDark() ? 'form-label-dark' : 'form-label'">Fecha *</label>
              <input type="date" [class]="isDark() ? 'form-input-dark' : 'form-input'" [(ngModel)]="formData.fecha" name="fecha" required>
            </div>
            <div class="form-group">
              <label [class]="isDark() ? 'form-label-dark' : 'form-label'">Hora inicio *</label>
              <input type="time" [class]="isDark() ? 'form-input-dark' : 'form-input'" [(ngModel)]="formData.horaInicio" name="horaInicio" required>
            </div>
            <div class="form-group">
              <label [class]="isDark() ? 'form-label-dark' : 'form-label'">Hora fin</label>
              <input type="time" [class]="isDark() ? 'form-input-dark' : 'form-input'" [(ngModel)]="formData.horaFin" name="horaFin">
            </div>
          </div>

          <!-- Camiones y Descripción -->
          <div class="grid grid-cols-3 gap-4">
            <div class="form-group">
              <label [class]="isDark() ? 'form-label-dark' : 'form-label'">Nº Camiones</label>
              <input type="number" [class]="isDark() ? 'form-input-dark' : 'form-input'" [(ngModel)]="formData.numCamiones" name="camiones" min="0" placeholder="0">
            </div>
            <div class="form-group col-span-2">
              <label [class]="isDark() ? 'form-label-dark' : 'form-label'">Descripción</label>
              <input type="text" [class]="isDark() ? 'form-input-dark' : 'form-input'" [(ngModel)]="formData.descripcion" name="descripcion" placeholder="Notas adicionales...">
            </div>
          </div>

          <!-- Acciones -->
          <div class="modal-actions" [class]="isDark() ? 'border-gray-700' : 'border-gray-200'">
            <button type="button" [class]="isDark() ? 'btn-cancel-dark' : 'btn-cancel'" (click)="closeModal()">Cancelar</button>
            <button type="submit" class="btn-nuevo" style="padding: 0.5rem 1.5rem;" [disabled]="guardando">
              {{ guardando ? 'Guardando...' : 'Crear Movimiento' }}
            </button>
          </div>
        </form>
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
      overflow-x: hidden;
      padding: 0 2rem 2rem 2rem;
      -webkit-overflow-scrolling: touch;
      overscroll-behavior: contain;
      touch-action: pan-y;
    }

    /* Stats grid */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .stat-card {
      border-radius: 0.75rem;
      border: 1px solid rgba(15, 23, 42, 0.08);
      padding: 1rem;
      background: #ffffff;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }

    .stat-card.stat-card-dark {
      background: #1a1a1a;
      border-color: rgba(255, 255, 255, 0.1);
    }

    .stat-label {
      font-size: 0.75rem;
      font-weight: 600;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin: 0;
    }

    .stat-value {
      font-size: 1.75rem;
      font-weight: 700;
      color: #1f2937;
      margin: 0.25rem 0 0 0;
    }

    /* Error banner */
    .error-banner {
      padding: 1rem 1.5rem;
      border-radius: 0.75rem;
      margin-bottom: 1rem;
      background: linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%);
      border: 1px solid #F87171;
      color: #991B1B;
    }

    .error-banner.error-banner-dark {
      background: linear-gradient(135deg, #450A0A 0%, #7F1D1D 100%);
      border-color: #DC2626;
      color: #FCA5A5;
    }

    .error-banner-content {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .error-banner-content > .material-icons {
      font-size: 1.5rem;
    }

    .error-banner-text {
      flex: 1;
    }

    .error-title {
      font-weight: 600;
      margin: 0;
    }

    .error-message {
      font-size: 0.875rem;
      opacity: 0.8;
      margin: 0;
    }

    .retry-btn {
      display: flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.5rem 1rem;
      background: rgba(255, 255, 255, 0.2);
      border: 1px solid currentColor;
      border-radius: 0.5rem;
      font-weight: 600;
      font-size: 0.8rem;
      cursor: pointer;
      transition: all 0.2s;
      color: inherit;
    }

    .retry-btn .material-icons {
      font-size: 1rem;
    }

    .retry-btn:hover {
      background: rgba(255, 255, 255, 0.3);
    }

    /* Filters card */
    .filters-card {
      background: #ffffff;
      border-radius: 0.75rem;
      border: 1px solid rgba(15, 23, 42, 0.08);
      padding: 1rem 1.25rem;
      margin-bottom: 1rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }

    .filters-card.filters-card-dark {
      background: #1a1a1a;
      border-color: rgba(255, 255, 255, 0.1);
    }

    .filters-row {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-end;
      gap: 1rem;
    }

    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }

    .filters-row > .btn-secondary {
      margin-left: auto;
    }

    /* Advanced filters */
    .advanced-filters {
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid #e5e7eb;
    }

    .advanced-filters.advanced-filters-dark {
      border-top-color: #374151;
    }

    .advanced-filters-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
    }

    .advanced-filters-actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
      margin-top: 1rem;
    }

    /* Operations list */
    .operations-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .card, .card-dark {
      background: #ffffff;
      border-radius: 0.75rem;
      border: 1px solid rgba(15, 23, 42, 0.08);
      padding: 1.25rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .card-dark {
      background: #1a1a1a;
      border-color: rgba(255, 255, 255, 0.1);
    }

    .card-hover:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .card-dark.card-hover:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }

    /* Form elements */
    .form-label {
      display: block;
      font-size: 0.75rem;
      font-weight: 600;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.025em;
    }

    .form-label.form-label-dark {
      color: #9ca3af;
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

    .form-select.form-select-dark {
      background: #262626;
      border-color: #374151;
      color: #e5e7eb;
    }

    .form-select.form-select-dark option {
      background: #262626;
      color: #e5e7eb;
    }

    .form-input {
      width: 100%;
      padding: 0.5rem 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      font-size: 0.875rem;
      background: white;
      color: #374151;
    }

    .form-input:focus {
      outline: none;
      border-color: #CF102D;
      box-shadow: 0 0 0 2px rgba(207, 16, 45, 0.1);
    }

    .form-input.form-input-dark {
      background: #262626;
      border-color: #374151;
      color: #e5e7eb;
    }

    /* Buttons */
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

    .btn-nuevo .material-icons {
      font-size: 1.25rem;
    }

    .btn-nuevo:hover {
      background: #a80d25;
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(207, 16, 45, 0.4);
    }

    .btn-nuevo.btn-small {
      padding: 0.5rem 1rem;
    }

    .btn-secondary-header {
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

    .btn-secondary-header .material-icons {
      font-size: 1.25rem;
    }

    .btn-secondary-header:hover {
      background: #f3f4f6;
      transform: translateY(-2px);
    }

    .btn-secondary-header.btn-secondary-header-dark {
      background: #262626;
      color: #e5e7eb;
      border-color: #374151;
    }

    .btn-secondary-header.btn-secondary-header-dark:hover {
      background: #333333;
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

    .btn-secondary .material-icons {
      font-size: 1.125rem;
    }

    .btn-secondary:hover {
      background: #e5e7eb;
    }

    .btn-secondary.btn-secondary-dark {
      background: #262626;
      color: #e5e7eb;
      border-color: #374151;
    }

    .btn-secondary.btn-secondary-dark:hover {
      background: #333333;
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

    .icon-circle .material-icons {
      font-size: 1.5rem;
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

    .btn-outline.btn-outline-dark {
      color: #e5e7eb;
      border-color: #374151;
    }

    .btn-outline.btn-outline-dark:hover {
      background: #262626;
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

    .btn-transito .material-icons {
      font-size: 1rem;
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

    .btn-completar .material-icons {
      font-size: 1rem;
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

    .btn-secondary-small .material-icons {
      font-size: 0.875rem;
    }

    .btn-secondary-small:hover:not(:disabled) {
      background: #e5e7eb;
    }

    .btn-secondary-small:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-secondary-small.btn-secondary-small-dark {
      background: #262626;
      color: #9ca3af;
      border-color: #374151;
    }

    .btn-secondary-small.btn-secondary-small-dark:hover:not(:disabled) {
      background: #333333;
    }

    /* Loading and empty states */
    .loading-cards {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .loading-card {
      height: 8rem;
      background: #e5e7eb;
      border-radius: 0.75rem;
      animation: pulse 1.5s infinite;
    }

    .loading-card.loading-card-dark {
      background: #262626;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    .empty-state {
      background: #ffffff;
      border-radius: 0.75rem;
      border: 1px solid rgba(15, 23, 42, 0.08);
      padding: 3rem;
      text-align: center;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }

    .empty-state.empty-state-dark {
      background: #1a1a1a;
      border-color: rgba(255, 255, 255, 0.1);
    }

    .empty-state .material-icons {
      font-size: 3rem;
      color: #d1d5db;
      margin-bottom: 0.5rem;
    }

    .empty-state-dark .material-icons {
      color: #4b5563;
    }

    .empty-state p {
      color: #6b7280;
      margin: 0;
    }

    .empty-state-dark p {
      color: #9ca3af;
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }
      .advanced-filters-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 640px) {
      .fixed-header {
        padding: 1rem;
      }
      .scrollable-content {
        padding: 0 0.75rem 1rem 0.75rem;
      }
      .header-row {
        flex-direction: column;
        align-items: flex-start;
      }
      .header-actions {
        width: 100%;
        justify-content: flex-end;
      }
      .stats-grid {
        grid-template-columns: 1fr 1fr;
      }
      .advanced-filters-grid {
        grid-template-columns: 1fr;
      }
    }

    /* Touch-specific improvements */
    @media (pointer: coarse) {
      .scrollable-content {
        -webkit-overflow-scrolling: touch;
        overscroll-behavior: contain;
      }
      .card, .card-dark {
        touch-action: pan-y;
      }
      .btn-outline, .btn-outline-dark,
      .btn-transito, .btn-completar {
        min-height: 44px;
        touch-action: manipulation;
      }
    }

    /* Modal styles */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      backdrop-filter: blur(4px);
    }

    .modal-content {
      border-radius: 16px;
      width: calc(100% - 2rem);
      max-width: 600px;
      max-height: 90vh;
      overflow-y: auto;
      margin: 1rem;
    }

    .modal-light {
      background: white;
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
    }

    .modal-dark {
      background: #1a1a1a;
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 1.5rem;
      border-bottom: 1px solid;
    }

    .btn-close {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: none;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-close-light {
      background: #f3f4f6;
      color: #374151;
    }

    .btn-close-light:hover {
      background: #e5e7eb;
    }

    .btn-close-dark {
      background: #262626;
      color: #9ca3af;
    }

    .btn-close-dark:hover {
      background: #333333;
    }

    .form-group {
      padding: 0 1.5rem;
      margin-bottom: 1rem;
    }

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
      padding: 1rem 1.5rem;
      margin-top: 0.5rem;
      border-top: 1px solid;
    }

    .btn-cancel {
      padding: 0.5rem 1rem;
      background: #f3f4f6;
      color: #374151;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-cancel:hover {
      background: #e5e7eb;
    }

    .btn-cancel-dark {
      padding: 0.5rem 1rem;
      background: #262626;
      color: #d1d5db;
      border: 1px solid #374151;
      border-radius: 8px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-cancel-dark:hover {
      background: #333333;
    }

    /* Tipo buttons */
    .tipo-btn {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.75rem;
      background: #f3f4f6;
      color: #6b7280;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      font-weight: 500;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .tipo-btn:hover {
      border-color: #CF102D;
      color: #CF102D;
    }

    .tipo-btn-active {
      background: rgba(207, 16, 45, 0.1);
      border-color: #CF102D;
      color: #CF102D;
    }

    .tipo-btn-dark {
      background: #262626;
      color: #9ca3af;
      border-color: #374151;
    }

    .tipo-btn-dark:hover {
      border-color: #CF102D;
      color: #CF102D;
    }

    /* ================================================
       MODAL RESPONSIVE - Mobile Optimization (iPhone 16)
       ================================================ */

    @media (max-width: 768px) {
      .modal-overlay {
        padding: 0.5rem;
      }

      .modal-content {
        max-width: calc(100vw - 1rem);
        margin: 0.5rem;
      }

      .modal-header {
        padding: 0.875rem 1rem;
      }

      .form-group {
        padding: 0 1rem;
        margin-bottom: 0.75rem;
      }

      .modal-actions {
        padding: 0.875rem 1rem;
      }

      /* Stack grid columns */
      .grid-cols-2,
      .grid-cols-3 {
        display: flex !important;
        flex-direction: column !important;
        gap: 0.75rem !important;
      }

      .col-span-2 {
        grid-column: auto !important;
      }
    }

    @media (max-width: 480px) {
      .modal-overlay {
        padding: 0;
        align-items: flex-end;
      }

      .modal-content {
        max-width: 100%;
        width: 100%;
        margin: 0;
        border-radius: 16px 16px 0 0;
        max-height: calc(100vh - 2rem);
        -webkit-overflow-scrolling: touch;
      }

      .modal-header {
        padding: 0.75rem 1rem;
        position: sticky;
        top: 0;
        z-index: 10;
      }

      .modal-header h2 {
        font-size: 1rem;
      }

      .btn-close {
        width: 36px;
        height: 36px;
        min-width: 44px;
        min-height: 44px;
      }

      .form-group {
        padding: 0 0.875rem;
        margin-bottom: 0.625rem;
      }

      /* Stack tipo buttons vertically */
      .form-group .flex.gap-2 {
        flex-direction: column !important;
      }

      .tipo-btn {
        width: 100%;
        min-height: 44px;
      }

      .form-input,
      .form-select {
        font-size: 16px; /* Prevents iOS zoom */
        min-height: 44px;
        padding: 0.625rem 0.75rem;
      }

      .modal-actions {
        padding: 0.75rem 0.875rem;
        flex-direction: column;
        gap: 0.5rem;
        position: sticky;
        bottom: 0;
        z-index: 10;
      }

      .modal-actions button {
        width: 100%;
        min-height: 44px;
        justify-content: center;
      }

      .btn-nuevo {
        order: -1; /* Primary action first */
      }

      .btn-cancel,
      .btn-cancel-dark {
        order: 0;
      }
    }

    /* iPhone 16 Pro specific (390px) */
    @media (max-width: 390px) {
      .modal-header {
        padding: 0.625rem 0.75rem;
      }

      .modal-header h2 {
        font-size: 0.9375rem;
      }

      .form-group {
        padding: 0 0.75rem;
        margin-bottom: 0.5rem;
      }

      .form-label,
      .form-label-dark {
        font-size: 0.65rem;
      }

      .modal-actions {
        padding: 0.625rem 0.75rem;
      }
    }

    /* Touch devices modal */
    @media (pointer: coarse) {
      .modal-content {
        touch-action: pan-y;
        -webkit-overflow-scrolling: touch;
      }

      .tipo-btn,
      .form-input,
      .form-select,
      .btn-cancel,
      .btn-cancel-dark,
      .btn-nuevo,
      .btn-close {
        min-height: 44px;
      }
    }

    /* Safe area support for iPhone */
    @supports (padding: env(safe-area-inset-bottom)) {
      @media (max-width: 480px) {
        .modal-actions {
          padding-bottom: calc(0.75rem + env(safe-area-inset-bottom));
        }
      }
    }
  `]
})
export class LogisticaComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  private logisticaService = inject(LogisticaService);
  private themeService = inject(ThemeService);
  private route = inject(ActivatedRoute);

  isDark = this.themeService.isDark;

  stats: LogisticaStatDto | null = null;
  operaciones: OperacionLogisticaDto[] = [];
  loading = true;
  procesando = false;
  backendError: string | null = null;

  tipoFiltros = TIPO_FILTROS;
  estadoFiltros = ESTADOS_FILTROS;
  estadoLabels = ESTADO_LABELS;
  selectedTipo = TIPO_FILTROS[0];
  selectedEstado = ESTADOS_FILTROS[0];

  // Modal state
  showModal = signal(false);
  guardando = false;
  formData: Partial<CrearOperacionDto> = this.getEmptyForm();

  // Filtros avanzados
  showFiltrosAvanzados = signal(false);
  filtroFechaDesde = '';
  filtroFechaHasta = '';
  filtroProduccion = '';
  filtroLugar = '';

  ngOnInit(): void {
    this.loadData();

    // Check if openModal query param is set
    this.route.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params => {
      if (params['openModal'] === 'true') {
        this.openModal();
      }
    });
  }

  private loadData(): void {
    this.loading = true;
    this.backendError = null;

    this.logisticaService.obtenerResumen()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: stats => (this.stats = stats),
        error: (err) => {
          this.backendError = err.message || 'Error al conectar con el servidor';
        }
      });

    this.logisticaService.operacionesRecientes()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: operaciones => {
          this.operaciones = operaciones;
          this.loading = false;
          this.backendError = null;
        },
        error: (err) => {
          this.loading = false;
          this.backendError = err.message || 'No se puede conectar con el servidor. Verifique que el backend está en ejecución.';
        }
      });
  }

  retryConnection(): void {
    this.loadData();
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

  // Modal methods
  getEmptyForm(): Partial<CrearOperacionDto> {
    const today = new Date().toISOString().split('T')[0];
    return {
      tipoMovimiento: 'ENTRADA',
      produccionNombre: '',
      lugarOrigen: '',
      lugarDestino: '',
      fecha: today,
      horaInicio: '09:00',
      horaFin: '18:00',
      numCamiones: 1,
      descripcion: ''
    };
  }

  openModal(): void {
    this.formData = this.getEmptyForm();
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.formData = this.getEmptyForm();
  }

  guardarMovimiento(): void {
    if (!this.formData.produccionNombre || !this.formData.lugarOrigen || !this.formData.lugarDestino) {
      return;
    }

    this.guardando = true;
    const operacion = this.formData as CrearOperacionDto;

    this.logisticaService.crear(operacion)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (created) => {
          this.operaciones = [created, ...this.operaciones];
          this.refreshStats();
          this.guardando = false;
          this.closeModal();
        },
        error: (err) => {
          console.error('Error al crear movimiento:', err);
          this.guardando = false;
          this.backendError = err.message || 'Error al crear la operación. Verifique la conexión con el servidor.';
          this.closeModal();
        }
      });
  }

  // Filtros avanzados
  toggleFiltrosAvanzados(): void {
    this.showFiltrosAvanzados.set(!this.showFiltrosAvanzados());
  }

  limpiarFiltros(): void {
    this.filtroFechaDesde = '';
    this.filtroFechaHasta = '';
    this.filtroProduccion = '';
    this.filtroLugar = '';
    this.selectedTipo = 'Todos';
    this.selectedEstado = 'Todos';
  }

  aplicarFiltros(): void {
    // Los filtros ya se aplican en operacionesFiltradas()
    // Este método podría usarse para búsquedas en servidor si fuera necesario
  }

  operacionesFiltradas(): OperacionLogisticaDto[] {
    return this.operaciones.filter(op => {
      const tipoMatch = this.selectedTipo === 'Todos' || (op.tipo ?? 'Otros') === this.selectedTipo;
      const estadoMatch = this.selectedEstado === 'Todos' || op.estado === this.selectedEstado;

      // Filtros avanzados
      let fechaMatch = true;
      if (this.filtroFechaDesde && op.fecha < this.filtroFechaDesde) {
        fechaMatch = false;
      }
      if (this.filtroFechaHasta && op.fecha > this.filtroFechaHasta) {
        fechaMatch = false;
      }

      const produccionMatch = !this.filtroProduccion ||
        (op.produccionNombre?.toLowerCase().includes(this.filtroProduccion.toLowerCase()) ||
         op.nombre?.toLowerCase().includes(this.filtroProduccion.toLowerCase()));

      const lugarMatch = !this.filtroLugar ||
        op.desde?.toLowerCase().includes(this.filtroLugar.toLowerCase()) ||
        op.hacia?.toLowerCase().includes(this.filtroLugar.toLowerCase());

      return tipoMatch && estadoMatch && fechaMatch && produccionMatch && lugarMatch;
    });
  }
}
