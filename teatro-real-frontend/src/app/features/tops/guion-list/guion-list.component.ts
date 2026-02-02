// teatro-real-frontend/src/app/features/tops/guion-list/guion-list.component.ts

import { Component, OnInit, inject, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';

import { GuionService } from '../services/guion.service';
import { TemporadaService } from '../../../core/services/temporada.service';
import { Guion, ESTADO_LABELS } from '../models/guion.model';
import { GuionCreateDialogComponent } from './guion-create-dialog.component';

/**
 * GuionList - Lista de guiones técnicos
 * Landing page del módulo TOPS - Diseño inspirado en Material Tailwind
 */
@Component({
  selector: 'app-guion-list',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatChipsModule,
    MatTooltipModule,
    MatDividerModule
  ],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Header Section -->
      <div class="bg-white border-b border-gray-200 px-6 py-5">
        <div class="max-w-7xl mx-auto">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 class="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <mat-icon class="text-red-600">description</mat-icon>
                Guiones Técnicos (TOPS)
              </h1>
              <p class="text-gray-500 mt-1">
                Editor de guiones técnicos y puntos de sincronización
              </p>
            </div>
            <div class="flex items-center gap-3">
              <span class="text-sm text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
                Temporada {{ temporadaActual() }}
              </span>
              <button mat-icon-button
                      matTooltip="Recargar guiones"
                      (click)="loadGuiones()"
                      class="!bg-gray-100 hover:!bg-gray-200">
                <mat-icon>refresh</mat-icon>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="max-w-7xl mx-auto px-6 py-8">
        <!-- Loading State -->
        @if (guionService.loading()) {
          <div class="flex flex-col items-center justify-center py-24">
            <mat-spinner diameter="56" color="warn"></mat-spinner>
            <p class="mt-4 text-gray-500">Cargando guiones...</p>
          </div>
        } @else if (guionService.error()) {
          <!-- Error State -->
          <div class="bg-red-50 border border-red-200 rounded-xl p-6 flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <mat-icon class="text-red-600">error_outline</mat-icon>
              </div>
              <div>
                <h3 class="font-semibold text-red-800">Error al cargar guiones</h3>
                <p class="text-red-600 text-sm">{{ guionService.error() }}</p>
              </div>
            </div>
            <button mat-flat-button color="warn" (click)="loadGuiones()">
              <mat-icon class="mr-2">refresh</mat-icon>
              Reintentar
            </button>
          </div>
        } @else if (guiones().length === 0) {
          <!-- Empty State -->
          <div class="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div class="w-20 h-20 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-6">
              <mat-icon class="!text-4xl text-gray-400">library_books</mat-icon>
            </div>
            <h3 class="text-xl font-semibold text-gray-800 mb-2">No hay guiones disponibles</h3>
            <p class="text-gray-500 mb-6 max-w-md mx-auto">
              Los guiones técnicos se crean automáticamente desde la sección de Producciones
              cuando se inicia una nueva temporada.
            </p>
            <button mat-stroked-button color="primary">
              <mat-icon class="mr-2">movie</mat-icon>
              Ir a Producciones
            </button>
          </div>
        } @else {
          <!-- Guiones Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (guion of guiones(); track guion.id) {
              <div class="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all duration-200 cursor-pointer group"
                   (click)="openEditor(guion.id)">
                <!-- Card Header with Color Banner -->
                <div class="h-2" [ngClass]="getEstadoColorClass(guion.estado)"></div>

                <div class="p-5">
                  <!-- Title & Company -->
                  <div class="mb-4">
                    <h3 class="text-lg font-bold text-gray-900 group-hover:text-red-600 transition-colors">
                      {{ guion.produccionNombre }}
                    </h3>
                    <p class="text-sm text-gray-500">{{ guion.compania || 'Teatro Real' }}</p>
                  </div>

                  <!-- Lock Badge (solo si está bloqueado) -->
                  @if (guion.locked) {
                    <div class="mb-4">
                      <span class="inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full bg-orange-100 text-orange-700">
                        <mat-icon class="!text-sm mr-1">lock</mat-icon>
                        {{ guion.lockedByNombre || 'En uso' }}
                      </span>
                    </div>
                  }

                  <!-- Stats Grid -->
                  <div class="grid grid-cols-2 gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
                    <div class="text-center">
                      <p class="text-2xl font-bold text-gray-900">{{ guion.totalActos || 0 }}</p>
                      <p class="text-xs text-gray-500 uppercase tracking-wide">Actos</p>
                    </div>
                    <div class="text-center border-l border-gray-200">
                      <p class="text-2xl font-bold text-red-600">{{ guion.totalTops || 0 }}</p>
                      <p class="text-xs text-gray-500 uppercase tracking-wide">TOPs</p>
                    </div>
                  </div>

                  <!-- Metadata -->
                  <div class="space-y-2 text-sm">
                    @if (guion.compositor) {
                      <div class="flex items-center gap-2 text-gray-600">
                        <mat-icon class="!text-base text-gray-400">music_note</mat-icon>
                        <span class="truncate">{{ guion.compositor }}</span>
                      </div>
                    }
                    @if (guion.directorEscena) {
                      <div class="flex items-center gap-2 text-gray-600">
                        <mat-icon class="!text-base text-gray-400">person</mat-icon>
                        <span class="truncate">Dir. Escena: {{ guion.directorEscena }}</span>
                      </div>
                    }
                    @if (guion.directorMusical) {
                      <div class="flex items-center gap-2 text-gray-600">
                        <mat-icon class="!text-base text-gray-400">piano</mat-icon>
                        <span class="truncate">Dir. Musical: {{ guion.directorMusical }}</span>
                      </div>
                    }
                  </div>

                  <!-- Divider -->
                  <mat-divider class="!my-4"></mat-divider>

                  <!-- Actions -->
                  <div class="flex flex-col items-center gap-2">
                    @if (guion.updatedAt) {
                      <span class="text-xs text-gray-400 text-center">
                        Actualizado {{ formatDate(guion.updatedAt) }}
                      </span>
                    }
                    <button class="btn-primary-teatro !py-2 !px-4 !w-auto !text-sm flex items-center gap-1"
                            (click)="openEditor(guion.id); $event.stopPropagation()">
                      <mat-icon class="!text-lg">edit</mat-icon>
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
  `,
  styles: [`
    :host {
      display: block;
    }

    /* Custom scrollbar */
    :host ::ng-deep .mat-mdc-card {
      --mdc-elevated-card-container-color: white;
    }
  `]
})
export class GuionListComponent implements OnInit {
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private temporadaService = inject(TemporadaService);

  guionService = inject(GuionService);

  guiones = this.guionService.guionesFiltrados;
  temporadaActual = computed(() =>
    this.temporadaService.temporadaActiva()?.nombre || '2024/2025'
  );

  totalTops = computed(() =>
    this.guiones().reduce((sum, g) => sum + (g.totalTops || 0), 0)
  );

  private guionesLoaded = false;

  constructor() {
    // Effect que reacciona cuando la temporada esté disponible
    effect(() => {
      const temporada = this.temporadaService.temporadaActiva();
      // Solo cargar una vez cuando la temporada esté lista
      if (temporada && !this.guionesLoaded) {
        this.guionesLoaded = true;
        // Usar setTimeout para salir del contexto del effect
        setTimeout(() => {
          this.guionService.loadGuiones(temporada.nombre).subscribe();
        }, 0);
      }
    });
  }

  ngOnInit(): void {
    // Asegurar que las temporadas se carguen primero
    this.temporadaService.ensureLoaded();

    // Si no hay temporada configurada, cargar guiones sin filtro después de un breve delay
    setTimeout(() => {
      if (!this.guionesLoaded) {
        this.loadGuiones();
      }
    }, 500);
  }

  loadGuiones(): void {
    this.guionesLoaded = true;
    const temporada = this.temporadaService.temporadaActiva();
    this.guionService.loadGuiones(temporada?.nombre).subscribe();
  }

  openEditor(guionId: string): void {
    this.router.navigate(['/tops', guionId]);
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(GuionCreateDialogComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadGuiones();
      }
    });
  }

  getEstadoLabel(estado: string): string {
    return ESTADO_LABELS[estado as keyof typeof ESTADO_LABELS] || estado;
  }

  countByEstado(estado: string): number {
    return this.guiones().filter(g => g.estado === estado).length;
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

  getEstadoBadgeClass(estado: string): string {
    const classes: Record<string, string> = {
      'BORRADOR': 'bg-gray-100 text-gray-700',
      'EN_EDICION': 'bg-yellow-100 text-yellow-700',
      'VALIDADO': 'bg-green-100 text-green-700',
      'PUBLICADO': 'bg-blue-100 text-blue-700'
    };
    return classes[estado] || 'bg-gray-100 text-gray-700';
  }

  getEstadoDotClass(estado: string): string {
    const classes: Record<string, string> = {
      'BORRADOR': 'bg-gray-500',
      'EN_EDICION': 'bg-yellow-500',
      'VALIDADO': 'bg-green-500',
      'PUBLICADO': 'bg-blue-500'
    };
    return classes[estado] || 'bg-gray-500';
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
