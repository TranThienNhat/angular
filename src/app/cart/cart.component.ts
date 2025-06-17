import { Component, OnInit } from '@angular/core';
import { CartService } from '../service/cart.service';
import { Router, RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-cart',
  imports: [NgIf, NgFor, RouterLink],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  loading = true;
  error: string | null = null;
  totalAmount = 0;

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.loading = true;
    this.error = null;

    this.cartService.getCart().subscribe({
      next: (response) => {
        this.cartItems = response.items || [];
        // Debug: Log dữ liệu để kiểm tra cấu trúc
        console.log('Cart items loaded:', this.cartItems);
        this.calculateTotal();
        this.loading = false;
      },
      error: (error) => {
        console.error('Lỗi khi tải giỏ hàng:', error);
        this.error = 'Không thể tải giỏ hàng. Vui lòng thử lại.';
        this.loading = false;
      },
    });
  }

  calculateTotal(): void {
    this.totalAmount = this.cartItems.reduce((total, item) => {
      return total + item.Price * item.Quantity;
    }, 0);
  }

  getTotalQuantity(): number {
    return this.cartItems.reduce((total, item) => total + item.Quantity, 0);
  }

  deleteCartItem(cartItemId: number): void {
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?')) {
      this.cartService.deleteCartItem(cartItemId).subscribe({
        next: (response) => {
          console.log('Xóa thành công:', response.message);
          this.loadCart();
        },
        error: (error) => {
          console.error('Lỗi khi xóa sản phẩm:', error);
          alert('Không thể xóa sản phẩm. Vui lòng thử lại.');
        },
      });
    }
  }

  // Fixed navigation method
  goToProduct(item: any): void {
    // Debug: Log item để kiểm tra dữ liệu
    console.log('Navigating to product:', item);

    // Kiểm tra các tên field có thể có trong API response
    const productId = item.ProductId || item.Id || item.productId || item.id;
    const cartItemId = item.CartItemId || item.cartItemId;

    if (productId) {
      if (cartItemId) {
        // Navigate với cả productId và cartItemId
        console.log(`Navigating to: /products/${productId}/${cartItemId}`);
        this.router.navigate(['/products', productId, cartItemId]);
      } else {
        // Fallback nếu không có cartItemId
        console.log(`Navigating to: /products/${productId}`);
        this.router.navigate(['/products', productId]);
      }
    } else {
      console.error('Không thể điều hướng: thiếu ProductId', item);
      alert('Không thể xem chi tiết sản phẩm. Thiếu thông tin ID sản phẩm.');
    }
  }

  // Checkout method
  buyNow(): void {
    if (this.cartItems.length === 0) {
      alert('Giỏ hàng của bạn đang trống!');
      return;
    }

    console.log('Thanh toán tất cả:', this.cartItems);
    this.router.navigate(['/checkout'], {
      queryParams: {
        type: 'all',
        totalAmount: this.totalAmount,
        itemCount: this.cartItems.length,
      },
    });
  }

  trackByCartItemId(index: number, item: any): number {
    return item.CartItemId || item.cartItemId || item.Id || index;
  }

  getImageUrl(imageUrl: string): string {
    if (!imageUrl) return 'assets/images/no-image.png';
    return imageUrl.startsWith('http')
      ? imageUrl
      : `https://localhost:44384${imageUrl}`;
  }

  onImageError(event: any): void {
    event.target.src = 'assets/images/no-image.png';
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  }
}
