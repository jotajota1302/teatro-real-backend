import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ApiService } from '../../../core/services/api.service';

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
    <div class="page flex flex-col h-full">
      <!-- Header -->
      <div class="header-section mb-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-semibold text-gray-800">Cartelería Digital</h1>
            <p class="text-sm text-gray-500 mt-1">Pantallas de información para salas</p>
          </div>
          <div class="flex gap-2">
            <a href="/carteleria/global" target="_blank"
               class="btn-primary flex items-center gap-2">
              <span class="material-icons text-lg">open_in_new</span>
              Abrir Vista Global
            </a>
          </div>
        </div>
      </div>

      <!-- Preview Grid -->
      <div class="flex-1 overflow-auto">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          @for (espacio of espacios(); track espacio.espacioId) {
            <div class="sala-card bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <!-- Header de la sala -->
              <div class="p-4 border-b border-gray-100 flex justify-between items-center"
                   [style.border-left]="'4px solid ' + (espacio.espacioColor || '#CF102D')">
                <div>
                  <h3 class="font-semibold text-gray-800">{{ espacio.espacioNombre }}</h3>
                  <span class="text-xs text-gray-500">{{ espacio.actividades.length }} actividades hoy</span>
                </div>
                <a [href]="'/carteleria/' + espacio.espacioId" target="_blank"
                   class="p-2 text-gray-400 hover:text-teatro-crimson hover:bg-gray-50 rounded-lg transition-colors"
                   title="Ver pantalla de sala">
                  <span class="material-icons text-xl">tv</span>
                </a>
              </div>

              <!-- Actividades -->
              <div class="p-4 space-y-2 max-h-48 overflow-y-auto">
                @if (espacio.actividades.length === 0) {
                  <p class="text-gray-400 text-sm text-center py-4 italic">Sin actividades hoy</p>
                } @else {
                  @for (act of espacio.actividades; track act.id) {
                    <div class="flex items-center gap-2 p-2 rounded-lg"
                         [style.background-color]="(act.tipoActividadColor || '#3b82f6') + '15'"
                         [class.ring-2]="isCurrentActivity(act)"
                         [class.ring-green-400]="isCurrentActivity(act)">
                      <span class="w-2 h-2 rounded-full flex-shrink-0"
                            [style.background-color]="act.tipoActividadColor || '#3b82f6'"></span>
                      <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-gray-800 truncate">{{ act.titulo }}</p>
                        <p class="text-xs text-gray-500">{{ act.horaInicio }} - {{ act.horaFin }}</p>
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
            <div class="col-span-full flex items-center justify-center py-16 text-gray-400">
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
      </div>

      <!-- Footer info -->
      <div class="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center text-sm text-gray-500">
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          Actualización automática cada 5 minutos
        </div>
        <div>{{ currentTime() }} · {{ formattedDate }}</div>
      </div>
    </div>
  `,
  styles: [`
    .page {
      font-family: 'Montserrat', sans-serif;
    }
    .btn-primary {
      background-color: #CF102D;
      color: white;
      padding: 0.625rem 1rem;
      border-radius: 0.5rem;
      font-weight: 500;
      font-size: 0.875rem;
      transition: background-color 0.2s;
    }
    .btn-primary:hover {
      background-color: #A00D24;
    }
    .sala-card {
      min-height: 200px;
    }
  `]
})
export class CarteleriaDashboardComponent implements OnInit, OnDestroy {
  private api = inject(ApiService);

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
