import { Component, inject, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ApiService } from '../../../core/services/api.service';

interface ActividadSignage {
  id: string;
  titulo: string;
  descripcion?: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  tipoActividadNombre?: string;
  tipoActividadColor?: string;
  departamentoNombre?: string;
  estado?: string;
}

interface SignageEntry {
  espacioId: number;
  espacioNombre: string;
  espacioColor?: string;
  actividades: ActividadSignage[];
}

@Component({
  selector: 'app-carteleria-global',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="carteleria-global h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      <!-- Header -->
      <div class="header bg-teatro-crimson/90 backdrop-blur-sm p-4 flex justify-between items-center shadow-lg">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
            <span class="text-teatro-crimson font-bold text-xl">TR</span>
          </div>
          <span class="text-2xl font-light tracking-wide">Teatro Real</span>
        </div>
        <div class="text-center">
          <div class="text-xl font-light opacity-90">{{ formattedDate() }}</div>
          <div class="text-4xl font-bold tracking-wider">{{ currentTime() }}</div>
        </div>
        <div class="flex items-center gap-4">
          <div class="text-right">
            <div class="text-sm opacity-70">Cartelería Digital</div>
            <div class="text-lg font-semibold">Vista Global</div>
          </div>
          <a routerLink="/tempo/carteleria"
             class="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
             title="Volver al panel">
            <span class="material-icons text-2xl">close</span>
          </a>
        </div>
      </div>

      <!-- Grid de salas -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4 h-[calc(100vh-100px)] overflow-auto">
        @for (espacio of espacios(); track espacio.espacioId) {
          <div class="sala-card rounded-xl p-4 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02]"
               [style.background]="'linear-gradient(135deg, ' + (espacio.espacioColor || '#1e293b') + '40, ' + (espacio.espacioColor || '#1e293b') + '20)'"
               [style.border-left]="'4px solid ' + (espacio.espacioColor || '#c9a227')">
            <h2 class="text-xl font-bold mb-3 flex items-center gap-2">
              <span class="w-3 h-3 rounded-full" [style.background-color]="espacio.espacioColor || '#c9a227'"></span>
              {{ espacio.espacioNombre }}
            </h2>

            @if (espacio.actividades.length === 0) {
              <div class="text-gray-400 text-center py-8 italic">
                <div class="text-4xl mb-2 opacity-30">-</div>
                Sin actividades programadas
              </div>
            } @else {
              <div class="space-y-3 overflow-y-auto max-h-[calc(100%-60px)]">
                @for (act of espacio.actividades; track act.id) {
                  <div class="actividad-item p-3 rounded-lg transition-all duration-300"
                       [style.background-color]="(act.tipoActividadColor || '#3b82f6') + '25'"
                       [style.border-left]="'3px solid ' + (act.tipoActividadColor || '#3b82f6')"
                       [class.ring-2]="isCurrentActivity(act)"
                       [class.ring-yellow-400]="isCurrentActivity(act)"
                       [class.animate-pulse]="isCurrentActivity(act)">
                    <div class="flex justify-between items-start mb-1">
                      <div class="text-lg font-semibold leading-tight">{{ act.titulo }}</div>
                      @if (isCurrentActivity(act)) {
                        <span class="px-2 py-0.5 bg-green-500 text-xs rounded-full font-medium">EN CURSO</span>
                      }
                    </div>
                    <div class="text-sm opacity-80 font-mono">
                      {{ act.horaInicio }} - {{ act.horaFin }}
                    </div>
                    @if (act.tipoActividadNombre) {
                      <div class="text-xs mt-1 opacity-70 flex items-center gap-1">
                        <span class="w-2 h-2 rounded-full" [style.background-color]="act.tipoActividadColor"></span>
                        {{ act.tipoActividadNombre }}
                      </div>
                    }
                    @if (act.departamentoNombre) {
                      <div class="text-xs mt-1 opacity-60">
                        {{ act.departamentoNombre }}
                      </div>
                    }
                  </div>
                }
              </div>
            }
          </div>
        }

        @if (espacios().length === 0 && !loading()) {
          <div class="col-span-full flex items-center justify-center h-64 text-gray-400">
            <div class="text-center">
              <div class="text-6xl mb-4 opacity-30">&#128197;</div>
              <div class="text-xl">No hay espacios configurados</div>
            </div>
          </div>
        }

        @if (loading()) {
          <div class="col-span-full flex items-center justify-center h-64">
            <div class="animate-spin w-12 h-12 border-4 border-teatro-crimson border-t-transparent rounded-full"></div>
          </div>
        }
      </div>

      <!-- Footer con auto-refresh indicator -->
      <div class="absolute bottom-2 right-4 text-xs text-gray-500 flex items-center gap-2">
        <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
        Auto-actualización cada 5 min
      </div>
    </div>
  `,
  styles: [`
    .carteleria-global {
      font-family: 'Montserrat', system-ui, sans-serif;
    }
    .sala-card {
      min-height: 200px;
    }
    .actividad-item {
      backdrop-filter: blur(4px);
    }
  `]
})
export class CarteleriaGlobalComponent implements OnInit, OnDestroy {
  private api = inject(ApiService);

  espacios = signal<SignageEntry[]>([]);
  loading = signal(false);
  currentTime = signal(format(new Date(), 'HH:mm:ss'));
  currentTimeHHMM = signal(format(new Date(), 'HH:mm')); // Para comparaciones
  formattedDate = signal(format(new Date(), "EEEE, d 'de' MMMM yyyy", { locale: es }));

  private timerSub?: Subscription;
  private refreshSub?: Subscription;

  ngOnInit(): void {
    this.loadSignageData();

    // Actualizar reloj cada segundo
    this.timerSub = interval(1000).subscribe(() => {
      const now = new Date();
      this.currentTime.set(format(now, 'HH:mm:ss'));
      this.currentTimeHHMM.set(format(now, 'HH:mm'));
      if (now.getHours() === 0 && now.getMinutes() === 0 && now.getSeconds() === 0) {
        this.formattedDate.set(format(now, "EEEE, d 'de' MMMM yyyy", { locale: es }));
      }
    });

    // Refrescar datos cada 5 minutos
    this.refreshSub = interval(300000).subscribe(() => {
      this.loadSignageData();
    });
  }

  ngOnDestroy(): void {
    this.timerSub?.unsubscribe();
    this.refreshSub?.unsubscribe();
  }

  loadSignageData(): void {
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

  // Usa el signal currentTimeHHMM para evitar crear Date() en cada llamada
  isCurrentActivity(actividad: ActividadSignage): boolean {
    const now = this.currentTimeHHMM();
    return actividad.horaInicio <= now && actividad.horaFin > now;
  }
}
