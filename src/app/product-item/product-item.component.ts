import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProductServiceService } from '../service/product.service';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OrderService } from '../service/order.service';

@Component({
  selector: 'app-product-item',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-item.component.html',
  styleUrl: './product-item.component.css'
})
export class ProductItemComponent implements OnInit {
  product: any = {};
  quantityControl = new FormControl(1, [Validators.required, Validators.min(1)]);
  orderForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductServiceService,
    private orrderService: OrderService,
    private fb: FormBuilder
  ) {
    this.orderForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      address: ['', Validators.required],
      note: ['']
    });
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('Id'));
    if (id) {
      this.productService.getProductById(id).subscribe(data => {
        this.product = data;
      });
    }
  }

  increaseQuantity(): void {
    this.quantityControl.setValue(this.quantityControl.value! + 1);
    this.updateTotal();
  }

  decreaseQuantity(): void {
    if (this.quantityControl.value! > 1) {
      this.quantityControl.setValue(this.quantityControl.value! - 1);
      this.updateTotal();
    }
  }

  updateTotal(): void {
    // Method để trigger change detection khi số lượng thay đổi
    // Angular sẽ tự động cập nhật UI thông qua getTotalPrice()
  }

  getTotalPrice(): number {
    return this.product.Price * this.quantityControl.value!;
  }

  submitOrder(): void {
  if (this.orderForm.valid) {
    const orderData = {
      Name: this.orderForm.get('name')?.value,
      PhoneNumber: this.orderForm.get('phone')?.value, 
      Address: this.orderForm.get('address')?.value,
      Note: this.orderForm.get('note')?.value,
      Items: [{
        ProductId: this.product.Id,
        Quantity: this.quantityControl.value!
      }]
    };

    this.orrderService.createOrder(orderData).subscribe({
      next: (response) => {
        console.log('Phản hồi từ API:', response);
        alert('Đơn hàng đã được gửi thành công!');
        this.orderForm.reset();
        this.quantityControl.setValue(1);
      },
      error: (err) => {
        console.error('Lỗi khi gửi đơn hàng:', err);
        alert('Gửi đơn hàng thất bại, kiểm tra lại kết nối!');
      }
    });
  }
}
}