// teatro-real-frontend/src/app/features/tops/components/editable-text.component.ts

import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/**
 * EditableText - Texto editable inline tipo Word
 * Para títulos y metadata fuera de tablas
 */
@Component({
  selector: 'app-editable-text',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (editing) {
      <input
        #inputRef
        type="text"
        [(ngModel)]="localValue"
        [placeholder]="placeholder"
        [style]="computedStyle"
        (blur)="onBlur()"
        (keydown)="onKeyDown($event)"
        class="border-none w-full"
      />
    } @else {
      <span
        [style]="computedStyle"
        [class]="'cursor-text block ' + className"
        (click)="onClick()"
        (mouseenter)="hovered = true"
        (mouseleave)="hovered = false"
      >
        @if (localValue) {
          {{ localValue }}
        } @else {
          <span class="text-gray-400">{{ placeholder }}</span>
        }
      </span>
    }
  `,
  styles: [`
    :host {
      display: block;
    }
    input {
      font-family: inherit;
      font-size: inherit;
      font-weight: inherit;
      text-align: inherit;
      font-style: inherit;
    }
  `]
})
export class EditableTextComponent implements OnChanges {
  @Input() value: string = '';
  @Input() placeholder: string = 'Click para editar...';
  @Input() className: string = '';

  // Estilos opcionales
  @Input() fontSize: string = '';
  @Input() fontWeight: string = '';
  @Input() textAlign: string = '';
  @Input() fontStyle: string = '';
  @Input() marginBottom: string = '';

  @Output() valueChange = new EventEmitter<string>();

  @ViewChild('inputRef') inputRef!: ElementRef<HTMLInputElement>;

  editing = false;
  hovered = false;
  localValue = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value']) {
      this.localValue = this.value || '';
    }
  }

  get computedStyle(): { [key: string]: string } {
    const style: { [key: string]: string } = {};

    if (this.fontSize) style['fontSize'] = this.fontSize;
    if (this.fontWeight) style['fontWeight'] = this.fontWeight;
    if (this.textAlign) style['textAlign'] = this.textAlign;
    if (this.fontStyle) style['fontStyle'] = this.fontStyle;
    if (this.marginBottom) style['marginBottom'] = this.marginBottom;

    if (this.editing) {
      style['background'] = '#fff9c4';
      style['outline'] = '2px solid #1976d2';
    } else if (this.hovered) {
      style['background'] = '#fffde7';
    }

    return style;
  }

  onClick(): void {
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
    if (event.key === 'Enter') {
      event.preventDefault();
      this.inputRef?.nativeElement?.blur();
    }
    if (event.key === 'Escape') {
      this.localValue = this.value || '';
      this.editing = false;
    }
  }
}
