import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { Usuario, PermisoModulo } from '../services/admin.service';

interface DialogData {
  usuario: Usuario;
  permisos: PermisoModulo[];
}

interface ModuloConfig {
  id: string;
  nombre: string;
  descripcion: string;
  icon: string;
}

@Component({
  selector: 'app-permisos-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <h2 mat-dialog-title class="flex items-center gap-2">
      <mat-icon class="text-red-600">security</mat-icon>
      Permisos de {{ data.usuario.nombre }}
    </h2>

    <mat-dialog-content class="py-4">
      <p class="text-sm text-gray-500 mb-4">
        Configura el nivel de acceso para cada módulo del sistema.
      </p>

      <div class="flex flex-col gap-4">
        @for (modulo of modulos; track modulo.id) {
          <div class="flex items-center justify-between p-4 rounded-lg border border-gray-200 bg-gray-50">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full flex items-center justify-center"
                   [ngClass]="getModuloIconBg(modulo.id)">
                <mat-icon [ngClass]="getModuloIconColor(modulo.id)">{{ modulo.icon }}</mat-icon>
              </div>
              <div>
                <p class="font-medium text-gray-900">{{ modulo.nombre }}</p>
                <p class="text-xs text-gray-500">{{ modulo.descripcion }}</p>
              </div>
            </div>

            <mat-form-field appearance="outline" class="w-40 !mb-0">
              <mat-select [(ngModel)]="permisos[modulo.id]">
                @for (nivel of nivelesAcceso; track nivel.value) {
                  <mat-option [value]="nivel.value">
                    {{ nivel.label }}
                  </mat-option>
                }
              </mat-select>
            </mat-form-field>
          </div>
        }
      </div>

      <div class="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
        <div class="flex items-start gap-2">
          <mat-icon class="text-amber-600 !text-lg">info</mat-icon>
          <div class="text-xs text-amber-800">
            <p class="font-medium">Niveles de acceso:</p>
            <ul class="mt-1 space-y-0.5">
              <li><strong>Completo:</strong> Lectura, escritura y administración</li>
              <li><strong>Escritura:</strong> Lectura y edición de datos</li>
              <li><strong>Lectura:</strong> Solo visualización</li>
              <li><strong>Ninguno:</strong> Sin acceso al módulo</li>
            </ul>
          </div>
        </div>
      </div>
    </mat-dialog-content>

    <mat-dialog-actions align="end" class="px-6 pb-4">
      <button mat-button mat-dialog-close class="!text-gray-600 !font-medium">Cancelar</button>
      <button class="btn-teatro" (click)="submit()">
        Guardar Permisos
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    ::ng-deep .mat-mdc-form-field-subscript-wrapper {
      display: none !important;
    }
    .btn-teatro {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0.5rem 1.25rem;
      background-color: #CF102D;
      color: white;
      border: none;
      border-radius: 0.375rem;
      font-family: 'Montserrat', sans-serif;
      font-weight: 600;
      font-size: 0.875rem;
      cursor: pointer;
      transition: background-color 0.2s ease;
    }
    .btn-teatro:hover {
      background-color: #A00D24;
    }
    :host ::ng-deep .mat-mdc-dialog-title {
      font-family: 'Montserrat', sans-serif !important;
    }
    :host ::ng-deep .mat-mdc-form-field {
      font-family: 'Montserrat', sans-serif !important;
    }
    :host ::ng-deep .mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-notched-outline__leading,
    :host ::ng-deep .mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-notched-outline__notch,
    :host ::ng-deep .mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-notched-outline__trailing {
      border-color: #d1d5db !important;
    }
    :host ::ng-deep .mdc-text-field--outlined.mdc-text-field--focused .mdc-notched-outline__leading,
    :host ::ng-deep .mdc-text-field--outlined.mdc-text-field--focused .mdc-notched-outline__notch,
    :host ::ng-deep .mdc-text-field--outlined.mdc-text-field--focused .mdc-notched-outline__trailing {
      border-color: #CF102D !important;
    }
    :host ::ng-deep .mat-mdc-form-field-focus-overlay {
      background-color: transparent !important;
    }
    :host ::ng-deep .mat-mdc-select-arrow {
      color: #6b7280 !important;
    }
  `]
})
export class PermisosDialogComponent {
  dialogRef = inject(MatDialogRef<PermisosDialogComponent>);
  data: DialogData = inject(MAT_DIALOG_DATA);

  modulos: ModuloConfig[] = [
    { id: 'TEMPO', nombre: 'TEMPO', descripcion: 'Calendario y espacios', icon: 'calendar_month' },
    { id: 'TOPS', nombre: 'TOPS', descripcion: 'Guiones técnicos', icon: 'description' },
    { id: 'ADMIN', nombre: 'Admin', descripcion: 'Gestión de usuarios', icon: 'admin_panel_settings' }
  ];

  nivelesAcceso = [
    { value: 'COMPLETO', label: 'Completo' },
    { value: 'ESCRITURA', label: 'Escritura' },
    { value: 'LECTURA', label: 'Lectura' },
    { value: 'NINGUNO', label: 'Ninguno' }
  ];

  permisos: Record<string, string> = {};

  constructor() {
    // Initialize permisos from data
    this.modulos.forEach(m => {
      const existing = this.data.permisos.find(p => p.modulo === m.id);
      this.permisos[m.id] = existing?.nivelAcceso || 'NINGUNO';
    });
  }

  getModuloIconBg(modulo: string): string {
    const colors: Record<string, string> = {
      'TEMPO': 'bg-blue-100',
      'TOPS': 'bg-green-100',
      'ADMIN': 'bg-red-100'
    };
    return colors[modulo] || 'bg-gray-100';
  }

  getModuloIconColor(modulo: string): string {
    const colors: Record<string, string> = {
      'TEMPO': 'text-blue-600',
      'TOPS': 'text-green-600',
      'ADMIN': 'text-red-600'
    };
    return colors[modulo] || 'text-gray-600';
  }

  submit(): void {
    const result = this.modulos.map(m => ({
      modulo: m.id,
      nivelAcceso: this.permisos[m.id]
    }));
    this.dialogRef.close(result);
  }
}
