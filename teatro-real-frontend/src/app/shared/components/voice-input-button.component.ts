// teatro-real-frontend/src/app/shared/components/voice-input-button.component.ts

import { Component, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VoiceInputService } from '../services/voice-input.service';

/**
 * VoiceInputButton - Botón de micrófono para entrada de voz
 *
 * Versión inline minimalista para integrar en campos de texto.
 * Se pone rojo y pulsa cuando está grabando.
 */
@Component({
  selector: 'app-voice-input-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      type="button"
      [disabled]="!voiceService.isSupported()"
      [title]="getTitle()"
      (click)="onClick($event)"
      class="voice-btn"
      [class.listening]="voiceService.isListening()"
      [class.unsupported]="!voiceService.isSupported()"
    >
      <!-- Icono micrófono -->
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        class="mic-icon"
      >
        <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
        <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
      </svg>
    </button>
  `,
  styles: [`
    .voice-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      border: none;
      border-radius: 50%;
      background: #64748b;
      color: white;
      cursor: pointer;
      transition: all 0.2s ease;
      padding: 4px;
      flex-shrink: 0;
    }

    .voice-btn:hover:not(.unsupported) {
      background: #475569;
      transform: scale(1.1);
    }

    .voice-btn.listening {
      background: #dc2626;
      animation: pulse 1.5s infinite;
    }

    .voice-btn.unsupported {
      background: #cbd5e1;
      cursor: not-allowed;
      opacity: 0.5;
    }

    .mic-icon {
      width: 14px;
      height: 14px;
    }

    @keyframes pulse {
      0%, 100% {
        transform: scale(1);
        box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.4);
      }
      50% {
        transform: scale(1.05);
        box-shadow: 0 0 0 6px rgba(220, 38, 38, 0);
      }
    }
  `]
})
export class VoiceInputButtonComponent {
  @Output() transcript = new EventEmitter<string>();

  protected voiceService = inject(VoiceInputService);

  onClick(event: Event): void {
    event.stopPropagation();
    event.preventDefault();

    this.voiceService.toggleListening(
      (text) => {
        if (text.trim()) {
          this.transcript.emit(text);
        }
      }
    );
  }

  getTitle(): string {
    if (!this.voiceService.isSupported()) {
      return 'Reconocimiento de voz no soportado';
    }
    if (this.voiceService.isListening()) {
      return 'Click para detener';
    }
    return 'Click para dictar (español)';
  }
}
