import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
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
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registerForm!: FormGroup; // Definite assignment assertion
  isLoading = false;
  showPassword = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router
  ) {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.registerForm = this.fb.group({
      username: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
          Validators.pattern(/^[a-zA-Z0-9_]+$/),
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(100),
        ],
      ],
      email: [
        '',
        [Validators.required, Validators.email, Validators.maxLength(100)],
      ],
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(100),
          Validators.pattern(/^[a-zA-ZÀ-ỹ\s]+$/),
        ],
      ],
      phoneNumber: [
        '',
        [Validators.required, Validators.pattern(/^(0[3|5|7|8|9])[0-9]{8}$/)],
      ],
      address: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(500),
        ],
      ],
    });
  }

  onSubmit(): void {
    this.clearMessages();

    if (this.registerForm.valid) {
      this.processRegistration();
    } else {
      this.markFormGroupTouched();
      this.errorMessage = 'Vui lòng kiểm tra lại thông tin đã nhập!';
    }
  }

  private processRegistration(): void {
    this.isLoading = true;
    const registerData: RegisterData = this.registerForm.value;

    // Trim whitespace từ các field
    Object.keys(registerData).forEach((key) => {
      if (typeof registerData[key as keyof RegisterData] === 'string') {
        (registerData as any)[key] = registerData[key as keyof RegisterData]
          .toString()
          .trim();
      }
    });

    this.loginService.register(registerData).subscribe({
      next: (response) => {
        this.handleRegistrationSuccess(response);
      },
      error: (error) => {
        this.handleRegistrationError(error);
      },
    });
  }

  private handleRegistrationSuccess(response: any): void {
    this.isLoading = false;
    this.successMessage = response.message || 'Đăng ký thành công!';
    this.registerForm.reset();

    // Chuyển hướng đến trang đăng nhập sau 2 giây
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 2000);
  }

  private handleRegistrationError(error: any): void {
    this.isLoading = false;

    if (error.status === 400) {
      this.errorMessage =
        error.error?.message ||
        error.error ||
        'Thông tin đăng ký không hợp lệ!';
    } else if (error.status === 409) {
      this.errorMessage = 'Username hoặc email đã được sử dụng!';
    } else if (error.status === 500) {
      this.errorMessage = 'Lỗi server! Vui lòng thử lại sau.';
    } else if (error.status === 0) {
      this.errorMessage =
        'Không thể kết nối đến server! Vui lòng kiểm tra kết nối mạng.';
    } else {
      this.errorMessage = 'Có lỗi xảy ra khi đăng ký! Vui lòng thử lại.';
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }

  private markFormGroupTouched(): void {
    Object.keys(this.registerForm.controls).forEach((key) => {
      const control = this.registerForm.get(key);
      control?.markAsTouched();
    });
  }

  // Utility methods cho validation messages
  getFieldError(fieldName: string): string {
    const field = this.registerForm.get(fieldName);
    if (field?.errors && field.touched) {
      const errors = field.errors;

      if (errors['required'])
        return `${this.getFieldDisplayName(fieldName)} là bắt buộc`;
      if (errors['minlength'])
        return `${this.getFieldDisplayName(fieldName)} phải có ít nhất ${
          errors['minlength'].requiredLength
        } ký tự`;
      if (errors['maxlength'])
        return `${this.getFieldDisplayName(fieldName)} không được quá ${
          errors['maxlength'].requiredLength
        } ký tự`;
      if (errors['email']) return 'Email không hợp lệ';
      if (errors['pattern']) {
        switch (fieldName) {
          case 'username':
            return 'Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới';
          case 'name':
            return 'Họ và tên chỉ được chứa chữ cái và khoảng trắng';
          case 'phoneNumber':
            return 'Số điện thoại không hợp lệ (VD: 0901234567)';
          default:
            return 'Định dạng không hợp lệ';
        }
      }
    }
    return '';
  }

  private getFieldDisplayName(fieldName: string): string {
    const displayNames: { [key: string]: string } = {
      username: 'Tên đăng nhập',
      password: 'Mật khẩu',
      email: 'Email',
      name: 'Họ và tên',
      phoneNumber: 'Số điện thoại',
      address: 'Địa chỉ',
    };
    return displayNames[fieldName] || fieldName;
  }

  // Reset form
  resetForm(): void {
    this.registerForm.reset();
    this.clearMessages();
  }

  // Check if field is invalid and touched
  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!(field?.invalid && field?.touched);
  }

  // Check if field is valid and touched
  isFieldValid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!(field?.valid && field?.touched);
  }

  // Getter methods cho template
  get username() {
    return this.registerForm.get('username');
  }
  get password() {
    return this.registerForm.get('password');
  }
  get email() {
    return this.registerForm.get('email');
  }
  get name() {
    return this.registerForm.get('name');
  }
  get phoneNumber() {
    return this.registerForm.get('phoneNumber');
  }
  get address() {
    return this.registerForm.get('address');
  }
}
