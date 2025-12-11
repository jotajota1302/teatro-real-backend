import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidenavComponent } from '../components/sidenav/sidenav.component';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { FooterComponent } from '../components/footer/footer.component';
import { LayoutService } from '../services/layout.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SidenavComponent,
    NavbarComponent,
    FooterComponent
  ],
  template: `
    <div class="min-h-screen bg-teatro-negro">
      <!-- Sidenav -->
      <app-sidenav />

      <!-- Main content area -->
      <div
        class="min-h-screen flex flex-col transition-all duration-300"
        [class.ml-72]="layoutService.sidenavOpen()">

        <!-- Navbar -->
        <app-navbar />

        <!-- Page content -->
        <main class="flex-1 p-4 lg:p-6">
          <router-outlet />
        </main>

        <!-- Footer -->
        <app-footer />
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class MainLayoutComponent {
  layoutService = inject(LayoutService);
}
