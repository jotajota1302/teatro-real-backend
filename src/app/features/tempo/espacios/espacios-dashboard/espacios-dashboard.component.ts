import { Component, signal, inject, DestroyRef, computed } from '@angular/core';
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
    }

    .page {
      padding: 2rem;
      min-height: 100vh;
      transition: background-color 0.3s;
    }

    .page-light { background: #f2f4f7; }
    .page-dark { background: transparent; }

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
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      backdrop-filter: blur(4px);
      overflow: hidden;
      isolation: isolate;
    }

    .modal-content {
      background: white;
      border-radius: 16px;
      padding: 1.5rem;
      width: calc(100% - 2rem);
      max-width: 560px;
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
      margin: 1rem;
      overflow: visible;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid #e5e7eb;
    }

    .modal-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: #1f2937;
    }

    .btn-close {
      width: 32px;
      height: 32px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f3f4f6;
      border: none;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-close:hover { background: #e5e7eb; }

    .form-group { margin-bottom: 0.875rem; }

    .form-label {
      display: block;
      font-size: 0.75rem;
      font-weight: 600;
      color: #6b7280;
      margin-bottom: 0.35rem;
      text-transform: uppercase;
      letter-spacing: 0.025em;
    }

    .form-input {
      width: 100%;
      padding: 0.5rem 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-size: 0.875rem;
      transition: all 0.2s;
    }

    .form-input:focus {
      outline: none;
      border-color: #CF102D;
      box-shadow: 0 0 0 2px rgba(207, 16, 45, 0.1);
    }

    .form-select {
      width: 100%;
      padding: 0.5rem 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-size: 0.875rem;
      background: white;
      cursor: pointer;
    }

    .form-select:focus {
      outline: none;
      border-color: #CF102D;
      box-shadow: 0 0 0 2px rgba(207, 16, 45, 0.1);
    }

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

    .form-checkbox label {
      font-size: 0.875rem;
      color: #374151;
    }

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid #e5e7eb;
    }

    .btn-cancel {
      padding: 0.5rem 1rem;
      background: #f3f4f6;
      color: #374151;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-weight: 500;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-cancel:hover { background: #e5e7eb; }

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
      background: white;
      color: #dc2626;
      border: 1px solid #dc2626;
      border-radius: 6px;
      font-weight: 500;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s;
      margin-right: auto;
    }

    .btn-delete:hover {
      background: #dc2626;
      color: white;
    }

    .color-preview {
      width: 32px;
      height: 32px;
      border-radius: 6px;
      border: 1px solid #e5e7eb;
      cursor: pointer;
    }
  `],
  template: `
    <div class="page" [class]="isDark() ? 'page-dark' : 'page-light'">
      <div class="space-y-6">
        <!-- Header -->
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
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
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
        <div class="filters flex flex-wrap gap-3 pt-2">
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

        <!-- Content -->
        <ng-container *ngIf="!loading(); else loadingTemplate">
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
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2 class="modal-title">{{ editingEspacio() ? 'Editar Espacio' : 'Nuevo Espacio' }}</h2>
          <button class="btn-close" (click)="closeModal()">
            <span class="material-icons text-lg">close</span>
          </button>
        </div>

        <form (ngSubmit)="saveEspacio()">
          <!-- Fila 1: Nombre -->
          <div class="form-group">
            <label class="form-label">Nombre *</label>
            <input type="text" class="form-input" [(ngModel)]="formData.nombre" name="nombre" required placeholder="Ej: Sala Principal">
          </div>

          <!-- Fila 2: Tipo y Categoría -->
          <div class="grid grid-cols-2 gap-3">
            <div class="form-group">
              <label class="form-label">Tipo *</label>
              <select class="form-select" [(ngModel)]="formData.tipo" name="tipo" required>
                <option value="">Seleccionar...</option>
                <option value="Escenario">Escenario</option>
                <option value="Sala de ensayos">Sala de ensayos</option>
                <option value="Reuniones">Reuniones</option>
                <option value="Conferencias">Conferencias</option>
                <option value="Taller">Taller</option>
                <option value="Almacén">Almacén</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Categoría *</label>
              <select class="form-select" [(ngModel)]="formData.categoria" name="categoria" required>
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
            <label class="form-label">Descripción</label>
            <input type="text" class="form-input" [(ngModel)]="formData.descripcion" name="descripcion" placeholder="Descripción breve del espacio">
          </div>

          <!-- Fila 4: Capacidad, Dimensiones, Icono -->
          <div class="grid grid-cols-3 gap-3">
            <div class="form-group">
              <label class="form-label">Capacidad</label>
              <input type="text" class="form-input" [(ngModel)]="formData.capacidad" name="capacidad" placeholder="200 PERS.">
            </div>
            <div class="form-group">
              <label class="form-label">Dimensiones</label>
              <input type="text" class="form-input" [(ngModel)]="formData.dimensiones" name="dimensiones" placeholder="20M X 15M">
            </div>
            <div class="form-group">
              <label class="form-label">Icono</label>
              <div class="flex items-center gap-2">
                <span class="material-icons text-xl" [style.color]="formData.accentColor">{{ formData.icon }}</span>
                <select class="form-select flex-1" [(ngModel)]="formData.icon" name="icon">
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
              <label class="form-label">Color</label>
              <div class="flex items-center gap-2">
                <input type="color" [(ngModel)]="formData.accentColor" name="accentColor" class="color-preview">
                <input type="text" class="form-input" style="width: 90px;" [(ngModel)]="formData.accentColor" name="accentColorText">
              </div>
            </div>
            <div class="form-group flex-1">
              <div class="flex items-center gap-4">
                <div class="form-checkbox">
                  <input type="checkbox" [(ngModel)]="formData.disponible" name="disponible" id="disponible">
                  <label for="disponible">Disponible</label>
                </div>
                <div class="form-checkbox">
                  <input type="checkbox" [(ngModel)]="formData.necesitaCalendario" name="necesitaCalendario" id="necesitaCalendario">
                  <label for="necesitaCalendario">Calendario</label>
                </div>
              </div>
            </div>
          </div>

          <div class="modal-actions">
            <button type="button" class="btn-delete" *ngIf="editingEspacio()" (click)="deleteEspacio()">
              Eliminar
            </button>
            <button type="button" class="btn-cancel" (click)="closeModal()">Cancelar</button>
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

  isDark = this.theme.isDark;

  espacios = signal<TempoEspacioDto[]>([]);
  groupedSections = signal<CategoryGroup[]>([]);
  loading = signal(true);
  stats = signal<DashboardStats>({ total: 0, active: 0, withCalendar: 0 });
  filters = FILTER_OPTIONS;
  selectedFilter = signal<string>('Todos');

  // Modal state
  showModal = signal(false);
  editingEspacio = signal<TempoEspacioDto | null>(null);
  formData: Partial<TempoEspacioDto> = this.getEmptyForm();

  constructor() {
    this.cargarEspacios();
  }

  getEmptyForm(): Partial<TempoEspacioDto> {
    return {
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
    this.espacioService.obtenerEspaciosResumen()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: espacios => {
          this.espacios.set(espacios);
          this.loading.set(false);
          this.actualizarEstadisticas(espacios);
          this.groupedSections.set(this.agruparPorCategoria(espacios));
        },
        error: () => {
          this.loading.set(false);
        }
      });
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
      this.formData = { ...espacio };
    } else {
      this.editingEspacio.set(null);
      this.formData = this.getEmptyForm();
    }
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

    if (this.editingEspacio()) {
      // Actualizar en la lista local (mock - en producción llamaría al API)
      const espacios = this.espacios();
      const index = espacios.findIndex(e => e.nombre === this.editingEspacio()!.nombre);
      if (index !== -1) {
        espacios[index] = espacioData;
        this.espacios.set([...espacios]);
        this.actualizarEstadisticas(espacios);
        this.groupedSections.set(this.agruparPorCategoria(espacios));
      }
    } else {
      // Añadir nuevo espacio (mock)
      const espacios = [...this.espacios(), espacioData];
      this.espacios.set(espacios);
      this.actualizarEstadisticas(espacios);
      this.groupedSections.set(this.agruparPorCategoria(espacios));
    }

    this.closeModal();
  }

  deleteEspacio(): void {
    if (!this.editingEspacio()) return;

    if (confirm('¿Estás seguro de que quieres eliminar este espacio?')) {
      const espacios = this.espacios().filter(e => e.nombre !== this.editingEspacio()!.nombre);
      this.espacios.set(espacios);
      this.actualizarEstadisticas(espacios);
      this.groupedSections.set(this.agruparPorCategoria(espacios));
      this.closeModal();
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
