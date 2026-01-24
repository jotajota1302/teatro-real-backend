import { Component, inject, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
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
  selector: 'app-carteleria-sala',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="carteleria-sala h-screen text-white overflow-hidden"
         [style.background]="'linear-gradient(135deg, ' + (espacio()?.espacioColor || '#1e293b') + '30, #0f172a)'">

      <!-- Header -->
      <div class="header p-6 flex justify-between items-center"
           [style.background-color]="(espacio()?.espacioColor || '#CF102D') + 'dd'">
        <div class="flex items-center gap-6">
          <div class="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-lg">
            <span class="text-3xl font-bold" [style.color]="espacio()?.espacioColor || '#CF102D'">TR</span>
          </div>
          <div>
            <div class="text-sm opacity-80 uppercase tracking-widest">Teatro Real</div>
            <h1 class="text-4xl font-bold">{{ espacio()?.espacioNombre || 'Cargando...' }}</h1>
          </div>
        </div>
        <div class="flex items-center gap-6">
          <div class="text-right">
            <div class="text-2xl font-light">{{ formattedDate }}</div>
            <div class="text-6xl font-bold tracking-wider">{{ currentTime() }}</div>
          </div>
          <a routerLink="/tempo/carteleria"
             class="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
             title="Volver al panel">
            <span class="material-icons text-3xl">close</span>
          </a>
        </div>
      </div>

      <!-- Contenido principal -->
      <div class="content p-8 h-[calc(100vh-140px)] overflow-hidden">
        @if (loading()) {
          <div class="flex items-center justify-center h-full">
            <div class="animate-spin w-16 h-16 border-4 border-white border-t-transparent rounded-full"></div>
          </div>
        } @else if (espacio()?.actividades?.length === 0) {
          <div class="flex flex-col items-center justify-center h-full text-center">
            <div class="text-9xl mb-8 opacity-20">-</div>
            <div class="text-4xl font-light text-gray-300">Sin actividades programadas</div>
            <div class="text-xl text-gray-500 mt-4">para hoy en esta sala</div>
          </div>
        } @else {
          <!-- Actividad actual destacada -->
          @if (actividadActual()) {
            <div class="actividad-actual mb-8 p-8 rounded-2xl relative overflow-hidden"
                 [style.background]="'linear-gradient(135deg, ' + (actividadActual()?.tipoActividadColor || '#3b82f6') + '50, ' + (actividadActual()?.tipoActividadColor || '#3b82f6') + '20)'"
                 [style.border-left]="'6px solid ' + (actividadActual()?.tipoActividadColor || '#3b82f6')">
              <div class="absolute top-4 right-4 px-4 py-2 bg-green-500 rounded-full text-sm font-bold uppercase animate-pulse">
                En curso
              </div>
              <div class="text-sm uppercase tracking-widest opacity-70 mb-2">Ahora</div>
              <div class="text-5xl font-bold mb-4">{{ actividadActual()?.titulo }}</div>
              <div class="flex items-center gap-8 text-2xl">
                <div class="font-mono">
                  {{ actividadActual()?.horaInicio }} - {{ actividadActual()?.horaFin }}
                </div>
                @if (actividadActual()?.tipoActividadNombre) {
                  <div class="flex items-center gap-2">
                    <span class="w-4 h-4 rounded-full" [style.background-color]="actividadActual()?.tipoActividadColor"></span>
                    {{ actividadActual()?.tipoActividadNombre }}
                  </div>
                }
              </div>
              @if (actividadActual()?.departamentoNombre) {
                <div class="text-lg mt-4 opacity-70">
                  Departamento: {{ actividadActual()?.departamentoNombre }}
                </div>
              }
            </div>
          }

          <!-- Lista de actividades -->
          <div class="text-xl font-semibold mb-4 opacity-70 uppercase tracking-wider">
            @if (actividadActual()) { Próximas actividades } @else { Actividades del día }
          </div>
          <div class="space-y-4 overflow-y-auto" style="max-height: calc(100% - {{ actividadActual() ? '320px' : '60px' }});">
            @for (act of actividadesFuturas(); track act.id) {
              <div class="actividad-item p-6 rounded-xl transition-all duration-300"
                   [style.background-color]="(act.tipoActividadColor || '#3b82f6') + '15'"
                   [style.border-left]="'4px solid ' + (act.tipoActividadColor || '#3b82f6')">
                <div class="flex justify-between items-center">
                  <div>
                    <div class="text-2xl font-semibold">{{ act.titulo }}</div>
                    @if (act.departamentoNombre) {
                      <div class="text-sm opacity-60 mt-1">{{ act.departamentoNombre }}</div>
                    }
                  </div>
                  <div class="text-right">
                    <div class="text-3xl font-mono font-bold">{{ act.horaInicio }}</div>
                    <div class="text-sm opacity-60">hasta {{ act.horaFin }}</div>
                  </div>
                </div>
                @if (act.tipoActividadNombre) {
                  <div class="flex items-center gap-2 mt-3 text-sm opacity-70">
                    <span class="w-3 h-3 rounded-full" [style.background-color]="act.tipoActividadColor"></span>
                    {{ act.tipoActividadNombre }}
                  </div>
                }
              </div>
            }
          </div>
        }
      </div>

      <!-- Footer -->
      <div class="absolute bottom-4 left-0 right-0 flex justify-center">
        <div class="flex items-center gap-2 text-xs text-gray-500 bg-black/30 px-4 py-2 rounded-full">
          <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          Auto-actualización activa
        </div>
      </div>
    </div>
  `,
  styles: [`
    .carteleria-sala {
      font-family: 'Montserrat', system-ui, sans-serif;
    }
  `]
})
export class CarteleriaSalaComponent implements OnInit, OnDestroy {
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);

  espacio = signal<SignageEntry | null>(null);
  loading = signal(false);
  currentTime = signal(format(new Date(), 'HH:mm:ss'));
  currentTimeHHMM = signal(format(new Date(), 'HH:mm')); // Para comparaciones
  formattedDate = format(new Date(), "EEEE, d 'de' MMMM yyyy", { locale: es });

  private espacioId: number | null = null;
  private timerSub?: Subscription;
  private refreshSub?: Subscription;
  private routeSub?: Subscription;

  // Computed signals para actividad actual y futuras (evita recálculo en cada change detection)
  actividadActual = computed(() => {
    const actividades = this.espacio()?.actividades || [];
    const now = this.currentTimeHHMM();
    return actividades.find(a => a.horaInicio <= now && a.horaFin > now) || null;
  });

  actividadesFuturas = computed(() => {
    const actividades = this.espacio()?.actividades || [];
    const now = this.currentTimeHHMM();
    const actual = this.actividadActual();
    return actividades.filter(a => {
      if (actual && a.id === actual.id) return false;
      return a.horaFin > now;
    });
  });

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe(params => {
      this.espacioId = +params['espacioId'];
      this.loadSignageData();
    });

    // Actualizar reloj cada segundo
    this.timerSub = interval(1000).subscribe(() => {
      const now = new Date();
      this.currentTime.set(format(now, 'HH:mm:ss'));
      this.currentTimeHHMM.set(format(now, 'HH:mm'));
    });

    // Refrescar datos cada 5 minutos
    this.refreshSub = interval(300000).subscribe(() => {
      this.loadSignageData();
    });
  }

  ngOnDestroy(): void {
    this.timerSub?.unsubscribe();
    this.refreshSub?.unsubscribe();
    this.routeSub?.unsubscribe();
  }

  loadSignageData(): void {
    if (!this.espacioId) return;

    this.loading.set(true);
    this.api.get<SignageEntry>(`/api/signage/${this.espacioId}`).subscribe({
      next: (data) => {
        this.espacio.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.espacio.set(null);
      }
    });
  }

  // actividadActual y actividadesFuturas ahora son computed signals definidos arriba
}
