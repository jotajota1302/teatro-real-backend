import { Component, inject, OnInit, OnDestroy, signal, computed, effect } from '@angular/core';
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

      <!-- Carrusel de salas -->
      <div class="relative flex items-center px-4 py-4 h-[calc(100vh-100px)]">
        <!-- Botón anterior -->
        <button
          class="hidden md:flex carousel-nav-btn mr-4 w-10 h-10 md:w-12 md:h-12 bg-black/40 hover:bg-black/60 text-white rounded-full items-center justify-center disabled:opacity-30 disabled:cursor-default transition-colors"
          (click)="goPrev()"
          [disabled]="currentIndex() === 0"
          aria-label="Sala anterior">
          ‹
        </button>

        <!-- Viewport del carrusel -->
        <div class="carousel-viewport flex-1 h-full overflow-hidden">
          <!-- Estados vacíos / loading por encima del track -->
          @if (espacios().length === 0 && !loading()) {
            <div class="flex items-center justify-center h-full text-gray-400">
              <div class="text-center">
                <div class="text-6xl mb-4 opacity-30">&#128197;</div>
                <div class="text-xl">No hay salas configuradas para cartelería global</div>
              </div>
            </div>
          } @else if (loading()) {
            <div class="flex items-center justify-center h-full">
              <div class="animate-spin w-12 h-12 border-4 border-teatro-crimson border-t-transparent rounded-full"></div>
            </div>
          } @else {
            <div
              class="carousel-track h-full flex"
              [style.transform]="'translateX(-' + (currentIndex() * (100 / visibleCount())) + '%)'">
              @for (espacio of espacios(); track espacio.espacioId) {
                <div
                  class="sala-card-wrapper h-full px-2 box-border"
                  [style.flex]="'0 0 ' + (100 / visibleCount()) + '%'">
                  <div class="sala-card h-full rounded-xl p-4 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02]"
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
                </div>
              }
            </div>
          }
        </div>

        <!-- Botón siguiente -->
        <button
          class="hidden md:flex carousel-nav-btn ml-4 w-10 h-10 md:w-12 md:h-12 bg-black/40 hover:bg-black/60 text-white rounded-full items-center justify-center disabled:opacity-30 disabled:cursor-default transition-colors"
          (click)="goNext()"
          [disabled]="currentIndex() + visibleCount() >= espacios().length"
          aria-label="Sala siguiente">
          ›
        </button>
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
    .carousel-track {
      transition: transform 350ms ease-out;
      will-change: transform;
    }
  `]
})
export class CarteleriaGlobalComponent implements OnInit, OnDestroy {
  private api = inject(ApiService);

  // Datos de salas en cartelería global
  espacios = signal<SignageEntry[]>([]);
  loading = signal(false);

  // Estado del reloj
  currentTime = signal(format(new Date(), 'HH:mm:ss'));
  currentTimeHHMM = signal(format(new Date(), 'HH:mm')); // Para comparaciones
  formattedDate = signal(format(new Date(), "EEEE, d 'de' MMMM yyyy", { locale: es }));

  // Estado del carrusel
  /**
   * Índice de la primera sala visible en el carrusel.
   * Se desplaza de 0 hasta (nº salas - visibleCount).
   */
  currentIndex = signal(0);

  /**
   * Número de salas visibles simultáneamente.
   * Se ajusta en función del tamaño de la pantalla:
   *  - pantallas grandes: 4
   *  - pantallas medias: 3
   *  - pantallas pequeñas: 2 (ajustable)
   */
  visibleCount = signal(4);

  private timerSub?: Subscription;
  private refreshSub?: Subscription;
  private autoRotateSub?: Subscription;
  private resizeHandler = () => {
    this.updateVisibleCount();
  };

  ngOnInit(): void {
    // Configurar nº inicial de salas visibles según el tamaño actual
    this.updateVisibleCount();
    window.addEventListener('resize', this.resizeHandler);

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

    // Auto-rotar carrusel cada 5 segundos
    this.autoRotateSub = interval(5000).subscribe(() => {
      this.autoRotate();
    });
  }

  /**
   * Avanza el carrusel automáticamente. Si llega al final, vuelve al inicio.
   */
  private autoRotate(): void {
    const maxIndex = Math.max(0, this.espacios().length - this.visibleCount());
    if (this.currentIndex() >= maxIndex) {
      // Volver al inicio
      this.currentIndex.set(0);
    } else {
      this.currentIndex.update((i) => i + 1);
    }
  }

  ngOnDestroy(): void {
    this.timerSub?.unsubscribe();
    this.refreshSub?.unsubscribe();
    this.autoRotateSub?.unsubscribe();
    window.removeEventListener('resize', this.resizeHandler);
  }

  /**
   * Carga los datos de cartelería global y aplica el filtro de salas.
   * El criterio de qué es una "sala" está encapsulado en esSala().
   */
  loadSignageData(): void {
    this.loading.set(true);
    this.api.get<SignageEntry[]>('/api/signage/global').subscribe({
      next: (data) => {
        const soloSalas = data.filter((entry) => this.esSala(entry));
        this.espacios.set(soloSalas);
        this.loading.set(false);

        // Al cambiar el nº de salas disponibles, reajustamos el índice actual
        const maxIndex = Math.max(0, this.espacios().length - this.visibleCount());
        if (this.currentIndex() > maxIndex) {
          this.currentIndex.set(maxIndex);
        }
      },
      error: () => {
        this.loading.set(false);
        this.espacios.set([]);
        this.currentIndex.set(0);
      }
    });
  }

  /**
   * Ajusta el número de salas visibles (visibleCount) en función del ancho de la ventana.
   *
   * Cómo modificarlo tú:
   *  - Cambia los umbrales (1536, 1024...) o los valores (4, 3, 2) según necesites.
   */
  private updateVisibleCount(): void {
    const width = window.innerWidth;

    if (width >= 1536) {
      // Pantallas muy grandes
      this.visibleCount.set(4);
    } else if (width >= 1024) {
      // Pantallas medias/grandes
      this.visibleCount.set(3);
    } else {
      // Pantallas pequeñas
      this.visibleCount.set(2);
    }

    // Ajustar índice para no salirnos del rango
    const maxIndex = Math.max(0, this.espacios().length - this.visibleCount());
    if (this.currentIndex() > maxIndex) {
      this.currentIndex.set(maxIndex);
    }
  }

  /**
   * Determina si una entrada de cartelería corresponde a una "sala".
   *
   * De momento, como el DTO aún no incluye el tipo de espacio,
   * devolvemos true para no filtrar nada y dejamos un ejemplo
   * comentado por si quieres activar un filtro por nombre.
   */
  private esSala(entry: SignageEntry): boolean {
    // EJEMPLOS de criterios que puedes usar cuando tengas el tipo real:
    //
    // 1) Por nombre que empieza por "Sala":
    // return entry.espacioNombre?.startsWith('Sala ');
    //
    // 2) Por lista de nombres de salas permitidas:
    // const nombresSalas = ['Sala Principal', 'Sala Gayarre', 'Sala Orquesta'];
    // return nombresSalas.includes(entry.espacioNombre);
    //
    // 3) En cuanto tengamos un campo tipoEspacio o similar:
    // return entry.tipoEspacio === 'SALA';
    //
    // Por ahora, no filtramos nada para no romper entornos donde
    // el backend ya esté devolviendo sólo salas.
    return true;
  }

  /**
   * Navega a la "siguiente" posición del carrusel.
   * Avanza de uno en uno, respetando el nº de visibles.
   */
  goNext(): void {
    const maxIndex = Math.max(0, this.espacios().length - this.visibleCount());
    if (this.currentIndex() < maxIndex) {
      this.currentIndex.update((i) => i + 1);
    }
  }

  /**
   * Navega a la "anterior" posición del carrusel.
   */
  goPrev(): void {
    if (this.currentIndex() > 0) {
      this.currentIndex.update((i) => i - 1);
    }
  }

  // Usa el signal currentTimeHHMM para evitar crear Date() en cada llamada
  isCurrentActivity(actividad: ActividadSignage): boolean {
    const now = this.currentTimeHHMM();
    return actividad.horaInicio <= now && actividad.horaFin > now;
  }
}
