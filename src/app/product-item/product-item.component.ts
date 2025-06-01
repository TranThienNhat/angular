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
  quantityControl = new FormControl(1, [
    Validators.required,
    Validators.min(1),
  ]);
  orderForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductServiceService,
    private orderService: OrderService, // Fixed typo: orrderService -> orderService
    private loginService: LoginService,
    private fb: FormBuilder,
  ) {
    this.orderForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      note: [''],
    });
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('Id'));
    if (id) {
      this.productService.getProductById(id).subscribe((data) => {
        this.product = data;
        // Cập nhật validators cho quantity control dựa trên stock
        this.updateQuantityValidators();
      });
    }
  }

  // Cập nhật validators cho quantity control
  private updateQuantityValidators(): void {
    if (this.product.IsOutOfStock) {
      // Nếu hết hàng, disable quantity control
      this.quantityControl.disable();
      this.quantityControl.setValue(0);
    } else {
      // Cập nhật max validator dựa trên Quantity (không phải StockQuantity)
      this.quantityControl.setValidators([
        Validators.required,
        Validators.min(1),
        Validators.max(this.product.Quantity) // Changed from StockQuantity to Quantity
      ]);
      this.quantityControl.updateValueAndValidity();
      
      // Nếu giá trị hiện tại vượt quá stock, reset về 1
      const currentValue = this.quantityControl.value || 1;
      if (currentValue > this.product.Quantity) {
        this.quantityControl.setValue(this.product.Quantity);
      }
      
      // Subscribe to value changes để validate real-time
      this.quantityControl.valueChanges.subscribe(value => {
        if (value && (value < 1 || value > this.product.Quantity)) {
          // Nếu giá trị không hợp lệ, không cập nhật
          setTimeout(() => {
            const clampedValue = Math.max(1, Math.min(value, this.product.Quantity));
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
    if (currentValue < this.product.Quantity) { // Changed from StockQuantity to Quantity
      this.quantityControl.setValue(currentValue + 1);
    }
  }

  decreaseQuantity(): void {
    const currentValue = this.quantityControl.value || 0;
    if (currentValue > 1) {
      this.quantityControl.setValue(currentValue - 1);
    }
  }

  updateTotal(): void {
    // Method để trigger change detection khi số lượng thay đổi
    // Angular sẽ tự động cập nhật UI thông qua getTotalPrice()
  }

  // Xử lý khi người dùng nhập trực tiếp vào input
  onQuantityInputChange(event: any): void {
    const inputValue = parseInt(event.target.value, 10);
    
    if (isNaN(inputValue) || inputValue < 1) {
      // Nếu không phải số hoặc nhỏ hơn 1, set về 1
      this.quantityControl.setValue(1);
    } else if (inputValue > this.product.Quantity) { // Changed from StockQuantity to Quantity
      // Nếu vượt quá stock, set về max stock
      this.quantityControl.setValue(this.product.Quantity);
      // Hiển thị thông báo
      alert(`Số lượng tối đa có thể đặt là ${this.product.Quantity}`);
    } else {
      // Giá trị hợp lệ
      this.quantityControl.setValue(inputValue);
    }
  }

  // Validation khi người dùng rời khỏi input (blur)
  validateQuantityInput(): void {
    const currentValue = this.quantityControl.value || 1;
    
    if (currentValue < 1) {
      this.quantityControl.setValue(1);
    } else if (currentValue > this.product.Quantity) { // Changed from StockQuantity to Quantity
      this.quantityControl.setValue(this.product.Quantity);
      alert(`Số lượng tối đa có thể đặt là ${this.product.Quantity}`);
    }
  }

  // Ngăn chặn nhập ký tự không hợp lệ
  onQuantityKeyDown(event: KeyboardEvent): void {
    // Cho phép: backspace, delete, tab, escape, enter
    if ([8, 9, 27, 13, 46].indexOf(event.keyCode) !== -1 ||
      // Cho phép Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
      (event.keyCode === 65 && event.ctrlKey === true) ||
      (event.keyCode === 67 && event.ctrlKey === true) ||
      (event.keyCode === 86 && event.ctrlKey === true) ||
      (event.keyCode === 88 && event.ctrlKey === true) ||
      // Cho phép home, end, left, right
      (event.keyCode >= 35 && event.keyCode <= 39)) {
      return;
    }
    
    // Chỉ cho phép số (0-9)
    if ((event.shiftKey || (event.keyCode < 48 || event.keyCode > 57)) && 
        (event.keyCode < 96 || event.keyCode > 105)) {
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

  // Kiểm tra xem có thể đặt hàng không
  canPlaceOrder(): boolean {
    const quantity = this.quantityControl.value || 0;
    return !this.product.IsOutOfStock && 
           this.orderForm.valid && 
           this.quantityControl.valid &&
           quantity <= this.product.Quantity && // Changed from StockQuantity to Quantity
           quantity > 0;
  }

  submitOrder(): void {
    if (this.canPlaceOrder()) {
      const orderData = {
        Name: this.orderForm.get('name')?.value,
        PhoneNumber: this.orderForm.get('phone')?.value,
        Email: this.orderForm.get('email')?.value,
        Address: this.orderForm.get('address')?.value,
        Note: this.orderForm.get('note')?.value,
        Items: [
          {
            ProductId: this.product.Id,
            Quantity: this.quantityControl.value || 1,
          },
        ],
      };

      this.orderService.createOrder(orderData).subscribe({ // Fixed typo: orrderService -> orderService
        next: (response) => {
          alert('Đơn hàng đã được gửi thành công!');
          this.orderForm.reset();
          this.quantityControl.setValue(1);
          if (this.isAdmin) {
            this.router.navigate(['/admin/dashboard']);
          } else {
            // Có thể redirect về trang chủ hoặc trang đơn hàng
            this.router.navigate(['/']);
          }
        },
        error: (err) => {
          console.error('Order creation failed:', err);
          if (err.status === 400 && err.error?.message?.includes('stock')) {
            alert('Số lượng yêu cầu vượt quá số lượng có sẵn!');
            // Refresh product data để cập nhật stock
            this.ngOnInit();
          } else {
            alert('Gửi đơn hàng thất bại, vui lòng thử lại!');
          }
        },
      });
    } else {
      alert('Vui lòng kiểm tra lại thông tin đặt hàng!');
    }
  }
}