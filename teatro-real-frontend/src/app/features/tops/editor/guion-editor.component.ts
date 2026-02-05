// teatro-real-frontend/src/app/features/tops/editor/guion-editor.component.ts

import { Component, OnInit, OnDestroy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { saveAs } from 'file-saver';

import { GuionService } from '../services/guion.service';
import { EditableCellComponent } from '../components/editable-cell.component';
import { EditableTextComponent } from '../components/editable-text.component';
import { AuditLogPanelComponent } from '../components/audit-log-panel.component';
import { ImageUploadComponent, GuionImage } from '../components/image-upload.component';
import {
  GuionCompleto,
  Acto,
  Escena,
  PasadaItem,
  ElementoGuion,
  ESTADO_LABELS
} from '../models/guion.model';
import { AuthService } from '../../../core/auth/auth.service';
import { environment } from '../../../../environments/environment';

/**
 * GuionEditor - Editor tipo Word para guiones técnicos
 * Canvas con fondo gris, página blanca, tablas editables
 */
@Component({
  selector: 'app-guion-editor',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTooltipModule,
    DragDropModule,
    EditableCellComponent,
    EditableTextComponent,
    AuditLogPanelComponent,
    ImageUploadComponent
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
                  (click)="lockGuion()"
                  matTooltip="Bloquear guion para edición exclusiva">
            <mat-icon class="!text-lg">lock_open</mat-icon>
            Editar
          </button>
        } @else if (isLockedByMe()) {
          <button class="inline-flex items-center gap-1 px-4 py-2 text-sm font-semibold border-2 border-orange-500 text-orange-600 rounded hover:bg-orange-500 hover:text-white transition-colors"
                  (click)="unlockGuion()"
                  matTooltip="Liberar guion para que otros puedan editarlo">
            <mat-icon class="!text-lg">lock</mat-icon>
            Liberar
          </button>
        }

        <button class="inline-flex items-center gap-1 px-4 py-2 text-sm font-semibold border-2 border-green-600 text-green-600 rounded hover:bg-green-600 hover:text-white transition-colors"
                (click)="exportarWord()"
                [disabled]="exporting()"
                matTooltip="Descargar documento Word">
          @if (exporting()) {
            <mat-spinner diameter="16" class="!text-green-600"></mat-spinner>
          } @else {
            <mat-icon class="!text-lg">download</mat-icon>
          }
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
                    @if (canEdit()) {
                      <th class="border border-black p-0 bg-gray-100 w-6"></th>
                    }
                    <th class="border border-black p-1.5 text-left font-bold bg-gray-100 w-[10%]">DPTO</th>
                    <th class="border border-black p-1.5 text-left font-bold bg-gray-100 w-[12%]">LUGAR</th>
                    <th class="border border-black p-1.5 text-left font-bold bg-gray-100 w-[58%]">DESCRIPCIÓN</th>
                    <th class="border border-black p-1.5 text-center font-bold bg-gray-100 w-[10%]">IMÁGENES</th>
                    <th class="border border-black p-1.5 text-center font-bold bg-gray-100 w-[8%]"></th>
                  </tr>
                </thead>
                <tbody cdkDropList [cdkDropListData]="acto.pasada" (cdkDropListDropped)="dropPasada($event, acto.id)">
                  @for (item of acto.pasada || []; track item.id) {
                    <tr cdkDrag [cdkDragDisabled]="!canEdit()" class="hover:bg-gray-50 bg-white group">
                      @if (canEdit()) {
                        <td cdkDragHandle class="border border-black p-0 text-center cursor-grab active:cursor-grabbing w-6 bg-gray-50 hover:bg-gray-200">
                          <div class="flex items-center justify-center h-full py-1">
                            <span class="text-gray-400 group-hover:text-gray-600 text-xs select-none">⋮⋮</span>
                          </div>
                        </td>
                      }
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
                        [enableVoice]="true"
                      />
                      <!-- Columna IMÁGENES -->
                      <td class="border border-black p-1 text-center align-middle relative">
                        <div class="flex flex-wrap gap-1 items-center justify-center">
                          @for (img of item.imagenes || []; track img) {
                            <div class="relative inline-block group">
                              <img [src]="img" alt="Imagen" class="w-12 h-12 rounded border border-gray-300 object-cover cursor-pointer hover:opacity-80 transition-opacity"
                                   (click)="lightboxImage.set(img); $event.stopPropagation()"
                                   title="Clic para ampliar">
                              @if (canEdit()) {
                                <button class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[10px]"
                                        (click)="deletePasadaImageByUrl(acto.id, item.id, img); $event.stopPropagation()"
                                        title="Eliminar imagen">✕</button>
                              }
                            </div>
                          }
                          @if (canEdit()) {
                            <button class="w-8 h-8 inline-flex items-center justify-center rounded border border-dashed border-gray-300 hover:border-purple-400 hover:bg-purple-50 opacity-60 hover:opacity-100 transition-all"
                                    (click)="toggleImageUpload('pasada-' + item.id); $event.stopPropagation()"
                                    title="Añadir imagen">
                              <mat-icon class="!text-base text-purple-600">add</mat-icon>
                            </button>
                          } @else if (!item.imagenes?.length) {
                            <span class="text-gray-300">-</span>
                          }
                        </div>
                        <!-- Popup de upload -->
                        @if (showImageUpload === 'pasada-' + item.id && canEdit()) {
                          <div class="absolute left-1/2 -translate-x-1/2 top-full mt-1 p-2 bg-white border rounded shadow-lg z-50 w-48"
                               (click)="$event.stopPropagation()">
                            <app-image-upload
                              [guionId]="guionId || ''"
                              entityType="PASADA_ITEM"
                              [entityId]="item.id"
                              (imageUploaded)="onPasadaImageUploaded(acto.id, item.id, $event)"
                              (imageRemoved)="onPasadaImageRemoved(acto.id, item.id)"
                            />
                            <button class="mt-2 text-xs text-gray-400 hover:text-gray-600 w-full text-center"
                                    (click)="showImageUpload = null">Cerrar</button>
                          </div>
                        }
                      </td>
                      <!-- Columna Acciones -->
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
                      <td [attr.colspan]="canEdit() ? 6 : 5"
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
                        @if (canEdit()) {
                          <th class="border border-black p-0 bg-gray-100 w-6"></th>
                        }
                        <th class="border border-black p-1.5 text-left font-bold bg-gray-100 w-[8%]">PIE</th>
                        <th class="border border-black p-1.5 text-left font-bold bg-gray-100 w-[6%]">TOP</th>
                        <th class="border border-black p-1.5 text-left font-bold bg-gray-100 w-[8%]">DPTO</th>
                        <th class="border border-black p-1.5 text-left font-bold bg-gray-100 w-[24%]">QUIEN/QUE</th>
                        <th class="border border-black p-1.5 text-left font-bold bg-gray-100 w-[28%]">OBSERVACIONES</th>
                        <th class="border border-black p-1.5 text-center font-bold bg-gray-100 w-[10%]">IMÁGENES</th>
                        <th class="border border-black p-1.5 text-center font-bold bg-gray-100 w-[8%]"></th>
                      </tr>
                    </thead>
                    <tbody cdkDropList [cdkDropListData]="escena.elementos" (cdkDropListDropped)="dropElemento($event, escena.id)">
                      @for (elem of escena.elementos || []; track elem.id) {
                        <tr cdkDrag [cdkDragDisabled]="!canEdit()" class="hover:bg-gray-50 bg-white">
                          @if (canEdit()) {
                            <td cdkDragHandle class="border border-black p-1 text-center cursor-grab active:cursor-grabbing w-8">
                              <mat-icon class="!text-base text-gray-400 hover:text-gray-600">drag_indicator</mat-icon>
                            </td>
                          }
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
                            [enableVoice]="true"
                          />
                          <app-editable-cell
                            [value]="elem.observaciones || ''"
                            (valueChange)="updateElemento(escena.id, elem.id, 'observaciones', $event)"
                            placeholder=""
                            [multiline]="true"
                            [enableVoice]="true"
                          />
                          <!-- Columna IMÁGENES -->
                          <td class="border border-black p-1 text-center align-middle relative">
                            <div class="flex flex-wrap gap-1 items-center justify-center">
                              @for (img of elem.imagenes || []; track img) {
                                <div class="relative inline-block group">
                                  <img [src]="img" alt="Imagen" class="w-12 h-12 rounded border border-gray-300 object-cover cursor-pointer hover:opacity-80 transition-opacity"
                                       (click)="lightboxImage.set(img); $event.stopPropagation()"
                                       title="Clic para ampliar">
                                  @if (canEdit()) {
                                    <button class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[10px]"
                                            (click)="deleteElementoImageByUrl(escena.id, elem.id, img); $event.stopPropagation()"
                                            title="Eliminar imagen">✕</button>
                                  }
                                </div>
                              }
                              @if (canEdit()) {
                                <button class="w-8 h-8 inline-flex items-center justify-center rounded border border-dashed border-gray-300 hover:border-purple-400 hover:bg-purple-50 opacity-60 hover:opacity-100 transition-all"
                                        (click)="toggleImageUpload('elem-' + elem.id); $event.stopPropagation()"
                                        title="Añadir imagen">
                                  <mat-icon class="!text-base text-purple-600">add</mat-icon>
                                </button>
                              } @else if (!elem.imagenes?.length) {
                                <span class="text-gray-300">-</span>
                              }
                            </div>
                            <!-- Popup de upload -->
                            @if (showImageUpload === 'elem-' + elem.id && canEdit()) {
                              <div class="absolute left-1/2 -translate-x-1/2 top-full mt-1 p-2 bg-white border rounded shadow-lg z-50 w-48"
                                   (click)="$event.stopPropagation()">
                                <app-image-upload
                                  [guionId]="guionId || ''"
                                  entityType="TOP"
                                  [entityId]="elem.id"
                                  (imageUploaded)="onElementoImageUploaded(escena.id, elem.id, $event)"
                                  (imageRemoved)="onElementoImageRemoved(escena.id, elem.id)"
                                />
                                <button class="mt-2 text-xs text-gray-400 hover:text-gray-600 w-full text-center"
                                        (click)="showImageUpload = null">Cerrar</button>
                              </div>
                            }
                          </td>
                          <!-- Columna Acciones -->
                          <td class="border border-black p-1 text-center whitespace-nowrap">
                            @if (canEdit()) {
                              <button class="w-6 h-6 inline-flex items-center justify-center rounded hover:bg-blue-100 opacity-40 hover:opacity-100 transition-opacity"
                                      (click)="insertElemento(escena.id, elem.orden); $event.stopPropagation()"
                                      title="Insertar fila">
                                <mat-icon class="!text-base text-blue-600">add</mat-icon>
                              </button>
                              <button class="w-6 h-6 inline-flex items-center justify-center rounded hover:bg-red-100 opacity-40 hover:opacity-100 transition-opacity"
                                      (click)="deleteElemento(escena.id, elem.id); $event.stopPropagation()"
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
                          <td [attr.colspan]="canEdit() ? 8 : 7"
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

      <!-- Lightbox para ver imagen en grande -->
      @if (lightboxImage()) {
        <div class="fixed inset-0 bg-black/80 z-[9999] flex items-center justify-center p-4"
             (click)="lightboxImage.set(null)">
          <button class="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white text-2xl transition-colors"
                  (click)="lightboxImage.set(null)"
                  title="Cerrar">
            ✕
          </button>
          <img [src]="lightboxImage()"
               alt="Imagen ampliada"
               class="max-w-[90vw] max-h-[90vh] object-contain rounded shadow-2xl"
               (click)="$event.stopPropagation()">
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
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  guionService = inject(GuionService);

  guion = this.guionService.guionActual;
  exporting = signal(false);
  showHistorial = signal(false);

  // Para mostrar panel de upload de imagen
  showImageUpload: string | null = null;

  // Para lightbox de imagen
  lightboxImage = signal<string | null>(null);

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

  guionId: string | null = null;

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

  toggleHistorial(): void {
    this.showHistorial.update(v => !v);
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
    if (!this.canEdit() || !this.guionId) return;
    const data: any = {};
    data[field] = value;
    this.guionService.updateActo(this.guionId, actoId, data).subscribe({
      error: () => this.showError('Error al actualizar acto')
    });
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
      tipoElemento: 'ANOTACION_LIBRE',
      numero: '',
      descripcion: ''
    }).subscribe({
      error: () => this.showError('Error al crear elemento')
    });
  }

  insertElemento(escenaId: string, afterOrden: number): void {
    if (!this.canEdit()) return;
    // Crear elemento y luego reordenar para insertarlo en la posición correcta
    this.guionService.createElemento(escenaId, {
      tipoElemento: 'ANOTACION_LIBRE',
      numero: '',
      descripcion: '',
      orden: afterOrden + 1
    }).subscribe({
      next: (newElem) => {
        // Obtener la escena y reordenar
        const acto = this.guion()?.actos.find(a =>
          a.escenas.some(e => e.id === escenaId)
        );
        const escena = acto?.escenas.find(e => e.id === escenaId);
        if (escena) {
          // Construir nuevo orden: elementos antes, nuevo, elementos después
          const before = escena.elementos.filter(e => e.orden <= afterOrden);
          const after = escena.elementos.filter(e => e.orden > afterOrden && e.id !== newElem.id);
          const newOrder = [...before.map(e => e.id), newElem.id, ...after.map(e => e.id)];
          this.guionService.reorderElementos(escenaId, newOrder).subscribe();
        }
      },
      error: () => this.showError('Error al insertar elemento')
    });
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
    if (!this.canEdit() || !this.guionId) return;
    const numActos = this.guion()?.actos?.length || 0;
    this.guionService.createActo(this.guionId, {
      nombre: `ACTO ${numActos + 1}`,
      orden: numActos + 1
    }).subscribe({
      next: () => this.showSuccess('Acto creado'),
      error: () => this.showError('Error al crear acto')
    });
  }

  // ==================== Drag & Drop ====================

  dropPasada(event: CdkDragDrop<any[]>, actoId: string): void {
    if (!this.canEdit() || event.previousIndex === event.currentIndex) return;

    const items = event.container.data;
    moveItemInArray(items, event.previousIndex, event.currentIndex);

    // Actualizar orden en backend - IDs son strings (UUIDs)
    const orderedIds = items.map((item: any) => item.id);
    this.guionService.reorderPasadaItems(actoId, orderedIds).subscribe({
      error: () => this.showError('Error al reordenar')
    });
  }

  dropElemento(event: CdkDragDrop<any[]>, escenaId: string): void {
    if (!this.canEdit() || event.previousIndex === event.currentIndex) return;

    const items = event.container.data;
    moveItemInArray(items, event.previousIndex, event.currentIndex);

    // Actualizar orden en backend - IDs son strings (UUIDs)
    const orderedIds = items.map((item: any) => item.id);
    this.guionService.reorderElementos(escenaId, orderedIds).subscribe({
      error: () => this.showError('Error al reordenar')
    });
  }

  exportarWord(): void {
    if (!this.guionId || this.exporting()) return;

    this.exporting.set(true);
    this.http.get(`${environment.apiUrl}/guiones/${this.guionId}/export`, {
      responseType: 'blob'
    }).subscribe({
      next: (blob) => {
        const filename = `guion_${this.guion()?.produccionNombre || 'documento'}_${this.guionId}.docx`;
        saveAs(blob, filename.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s_-]/g, ''));
        this.showSuccess('Documento exportado correctamente');
        this.exporting.set(false);
      },
      error: () => {
        this.showError('Error al exportar documento');
        this.exporting.set(false);
      }
    });
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'OK', { duration: 3000, panelClass: 'snackbar-success' });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Cerrar', { duration: 5000, panelClass: 'snackbar-error' });
  }

  // ==================== Imágenes ====================

  toggleImageUpload(itemId: string): void {
    this.showImageUpload = this.showImageUpload === itemId ? null : itemId;
  }

  onPasadaImageUploaded(actoId: string, itemId: string, image: GuionImage): void {
    // Añadir imagen al array existente
    const imageUrl = `${environment.apiUrl}/tops/images/${image.id}`;
    const acto = this.guion()?.actos.find(a => a.id === actoId);
    const item = acto?.pasada?.find(p => p.id === itemId);
    const currentImages = item?.imagenes || [];
    this.updatePasadaItemImages(actoId, itemId, [...currentImages, imageUrl]);
    this.showImageUpload = null;
  }

  onPasadaImageRemoved(actoId: string, itemId: string): void {
    this.showImageUpload = null;
  }

  deletePasadaImageByUrl(actoId: string, itemId: string, imageUrl: string): void {
    // Extraer ID de la imagen de la URL
    const match = imageUrl.match(/\/tops\/images\/(\d+)/);
    if (match) {
      const imageId = match[1];
      this.http.delete(`${environment.apiUrl}/tops/images/${imageId}`).subscribe({
        next: () => {
          // Quitar imagen del array local
          const acto = this.guion()?.actos.find(a => a.id === actoId);
          const item = acto?.pasada?.find(p => p.id === itemId);
          const newImages = (item?.imagenes || []).filter(img => img !== imageUrl);
          this.updatePasadaItemImages(actoId, itemId, newImages);
          this.showSuccess('Imagen eliminada');
        },
        error: () => this.showError('Error al eliminar imagen')
      });
    }
  }

  private updatePasadaItemImages(actoId: string, itemId: string, imagenes: string[]): void {
    const guion = this.guion();
    if (!guion) return;

    const actoIndex = guion.actos.findIndex(a => a.id === actoId);
    if (actoIndex === -1) return;

    const itemIndex = guion.actos[actoIndex].pasada?.findIndex(p => p.id === itemId) ?? -1;
    if (itemIndex === -1) return;

    // Actualizar el modelo local
    guion.actos[actoIndex].pasada![itemIndex].imagenes = imagenes;
    this.guionService.guionActual.set({ ...guion });
  }

  // ==================== Imágenes de Elementos ====================

  onElementoImageUploaded(escenaId: string, elemId: string, image: GuionImage): void {
    const imageUrl = `${environment.apiUrl}/tops/images/${image.id}`;
    const acto = this.guion()?.actos.find(a => a.escenas.some(e => e.id === escenaId));
    const escena = acto?.escenas.find(e => e.id === escenaId);
    const elem = escena?.elementos.find(e => e.id === elemId);
    const currentImages = elem?.imagenes || [];
    this.updateElementoImages(escenaId, elemId, [...currentImages, imageUrl]);
    this.showImageUpload = null;
  }

  onElementoImageRemoved(escenaId: string, elemId: string): void {
    this.showImageUpload = null;
  }

  deleteElementoImageByUrl(escenaId: string, elemId: string, imageUrl: string): void {
    const match = imageUrl.match(/\/tops\/images\/(\d+)/);
    if (match) {
      const imageId = match[1];
      this.http.delete(`${environment.apiUrl}/tops/images/${imageId}`).subscribe({
        next: () => {
          const acto = this.guion()?.actos.find(a => a.escenas.some(e => e.id === escenaId));
          const escena = acto?.escenas.find(e => e.id === escenaId);
          const elem = escena?.elementos.find(e => e.id === elemId);
          const newImages = (elem?.imagenes || []).filter(img => img !== imageUrl);
          this.updateElementoImages(escenaId, elemId, newImages);
          this.showSuccess('Imagen eliminada');
        },
        error: () => this.showError('Error al eliminar imagen')
      });
    }
  }

  private updateElementoImages(escenaId: string, elemId: string, imagenes: string[]): void {
    const guion = this.guion();
    if (!guion) return;

    for (const acto of guion.actos) {
      const escenaIndex = acto.escenas.findIndex(e => e.id === escenaId);
      if (escenaIndex !== -1) {
        const elemIndex = acto.escenas[escenaIndex].elementos.findIndex(e => e.id === elemId);
        if (elemIndex !== -1) {
          acto.escenas[escenaIndex].elementos[elemIndex].imagenes = imagenes;
          this.guionService.guionActual.set({ ...guion });
          return;
        }
      }
    }
  }

}
