import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BackendStatusService } from './core/services/backend-status.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <router-outlet />
  `,
  styles: [],
})
export class AppComponent implements OnInit {
  private backendStatus = inject(BackendStatusService);

  ngOnInit(): void {
    // Inicia keep-alive para evitar que el backend de Render se duerma
    this.backendStatus.startKeepAlive();
  }
}
