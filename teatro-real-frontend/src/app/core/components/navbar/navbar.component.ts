import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';
import { LayoutService } from '../../services/layout.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="rounded-xl py-2 md:py-3 px-2 md:px-4 bg-transparent">
      <div class="flex items-center justify-between gap-2 md:gap-6">
        <!-- Breadcrumbs y título -->
        <div class="capitalize flex-1 min-w-0">
          <div class="flex items-center gap-2 text-sm">
            <a href="/home" class="text-white/50 hover:text-teatro-carmesi transition-colors text-xs md:text-sm">
              dashboard
            </a>
            <span class="text-tr-gray-600">/</span>
            <span class="text-white text-xs md:text-sm truncate">{{ currentPage() }}</span>
          </div>
          <h1 class="text-white text-sm md:text-lg font-semibold truncate capitalize">{{ currentPage() }}</h1>
        </div>

        <!-- Iconos y acciones -->
        <div class="flex items-center flex-shrink-0">
          <!-- Botón menú hamburguesa -->
          <button
            class="xl:hidden p-2 text-tr-gray-300 hover:text-white transition-colors"
            (click)="layoutService.toggleSidenav()">
            <span class="material-icons text-xl md:text-2xl">menu</span>
          </button>

          <!-- Usuario con menú desplegable -->
          <div class="relative">
            <button
              class="flex items-center gap-1 md:gap-2 px-1 md:px-3 py-1 text-white hover:bg-white/5 rounded-lg transition-colors"
              (click)="toggleUserMenu()">
              <div class="h-7 w-7 md:h-8 md:w-8 rounded-full bg-teatro-carmesi flex items-center justify-center text-white font-bold text-xs md:text-sm">
                MG
              </div>
              <div class="hidden xl:block text-left">
                <p class="text-white font-semibold text-sm">Manuel García</p>
                <p class="text-tr-gray-300 text-xs">Regidor</p>
              </div>
              <span class="material-icons text-tr-gray-300 text-sm hidden md:block">expand_more</span>
            </button>

            <!-- Dropdown menu -->
            @if (userMenuOpen()) {
              <div class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
                <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Mi Perfil
                </a>
                <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Configuración
                </a>
                <hr class="my-1 border-gray-200">
                <a href="#" class="block px-4 py-2 text-sm text-red-500 hover:bg-gray-100">
                  Cerrar Sesión
                </a>
              </div>
            }
          </div>

          <!-- Notificaciones -->
          <div class="relative">
            <button
              class="p-2 text-tr-gray-300 hover:text-white transition-colors"
              (click)="toggleNotifications()">
              <span class="material-icons text-lg md:text-xl">notifications</span>
              <span class="absolute top-1 right-1 w-2 h-2 bg-teatro-carmesi rounded-full"></span>
            </button>

            <!-- Dropdown notificaciones -->
            @if (notificationsOpen()) {
              <div class="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 z-50">
                <div class="px-4 py-2 border-b border-gray-100">
                  <p class="font-semibold text-gray-800">Notificaciones</p>
                </div>
                <a href="#" class="flex items-center gap-4 px-4 py-3 hover:bg-gray-50">
                  <div class="w-9 h-9 rounded-full bg-gradient-to-tr from-orange-500 to-orange-700 flex items-center justify-center">
                    <span class="material-icons text-white text-sm">warning</span>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm text-gray-800"><strong>Cambio de horario</strong> - Ensayo La Traviata</p>
                    <p class="text-xs text-gray-500 flex items-center gap-1">
                      <span class="material-icons text-xs">schedule</span> Hace 15 minutos
                    </p>
                  </div>
                </a>
                <a href="#" class="flex items-center gap-4 px-4 py-3 hover:bg-gray-50">
                  <div class="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-blue-700 flex items-center justify-center">
                    <span class="material-icons text-white text-sm">calendar_today</span>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm text-gray-800"><strong>Nueva actividad</strong> en Sala Gayarre</p>
                    <p class="text-xs text-gray-500 flex items-center gap-1">
                      <span class="material-icons text-xs">schedule</span> Hace 1 hora
                    </p>
                  </div>
                </a>
                <a href="#" class="flex items-center gap-4 px-4 py-3 hover:bg-gray-50">
                  <div class="w-9 h-9 rounded-full bg-gradient-to-tr from-green-500 to-green-700 flex items-center justify-center">
                    <span class="material-icons text-white text-sm">check_circle</span>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm text-gray-800"><strong>Recogida completada</strong> - Moses und Pharaon</p>
                    <p class="text-xs text-gray-500 flex items-center gap-1">
                      <span class="material-icons text-xs">schedule</span> Ayer
                    </p>
                  </div>
                </a>
              </div>
            }
          </div>

          <!-- Configuración -->
          <button class="p-2 text-tr-gray-300 hover:text-white transition-colors">
            <span class="material-icons text-lg md:text-xl">settings</span>
          </button>
        </div>
      </div>
    </nav>

    <!-- Click outside to close dropdowns -->
    @if (userMenuOpen() || notificationsOpen()) {
      <div class="fixed inset-0 z-40" (click)="closeAllMenus()"></div>
    }
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class NavbarComponent {
  layoutService = inject(LayoutService);
  private router = inject(Router);

  userMenuOpen = signal(false);
  notificationsOpen = signal(false);

  currentPage = toSignal(
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map((event: NavigationEnd) => {
        const path = event.urlAfterRedirects.split('/').pop() || 'home';
        return path.replace(/-/g, ' ');
      })
    ),
    { initialValue: 'home' }
  );

  toggleUserMenu(): void {
    this.notificationsOpen.set(false);
    this.userMenuOpen.update(open => !open);
  }

  toggleNotifications(): void {
    this.userMenuOpen.set(false);
    this.notificationsOpen.update(open => !open);
  }

  closeAllMenus(): void {
    this.userMenuOpen.set(false);
    this.notificationsOpen.set(false);
  }
}
