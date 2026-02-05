import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
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
    <div class="excel-page" [class.dark]="isDark()">
      <div class="header">
        <h1 class="titulo">📦 CALENDARIO ALMACENES - DICIEMBRE 2025</h1>
        <div class="header-actions">
          <a [routerLink]="['/tempo/movimientos/lista']" class="btn-back"><span class="material-icons">list</span> Lista de Movimientos</a>
        </div>
      </div>

      <div class="selector-vista">
        <label>📋 Vista:</label>
        <select [value]="vistaActual()" (change)="cambiarVista($any($event.target).value)">
          <option value="RECOGIDAS_TR">🚚 Producciones que recoge el TR</option>
          <option value="ALQUILERES_DEVOLUCIONES">📤 Producciones que alquilamos, devolvemos o mandamos a coproductores</option>
        </select>
      </div>

      @if (vistaActual() === 'RECOGIDAS_TR') {
        <div class="container">
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
        <div class="container">
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
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
      overflow: hidden;
    }
    
    .excel-page {
      height: 100vh;
      display: flex;
      flex-direction: column;
      background: #f8f9fa;
      overflow: hidden;
    }
    
    .dark {
      background: #0d0d0d;
    }
    
    .header {
      flex-shrink: 0;
      background: #fff;
      border-bottom: 3px solid #CF102D;
      padding: 1.5rem 2rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }
    
    .dark .header {
      background: #1a1a1a;
    }
    
    .titulo {
      font-size: 1.5rem;
      font-weight: 800;
      color: #1a1a1a;
      margin: 0;
      text-transform: uppercase;
    }
    
    .dark .titulo {
      color: #e5e7eb;
    }
    
    .header-actions {
      display: flex;
      gap: 0.5rem;
    }
    
    .btn-back {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.25rem;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.875rem;
      cursor: pointer;
      text-decoration: none;
      border: none;
      transition: all 0.2s;
      background: #f3f4f6;
      color: #374151;
      border: 2px solid #d1d5db;
    }
    
    .btn-back:hover {
      background: #e5e7eb;
    }
    
    .dark .btn-back {
      background: #262626;
      color: #e5e7eb;
      border-color: #374151;
    }
    
    .selector-vista {
      flex-shrink: 0;
      background: #fff;
      padding: 1rem 2rem;
      border-bottom: 2px solid #e5e7eb;
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    
    .dark .selector-vista {
      background: #1a1a1a;
      border-bottom-color: #333;
    }
    
    .selector-vista label {
      font-size: 0.875rem;
      font-weight: 700;
      color: #374151;
    }
    
    .dark .selector-vista label {
      color: #9ca3af;
    }
    
    .selector-vista select {
      padding: 0.75rem 1rem;
      border: 2px solid #d1d5db;
      border-radius: 8px;
      background: #fff;
      color: #1f2937;
      font-size: 0.875rem;
      font-weight: 600;
      min-width: 450px;
    }
    
    .dark .selector-vista select {
      background: #262626;
      color: #e5e7eb;
      border-color: #374151;
    }
    
    .container {
      flex: 1;
      overflow: auto;
      padding: 1.5rem;
    }
    
    .grid {
      display: table;
      width: 100%;
      background: #fff;
      border: 1px solid #d1d5db;
      border-collapse: collapse;
    }
    
    .dark .grid {
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
    
    .dark .grid-header {
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
    
    .dark .cell {
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
    
    .dark .corner {
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
    
    .dark .col-header {
      background: #262626;
      color: #9ca3af;
    }
    
    .grid-row {
      display: table-row;
    }
    
    .grid-row.weekend-row {
      background: #fafafa;
    }
    
    .dark .grid-row.weekend-row {
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
    
    .dark .day-label {
      background: #1a1a1a;
      border-color: #374151;
      color: #e5e7eb;
    }
    
    .day-label.weekend {
      background: #fafafa;
    }
    
    .dark .day-label.weekend {
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
    
    .dark .day-name {
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
    
    .dark .day-data {
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
    
    .dark .prod {
      background: #1e3a8a;
      color: #dbeafe;
      border-left-color: #3b82f6;
    }
    
    .dark .cam {
      background: #064e3b;
      color: #d1fae5;
      border-left-color: #10b981;
    }
    
    .dark .lug {
      background: #831843;
      color: #fce7f3;
      border-left-color: #ec4899;
    }
    
    .dark .arr {
      background: #312e81;
      color: #e0e7ff;
      border-left-color: #6366f1;
    }
    
    .dark .prod-sal {
      background: #7c2d12;
      color: #fed7aa;
      border-left-color: #f97316;
    }
    
    .dark .cam-sal {
      background: #78350f;
      color: #fef3c7;
      border-left-color: #eab308;
    }
    
    .dark .lug-sal {
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
    
    .dark .separator-line {
      background: #262626;
      border-top-color: #4b5563;
      border-bottom-color: #4b5563;
    }
  `]
})
export class LogisticaAlmacenesExcelComponent {
  private themeService = inject(ThemeService);
  isDark = this.themeService.isDark;

  vistaActual = signal<TipoVista>('RECOGIDAS_TR');

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
