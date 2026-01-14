import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen flex flex-col">
      <header class="bg-gray-900 text-white p-4">
        <h1>Teatro Real Frontend · MainLayout (placeholder)</h1>
      </header>
      <main class="flex-1 p-4">
        <router-outlet></router-outlet>
      </main>
      <footer class="bg-gray-900 text-white p-2 text-center">
        © Teatro Real
      </footer>
    </div>
  `
})
export class MainLayoutComponent {}
