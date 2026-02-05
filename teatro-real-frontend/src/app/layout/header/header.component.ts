import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { filter, map } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';

import { NotificationBellComponent } from '../../shared/components/notification-bell/notification-bell.component';
import { AuthService } from '../../core/auth/auth.service';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatDividerModule,
    NotificationBellComponent
  ],
  template: `
    <nav class="rounded-xl py-3 px-4 bg-transparent w-full">
      <div class="flex items-center justify-between gap-4">
        <!-- Botón menú móvil/colapsado - visible en móvil o cuando sidenav no está fijo -->
        <button
          class="mobile-menu-btn flex items-center justify-center w-10 h-10 rounded-lg transition-colors"
          [class.lg:hidden]="sidenavFixed()"
          [class.menu-btn-dark]="isDark()"
          [class.menu-btn-light]="!isDark()"
          (click)="toggleMobileMenu()"
          aria-label="Abrir menú">
          <mat-icon [ngClass]="textClass()">menu</mat-icon>
        </button>

        <!-- Breadcrumbs y título -->
        <div class="capitalize flex-1 min-w-0">
          <!-- Breadcrumbs -->
          <div class="flex items-center gap-1 text-xs md:text-sm">
            <a
              [routerLink]="['/', layout(), 'espacios']"
              class="font-normal opacity-50 transition-all hover:text-teatro-carmesi hover:opacity-100"
              [ngClass]="textClass()">
              {{ layout() }}
            </a>
            <span [ngClass]="textMutedClass()">/</span>
            <span class="font-normal truncate" [ngClass]="textClass()">
              {{ page() }}
            </span>
          </div>
          <!-- Título de página -->
          <h1 class="text-sm md:text-lg font-semibold truncate mt-1" [ngClass]="textClass()">
            {{ pageTitle() }}
          </h1>
        </div>

        <!-- Acciones -->
        <div class="flex items-center gap-2 flex-shrink-0">
          <!-- Menú de usuario -->
          <button
            [matMenuTriggerFor]="userMenu"
            class="user-menu-btn flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-black/5 transition-colors cursor-pointer">
            <div class="h-8 w-8 rounded-full bg-teatro-carmesi flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {{ userInitials() }}
            </div>
            <div class="hidden xl:flex flex-col text-left">
              <span class="font-semibold text-sm leading-tight" [ngClass]="textClass()">
                {{ userName() }}
              </span>
              <span class="font-normal text-xs leading-tight" [ngClass]="textMutedClass()">
                {{ userRole() }}
              </span>
            </div>
            <mat-icon class="hidden md:block text-base" [ngClass]="textMutedClass()">expand_more</mat-icon>
          </button>
          <mat-menu #userMenu="matMenu">
            <button mat-menu-item>
              <mat-icon>person</mat-icon>
              <span>Mi Perfil</span>
            </button>
            <button mat-menu-item>
              <mat-icon>settings</mat-icon>
              <span>Configuración</span>
            </button>
            <mat-divider></mat-divider>
            <button mat-menu-item class="text-red-500" (click)="logout()">
              <mat-icon class="text-red-500">logout</mat-icon>
              <span class="text-red-500">Cerrar Sesión</span>
            </button>
          </mat-menu>

          <!-- Notificaciones -->
          <app-notification-bell></app-notification-bell>

          <!-- Configurador de tema -->
          <button
            mat-icon-button
            (click)="openConfigurator()"
            title="Configuración de tema">
            <mat-icon [ngClass]="textMutedClass()">settings</mat-icon>
          </button>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    :host {
      display: block;
    }

    .text-teatro-carmesi {
      color: #CF102D;
    }

    .bg-teatro-carmesi {
      background-color: #CF102D;
    }

    .user-menu-btn {
      border: none;
      background: transparent;
      outline: none;
    }

    .user-menu-btn:hover {
      background: rgba(0, 0, 0, 0.05);
    }

    /* Mobile menu button hover states */
    .menu-btn-dark:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .menu-btn-light:hover {
      background: rgba(0, 0, 0, 0.05);
    }
  `]
})
export class HeaderComponent {
  private router = inject(Router);
  private authService = inject(AuthService);
  private theme = inject(ThemeService);

  // Tema
  isDark = this.theme.isDark;
  sidenavFixed = this.theme.sidenavFixed;

  // Breadcrumbs desde la URL
  private url$ = this.router.events.pipe(
    filter(event => event instanceof NavigationEnd),
    map(() => this.router.url)
  );

  private currentUrl = toSignal(this.url$, { initialValue: this.router.url });

  layout = computed(() => {
    const parts = this.currentUrl().split('/').filter(p => p);
    return parts[0] || 'tempo';
  });

  page = computed(() => {
    const parts = this.currentUrl().split('/').filter(p => p);
    const pagePart = parts[1] || 'espacios';
    // Si parece un UUID, mostrar "editor" en vez del UUID
    if (this.isUuid(pagePart)) {
      return 'editor';
    }
    return pagePart;
  });

  pageTitle = computed(() => {
    const pageName = this.page();
    // Capitalizar y formatear
    const titles: Record<string, string> = {
      'espacios': 'Espacios',
      'calendario': 'Calendario',
      'movimientos': 'Logística',
      'producciones': 'Producciones',
      'guiones-tecnicos': 'Guiones Técnicos',
      'guiones-new': 'Guiones NEW',
      'editor-guiones': 'Editor de Guiones',
      'editor': 'Editor de Guion',
      'global': 'Cartelería Global',
      'admin': 'Administración'
    };
    return titles[pageName] || pageName.charAt(0).toUpperCase() + pageName.slice(1);
  });

  // Helper para detectar UUIDs
  private isUuid(str: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
  }

  // Usuario
  userName = computed(() => {
    const user = this.authService.currentUser();
    return user?.nombre || 'Usuario';
  });

  userInitials = computed(() => {
    const name = this.userName();
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  });

  userRole = computed(() => {
    const user = this.authService.currentUser();
    const roles: Record<string, string> = {
      'ADMIN': 'Administrador',
      'GESTOR': 'Gestor',
      'OPERADOR': 'Operador',
      'VISUALIZADOR': 'Visualizador'
    };
    const rolNombre = user?.rol?.nombre || '';
    return roles[rolNombre] || 'Usuario';
  });

  // Clases de tema
  textClass = computed(() => {
    return this.isDark() ? 'text-white' : 'text-gray-700';
  });

  textMutedClass = computed(() => {
    return this.isDark() ? 'text-gray-400' : 'text-gray-500';
  });

  openConfigurator(): void {
    this.theme.openConfigurator();
  }

  logout(): void {
    this.authService.logout();
  }

  toggleMobileMenu(): void {
    this.theme.toggleMobileMenu();
  }
}
