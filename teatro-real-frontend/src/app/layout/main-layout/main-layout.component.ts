import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';
import { BackendStatusIndicatorComponent } from '../../shared/backend-status-indicator/backend-status-indicator.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent, HeaderComponent, BackendStatusIndicatorComponent],
  template: `
    <!-- Indicador de estado del backend -->
    <app-backend-status-indicator></app-backend-status-indicator>

    <div class="min-h-screen flex bg-teatro-gray-100 text-teatro-black font-montserrat">
      <!-- Sidebar -->
      <app-sidebar class="hidden md:block"></app-sidebar>
      <!-- Main content area CON HEADER -->
      <div class="flex-1 flex flex-col min-h-screen">
        <app-header></app-header>
        <main class="flex-1 p-6">
          <router-outlet></router-outlet>
        </main>
        <footer class="bg-teatro-black text-white p-2 text-center">
          © Teatro Real
        </footer>
      </div>
    </div>
  `,
  styles: []
})
export class MainLayoutComponent {}
