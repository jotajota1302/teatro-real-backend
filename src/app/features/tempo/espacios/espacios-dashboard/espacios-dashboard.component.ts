import { Component, signal, inject, DestroyRef, computed, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EspacioService, TempoEspacioDto } from '../../services/espacio.service';
import { ThemeService } from '../../../../core/services/theme.service';

const CATEGORY_METADATA: Record<string, { label: string; icon: string; accent: string }> = {
  Salas: { label: 'Salas', icon: 'house', accent: '#0D2C54' },
  Ensayo: { label: 'Ensayo', icon: 'mic', accent: '#2F9E44' },
  Talleres: { label: 'Talleres', icon: 'construction', accent: '#E58B0F' },
  Almacenes: { label: 'Almacenes', icon: 'inventory_2', accent: '#45126D' },
  Espacios: { label: 'Espacios', icon: 'location_city', accent: '#C62828' }
};

const FILTER_OPTIONS = ['Todos', ...Object.keys(CATEGORY_METADATA)];

interface CategoryGroup {
  category: string;
  label: string;
  icon: string;
  accent: string;
  items: TempoEspacioDto[];
}

interface DashboardStats {
  total: number;
  active: number;
  withCalendar: number;
}

@Component({
  selector: 'app-espacios-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styles: [`
    :host {
      display: block;
      height: 100%;
    }

    .page-container {
      display: flex;
      flex-direction: column;
      height: 100%;
      transition: background-color 0.3s;
    }

    .page-light { background: #f2f4f7; }
    .page-dark {
      background: #1a1a1a;
      border-radius: 1rem;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .fixed-header {
      flex-shrink: 0;
      padding: 1.5rem 2rem 0 2rem;
    }

    .scrollable-content {
      flex: 1;
      overflow-y: auto;
      padding: 0 2rem 2rem 2rem;
    }

    .card {
      border-radius: 1rem;
      padding: 1.4rem;
      position: relative;
      min-height: 220px;
      transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.3s;
    }

    .card-light {
      background: #ffffff;
      border: 1px solid rgba(15, 23, 42, 0.08);
      box-shadow: 0 20px 35px rgba(15, 23, 42, 0.1);
    }

    .card-dark {
      background: #1e1e2d;
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 20px 35px rgba(0, 0, 0, 0.3);
    }

    .card-hover:hover {
      transform: translateY(-5px);
    }

    .card-light.card-hover:hover {
      box-shadow: 0 30px 55px rgba(15, 23, 42, 0.15);
    }

    .card-dark.card-hover:hover {
      box-shadow: 0 30px 55px rgba(0, 0, 0, 0.4);
    }

    .card-grid {
      display: grid;
      gap: 1rem;
    }

    @media (min-width: 768px) {
      .card-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    }

    @media (min-width: 1280px) {
      .card-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
    }

    .icon-strip {
      width: 5px;
      border-radius: 999px;
      height: calc(100% - 2.5rem);
      position: absolute;
      left: 1rem;
      top: 1rem;
    }

    .card-content { margin-left: 2.5rem; }

    .card-label {
      font-size: 0.7rem;
      letter-spacing: 0.3em;
      text-transform: uppercase;
    }

    .card-footer {
      margin-top: 1.1rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .badge-pill {
      padding: 0.33rem 0.9rem;
      border-radius: 999px;
      font-weight: 600;
      font-size: 0.75rem;
      letter-spacing: 0.03em;
    }

    .stat-card {
      border-radius: 0.9rem;
      padding: 1.2rem;
      transition: background-color 0.3s;
    }

    .stat-card-light {
      border: 1px solid rgba(15, 23, 42, 0.08);
      background: #ffffff;
      box-shadow: 0 15px 30px rgba(15, 23, 42, 0.08);
    }

    .stat-card-dark {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: #1e1e2d;
      box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
    }

    .error-banner {
      margin: 0 2rem 1rem 2rem;
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

    .filters button {
      min-width: 110px;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }

    .btn-edit {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-edit-light {
      background: #f3f4f6;
      border: 1px solid #e5e7eb;
      color: #374151;
    }

    .btn-edit-dark {
      background: #2d2d3d;
      border: 1px solid #3d3d4d;
      color: #9ca3af;
    }

    .btn-edit:hover {
      background: #CF102D;
      border-color: #CF102D;
      color: white;
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

    /* Text colors */
    .text-title-light { color: #1f2937; }
    .text-title-dark { color: #ffffff; }
    .text-subtitle-light { color: #6b7280; }
    .text-subtitle-dark { color: #9ca3af; }
    .text-muted-light { color: #6b7280; }
    .text-muted-dark { color: #6b7280; }

    /* Filter buttons dark mode */
    .filter-btn-inactive-dark {
      border-color: #3d3d4d;
      color: #9ca3af;
      background: #1e1e2d;
    }

    .filter-btn-inactive-dark:hover {
      background: #2d2d3d;
    }

    /* Badge backgrounds */
    .badge-bg-light { background: #f3f4f6; color: #4b5563; }
    .badge-bg-dark { background: #2d2d3d; color: #9ca3af; }

    /* Section count badge */
    .section-count-light { background: #e5e7eb; color: #6b7280; }
    .section-count-dark { background: #2d2d3d; color: #9ca3af; }

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
      overflow: hidden;
      isolation: isolate;
    }

    .modal-content {
      border-radius: 16px;
      padding: 1.5rem;
      width: calc(100% - 2rem);
      max-width: 560px;
      margin: 1rem;
      overflow: visible;
      transition: background-color 0.3s, box-shadow 0.3s;
    }

    .modal-light {
      background: white;
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
    }

    .modal-dark {
      background: #1e1e2d;
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      padding-bottom: 0.75rem;
    }

    .modal-header-light { border-bottom: 1px solid #e5e7eb; }
    .modal-header-dark { border-bottom: 1px solid #3d3d4d; }

    .modal-title {
      font-size: 1.125rem;
      font-weight: 600;
    }

    .modal-title-light { color: #1f2937; }
    .modal-title-dark { color: #ffffff; }

    .btn-close {
      width: 32px;
      height: 32px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: none;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-close-light { background: #f3f4f6; color: #374151; }
    .btn-close-light:hover { background: #e5e7eb; }
    .btn-close-dark { background: #2d2d3d; color: #9ca3af; }
    .btn-close-dark:hover { background: #3d3d4d; }

    .form-group { margin-bottom: 0.875rem; }

    .form-label {
      display: block;
      font-size: 0.75rem;
      font-weight: 600;
      margin-bottom: 0.35rem;
      text-transform: uppercase;
      letter-spacing: 0.025em;
    }

    .form-label-light { color: #6b7280; }
    .form-label-dark { color: #9ca3af; }

    .form-input, .form-select {
      width: 100%;
      padding: 0.5rem 0.75rem;
      border-radius: 6px;
      font-size: 0.875rem;
      transition: all 0.2s;
    }

    .form-input-light, .form-select-light {
      background: white;
      border: 1px solid #d1d5db;
      color: #1f2937;
    }

    .form-input-dark, .form-select-dark {
      background: #2d2d3d;
      border: 1px solid #3d3d4d;
      color: #ffffff;
    }

    .form-input:focus, .form-select:focus {
      outline: none;
      border-color: #CF102D;
      box-shadow: 0 0 0 2px rgba(207, 16, 45, 0.2);
    }

    .form-select { cursor: pointer; }

    .form-checkbox {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .form-checkbox input {
      width: 16px;
      height: 16px;
      accent-color: #CF102D;
    }

    .form-checkbox label { font-size: 0.875rem; }
    .form-checkbox-light label { color: #374151; }
    .form-checkbox-dark label { color: #d1d5db; }

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
      margin-top: 1rem;
      padding-top: 1rem;
    }

    .modal-actions-light { border-top: 1px solid #e5e7eb; }
    .modal-actions-dark { border-top: 1px solid #3d3d4d; }

    .btn-cancel {
      padding: 0.5rem 1rem;
      border-radius: 6px;
      font-weight: 500;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-cancel-light {
      background: #f3f4f6;
      color: #374151;
      border: 1px solid #d1d5db;
    }
    .btn-cancel-light:hover { background: #e5e7eb; }

    .btn-cancel-dark {
      background: #2d2d3d;
      color: #d1d5db;
      border: 1px solid #3d3d4d;
    }
    .btn-cancel-dark:hover { background: #3d3d4d; }

    .btn-save {
      padding: 0.5rem 1rem;
      background: #CF102D;
      color: white;
      border: none;
      border-radius: 6px;
      font-weight: 600;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-save:hover { background: #a80d25; }

    .btn-delete {
      padding: 0.5rem 1rem;
      border: 1px solid #dc2626;
      border-radius: 6px;
      font-weight: 500;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s;
      margin-right: auto;
    }

    .btn-delete-light { background: white; color: #dc2626; }
    .btn-delete-dark { background: transparent; color: #f87171; border-color: #f87171; }
    .btn-delete:hover { background: #dc2626; color: white; border-color: #dc2626; }

    .color-preview {
      width: 32px;
      height: 32px;
      border-radius: 6px;
      cursor: pointer;
    }

    .color-preview-light { border: 1px solid #e5e7eb; }
    .color-preview-dark { border: 1px solid #3d3d4d; }
  `],
  template: `
    <div class="page-container" [class]="isDark() ? 'page-dark' : 'page-light'">
      <!-- Zona fija: Header + Stats + Filters -->
      <div class="fixed-header">
        <!-- Header -->
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h1 class="text-3xl font-semibold" [class]="isDark() ? 'text-title-dark' : 'text-title-light'">Gestión de Espacios</h1>
            <p [class]="isDark() ? 'text-subtitle-dark' : 'text-subtitle-light'">Configuración de salas, almacenes y espacios del Teatro Real</p>
          </div>
          <button class="btn-nuevo" (click)="openModal()">
            <span class="material-icons text-lg">add</span>
            Nuevo Espacio
          </button>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <article class="stat-card" [class]="isDark() ? 'stat-card-dark' : 'stat-card-light'">
            <p class="text-sm uppercase tracking-wide" [class]="isDark() ? 'text-subtitle-dark' : 'text-subtitle-light'">Total Espacios</p>
            <p class="text-3xl font-semibold mt-1" [class]="isDark() ? 'text-title-dark' : 'text-title-light'">{{ stats().total }}</p>
          </article>
          <article class="stat-card" [class]="isDark() ? 'stat-card-dark' : 'stat-card-light'">
            <p class="text-sm uppercase tracking-wide" [class]="isDark() ? 'text-subtitle-dark' : 'text-subtitle-light'">Disponibles</p>
            <p class="text-3xl font-semibold text-green-500 mt-1">{{ stats().active }}</p>
          </article>
          <article class="stat-card" [class]="isDark() ? 'stat-card-dark' : 'stat-card-light'">
            <p class="text-sm uppercase tracking-wide" [class]="isDark() ? 'text-subtitle-dark' : 'text-subtitle-light'">Con Calendario</p>
            <p class="text-3xl font-semibold text-blue-500 mt-1">{{ stats().withCalendar }}</p>
          </article>
        </div>

        <!-- Filters -->
        <div class="filters flex flex-wrap gap-3 pb-4">
          <button
            *ngFor="let option of filters"
            type="button"
            class="px-4 py-2 rounded-full border text-sm font-medium transition-all"
            [ngClass]="{
              'border-transparent bg-[#CF102D] text-white shadow-lg': selectedFilter() === option,
              'border-gray-300 text-gray-600 bg-white hover:bg-gray-50': selectedFilter() !== option && !isDark(),
              'filter-btn-inactive-dark': selectedFilter() !== option && isDark()
            }"
            (click)="setFilter(option)"
          >
            {{ option }}
          </button>
        </div>
      </div>

      <!-- Error Banner -->
      @if (backendError()) {
        <div class="error-banner" [class]="isDark() ? 'error-banner-dark' : 'error-banner-light'">
          <div class="flex items-center gap-3">
            <span class="material-icons text-2xl">cloud_off</span>
            <div class="flex-1">
              <p class="font-semibold">Servidor no disponible</p>
              <p class="text-sm opacity-80">{{ backendError() }}</p>
            </div>
            <button (click)="retryConnection()" class="retry-btn">
              <span class="material-icons text-sm">refresh</span>
              Reintentar
            </button>
          </div>
        </div>
      }

      <!-- Zona scrollable: Solo las tarjetas -->
      <div class="scrollable-content">
        <ng-container *ngIf="!loading() && !backendError(); else loadingTemplate">
          <div class="space-y-8">
            <section *ngFor="let section of seccionesFiltradas()" class="space-y-4">
              <div class="flex items-center gap-2">
                <span class="material-icons text-xl" [style.color]="section.accent">{{ section.icon }}</span>
                <h2 class="text-xl font-semibold" [class]="isDark() ? 'text-title-dark' : 'text-title-light'">{{ section.label }}</h2>
                <span class="text-xs font-semibold px-2 py-1 rounded-full" [class]="isDark() ? 'section-count-dark' : 'section-count-light'">{{ section.items.length }}</span>
              </div>
              <div class="card-grid">
                <article
                  *ngFor="let espacio of section.items"
                  class="card card-hover"
                  [class]="isDark() ? 'card-dark' : 'card-light'"
                >
                  <div class="icon-strip" [style.backgroundColor]="espacio.accentColor"></div>
                  <div class="card-content">
                    <div class="flex items-center gap-3">
                      <span class="material-icons" [style.color]="espacio.accentColor">{{ espacio.icon }}</span>
                      <span class="card-label" [class]="isDark() ? 'text-muted-dark' : 'text-muted-light'">{{ espacio.tipo }}</span>
                      <div class="ml-auto">
                        <button class="btn-edit" [class]="isDark() ? 'btn-edit-dark' : 'btn-edit-light'" (click)="openModal(espacio)" title="Editar espacio">
                          <span class="material-icons text-base">edit</span>
                        </button>
                      </div>
                    </div>
                    <h3 class="text-lg font-semibold mt-3" [class]="isDark() ? 'text-title-dark' : 'text-gray-900'">{{ espacio.nombre }}</h3>
                    <p class="text-sm mt-2 leading-relaxed" [class]="isDark() ? 'text-subtitle-dark' : 'text-gray-500'">{{ espacio.descripcion }}</p>
                    <div class="card-footer">
                      <span class="badge-pill" [style.backgroundColor]="badgeBackground(espacio.disponible)" [style.color]="espacio.disponible ? '#22c55e' : '#f97316'">
                        {{ espacio.disponible ? 'Disponible' : 'Ocupado' }}
                      </span>
                      <span class="px-3 py-1 text-xs font-semibold rounded-full" [class]="isDark() ? 'badge-bg-dark' : 'badge-bg-light'">{{ espacio.capacidad }}</span>
                      <span class="px-3 py-1 text-xs font-semibold rounded-full" [class]="isDark() ? 'badge-bg-dark' : 'badge-bg-light'">{{ espacio.dimensiones }}</span>
                    </div>
                  </div>
                </article>
              </div>
            </section>
          </div>
        </ng-container>

        <ng-template #loadingTemplate>
          <div class="card-grid">
            <div class="card h-48 animate-pulse" [class]="isDark() ? 'bg-gray-700' : 'bg-gray-200'"></div>
            <div class="card h-48 animate-pulse" [class]="isDark() ? 'bg-gray-700' : 'bg-gray-200'"></div>
            <div class="card h-48 animate-pulse" [class]="isDark() ? 'bg-gray-700' : 'bg-gray-200'"></div>
          </div>
        </ng-template>
      </div>
    </div>

    <!-- Modal de edición/creación -->
    <div class="modal-overlay" *ngIf="showModal()" (click)="closeModal()">
      <div class="modal-content" [class]="isDark() ? 'modal-dark' : 'modal-light'" (click)="$event.stopPropagation()">
        <div class="modal-header" [class]="isDark() ? 'modal-header-dark' : 'modal-header-light'">
          <h2 class="modal-title" [class]="isDark() ? 'modal-title-dark' : 'modal-title-light'">{{ editingEspacio() ? 'Editar Espacio' : 'Nuevo Espacio' }}</h2>
          <button class="btn-close" [class]="isDark() ? 'btn-close-dark' : 'btn-close-light'" (click)="closeModal()">
            <span class="material-icons text-lg">close</span>
          </button>
        </div>

        <form (ngSubmit)="saveEspacio()">
          <!-- Fila 1: Nombre -->
          <div class="form-group">
            <label class="form-label" [class]="isDark() ? 'form-label-dark' : 'form-label-light'">Nombre *</label>
            <input type="text" class="form-input" [class]="isDark() ? 'form-input-dark' : 'form-input-light'" [(ngModel)]="formData.nombre" name="nombre" required placeholder="Ej: Sala Principal">
          </div>

          <!-- Fila 2: Tipo y Categoría -->
          <div class="grid grid-cols-2 gap-3">
            <div class="form-group">
              <label class="form-label" [class]="isDark() ? 'form-label-dark' : 'form-label-light'">Tipo *</label>
              <select class="form-select" [class]="isDark() ? 'form-select-dark' : 'form-select-light'" [(ngModel)]="formData.tipo" name="tipo" required>
                <option value="">Seleccionar...</option>
                <option value="SALA">Sala</option>
                <option value="ALMACEN">Almacén</option>
                <option value="TALLER">Taller</option>
                <option value="CAMERINO">Camerino</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label" [class]="isDark() ? 'form-label-dark' : 'form-label-light'">Categoría *</label>
              <select class="form-select" [class]="isDark() ? 'form-select-dark' : 'form-select-light'" [(ngModel)]="formData.categoria" name="categoria" required>
                <option value="">Seleccionar...</option>
                <option value="Salas">Salas</option>
                <option value="Ensayo">Ensayo</option>
                <option value="Talleres">Talleres</option>
                <option value="Almacenes">Almacenes</option>
                <option value="Espacios">Espacios</option>
              </select>
            </div>
          </div>

          <!-- Fila 3: Descripción -->
          <div class="form-group">
            <label class="form-label" [class]="isDark() ? 'form-label-dark' : 'form-label-light'">Descripción</label>
            <input type="text" class="form-input" [class]="isDark() ? 'form-input-dark' : 'form-input-light'" [(ngModel)]="formData.descripcion" name="descripcion" placeholder="Descripción breve del espacio">
          </div>

          <!-- Fila 4: Capacidad, Dimensiones, Icono -->
          <div class="grid grid-cols-3 gap-3">
            <div class="form-group">
              <label class="form-label" [class]="isDark() ? 'form-label-dark' : 'form-label-light'">Capacidad</label>
              <input type="text" class="form-input" [class]="isDark() ? 'form-input-dark' : 'form-input-light'" [(ngModel)]="formData.capacidad" name="capacidad" placeholder="200 PERS.">
            </div>
            <div class="form-group">
              <label class="form-label" [class]="isDark() ? 'form-label-dark' : 'form-label-light'">Dimensiones</label>
              <input type="text" class="form-input" [class]="isDark() ? 'form-input-dark' : 'form-input-light'" [(ngModel)]="formData.dimensiones" name="dimensiones" placeholder="20M X 15M">
            </div>
            <div class="form-group">
              <label class="form-label" [class]="isDark() ? 'form-label-dark' : 'form-label-light'">Icono</label>
              <div class="flex items-center gap-2">
                <span class="material-icons text-xl" [style.color]="formData.accentColor">{{ formData.icon }}</span>
                <select class="form-select flex-1" [class]="isDark() ? 'form-select-dark' : 'form-select-light'" [(ngModel)]="formData.icon" name="icon">
                  <option value="theater_comedy">🎭 Teatro</option>
                  <option value="music_note">🎵 Música</option>
                  <option value="mic">🎤 Micrófono</option>
                  <option value="piano">🎹 Piano</option>
                  <option value="meeting_room">🚪 Sala</option>
                  <option value="groups">👥 Grupos</option>
                  <option value="warehouse">🏭 Almacén</option>
                  <option value="inventory_2">📦 Inventario</option>
                  <option value="construction">🔧 Taller</option>
                  <option value="checkroom">👔 Camerino</option>
                  <option value="stairs">🪜 Escaleras</option>
                  <option value="local_shipping">🚚 Logística</option>
                  <option value="chair">🪑 Silla</option>
                  <option value="event_seat">💺 Butaca</option>
                  <option value="lightbulb">💡 Iluminación</option>
                  <option value="speaker">🔊 Sonido</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Fila 5: Color y Checkboxes -->
          <div class="flex items-end gap-4">
            <div class="form-group" style="flex: 0 0 auto;">
              <label class="form-label" [class]="isDark() ? 'form-label-dark' : 'form-label-light'">Color</label>
              <div class="flex items-center gap-2">
                <input type="color" [(ngModel)]="formData.accentColor" name="accentColor" class="color-preview" [class]="isDark() ? 'color-preview-dark' : 'color-preview-light'">
                <input type="text" class="form-input" [class]="isDark() ? 'form-input-dark' : 'form-input-light'" style="width: 90px;" [(ngModel)]="formData.accentColor" name="accentColorText">
              </div>
            </div>
            <div class="form-group flex-1">
              <div class="flex items-center gap-4">
                <div class="form-checkbox" [class]="isDark() ? 'form-checkbox-dark' : 'form-checkbox-light'">
                  <input type="checkbox" [(ngModel)]="formData.disponible" name="disponible" id="disponible">
                  <label for="disponible">Disponible</label>
                </div>
                <div class="form-checkbox" [class]="isDark() ? 'form-checkbox-dark' : 'form-checkbox-light'">
                  <input type="checkbox" [(ngModel)]="formData.necesitaCalendario" name="necesitaCalendario" id="necesitaCalendario">
                  <label for="necesitaCalendario">Calendario</label>
                </div>
              </div>
            </div>
          </div>

          <div class="modal-actions" [class]="isDark() ? 'modal-actions-dark' : 'modal-actions-light'">
            <button type="button" class="btn-delete" [class]="isDark() ? 'btn-delete-dark' : 'btn-delete-light'" *ngIf="editingEspacio()" (click)="deleteEspacio()">
              Eliminar
            </button>
            <button type="button" class="btn-cancel" [class]="isDark() ? 'btn-cancel-dark' : 'btn-cancel-light'" (click)="closeModal()">Cancelar</button>
            <button type="submit" class="btn-save">{{ editingEspacio() ? 'Guardar' : 'Crear' }}</button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class EspaciosDashboardComponent {
  private espacioService = inject(EspacioService);
  private destroyRef = inject(DestroyRef);
  private theme = inject(ThemeService);
  private cdr = inject(ChangeDetectorRef);

  isDark = this.theme.isDark;

  espacios = signal<TempoEspacioDto[]>([]);
  groupedSections = signal<CategoryGroup[]>([]);
  loading = signal(true);
  backendError = signal<string | null>(null);
  stats = signal<DashboardStats>({ total: 0, active: 0, withCalendar: 0 });
  filters = FILTER_OPTIONS;
  selectedFilter = signal<string>('Todos');

  // Modal state
  showModal = signal(false);
  editingEspacio = signal<TempoEspacioDto | null>(null);
  formData: Partial<TempoEspacioDto> = {};

  constructor() {
    this.cargarEspacios();
  }

  getEmptyForm(): Partial<TempoEspacioDto> {
    return {
      id: undefined,
      nombre: '',
      tipo: '',
      categoria: 'Salas',
      icon: 'meeting_room',
      disponible: true,
      descripcion: '',
      capacidad: '',
      dimensiones: '',
      accentColor: '#0D2C54',
      necesitaCalendario: false
    };
  }

  cargarEspacios(): void {
    this.loading.set(true);
    this.backendError.set(null);
    this.espacioService.obtenerEspaciosResumen()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: espacios => {
          this.espacios.set(espacios);
          this.loading.set(false);
          this.backendError.set(null);
          this.actualizarEstadisticas(espacios);
          this.groupedSections.set(this.agruparPorCategoria(espacios));
        },
        error: (err) => {
          this.loading.set(false);
          this.backendError.set(err.message || 'No se puede conectar con el servidor. Verifique que el backend está en ejecución.');
        }
      });
  }

  retryConnection(): void {
    this.cargarEspacios();
  }

  badgeBackground(disponible: boolean): string {
    return disponible ? 'rgba(34, 197, 94, 0.15)' : 'rgba(249, 115, 22, 0.15)';
  }

  setFilter(option: string): void {
    this.selectedFilter.set(option);
  }

  seccionesFiltradas(): CategoryGroup[] {
    const filtro = this.selectedFilter();
    if (filtro === 'Todos') {
      return this.groupedSections();
    }
    return this.groupedSections().filter(section => section.category === filtro);
  }

  openModal(espacio?: TempoEspacioDto): void {
    if (espacio) {
      this.editingEspacio.set(espacio);
      // Crear nuevo objeto con los datos
      this.formData = {
        id: espacio.id,
        nombre: espacio.nombre || '',
        tipo: espacio.tipo || '',
        categoria: espacio.categoria || 'Salas',
        icon: espacio.icon || 'meeting_room',
        disponible: espacio.disponible ?? true,
        descripcion: espacio.descripcion || '',
        capacidad: espacio.capacidad || '',
        dimensiones: espacio.dimensiones || '',
        accentColor: espacio.accentColor || '#0D2C54',
        necesitaCalendario: espacio.necesitaCalendario ?? false
      };
    } else {
      this.editingEspacio.set(null);
      this.formData = this.getEmptyForm();
    }
    // Forzar detección de cambios y luego mostrar modal
    this.cdr.detectChanges();
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.editingEspacio.set(null);
    this.formData = this.getEmptyForm();
  }

  saveEspacio(): void {
    if (!this.formData.nombre || !this.formData.tipo) {
      return;
    }

    const espacioData = this.formData as TempoEspacioDto;
    const editing = this.editingEspacio();

    if (editing && editing.id) {
      // Actualizar via API
      this.espacioService.updateFromDto(editing.id, espacioData)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (updated) => {
            const espacios = this.espacios().map(e =>
              e.id === editing.id ? updated : e
            );
            this.espacios.set(espacios);
            this.actualizarEstadisticas(espacios);
            this.groupedSections.set(this.agruparPorCategoria(espacios));
            this.closeModal();
          },
          error: (err) => {
            console.error('Error actualizando espacio:', err);
            this.closeModal();
            this.backendError.set(err.message || 'Error al actualizar el espacio. Verifique la conexión con el servidor.');
          }
        });
    } else {
      // Crear nuevo via API
      this.espacioService.createFromDto(espacioData)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (created) => {
            const espacios = [...this.espacios(), created];
            this.espacios.set(espacios);
            this.actualizarEstadisticas(espacios);
            this.groupedSections.set(this.agruparPorCategoria(espacios));
            this.closeModal();
          },
          error: (err) => {
            console.error('Error creando espacio:', err);
            this.closeModal();
            this.backendError.set(err.message || 'Error al crear el espacio. Verifique la conexión con el servidor.');
          }
        });
    }
  }

  deleteEspacio(): void {
    const editing = this.editingEspacio();
    if (!editing) return;

    if (confirm('¿Estás seguro de que quieres eliminar este espacio?')) {
      if (editing.id) {
        // Eliminar via API
        this.espacioService.delete(editing.id)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: () => {
              const espacios = this.espacios().filter(e => e.id !== editing.id);
              this.espacios.set(espacios);
              this.actualizarEstadisticas(espacios);
              this.groupedSections.set(this.agruparPorCategoria(espacios));
              this.closeModal();
            },
            error: (err) => {
              console.error('Error eliminando espacio:', err);
              this.closeModal();
              this.backendError.set(err.message || 'Error al eliminar el espacio. Verifique la conexión con el servidor.');
            }
          });
      } else {
        // Espacio sin ID no debería existir si el backend funciona
        this.closeModal();
        this.backendError.set('No se puede eliminar un espacio que no fue guardado en el servidor.');
      }
    }
  }

  private actualizarEstadisticas(items: TempoEspacioDto[]): void {
    this.stats.set({
      total: items.length,
      active: items.filter(item => item.disponible).length,
      withCalendar: items.filter(item => item.necesitaCalendario).length
    });
  }

  private agruparPorCategoria(items: TempoEspacioDto[]): CategoryGroup[] {
    const mapa = new Map<string, TempoEspacioDto[]>();
    items.forEach(item => {
      const key = item.categoria;
      const lista = mapa.get(key) ?? [];
      lista.push(item);
      mapa.set(key, lista);
    });

    return Array.from(mapa.entries()).map(([category, content]) => {
      const metadata = CATEGORY_METADATA[category] ?? CATEGORY_METADATA['Espacios'];
      return {
        category,
        label: metadata.label,
        icon: metadata.icon,
        accent: metadata.accent,
        items: content
      };
    });
  }
}
