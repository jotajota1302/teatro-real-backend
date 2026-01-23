import { Component, Input, forwardRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

// Colores institucionales + algunos extra frecuentes
const DEFAULT_PALETTE = [
  '#c9a227', // Teatro gold
  '#1a1a2e', // Teatro primary
  '#e94560', // Teatro accent
  '#22C55E', // Verde estado completado
  '#3B82F6', // Azul estado tránsito
  '#FFA500', // Naranja estado pendiente
  '#FF0000', // Rojo
  '#008000', // Verde
  '#0000FF', // Azul estándar
  '#FA8072', // Salmon
  '#808080', // Gris
  '#ffffff', // Blanco
  '#000000', // Negro
];

@Component({
  selector: 'app-color-picker',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <div class="flex flex-col gap-1">
      <div class="flex flex-wrap gap-2">
        <button *ngFor="let color of palette"
          mat-button
          [ngStyle]="{'background-color': color, 'color': getContrast(color)}"
          class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center p-0 focus:outline focus:outline-2"
          [attr.aria-label]="color"
          [class.ring-2]="color === value()"
          [class.ring-teatro-gold]="color === value()"
          (click)="selectColor(color)">
          <span *ngIf="color === value()">✔</span>
        </button>
      </div>
      <mat-form-field appearance="outline" class="w-32 mt-2">
        <mat-label>Otro color</mat-label>
        <input matInput [(ngModel)]="customColor"
               (ngModelChange)="onCustomColorChange($event)"
               placeholder="#RRGGBB o nombre"
               maxlength="64"
               autocomplete="off"
               [attr.aria-label]="'Color personalizado'"/>
        <div matSuffix *ngIf="customColor" [ngStyle]="{'background-color': customColor}" class="w-5 h-5 rounded-full border ml-2"></div>
      </mat-form-field>
    </div>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ColorPickerComponent),
      multi: true,
    },
  ]
})
export class ColorPickerComponent implements ControlValueAccessor {
  @Input() palette: string[] = DEFAULT_PALETTE;

  value = signal<string>('');
  customColor: string = '';

  onChange: any = () => {};
  onTouched: any = () => {};

  selectColor(color: string) {
    this.value.set(color);
    this.customColor = color;
    this.onChange(color);
    this.onTouched();
  }

  onCustomColorChange(color: string) {
    this.value.set(color);
    this.onChange(color);
    this.onTouched();
  }

  writeValue(value: string): void {
    this.value.set(value);
    this.customColor = value || '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // Si es necesario, puedes manejar el estado disabled aquí.
  }

  getContrast(bg: string): string {
    // Muy simple, mejora si necesitas mejor a11y
    if (!bg) return '#222';
    try {
      // bg === "#rrggbb"
      const hex = bg.charAt(0) === '#' ? bg.slice(1) : bg;
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);
      const yiq = (r*299 + g*587 + b*114) / 1000;
      return yiq >= 128 ? '#222' : '#fff';
    } catch {
      return '#222';
    }
  }
}
