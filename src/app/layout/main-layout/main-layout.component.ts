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

    <!-- Layout principal - altura fija sin scroll -->
    <div
      class="h-screen overflow-hidden font-montserrat transition-colors duration-300"
      [class]="bgClass()">

      <!-- Sidebar flotante - oculto en móvil -->
      <app-sidebar class="hidden md:block"></app-sidebar>

      <!-- Área de contenido principal - flex column para distribuir altura -->
      <div
        class="h-screen flex flex-col transition-all duration-300"
        [class]="contentAreaClass()">

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

    /* Hacer que el contenido del router-outlet ocupe todo el espacio disponible */
    main {
      display: flex;
      flex-direction: column;
    }

    main ::ng-deep router-outlet + * {
      flex: 1;
      min-height: 0;
      display: flex;
      flex-direction: column;
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
