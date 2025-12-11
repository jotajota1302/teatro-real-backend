import { Component, inject } from '@angular/core';
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
        class="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 xl:opacity-0 xl:pointer-events-none"
        (click)="layoutService.closeSidenav()">
      </div>
    }

    <!-- Sidenav -->
    <aside
      class="fixed z-50 my-4 ml-4 h-[calc(100vh-32px)] w-72 bg-teatro-negro rounded-xl border border-tr-gray-800 transform transition-transform duration-300 ease-in-out flex flex-col"
      [class.translate-x-0]="layoutService.sidenavOpen()"
      [class.-translate-x-80]="!layoutService.sidenavOpen()"
      [class.xl:translate-x-0]="true">

      <!-- Header con botón cerrar (solo móvil) -->
      <div class="flex items-center justify-end p-3 xl:hidden">
        <button
          class="text-tr-gray-400 hover:text-white transition-colors p-1"
          (click)="layoutService.closeSidenav()">
          <span class="material-icons">close</span>
        </button>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 overflow-y-auto px-4 pt-4 pb-4">
        @for (group of menuRoutes; track group.title) {
          <ul class="mb-4 flex flex-col gap-1">
            @if (group.title) {
              <li class="mx-3.5 mt-4 mb-2">
                <span class="text-xs font-black text-white/75 uppercase tracking-wider">
                  {{ group.title }}
                </span>
              </li>
            }
            @for (route of group.routes; track route.path) {
              <li>
                <a
                  [routerLink]="route.path"
                  routerLinkActive="active-link"
                  [routerLinkActiveOptions]="{ exact: route.path === '/home' }"
                  class="flex items-center gap-3 px-4 py-3 rounded-lg text-white hover:bg-white/10 transition-colors duration-200"
                  (click)="onNavClick()">
                  <span class="material-icons text-xl">{{ route.icon }}</span>
                  <span class="font-medium capitalize">{{ route.title }}</span>
                </a>
              </li>
            }
          </ul>
        }
      </nav>
    </aside>
  `,
  styles: [`
    :host {
      display: block;
    }
    .active-link {
      background-color: #CF102D !important;
      color: white !important;
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
    }
    .active-link:hover {
      background-color: #A00D24 !important;
    }
  `]
})
export class SidenavComponent {
  layoutService = inject(LayoutService);
  menuRoutes = MENU_ROUTES;

  onNavClick(): void {
    if (window.innerWidth < 1280) {
      this.layoutService.closeSidenav();
    }
  }
}
