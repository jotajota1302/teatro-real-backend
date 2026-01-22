import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-pantalla-en-desarrollo',
  template: `
    <div class="pantalla-en-desarrollo">
      <h2>⚠️ Pantalla {{ pantalla }} en desarrollo ⚠️</h2>
      <p>Esta funcionalidad estará disponible próximamente.</p>
    </div>
  `,
  styles: [`
    .pantalla-en-desarrollo {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 60vh;
      font-family: 'Montserrat', Arial, sans-serif;
      color: #7d0251;
      background: #fff8ef;
      border: 1px dashed #cf102d;
      border-radius: 12px;
      margin: 32px;
      box-shadow: 0 2px 16px rgb(255 146 146 / 9%);
    }
    h2 {
      font-size: 1.7rem;
      margin-bottom: 14px;
    }
    p {
      font-size: 1.3rem;
      color: #222;
    }
  `]
})
export class PantallaEnDesarrolloComponent {
  pantalla = '';

  constructor(private route: ActivatedRoute) {
    this.pantalla =
      this.route.snapshot.data['nombre']
        ? this.route.snapshot.data['nombre']
        : '';
  }
}
