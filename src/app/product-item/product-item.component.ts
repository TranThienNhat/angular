import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductServiceService } from '../service/product.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { OrderService } from '../service/order.service';
import { LoginService } from '../service/login.service';

@Component({
  selector: 'app-product-item',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-item.component.html',
  styleUrl: './product-item.component.css',
})
export class ProductItemComponent implements OnInit {
  product: any = {};
  cartItemId: number | null = null;
  userProfile: any = null;
  isEditingProfile = false;

  quantityControl = new FormControl(1, [
    Validators.required,
    Validators.min(1),
  ]);

  orderForm: FormGroup;
  profileForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductServiceService,
    private orderService: OrderService,
    private loginService: LoginService,
    private fb: FormBuilder
  ) {
    this.orderForm = this.fb.group({
      note: [''],
    });

    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      phoneNumber: [
        '',
        [Validators.required, Validators.pattern(/^[0-9]{10,11}$/)],
      ],
      address: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  ngOnInit(): void {
    const productId = Number(this.route.snapshot.paramMap.get('Id'));
    const cartItemIdParam = this.route.snapshot.paramMap.get('CartItemId');

    if (cartItemIdParam && cartItemIdParam.trim() !== '') {
      const parsedCartItemId = Number(cartItemIdParam);
      this.cartItemId = isNaN(parsedCartItemId) ? null : parsedCartItemId;
    } else {
      this.cartItemId = null;
    }

    if (productId) {
      this.productService.getProductById(productId).subscribe((data) => {
        this.product = data;
        this.updateQuantityValidators();
      });
    }

    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.loginService.getProfile().subscribe({
      next: (profile) => {
        this.userProfile = profile;
        this.profileForm.patchValue({
          name: profile.Name || profile.name,
          phoneNumber: profile.PhoneNumber || profile.phoneNumber,
          address: profile.Address || profile.address,
        });
      },
      error: (err) => {
        console.error('Failed to load user profile:', err);
      },
    });
  }

  toggleEditProfile(): void {
    this.isEditingProfile = !this.isEditingProfile;
    if (this.isEditingProfile) {
      this.profileForm.reset({
        name: this.userProfile.Name || this.userProfile.name,
        phoneNumber:
          this.userProfile.PhoneNumber || this.userProfile.phoneNumber,
        address: this.userProfile.Address || this.userProfile.address,
      });
    }
  }

  cancelEditProfile(): void {
    this.isEditingProfile = false;
    this.profileForm.patchValue({
      name: this.userProfile.Name || this.userProfile.name,
      phoneNumber: this.userProfile.PhoneNumber || this.userProfile.phoneNumber,
      address: this.userProfile.Address || this.userProfile.address,
    });
  }

  saveProfile(): void {
    if (this.profileForm.valid) {
      const profileData = {
        Name: this.profileForm.get('name')?.value,
        PhoneNumber: this.profileForm.get('phoneNumber')?.value,
        Address: this.profileForm.get('address')?.value,
      };

      this.loginService.putProfile(profileData).subscribe({
        next: (response) => {
          alert('Cập nhật thông tin thành công!');
          this.isEditingProfile = false;
          this.loadUserProfile();
        },
        error: (err) => {
          console.error('Failed to update profile:', err);
          alert('Cập nhật thông tin thất bại, vui lòng thử lại!');
        },
      });
    } else {
      alert('Vui lòng kiểm tra lại thông tin đã nhập!');
      this.markFormGroupTouched(this.profileForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  private updateQuantityValidators(): void {
    if (this.product.IsOutOfStock) {
      this.quantityControl.disable();
      this.quantityControl.setValue(0);
    } else {
      this.quantityControl.setValidators([
        Validators.required,
        Validators.min(1),
        Validators.max(this.product.Quantity),
      ]);
      this.quantityControl.updateValueAndValidity();

      const currentValue = this.quantityControl.value || 1;
      if (currentValue > this.product.Quantity) {
        this.quantityControl.setValue(this.product.Quantity);
      }

      this.quantityControl.valueChanges.subscribe((value) => {
        if (value && (value < 1 || value > this.product.Quantity)) {
          setTimeout(() => {
            const clampedValue = Math.max(
              1,
              Math.min(value, this.product.Quantity)
            );
            if (value !== clampedValue) {
              this.quantityControl.setValue(clampedValue, { emitEvent: false });
              if (value > this.product.Quantity) {
                alert(`Số lượng tối đa có thể đặt là ${this.product.Quantity}`);
              }
            }
          }, 0);
        }
      });
    }
  }

  get isAdmin(): boolean {
    return this.loginService.isAdmin();
  }

  increaseQuantity(): void {
    const currentValue = this.quantityControl.value || 0;
    if (currentValue < this.product.Quantity) {
      this.quantityControl.setValue(currentValue + 1);
    }
  }

  decreaseQuantity(): void {
    const currentValue = this.quantityControl.value || 0;
    if (currentValue > 1) {
      this.quantityControl.setValue(currentValue - 1);
    }
  }

  onQuantityInputChange(event: any): void {
    const inputValue = parseInt(event.target.value, 10);

    if (isNaN(inputValue)) {
      this.quantityControl.setValue(1);
    } else if (inputValue < 1) {
      this.quantityControl.setValue(1);
    } else if (inputValue > this.product.Quantity) {
      this.quantityControl.setValue(this.product.Quantity);
      alert(`Số lượng tối đa có thể đặt là ${this.product.Quantity}`);
    } else {
      this.quantityControl.setValue(inputValue);
    }
  }

  validateQuantityInput(): void {
    const currentValue = this.quantityControl.value || 1;

    if (currentValue < 1) {
      this.quantityControl.setValue(1);
    } else if (currentValue > this.product.Quantity) {
      this.quantityControl.setValue(this.product.Quantity);
      alert(`Số lượng tối đa có thể đặt là ${this.product.Quantity}`);
    }
  }

  onQuantityKeyDown(event: KeyboardEvent): void {
    if (
      [8, 9, 27, 13, 46].indexOf(event.keyCode) !== -1 ||
      (event.keyCode === 65 && event.ctrlKey === true) ||
      (event.keyCode === 67 && event.ctrlKey === true) ||
      (event.keyCode === 86 && event.ctrlKey === true) ||
      (event.keyCode === 88 && event.ctrlKey === true) ||
      (event.keyCode >= 35 && event.keyCode <= 39)
    ) {
      return;
    }

    if (
      (event.shiftKey || event.keyCode < 48 || event.keyCode > 57) &&
      (event.keyCode < 96 || event.keyCode > 105)
    ) {
      event.preventDefault();
    }
  }

  getTotalPrice(): number {
    if (this.product.IsOutOfStock) {
      return 0;
    }
    const quantity = this.quantityControl.value || 0;
    return this.product.Price * quantity;
  }

  canPlaceOrder(): boolean {
    const quantity = this.quantityControl.value || 0;
    return (
      !this.product.IsOutOfStock &&
      this.quantityControl.valid &&
      quantity <= this.product.Quantity &&
      quantity > 0 &&
      this.userProfile
    );
  }

  submitOrder(): void {
    if (this.canPlaceOrder()) {
      if (this.cartItemId) {
        this.createOrderFromCart();
      } else {
        this.createNormalOrder();
      }
    } else {
      if (!this.userProfile) {
        alert('Vui lòng đăng nhập để đặt hàng!');
      } else {
        alert('Vui lòng kiểm tra lại thông tin đặt hàng!');
      }
    }
  }

  private createNormalOrder(): void {
    const orderData = {
      ProductId: this.product.Id,
      Quantity: this.quantityControl.value || 1,
      Note: this.orderForm.get('note')?.value || '',
    };

    this.orderService.createOrder(orderData).subscribe({
      next: (response) => {
        this.handleOrderSuccess('Đơn hàng đã được gửi thành công!');
      },
      error: (err) => {
        this.handleOrderError(err);
      },
    });
  }

  private createOrderFromCart(): void {
    const orderData = {
      CartItemId: this.cartItemId,
      Note: this.orderForm.get('note')?.value || '',
    };

    this.orderService.createOrderFromCart(orderData).subscribe({
      next: (response) => {
        this.handleOrderSuccess('Đơn hàng từ giỏ hàng đã được gửi thành công!');
      },
      error: (err) => {
        this.handleOrderError(err);
      },
    });
  }

  private handleOrderSuccess(message: string): void {
    alert(message);
    this.orderForm.reset();
    this.quantityControl.setValue(1);
    if (this.isAdmin) {
      this.router.navigate(['/admin/dashboard']);
    } else {
      this.router.navigate(['/']);
    }
  }

  private handleOrderError(err: any): void {
    console.error('Order creation failed:', err);
    if (err.status === 400 && err.error?.message?.includes('stock')) {
      alert('Số lượng yêu cầu vượt quá số lượng có sẵn!');
      this.ngOnInit();
    } else {
      alert('Gửi đơn hàng thất bại, vui lòng thử lại!');
    }
  }
}
