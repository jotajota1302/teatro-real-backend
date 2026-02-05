import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ThemeService, ThemeMode } from '../../core/services/theme.service';

@Component({
  selector: 'app-configurator',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatSlideToggleModule],
  template: `
    <!-- Overlay -->
    <div
      class="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
      [class.opacity-100]="isOpen()"
      [class.opacity-0]="!isOpen()"
      [class.pointer-events-none]="!isOpen()"
      (click)="close()">
    </div>

    <!-- Panel -->
    <aside
      class="fixed top-0 right-0 z-50 h-screen w-80 md:w-96 shadow-lg transition-transform duration-300 overflow-y-auto"
      [class.translate-x-0]="isOpen()"
      [class.translate-x-full]="!isOpen()"
      [class.bg-white]="!isDark()"
      [class.bg-gray-900]="isDark()">

      <!-- Header -->
      <div class="flex items-start justify-between px-6 pt-8 pb-6 border-b"
           [class.border-gray-200]="!isDark()"
           [class.border-gray-700]="isDark()">
        <div>
          <h2 class="text-xl font-semibold"
              [class.text-gray-800]="!isDark()"
              [class.text-white]="isDark()">Configuración</h2>
          <p class="text-sm mt-1"
             [class.text-gray-500]="!isDark()"
             [class.text-gray-400]="isDark()">Personaliza el panel de control.</p>
        </div>
        <button
          mat-icon-button
          (click)="close()"
          [class.text-gray-500]="!isDark()"
          [class.text-gray-400]="isDark()"
          [class.hover:text-gray-700]="!isDark()"
          [class.hover:text-white]="isDark()">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <!-- Content -->
      <div class="py-6 px-6">
        <!-- Tema del Panel -->
        <div class="mb-8">
          <h3 class="text-base font-semibold mb-1"
              [class.text-gray-800]="!isDark()"
              [class.text-white]="isDark()">Tema del Panel</h3>
          <p class="text-sm mb-4"
             [class.text-gray-500]="!isDark()"
             [class.text-gray-400]="isDark()">Cambia la apariencia general del panel.</p>

          <div class="flex flex-col gap-3">
            <button
              (click)="setTheme('light')"
              class="w-full py-3 px-4 rounded-lg border-2 transition-all flex items-center justify-center gap-2 font-medium"
              [ngClass]="themeMode() === 'light'
                ? 'border-teatro-carmesi bg-teatro-carmesi text-white'
                : (isDark() ? 'border-gray-600 text-gray-300 hover:border-gray-500' : 'border-gray-300 text-gray-700 hover:border-gray-400')">
              <mat-icon class="text-xl">light_mode</mat-icon>
              Claro
            </button>

            <button
              (click)="setTheme('dark')"
              class="w-full py-3 px-4 rounded-lg border-2 transition-all flex items-center justify-center gap-2 font-medium"
              [ngClass]="themeMode() === 'dark'
                ? 'border-teatro-carmesi bg-teatro-carmesi text-white'
                : (isDark() ? 'border-gray-600 text-gray-300 hover:border-gray-500' : 'border-gray-300 text-gray-700 hover:border-gray-400')">
              <mat-icon class="text-xl">dark_mode</mat-icon>
              Oscuro
            </button>
          </div>
        </div>

        <!-- Menú Lateral Fijo -->
        <div class="mb-8">
          <hr [class.border-gray-200]="!isDark()" [class.border-gray-700]="isDark()" class="mb-5" />
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-base font-semibold"
                  [class.text-gray-800]="!isDark()"
                  [class.text-white]="isDark()">Menú Lateral Fijo</h3>
              <p class="text-sm mt-1"
                 [class.text-gray-500]="!isDark()"
                 [class.text-gray-400]="isDark()">El menú lateral permanece siempre visible.</p>
            </div>
            <mat-slide-toggle
              [checked]="sidenavFixed()"
              (change)="toggleSidenavFixed()"
              color="warn">
            </mat-slide-toggle>
          </div>
          <hr [class.border-gray-200]="!isDark()" [class.border-gray-700]="isDark()" class="mt-5" />
        </div>

        <!-- Info Teatro Real -->
        <div class="mt-10 text-center">
          <div class="flex items-center justify-center gap-2 mb-2">
            <div class="w-4 h-4 rounded-full bg-teatro-carmesi"></div>
            <span class="font-semibold text-sm"
                  [class.text-gray-700]="!isDark()"
                  [class.text-gray-300]="isDark()">Teatro Real Madrid</span>
          </div>
          <p class="text-sm"
             [class.text-gray-500]="!isDark()"
             [class.text-gray-400]="isDark()">Panel de Gestión Interno</p>
        </div>
      </div>
    </aside>
  `,
  styles: [`
    :host {
      display: contents;
    }

    .bg-teatro-carmesi {
      background-color: #CF102D;
    }

    .border-teatro-carmesi {
      border-color: #CF102D;
    }

    .text-teatro-carmesi {
      color: #CF102D;
    }
  `]
})
export class ConfiguratorComponent {
  private theme = inject(ThemeService);

  isOpen = this.theme.configuratorOpen;
  themeMode = this.theme.themeMode;
  sidenavFixed = this.theme.sidenavFixed;
  isDark = this.theme.isDark;

  close(): void {
    this.theme.closeConfigurator();
  }

  setTheme(mode: ThemeMode): void {
    this.theme.setTheme(mode);
  }

  toggleSidenavFixed(): void {
    this.theme.toggleSidenavFixed();
  }
}
