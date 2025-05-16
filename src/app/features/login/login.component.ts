import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, InputTextModule, ButtonModule, NgIf],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm!: FormGroup;
  submitted = false;

  constructor(public fb: FormBuilder) {
    this.loginForm = this.fb.group({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    }, { updateOn: 'submit' })
  }

  submitLogin() {
    this.submitted = true
    console.log('login')
  }

  invalidFieldChecker(fieldName: string) {
    const control = this.loginForm.get(fieldName);
    return this.submitted && control?.invalid;
  }

  invalidFieldMessage(fieldName: string): string {
    return `Where is the ${fieldName}???`;
  }
}
