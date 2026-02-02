import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { Rol, Usuario } from '../services/admin.service';

interface DialogData {
  mode: 'create' | 'edit';
  usuario?: Usuario;
  roles: Rol[];
}

@Component({
  selector: 'app-usuario-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule
  ],
  styles: [`
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
    .btn-teatro:hover:not(:disabled) {
      background-color: #A00D24;
    }
    .btn-teatro:disabled {
      background-color: #e5e7eb;
      color: #9ca3af;
      cursor: not-allowed;
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
  `],
  template: `
    <h2 mat-dialog-title class="flex items-center gap-2">
      <mat-icon class="text-red-600">{{ data.mode === 'create' ? 'person_add' : 'edit' }}</mat-icon>
      {{ data.mode === 'create' ? 'Nuevo Usuario' : 'Editar Usuario' }}
    </h2>

    <mat-dialog-content class="py-4">
      <div class="flex flex-col gap-4">
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Nombre completo</mat-label>
          <input matInput [(ngModel)]="form.nombre" placeholder="Ej: Juan García" required />
          <mat-icon matPrefix>person</mat-icon>
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Email</mat-label>
          <input matInput [(ngModel)]="form.email" type="email" placeholder="usuario@teatroreal.es" required />
          <mat-icon matPrefix>email</mat-icon>
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ data.mode === 'create' ? 'Contraseña' : 'Nueva contraseña (dejar vacío para mantener)' }}</mat-label>
          <input matInput [(ngModel)]="form.password" type="password" [required]="data.mode === 'create'" />
          <mat-icon matPrefix>lock</mat-icon>
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Rol</mat-label>
          <mat-select [(ngModel)]="form.rolId" required>
            @for (rol of data.roles; track rol.id) {
              <mat-option [value]="rol.id">
                {{ rol.nombre }} - {{ rol.descripcion }}
              </mat-option>
            }
          </mat-select>
          <mat-icon matPrefix>badge</mat-icon>
        </mat-form-field>
      </div>
    </mat-dialog-content>

    <mat-dialog-actions align="end" class="px-6 pb-4">
      <button mat-button mat-dialog-close class="!text-gray-600 !font-medium">Cancelar</button>
      <button class="btn-teatro" (click)="submit()" [disabled]="!isValid()">
        {{ data.mode === 'create' ? 'Crear' : 'Guardar' }}
      </button>
    </mat-dialog-actions>
  `
})
export class UsuarioDialogComponent {
  dialogRef = inject(MatDialogRef<UsuarioDialogComponent>);
  data: DialogData = inject(MAT_DIALOG_DATA);

  form = {
    nombre: this.data.usuario?.nombre || '',
    email: this.data.usuario?.email || '',
    password: '',
    rolId: this.data.usuario?.rol?.id || null as number | null
  };

  isValid(): boolean {
    if (!this.form.nombre || !this.form.email || !this.form.rolId) {
      return false;
    }
    if (this.data.mode === 'create' && !this.form.password) {
      return false;
    }
    return true;
  }

  submit(): void {
    if (this.isValid()) {
      const result: any = {
        nombre: this.form.nombre,
        email: this.form.email,
        rolId: this.form.rolId
      };

      if (this.form.password) {
        result.password = this.form.password;
      }

      this.dialogRef.close(result);
    }
  }
}
