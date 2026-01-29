// teatro-real-frontend/src/app/features/tops/editor/guion-editor.component.ts

import { Component, OnInit, OnDestroy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { GuionService } from '../services/guion.service';
import { EditableCellComponent } from '../components/editable-cell.component';
import { EditableTextComponent } from '../components/editable-text.component';
import {
  GuionCompleto,
  Acto,
  Escena,
  PasadaItem,
  ElementoGuion,
  ESTADO_LABELS
} from '../models/guion.model';
import { AuthService } from '../../../core/auth/auth.service';

/**
 * GuionEditor - Editor tipo Word para guiones técnicos
 * Canvas con fondo gris, página blanca, tablas editables
 */
@Component({
  selector: 'app-guion-editor',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTooltipModule,
    EditableCellComponent,
    EditableTextComponent
  ],
  template: `
    <!-- Viewport tipo Word (fondo gris) -->
    <div class="min-h-screen bg-gray-300 p-5 pb-16 overflow-y-auto">

      <!-- Toolbar -->
      <div class="bg-white rounded shadow-sm p-3 mb-5 flex items-center gap-4 max-w-6xl mx-auto">
        <button mat-icon-button (click)="goBack()" matTooltip="Volver a lista">
          <mat-icon>arrow_back</mat-icon>
        </button>

        <span class="flex-1 font-semibold text-gray-800 text-sm">
          {{ guion()?.produccionNombre || 'Guion Técnico' }}
          @if (guion()?.locked) {
            <span class="ml-2 text-xs text-orange-600">
              (Editando: {{ guion()?.lockedByNombre }})
            </span>
          }
        </span>

        <!-- Estado -->
        <span class="text-xs px-2 py-1 rounded"
              [class.bg-gray-200]="guion()?.estado === 'BORRADOR'"
              [class.bg-yellow-200]="guion()?.estado === 'EN_EDICION'"
              [class.bg-green-200]="guion()?.estado === 'VALIDADO'"
              [class.bg-blue-200]="guion()?.estado === 'PUBLICADO'">
          {{ estadoLabel() }}
        </span>

        <!-- Botón Lock/Unlock -->
        @if (!isLocked()) {
          <button class="inline-flex items-center gap-1 px-4 py-2 text-sm font-semibold border-2 border-red-600 text-red-600 rounded hover:bg-red-600 hover:text-white transition-colors"
                  (click)="lockGuion()">
            <mat-icon class="!text-lg">lock_open</mat-icon>
            Editar
          </button>
        } @else if (isLockedByMe()) {
          <button class="inline-flex items-center gap-1 px-4 py-2 text-sm font-semibold border-2 border-orange-500 text-orange-600 rounded hover:bg-orange-500 hover:text-white transition-colors"
                  (click)="unlockGuion()">
            <mat-icon class="!text-lg">lock</mat-icon>
            Liberar
          </button>
        }

        <button class="inline-flex items-center gap-1 px-4 py-2 text-sm font-semibold bg-gray-300 text-gray-500 rounded cursor-not-allowed"
                disabled
                matTooltip="Próximamente">
          <mat-icon class="!text-lg">download</mat-icon>
          Exportar Word
        </button>
      </div>

      <!-- Loading -->
      @if (guionService.loading()) {
        <div class="flex flex-col items-center justify-center py-20">
          <mat-spinner diameter="48"></mat-spinner>
          <p class="mt-4 text-gray-600">Cargando guion...</p>
        </div>
      } @else if (guionService.error()) {
        <!-- Error -->
        <div class="bg-red-50 border border-red-200 rounded p-4 max-w-4xl mx-auto text-center">
          <p class="text-red-700">{{ guionService.error() }}</p>
          <button class="mt-3 px-4 py-2 text-sm font-semibold bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                  (click)="loadGuion()">
            Reintentar
          </button>
        </div>
      } @else if (guion()) {
        <!-- PÁGINA DEL DOCUMENTO -->
        <div class="bg-white max-w-6xl w-full mx-auto p-8 shadow-lg font-serif text-sm leading-relaxed text-black">

          <!-- Header del documento -->
          <div class="text-center mb-6">
            <app-editable-text
              [value]="guion()?.produccionNombre || ''"
              (valueChange)="updateGuionField('produccionNombre', $event)"
              fontSize="28pt"
              fontWeight="bold"
              marginBottom="8pt"
              placeholder="TÍTULO DE LA OBRA"
              [className]="!canEdit() ? 'pointer-events-none' : ''"
            />

            <app-editable-text
              [value]="guion()?.subtitulo || ''"
              (valueChange)="updateGuionField('subtitulo', $event)"
              fontSize="16pt"
              fontStyle="italic"
              marginBottom="8pt"
              placeholder="Subtítulo (ej: Ópera en cuatro actos)"
              [className]="!canEdit() ? 'pointer-events-none' : ''"
            />

            <app-editable-text
              [value]="guion()?.compositor || ''"
              (valueChange)="updateGuionField('compositor', $event)"
              fontSize="14pt"
              marginBottom="20pt"
              placeholder="Nombre del compositor"
              [className]="!canEdit() ? 'pointer-events-none' : ''"
            />
          </div>

          <!-- Metadatos -->
          <div class="border-t border-b border-black py-4 mb-7 space-y-3">
            <div class="text-xs">
              <span class="font-bold block mb-1">Producción:</span>
              <app-editable-text
                [value]="guion()?.compania || ''"
                (valueChange)="updateGuionField('compania', $event)"
                placeholder="Teatro Real"
              />
            </div>
            <div class="text-xs">
              <span class="font-bold block mb-1">Director de Escena:</span>
              <app-editable-text
                [value]="guion()?.directorEscena || ''"
                (valueChange)="updateGuionField('directorEscena', $event)"
                placeholder="Nombre del director de escena"
              />
            </div>
            <div class="text-xs">
              <span class="font-bold block mb-1">Director Musical:</span>
              <app-editable-text
                [value]="guion()?.directorMusical || ''"
                (valueChange)="updateGuionField('directorMusical', $event)"
                placeholder="Nombre del director musical"
              />
            </div>
            <div class="text-xs">
              <span class="font-bold block mb-1">Versión:</span>
              <span>{{ guion()?.version || 1 }} - {{ guion()?.versionNombre || 'Inicial' }}</span>
            </div>
          </div>

          <!-- Actos -->
          @for (acto of guion()?.actos || []; track acto.id) {
            <div class="mb-6">
              <!-- Título del Acto -->
              <div class="text-lg font-bold mt-7 mb-3.5 border-b-2 border-black pb-1.5 font-serif">
                <app-editable-text
                  [value]="acto.nombre"
                  (valueChange)="updateActo(acto.id, 'nombre', $event)"
                  placeholder="NOMBRE DEL ACTO"
                  fontWeight="bold"
                  [className]="!canEdit() ? 'pointer-events-none' : ''"
                />
              </div>

              <!-- Tabla Pasada -->
              <div class="text-sm font-bold uppercase mt-3 mb-2.5 font-serif">PASADA</div>
              <table class="w-full border-collapse mb-4 text-xs">
                <thead>
                  <tr>
                    <th class="border border-black p-1.5 text-left font-bold bg-gray-100 w-[10%]">DPTO</th>
                    <th class="border border-black p-1.5 text-left font-bold bg-gray-100 w-[12%]">LUGAR</th>
                    <th class="border border-black p-1.5 text-left font-bold bg-gray-100 w-[70%]">DESCRIPCIÓN</th>
                    <th class="border border-black p-1.5 text-center font-bold bg-gray-100 w-[8%]"></th>
                  </tr>
                </thead>
                <tbody>
                  @for (item of acto.pasada || []; track item.id) {
                    <tr>
                      <app-editable-cell
                        [value]="item.departamento || ''"
                        (valueChange)="updatePasadaItem(acto.id, item.id, 'departamento', $event)"
                        placeholder="M.E."
                      />
                      <app-editable-cell
                        [value]="item.lugar || ''"
                        (valueChange)="updatePasadaItem(acto.id, item.id, 'lugar', $event)"
                        placeholder="Varas"
                      />
                      <app-editable-cell
                        [value]="item.descripcion || ''"
                        (valueChange)="updatePasadaItem(acto.id, item.id, 'descripcion', $event)"
                        placeholder="Descripción del setup..."
                        [multiline]="true"
                        [imagen]="item.imagen || null"
                      />
                      <td class="border border-black p-1 text-center whitespace-nowrap">
                        @if (canEdit()) {
                          <button class="w-6 h-6 inline-flex items-center justify-center rounded hover:bg-blue-100 opacity-40 hover:opacity-100 transition-opacity"
                                  (click)="insertPasadaItem(acto.id, item.orden); $event.stopPropagation()"
                                  title="Insertar fila">
                            <mat-icon class="!text-base text-blue-600">add</mat-icon>
                          </button>
                          <button class="w-6 h-6 inline-flex items-center justify-center rounded hover:bg-red-100 opacity-40 hover:opacity-100 transition-opacity"
                                  (click)="deletePasadaItem(acto.id, item.id); $event.stopPropagation()"
                                  title="Eliminar fila">
                            <mat-icon class="!text-base text-red-600">delete</mat-icon>
                          </button>
                        }
                      </td>
                    </tr>
                  }
                  <!-- Fila agregar -->
                  @if (canEdit()) {
                    <tr>
                      <td colspan="4"
                          class="border border-black p-2 text-center text-gray-500 text-xs cursor-pointer opacity-50 hover:opacity-100 hover:bg-gray-50"
                          (click)="addPasadaItem(acto.id)">
                        + Agregar línea de pasada
                      </td>
                    </tr>
                  }
                </tbody>
              </table>

              <!-- Escenas del Acto -->
              @for (escena of acto.escenas || []; track escena.id) {
                <div>
                  <!-- Título Escena -->
                  <div class="flex items-center justify-between mt-5 mb-2.5">
                    <div class="text-sm font-bold uppercase font-serif">
                      <span>ESCENA: </span>
                      <app-editable-text
                        [value]="escena.nombre"
                        (valueChange)="updateEscena(acto.id, escena.id, 'nombre', $event)"
                        placeholder="Nombre de la escena"
                        className="inline uppercase"
                      />
                      @if (escena.duracion) {
                        <span class="font-normal"> (c. {{ escena.duracion }})</span>
                      }
                    </div>
                    @if (canEdit()) {
                      <button class="w-6 h-6 inline-flex items-center justify-center rounded hover:bg-red-100 opacity-40 hover:opacity-100 transition-opacity"
                              (click)="deleteEscena(acto.id, escena.id)"
                              title="Eliminar escena">
                        <mat-icon class="!text-base text-red-600">delete</mat-icon>
                      </button>
                    }
                  </div>

                  <!-- Tabla TOPs -->
                  <table class="w-full border-collapse mb-4 text-xs">
                    <thead>
                      <tr>
                        <th class="border border-black p-1.5 text-left font-bold bg-gray-100 w-[10%]">PIE</th>
                        <th class="border border-black p-1.5 text-left font-bold bg-gray-100 w-[8%]">TOP</th>
                        <th class="border border-black p-1.5 text-left font-bold bg-gray-100 w-[10%]">DPTO</th>
                        <th class="border border-black p-1.5 text-left font-bold bg-gray-100 w-[32%]">QUIEN/QUE</th>
                        <th class="border border-black p-1.5 text-left font-bold bg-gray-100 w-[32%]">OBSERVACIONES</th>
                        <th class="border border-black p-1.5 text-center font-bold bg-gray-100 w-[8%]"></th>
                      </tr>
                    </thead>
                    <tbody>
                      @for (elem of escena.elementos || []; track elem.id) {
                        <tr>
                          <app-editable-cell
                            [value]="elem.pagina || ''"
                            (valueChange)="updateElemento(escena.id, elem.id, 'pagina', $event)"
                            placeholder="4/5/4"
                          />
                          <app-editable-cell
                            [value]="elem.tipoElemento === 'TOP' ? elem.numero || '' : elem.tipoElemento"
                            (valueChange)="updateElementoNumero(escena.id, elem, $event)"
                            [bold]="elem.tipoElemento === 'TOP'"
                            [color]="elem.tipoElemento === 'TOP' ? '#b71c1c' : '#000'"
                          />
                          <app-editable-cell
                            [value]="elem.departamento || ''"
                            (valueChange)="updateElemento(escena.id, elem.id, 'departamento', $event)"
                            placeholder="M.E."
                          />
                          <app-editable-cell
                            [value]="elem.descripcion || ''"
                            (valueChange)="updateElemento(escena.id, elem.id, 'descripcion', $event)"
                            placeholder="Descripción..."
                          />
                          <app-editable-cell
                            [value]="elem.observaciones || ''"
                            (valueChange)="updateElemento(escena.id, elem.id, 'observaciones', $event)"
                            placeholder=""
                          />
                          <td class="border border-black p-1 text-center whitespace-nowrap">
                            @if (canEdit()) {
                              <button class="w-5 h-5 inline-flex items-center justify-center rounded hover:bg-blue-100 opacity-40 hover:opacity-100 transition-opacity"
                                      (click)="insertElemento(escena.id, elem.orden); $event.stopPropagation()"
                                      title="Insertar fila">
                                <mat-icon class="!text-sm text-blue-600">add</mat-icon>
                              </button>
                              <button class="w-5 h-5 inline-flex items-center justify-center rounded hover:bg-red-100 opacity-40 hover:opacity-100 transition-opacity"
                                      (click)="deleteElemento(escena.id, elem.id); $event.stopPropagation()"
                                      title="Eliminar fila">
                                <mat-icon class="!text-sm text-red-600">delete</mat-icon>
                              </button>
                            }
                          </td>
                        </tr>
                      }
                      <!-- Fila agregar -->
                      @if (canEdit()) {
                        <tr>
                          <td colspan="6"
                              class="border border-black p-2 text-center text-gray-500 text-xs cursor-pointer opacity-50 hover:opacity-100 hover:bg-gray-50"
                              (click)="addElemento(escena.id)">
                            + Agregar fila (Tab desde última celda)
                          </td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              }

              <!-- Agregar Escena -->
              @if (canEdit()) {
                <div class="text-center p-3 text-gray-500 cursor-pointer border border-dashed border-gray-300 rounded mt-3 hover:bg-gray-50 hover:border-gray-500"
                     (click)="addEscena(acto.id)">
                  <mat-icon class="align-middle mr-1 text-base">add</mat-icon>
                  Agregar escena a {{ acto.nombre }}
                </div>
              }
            </div>
          }

          <!-- Agregar Acto -->
          @if (canEdit()) {
            <div class="text-center p-4 text-gray-500 cursor-pointer border-2 border-dashed border-gray-300 rounded mt-6 hover:bg-gray-50 hover:border-gray-500"
                 (click)="addActo()">
              <mat-icon class="align-middle mr-2 text-xl">add</mat-icon>
              Agregar nuevo acto
            </div>
          }

        </div>
      }
    </div>
  `,
  styles: [`
    .font-serif {
      font-family: 'Times New Roman', Times, serif;
    }
  `]
})
export class GuionEditorComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private authService = inject(AuthService);

  guionService = inject(GuionService);

  guion = this.guionService.guionActual;

  estadoLabel = computed(() => {
    const estado = this.guion()?.estado;
    return estado ? ESTADO_LABELS[estado] : '';
  });

  isLocked = computed(() => this.guion()?.locked ?? false);

  isLockedByMe = computed(() => {
    const guion = this.guion();
    const user = this.authService.currentUser();
    return guion?.locked && guion?.lockedById === user?.id;
  });

  canEdit = computed(() => {
    // Puede editar si tiene el lock o si no está bloqueado
    return this.isLockedByMe() || !this.isLocked();
  });

  private guionId: string | null = null;

  ngOnInit(): void {
    this.guionId = this.route.snapshot.paramMap.get('id');
    if (this.guionId) {
      this.loadGuion();
    }
  }

  ngOnDestroy(): void {
    // Liberar bloqueo si lo tenemos
    if (this.isLockedByMe() && this.guionId) {
      this.guionService.unlockGuion(this.guionId).subscribe();
    }
  }

  loadGuion(): void {
    if (this.guionId) {
      this.guionService.getByIdCompleto(this.guionId).subscribe({
        error: () => this.showError('Error al cargar el guion')
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/tops']);
  }

  lockGuion(): void {
    if (this.guionId) {
      this.guionService.lockGuion(this.guionId).subscribe({
        next: () => {
          this.loadGuion(); // Recargar para obtener datos actualizados
          this.showSuccess('Guion bloqueado para edición');
        },
        error: (err) => this.showError(err?.message || 'Error al bloquear guion')
      });
    }
  }

  unlockGuion(): void {
    if (this.guionId) {
      this.guionService.unlockGuion(this.guionId).subscribe({
        next: () => {
          this.loadGuion();
          this.showSuccess('Guion liberado');
        },
        error: (err) => this.showError(err?.message || 'Error al liberar guion')
      });
    }
  }

  updateGuionField(field: string, value: string): void {
    if (!this.canEdit() || !this.guionId) return;
    const data: any = {};
    data[field] = value;
    this.guionService.update(this.guionId, data as any).subscribe({
      error: () => this.showError('Error al actualizar')
    });
  }

  updateActo(actoId: string, field: string, value: string): void {
    if (!this.canEdit()) return;
    // TODO: Implementar cuando tengamos ActoService
    console.log('updateActo', actoId, field, value);
  }

  addPasadaItem(actoId: string): void {
    if (!this.canEdit()) return;
    this.guionService.createPasadaItem(actoId, {
      departamento: '',
      lugar: '',
      descripcion: 'Nueva línea de pasada'
    }).subscribe({
      error: () => this.showError('Error al agregar pasada')
    });
  }

  insertPasadaItem(actoId: string, afterOrden: number): void {
    if (!this.canEdit()) return;
    this.guionService.insertPasadaItem(actoId, afterOrden + 1, {
      departamento: '',
      lugar: '',
      descripcion: 'Nueva línea'
    }).subscribe({
      error: () => this.showError('Error al insertar pasada')
    });
  }

  updatePasadaItem(actoId: string, itemId: string, field: string, value: string): void {
    if (!this.canEdit()) return;
    const data: any = {};
    data[field] = value;
    this.guionService.updatePasadaItem(actoId, itemId, data).subscribe({
      error: () => this.showError('Error al actualizar pasada')
    });
  }

  deletePasadaItem(actoId: string, itemId: string): void {
    if (!this.canEdit()) return;
    this.guionService.deletePasadaItem(actoId, itemId).subscribe({
      error: () => this.showError('Error al eliminar pasada')
    });
  }

  addEscena(actoId: string): void {
    if (!this.canEdit()) return;
    const acto = this.guion()?.actos.find(a => a.id === actoId);
    const numEscenas = acto?.escenas?.length || 0;
    this.guionService.createEscena(actoId, {
      nombre: `ESCENA ${numEscenas + 1}`,
      orden: numEscenas + 1
    }).subscribe({
      error: () => this.showError('Error al crear escena')
    });
  }

  deleteEscena(actoId: string, escenaId: string): void {
    if (!this.canEdit()) return;
    this.guionService.deleteEscena(actoId, escenaId).subscribe({
      error: () => this.showError('Error al eliminar escena')
    });
  }

  updateEscena(actoId: string, escenaId: string, field: string, value: string): void {
    if (!this.canEdit()) return;
    const data: any = {};
    data[field] = value;
    this.guionService.updateEscena(actoId, escenaId, data).subscribe({
      error: () => this.showError('Error al actualizar escena')
    });
  }

  addElemento(escenaId: string): void {
    if (!this.canEdit()) return;
    this.guionService.createElemento(escenaId, {
      tipoElemento: 'TOP',
      numero: '',
      descripcion: ''
    }).subscribe({
      error: () => this.showError('Error al crear elemento')
    });
  }

  insertElemento(escenaId: string, afterOrden: number): void {
    if (!this.canEdit()) return;
    // TODO: Implementar inserción en posición
    this.addElemento(escenaId);
  }

  updateElemento(escenaId: string, elementoId: string, field: string, value: string): void {
    if (!this.canEdit()) return;
    const data: any = {};
    data[field] = value;
    this.guionService.updateElemento(escenaId, elementoId, data).subscribe({
      error: () => this.showError('Error al actualizar elemento')
    });
  }

  updateElementoNumero(escenaId: string, elem: ElementoGuion, value: string): void {
    if (!this.canEdit()) return;
    if (elem.tipoElemento === 'TOP') {
      this.updateElemento(escenaId, elem.id, 'numero', value);
    } else {
      this.updateElemento(escenaId, elem.id, 'tipoElemento', value as any);
    }
  }

  deleteElemento(escenaId: string, elementoId: string): void {
    if (!this.canEdit()) return;
    this.guionService.deleteElemento(escenaId, elementoId).subscribe({
      error: () => this.showError('Error al eliminar elemento')
    });
  }

  addActo(): void {
    if (!this.canEdit()) return;
    // TODO: Implementar cuando tengamos endpoint
    console.log('addActo');
    this.showError('Crear acto aún no implementado');
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'OK', { duration: 3000, panelClass: 'snackbar-success' });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Cerrar', { duration: 5000, panelClass: 'snackbar-error' });
  }
}
