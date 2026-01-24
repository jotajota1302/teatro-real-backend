import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ApiService } from '../../../core/services/api.service';
import { ThemeService } from '../../../core/services/theme.service';

interface ActividadSignage {
  id: string;
  titulo: string;
  horaInicio: string;
  horaFin: string;
  tipoActividadNombre?: string;
  tipoActividadColor?: string;
}

interface SignageEntry {
  espacioId: number;
  espacioNombre: string;
  espacioColor?: string;
  actividades: ActividadSignage[];
}

@Component({
  selector: 'app-carteleria-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="page-container" [class]="isDark() ? 'page-dark' : 'page-light'">
      <!-- Fixed Header -->
      <div class="fixed-header">
          <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h1 class="text-3xl font-semibold" [class]="isDark() ? 'text-title-dark' : 'text-title-light'">Cartelería Digital</h1>
              <p [class]="isDark() ? 'text-subtitle-dark' : 'text-subtitle-light'">Pantallas de información para salas</p>
            </div>
            <a href="/carteleria/global" target="_blank" class="btn-nuevo">
              <span class="material-icons text-lg">open_in_new</span>
              Abrir Vista Global
            </a>
          </div>
        </div>

        <!-- Scrollable Grid -->
        <div class="scrollable-content">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            @for (espacio of espacios(); track espacio.espacioId) {
              <div [class]="isDark() ? 'sala-card-dark' : 'sala-card'">
                <!-- Header de la sala -->
                <div class="p-4 flex justify-between items-center"
                     [class]="isDark() ? 'border-b border-gray-700' : 'border-b border-gray-100'"
                     [style.border-left]="'4px solid ' + (espacio.espacioColor || '#CF102D')">
                  <div>
                    <h3 class="text-base font-semibold" [class]="isDark() ? 'text-white' : 'text-gray-800'">{{ espacio.espacioNombre }}</h3>
                    <span class="text-xs" [class]="isDark() ? 'text-gray-400' : 'text-gray-500'">{{ espacio.actividades.length }} actividades hoy</span>
                  </div>
                  <a [href]="'/carteleria/' + espacio.espacioId" target="_blank"
                     [class]="isDark() ? 'p-2 text-gray-500 hover:text-teatro-crimson hover:bg-gray-700 rounded-lg transition-colors' : 'p-2 text-gray-400 hover:text-teatro-crimson hover:bg-gray-50 rounded-lg transition-colors'"
                     title="Ver pantalla de sala">
                    <span class="material-icons text-xl">tv</span>
                  </a>
                </div>

                <!-- Actividades -->
                <div class="p-4 space-y-2 max-h-48 overflow-y-auto">
                  @if (espacio.actividades.length === 0) {
                    <p class="text-sm text-center py-4 italic" [class]="isDark() ? 'text-gray-500' : 'text-gray-400'">Sin actividades hoy</p>
                  } @else {
                    @for (act of espacio.actividades; track act.id) {
                      <div class="flex items-center gap-2 p-2 rounded-lg"
                           [style.background-color]="(act.tipoActividadColor || '#3b82f6') + '15'"
                           [class.ring-2]="isCurrentActivity(act)"
                           [class.ring-green-400]="isCurrentActivity(act)">
                        <span class="w-2 h-2 rounded-full flex-shrink-0"
                              [style.background-color]="act.tipoActividadColor || '#3b82f6'"></span>
                        <div class="flex-1 min-w-0">
                          <p class="text-sm font-medium truncate" [class]="isDark() ? 'text-white' : 'text-gray-800'">{{ act.titulo }}</p>
                          <p class="text-xs" [class]="isDark() ? 'text-gray-400' : 'text-gray-500'">{{ act.horaInicio }} - {{ act.horaFin }}</p>
                        </div>
                        @if (isCurrentActivity(act)) {
                          <span class="px-1.5 py-0.5 bg-green-500 text-white text-[10px] rounded font-medium">AHORA</span>
                        }
                      </div>
                    }
                  }
                </div>
              </div>
            }

            @if (espacios().length === 0 && !loading()) {
              <div class="col-span-full flex items-center justify-center py-16" [class]="isDark() ? 'text-gray-500' : 'text-gray-400'">
                <div class="text-center">
                  <span class="material-icons text-5xl mb-2">tv_off</span>
                  <p>No hay espacios configurados</p>
                </div>
              </div>
            }

            @if (loading()) {
              <div class="col-span-full flex items-center justify-center py-16">
                <div class="animate-spin w-8 h-8 border-4 border-teatro-crimson border-t-transparent rounded-full"></div>
              </div>
            }
          </div>

          <!-- Footer info -->
          <div class="mt-6 pt-4 flex justify-between items-center text-sm"
               [class]="isDark() ? 'border-t border-gray-700 text-gray-400' : 'border-t border-gray-200 text-gray-500'">
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Actualización automática cada 5 minutos
            </div>
            <div>{{ currentTime() }} · {{ formattedDate }}</div>
          </div>
        </div>
      </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
    }

    .page-container {
      display: flex;
      flex-direction: column;
      height: 100%;
      font-family: 'Montserrat', sans-serif;
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

    /* Text colors */
    .text-title-light { color: #1f2937; }
    .text-title-dark { color: #ffffff; }
    .text-subtitle-light { color: #6b7280; }
    .text-subtitle-dark { color: #9ca3af; }

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
      text-decoration: none;
    }

    .btn-nuevo:hover {
      background: #a80d25;
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(207, 16, 45, 0.4);
    }

    .sala-card {
      min-height: 200px;
      background: white;
      border-radius: 1rem;
      box-shadow: 0 20px 35px rgba(15, 23, 42, 0.1);
      border: 1px solid rgba(15, 23, 42, 0.08);
      overflow: hidden;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .sala-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 30px 55px rgba(15, 23, 42, 0.15);
    }

    .sala-card-dark {
      min-height: 200px;
      background: #1e1e2d;
      border-radius: 1rem;
      box-shadow: 0 20px 35px rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.1);
      overflow: hidden;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .sala-card-dark:hover {
      transform: translateY(-5px);
      box-shadow: 0 30px 55px rgba(0, 0, 0, 0.4);
    }
  `]
})
export class CarteleriaDashboardComponent implements OnInit, OnDestroy {
  private api = inject(ApiService);
  private themeService = inject(ThemeService);

  isDark = this.themeService.isDark;
  espacios = signal<SignageEntry[]>([]);
  loading = signal(false);
  currentTime = signal(format(new Date(), 'HH:mm'));
  currentTimeHHMM = signal(format(new Date(), 'HH:mm'));
  formattedDate = format(new Date(), "EEEE, d 'de' MMMM", { locale: es });

  private timerSub?: Subscription;
  private refreshSub?: Subscription;

  ngOnInit(): void {
    this.loadData();

    this.timerSub = interval(1000).subscribe(() => {
      const now = new Date();
      this.currentTime.set(format(now, 'HH:mm'));
      this.currentTimeHHMM.set(format(now, 'HH:mm'));
    });

    this.refreshSub = interval(300000).subscribe(() => {
      this.loadData();
    });
  }

  ngOnDestroy(): void {
    this.timerSub?.unsubscribe();
    this.refreshSub?.unsubscribe();
  }

  loadData(): void {
    this.loading.set(true);
    this.api.get<SignageEntry[]>('/api/signage/global').subscribe({
      next: (data) => {
        this.espacios.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.espacios.set([]);
      }
    });
  }

  isCurrentActivity(act: ActividadSignage): boolean {
    const now = this.currentTimeHHMM();
    return act.horaInicio <= now && act.horaFin > now;
  }
}
