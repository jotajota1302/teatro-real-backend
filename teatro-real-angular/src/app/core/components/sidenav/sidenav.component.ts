import { Component, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MENU_ROUTES } from '../../models/route.model';
import { LayoutService } from '../../services/layout.service';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- Overlay para cerrar sidenav -->
    @if (layoutService.sidenavOpen()) {
      <div
        class="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
        [class.xl:hidden]="!layoutService.sidenavCollapsible()"
        (click)="layoutService.closeSidenav()">
      </div>
    }

    <!-- Sidenav -->
    <aside
      class="fixed inset-y-0 left-0 z-50 w-72 bg-teatro-negro border-r border-tr-gray-800 transform transition-transform duration-300 ease-in-out flex flex-col"
      [class.translate-x-0]="layoutService.sidenavOpen()"
      [class.-translate-x-full]="!layoutService.sidenavOpen()">

      <!-- Header -->
      <div class="h-16 flex items-center justify-between px-6 border-b border-tr-gray-800 flex-shrink-0">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 bg-teatro-carmesi rounded-lg flex items-center justify-center flex-shrink-0">
            <span class="material-icons text-white text-lg">theater_comedy</span>
          </div>
          <span class="text-white font-bold text-lg">Teatro Real</span>
        </div>
        <button
          class="text-tr-gray-400 hover:text-white transition-colors p-1"
          (click)="layoutService.closeSidenav()">
          <span class="material-icons">close</span>
        </button>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 overflow-y-auto py-4 px-3">
        @for (group of menuRoutes; track group.title) {
          @if (group.title) {
            <div class="px-3 mt-6 mb-2">
              <span class="text-xs font-bold text-tr-gray-400 uppercase tracking-wider">
                {{ group.title }}
              </span>
            </div>
          }
          <ul class="space-y-1">
            @for (route of group.routes; track route.path) {
              <li>
                <a
                  [routerLink]="route.path"
                  routerLinkActive="bg-teatro-carmesi text-white"
                  [routerLinkActiveOptions]="{ exact: route.path === '/home' }"
                  class="flex items-center gap-3 px-4 py-3 rounded-lg text-tr-gray-200 hover:bg-tr-gray-800 hover:text-white transition-colors duration-200"
                  (click)="onNavClick()">
                  <span class="material-icons text-xl">{{ route.icon }}</span>
                  <span class="font-medium">{{ route.title }}</span>
                </a>
              </li>
            }
          </ul>
        }
      </nav>

      <!-- Footer -->
      <div class="p-4 border-t border-tr-gray-800 flex-shrink-0">
        <div class="flex items-center gap-3 px-2">
          <div class="w-10 h-10 rounded-full bg-teatro-carmesi flex items-center justify-center text-white font-bold flex-shrink-0">
            MG
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-white font-medium text-sm truncate">Manuel García</p>
            <p class="text-tr-gray-400 text-xs truncate">Regidor</p>
          </div>
        </div>
      </div>
    </aside>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class SidenavComponent {
  layoutService = inject(LayoutService);
  menuRoutes = MENU_ROUTES;

  onNavClick(): void {
    // En móvil siempre cerrar, en desktop solo si es colapsable
    if (window.innerWidth < 1280 || this.layoutService.sidenavCollapsible()) {
      this.layoutService.closeSidenav();
    }
  }
}
