import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LoginService } from '../service/login.service';
import { trigger, transition, style, animate } from '@angular/animations';

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
  animations: [
    trigger('fadeInDown', [
      transition(':enter', [
        style({ transform: 'translateY(-20px)', opacity: 0 }),
        animate('0.4s ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ])
    ])
  ]
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';
  showPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      email: ['', [Validators.required, Validators.email]],
      name: ['', [Validators.required, Validators.minLength(2)]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10,11}$/)]],
      address: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  // Form getters
  get username() { return this.registerForm.get('username'); }
  get password() { return this.registerForm.get('password'); }
  get email() { return this.registerForm.get('email'); }
  get name() { return this.registerForm.get('name'); }
  get phoneNumber() { return this.registerForm.get('phoneNumber'); }
  get address() { return this.registerForm.get('address'); }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  resetForm(): void {
    this.registerForm.reset();
    this.errorMessage = '';
    this.successMessage = '';
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.errorMessage = 'Vui lòng kiểm tra lại thông tin đăng ký!';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const registerData: RegisterData = {
      username: this.username?.value,
      password: this.password?.value,
      email: this.email?.value,
      name: this.name?.value,
      phoneNumber: this.phoneNumber?.value,
      address: this.address?.value,
    };

    this.loginService.register(registerData).subscribe({
      next: (response) => {
        this.successMessage = 'Đăng ký thành công! Đang chuyển đến trang đăng nhập...';
        setTimeout(() => {
          this.router.navigate(['/user/login']);
        }, 2000);
      },
      error: (error) => {
        console.error('Registration error:', error);
        if (error.status === 400) {
          this.errorMessage = 'Tên đăng nhập hoặc email đã tồn tại!';
        } else {
          this.errorMessage = 'Đăng ký thất bại. Vui lòng thử lại sau!';
        }
        this.isLoading = false;
      }
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
}
