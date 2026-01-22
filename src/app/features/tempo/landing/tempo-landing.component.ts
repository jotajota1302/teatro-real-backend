// TEMPO Landing: Contenedor de vistas Excel y Calendario para módulo TEMPO
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
// Importa ambos componentes principales de TEMPO
import { WeeklyExcelViewComponent } from './weekly-excel-view/weekly-excel-view.component';
import { CalendarioComponent } from '../calendario/calendario.component';

/**
 * Componente contenedor de la landing de TEMPO:
 * Incluye pestañas para tabla semanal Excel y calendario.
 * Permite futura extensión (filtros globales, acciones...).
 */
@Component({
  selector: 'app-tempo-landing',
  standalone: true,
  imports: [CommonModule, MatTabsModule, WeeklyExcelViewComponent, CalendarioComponent],
  template: `
    <section aria-label="Landing TEMPO" class="py-4 px-0 md:px-4">
      <mat-tab-group animationDuration="250ms">
        <mat-tab label="Vista Semanal Excel" aria-label="Ver tabla semanal tipo Excel">
          <app-weekly-excel-view></app-weekly-excel-view>
        </mat-tab>
        <mat-tab label="Calendario" aria-label="Ver calendario mensual/semanal">
          <app-calendario></app-calendario>
        </mat-tab>
      </mat-tab-group>
    </section>
  `,
  styles: [`
    section {
      background: #fff;
      border-radius: 8px;
      margin-top: 0;
      margin-bottom: 0;
      box-shadow: 0 1px 8px #00000012;
      min-height: 600px;
    }
    @media (max-width: 768px) {
      section {
        border-radius: 0;
        padding-left: 0!important;
        padding-right: 0!important;
      }
    }
    mat-tab-group {
      background: transparent;
    }
  `]
})
export class TempoLandingComponent {}
