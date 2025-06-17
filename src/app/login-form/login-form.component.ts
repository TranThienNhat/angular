import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { LoginService } from '../service/login.service';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css'],
})
export class LoginFormComponent {
  errorMessage: string = '';

  constructor(private loginService: LoginService, private router: Router) {}

  loginForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });

  onSubmit() {
    this.errorMessage = '';

    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      this.loginService.login(username!, password!).subscribe(
        (response) => {
          // Lưu thông tin user
          this.loginService.saveUserData(response);

          // Sử dụng hàm isAdmin() để kiểm tra quyền và điều hướng
          if (this.loginService.isAdmin()) {
            this.router.navigateByUrl('/admin/dashboard', { replaceUrl: true });
          } else {
            this.router.navigateByUrl('', { replaceUrl: true });
          }
        },
        () => {
          this.errorMessage =
            'Sai tên đăng nhập hoặc mật khẩu! Vui lòng thử lại.';
          this.loginForm.reset();
        }
      );
    } else {
      this.errorMessage = 'Vui lòng nhập đúng thông tin!';
      this.loginForm.reset();
    }
  }
}
