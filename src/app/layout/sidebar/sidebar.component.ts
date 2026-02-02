import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ThemeService } from '../../core/services/theme.service';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  template: `
    <!-- Sidebar flotante estilo MVP -->
    <aside
      class="fixed inset-y-0 left-0 z-50 my-4 ml-4 w-72 rounded-xl border transition-all duration-300 flex flex-col overflow-hidden"
      [class]="sidenavClasses()">

      <!-- Logo / Brand -->
      <div class="flex items-center justify-center px-6 py-5">
        <img
          src="/assets/images/teatro-real-logo.svg"
          alt="Teatro Real"
          class="h-12 w-auto" />
      </div>

      <!-- Navigation - scrollable -->
      <nav class="flex-1 overflow-y-auto px-4 pb-4">
        <!-- TEMPO Section -->
        @if (canAccessTempo()) {
          <div class="mb-4">
            <p class="mx-3 mt-4 mb-2 text-xs font-bold uppercase tracking-wider" [class]="textMutedClass()">
              Tempo
            </p>
            <ul class="flex flex-col gap-1">
              <li>
                <a routerLink="/tempo/espacios" routerLinkActive="active" class="nav-item" [class]="navItemClass()">
                  <mat-icon class="nav-icon">location_city</mat-icon>
                  <span>Espacios</span>
                </a>
              </li>
              <li>
                <a routerLink="/tempo/calendario" routerLinkActive="active" class="nav-item" [class]="navItemClass()">
                  <mat-icon class="nav-icon">calendar_month</mat-icon>
                  <span>Calendario</span>
                </a>
              </li>
              <li>
                <a routerLink="/tempo/movimientos" routerLinkActive="active" class="nav-item" [class]="navItemClass()">
                  <mat-icon class="nav-icon">local_shipping</mat-icon>
                  <span>Logística</span>
                </a>
              </li>
              <li>
                <a routerLink="/tempo/carteleria" routerLinkActive="active" class="nav-item" [class]="navItemClass()">
                  <mat-icon class="nav-icon">tv</mat-icon>
                  <span>Cartelería</span>
                </a>
              </li>
            </ul>
          </div>
        }

        <!-- TOPS Section -->
        @if (canAccessTops()) {
          <div class="mb-4">
            <p class="mx-3 mt-4 mb-2 text-xs font-bold uppercase tracking-wider" [class]="textMutedClass()">
              Tops
            </p>
            <ul class="flex flex-col gap-1">
              <li>
                <a routerLink="/tops" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-item" [class]="navItemClass()">
                  <mat-icon class="nav-icon">description</mat-icon>
                  <span>Guiones Técnicos</span>
                </a>
              </li>
            </ul>
          </div>
        }

        <!-- Admin Section -->
        @if (canAccessAdmin()) {
          <div class="mt-6">
            <ul class="flex flex-col gap-1">
              <li>
                <a routerLink="/admin" routerLinkActive="active" class="nav-item" [class]="navItemClass()">
                  <mat-icon class="nav-icon">admin_panel_settings</mat-icon>
                  <span>Admin</span>
                </a>
              </li>
            </ul>
          </div>
        }
      </nav>

      <!-- Footer -->
      <div class="px-6 py-4 border-t" [class]="borderClass()">
        <p class="text-xs" [class]="textMutedClass()">© Teatro Real Madrid</p>
      </div>
    </aside>
  `,
  styles: [`
    :host {
      display: block;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      border-radius: 0.5rem;
      font-weight: 500;
      font-size: 0.875rem;
      text-decoration: none;
      transition: all 0.2s ease;
    }

    .nav-icon {
      font-size: 20px !important;
      width: 20px !important;
      height: 20px !important;
    }

    /* Active state - siempre carmesí */
    .nav-item.active,
    .nav-item.router-link-active {
      background-color: #CF102D !important;
      color: white !important;
      font-weight: 600;
      box-shadow: 0 4px 6px -1px rgba(207, 16, 45, 0.3);
    }

    .nav-item.active .nav-icon,
    .nav-item.router-link-active .nav-icon {
      color: white !important;
    }

    /* Light theme hover */
    .nav-item-light:not(.active):not(.router-link-active):hover {
      background-color: #f1f5f9;
    }

    /* Dark theme hover */
    .nav-item-dark:not(.active):not(.router-link-active):hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
  `]
})
export class SidebarComponent {
  private theme = inject(ThemeService);
  private auth = inject(AuthService);

  isDark = this.theme.isDark;

  // Permission checks as computed signals
  canAccessTempo = computed(() => this.auth.canAccessModule('TEMPO'));
  canAccessTops = computed(() => this.auth.canAccessModule('TOPS'));
  canAccessAdmin = computed(() => this.auth.canAccessModule('ADMIN'));

  sidenavClasses = computed(() => {
    return this.isDark()
      ? 'bg-[#010101] border-gray-800'
      : 'bg-white border-gray-200';
  });

  textClass = computed(() => {
    return this.isDark() ? 'text-white' : 'text-gray-900';
  });

  textMutedClass = computed(() => {
    return this.isDark() ? 'text-gray-400' : 'text-gray-500';
  });

  navItemClass = computed(() => {
    return this.isDark()
      ? 'text-gray-300 nav-item-dark'
      : 'text-gray-700 nav-item-light';
  });

  borderClass = computed(() => {
    return this.isDark() ? 'border-gray-800' : 'border-gray-200';
  });
}
