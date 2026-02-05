import { Component, Input, Output, EventEmitter, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../../../environments/environment';

export interface GuionImage {
  id: number;
  guionId: string;
  entityType: string;
  entityId: string;
  filename: string;
  mimeType: string;
  fileSize: number;
  storagePath: string;
  uploadedAt: string;
}

/**
 * Componente para subir imágenes a elementos del guión
 * Soporta drag & drop y selección de archivo
 */
@Component({
  selector: 'app-image-upload',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule
  ],
  template: `
    <div class="image-upload-container">
      <!-- Preview de imagen existente -->
      @if (currentImageUrl) {
        <div class="relative group">
          <img [src]="currentImageUrl"
               [alt]="'Imagen de ' + entityType"
               class="max-w-full max-h-32 rounded border border-gray-300 object-contain">
          @if (!disabled) {
            <button
              class="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              (click)="removeImage()"
              title="Eliminar imagen">
              <mat-icon class="!text-sm">close</mat-icon>
            </button>
          }
        </div>
      }

      <!-- Zona de upload -->
      @if (!currentImageUrl && !disabled) {
        <div
          class="upload-zone border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors"
          [class.border-gray-300]="!isDragging()"
          [class.border-blue-500]="isDragging()"
          [class.bg-blue-50]="isDragging()"
          (dragover)="onDragOver($event)"
          (dragleave)="onDragLeave($event)"
          (drop)="onDrop($event)"
          (click)="fileInput.click()">

          <input
            #fileInput
            type="file"
            accept="image/jpeg,image/png,image/webp"
            class="hidden"
            (change)="onFileSelected($event)">

          @if (uploading()) {
            <div class="space-y-1">
              <mat-progress-bar mode="determinate" [value]="uploadProgress()"></mat-progress-bar>
              <span class="text-xs text-gray-500">{{ uploadProgress() }}%</span>
            </div>
          } @else {
            <mat-icon class="!text-2xl text-gray-400 mb-1">cloud_upload</mat-icon>
            <p class="text-xs text-gray-500 leading-tight">
              Clic o arrastra
            </p>
            <p class="text-xs text-gray-400">
              JPG, PNG, WebP
            </p>
          }
        </div>
      }

      <!-- Botón compacto si hay imagen -->
      @if (currentImageUrl && !disabled) {
        <button
          class="mt-2 text-xs text-blue-600 hover:text-blue-800"
          (click)="fileInput.click()">
          Cambiar imagen
          <input
            #fileInput
            type="file"
            accept="image/jpeg,image/png,image/webp"
            class="hidden"
            (change)="onFileSelected($event)">
        </button>
      }
    </div>
  `,
  styles: [`
    .upload-zone:hover {
      border-color: #3b82f6;
      background-color: #eff6ff;
    }
  `]
})
export class ImageUploadComponent {
  private http = inject(HttpClient);
  private snackBar = inject(MatSnackBar);

  @Input() guionId!: string;
  @Input() entityType!: string; // TOP, PASADA_ITEM, ESCENA
  @Input() entityId!: string;
  @Input() currentImageUrl: string | null = null;
  @Input() currentImageId: number | null = null;
  @Input() disabled = false;

  @Output() imageUploaded = new EventEmitter<GuionImage>();
  @Output() imageRemoved = new EventEmitter<void>();

  isDragging = signal(false);
  uploading = signal(false);
  uploadProgress = signal(0);

  private readonly MAX_SIZE = 5 * 1024 * 1024; // 5MB
  private readonly ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.uploadFile(files[0]);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.uploadFile(input.files[0]);
    }
  }

  private uploadFile(file: File): void {
    // Validar tipo
    if (!this.ALLOWED_TYPES.includes(file.type)) {
      this.snackBar.open('Tipo de archivo no permitido. Use JPG, PNG o WebP.', 'Cerrar', { duration: 4000 });
      return;
    }

    // Validar tamaño
    if (file.size > this.MAX_SIZE) {
      this.snackBar.open('El archivo es demasiado grande. Máximo 5MB.', 'Cerrar', { duration: 4000 });
      return;
    }

    this.uploading.set(true);
    this.uploadProgress.set(0);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('guionId', this.guionId);
    formData.append('entityType', this.entityType);
    formData.append('entityId', this.entityId);

    this.http.post<GuionImage>(`${environment.apiUrl}/tops/images/upload`, formData, {
      reportProgress: true,
      observe: 'events'
    }).subscribe({
      next: (event) => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          this.uploadProgress.set(Math.round(100 * event.loaded / event.total));
        } else if (event.type === HttpEventType.Response) {
          this.uploading.set(false);
          this.uploadProgress.set(0);
          if (event.body) {
            this.imageUploaded.emit(event.body);
            this.snackBar.open('Imagen subida correctamente', 'OK', { duration: 3000 });
          }
        }
      },
      error: (err) => {
        this.uploading.set(false);
        this.uploadProgress.set(0);
        console.error('Error uploading image:', err);
        this.snackBar.open('Error al subir la imagen', 'Cerrar', { duration: 4000 });
      }
    });
  }

  removeImage(): void {
    if (!this.currentImageId) {
      this.imageRemoved.emit();
      return;
    }

    this.http.delete(`${environment.apiUrl}/tops/images/${this.currentImageId}`).subscribe({
      next: () => {
        this.imageRemoved.emit();
        this.snackBar.open('Imagen eliminada', 'OK', { duration: 3000 });
      },
      error: (err) => {
        console.error('Error removing image:', err);
        this.snackBar.open('Error al eliminar la imagen', 'Cerrar', { duration: 4000 });
      }
    });
  }
}
