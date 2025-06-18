import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LoginService } from '../service/login.service';

interface RegisterData {
  username: string;
  password: string;
  email: string;
  name: string;
  phoneNumber: string;
  address: string;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';
  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router
  ) {
    this.registerForm = this.fb.group(
      {
        username: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
        name: ['', [Validators.required, Validators.minLength(2)]],
        phoneNumber: [
          '',
          [Validators.required, Validators.pattern('^[0-9]{10,11}$')],
        ],
        address: ['', [Validators.required, Validators.minLength(10)]],
      },
      {
        validators: this.passwordMatchValidator,
      }
    );
  }

  ngOnInit(): void {}

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (
      password &&
      confirmPassword &&
      password.value !== confirmPassword.value
    ) {
      confirmPassword.setErrors({ passwordMismatch: true });
    } else {
      confirmPassword?.setErrors(null);
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  isFieldValid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return field ? field.valid && (field.dirty || field.touched) : false;
  }

  getErrorMessage(fieldName: string): string {
    const field = this.registerForm.get(fieldName);
    if (!field) return '';

    if (field.errors) {
      if (field.errors['required']) {
        return 'Trường này là bắt buộc';
      }
      if (field.errors['email']) {
        return 'Email không hợp lệ';
      }
      if (field.errors['minlength']) {
        return `Tối thiểu ${field.errors['minlength'].requiredLength} ký tự`;
      }
      if (field.errors['pattern']) {
        return 'Định dạng không hợp lệ';
      }
      if (field.errors['passwordMismatch']) {
        return 'Mật khẩu không khớp';
      }
    }
    return '';
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isSubmitting = true;
      this.errorMessage = '';
      this.successMessage = '';

      const formData: RegisterData = {
        username: this.registerForm.value.username,
        password: this.registerForm.value.password,
        email: this.registerForm.value.email,
        name: this.registerForm.value.name,
        phoneNumber: this.registerForm.value.phoneNumber,
        address: this.registerForm.value.address
      };

      this.loginService.register(formData).subscribe({
        next: (response) => {
          this.successMessage = 'Đăng ký thành công! Đang chuyển hướng...';
          setTimeout(() => {
            this.router.navigate(['/user/login']);
          }, 2000);
        },
        error: (error) => {
          this.errorMessage =
            error.error?.message || 'Đăng ký thất bại. Vui lòng thử lại.';
          this.isSubmitting = false;
        },
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}
