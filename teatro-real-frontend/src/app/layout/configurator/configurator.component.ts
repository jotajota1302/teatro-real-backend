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
      class="fixed top-0 right-0 z-50 h-screen w-80 md:w-96 bg-white shadow-lg transition-transform duration-300 overflow-y-auto"
      [class.translate-x-0]="isOpen()"
      [class.translate-x-full]="!isOpen()">

      <!-- Header -->
      <div class="flex items-start justify-between px-6 pt-8 pb-6 border-b border-gray-200">
        <div>
          <h2 class="text-xl font-semibold text-gray-800">Configuración</h2>
          <p class="text-sm text-gray-500 mt-1">Personaliza el panel de control.</p>
        </div>
        <button
          mat-icon-button
          (click)="close()"
          class="text-gray-500 hover:text-gray-700">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <!-- Content -->
      <div class="py-6 px-6">
        <!-- Tema del Panel -->
        <div class="mb-8">
          <h3 class="text-base font-semibold text-gray-800 mb-1">Tema del Panel</h3>
          <p class="text-sm text-gray-500 mb-4">Cambia la apariencia general del panel.</p>

          <div class="flex flex-col gap-3">
            <button
              (click)="setTheme('light')"
              class="w-full py-3 px-4 rounded-lg border-2 transition-all flex items-center justify-center gap-2 font-medium"
              [class]="themeMode() === 'light'
                ? 'border-teatro-carmesi bg-teatro-carmesi text-white'
                : 'border-gray-300 text-gray-700 hover:border-gray-400'">
              <mat-icon class="text-xl">light_mode</mat-icon>
              Claro
            </button>

            <button
              (click)="setTheme('dark')"
              class="w-full py-3 px-4 rounded-lg border-2 transition-all flex items-center justify-center gap-2 font-medium"
              [class]="themeMode() === 'dark'
                ? 'border-teatro-carmesi bg-teatro-carmesi text-white'
                : 'border-gray-300 text-gray-700 hover:border-gray-400'">
              <mat-icon class="text-xl">dark_mode</mat-icon>
              Oscuro
            </button>
          </div>
        </div>

        <!-- Menú Lateral Fijo -->
        <div class="mb-8">
          <hr class="border-gray-200 mb-5" />
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-base font-semibold text-gray-800">Menú Lateral Fijo</h3>
              <p class="text-sm text-gray-500 mt-1">El menú lateral permanece siempre visible.</p>
            </div>
            <mat-slide-toggle
              [checked]="sidenavFixed()"
              (change)="toggleSidenavFixed()"
              color="warn">
            </mat-slide-toggle>
          </div>
          <hr class="border-gray-200 mt-5" />
        </div>

        <!-- Info Teatro Real -->
        <div class="mt-10 text-center">
          <div class="flex items-center justify-center gap-2 mb-2">
            <div class="w-4 h-4 rounded-full bg-teatro-carmesi"></div>
            <span class="font-semibold text-gray-700 text-sm">Teatro Real Madrid</span>
          </div>
          <p class="text-sm text-gray-500">Panel de Gestión Interno</p>
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
