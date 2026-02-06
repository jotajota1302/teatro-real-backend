import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';
import { ConfiguratorComponent } from '../configurator/configurator.component';
import { BackendStatusIndicatorComponent } from '../../shared/backend-status-indicator/backend-status-indicator.component';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SidebarComponent,
    HeaderComponent,
    ConfiguratorComponent,
    BackendStatusIndicatorComponent
  ],
  template: `
    <!-- Indicador de estado del backend -->
    <app-backend-status-indicator></app-backend-status-indicator>

    <!-- Mobile/Collapsed Menu Overlay - visible en móvil o cuando sidenav no está fijo -->
    @if (mobileMenuOpen()) {
      <div
        class="mobile-overlay fixed inset-0 bg-black/50 z-[60]"
        [class.lg:hidden]="sidenavFixed()"
        (click)="closeMobileMenu()">
      </div>
    }

    <!-- Mobile/Collapsed Drawer - visible en móvil o cuando sidenav no está fijo -->
    <div
      class="mobile-drawer fixed inset-y-0 left-0 z-[70] w-72 transform transition-transform duration-300 ease-in-out"
      [class.lg:hidden]="sidenavFixed()"
      [class.translate-x-0]="mobileMenuOpen()"
      [class.-translate-x-full]="!mobileMenuOpen()">
      <app-sidebar [isMobile]="true" (linkClicked)="closeMobileMenu()"></app-sidebar>
    </div>

    <!-- Layout principal - altura fija sin scroll -->
    <div
      class="h-screen overflow-hidden font-montserrat transition-colors duration-300"
      [ngClass]="bgClass()">

      <!-- Sidebar flotante - oculto en pantallas pequeñas o cuando no está fijo -->
      @if (sidenavFixed()) {
        <app-sidebar class="desktop-sidebar"></app-sidebar>
      }

      <!-- Área de contenido principal - flex column para distribuir altura -->
      <div
        class="h-screen flex flex-col transition-all duration-300"
        [ngClass]="contentAreaClass()">

        <!-- Header - altura fija -->
        <div class="flex-shrink-0 z-30 px-4 pt-4">
          <app-header></app-header>
        </div>

        <!-- Main content - flex para que el contenido herede la altura -->
        <main class="flex-1 min-h-0 flex flex-col p-4 md:p-6">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>

    <!-- Configurator Panel -->
    <app-configurator></app-configurator>
  `,
  styles: [`
    :host {
      display: block;
    }

    /* Mobile overlay animation */
    .mobile-overlay {
      animation: fadeIn 0.2s ease-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    /* Mobile drawer */
    .mobile-drawer {
      box-shadow: 4px 0 24px rgba(0, 0, 0, 0.15);
    }

    /* Hacer que el contenido del router-outlet ocupe todo el espacio disponible */
    main {
      display: flex;
      flex-direction: column;
      /* Enable smooth touch scrolling on mobile */
      -webkit-overflow-scrolling: touch;
      overscroll-behavior: contain;
    }

    main ::ng-deep router-outlet + * {
      flex: 1;
      min-height: 0;
      display: flex;
      flex-direction: column;
    }

    /* Mobile touch scroll improvements */
    @media (pointer: coarse) {
      main {
        touch-action: pan-y;
      }
    }

    /* Hide desktop sidebar on small screens */
    .desktop-sidebar {
      display: none;
    }

    @media (min-width: 1024px) {
      .desktop-sidebar {
        display: block;
      }
    }

    /* ================================================
       Safe Area Support for iPhone
       ================================================ */

    /* Apply safe area padding to main layout container */
    @supports (padding-top: env(safe-area-inset-top)) {
      /* Main container respects notch/Dynamic Island */
      .h-screen {
        padding-top: env(safe-area-inset-top, 0px);
        padding-bottom: env(safe-area-inset-bottom, 0px);
        /* Adjust height to account for safe areas */
        height: calc(100vh - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px));
        min-height: calc(100vh - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px));
      }

      /* Mobile drawer should respect safe areas */
      .mobile-drawer {
        padding-top: env(safe-area-inset-top, 0px);
        padding-bottom: env(safe-area-inset-bottom, 0px);
      }
    }

    /* Mobile optimizations (480px and below) */
    @media (max-width: 480px) {
      main {
        padding: 0.5rem !important;
      }

      /* Reduce header padding on mobile */
      .flex-shrink-0.z-30 {
        padding: 0.5rem 0.5rem 0 0.5rem;
      }
    }

    /* iPhone 16 Pro (390px) */
    @media (max-width: 390px) {
      main {
        padding: 0.375rem !important;
      }

      .flex-shrink-0.z-30 {
        padding: 0.375rem 0.375rem 0 0.375rem;
      }
    }
  `]
})
export class MainLayoutComponent {
  private theme = inject(ThemeService);

  isDark = this.theme.isDark;
  sidenavFixed = this.theme.sidenavFixed;
  mobileMenuOpen = this.theme.mobileMenuOpen;

  bgClass = computed(() => {
    return this.isDark() ? 'bg-[#1a1a2e]' : 'bg-gray-100';
  });

  contentAreaClass = computed(() => {
    // Si el sidenav está fijo (en desktop), agregar margen izquierdo
    // El sidebar es w-72 (18rem = 288px) + ml-4 (1rem = 16px) = 304px
    // Añadimos mr-4 para equilibrar
    return this.sidenavFixed()
      ? 'lg:ml-[304px] lg:mr-4'
      : '';
  });

  closeMobileMenu(): void {
    this.theme.closeMobileMenu();
  }
}
