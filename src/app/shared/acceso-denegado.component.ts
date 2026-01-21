import { Component } from '@angular/core';

@Component({
  selector: 'app-acceso-denegado',
  standalone: true,
  template: `
    <div style="padding:2rem; text-align:center; color:#b91c1c;">
      <h2>Acceso denegado</h2>
      <p>No tienes permisos suficientes para acceder a esta sección.</p>
    </div>
  `
})
export class AccesoDenegadoComponent {}
