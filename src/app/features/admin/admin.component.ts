import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService, Usuario, Rol, PermisoModulo } from './services/admin.service';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styles: [`
    :host {
      display: block;
      height: 100%;
    }

    .page-container {
      display: flex;
      flex-direction: column;
      height: 100%;
      transition: background-color 0.3s;
    }

    .page-light { background: #f2f4f7; }
    .page-dark {
      background: #1a1a1a;
      border-radius: 1rem;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .fixed-header {
      flex-shrink: 0;
      padding: 1.5rem 2rem 0 2rem;
    }

    .scrollable-content {
      flex: 1;
      overflow-y: auto;
      padding: 0 2rem 2rem 2rem;
    }

    .stat-card {
      border-radius: 0.9rem;
      padding: 1.2rem;
      transition: background-color 0.3s;
    }

    .stat-card-light {
      border: 1px solid rgba(15, 23, 42, 0.08);
      background: #ffffff;
      box-shadow: 0 15px 30px rgba(15, 23, 42, 0.08);
    }

    .stat-card-dark {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: #1e1e2d;
      box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
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

    .btn-nuevo:hover {
      background: #a80d25;
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(207, 16, 45, 0.4);
    }

    /* Text colors */
    .text-title-light { color: #1f2937; }
    .text-title-dark { color: #ffffff; }
    .text-subtitle-light { color: #6b7280; }
    .text-subtitle-dark { color: #9ca3af; }

    /* Table styles */
    .table-container {
      border-radius: 1rem;
      overflow: hidden;
      transition: background-color 0.3s;
    }

    .table-light {
      background: #ffffff;
      border: 1px solid rgba(15, 23, 42, 0.08);
      box-shadow: 0 15px 30px rgba(15, 23, 42, 0.08);
    }

    .table-dark {
      background: #1e1e2d;
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
    }

    .table-header {
      padding: 1rem 1.5rem;
      border-bottom: 1px solid;
    }

    .table-header-light { border-color: #e5e7eb; }
    .table-header-dark { border-color: #3d3d4d; }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th {
      padding: 0.75rem 1.5rem;
      text-align: left;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .th-light { background: #f9fafb; color: #6b7280; }
    .th-dark { background: #2d2d3d; color: #9ca3af; }

    td {
      padding: 1rem 1.5rem;
      border-top: 1px solid;
    }

    .td-light { border-color: #e5e7eb; }
    .td-dark { border-color: #3d3d4d; }

    tr:hover td {
      background: rgba(0, 0, 0, 0.02);
    }

    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 0.875rem;
    }

    .avatar-light { background: #e5e7eb; color: #374151; }
    .avatar-dark { background: #3d3d4d; color: #d1d5db; }

    .badge {
      display: inline-flex;
      align-items: center;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .badge-admin { background: #fee2e2; color: #dc2626; }
    .badge-gestor { background: #dbeafe; color: #2563eb; }
    .badge-operador { background: #dcfce7; color: #16a34a; }
    .badge-visualizador { background: #f3f4f6; color: #6b7280; }

    .badge-permiso {
      display: inline-flex;
      padding: 0.125rem 0.5rem;
      border-radius: 0.25rem;
      font-size: 0.7rem;
      font-weight: 600;
      margin-right: 0.25rem;
    }

    .badge-completo { background: #dcfce7; color: #16a34a; }
    .badge-escritura { background: #dbeafe; color: #2563eb; }
    .badge-lectura { background: #f3f4f6; color: #6b7280; }

    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      display: inline-block;
      margin-right: 0.5rem;
    }

    .status-active { background: #22c55e; }
    .status-inactive { background: #9ca3af; }

    .btn-action {
      width: 32px;
      height: 32px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: none;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-action-light { background: #f3f4f6; color: #374151; }
    .btn-action-light:hover { background: #e5e7eb; }
    .btn-action-dark { background: #2d2d3d; color: #9ca3af; }
    .btn-action-dark:hover { background: #3d3d4d; }

    .btn-action-danger:hover { background: #dc2626 !important; color: white !important; }

    /* Modal styles */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      backdrop-filter: blur(4px);
    }

    .modal-content {
      border-radius: 16px;
      padding: 1.5rem;
      width: calc(100% - 2rem);
      max-width: 500px;
      margin: 1rem;
      transition: background-color 0.3s;
    }

    .modal-light {
      background: white;
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
    }

    .modal-dark {
      background: #1e1e2d;
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.25rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid;
    }

    .modal-header-light { border-color: #e5e7eb; }
    .modal-header-dark { border-color: #3d3d4d; }

    .modal-title {
      font-size: 1.125rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .modal-title-light { color: #1f2937; }
    .modal-title-dark { color: #ffffff; }

    .btn-close {
      width: 32px;
      height: 32px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: none;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-close-light { background: #f3f4f6; color: #374151; }
    .btn-close-light:hover { background: #e5e7eb; }
    .btn-close-dark { background: #2d2d3d; color: #9ca3af; }
    .btn-close-dark:hover { background: #3d3d4d; }

    .form-group { margin-bottom: 1rem; }

    .form-label {
      display: block;
      font-size: 0.75rem;
      font-weight: 600;
      margin-bottom: 0.375rem;
      text-transform: uppercase;
      letter-spacing: 0.025em;
    }

    .form-label-light { color: #6b7280; }
    .form-label-dark { color: #9ca3af; }

    .form-input, .form-select {
      width: 100%;
      padding: 0.625rem 0.875rem;
      border-radius: 8px;
      font-size: 0.875rem;
      transition: all 0.2s;
      font-family: 'Montserrat', sans-serif;
    }

    .form-input-light, .form-select-light {
      background: white;
      border: 1px solid #d1d5db;
      color: #1f2937;
    }

    .form-input-dark, .form-select-dark {
      background: #2d2d3d;
      border: 1px solid #3d3d4d;
      color: #ffffff;
    }

    .form-input:focus, .form-select:focus {
      outline: none;
      border-color: #CF102D;
      box-shadow: 0 0 0 3px rgba(207, 16, 45, 0.15);
    }

    .form-input::placeholder {
      color: #9ca3af;
    }

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
      margin-top: 1.5rem;
      padding-top: 1rem;
      border-top: 1px solid;
    }

    .modal-actions-light { border-color: #e5e7eb; }
    .modal-actions-dark { border-color: #3d3d4d; }

    .btn-cancel {
      padding: 0.625rem 1.25rem;
      border-radius: 8px;
      font-weight: 500;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-cancel-light {
      background: #f3f4f6;
      color: #374151;
      border: 1px solid #d1d5db;
    }
    .btn-cancel-light:hover { background: #e5e7eb; }

    .btn-cancel-dark {
      background: #2d2d3d;
      color: #d1d5db;
      border: 1px solid #3d3d4d;
    }
    .btn-cancel-dark:hover { background: #3d3d4d; }

    .btn-save {
      padding: 0.625rem 1.25rem;
      background: #CF102D;
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-save:hover { background: #a80d25; }
    .btn-save:disabled {
      background: #e5e7eb;
      color: #9ca3af;
      cursor: not-allowed;
    }

    .btn-delete {
      padding: 0.625rem 1.25rem;
      border: 1px solid #dc2626;
      border-radius: 8px;
      font-weight: 500;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s;
      margin-right: auto;
    }

    .btn-delete-light { background: white; color: #dc2626; }
    .btn-delete-dark { background: transparent; color: #f87171; border-color: #f87171; }
    .btn-delete:hover { background: #dc2626; color: white; border-color: #dc2626; }

    /* Permisos grid */
    .permisos-grid {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .permiso-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.75rem;
      border-radius: 8px;
    }

    .permiso-row-light { background: #f9fafb; }
    .permiso-row-dark { background: #2d2d3d; }

    .permiso-info {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .permiso-icon {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .permiso-icon-tempo { background: #dbeafe; color: #2563eb; }
    .permiso-icon-tops { background: #dcfce7; color: #16a34a; }
    .permiso-icon-admin { background: #fee2e2; color: #dc2626; }

    .permiso-select {
      padding: 0.375rem 0.75rem;
      border-radius: 6px;
      font-size: 0.8rem;
      min-width: 120px;
    }

    /* Empty state */
    .empty-state {
      padding: 4rem 2rem;
      text-align: center;
    }

    .empty-icon {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1rem;
    }

    .empty-icon-light { background: #f3f4f6; }
    .empty-icon-dark { background: #2d2d3d; }

    /* Loading spinner */
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4rem;
    }

    .spinner {
      width: 48px;
      height: 48px;
      border: 3px solid #e5e7eb;
      border-top-color: #CF102D;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `],
  template: `
    <div class="page-container" [class]="isDark() ? 'page-dark' : 'page-light'">
      <!-- Header -->
      <div class="fixed-header">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h1 class="text-3xl font-semibold" [class]="isDark() ? 'text-title-dark' : 'text-title-light'">Administración</h1>
            <p [class]="isDark() ? 'text-subtitle-dark' : 'text-subtitle-light'">Gestión de usuarios y permisos del sistema</p>
          </div>
          <button class="btn-nuevo" (click)="openUsuarioModal()">
            <span class="material-icons text-lg">person_add</span>
            Nuevo Usuario
          </button>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <article class="stat-card" [class]="isDark() ? 'stat-card-dark' : 'stat-card-light'">
            <p class="text-sm uppercase tracking-wide" [class]="isDark() ? 'text-subtitle-dark' : 'text-subtitle-light'">Total Usuarios</p>
            <p class="text-3xl font-semibold mt-1" [class]="isDark() ? 'text-title-dark' : 'text-title-light'">{{ totalUsuarios() }}</p>
          </article>
          <article class="stat-card" [class]="isDark() ? 'stat-card-dark' : 'stat-card-light'">
            <p class="text-sm uppercase tracking-wide" [class]="isDark() ? 'text-subtitle-dark' : 'text-subtitle-light'">Activos</p>
            <p class="text-3xl font-semibold text-green-500 mt-1">{{ usuariosActivos() }}</p>
          </article>
          <article class="stat-card" [class]="isDark() ? 'stat-card-dark' : 'stat-card-light'">
            <p class="text-sm uppercase tracking-wide" [class]="isDark() ? 'text-subtitle-dark' : 'text-subtitle-light'">Administradores</p>
            <p class="text-3xl font-semibold text-red-500 mt-1">{{ adminCount() }}</p>
          </article>
        </div>
      </div>

      <!-- Content -->
      <div class="scrollable-content">
        @if (adminService.loading()) {
          <div class="loading-container">
            <div class="spinner"></div>
            <p class="mt-4" [class]="isDark() ? 'text-subtitle-dark' : 'text-subtitle-light'">Cargando usuarios...</p>
          </div>
        } @else if (adminService.usuarios().length === 0) {
          <div class="table-container" [class]="isDark() ? 'table-dark' : 'table-light'">
            <div class="empty-state">
              <div class="empty-icon" [class]="isDark() ? 'empty-icon-dark' : 'empty-icon-light'">
                <span class="material-icons text-3xl" [class]="isDark() ? 'text-gray-500' : 'text-gray-400'">person_off</span>
              </div>
              <h3 class="text-lg font-semibold mb-2" [class]="isDark() ? 'text-title-dark' : 'text-title-light'">No hay usuarios</h3>
              <p class="mb-4" [class]="isDark() ? 'text-subtitle-dark' : 'text-subtitle-light'">Crea el primer usuario para comenzar</p>
              <button class="btn-nuevo" (click)="openUsuarioModal()">
                <span class="material-icons text-lg">person_add</span>
                Crear Usuario
              </button>
            </div>
          </div>
        } @else {
          <div class="table-container" [class]="isDark() ? 'table-dark' : 'table-light'">
            <div class="table-header" [class]="isDark() ? 'table-header-dark' : 'table-header-light'">
              <h2 class="text-lg font-semibold" [class]="isDark() ? 'text-title-dark' : 'text-title-light'">Usuarios del Sistema</h2>
            </div>
            <div class="overflow-x-auto">
              <table>
                <thead>
                  <tr>
                    <th [class]="isDark() ? 'th-dark' : 'th-light'">Usuario</th>
                    <th [class]="isDark() ? 'th-dark' : 'th-light'">Rol</th>
                    <th [class]="isDark() ? 'th-dark' : 'th-light'">Permisos</th>
                    <th [class]="isDark() ? 'th-dark' : 'th-light'">Estado</th>
                    <th [class]="isDark() ? 'th-dark' : 'th-light'" style="text-align: right;">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  @for (usuario of adminService.usuarios(); track usuario.id) {
                    <tr>
                      <td [class]="isDark() ? 'td-dark' : 'td-light'">
                        <div class="flex items-center gap-3">
                          <div class="avatar" [class]="isDark() ? 'avatar-dark' : 'avatar-light'">
                            {{ getInitials(usuario.nombre) }}
                          </div>
                          <div>
                            <p class="font-medium" [class]="isDark() ? 'text-white' : 'text-gray-900'">{{ usuario.nombre }}</p>
                            <p class="text-sm" [class]="isDark() ? 'text-gray-400' : 'text-gray-500'">{{ usuario.email }}</p>
                          </div>
                        </div>
                      </td>
                      <td [class]="isDark() ? 'td-dark' : 'td-light'">
                        <span class="badge" [ngClass]="getRolBadgeClass(usuario.rol?.nombre)">
                          {{ usuario.rol?.nombre || 'Sin rol' }}
                        </span>
                      </td>
                      <td [class]="isDark() ? 'td-dark' : 'td-light'">
                        <div class="flex flex-wrap gap-1">
                          @for (permiso of getUsuarioPermisos(usuario.id); track permiso.modulo) {
                            @if (permiso.nivelAcceso !== 'NINGUNO') {
                              <span class="badge-permiso" [ngClass]="getPermisoBadgeClass(permiso.nivelAcceso)">
                                {{ permiso.modulo }}
                              </span>
                            }
                          }
                        </div>
                      </td>
                      <td [class]="isDark() ? 'td-dark' : 'td-light'">
                        <span class="flex items-center text-sm" [class]="usuario.activo ? 'text-green-600' : 'text-gray-400'">
                          <span class="status-dot" [class]="usuario.activo ? 'status-active' : 'status-inactive'"></span>
                          {{ usuario.activo ? 'Activo' : 'Inactivo' }}
                        </span>
                      </td>
                      <td [class]="isDark() ? 'td-dark' : 'td-light'">
                        <div class="flex items-center justify-end gap-2">
                          <button class="btn-action" [class]="isDark() ? 'btn-action-dark' : 'btn-action-light'" (click)="openUsuarioModal(usuario)" title="Editar">
                            <span class="material-icons text-base">edit</span>
                          </button>
                          <button class="btn-action" [class]="isDark() ? 'btn-action-dark' : 'btn-action-light'" (click)="openPermisosModal(usuario)" title="Permisos">
                            <span class="material-icons text-base">security</span>
                          </button>
                          <button class="btn-action btn-action-danger" [class]="isDark() ? 'btn-action-dark' : 'btn-action-light'" (click)="deleteUsuario(usuario)" title="Eliminar">
                            <span class="material-icons text-base">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        }
      </div>
    </div>

    <!-- Modal Usuario -->
    @if (showUsuarioModal()) {
      <div class="modal-overlay" (click)="closeUsuarioModal()">
        <div class="modal-content" [class]="isDark() ? 'modal-dark' : 'modal-light'" (click)="$event.stopPropagation()">
          <div class="modal-header" [class]="isDark() ? 'modal-header-dark' : 'modal-header-light'">
            <h2 class="modal-title" [class]="isDark() ? 'modal-title-dark' : 'modal-title-light'">
              <span class="material-icons text-[#CF102D]">{{ editingUsuario() ? 'edit' : 'person_add' }}</span>
              {{ editingUsuario() ? 'Editar Usuario' : 'Nuevo Usuario' }}
            </h2>
            <button class="btn-close" [class]="isDark() ? 'btn-close-dark' : 'btn-close-light'" (click)="closeUsuarioModal()">
              <span class="material-icons">close</span>
            </button>
          </div>

          <form (ngSubmit)="saveUsuario()">
            <div class="form-group">
              <label class="form-label" [class]="isDark() ? 'form-label-dark' : 'form-label-light'">Nombre completo *</label>
              <input type="text" class="form-input" [class]="isDark() ? 'form-input-dark' : 'form-input-light'"
                     [(ngModel)]="usuarioForm.nombre" name="nombre" required placeholder="Ej: Juan García">
            </div>

            <div class="form-group">
              <label class="form-label" [class]="isDark() ? 'form-label-dark' : 'form-label-light'">Email *</label>
              <input type="email" class="form-input" [class]="isDark() ? 'form-input-dark' : 'form-input-light'"
                     [(ngModel)]="usuarioForm.email" name="email" required placeholder="usuario@teatroreal.es">
            </div>

            <div class="form-group">
              <label class="form-label" [class]="isDark() ? 'form-label-dark' : 'form-label-light'">
                {{ editingUsuario() ? 'Nueva contraseña (dejar vacío para mantener)' : 'Contraseña *' }}
              </label>
              <input type="password" class="form-input" [class]="isDark() ? 'form-input-dark' : 'form-input-light'"
                     [(ngModel)]="usuarioForm.password" name="password" [required]="!editingUsuario()" placeholder="••••••••">
            </div>

            <div class="form-group">
              <label class="form-label" [class]="isDark() ? 'form-label-dark' : 'form-label-light'">Rol *</label>
              <select class="form-select" [class]="isDark() ? 'form-select-dark' : 'form-select-light'"
                      [(ngModel)]="usuarioForm.rolId" name="rolId" required>
                <option [ngValue]="null">Seleccionar rol...</option>
                @for (rol of adminService.roles(); track rol.id) {
                  <option [ngValue]="rol.id">{{ rol.nombre }} - {{ rol.descripcion }}</option>
                }
              </select>
            </div>

            <div class="modal-actions" [class]="isDark() ? 'modal-actions-dark' : 'modal-actions-light'">
              <button type="button" class="btn-cancel" [class]="isDark() ? 'btn-cancel-dark' : 'btn-cancel-light'" (click)="closeUsuarioModal()">
                Cancelar
              </button>
              <button type="submit" class="btn-save" [disabled]="!isUsuarioFormValid()">
                {{ editingUsuario() ? 'Guardar' : 'Crear' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    }

    <!-- Modal Permisos -->
    @if (showPermisosModal()) {
      <div class="modal-overlay" (click)="closePermisosModal()">
        <div class="modal-content" [class]="isDark() ? 'modal-dark' : 'modal-light'" (click)="$event.stopPropagation()">
          <div class="modal-header" [class]="isDark() ? 'modal-header-dark' : 'modal-header-light'">
            <h2 class="modal-title" [class]="isDark() ? 'modal-title-dark' : 'modal-title-light'">
              <span class="material-icons text-[#CF102D]">security</span>
              Permisos de {{ permisosUsuario()?.nombre }}
            </h2>
            <button class="btn-close" [class]="isDark() ? 'btn-close-dark' : 'btn-close-light'" (click)="closePermisosModal()">
              <span class="material-icons">close</span>
            </button>
          </div>

          <p class="text-sm mb-4" [class]="isDark() ? 'text-subtitle-dark' : 'text-subtitle-light'">
            Configura el nivel de acceso para cada módulo del sistema.
          </p>

          <div class="permisos-grid">
            @for (modulo of modulosConfig; track modulo.id) {
              <div class="permiso-row" [class]="isDark() ? 'permiso-row-dark' : 'permiso-row-light'">
                <div class="permiso-info">
                  <div class="permiso-icon" [ngClass]="'permiso-icon-' + modulo.id.toLowerCase()">
                    <span class="material-icons text-lg">{{ modulo.icon }}</span>
                  </div>
                  <div>
                    <p class="font-medium text-sm" [class]="isDark() ? 'text-white' : 'text-gray-900'">{{ modulo.nombre }}</p>
                    <p class="text-xs" [class]="isDark() ? 'text-gray-400' : 'text-gray-500'">{{ modulo.descripcion }}</p>
                  </div>
                </div>
                <select class="permiso-select form-select" [class]="isDark() ? 'form-select-dark' : 'form-select-light'"
                        [(ngModel)]="permisosForm[modulo.id]">
                  @for (nivel of nivelesAcceso; track nivel.value) {
                    <option [value]="nivel.value">{{ nivel.label }}</option>
                  }
                </select>
              </div>
            }
          </div>

          <div class="modal-actions" [class]="isDark() ? 'modal-actions-dark' : 'modal-actions-light'">
            <button type="button" class="btn-cancel" [class]="isDark() ? 'btn-cancel-dark' : 'btn-cancel-light'" (click)="closePermisosModal()">
              Cancelar
            </button>
            <button type="button" class="btn-save" (click)="savePermisos()">
              Guardar Permisos
            </button>
          </div>
        </div>
      </div>
    }
  `
})
export class AdminComponent implements OnInit {
  adminService = inject(AdminService);
  private theme = inject(ThemeService);

  isDark = this.theme.isDark;

  // Stats
  totalUsuarios = signal(0);
  usuariosActivos = signal(0);
  adminCount = signal(0);

  // Permisos cache
  usuarioPermisos = signal<Map<string, PermisoModulo[]>>(new Map());

  // Modal Usuario
  showUsuarioModal = signal(false);
  editingUsuario = signal<Usuario | null>(null);
  usuarioForm = {
    nombre: '',
    email: '',
    password: '',
    rolId: null as number | null
  };

  // Modal Permisos
  showPermisosModal = signal(false);
  permisosUsuario = signal<Usuario | null>(null);
  permisosForm: Record<string, string> = {};

  // Config
  modulosConfig = [
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

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.adminService.loadRoles().subscribe();
    this.adminService.loadUsuarios().subscribe({
      next: usuarios => {
        this.totalUsuarios.set(usuarios.length);
        this.usuariosActivos.set(usuarios.filter(u => u.activo).length);
        this.adminCount.set(usuarios.filter(u => u.rol?.nombre === 'ADMIN').length);
        usuarios.forEach(u => this.loadUsuarioPermisos(u.id));
      }
    });
  }

  loadUsuarioPermisos(usuarioId: string): void {
    this.adminService.getPermisosModulo(usuarioId).subscribe({
      next: permisos => {
        const current = this.usuarioPermisos();
        const updated = new Map(current);
        updated.set(usuarioId, permisos);
        this.usuarioPermisos.set(updated);
      }
    });
  }

  getUsuarioPermisos(usuarioId: string): PermisoModulo[] {
    return this.usuarioPermisos().get(usuarioId) || [];
  }

  getInitials(nombre: string): string {
    return nombre.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  }

  getRolBadgeClass(rol?: string): string {
    const classes: Record<string, string> = {
      'ADMIN': 'badge-admin',
      'GESTOR': 'badge-gestor',
      'OPERADOR': 'badge-operador',
      'VISUALIZADOR': 'badge-visualizador'
    };
    return classes[rol || ''] || 'badge-visualizador';
  }

  getPermisoBadgeClass(nivel: string): string {
    const classes: Record<string, string> = {
      'COMPLETO': 'badge-completo',
      'ESCRITURA': 'badge-escritura',
      'LECTURA': 'badge-lectura'
    };
    return classes[nivel] || 'badge-lectura';
  }

  // Usuario Modal
  openUsuarioModal(usuario?: Usuario): void {
    if (usuario) {
      this.editingUsuario.set(usuario);
      this.usuarioForm = {
        nombre: usuario.nombre,
        email: usuario.email,
        password: '',
        rolId: usuario.rol?.id || null
      };
    } else {
      this.editingUsuario.set(null);
      this.usuarioForm = { nombre: '', email: '', password: '', rolId: null };
    }
    this.showUsuarioModal.set(true);
  }

  closeUsuarioModal(): void {
    this.showUsuarioModal.set(false);
    this.editingUsuario.set(null);
  }

  isUsuarioFormValid(): boolean {
    if (!this.usuarioForm.nombre || !this.usuarioForm.email || !this.usuarioForm.rolId) {
      return false;
    }
    if (!this.editingUsuario() && !this.usuarioForm.password) {
      return false;
    }
    return true;
  }

  saveUsuario(): void {
    if (!this.isUsuarioFormValid()) return;

    const data: any = {
      nombre: this.usuarioForm.nombre,
      email: this.usuarioForm.email,
      rolId: this.usuarioForm.rolId
    };

    if (this.usuarioForm.password) {
      data.password = this.usuarioForm.password;
    }

    const editing = this.editingUsuario();
    if (editing) {
      this.adminService.updateUsuario(editing.id, data).subscribe({
        next: () => {
          this.closeUsuarioModal();
          this.loadData();
        }
      });
    } else {
      this.adminService.createUsuario(data).subscribe({
        next: () => {
          this.closeUsuarioModal();
          this.loadData();
        }
      });
    }
  }

  deleteUsuario(usuario: Usuario): void {
    if (confirm(`¿Estás seguro de que quieres eliminar a ${usuario.nombre}?`)) {
      this.adminService.deleteUsuario(usuario.id).subscribe({
        next: () => this.loadData()
      });
    }
  }

  // Permisos Modal
  openPermisosModal(usuario: Usuario): void {
    this.permisosUsuario.set(usuario);
    const permisos = this.getUsuarioPermisos(usuario.id);

    this.permisosForm = {};
    this.modulosConfig.forEach(m => {
      const existing = permisos.find(p => p.modulo === m.id);
      this.permisosForm[m.id] = existing?.nivelAcceso || 'NINGUNO';
    });

    this.showPermisosModal.set(true);
  }

  closePermisosModal(): void {
    this.showPermisosModal.set(false);
    this.permisosUsuario.set(null);
  }

  savePermisos(): void {
    const usuario = this.permisosUsuario();
    if (!usuario) return;

    const permisos = this.modulosConfig.map(m => ({
      modulo: m.id,
      nivelAcceso: this.permisosForm[m.id]
    }));

    this.adminService.updatePermisosModulo(usuario.id, permisos).subscribe({
      next: () => {
        this.loadUsuarioPermisos(usuario.id);
        this.closePermisosModal();
      }
    });
  }
}
