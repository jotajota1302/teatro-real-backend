import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="login-page">
      <div class="login-card">
        <div class="login-logo">
          <!-- Monograma TR + corona (SVG simplificado) -->
          <svg class="login-logo-svg" viewBox="0 0 44 44" fill="none">
            <circle cx="22" cy="22" r="20" fill="#FFF" stroke="#CF102D" stroke-width="2"/>
            <text x="12" y="30.5" font-family="Montserrat, Arial, sans-serif" font-size="22" fill="#010101" font-weight="700">T</text>
            <text x="22" y="30.5" font-family="Montserrat, Arial, sans-serif" font-size="22" fill="#CF102D" font-weight="700">R</text>
            <circle cx="34" cy="12" r="4" fill="#CF102D"/>
          </svg>
          <div class="login-logo-text" aria-label="Teatro Real">Teatro Real</div>
        </div>
        <div class="login-title">Acceder a tu cuenta</div>
        <div class="login-desc">
          Introduce tus credenciales de acceso para entrar en la aplicación interna del Teatro Real.
        </div>
        <form [formGroup]="form" (ngSubmit)="onSubmit()" autocomplete="off" style="width:100%;" aria-label="Formulario de login">
          <div style="margin-bottom:1.2rem; width:100%;">
            <label for="email" class="login-form-label">Correo electrónico</label>
            <input
              id="email"
              class="login-form-input"
              [class.error]="email.invalid && (email.dirty || email.touched)"
              type="email"
              formControlName="email"
              placeholder="ejemplo@teatroreal.es"
              required
              autocomplete="email"
              aria-required="true"
              [attr.aria-invalid]="email.invalid"
            />
            <div *ngIf="email.invalid && (email.dirty || email.touched)" class="login-form-error" role="alert">
              <span *ngIf="email.hasError('required')">El correo es obligatorio</span>
              <span *ngIf="email.hasError('email')">Email no válido</span>
            </div>
          </div>
          <div style="margin-bottom:1.1rem; width:100%;">
            <label for="password" class="login-form-label">Contraseña</label>
            <input
              id="password"
              class="login-form-input"
              [class.error]="password.invalid && (password.dirty || password.touched)"
              type="password"
              formControlName="password"
              placeholder="Contraseña secreta"
              required
              autocomplete="current-password"
              aria-required="true"
              [attr.aria-invalid]="password.invalid"
            />
            <div *ngIf="password.invalid && (password.dirty || password.touched)" class="login-form-error" role="alert">
              <span *ngIf="password.hasError('required')">La contraseña es obligatoria</span>
            </div>
          </div>
          <div class="login-form-actions">
            <button class="btn-primary-teatro" type="submit" [disabled]="form.invalid || loading()">
              <ng-container *ngIf="!loading(); else loadingTpl">Entrar</ng-container>
              <ng-template #loadingTpl>
                <span class="animate-spin" style="vertical-align:middle;display:inline-block;">⏳</span>
                Procesando...
              </ng-template>
            </button>
            <button class="btn-google-teatro" type="button" (click)="loginGoogle()" [disabled]="loading()">
              <!-- Icono Google SVG acceso rápido -->
              <svg style="width:20px;height:20px;margin-right:8px;" viewBox="0 0 533.5 544.3"><g><path d="M533.5 278.4c0-18.4-1.5-36.3-4.3-53.7H272v101.5H419.1c-7.7 41.3-31.6 76.3-67.1 99.6v82.7h108.2c63.6-58.6 100.3-144.9 100.3-230.1z" fill="#4285f4"/><path d="M272 544.3c90.6 0 166.7-29.9 222.2-81.3l-108.2-82.7c-29.9 20.1-68.2 31.6-114 31.6-87 0-160.9-58.7-187.5-137.5h-111.5v86.3c55 109 170.3 183.6 299 183.6z" fill="#34a853"/><path d="M84.5 314.4c-10.6-31.1-10.6-64.6 0-95.7v-86.3h-111.5C12.7 110.9 87 54.6 179.4 54.6c49.4 0 93.7 17.2 128.4 45.8l96-96C372.4 1.5 317.8-17.5 256.6-17.5 127.8-17.5 12.7 56.1-42.2 165.1z" fill="#fbbc04"/><path d="M272 107.7c49.7 0 94.6 17.1 130 50.7l97.4-97.4C430.6 27.3 354.7-2.5 272-2.5 131.2-2.5 13.7 71.8-41.2 181.7l111.5 86.3c27.2-78.8 100.1-137.5 187.7-137.5z" fill="#ea4335"/></g></svg>
              Entrar con Google
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .animate-spin {
      animation: spin 1s linear infinite;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    .error {
      border-color: var(--color-error, #CF102D) !important;
    }
  `]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  loading = signal(false);

  form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  get email() { return this.form.get('email')!; }
  get password() { return this.form.get('password')!; }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    // Lógica de login tradicional: aquí solo gestoría de señales/login, se implementaría según especificación futura
  }

  loginGoogle() {
    this.loading.set(true);
    this.auth.loginWithGoogle();
  }
}
