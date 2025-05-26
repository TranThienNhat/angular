import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { LoginService } from '../service/login.service';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent {
  errorMessage: string = '';

  constructor(
    private loginService: LoginService, 
    private router: Router
  ) {}

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  onSubmit() {
    this.errorMessage = '';

    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      this.loginService.login(username!, password!).subscribe(
        (response) => {
          this.loginService.saveUserData(response);
          this.router.navigateByUrl('/admin/dashboard', { replaceUrl: true });
        },
        () => {
          this.errorMessage = 'Sai tên đăng nhập hoặc mật khẩu! Vui lòng thử lại.';
          this.loginForm.reset();
        }
      );
    } else {
      this.errorMessage = 'Vui lòng nhập đúng thông tin!';
      this.loginForm.reset();
    }
  }
}