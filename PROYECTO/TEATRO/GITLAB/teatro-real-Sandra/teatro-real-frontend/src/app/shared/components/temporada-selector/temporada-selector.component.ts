import { Component, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TemporadaService } from '../../../core/services/temporada.service';
import { Temporada } from '../../../../features/tempo/models/actividad.model';

@Component({
  selector: 'app-temporada-selector',
  standalone: true,
  imports: [CommonModule, MatSelectModule, MatFormFieldModule],
  template: `
    <mat-form-field class="w-48">
      <mat-label>Temporada</mat-label>
      <mat-select
        [value]="temporadaService.selectedTemporada()"
        (selectionChange)="onTemporadaChange($event.value)">
        @for (temporada of temporadaService.temporadas(); track temporada.id) {
          <mat-option [value]="temporada">
            {{ temporada.nombre }}
            @if (temporada.activa) {
              <span class="text-green-600 text-sm ml-2">(Actual)</span>
            }
          </mat-option>
        }
      </mat-select>
    </mat-form-field>
  `
})
export class TemporadaSelectorComponent {
  temporadaService = inject(TemporadaService);
  temporadaChange = output<Temporada>();

  onTemporadaChange(temporada: Temporada): void {
    this.temporadaService.selectTemporada(temporada);
    this.temporadaChange.emit(temporada);
  }
}
