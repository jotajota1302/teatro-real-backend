import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  // Signals para estado reactivo
  private _sidenavOpen = signal(false); // Empieza cerrado, se abre con el botón
  private _darkMode = signal(true);

  // Computeds públicos (solo lectura)
  sidenavOpen = this._sidenavOpen.asReadonly();
  darkMode = this._darkMode.asReadonly();

  // El sidenav siempre es colapsable (se puede ocultar/mostrar)
  sidenavCollapsible = signal(true);

  // Computed para clases de tema
  themeClasses = computed(() => ({
    background: this._darkMode() ? 'bg-teatro-negro' : 'bg-tr-gray-100',
    text: this._darkMode() ? 'text-white' : 'text-tr-gray-900',
    textMuted: this._darkMode() ? 'text-tr-gray-400' : 'text-tr-gray-600'
  }));

  constructor() {
    // En desktop (xl) abrir el sidenav por defecto
    if (typeof window !== 'undefined' && window.innerWidth >= 1280) {
      this._sidenavOpen.set(true);
    }
  }

  toggleSidenav(): void {
    this._sidenavOpen.update(open => !open);
  }

  openSidenav(): void {
    this._sidenavOpen.set(true);
  }

  closeSidenav(): void {
    this._sidenavOpen.set(false);
  }

  toggleDarkMode(): void {
    this._darkMode.update(dark => !dark);
  }

  setDarkMode(dark: boolean): void {
    this._darkMode.set(dark);
  }
}
