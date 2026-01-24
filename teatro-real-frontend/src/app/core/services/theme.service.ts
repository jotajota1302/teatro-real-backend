import { Injectable, signal, computed, effect } from '@angular/core';

export type ThemeMode = 'light' | 'dark';

/**
 * Servicio para gestionar el tema visual de la aplicación.
 * Persiste la preferencia del usuario en localStorage.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly STORAGE_KEY = 'teatro_theme';

  // Signals privadas
  private themeModeSignal = signal<ThemeMode>('light');
  private sidenavFixedSignal = signal<boolean>(true);
  private configuratorOpenSignal = signal<boolean>(false);

  // Signals públicas read-only
  themeMode = this.themeModeSignal.asReadonly();
  sidenavFixed = this.sidenavFixedSignal.asReadonly();
  configuratorOpen = this.configuratorOpenSignal.asReadonly();

  // Computed para clases CSS
  isDark = computed(() => this.themeModeSignal() === 'dark');
  isLight = computed(() => this.themeModeSignal() === 'light');

  // Clases de tema
  bgClass = computed(() => this.isDark() ? 'bg-teatro-black' : 'bg-gray-100');
  sidenavBgClass = computed(() => this.isDark() ? 'bg-teatro-black border-gray-800' : 'bg-white border-gray-200');
  textClass = computed(() => this.isDark() ? 'text-white' : 'text-gray-700');
  textMutedClass = computed(() => this.isDark() ? 'text-gray-400' : 'text-gray-500');

  constructor() {
    this.loadFromStorage();

    // Persistir cambios automáticamente
    effect(() => {
      const theme = this.themeModeSignal();
      const fixed = this.sidenavFixedSignal();
      this.saveToStorage({ theme, fixed });
    });
  }

  setTheme(mode: ThemeMode): void {
    this.themeModeSignal.set(mode);
  }

  toggleTheme(): void {
    this.themeModeSignal.update(current => current === 'light' ? 'dark' : 'light');
  }

  setSidenavFixed(fixed: boolean): void {
    this.sidenavFixedSignal.set(fixed);
  }

  toggleSidenavFixed(): void {
    this.sidenavFixedSignal.update(current => !current);
  }

  openConfigurator(): void {
    this.configuratorOpenSignal.set(true);
  }

  closeConfigurator(): void {
    this.configuratorOpenSignal.set(false);
  }

  toggleConfigurator(): void {
    this.configuratorOpenSignal.update(current => !current);
  }

  private loadFromStorage(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (stored) {
          const { theme, fixed } = JSON.parse(stored);
          if (theme === 'light' || theme === 'dark') {
            this.themeModeSignal.set(theme);
          }
          if (typeof fixed === 'boolean') {
            this.sidenavFixedSignal.set(fixed);
          }
        }
      } catch (e) {
        console.warn('[ThemeService] Error loading theme from storage');
      }
    }
  }

  private saveToStorage(config: { theme: ThemeMode; fixed: boolean }): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(config));
      } catch (e) {
        console.warn('[ThemeService] Error saving theme to storage');
      }
    }
  }
}
