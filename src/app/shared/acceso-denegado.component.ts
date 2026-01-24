import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { BackendStatusService } from '../core/services/backend-status.service';

@Component({
  selector: 'app-acceso-denegado',
  standalone: true,
  imports: [MatButtonModule],
  template: `
    <div style="padding:2rem; text-align:center;">
      <h2 style="color:#b91c1c;">Acceso denegado</h2>
      <p style="color:#666;">No tienes permisos suficientes para acceder a esta sección.</p>
      <button mat-raised-button color="primary" (click)="volverAlLogin()" style="margin-top:1rem;">
        Volver al Login
      </button>
    </div>
  `
})
export class AccesoDenegadoComponent {
  private router = inject(Router);
  private backendStatus = inject(BackendStatusService);

  volverAlLogin(): void {
    // Limpiar cualquier estado de auth y backend antes de ir al login
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    this.backendStatus.reset();
    this.router.navigate(['/auth/login']);
  }
}
