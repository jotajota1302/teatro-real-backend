// teatro-real-frontend/src/app/features/tempo/logistica/logistica.component.ts

import { Component, OnInit, inject, DestroyRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
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
    <div class="page" [class]="isDark() ? 'page-dark' : 'page-light'">
      <div class="space-y-6">
        <!-- Header -->
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 class="text-3xl font-semibold" [class]="isDark() ? 'text-white' : 'text-gray-800'">Logística de Almacenes</h1>
            <p [class]="isDark() ? 'text-gray-400' : 'text-gray-500'">Gestión de recogidas y salidas de producciones</p>
          </div>
          <div class="flex gap-2">
            <a routerLink="/tempo/movimientos/calendario" [class]="isDark() ? 'btn-calendario-dark' : 'btn-calendario'">
              <span class="material-icons text-lg">calendar_month</span>
              Ver Calendario
            </a>
            <button class="btn-nuevo" (click)="openModal()">
              <span class="material-icons text-lg">add</span>
              Nuevo Movimiento
            </button>
          </div>
        </div>

        <!-- Error Banner -->
        <div *ngIf="backendError" class="error-banner" [class]="isDark() ? 'error-banner-dark' : 'error-banner-light'">
          <div class="flex items-center gap-3">
            <span class="material-icons text-2xl">cloud_off</span>
            <div class="flex-1">
              <p class="font-semibold">Servidor no disponible</p>
              <p class="text-sm opacity-80">{{ backendError }}</p>
            </div>
            <button (click)="retryConnection()" class="retry-btn">
              <span class="material-icons text-sm">refresh</span>
              Reintentar
            </button>
          </div>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4" *ngIf="!backendError">
          <article [class]="isDark() ? 'stat-card-dark' : 'stat-card'" *ngFor="let stat of statCards">
            <p class="stat-label" [class]="isDark() ? 'text-gray-400' : 'text-gray-500'">{{ stat.label }}</p>
            <p class="stat-value" [class]="isDark() ? 'text-white' : 'text-gray-800'">{{ stat.value }}</p>
          </article>
        </div>

        <!-- Filters -->
        <div [class]="isDark() ? 'card-dark' : 'card'">
          <div class="flex flex-wrap gap-4 items-end">
            <div>
              <label [class]="isDark() ? 'form-label-dark' : 'form-label'">Tipo</label>
              <select [class]="isDark() ? 'form-select-dark' : 'form-select'" #tipoSelect [value]="selectedTipo" (change)="setTipo(tipoSelect.value)">
                <option *ngFor="let option of tipoFiltros">{{ option }}</option>
              </select>
            </div>
            <div>
              <label [class]="isDark() ? 'form-label-dark' : 'form-label'">Estado</label>
              <select [class]="isDark() ? 'form-select-dark' : 'form-select'" #estadoSelect [value]="selectedEstado" (change)="setEstado(estadoSelect.value)">
                <option *ngFor="let option of estadoFiltros" [value]="option">
                  {{ option === 'Todos' ? option : getEstadoLabel(option) }}
                </option>
              </select>
            </div>
            <button [class]="isDark() ? 'btn-secondary-dark' : 'btn-secondary'" class="ml-auto" (click)="toggleFiltrosAvanzados()">
              <span class="material-icons text-sm">{{ showFiltrosAvanzados() ? 'expand_less' : 'expand_more' }}</span>
              {{ showFiltrosAvanzados() ? 'Menos filtros' : 'Más filtros' }}
            </button>
          </div>

          <!-- Filtros avanzados expandibles -->
          <div *ngIf="showFiltrosAvanzados()" class="mt-4 pt-4" [class]="isDark() ? 'border-t border-gray-700' : 'border-t border-gray-200'">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label [class]="isDark() ? 'form-label-dark' : 'form-label'">Fecha desde</label>
                <input type="date" [class]="isDark() ? 'form-input-dark' : 'form-input'" [(ngModel)]="filtroFechaDesde">
              </div>
              <div>
                <label [class]="isDark() ? 'form-label-dark' : 'form-label'">Fecha hasta</label>
                <input type="date" [class]="isDark() ? 'form-input-dark' : 'form-input'" [(ngModel)]="filtroFechaHasta">
              </div>
              <div>
                <label [class]="isDark() ? 'form-label-dark' : 'form-label'">Producción</label>
                <input type="text" [class]="isDark() ? 'form-input-dark' : 'form-input'" [(ngModel)]="filtroProduccion" placeholder="Buscar producción...">
              </div>
              <div>
                <label [class]="isDark() ? 'form-label-dark' : 'form-label'">Origen/Destino</label>
                <input type="text" [class]="isDark() ? 'form-input-dark' : 'form-input'" [(ngModel)]="filtroLugar" placeholder="Buscar lugar...">
              </div>
            </div>
            <div class="flex justify-end gap-2 mt-4">
              <button [class]="isDark() ? 'btn-secondary-dark' : 'btn-secondary'" (click)="limpiarFiltros()">
                <span class="material-icons text-sm">clear</span>
                Limpiar
              </button>
              <button class="btn-nuevo" style="padding: 0.5rem 1rem;" (click)="aplicarFiltros()">
                <span class="material-icons text-sm">search</span>
                Aplicar
              </button>
            </div>
          </div>
        </div>

        <!-- Operations List -->
        <div class="space-y-4">
          <article *ngFor="let operacion of operacionesFiltradas()" [class]="isDark() ? 'card-dark card-hover' : 'card card-hover'" class="operation-card">
            <div class="operation-layout">
              <div class="icon-circle hidden sm:flex" [style.background]="operacion.estadoColor + '20'">
                <span class="material-icons text-2xl" [style.color]="operacion.estadoColor">{{ operacion.icon }}</span>
              </div>
              <div class="operation-content">
                <div class="operation-header">
                  <h2 class="operation-title" [class]="isDark() ? 'text-white' : 'text-gray-900'">{{ operacion.nombre }}</h2>
                  <span class="badge-pill" [style.background]="operacion.estadoColor + '22'" [style.color]="operacion.estadoColor">
                    {{ operacion.estadoLabel || getEstadoLabel(operacion.estado) }}
                  </span>
                </div>
                <p class="operation-route" [class]="isDark() ? 'text-gray-300' : 'text-gray-600'">
                  {{ operacion.desde }} <span [class]="isDark() ? 'text-gray-500' : 'text-gray-400'">→</span> {{ operacion.hacia }}
                </p>
                <div class="operation-meta" [class]="isDark() ? 'text-gray-400' : 'text-gray-500'">
                  <span class="meta-item">
                    <span class="material-icons">calendar_month</span>
                    {{ operacion.fecha }} · {{ operacion.hora }}
                  </span>
                  <span class="meta-item">
                    <span class="material-icons">local_shipping</span>
                    {{ operacion.camiones }} cam.
                  </span>
                </div>
                <p class="operation-detail" [class]="isDark() ? 'text-gray-400' : 'text-gray-500'" *ngIf="operacion.detalle">{{ operacion.detalle }}</p>
              </div>
              <div class="operation-actions">
                <button [class]="isDark() ? 'btn-outline-dark' : 'btn-outline'" (click)="verDetalle(operacion); $event.stopPropagation()">
                  <span class="hidden sm:inline">Ver detalle</span>
                  <span class="sm:hidden">Ver</span>
                </button>
                <button
                  *ngIf="operacion.estado === 'PENDIENTE'"
                  class="btn-transito"
                  (click)="iniciarTransito(operacion); $event.stopPropagation()"
                  [disabled]="procesando">
                  <span class="material-icons text-sm">play_arrow</span>
                  <span class="hidden sm:inline">Iniciar</span>
                </button>
                <button
                  *ngIf="operacion.estado === 'EN_TRANSITO'"
                  class="btn-completar"
                  (click)="completarOperacion(operacion); $event.stopPropagation()"
                  [disabled]="procesando">
                  <span class="material-icons text-sm">check</span>
                </button>
                <button
                  *ngIf="operacion.estado === 'COMPLETADO'"
                  [class]="isDark() ? 'btn-secondary-small-dark' : 'btn-secondary-small'"
                  (click)="reiniciarOperacion(operacion); $event.stopPropagation()"
                  [disabled]="procesando">
                  <span class="material-icons text-sm">replay</span>
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
    }

    .page {
      padding: 1.5rem 2rem;
      min-height: 100vh;
      overflow-x: hidden;
    }

    .page-light {
      background: #f2f4f7;
    }

    .page-dark {
      background: #1a1a1a;
      border-radius: 1rem;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .card {
      background: #ffffff;
      border-radius: 1rem;
      border: 1px solid rgba(15, 23, 42, 0.08);
      padding: 1.4rem;
      box-shadow: 0 20px 35px rgba(15, 23, 42, 0.1);
      overflow: hidden;
    }

    .card-dark {
      background: #1a1a1a;
      border-radius: 1rem;
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 1.4rem;
      box-shadow: 0 20px 35px rgba(0, 0, 0, 0.3);
      overflow: hidden;
    }

    .card-hover {
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .card-hover:hover {
      transform: translateY(-3px);
      box-shadow: 0 25px 45px rgba(15, 23, 42, 0.15);
    }

    .card-dark.card-hover:hover {
      box-shadow: 0 25px 45px rgba(0, 0, 0, 0.4);
    }

    .stat-card {
      border-radius: 0.9rem;
      border: 1px solid rgba(15, 23, 42, 0.08);
      padding: 0.875rem;
      background: #ffffff;
      box-shadow: 0 15px 30px rgba(15, 23, 42, 0.08);
      overflow: hidden;
      min-width: 0;
    }

    .stat-card-dark {
      border-radius: 0.9rem;
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 0.875rem;
      background: #1a1a1a;
      box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
      overflow: hidden;
      min-width: 0;
    }

    .stat-label {
      font-size: 0.65rem;
      text-transform: uppercase;
      letter-spacing: 0.03em;
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .stat-value {
      font-size: 1.75rem;
      font-weight: 600;
      margin-top: 0.25rem;
    }

    @media (min-width: 640px) {
      .stat-card, .stat-card-dark {
        padding: 1.2rem;
      }
      .stat-label {
        font-size: 0.75rem;
      }
      .stat-value {
        font-size: 1.875rem;
      }
    }

    .error-banner {
      padding: 1rem 1.5rem;
      border-radius: 0.75rem;
      animation: slideIn 0.3s ease;
    }

    @keyframes slideIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .error-banner-light {
      background: linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%);
      border: 1px solid #F87171;
      color: #991B1B;
    }

    .error-banner-dark {
      background: linear-gradient(135deg, #450A0A 0%, #7F1D1D 100%);
      border: 1px solid #DC2626;
      color: #FCA5A5;
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

    .retry-btn:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: scale(1.02);
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

    .form-label-dark {
      display: block;
      font-size: 0.75rem;
      font-weight: 600;
      color: #9ca3af;
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

    .form-select-dark {
      padding: 0.5rem 0.75rem;
      border: 1px solid #374151;
      border-radius: 8px;
      font-size: 0.875rem;
      background: #262626;
      color: #e5e7eb;
      cursor: pointer;
      min-width: 140px;
    }

    .form-select-dark:focus {
      outline: none;
      border-color: #CF102D;
      box-shadow: 0 0 0 2px rgba(207, 16, 45, 0.2);
    }

    .form-select-dark option {
      background: #262626;
      color: #e5e7eb;
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

    .btn-calendario-dark {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      background: #262626;
      color: #e5e7eb;
      border: 1px solid #374151;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s;
      text-decoration: none;
    }

    .btn-calendario-dark:hover {
      background: #333333;
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

    .btn-secondary-dark {
      display: flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.5rem 1rem;
      background: #262626;
      color: #e5e7eb;
      border: 1px solid #374151;
      border-radius: 8px;
      font-weight: 500;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-secondary-dark:hover {
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

    .btn-outline-dark {
      padding: 0.5rem 1rem;
      background: transparent;
      color: #e5e7eb;
      border: 1px solid #374151;
      border-radius: 8px;
      font-weight: 500;
      font-size: 0.8rem;
      cursor: pointer;
      transition: all 0.2s;
      white-space: nowrap;
    }

    .btn-outline-dark:hover {
      background: #262626;
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

    .btn-secondary-small-dark {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      padding: 0.4rem 0.75rem;
      background: #262626;
      color: #9ca3af;
      border: 1px solid #374151;
      border-radius: 6px;
      font-weight: 500;
      font-size: 0.7rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-secondary-small-dark:hover:not(:disabled) {
      background: #333333;
    }

    .btn-secondary-small-dark:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    /* Form inputs */
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

    .form-input-dark {
      width: 100%;
      padding: 0.5rem 0.75rem;
      border: 1px solid #374151;
      border-radius: 8px;
      font-size: 0.875rem;
      background: #262626;
      color: #e5e7eb;
    }

    .form-input-dark:focus {
      outline: none;
      border-color: #CF102D;
      box-shadow: 0 0 0 2px rgba(207, 16, 45, 0.2);
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

    /* Operation card responsive layout */
    .operation-card {
      overflow: hidden;
    }

    .operation-layout {
      display: flex;
      gap: 1rem;
      align-items: flex-start;
    }

    .operation-content {
      flex: 1;
      min-width: 0;
      overflow: hidden;
    }

    .operation-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.25rem;
      flex-wrap: wrap;
    }

    .operation-title {
      font-size: 1rem;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 100%;
    }

    .operation-route {
      font-size: 0.875rem;
      margin-bottom: 0.5rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .operation-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      font-size: 0.75rem;
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      white-space: nowrap;
    }

    .meta-item .material-icons {
      font-size: 1rem;
    }

    .operation-detail {
      font-size: 0.75rem;
      margin-top: 0.5rem;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .operation-actions {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      flex-shrink: 0;
    }

    .operation-actions button {
      white-space: nowrap;
    }

    /* Responsive adjustments */
    @media (max-width: 640px) {
      .page {
        padding: 0.75rem;
      }

      .card, .card-dark {
        padding: 0.875rem;
      }

      .operation-layout {
        flex-direction: column;
        gap: 0.5rem;
      }

      .operation-content {
        width: 100%;
      }

      .operation-title {
        font-size: 0.9rem;
      }

      .operation-route {
        font-size: 0.8rem;
      }

      .operation-actions {
        flex-direction: row;
        flex-wrap: wrap;
        gap: 0.375rem;
        width: 100%;
        margin-top: 0.5rem;
        padding-top: 0.5rem;
        border-top: 1px solid rgba(128, 128, 128, 0.2);
      }

      .operation-actions button {
        flex: 1;
        min-width: 60px;
        justify-content: center;
        padding: 0.375rem 0.5rem !important;
        font-size: 0.7rem !important;
      }
    }
  `]
})
export class LogisticaComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  private logisticaService = inject(LogisticaService);
  private themeService = inject(ThemeService);

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
