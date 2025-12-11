import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  // Signals para estado reactivo
  private _sidenavOpen = signal(true); // Abierto por defecto
  private _darkMode = signal(true);

  // Computeds públicos (solo lectura)
  sidenavOpen = this._sidenavOpen.asReadonly();
  darkMode = this._darkMode.asReadonly();

  // Computed para clases de tema
  themeClasses = computed(() => ({
    background: this._darkMode() ? 'bg-teatro-negro' : 'bg-tr-gray-100',
    text: this._darkMode() ? 'text-white' : 'text-tr-gray-900',
    textMuted: this._darkMode() ? 'text-tr-gray-400' : 'text-tr-gray-600'
  }));

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
