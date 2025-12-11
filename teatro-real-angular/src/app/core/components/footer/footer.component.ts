import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="py-4 px-6 border-t border-tr-gray-800">
      <div class="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-tr-gray-400">
        <p>&copy; {{ currentYear }} Teatro Real - Sistema de Gestión</p>
        <p>Versión 1.0.0</p>
      </div>
    </footer>
  `
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
