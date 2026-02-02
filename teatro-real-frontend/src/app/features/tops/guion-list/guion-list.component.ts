// teatro-real-frontend/src/app/features/tops/guion-list/guion-list.component.ts

import { Component, OnInit, inject, computed, signal, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { GuionService } from '../services/guion.service';
import { ThemeService } from '../../../core/services/theme.service';
import { ESTADO_LABELS } from '../models/guion.model';

interface DashboardStats {
  total: number;
  enEdicion: number;
  totalTops: number;
}

@Component({
  selector: 'app-guion-list',
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

    /* Card styles */
    .guion-card {
      border-radius: 1rem;
      padding: 0;
      position: relative;
      overflow: hidden;
      transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.3s;
      cursor: pointer;
    }

    .guion-card-light {
      background: #ffffff;
      border: 1px solid rgba(15, 23, 42, 0.08);
      box-shadow: 0 20px 35px rgba(15, 23, 42, 0.1);
    }

    .guion-card-dark {
      background: #1e1e2d;
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 20px 35px rgba(0, 0, 0, 0.3);
    }

    .guion-card:hover {
      transform: translateY(-5px);
    }

    .guion-card-light:hover {
      box-shadow: 0 30px 55px rgba(15, 23, 42, 0.15);
    }

    .guion-card-dark:hover {
      box-shadow: 0 30px 55px rgba(0, 0, 0, 0.4);
    }

    .card-grid {
      display: grid;
      gap: 1.5rem;
    }

    @media (min-width: 768px) {
      .card-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    }

    @media (min-width: 1280px) {
      .card-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
    }

    .color-banner {
      height: 4px;
      width: 100%;
    }

    .card-content {
      padding: 1.5rem;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.5rem;
      padding: 1rem;
      border-radius: 0.5rem;
      margin: 1rem 0;
    }

    .stats-grid-light { background: #f3f4f6; }
    .stats-grid-dark { background: #2d2d3d; }

    .btn-edit {
      display: flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.5rem 1rem;
      background: #CF102D;
      color: white;
      border: none;
      border-radius: 6px;
      font-weight: 600;
      font-size: 0.8rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-edit:hover {
      background: #a80d25;
    }

    .badge-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      padding: 0.25rem 0.75rem;
      border-radius: 999px;
      font-weight: 600;
      font-size: 0.7rem;
    }

    .badge-lock-light { background: #fef3c7; color: #d97706; }
    .badge-lock-dark { background: #451a03; color: #fbbf24; }

    .metadata-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
    }

    .metadata-icon-light { color: #9ca3af; }
    .metadata-icon-dark { color: #6b7280; }
    .metadata-text-light { color: #6b7280; }
    .metadata-text-dark { color: #9ca3af; }

    /* Error banner */
    .error-banner {
      margin: 0 2rem 1rem 2rem;
      padding: 1rem 1.5rem;
      border-radius: 0.75rem;
      animation: slideIn 0.3s ease;
    }

    @keyframes slideIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .error-banner-light {
      background: linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%);
      border: 1px solid #F87171;
      color: #991B1B;
    }

    .error-banner-dark {
      background: linear-gradient(135deg, #450A0A 0%, #7F1D1D 100%);
      border: 1px solid #DC2626;
      color: #FCA5A5;
    }

    .retry-btn {
      display: flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.5rem 1rem;
      background: rgba(255, 255, 255, 0.2);
      border: 1px solid currentColor;
      border-radius: 0.5rem;
      font-weight: 600;
      font-size: 0.8rem;
      cursor: pointer;
      transition: all 0.2s;
      color: inherit;
    }

    .retry-btn:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: scale(1.02);
    }

    /* Empty state */
    .empty-state {
      border-radius: 1rem;
      padding: 4rem 2rem;
      text-align: center;
    }

    .empty-state-light {
      background: white;
      border: 1px solid rgba(15, 23, 42, 0.08);
    }

    .empty-state-dark {
      background: #1e1e2d;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .empty-icon {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.5rem auto;
    }

    .empty-icon-light { background: #f3f4f6; }
    .empty-icon-dark { background: #2d2d3d; }

    /* Loading spinner */
    .spinner {
      width: 48px;
      height: 48px;
      border: 4px solid;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    .spinner-light {
      border-color: #e5e7eb;
      border-top-color: #CF102D;
    }

    .spinner-dark {
      border-color: #3d3d4d;
      border-top-color: #CF102D;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

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
      overflow: hidden;
      isolation: isolate;
    }

    .modal-content {
      border-radius: 16px;
      padding: 1.5rem;
      width: calc(100% - 2rem);
      max-width: 500px;
      margin: 1rem;
      overflow: visible;
      transition: background-color 0.3s, box-shadow 0.3s;
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
      margin-bottom: 1rem;
      padding-bottom: 0.75rem;
    }

    .modal-header-light { border-bottom: 1px solid #e5e7eb; }
    .modal-header-dark { border-bottom: 1px solid #3d3d4d; }

    .modal-title {
      font-size: 1.125rem;
      font-weight: 600;
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

    .form-group { margin-bottom: 0.875rem; }

    .form-label {
      display: block;
      font-size: 0.75rem;
      font-weight: 600;
      margin-bottom: 0.35rem;
      text-transform: uppercase;
      letter-spacing: 0.025em;
    }

    .form-label-light { color: #6b7280; }
    .form-label-dark { color: #9ca3af; }

    .form-input, .form-select {
      width: 100%;
      padding: 0.5rem 0.75rem;
      border-radius: 6px;
      font-size: 0.875rem;
      transition: all 0.2s;
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
      box-shadow: 0 0 0 2px rgba(207, 16, 45, 0.2);
    }

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
      margin-top: 1rem;
      padding-top: 1rem;
    }

    .modal-actions-light { border-top: 1px solid #e5e7eb; }
    .modal-actions-dark { border-top: 1px solid #3d3d4d; }

    .btn-cancel {
      padding: 0.5rem 1rem;
      border-radius: 6px;
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
      padding: 0.5rem 1rem;
      background: #CF102D;
      color: white;
      border: none;
      border-radius: 6px;
      font-weight: 600;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-save:hover { background: #a80d25; }
  `],
  template: `
    <div class="page-container" [class]="isDark() ? 'page-dark' : 'page-light'">
      <!-- Fixed Header -->
      <div class="fixed-header">
        <!-- Header -->
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h1 class="text-3xl font-semibold" [class]="isDark() ? 'text-title-dark' : 'text-title-light'">
              Guiones Técnicos (TOPS)
            </h1>
            <p [class]="isDark() ? 'text-subtitle-dark' : 'text-subtitle-light'">
              Editor de guiones técnicos y puntos de sincronización
            </p>
          </div>
          <button class="btn-nuevo" (click)="openCreateModal()">
            <span class="material-icons text-lg">add</span>
            Nuevo Guion
          </button>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <article class="stat-card" [class]="isDark() ? 'stat-card-dark' : 'stat-card-light'">
            <p class="text-sm uppercase tracking-wide" [class]="isDark() ? 'text-subtitle-dark' : 'text-subtitle-light'">Total Guiones</p>
            <p class="text-3xl font-semibold mt-1" [class]="isDark() ? 'text-title-dark' : 'text-title-light'">{{ stats().total }}</p>
          </article>
          <article class="stat-card" [class]="isDark() ? 'stat-card-dark' : 'stat-card-light'">
            <p class="text-sm uppercase tracking-wide" [class]="isDark() ? 'text-subtitle-dark' : 'text-subtitle-light'">En Edición</p>
            <p class="text-3xl font-semibold text-yellow-500 mt-1">{{ stats().enEdicion }}</p>
          </article>
          <article class="stat-card" [class]="isDark() ? 'stat-card-dark' : 'stat-card-light'">
            <p class="text-sm uppercase tracking-wide" [class]="isDark() ? 'text-subtitle-dark' : 'text-subtitle-light'">Total TOPs</p>
            <p class="text-3xl font-semibold text-red-500 mt-1">{{ stats().totalTops }}</p>
          </article>
        </div>
      </div>

      <!-- Error Banner -->
      @if (guionService.error()) {
        <div class="error-banner" [class]="isDark() ? 'error-banner-dark' : 'error-banner-light'">
          <div class="flex items-center gap-3">
            <span class="material-icons text-2xl">cloud_off</span>
            <div class="flex-1">
              <p class="font-semibold">Error al cargar guiones</p>
              <p class="text-sm opacity-80">{{ guionService.error() }}</p>
            </div>
            <button (click)="loadGuiones()" class="retry-btn">
              <span class="material-icons text-sm">refresh</span>
              Reintentar
            </button>
          </div>
        </div>
      }

      <!-- Scrollable Content -->
      <div class="scrollable-content">
        @if (guionService.loading()) {
          <!-- Loading State -->
          <div class="flex flex-col items-center justify-center py-24">
            <div class="spinner" [class]="isDark() ? 'spinner-dark' : 'spinner-light'"></div>
            <p class="mt-4" [class]="isDark() ? 'text-subtitle-dark' : 'text-subtitle-light'">Cargando guiones...</p>
          </div>
        } @else if (guiones().length === 0) {
          <!-- Empty State -->
          <div class="empty-state" [class]="isDark() ? 'empty-state-dark' : 'empty-state-light'">
            <div class="empty-icon" [class]="isDark() ? 'empty-icon-dark' : 'empty-icon-light'">
              <span class="material-icons text-4xl" [class]="isDark() ? 'text-gray-500' : 'text-gray-400'">library_books</span>
            </div>
            <h3 class="text-xl font-semibold mb-2" [class]="isDark() ? 'text-title-dark' : 'text-title-light'">No hay guiones técnicos</h3>
            <p class="max-w-md mx-auto" [class]="isDark() ? 'text-subtitle-dark' : 'text-subtitle-light'">
              No se encontraron guiones técnicos para la temporada actual.
            </p>
            <button class="btn-nuevo mt-6" (click)="openCreateModal()">
              <span class="material-icons text-lg">add</span>
              Crear Guion
            </button>
          </div>
        } @else {
          <!-- Guiones Grid -->
          <div class="card-grid">
            @for (guion of guiones(); track guion.id) {
              <div class="guion-card" [class]="isDark() ? 'guion-card-dark' : 'guion-card-light'" (click)="openEditor(guion.id)">
                <!-- Color Banner -->
                <div class="color-banner" [ngClass]="getEstadoColorClass(guion.estado)"></div>

                <div class="card-content">
                  <!-- Title & Company -->
                  <div class="mb-3">
                    <h3 class="text-lg font-bold" [class]="isDark() ? 'text-title-dark' : 'text-title-light'">
                      {{ guion.produccionNombre }}
                    </h3>
                    <p class="text-sm" [class]="isDark() ? 'text-subtitle-dark' : 'text-subtitle-light'">
                      {{ guion.compania || 'Teatro Real' }}
                    </p>
                  </div>

                  <!-- Lock Badge -->
                  @if (guion.locked) {
                    <div class="mb-3">
                      <span class="badge-pill" [class]="isDark() ? 'badge-lock-dark' : 'badge-lock-light'">
                        <span class="material-icons text-sm">lock</span>
                        {{ guion.lockedByNombre || 'En uso' }}
                      </span>
                    </div>
                  }

                  <!-- Stats Grid -->
                  <div class="stats-grid" [class]="isDark() ? 'stats-grid-dark' : 'stats-grid-light'">
                    <div class="text-center">
                      <p class="text-2xl font-bold" [class]="isDark() ? 'text-title-dark' : 'text-title-light'">{{ guion.totalActos || 0 }}</p>
                      <p class="text-xs uppercase tracking-wide" [class]="isDark() ? 'text-subtitle-dark' : 'text-subtitle-light'">Actos</p>
                    </div>
                    <div class="text-center border-l" [class]="isDark() ? 'border-gray-600' : 'border-gray-200'">
                      <p class="text-2xl font-bold text-red-500">{{ guion.totalTops || 0 }}</p>
                      <p class="text-xs uppercase tracking-wide" [class]="isDark() ? 'text-subtitle-dark' : 'text-subtitle-light'">TOPs</p>
                    </div>
                  </div>

                  <!-- Metadata -->
                  <div class="space-y-2 mb-4">
                    @if (guion.compositor) {
                      <div class="metadata-item">
                        <span class="material-icons text-base" [class]="isDark() ? 'metadata-icon-dark' : 'metadata-icon-light'">music_note</span>
                        <span class="truncate" [class]="isDark() ? 'metadata-text-dark' : 'metadata-text-light'">{{ guion.compositor }}</span>
                      </div>
                    }
                    @if (guion.directorEscena) {
                      <div class="metadata-item">
                        <span class="material-icons text-base" [class]="isDark() ? 'metadata-icon-dark' : 'metadata-icon-light'">person</span>
                        <span class="truncate" [class]="isDark() ? 'metadata-text-dark' : 'metadata-text-light'">Dir. Escena: {{ guion.directorEscena }}</span>
                      </div>
                    }
                    @if (guion.directorMusical) {
                      <div class="metadata-item">
                        <span class="material-icons text-base" [class]="isDark() ? 'metadata-icon-dark' : 'metadata-icon-light'">piano</span>
                        <span class="truncate" [class]="isDark() ? 'metadata-text-dark' : 'metadata-text-light'">Dir. Musical: {{ guion.directorMusical }}</span>
                      </div>
                    }
                  </div>

                  <!-- Actions -->
                  <div class="flex flex-col items-center gap-2 pt-4 border-t" [class]="isDark() ? 'border-gray-700' : 'border-gray-200'">
                    @if (guion.updatedAt) {
                      <span class="text-xs text-center" [class]="isDark() ? 'text-gray-500' : 'text-gray-400'">
                        Actualizado {{ formatDate(guion.updatedAt) }}
                      </span>
                    }
                    <button class="btn-edit" (click)="openEditor(guion.id); $event.stopPropagation()">
                      <span class="material-icons text-lg">edit</span>
                      Editar
                    </button>
                  </div>
                </div>
              </div>
            }
          </div>
        }
      </div>
    </div>

    <!-- Modal Crear Guion -->
    @if (showCreateModal()) {
      <div class="modal-overlay" (click)="closeCreateModal()">
        <div class="modal-content" [class]="isDark() ? 'modal-dark' : 'modal-light'" (click)="$event.stopPropagation()">
          <div class="modal-header" [class]="isDark() ? 'modal-header-dark' : 'modal-header-light'">
            <h2 class="modal-title" [class]="isDark() ? 'modal-title-dark' : 'modal-title-light'">Nuevo Guion Técnico</h2>
            <button class="btn-close" [class]="isDark() ? 'btn-close-dark' : 'btn-close-light'" (click)="closeCreateModal()">
              <span class="material-icons text-lg">close</span>
            </button>
          </div>

          <form (ngSubmit)="createGuion()">
            <div class="form-group">
              <label class="form-label" [class]="isDark() ? 'form-label-dark' : 'form-label-light'">Nombre de la Producción *</label>
              <input type="text" class="form-input" [class]="isDark() ? 'form-input-dark' : 'form-input-light'"
                     [(ngModel)]="formData.produccionNombre" name="produccionNombre" required placeholder="Ej: Carmen">
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div class="form-group">
                <label class="form-label" [class]="isDark() ? 'form-label-dark' : 'form-label-light'">Compañía</label>
                <input type="text" class="form-input" [class]="isDark() ? 'form-input-dark' : 'form-input-light'"
                       [(ngModel)]="formData.compania" name="compania" placeholder="Teatro Real">
              </div>
              <div class="form-group">
                <label class="form-label" [class]="isDark() ? 'form-label-dark' : 'form-label-light'">Temporada</label>
                <input type="text" class="form-input" [class]="isDark() ? 'form-input-dark' : 'form-input-light'"
                       [(ngModel)]="formData.temporada" name="temporada" placeholder="2024/2025">
              </div>
            </div>

            <div class="form-group">
              <label class="form-label" [class]="isDark() ? 'form-label-dark' : 'form-label-light'">Compositor</label>
              <input type="text" class="form-input" [class]="isDark() ? 'form-input-dark' : 'form-input-light'"
                     [(ngModel)]="formData.compositor" name="compositor" placeholder="Ej: Georges Bizet">
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div class="form-group">
                <label class="form-label" [class]="isDark() ? 'form-label-dark' : 'form-label-light'">Director de Escena</label>
                <input type="text" class="form-input" [class]="isDark() ? 'form-input-dark' : 'form-input-light'"
                       [(ngModel)]="formData.directorEscena" name="directorEscena" placeholder="Nombre">
              </div>
              <div class="form-group">
                <label class="form-label" [class]="isDark() ? 'form-label-dark' : 'form-label-light'">Director Musical</label>
                <input type="text" class="form-input" [class]="isDark() ? 'form-input-dark' : 'form-input-light'"
                       [(ngModel)]="formData.directorMusical" name="directorMusical" placeholder="Nombre">
              </div>
            </div>

            <div class="form-group">
              <label class="form-label" [class]="isDark() ? 'form-label-dark' : 'form-label-light'">Número de Actos</label>
              <select class="form-select" [class]="isDark() ? 'form-select-dark' : 'form-select-light'" [(ngModel)]="numActos" name="numActos">
                <option [value]="1">1 Acto</option>
                <option [value]="2">2 Actos</option>
                <option [value]="3">3 Actos</option>
                <option [value]="4">4 Actos</option>
                <option [value]="5">5 Actos</option>
              </select>
            </div>

            <div class="modal-actions" [class]="isDark() ? 'modal-actions-dark' : 'modal-actions-light'">
              <button type="button" class="btn-cancel" [class]="isDark() ? 'btn-cancel-dark' : 'btn-cancel-light'" (click)="closeCreateModal()">Cancelar</button>
              <button type="submit" class="btn-save" [disabled]="!formData.produccionNombre">Crear Guion</button>
            </div>
          </form>
        </div>
      </div>
    }
  `
})
export class GuionListComponent implements OnInit {
  private router = inject(Router);
  private theme = inject(ThemeService);
  private destroyRef = inject(DestroyRef);

  guionService = inject(GuionService);
  isDark = this.theme.isDark;

  // Usar guiones directamente sin filtro
  guiones = this.guionService.guiones;
  showCreateModal = signal(false);

  formData: any = {};
  numActos = 3;

  stats = computed<DashboardStats>(() => {
    const guiones = this.guiones();
    return {
      total: guiones.length,
      enEdicion: guiones.filter(g => g.estado === 'EN_EDICION' || g.locked).length,
      totalTops: guiones.reduce((sum, g) => sum + (g.totalTops || 0), 0)
    };
  });

  ngOnInit(): void {
    // Cargar todos los guiones sin filtro de temporada
    this.loadGuiones();
    this.resetForm();
  }

  loadGuiones(): void {
    // Cargar sin filtro de temporada - todos los guiones
    this.guionService.loadGuiones().subscribe();
  }

  openEditor(guionId: string): void {
    this.router.navigate(['/tops', guionId]);
  }

  openCreateModal(): void {
    this.resetForm();
    this.showCreateModal.set(true);
  }

  closeCreateModal(): void {
    this.showCreateModal.set(false);
    this.resetForm();
  }

  resetForm(): void {
    this.formData = {
      produccionNombre: '',
      compania: 'Teatro Real',
      temporada: '2024/2025',
      compositor: '',
      directorEscena: '',
      directorMusical: ''
    };
    this.numActos = 3;
  }

  createGuion(): void {
    if (!this.formData.produccionNombre) return;

    this.guionService.create(this.formData, this.numActos)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (guion) => {
          this.closeCreateModal();
          this.router.navigate(['/tops', guion.id]);
        },
        error: (err) => {
          console.error('Error creando guion:', err);
        }
      });
  }

  getEstadoLabel(estado: string): string {
    return ESTADO_LABELS[estado as keyof typeof ESTADO_LABELS] || estado;
  }

  getEstadoColorClass(estado: string): string {
    const colors: Record<string, string> = {
      'BORRADOR': 'bg-gray-400',
      'EN_EDICION': 'bg-yellow-500',
      'VALIDADO': 'bg-green-500',
      'PUBLICADO': 'bg-blue-500'
    };
    return colors[estado] || 'bg-gray-400';
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'hace un momento';
    if (diffMins < 60) return `hace ${diffMins} min`;
    if (diffHours < 24) return `hace ${diffHours}h`;
    if (diffDays < 7) return `hace ${diffDays}d`;

    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  }
}
