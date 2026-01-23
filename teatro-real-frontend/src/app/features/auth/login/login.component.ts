import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/auth/auth.service';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatButtonModule, MatSnackBarModule
  ],
  template: `
    <div class="login-bg">
      <div class="login-card">
        <div class="login-logo-legacy">
          <svg width="70" height="70" viewBox="0 0 44 44" fill="none" aria-label="Teatro Real logo" class="login-logo-svg">
            <circle cx="22" cy="22" r="20" fill="#FFF" stroke="#CF102D" stroke-width="2.5"/>
            <text x="22" y="28" text-anchor="middle" font-family="Montserrat, Arial, sans-serif" font-size="18" fill="#010101" font-weight="700">T</text>
            <text x="22" y="28" text-anchor="middle" font-family="Montserrat, Arial, sans-serif" font-size="18" fill="#CF102D" font-weight="700" dx="8">R</text>
            <circle cx="35" cy="12" r="4" fill="#CF102D"/>
          </svg>
          <div class="login-logo-text-legacy">TEATRO REAL</div>
        </div>
        <div class="login-title-legacy">Acceder a tu cuenta</div>
        <div class="login-desc-legacy">
          Introduce tus credenciales de acceso para entrar en la aplicación interna del Teatro Real.
        </div>
        <form [formGroup]="form" (ngSubmit)="onSubmit()" autocomplete="off" class="login-form-legacy">
          <label class="form-label-legacy" for="email">Correo electrónico</label>
          <mat-form-field appearance="outline" class="login-form-field-legacy">
            <input matInput id="email" type="email" formControlName="email" placeholder="ejemplo@teatroreal.es" autocomplete="email" required aria-required="true" />
            <mat-error *ngIf="email.hasError('required')">El correo es obligatorio</mat-error>
            <mat-error *ngIf="email.hasError('email')">El formato de correo no es válido</mat-error>
          </mat-form-field>
          <label class="form-label-legacy" for="password">Contraseña</label>
          <mat-form-field appearance="outline" class="login-form-field-legacy">
            <input matInput id="password" type="password" formControlName="password" placeholder="Contraseña secreta" autocomplete="current-password" required aria-required="true" />
            <mat-error *ngIf="password.hasError('required')">La contraseña es obligatoria</mat-error>
          </mat-form-field>
          <button mat-raised-button color="primary" class="btn-primary-legacy" type="submit" [disabled]="form.invalid || loading()">
            ENTRAR
          </button>
          <button mat-stroked-button class="btn-google-legacy" type="button" (click)="loginGoogle()" [disabled]="loading()">
            ENTRAR CON GOOGLE
          </button>
        </form>
        <!-- Boton DEV para desarrollo rapido -->
        <div class="dev-section">
          <button mat-flat-button class="btn-dev" type="button" (click)="devLogin()">
            ENTRAR COMO ADMIN (DEV)
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-bg {
      min-height: 100vh;
      background: #000;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .login-card {
      background: #fff;
      border-radius: 16px;
      box-shadow: 0 4px 32px rgba(35,35,35,0.07);
      padding: 28px 20px 18px 20px;
      min-width: 340px;
      min-height: 390px;
      max-width: 430px;
      width: 98vw;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      margin-top: 20px;
      margin-bottom: 20px;
    }
    .login-logo-legacy {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 2px;
    }
    .login-logo-svg {
      width: 64px;
      height: 64px;
      margin-bottom: 2px;
      display: block;
    }
    .login-logo-text-legacy {
      font-family: 'Montserrat', sans-serif;
      font-weight: 700;
      font-size: 1.35rem;
      letter-spacing: 0.07em;
      color: #010101;
      margin-top: 2px;
      text-align: center;
    }
    .login-title-legacy {
      font-size: 1.34rem;
      font-weight: 700;
      letter-spacing: 0.01em;
      color: #010101;
      margin-bottom: 2px;
      text-align: center;
      font-family: 'Montserrat', sans-serif;
    }
    .login-desc-legacy {
      font-size: 1rem;
      color: #666;
      margin-bottom: 15px;
      text-align: center;
      font-weight: 500;
      width: 100%;
      font-family: 'Montserrat', sans-serif;
    }
    .login-form-legacy {
      display: flex;
      flex-direction: column;
      width: 100%;
      gap: 8px;
    }
    .form-label-legacy {
      font-size: 1rem;
      font-family: 'Montserrat', sans-serif;
      font-weight: 600;
      color: #232323;
      margin-bottom: 2px;
      margin-left: 2px;
      letter-spacing: 0.01em;
    }
    .login-form-field-legacy {
      width: 100%;
      background: #fff;
      border-radius: 4px;
    }
    :host ::ng-deep .login-form-field-legacy .mat-mdc-form-field-infix {
      padding: 12px 0 !important;
      min-height: 20px;
    }
    :host ::ng-deep .login-form-field-legacy .mat-mdc-text-field-wrapper {
      padding: 0 12px;
    }
    :host ::ng-deep .login-form-field-legacy input.mat-mdc-input-element {
      font-size: 0.95rem !important;
      font-family: 'Montserrat', sans-serif !important;
      color: #232323;
      font-weight: 500;
      height: auto;
      line-height: 1.4;
    }
    :host ::ng-deep .login-form-field-legacy input::placeholder {
      color: #999;
      font-size: 0.95rem;
    }
    :host ::ng-deep .login-form-field-legacy .mdc-notched-outline__notch {
      border-right: none;
    }
    .btn-primary-legacy {
      background-color: #CF102D !important;
      color: #fff !important;
      border: none;
      border-radius: 4px !important;
      font-family: 'Montserrat', sans-serif;
      font-weight: 700;
      font-size: 1rem;
      padding: 12px 0;
      margin-top: 4px;
      margin-bottom: 4px;
      letter-spacing: 0.07em;
      box-shadow: 0 1px 6px 0 rgba(207,16,45,0.07);
      text-transform: uppercase;
      width: 100%;
      transition: background 0.23s, color 0.18s, box-shadow 0.18s;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .btn-primary-legacy:hover, .btn-primary-legacy:focus {
      background-color: #A00D24 !important;
      color: #fff !important;
      box-shadow: 0 2px 10px 0 rgba(207,16,45,0.13);
    }
    .btn-google-legacy {
      border-color: #CF102D !important;
      color: #CF102D !important;
      font-weight: 700;
      font-family: 'Montserrat', sans-serif;
      font-size: 1rem;
      padding: 10px 0;
      border-radius: 4px !important;
      box-shadow: none;
      letter-spacing: 0.07em;
      text-transform: uppercase;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      width: 100%;
      margin-top: 0px;
      margin-bottom: 2px;
      transition: background 0.22s, color 0.18s, border-color 0.18s;
    }
    .btn-google-legacy:focus, .btn-google-legacy:hover {
      background: #CF102D !important;
      color: #fff !important;
      border-color: #A00D24 !important;
    }
    .dev-section {
      width: 100%;
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px dashed #ccc;
    }
    .btn-dev {
      width: 100%;
      background: #f5f5f5 !important;
      color: #666 !important;
      font-family: 'Montserrat', sans-serif;
      font-weight: 600;
      font-size: 0.85rem;
      padding: 10px 0;
      border-radius: 4px !important;
      letter-spacing: 0.03em;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .btn-dev:hover {
      background: #e0e0e0 !important;
      color: #333 !important;
    }
    /* Error y validaciones */
    .mat-mdc-form-field-error, .mat-mdc-form-field-error[role="alert"] {
      color: #C62828 !important;
      font-size: .91rem;
      font-weight: 500;
    }
    .animate-spin {
      animation: spin 1s linear infinite;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    @media (max-width: 580px) {
      .login-card {
        min-width: 0;
        max-width: 99vw;
        width: 99vw;
        padding: 10px 2vw 2vw 2vw;
      }
      .login-bg {
        padding: 0;
      }
      .login-logo-text-legacy { font-size: 1.07rem; }
      .login-title-legacy { font-size: 1.1rem; }
    }
  `]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
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
    this.loading.set(true);
    this.auth.login(this.email.value, this.password.value).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/']);
      },
      error: () => {
        this.loading.set(false);
        this.snackBar.open('Error al iniciar sesión. Verifique usuario y contraseña.', 'Cerrar', {
          duration: 3500,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['bg-red-500', 'text-white', 'font-bold']
        });
      }
    });
  }

  loginGoogle() {
    this.loading.set(true);
    this.auth.loginWithGoogle();
  }

  devLogin() {
    this.auth.devLogin();
  }
}
