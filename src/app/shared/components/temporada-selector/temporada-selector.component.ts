import { Component, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TemporadaService } from '../../../core/services/temporada.service';
import { Temporada } from '../../../features/tempo/models/actividad.model';

@Component({
  selector: 'app-temporada-selector',
  standalone: true,
  imports: [CommonModule, MatSelectModule, MatFormFieldModule],
  template: `
    <div class="temporada-selector-header-wrapper">
      <mat-form-field class="temporada-selector--supercenter" appearance="fill">
        <mat-label>Temporada</mat-label>
        <mat-select
          [value]="temporadaService.selectedTemporada()"
          (selectionChange)="onTemporadaChange($event.value)"
          class="temporada-selector__select"
          disableRipple
        >
          @for (temporada of temporadaService.temporadas(); track temporada.id) {
            <mat-option [value]="temporada">
              {{ temporada.nombre }}
              @if (temporada.activa) {
                <span class="text-success ml-2">(Actual)</span>
              }
            </mat-option>
          }
        </mat-select>
      </mat-form-field>
    </div>
  `,
  styles: [`
    .temporada-selector-header-wrapper {
      display: flex;
      align-items: center;
      height: 48px;
    }
    .temporada-selector--supercenter,
    .temporada-selector--supercenter .mat-mdc-form-field,
    .temporada-selector--supercenter .mat-mdc-select-trigger {
      align-self: center !important;
      vertical-align: middle !important;
      margin: 0 !important;
      height: 40px !important;
      min-height: 40px !important;
      font-size: 15px !important;
      font-family: 'Montserrat', sans-serif !important;
      border-radius: 6px !important;
    }
    .temporada-selector--supercenter .mat-mdc-form-field-flex,
    .temporada-selector--supercenter .mat-mdc-text-field-wrapper {
      border: none !important;
      box-shadow: none !important;
      background: #fff !important;
      padding: 0 10px !important;
      margin: 0 !important;
      min-height: 40px !important;
      align-items: center !important;
      height: 40px !important;
      border-radius: 6px !important;
    }
    .temporada-selector--supercenter .mat-mdc-form-field-infix {
      padding: 0 !important;
      min-height: 40px !important;
      height: 40px !important;
      display: flex !important;
      align-items: center !important;
    }
    .temporada-selector--supercenter .mat-mdc-form-field-outline,
    .temporada-selector--supercenter .mat-mdc-form-field-outline-end,
    .temporada-selector--supercenter .mat-mdc-form-field-outline-start,
    .temporada-selector--supercenter .mat-mdc-form-field-underline {
      border: none !important;
      background: none !important;
      box-shadow: none !important;
      display: none !important;
      height: 0 !important;
      min-height: 0 !important;
    }
    .temporada-selector--supercenter .mat-mdc-select-trigger {
      font-family: 'Montserrat', sans-serif !important;
      font-size: 15px !important;
      color: #010101 !important;
      display: flex !important;
      align-items: center !important;
      height: 40px !important;
      min-height: 40px !important;
      padding: 0 5px !important;
      border-radius: 6px !important;
    }
    .temporada-selector--supercenter .mat-mdc-select-arrow {
      color: #666666 !important;
      font-size: 20px !important;
      margin-top: 0 !important;
    }
    .temporada-selector--supercenter .mat-mdc-select-panel {
      font-family: 'Montserrat', sans-serif !important;
      font-size: 15px !important;
      box-shadow: var(--shadow-sm, 0 1px 2px rgba(0,0,0,0.05));
      border-radius: 6px !important;
      background: #fff !important;
    }
    .text-success {
      color: #2E7D32;
      font-size: 13px;
    }
  `]
})
export class TemporadaSelectorComponent {
  temporadaService = inject(TemporadaService);
  temporadaChange = output<Temporada>();

  onTemporadaChange(temporada: Temporada): void {
    this.temporadaService.selectTemporada(temporada);
    this.temporadaChange.emit(temporada);
  }
}
