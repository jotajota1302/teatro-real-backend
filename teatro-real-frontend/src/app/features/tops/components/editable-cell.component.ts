// teatro-real-frontend/src/app/features/tops/components/editable-cell.component.ts

import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/**
 * EditableCell - Celda editable tipo Word
 * Click para editar, blur para guardar
 */
@Component({
  selector: 'app-editable-cell',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <td
      [class]="className"
      [style.background]="editing ? '#fff9c4' : hovered ? '#fffde7' : ''"
      [style.cursor]="'text'"
      [style.min-height.em]="1.2"
      [style.vertical-align]="'top'"
      [style.font-weight]="bold ? 'bold' : 'normal'"
      [style.color]="color || '#000'"
      (click)="onCellClick($event)"
      (mouseenter)="hovered = true"
      (mouseleave)="hovered = false"
    >
      <!-- Modo edición -->
      @if (editing) {
        @if (multiline) {
          <textarea
            #inputRef
            [(ngModel)]="localValue"
            [placeholder]="placeholder"
            (blur)="onBlur()"
            (keydown)="onKeyDown($event)"
            rows="4"
            class="w-full border-none bg-transparent outline-none font-serif text-sm p-0 m-0 resize-none min-h-20"
          ></textarea>
        } @else {
          <input
            #inputRef
            type="text"
            [(ngModel)]="localValue"
            [placeholder]="placeholder"
            (blur)="onBlur()"
            (keydown)="onKeyDown($event)"
            class="w-full border-none bg-transparent outline-none font-serif text-sm p-0 m-0"
          />
        }
      } @else {
        <!-- Modo visualización -->
        <span
          [class.text-gray-400]="!localValue"
          [class.whitespace-pre-wrap]="multiline"
          class="block"
        >
          {{ localValue || placeholder || '\u00A0' }}
        </span>
      }

      <!-- Imagen al final (si existe) -->
      @if (imagen) {
        <div class="mt-2 relative inline-block group">
          <img
            [src]="imagen"
            alt="Imagen"
            class="max-w-full max-h-32 border border-gray-300 rounded"
          />
          <!-- Botón borrar imagen -->
          <button
            class="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs font-bold"
            (click)="onDeleteImage($event)"
            title="Eliminar imagen">
            ✕
          </button>
        </div>
      }
    </td>
  `,
  styles: [`
    :host {
      display: contents;
    }
    td {
      border: 1px solid #000;
      padding: 6px 10px;
      text-align: left;
      font-family: 'Times New Roman', Times, serif;
    }
    .font-serif {
      font-family: 'Times New Roman', Times, serif;
    }
  `]
})
export class EditableCellComponent implements OnChanges {
  @Input() value: string = '';
  @Input() placeholder: string = '';
  @Input() multiline: boolean = false;
  @Input() className: string = '';
  @Input() imagen: string | null = null;
  @Input() bold: boolean = false;
  @Input() color: string | null = null;

  @Output() valueChange = new EventEmitter<string>();
  @Output() imagenDelete = new EventEmitter<void>();

  @ViewChild('inputRef') inputRef!: ElementRef<HTMLInputElement | HTMLTextAreaElement>;

  editing = false;
  hovered = false;
  localValue = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value']) {
      this.localValue = this.value || '';
    }
  }

  onCellClick(event: Event): void {
    // No editar si se hace clic en imagen
    if ((event.target as HTMLElement).tagName === 'IMG') return;

    this.editing = true;
    setTimeout(() => this.inputRef?.nativeElement?.focus(), 0);
  }

  onBlur(): void {
    this.editing = false;
    if (this.localValue !== this.value) {
      this.valueChange.emit(this.localValue);
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey && !this.multiline) {
      event.preventDefault();
      this.inputRef?.nativeElement?.blur();
    }
    if (event.key === 'Tab') {
      this.onBlur();
    }
    if (event.key === 'Escape') {
      this.localValue = this.value || '';
      this.editing = false;
    }
  }

  onDeleteImage(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    this.imagenDelete.emit();
  }
}
