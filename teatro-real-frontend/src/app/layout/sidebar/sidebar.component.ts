import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { NotificationBellComponent } from '../../shared/components/notification-bell/notification-bell.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, NotificationBellComponent],
  template: `
    <nav class="bg-teatro-black h-full w-56 flex flex-col py-4 font-montserrat text-[15px]">
      <div class="flex items-center px-6 pb-7">
        <span class="font-black text-xl tracking-tight uppercase text-white">Teatro Real</span>
      </div>
      <ul class="flex-1 flex flex-col gap-1">
        <!-- Dashboard always on top -->
        <li>
          <a routerLink="/dashboard" routerLinkActive="active"
             class="sidebar-link" [routerLinkActiveOptions]="{ exact: true }">
            <mat-icon fontIcon="dashboard" class="sidebar-icon">dashboard</mat-icon>
            <span>Dashboard</span>
          </a>
        </li>

        <!-- Sección Tempo -->
        <li class="sidebar-section-label mt-2 mb-1">Tempo</li>
        <li>
          <a routerLink="/tempo/espacios" routerLinkActive="active" class="sidebar-link">
            <mat-icon fontIcon="meeting_room" class="sidebar-icon">meeting_room</mat-icon>
            <span>Espacios</span>
          </a>
        </li>
        <li>
          <a routerLink="/tempo/calendario" routerLinkActive="active" class="sidebar-link">
            <mat-icon fontIcon="calendar_today" class="sidebar-icon">calendar_today</mat-icon>
            <span>Calendario</span>
          </a>
        </li>
        <li>
          <a routerLink="/tempo/logistica" routerLinkActive="active" class="sidebar-link">
            <mat-icon fontIcon="local_shipping" class="sidebar-icon">local_shipping</mat-icon>
            <span>Logística</span>
          </a>
        </li>
        <li>
          <a routerLink="/tempo/carteleria" routerLinkActive="active" class="sidebar-link">
            <mat-icon fontIcon="receipt_long" class="sidebar-icon">receipt_long</mat-icon>
            <span>Cartelería</span>
          </a>
        </li>

        <!-- Sección Tops -->
        <li class="sidebar-section-label mt-4 mb-1">Tops</li>
        <li>
          <a routerLink="/tops/producciones" routerLinkActive="active" class="sidebar-link">
            <mat-icon fontIcon="movie" class="sidebar-icon">movie</mat-icon>
            <span>Producciones</span>
          </a>
        </li>
        <li>
          <a routerLink="/tops/guiones-tecnicos" routerLinkActive="active" class="sidebar-link">
            <mat-icon fontIcon="description" class="sidebar-icon">description</mat-icon>
            <span>Guiones Técnicos</span>
          </a>
        </li>
        <li>
          <a routerLink="/tops/guiones-new" routerLinkActive="active" class="sidebar-link">
            <mat-icon fontIcon="fiber_new" class="sidebar-icon">fiber_new</mat-icon>
            <span>Guiones NEW</span>
          </a>
        </li>
        <li>
          <a routerLink="/tops/editor-guiones" routerLinkActive="active" class="sidebar-link">
            <mat-icon fontIcon="edit" class="sidebar-icon">edit</mat-icon>
            <span>Editor de Guiones</span>
          </a>
        </li>

        <!-- Sección Admin separada al final -->
        <li class="sidebar-section-label mt-4 mb-1">Admin</li>
        <li>
          <a routerLink="/admin" routerLinkActive="active"
             class="sidebar-link">
            <mat-icon fontIcon="admin_panel_settings" class="sidebar-icon">admin_panel_settings</mat-icon>
            <span>Admin</span>
          </a>
        </li>
      </ul>
      <div class="mt-auto flex flex-col gap-2">
        <div class="border-t border-teatro-gray-900 px-6 text-xs text-teatro-gray-600 pt-4">
          © Teatro Real
        </div>
      </div>
    </nav>
  `,
  styles: [`
    nav {
      min-width: 14rem;
      box-shadow: 0 2px 16px rgba(0,0,0,0.12);
      font-family: 'Montserrat', sans-serif;
    }
    .sidebar-link {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 12px 1.5rem;
      color: #fff;
      border-radius: 8px;
      font-weight: 600;
      letter-spacing: 0.01em;
      transition: background 0.21s, color 0.21s;
      text-decoration: none;
    }
    .sidebar-link:hover, .sidebar-link:focus {
      background: #232323;
      color: #CF102D !important;
      outline: none;
    }
    .sidebar-link.active, .sidebar-link.router-link-active, .sidebar-link.router-link-exact-active {
      background: #1a1420;
      color: #CF102D !important;
      font-weight: 700;
    }
    .sidebar-icon {
      font-size: 22px !important;
      color: inherit !important;
      min-width: 24px;
    }
    .sidebar-section-label {
      color: #b0b0b0;
      font-weight: 600;
      font-size: 0.88em;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      padding-left: 1.5rem;
      padding-right: 1.5rem;
      margin-top: 1rem;
      margin-bottom: 0.25rem;
      pointer-events: none;
      user-select: none;
    }
  `]
})
export class SidebarComponent {}
