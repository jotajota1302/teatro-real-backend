import { Component } from '@angular/core';

@Component({
  selector: 'app-main-layout',
  standalone: true,
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
