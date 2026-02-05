import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../../../core/services/theme.service';
import { EspacioService } from '../services/espacio.service';

interface DiaCalendario {
  fecha: string;
  numero: number;
  nombreDia: string;
  esFinDeSemana: boolean;
  esHoy: boolean;
}

interface Operacion {
  id: string;
  titulo: string;
  tipo: 'ENTRADA' | 'SALIDA' | 'INTERNO';
  categoria: 'RECOGIDAS_TR' | 'ALQUILERES_DEVOLUCIONES'; // Nueva propiedad
  hora: string;
  numCamiones: number;
  espacioId: number;
  espacioNombre: string;
  descripcion?: string;
}

type TipoVista = 'RECOGIDAS_TR' | 'ALQUILERES_DEVOLUCIONES';

/**
 * Vista Calendario Excel - Logística de Operaciones
 * Inspirado en calendario.component.ts - todo en un solo archivo
 */
@Component({
  selector: 'app-logistica-calendario-excel',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="excel-page" [class.dark]="isDark()">
      <!-- Header -->
      <div class="header">
        <div class="header-nav">
          <button class="nav-btn" (click)="mesAnterior()">
            <span class="material-icons">chevron_left</span>
          </button>
          <h1 class="mes-titulo">{{ tituloMes() }}</h1>
          <button class="nav-btn" (click)="mesSiguiente()">
            <span class="material-icons">chevron_right</span>
          </button>
        </div>
        <div class="header-actions">
          <a [routerLink]="['/tempo/movimientos/lista']" class="btn-list">
            <span class="material-icons">view_list</span>
            Lista
          </a>
        </div>
      </div>

      <!-- Selector de Vista -->
      <div class="selector-vista">
        <div class="selector-container">
          <label class="selector-label">Vista:</label>
          <select class="selector-dropdown" 
                  [value]="vistaActual()" 
                  (change)="cambiarVista($any($event.target).value)">
            <option value="RECOGIDAS_TR">Producciones que recoge el TR</option>
            <option value="ALQUILERES_DEVOLUCIONES">Producciones que alquilamos, devolvemos o mandamos a coproductores</option>
          </select>
        </div>
      </div>

      <!-- Leyenda -->
      <div class="leyenda">
        <div class="ley-item">
          <div class="ley-color" style="background:#3B82F6"></div>
          <span>Recogidas/Entregas</span>
        </div>
        <div class="ley-item">
          <div class="ley-color" style="background:#F59E0B"></div>
          <span>Salidas Exterior</span>
        </div>
        <div class="ley-item">
          <div class="ley-color" style="background:#8B5CF6"></div>
          <span>Movimientos Internos</span>
        </div>
      </div>

      <!-- Grid Excel -->
      <div class="container">
        <div class="grid">
          <!-- Header Días -->
          <div class="grid-header">
            <div class="cell corner">Espacio / Día</div>
            @for (dia of diasMes(); track dia.fecha) {
              <div class="cell day-header" 
                   [class.weekend]="dia.esFinDeSemana"
                   [class.today]="dia.esHoy">
                <div class="day-num">{{ dia.numero }}</div>
                <div class="day-name">{{ dia.nombreDia }}</div>
              </div>
            }
          </div>

          <!-- Filas por Espacio -->
          @for (espacio of espacios(); track espacio.id) {
            <div class="grid-row">
              <div class="cell space">
                <div class="space-name">{{ espacio.nombre }}</div>
                <div class="space-count">{{ contarOps(espacio.id) }} ops</div>
              </div>
              @for (dia of diasMes(); track dia.fecha) {
                <div class="cell day" 
                     [class.weekend]="dia.esFinDeSemana"
                     [class.today]="dia.esHoy">
                  @for (op of obtenerOps(espacio.id, dia.fecha); track op.id) {
                    <div class="op-block" 
                         [class.entrada]="op.tipo==='ENTRADA'"
                         [class.salida]="op.tipo==='SALIDA'"
                         [class.interno]="op.tipo==='INTERNO'"
                         (click)="verDetalle(op)">
                      <div class="op-titulo">{{ op.titulo }}</div>
                      <div class="op-info">
                        <span>{{ op.hora }}</span>
                        <span>🚛{{ op.numCamiones }}</span>
                      </div>
                    </div>
                  }
                </div>
              }
            </div>
          }
        </div>
      </div>

      <!-- Modal Detalle -->
      @if (modalDetalle()) {
        <div class="modal-overlay" (click)="cerrarModal()">
          <div class="modal" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h2>{{ opSel()?.titulo }}</h2>
              <button class="close" (click)="cerrarModal()">
                <span class="material-icons">close</span>
              </button>
            </div>
            <div class="modal-body">
              <div class="info-grid">
                <div class="info"><span>Tipo:</span><span>{{ opSel()?.tipo }}</span></div>
                <div class="info"><span>Hora:</span><span>{{ opSel()?.hora }}</span></div>
                <div class="info"><span>Camiones:</span><span>{{ opSel()?.numCamiones }}</span></div>
                <div class="info"><span>Espacio:</span><span>{{ opSel()?.espacioNombre }}</span></div>
              </div>
              @if (opSel()?.descripcion) {
                <p class="desc">{{ opSel()?.descripcion }}</p>
              }
            </div>
            <div class="modal-footer">
              <button class="btn-cancel" (click)="cerrarModal()">Cerrar</button>
              <button class="btn-save">Editar</button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    :host{display:block;height:100%;overflow:hidden}
    .excel-page{height:100vh;display:flex;flex-direction:column;background:#f8f9fa;overflow:hidden}
    .dark{background:#0d0d0d}
    .header{flex-shrink:0;background:#fff;border-bottom:3px solid #CF102D;padding:1.5rem 2rem;display:flex;align-items:center;justify-content:space-between;box-shadow:0 4px 12px rgba(0,0,0,.08)}
    .dark .header{background:#1a1a1a;box-shadow:0 4px 12px rgba(0,0,0,.3)}
    .header-nav{display:flex;align-items:center;gap:1rem}
    .mes-titulo{font-size:2rem;font-weight:800;letter-spacing:1px;color:#1a1a1a;margin:0 1rem;font-variant:small-caps}
    .dark .mes-titulo{color:#e5e7eb}
    .nav-btn{width:44px;height:44px;border-radius:10px;background:#f3f4f6;border:2px solid #d1d5db;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .25s}
    .nav-btn:hover{background:#e5e7eb;border-color:#CF102D;transform:scale(1.08)}
    .dark .nav-btn{background:#262626;border-color:#374151;color:#e5e7eb}
    .dark .nav-btn:hover{background:#333}
    .header-actions{display:flex;gap:.5rem}
    .btn-list{display:flex;align-items:center;gap:.5rem;padding:.75rem 1.5rem;border-radius:10px;font-weight:700;font-size:.875rem;cursor:pointer;text-decoration:none;border:none;text-transform:uppercase;background:#f3f4f6;color:#374151;border:2px solid #d1d5db}
    .btn-list:hover{background:#e5e7eb}
    .dark .btn-list{background:#262626;color:#e5e7eb;border-color:#374151}
    .selector-vista{flex-shrink:0;background:#fff;padding:1rem 2rem;border-bottom:2px solid #e5e7eb}
    .dark .selector-vista{background:#1a1a1a;border-bottom-color:#333}
    .selector-container{display:flex;align-items:center;gap:1rem}
    .selector-label{font-size:.875rem;font-weight:700;color:#374151;text-transform:uppercase;letter-spacing:.5px}
    .dark .selector-label{color:#9ca3af}
    .selector-dropdown{padding:.75rem 1.25rem;border:2px solid #d1d5db;border-radius:10px;background:#fff;color:#1f2937;font-size:.875rem;font-weight:600;cursor:pointer;transition:all .25s;min-width:400px}
    .selector-dropdown:hover{border-color:#CF102D;box-shadow:0 2px 8px rgba(207,16,45,.15)}
    .selector-dropdown:focus{outline:none;border-color:#CF102D;box-shadow:0 0 0 3px rgba(207,16,45,.1)}
    .dark .selector-dropdown{background:#262626;color:#e5e7eb;border-color:#374151}
    .dark .selector-dropdown:hover{border-color:#CF102D}
    .leyenda{flex-shrink:0;background:#fff;padding:1rem 2rem;display:flex;gap:2rem;border-bottom:1px solid #e5e7eb}
    .dark .leyenda{background:#1a1a1a;border-bottom-color:#333}
    .ley-item{display:flex;align-items:center;gap:.5rem;font-size:.875rem;font-weight:600;text-transform:uppercase;color:#374151}
    .dark .ley-item{color:#9ca3af}
    .ley-color{width:24px;height:24px;border-radius:6px;border:2px solid rgba(0,0,0,.15);box-shadow:0 2px 4px rgba(0,0,0,.1)}
    .container{flex:1;overflow:auto;padding:1.5rem}
    .container::-webkit-scrollbar{width:12px;height:12px}
    .container::-webkit-scrollbar-track{background:#f1f1f1;border-radius:6px}
    .container::-webkit-scrollbar-thumb{background:#888;border-radius:6px}
    .grid{display:inline-block;min-width:100%;background:#fff;border-radius:16px;box-shadow:0 10px 30px rgba(0,0,0,.15);overflow:hidden}
    .dark .grid{background:#1a1a1a}
    .grid-header{display:flex;position:sticky;top:0;z-index:10;background:linear-gradient(135deg,#CF102D,#a80d25);color:#fff;font-weight:800;text-transform:uppercase;box-shadow:0 4px 12px rgba(207,16,45,.4)}
    .cell{padding:1rem .75rem;border-right:1px solid rgba(255,255,255,.15);display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:.7rem;min-height:70px}
    .corner{min-width:200px;position:sticky;left:0;z-index:11;background:linear-gradient(135deg,#8a0b1e,#CF102D);border-right:2px solid rgba(255,255,255,.3)}
    .day-header{min-width:90px}
    .day-num{font-size:1.3rem;font-weight:900}
    .day-name{font-size:.6rem;opacity:.85;margin-top:4px}
    .weekend{background:rgba(255,255,255,.08)}
    .today{background:rgba(255,255,255,.2);border-left:3px solid rgba(255,255,255,.6);border-right:3px solid rgba(255,255,255,.6)}
    .grid-row{display:flex;border-bottom:1px solid #e5e7eb}
    .dark .grid-row{border-bottom-color:#333}
    .grid-row:hover{background:rgba(207,16,45,.02)}
    .space{min-width:200px;position:sticky;left:0;z-index:5;background:#f9fafb;border-right:2px solid #e5e7eb;align-items:flex-start}
    .dark .space{background:#1a1a1a;border-right-color:#333}
    .space-name{font-weight:700;font-size:.875rem;color:#1a1a1a}
    .dark .space-name{color:#e5e7eb}
    .space-count{font-size:.75rem;color:#6b7280;font-weight:600;text-transform:uppercase;margin-top:.25rem}
    .day{min-width:90px;min-height:80px;padding:.5rem;border-right:1px solid #e5e7eb;gap:.375rem;cursor:pointer}
    .dark .day{border-right-color:#333}
    .day:hover{background:rgba(207,16,45,.03)}
    .day.weekend{background:rgba(0,0,0,.02)}
    .dark .day.weekend{background:rgba(255,255,255,.02)}
    .day.today{background:rgba(207,16,45,.05);border-left:3px solid #CF102D;border-right:3px solid #CF102D}
    .op-block{padding:.5rem;border-radius:6px;font-size:.75rem;color:#fff;cursor:pointer;transition:all .25s;box-shadow:0 2px 6px rgba(0,0,0,.2);border-left:3px solid rgba(0,0,0,.2)}
    .op-block:hover{transform:translateY(-2px) scale(1.02);box-shadow:0 6px 12px rgba(0,0,0,.3)}
    .op-titulo{font-weight:700;margin-bottom:.25rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
    .op-info{display:flex;justify-content:space-between;font-size:.7rem;opacity:.9}
    .entrada{background:#3B82F6}
    .salida{background:#F59E0B}
    .interno{background:#8B5CF6}
    .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;z-index:1000;backdrop-filter:blur(2px)}
    .modal{background:#fff;border-radius:12px;width:90%;max-width:500px;box-shadow:0 20px 40px rgba(0,0,0,.2)}
    .dark .modal{background:#1a1a1a;border:1px solid rgba(255,255,255,.1)}
    .modal-header{display:flex;align-items:center;justify-content:space-between;padding:1.25rem 1.5rem;border-bottom:1px solid #e5e7eb}
    .dark .modal-header{border-bottom-color:#333}
    .modal-header h2{margin:0;font-size:1.25rem;font-weight:600;color:#1f2937}
    .dark .modal-header h2{color:#e5e7eb}
    .close{background:none;border:none;color:#6b7280;cursor:pointer;padding:.25rem;border-radius:4px}
    .close:hover{background:#f3f4f6}
    .dark .close{color:#9ca3af}
    .dark .close:hover{background:#333}
    .modal-body{padding:1.5rem;display:flex;flex-direction:column;gap:1rem}
    .info-grid{display:grid;grid-template-columns:1fr 1fr;gap:1rem}
    .info{display:flex;flex-direction:column;gap:.25rem}
    .info span:first-child{font-size:.75rem;font-weight:600;color:#6b7280;text-transform:uppercase}
    .info span:last-child{font-size:.875rem;font-weight:600;color:#1f2937}
    .dark .info span:first-child{color:#9ca3af}
    .dark .info span:last-child{color:#e5e7eb}
    .desc{margin-top:1rem;padding-top:1rem;border-top:1px solid #e5e7eb;font-size:.875rem;color:#6b7280}
    .dark .desc{border-top-color:#333;color:#9ca3af}
    .modal-footer{display:flex;justify-content:flex-end;gap:.75rem;padding:1rem 1.5rem;border-top:1px solid #e5e7eb;background:#f9fafb;border-radius:0 0 12px 12px}
    .dark .modal-footer{background:#0d0d0d;border-top-color:#333}
    .btn-cancel{padding:.6rem 1rem;background:#fff;color:#374151;border:1px solid #d1d5db;border-radius:8px;font-size:.875rem;font-weight:500;cursor:pointer}
    .btn-cancel:hover{background:#f3f4f6}
    .dark .btn-cancel{background:#262626;color:#e5e7eb;border-color:#374151}
    .dark .btn-cancel:hover{background:#333}
    .btn-save{padding:.6rem 1.25rem;background:#CF102D;color:#fff;border:none;border-radius:8px;font-size:.875rem;font-weight:500;cursor:pointer}
    .btn-save:hover{background:#a80d25}
  `]
})
export class LogisticaCalendarioExcelComponent {
  private themeService = inject(ThemeService);
  private espacioService = inject(EspacioService);

  isDark = this.themeService.isDark;
  espacios = this.espacioService.espacios;

  // Estado
  mesActual = signal(new Date());
  modalDetalle = signal(false);
  opSel = signal<Operacion | null>(null);

  // Estado de vista seleccionada
  vistaActual = signal<TipoVista>('RECOGIDAS_TR');

  // Datos mock
  private operacionesMock: Operacion[] = [
    { id: '1', titulo: 'Recogida decorados Carmen', tipo: 'ENTRADA', categoria: 'RECOGIDAS_TR', hora: '08:00', numCamiones: 2, espacioId: 1, espacioNombre: 'Sala Principal', descripcion: 'Recogida de decorados del almacén exterior' },
    { id: '2', titulo: 'Entrega vestuario', tipo: 'SALIDA', categoria: 'ALQUILERES_DEVOLUCIONES', hora: '14:00', numCamiones: 1, espacioId: 2, espacioNombre: 'Sala Gayarre', descripcion: 'Envío a taller de costura externo' },
    { id: '3', titulo: 'Traslado atrezzo', tipo: 'INTERNO', categoria: 'RECOGIDAS_TR', hora: '10:30', numCamiones: 1, espacioId: 1, espacioNombre: 'Sala Principal' },
    { id: '4', titulo: 'Devolución La Traviata', tipo: 'SALIDA', categoria: 'ALQUILERES_DEVOLUCIONES', hora: '16:00', numCamiones: 3, espacioId: 1, espacioNombre: 'Sala Principal', descripcion: 'Devolución a coproductor' }
  ];

  constructor() {
    // Cargar espacios si no están cargados
    if (this.espacios().length === 0) {
      this.espacioService.loadEspacios().subscribe();
    }
  }

  // Computed
  tituloMes = computed(() => {
    const fecha = this.mesActual();
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    return `${meses[fecha.getMonth()]} ${fecha.getFullYear()}`;
  });

  diasMes = computed(() => {
    const fecha = this.mesActual();
    const año = fecha.getFullYear();
    const mes = fecha.getMonth();
    const primerDia = new Date(año, mes, 1);
    const ultimoDia = new Date(año, mes + 1, 0);
    const dias: DiaCalendario[] = [];
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    for (let d = primerDia.getDate(); d <= ultimoDia.getDate(); d++) {
      const diaFecha = new Date(año, mes, d);
      const diaSemana = diaFecha.getDay();
      const nombresDias = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
      
      dias.push({
        fecha: diaFecha.toISOString().slice(0, 10),
        numero: d,
        nombreDia: nombresDias[diaSemana],
        esFinDeSemana: diaSemana === 0 || diaSemana === 6,
        esHoy: diaFecha.getTime() === hoy.getTime()
      });
    }
    return dias;
  });

  // Métodos
  mesAnterior(): void {
    const nueva = new Date(this.mesActual());
    nueva.setMonth(nueva.getMonth() - 1);
    this.mesActual.set(nueva);
  }

  mesSiguiente(): void {
    const nueva = new Date(this.mesActual());
    nueva.setMonth(nueva.getMonth() + 1);
    this.mesActual.set(nueva);
  }

  cambiarVista(valor: string): void {
    this.vistaActual.set(valor as TipoVista);
  }

  obtenerOps(espacioId: number, fecha: string): Operacion[] {
    const vistaActual = this.vistaActual();
    // Filtrar por espacio, categoría de vista y simular algunas operaciones para demo visual
    return this.operacionesMock.filter(op => 
      op.espacioId === espacioId && 
      op.categoria === vistaActual &&
      Math.random() > 0.7 // 30% de probabilidad para demo visual
    );
  }

  contarOps(espacioId: number): number {
    const vistaActual = this.vistaActual();
    return this.operacionesMock.filter(op => 
      op.espacioId === espacioId && 
      op.categoria === vistaActual
    ).length;
  }

  verDetalle(op: Operacion): void {
    this.opSel.set(op);
    this.modalDetalle.set(true);
  }

  cerrarModal(): void {
    this.modalDetalle.set(false);
    this.opSel.set(null);
  }
}
