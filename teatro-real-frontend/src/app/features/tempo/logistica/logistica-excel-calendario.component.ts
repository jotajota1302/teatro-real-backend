import { Component, inject, signal, computed, DestroyRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { LogisticaService, OperacionLogisticaDto } from './logistica.service';
import { ThemeService } from '../../../core/services/theme.service';

interface EspacioConOperaciones {
  nombre: string;
  operaciones: OperacionExtendida[];
}

interface OperacionExtendida extends OperacionLogisticaDto {
  tipoColor: string;
}

/**
 * Calendario tipo Excel para Logística de Almacenes del Teatro Real
 * 
 * Diseño inspirado en el frontend-design skill:
 * - Tipografía distintiva (Segoe UI para datos, con peso variable)
 * - Paleta de colores categórica para tipos de movimiento
 * - Grid tipo hoja de cálculo con filas sticky
 * - Micro-animaciones en hover
 * - Texturas sutiles y sombras dramáticas
 */
@Component({
  selector: 'app-logistica-excel-calendario',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './logistica-excel-calendario.component.html',
  styleUrls: ['./logistica-excel-calendario.component.scss']
})
export class LogisticaExcelCalendarioComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  private logisticaService = inject(LogisticaService);
  private themeService = inject(ThemeService);

  isDark = this.themeService.isDark;
  
  // Estado
  loading = signal(true);
  backendError = signal<string | null>(null);
  operacionSeleccionada = signal<OperacionExtendida | null>(null);
  
  // Fecha actual
  private fechaActual = signal(new Date());
  
  // Operaciones cargadas
  private operaciones = signal<OperacionLogisticaDto[]>([]);

  // Tipos de movimiento con colores
  tiposMovimiento = signal([
    { label: 'Recogidas', color: '#3B82F6', tipo: 'ENTRADA' },
    { label: 'Salidas', color: '#F59E0B', tipo: 'SALIDA' },
    { label: 'Internos', color: '#8B5CF6', tipo: 'INTERNO' }
  ]);

  // Mes actual como string
  mesActual = computed(() => {
    const fecha = this.fechaActual();
    return fecha.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  });

  // Días del mes
  diasDelMes = computed(() => {
    const fecha = this.fechaActual();
    const year = fecha.getFullYear();
    const month = fecha.getMonth();
    const ultimoDia = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: ultimoDia }, (_, i) => i + 1);
  });

  // Espacios con operaciones agrupadas
  espaciosConOperaciones = computed(() => {
    const ops = this.operaciones();
    const espaciosMap = new Map<string, OperacionExtendida[]>();

    ops.forEach(op => {
      const espacio = op.hacia || op.desde || 'Sin asignar';
      if (!espaciosMap.has(espacio)) {
        espaciosMap.set(espacio, []);
      }
      
      const tipoColor = this.getTipoColor(op.tipoMovimiento);
      espaciosMap.get(espacio)!.push({ ...op, tipoColor });
    });

    return Array.from(espaciosMap.entries()).map(([nombre, operaciones]) => ({
      nombre,
      operaciones
    }));
  });

  ngOnInit(): void {
    this.cargarOperaciones();
  }

  private cargarOperaciones(): void {
    this.loading.set(true);
    this.backendError.set(null);

    const fecha = this.fechaActual();
    const inicio = new Date(fecha.getFullYear(), fecha.getMonth(), 1).toISOString().split('T')[0];
    const fin = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0).toISOString().split('T')[0];

    this.logisticaService.getCalendario(inicio, fin)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ops => {
          this.operaciones.set(ops);
          this.loading.set(false);
        },
        error: err => {
          this.backendError.set(err.message || 'Error al cargar el calendario');
          this.loading.set(false);
        }
      });
  }

  private getTipoColor(tipo?: string): string {
    const tipoEncontrado = this.tiposMovimiento().find(t => t.tipo === tipo);
    return tipoEncontrado?.color || '#6B7280';
  }

  mesAnterior(): void {
    const fecha = this.fechaActual();
    this.fechaActual.set(new Date(fecha.getFullYear(), fecha.getMonth() - 1, 1));
    this.cargarOperaciones();
  }

  mesSiguiente(): void {
    const fecha = this.fechaActual();
    this.fechaActual.set(new Date(fecha.getFullYear(), fecha.getMonth() + 1, 1));
    this.cargarOperaciones();
  }

  esFinDeSemana(dia: number): boolean {
    const fecha = this.fechaActual();
    const date = new Date(fecha.getFullYear(), fecha.getMonth(), dia);
    const dayOfWeek = date.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6;
  }

  esHoy(dia: number): boolean {
    const hoy = new Date();
    const fecha = this.fechaActual();
    return hoy.getDate() === dia && 
           hoy.getMonth() === fecha.getMonth() && 
           hoy.getFullYear() === fecha.getFullYear();
  }

  nombreDia(dia: number): string {
    const fecha = this.fechaActual();
    const date = new Date(fecha.getFullYear(), fecha.getMonth(), dia);
    return date.toLocaleDateString('es-ES', { weekday: 'short' }).toUpperCase();
  }

  operacionesEnDia(operaciones: OperacionExtendida[], dia: number): OperacionExtendida[] {
    const fecha = this.fechaActual();
    const fechaBuscada = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
    
    return operaciones.filter(op => op.fecha === fechaBuscada);
  }

  abrirDia(espacio: string, dia: number): void {
    console.log('Abrir día', dia, 'para espacio', espacio);
  }

  verDetalle(op: OperacionExtendida, event: Event): void {
    event.stopPropagation();
    this.operacionSeleccionada.set(op);
  }

  cerrarDetalle(): void {
    this.operacionSeleccionada.set(null);
  }

  retryLoad(): void {
    this.cargarOperaciones();
  }
}
