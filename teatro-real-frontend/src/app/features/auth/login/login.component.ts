import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: true,
  template: `
    <div class="p-8 flex flex-col items-center justify-center h-screen">
      <h2>Login (placeholder)</h2>
      <button class="mt-8 p-2 bg-blue-600 text-white rounded-md">Login Google</button>
    </div>
  `
})
export class LoginComponent {}
