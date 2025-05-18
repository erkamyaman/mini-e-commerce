import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AuthService } from '../../core/service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, InputTextModule, ButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm!: FormGroup;
  submitted = false;

  authService = inject(AuthService);
  router = inject(Router);

  constructor(public fb: FormBuilder) {
    this.loginForm = this.fb.group({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    }, { updateOn: 'submit' })
  }

  submitLogin() {
    this.submitted = true
    this.authService.login(this.loginForm.value.username, this.loginForm.value.password).subscribe({
      next: () => {
        console.log('Login successful');
      },
      error: err => {
        console.error('Login failed:', err.message);
      }
    });
  }

  invalidFieldChecker(fieldName: string) {
    const control = this.loginForm.get(fieldName);
    return this.submitted && control?.invalid;
  }

  invalidFieldMessage(fieldName: string): string {
    return `Where is the ${fieldName}???`;
  }
}
