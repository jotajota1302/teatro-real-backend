// teatro-real-frontend/src/app/shared/services/voice-input.service.ts

import { Injectable, signal } from '@angular/core';

/**
 * Idiomas soportados para reconocimiento de voz
 */
export const VOICE_LANGUAGES = [
  { code: 'es-ES', label: 'Español (España)' },
  { code: 'es-MX', label: 'Español (México)' },
  { code: 'en-US', label: 'English (US)' },
  { code: 'en-GB', label: 'English (UK)' },
  { code: 'fr-FR', label: 'Français' },
  { code: 'de-DE', label: 'Deutsch' },
  { code: 'it-IT', label: 'Italiano' },
  { code: 'pt-PT', label: 'Português' },
] as const;

export type VoiceLanguageCode = typeof VOICE_LANGUAGES[number]['code'];

/**
 * Interfaz para el SpeechRecognition del navegador
 */
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

/**
 * VoiceInputService - Servicio para reconocimiento de voz
 *
 * Usa la Web Speech API nativa del navegador.
 * Patrón singleton: solo una instancia de reconocimiento activa a la vez.
 */
@Injectable({
  providedIn: 'root'
})
export class VoiceInputService {
  // Estado reactivo con signals
  readonly isListening = signal(false);
  readonly isSupported = signal(false);
  readonly error = signal<string | null>(null);
  readonly transcript = signal('');

  private recognition: SpeechRecognition | null = null;
  private currentLanguage: VoiceLanguageCode = 'es-ES';

  // Callbacks activos (patrón singleton)
  private activeResultCallback: ((text: string) => void) | null = null;
  private activeEndCallback: (() => void) | null = null;

  constructor() {
    this.checkSupport();
  }

  /**
   * Verifica si el navegador soporta Web Speech API
   */
  private checkSupport(): void {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.isSupported.set(!!SpeechRecognitionAPI);

    if (SpeechRecognitionAPI) {
      this.recognition = new SpeechRecognitionAPI();
      this.setupRecognition();
    }
  }

  /**
   * Configura la instancia de reconocimiento
   */
  private setupRecognition(): void {
    if (!this.recognition) return;

    this.recognition.continuous = false;
    this.recognition.interimResults = true;
    this.recognition.lang = this.currentLanguage;

    this.recognition.onstart = () => {
      this.isListening.set(true);
      this.error.set(null);
    };

    this.recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interimTranscript += result[0].transcript;
        }
      }

      // Mostrar transcripción provisional
      this.transcript.set(finalTranscript || interimTranscript);

      // Si hay resultado final, notificar
      if (finalTranscript && this.activeResultCallback) {
        this.activeResultCallback(finalTranscript.trim());
      }
    };

    this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      const errorMessages: Record<string, string> = {
        'no-speech': 'No se detectó voz. Intenta de nuevo.',
        'audio-capture': 'No se encontró micrófono.',
        'not-allowed': 'Permiso de micrófono denegado.',
        'network': 'Error de red. Verifica tu conexión.',
        'aborted': 'Reconocimiento cancelado.',
      };

      const message = errorMessages[event.error] || `Error: ${event.error}`;
      this.error.set(message);
      this.isListening.set(false);
    };

    this.recognition.onend = () => {
      this.isListening.set(false);
      if (this.activeEndCallback) {
        this.activeEndCallback();
      }
    };
  }

  /**
   * Cambia el idioma de reconocimiento
   */
  setLanguage(lang: VoiceLanguageCode): void {
    this.currentLanguage = lang;
    if (this.recognition) {
      this.recognition.lang = lang;
    }
  }

  /**
   * Obtiene el idioma actual
   */
  getLanguage(): VoiceLanguageCode {
    return this.currentLanguage;
  }

  /**
   * Inicia el reconocimiento de voz
   * @param onResult Callback con el texto transcrito
   * @param onEnd Callback cuando termina
   */
  startListening(
    onResult: (text: string) => void,
    onEnd?: () => void
  ): void {
    if (!this.recognition || !this.isSupported()) {
      this.error.set('Reconocimiento de voz no soportado en este navegador.');
      return;
    }

    // Si ya está escuchando, parar primero
    if (this.isListening()) {
      this.stopListening();
      return;
    }

    this.activeResultCallback = onResult;
    this.activeEndCallback = onEnd || null;
    this.transcript.set('');
    this.error.set(null);

    try {
      this.recognition.start();
    } catch (e) {
      // Ya está corriendo, reiniciar
      this.recognition.stop();
      setTimeout(() => {
        this.recognition?.start();
      }, 100);
    }
  }

  /**
   * Detiene el reconocimiento de voz
   */
  stopListening(): void {
    if (this.recognition && this.isListening()) {
      this.recognition.stop();
    }
  }

  /**
   * Alterna el estado de escucha
   */
  toggleListening(
    onResult: (text: string) => void,
    onEnd?: () => void
  ): void {
    if (this.isListening()) {
      this.stopListening();
    } else {
      this.startListening(onResult, onEnd);
    }
  }

  /**
   * Limpia el transcript actual
   */
  resetTranscript(): void {
    this.transcript.set('');
  }
}
