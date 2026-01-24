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

    <!-- Layout principal -->
    <div
      class="min-h-screen font-montserrat transition-colors duration-300"
      [class]="bgClass()">

      <!-- Sidebar flotante - oculto en móvil -->
      <app-sidebar class="hidden md:block"></app-sidebar>

      <!-- Área de contenido principal -->
      <div
        class="min-h-screen transition-all duration-300"
        [class]="contentAreaClass()">

        <!-- Header -->
        <div class="sticky top-0 z-30 px-4 pt-4">
          <app-header></app-header>
        </div>

        <!-- Main content -->
        <main class="p-4 md:p-6">
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
  `]
})
export class MainLayoutComponent {
  private theme = inject(ThemeService);

  isDark = this.theme.isDark;
  sidenavFixed = this.theme.sidenavFixed;

  bgClass = computed(() => {
    return this.isDark() ? 'bg-[#1a1a2e]' : 'bg-gray-100';
  });

  contentAreaClass = computed(() => {
    // Si el sidenav está fijo (en desktop), agregar margen izquierdo
    // El sidebar es w-72 (18rem = 288px) + ml-4 (1rem = 16px) = 304px
    // Añadimos mr-4 para equilibrar
    return this.sidenavFixed()
      ? 'md:ml-[304px] md:mr-4'
      : '';
  });
}
