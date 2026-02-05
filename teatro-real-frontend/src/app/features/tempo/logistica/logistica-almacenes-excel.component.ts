import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ThemeService } from '../../../core/services/theme.service';

// Datos reales extraídos del Excel CALENDARIO_2025-Almacenes.xlsx - Diciembre 2025
const DATOS_RECOGIDAS = [
  { dia: 2, produccion: 'MOSES UND PHARAON', numCamiones: 3, lugarRecogida: 'MARSELLA', fechaCampa: null, fechaNave: null },
  { dia: 4, produccion: null, numCamiones: null, lugarRecogida: null, fechaCampa: null, fechaNave: 'MOSES UND PHARAON' }
];

const DATOS_ALQUILERES = [
  { dia: 11, produccionCampa: 'OTELLO (CONFIRMAR CON JESUS)', produccionNave: null, numCamiones: 5, lugarEnvio: 'LONDRES' },
  { dia: 12, produccionCampa: 'OTELLO (CONFIRMAR CON JESUS)', produccionNave: null, numCamiones: 5, lugarEnvio: 'LONDRES' }
];

interface DiaCalendario {
  numero: number;
  nombreDia: string;
  esFinDeSemana: boolean;
}

type TipoVista = 'RECOGIDAS_TR' | 'ALQUILERES_DEVOLUCIONES';

@Component({
  selector: 'app-logistica-almacenes-excel',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page-container" [ngClass]="isDark() ? 'page-dark' : 'page-light'">
      <!-- Fixed Header -->
      <div class="fixed-header">
        <!-- Title row - same structure as Espacios/Cartelería -->
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h1 class="text-3xl font-semibold" [class]="isDark() ? 'text-white' : 'text-title-light'">Calendario Almacenes</h1>
            <p [class]="isDark() ? 'text-gray-400' : 'text-subtitle-light'">Diciembre 2025 - Gestión de movimientos de producciones</p>
          </div>
          <div class="flex flex-wrap items-center justify-end gap-2">
            <a [routerLink]="['/tempo/movimientos/lista']" class="btn-action-secondary">
              <span class="material-icons">list</span>
              Lista de Movimientos
            </a>
            <button class="btn-action-primary" (click)="openModal()">
              <span class="material-icons">add</span>
              Nuevo Movimiento
            </button>
          </div>
        </div>

        <!-- Vista selector -->
        <div class="vista-selector">
          <label class="vista-label" [class.text-gray-400]="isDark()">Vista:</label>
          <select class="vista-select" [class.vista-select-dark]="isDark()" [value]="vistaActual()" (change)="cambiarVista($any($event.target).value)">
            <option value="RECOGIDAS_TR">🚚 Producciones que recoge el TR</option>
            <option value="ALQUILERES_DEVOLUCIONES">📤 Producciones que alquilamos, devolvemos o mandamos a coproductores</option>
          </select>
        </div>
      </div>

      <!-- Scrollable Content -->

      <div class="scrollable-content">
        @if (vistaActual() === 'RECOGIDAS_TR') {
        <div class="grid-container">
          <div class="grid">
            <div class="grid-header">
              <div class="cell corner">FECHA / HORA</div>
              <div class="cell col-header">Producción y Fecha de Recogida</div>
              <div class="cell col-header">Número de Camiones</div>
              <div class="cell col-header">Lugar de Recogida</div>
              <div class="cell col-header">Llegada Arganda - CAMPA</div>
              <div class="cell col-header">Llegada Arganda - NAVE</div>
            </div>

            @for (dia of diasMes; track dia.numero) {
              @if (dia.numero === 8 || dia.numero === 15 || dia.numero === 22 || dia.numero === 29) {
                <div class="week-separator">
                  <div class="separator-line"></div>
                </div>
              }
              <div class="grid-row" [class.weekend-row]="dia.esFinDeSemana">
                <div class="cell day-label" [class.weekend]="dia.esFinDeSemana">
                  <div class="day-info">
                    <span class="day-name">{{ dia.nombreDia }}</span> {{ dia.numero }}/12
                  </div>
                </div>
                
                <div class="cell day-data">
                  @if (getDatoRecogida(dia.numero, 'produccion'); as prod) {
                    <div class="data-cell prod">{{ prod }}</div>
                  }
                </div>
                
                <div class="cell day-data">
                  @if (getDatoRecogida(dia.numero, 'numCamiones'); as num) {
                    <div class="data-cell cam">🚛 {{ num }}</div>
                  }
                </div>
                
                <div class="cell day-data">
                  @if (getDatoRecogida(dia.numero, 'lugarRecogida'); as lugar) {
                    <div class="data-cell lug">📍 {{ lugar }}</div>
                  }
                </div>
                
                <div class="cell day-data">
                  @if (getDatoRecogida(dia.numero, 'fechaCampa'); as fecha) {
                    <div class="data-cell arr">{{ fecha }}</div>
                  }
                </div>
                
                <div class="cell day-data">
                  @if (getDatoRecogida(dia.numero, 'fechaNave'); as fecha) {
                    <div class="data-cell arr">{{ fecha }}</div>
                  }
                </div>
              </div>
            }
          </div>
        </div>
        }

        @if (vistaActual() === 'ALQUILERES_DEVOLUCIONES') {
        <div class="grid-container">
          <div class="grid">
            <div class="grid-header">
              <div class="cell corner">FECHA / HORA</div>
              <div class="cell col-header">Producción Salida - CAMPA</div>
              <div class="cell col-header">Producción Salida - NAVE</div>
              <div class="cell col-header">Número de Camiones</div>
              <div class="cell col-header">Lugar de Envío</div>
            </div>

            @for (dia of diasMes; track dia.numero) {
              @if (dia.numero === 8 || dia.numero === 15 || dia.numero === 22 || dia.numero === 29) {
                <div class="week-separator">
                  <div class="separator-line"></div>
                </div>
              }
              <div class="grid-row" [class.weekend-row]="dia.esFinDeSemana">
                <div class="cell day-label" [class.weekend]="dia.esFinDeSemana">
                  <div class="day-info">
                    <span class="day-name">{{ dia.nombreDia }}</span> {{ dia.numero }}/12
                  </div>
                </div>
                
                <div class="cell day-data">
                  @if (getDatoAlquiler(dia.numero, 'produccionCampa'); as prod) {
                    <div class="data-cell prod-sal">{{ prod }}</div>
                  }
                </div>
                
                <div class="cell day-data">
                  @if (getDatoAlquiler(dia.numero, 'produccionNave'); as prod) {
                    <div class="data-cell prod-sal">{{ prod }}</div>
                  }
                </div>
                
                <div class="cell day-data">
                  @if (getDatoAlquiler(dia.numero, 'numCamiones'); as num) {
                    <div class="data-cell cam-sal">🚛 {{ num }}</div>
                  }
                </div>
                
                <div class="cell day-data">
                  @if (getDatoAlquiler(dia.numero, 'lugarEnvio'); as lugar) {
                    <div class="data-cell lug-sal">📍 {{ lugar }}</div>
                  }
                </div>
              </div>
            }
          </div>
        </div>
        }
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
    }

    /* Layout - same as Cartelería */
    .page-container {
      display: flex;
      flex-direction: column;
      height: 100%;
      font-family: 'Montserrat', sans-serif;
    }

    .page-light {
      background: #f2f4f7;
      color: #1f2937;
    }

    .page-container.page-dark {
      background: #1a1a1a;
      border-radius: 1rem;
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #e5e7eb;
    }

    .fixed-header {
      flex-shrink: 0;
      padding: 1.5rem 2rem 0 2rem;
    }

    /* Text colors - same as Espacios/Cartelería */
    .text-title-light { color: #1f2937; }
    .text-subtitle-light { color: #6b7280; }

    .scrollable-content {
      flex: 1;
      overflow-y: auto;
      padding: 0 2rem 2rem 2rem;
    }

    .btn-secondary-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      background: white;
      color: #374151;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s;
      text-decoration: none;
    }

    .btn-secondary-header .material-icons {
      font-size: 1.25rem;
    }

    .btn-secondary-header:hover {
      background: #f3f4f6;
      transform: translateY(-2px);
    }

    .btn-secondary-header.btn-secondary-header-dark {
      background: #262626;
      color: #e5e7eb;
      border-color: #374151;
    }

    .btn-secondary-header.btn-secondary-header-dark:hover {
      background: #333333;
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

    .btn-nuevo .material-icons {
      font-size: 1.25rem;
    }

    .btn-nuevo:hover {
      background: #a80d25;
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(207, 16, 45, 0.4);
    }

    /* Vista selector */
    .vista-selector {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem;
      background: white;
      border-radius: 0.75rem;
      border: 1px solid rgba(15, 23, 42, 0.08);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      margin-bottom: 1rem;
    }

    .page-dark .vista-selector {
      background: #1a1a1a;
      border-color: rgba(255, 255, 255, 0.1);
    }

    .vista-label {
      font-size: 0.875rem;
      font-weight: 600;
      color: #6b7280;
      flex-shrink: 0;
    }

    .vista-select {
      flex: 1;
      min-width: 200px;
      padding: 0.75rem 1rem;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      background: #f9fafb;
      color: #1f2937;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .vista-select:focus {
      outline: none;
      border-color: #CF102D;
      box-shadow: 0 0 0 2px rgba(207, 16, 45, 0.1);
    }

    .vista-select.vista-select-dark {
      background: #262626;
      color: #e5e7eb;
      border-color: #374151;
    }

    .vista-select.vista-select-dark option {
      background: #262626;
      color: #e5e7eb;
    }

    /* Grid container */
    .grid-container {
      background: white;
      border-radius: 0.75rem;
      border: 1px solid rgba(15, 23, 42, 0.08);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      overflow: hidden;
      margin-top: 1rem;
    }

    .page-dark .grid-container {
      background: #1a1a1a;
      border-color: rgba(255, 255, 255, 0.1);
    }
    
    .grid {
      display: table;
      width: 100%;
      background: #fff;
      border: 1px solid #d1d5db;
      border-collapse: collapse;
    }
    
    .page-dark .grid {
      background: #1a1a1a;
      border-color: #374151;
    }
    
    .grid-header {
      display: table-row;
      position: sticky;
      top: 0;
      z-index: 10;
      background: #f9fafb;
    }
    
    .page-dark .grid-header {
      background: #262626;
    }
    
    .cell {
      padding: 1rem;
      border: 1px solid #d1d5db;
      display: table-cell;
      text-align: left;
      vertical-align: top;
      font-size: 0.8rem;
    }
    
    .page-dark .cell {
      border-color: #374151;
    }
    
    .corner {
      min-width: 140px;
      width: 140px;
      position: sticky;
      left: 0;
      z-index: 11;
      background: #f9fafb;
      font-size: 0.7rem;
      font-weight: 700;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .page-dark .corner {
      background: #262626;
      color: #9ca3af;
    }
    
    .col-header {
      min-width: 220px;
      padding: 1rem;
      font-size: 0.7rem;
      text-align: left;
      font-weight: 700;
      background: #f9fafb;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .page-dark .col-header {
      background: #262626;
      color: #9ca3af;
    }
    
    .grid-row {
      display: table-row;
    }
    
    .grid-row.weekend-row {
      background: #fafafa;
    }
    
    .page-dark .grid-row.weekend-row {
      background: #171717;
    }
    
    .day-label {
      min-width: 140px;
      width: 140px;
      position: sticky;
      left: 0;
      z-index: 5;
      background: #fff;
      border: 1px solid #d1d5db;
      font-weight: 600;
      font-size: 0.85rem;
      color: #1a1a1a;
      text-align: left;
      padding: 1rem;
    }
    
    .page-dark .day-label {
      background: #1a1a1a;
      border-color: #374151;
      color: #e5e7eb;
    }
    
    .day-label.weekend {
      background: #fafafa;
    }
    
    .page-dark .day-label.weekend {
      background: #171717;
    }
    
    .day-info {
      display: flex;
      align-items: baseline;
      gap: 0.25rem;
    }
    
    .day-name {
      font-weight: 700;
      color: #374151;
    }
    
    .page-dark .day-name {
      color: #9ca3af;
    }
    
    .day-data {
      min-width: 220px;
      padding: 1rem;
      border: 1px solid #d1d5db;
      text-align: left;
      vertical-align: top;
      background: #fff;
    }
    
    .page-dark .day-data {
      border-color: #374151;
      background: #1a1a1a;
    }
    
    .data-cell {
      padding: 0.75rem 1rem;
      border-radius: 6px;
      font-size: 0.85rem;
      font-weight: 600;
      text-align: left;
      display: block;
      border-left: 3px solid;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    }
    
    .prod {
      background: #eff6ff;
      color: #1e40af;
      border-left-color: #3b82f6;
    }
    
    .cam {
      background: #f0fdf4;
      color: #065f46;
      border-left-color: #10b981;
    }
    
    .lug {
      background: #fdf2f8;
      color: #9f1239;
      border-left-color: #ec4899;
    }
    
    .arr {
      background: #eef2ff;
      color: #3730a3;
      border-left-color: #6366f1;
    }
    
    .prod-sal {
      background: #fff7ed;
      color: #9a3412;
      border-left-color: #f97316;
    }
    
    .cam-sal {
      background: #fefce8;
      color: #78350f;
      border-left-color: #eab308;
    }
    
    .lug-sal {
      background: #fef2f2;
      color: #991b1b;
      border-left-color: #ef4444;
    }
    
    .page-dark .prod {
      background: #1e3a8a;
      color: #dbeafe;
      border-left-color: #3b82f6;
    }
    
    .page-dark .cam {
      background: #064e3b;
      color: #d1fae5;
      border-left-color: #10b981;
    }
    
    .page-dark .lug {
      background: #831843;
      color: #fce7f3;
      border-left-color: #ec4899;
    }
    
    .page-dark .arr {
      background: #312e81;
      color: #e0e7ff;
      border-left-color: #6366f1;
    }
    
    .page-dark .prod-sal {
      background: #7c2d12;
      color: #fed7aa;
      border-left-color: #f97316;
    }
    
    .page-dark .cam-sal {
      background: #78350f;
      color: #fef3c7;
      border-left-color: #eab308;
    }
    
    .page-dark .lug-sal {
      background: #7f1d1d;
      color: #fecaca;
      border-left-color: #ef4444;
    }
    
    .week-separator {
      display: table-row;
      height: 12px;
    }
    
    .separator-line {
      display: table-cell;
      height: 12px;
      background: #e5e7eb;
      border: none;
      border-top: 2px solid #9ca3af;
      border-bottom: 2px solid #9ca3af;
    }
    
    .page-dark .separator-line {
      background: #262626;
      border-top-color: #4b5563;
      border-bottom-color: #4b5563;
    }
  `]
})
export class LogisticaAlmacenesExcelComponent {
  private themeService = inject(ThemeService);
  private router = inject(Router);
  isDark = this.themeService.isDark;

  vistaActual = signal<TipoVista>('RECOGIDAS_TR');

  openModal(): void {
    // Navega a la lista con query param para abrir el modal
    this.router.navigate(['/tempo/movimientos/lista'], { queryParams: { openModal: true } });
  }

  // Días de diciembre 2025
  diasMes: DiaCalendario[] = [
    { numero: 1, nombreDia: 'Lun', esFinDeSemana: false },
    { numero: 2, nombreDia: 'Mar', esFinDeSemana: false },
    { numero: 3, nombreDia: 'Mié', esFinDeSemana: false },
    { numero: 4, nombreDia: 'Jue', esFinDeSemana: false },
    { numero: 5, nombreDia: 'Vie', esFinDeSemana: false },
    { numero: 6, nombreDia: 'Sáb', esFinDeSemana: true },
    { numero: 7, nombreDia: 'Dom', esFinDeSemana: true },
    { numero: 8, nombreDia: 'Lun', esFinDeSemana: false },
    { numero: 9, nombreDia: 'Mar', esFinDeSemana: false },
    { numero: 10, nombreDia: 'Mié', esFinDeSemana: false },
    { numero: 11, nombreDia: 'Jue', esFinDeSemana: false },
    { numero: 12, nombreDia: 'Vie', esFinDeSemana: false },
    { numero: 13, nombreDia: 'Sáb', esFinDeSemana: true },
    { numero: 14, nombreDia: 'Dom', esFinDeSemana: true },
    { numero: 15, nombreDia: 'Lun', esFinDeSemana: false },
    { numero: 16, nombreDia: 'Mar', esFinDeSemana: false },
    { numero: 17, nombreDia: 'Mié', esFinDeSemana: false },
    { numero: 18, nombreDia: 'Jue', esFinDeSemana: false },
    { numero: 19, nombreDia: 'Vie', esFinDeSemana: false },
    { numero: 20, nombreDia: 'Sáb', esFinDeSemana: true },
    { numero: 21, nombreDia: 'Dom', esFinDeSemana: true },
    { numero: 22, nombreDia: 'Lun', esFinDeSemana: false },
    { numero: 23, nombreDia: 'Mar', esFinDeSemana: false },
    { numero: 24, nombreDia: 'Mié', esFinDeSemana: false },
    { numero: 25, nombreDia: 'Jue', esFinDeSemana: false },
    { numero: 26, nombreDia: 'Vie', esFinDeSemana: false },
    { numero: 27, nombreDia: 'Sáb', esFinDeSemana: true },
    { numero: 28, nombreDia: 'Dom', esFinDeSemana: true },
    { numero: 29, nombreDia: 'Lun', esFinDeSemana: false },
    { numero: 30, nombreDia: 'Mar', esFinDeSemana: false },
    { numero: 31, nombreDia: 'Mié', esFinDeSemana: false }
  ];

  cambiarVista(valor: string): void {
    this.vistaActual.set(valor as TipoVista);
  }

  getDatoRecogida(dia: number, campo: string): any {
    const dato = DATOS_RECOGIDAS.find(d => d.dia === dia);
    if (!dato) return null;
    return (dato as any)[campo];
  }

  getDatoAlquiler(dia: number, campo: string): any {
    const dato = DATOS_ALQUILERES.find(d => d.dia === dia);
    if (!dato) return null;
    return (dato as any)[campo];
  }
}
