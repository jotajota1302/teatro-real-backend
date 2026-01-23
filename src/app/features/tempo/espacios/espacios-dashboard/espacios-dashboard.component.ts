// teatro-real-frontend/src/app/features/tempo/espacios/espacios-dashboard/espacios-dashboard.component.ts

import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EspacioService, TempoEspacioDto } from '../../services/espacio.service';

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
  imports: [CommonModule],
  styles: [
    `
      :host {
        display: block;
        background: #f2f4f7;
      }

      .page {
        background: #f2f4f7;
        padding: 2rem;
        min-height: 100vh;
      }

      .card {
        background: #ffffff;
        border-radius: 1rem;
        border: 1px solid rgba(15, 23, 42, 0.08);
        padding: 1.4rem;
        box-shadow: 0 20px 35px rgba(15, 23, 42, 0.1);
        position: relative;
        min-height: 220px;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      }

      .card-hover:hover {
        transform: translateY(-5px);
        box-shadow: 0 30px 55px rgba(15, 23, 42, 0.15);
      }

      .card-grid {
        display: grid;
        gap: 1rem;
      }

      @media (min-width: 768px) {
        .card-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }

      @media (min-width: 1280px) {
        .card-grid {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }
      }

      .icon-strip {
        width: 5px;
        border-radius: 999px;
        height: calc(100% - 2.5rem);
        background: #1f2933;
        position: absolute;
        left: 1rem;
        top: 1rem;
      }

      .card-content {
        margin-left: 2.5rem;
      }

      .card-label {
        font-size: 0.7rem;
        letter-spacing: 0.3em;
        text-transform: uppercase;
        color: #6b7280;
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
        border: 1px solid rgba(15, 23, 42, 0.08);
        padding: 1.2rem;
        background: #ffffff;
        box-shadow: 0 15px 30px rgba(15, 23, 42, 0.08);
      }

      .filters button {
        min-width: 110px;
        text-transform: uppercase;
        letter-spacing: 0.03em;
      }

      .filters button:disabled {
        opacity: 0.6;
      }

      .loading-grid {
        display: grid;
        gap: 1rem;
      }

      @media (min-width: 768px) {
        .loading-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }

      @media (min-width: 1280px) {
        .loading-grid {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }
      }
    `
  ],
  template: `
    <div class="page">
      <div class="space-y-6">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 class="text-3xl font-semibold text-gray-800">Gestión de Espacios</h1>
            <p class="text-gray-500">Configuración de salas, almacenes y espacios del Teatro Real</p>
          </div>
          <button class="btn-primary px-6 py-3 flex items-center gap-2 bg-gradient-to-br from-[#EB1D37] to-[#C6002B] shadow-lg">
            <span class="material-icons text-lg">add</span>
            NUEVO ESPACIO
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <article class="stat-card">
            <p class="text-sm text-tr-gray-400 uppercase">spaces.stats.total</p>
            <p class="text-3xl font-semibold text-gray-800">{{ stats().total }}</p>
          </article>
          <article class="stat-card">
            <p class="text-sm text-tr-gray-400 uppercase">spaces.stats.active</p>
            <p class="text-3xl font-semibold text-green-600">{{ stats().active }}</p>
          </article>
          <article class="stat-card">
            <p class="text-sm text-tr-gray-400 uppercase">spaces.stats.withCalendar</p>
            <p class="text-3xl font-semibold text-blue-600">{{ stats().withCalendar }}</p>
          </article>
        </div>

        <div class="filters flex flex-wrap gap-3 pt-2">
          <button
            *ngFor="let option of filters"
            type="button"
            class="px-4 py-2 rounded-full border text-sm font-medium"
            [ngClass]="{
              'border-transparent bg-[#EB1D37] text-white shadow-lg': selectedFilter() === option,
              'border-tr-gray-400 text-gray-600 bg-white': selectedFilter() !== option
            }"
            (click)="setFilter(option)"
          >
            {{ option }}
          </button>
        </div>

        <ng-container *ngIf="!loading(); else loadingTemplate">
          <div class="space-y-8">
            <section *ngFor="let section of seccionesFiltradas()" class="space-y-4">
              <div class="flex items-center gap-2">
                <span class="material-icons text-xl" [style.color]="section.accent">{{ section.icon }}</span>
                <h2 class="text-xl font-semibold text-gray-800">{{ section.label }}</h2>
                <span class="text-xs font-semibold text-tr-gray-500 bg-tr-gray-200 px-2 py-1 rounded-full">{{ section.items.length }}</span>
              </div>
              <div class="card-grid">
                <article
                  *ngFor="let espacio of section.items"
                  class="card card-hover"
                >
                  <div class="icon-strip" [style.backgroundColor]="espacio.accentColor"></div>
                  <div class="card-content">
                    <div class="flex items-center gap-3">
                      <span class="material-icons" [style.color]="espacio.accentColor">{{ espacio.icon }}</span>
                      <span class="card-label">{{ espacio.tipo }}</span>
                      <div class="card-actions ml-auto flex gap-2">
                        <span class="material-icons text-base">edit</span>
                        <span class="material-icons text-base">settings</span>
                      </div>
                    </div>
                    <h3 class="text-lg font-semibold text-gray-900 mt-3">{{ espacio.nombre }}</h3>
                    <p class="text-sm text-tr-gray-500 mt-2 leading-relaxed">{{ espacio.descripcion }}</p>
                    <div class="card-footer">
                      <span class="badge-pill" [style.backgroundColor]="badgeBackground(espacio.disponible)">
                        {{ espacio.disponible ? 'Disponible' : 'Ocupado' }}
                      </span>
                      <span class="px-3 py-1 text-xs font-semibold bg-tr-gray-100 rounded-full">{{ espacio.capacidad }}</span>
                      <span class="px-3 py-1 text-xs font-semibold bg-tr-gray-100 rounded-full">{{ espacio.dimensiones }}</span>
                    </div>
                  </div>
                </article>
              </div>
            </section>
          </div>
        </ng-container>

        <ng-template #loadingTemplate>
          <div class="loading-grid">
            <div class="card h-48 animate-pulse bg-tr-gray-900"></div>
            <div class="card h-48 animate-pulse bg-tr-gray-900"></div>
            <div class="card h-48 animate-pulse bg-tr-gray-900"></div>
          </div>
        </ng-template>
      </div>
    </div>
  `
})
export class EspaciosDashboardComponent {
  espacios = signal<TempoEspacioDto[]>([]);
  groupedSections = signal<CategoryGroup[]>([]);
  loading = signal(true);
  stats = signal<DashboardStats>({ total: 0, active: 0, withCalendar: 0 });
  filters = FILTER_OPTIONS;
  selectedFilter = signal<string>('Todos');

  constructor(private readonly espacioService: EspacioService) {
    this.cargarEspacios();
  }

  cargarEspacios(): void {
    this.espacioService.obtenerEspaciosResumen().subscribe({
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
    return disponible ? 'rgba(59, 193, 74, 0.15)' : 'rgba(239, 108, 0, 0.15)';
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
