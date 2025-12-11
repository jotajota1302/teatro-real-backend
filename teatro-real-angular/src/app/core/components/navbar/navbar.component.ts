import { Component, inject } from '@angular/core';
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
    <header class="sticky top-0 z-30 bg-teatro-negro/80 backdrop-blur-sm border-b border-tr-gray-800">
      <div class="flex items-center justify-between h-16 px-4 lg:px-6">
        <!-- Left section -->
        <div class="flex items-center gap-4">
          <!-- Menu toggle -->
          <button
            class="text-tr-gray-400 hover:text-white transition-colors p-2 -ml-2"
            (click)="layoutService.toggleSidenav()">
            <span class="material-icons">menu</span>
          </button>

          <!-- Breadcrumb / Page title -->
          <div>
            <nav class="flex items-center gap-2 text-sm">
              <span class="text-tr-gray-400">Dashboard</span>
              <span class="text-tr-gray-600">/</span>
              <span class="text-white font-medium capitalize">{{ currentPage() }}</span>
            </nav>
            <h1 class="text-lg font-semibold text-white capitalize">{{ currentPage() }}</h1>
          </div>
        </div>

        <!-- Right section -->
        <div class="flex items-center gap-2">
          <!-- Search -->
          <button class="hidden md:flex items-center gap-2 px-4 py-2 bg-tr-gray-800 rounded-lg text-tr-gray-400 hover:text-white transition-colors">
            <span class="material-icons text-xl">search</span>
            <span class="text-sm">Buscar...</span>
            <kbd class="hidden lg:inline-block px-2 py-0.5 text-xs bg-tr-gray-900 rounded">⌘K</kbd>
          </button>

          <!-- Notifications -->
          <button class="relative p-2 text-tr-gray-400 hover:text-white transition-colors">
            <span class="material-icons">notifications</span>
            <span class="absolute top-1 right-1 w-2 h-2 bg-teatro-carmesi rounded-full"></span>
          </button>

          <!-- Settings -->
          <button class="p-2 text-tr-gray-400 hover:text-white transition-colors">
            <span class="material-icons">settings</span>
          </button>

          <!-- User menu (mobile) -->
          <button class="xl:hidden p-2 text-tr-gray-400 hover:text-white transition-colors">
            <div class="w-8 h-8 rounded-full bg-teatro-carmesi flex items-center justify-center text-white font-bold text-sm">
              MG
            </div>
          </button>
        </div>
      </div>
    </header>
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
}
