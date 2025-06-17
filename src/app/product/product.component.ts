import { Component, OnInit } from '@angular/core';
import { ProductServiceService } from '../service/product.service';
import { CartService } from '../service/cart.service'; // Adjust path as needed
import { NgFor, NgIf, DecimalPipe, CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../service/login.service';

@Component({
  selector: 'app-product',
  imports: [NgIf, NgFor, RouterLink, DecimalPipe, FormsModule, CommonModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css',
})
export class ProductComponent implements OnInit {
  products: any[] = [];

  // Cart-related properties
  selectedQuantities: { [productId: number]: number } = {};
  isAddingToCart: { [productId: number]: boolean } = {};
  cartMessages: { [productId: number]: string } = {};

  constructor(
    private productService: ProductServiceService,
    private route: ActivatedRoute,
    private cartService: CartService,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const Id = Number(params.get('Id'));
      this.productService.getProductByCategory(Id).subscribe((data) => {
        this.products = data;
        this.initializeQuantities();
      });
    });
  }

  initializeQuantities(): void {
    // Initialize selected quantities to 1 for each product
    this.products.forEach((product) => {
      if (!this.selectedQuantities[product.Id]) {
        this.selectedQuantities[product.Id] = 1;
      }
    });
  }

  getSelectedQuantity(productId: number): number {
    return this.selectedQuantities[productId] || 1;
  }

  increaseQuantity(productId: number, maxQuantity: number): void {
    const current = this.getSelectedQuantity(productId);
    if (current < maxQuantity) {
      this.selectedQuantities[productId] = current + 1;
    }
  }

  decreaseQuantity(productId: number): void {
    const current = this.getSelectedQuantity(productId);
    if (current > 1) {
      this.selectedQuantities[productId] = current - 1;
    }
  }

  validateQuantity(productId: number, maxQuantity: number): void {
    let quantity = this.selectedQuantities[productId];

    // Ensure quantity is within valid range
    if (quantity < 1) {
      quantity = 1;
    } else if (quantity > maxQuantity) {
      quantity = maxQuantity;
    }

    this.selectedQuantities[productId] = quantity;
  }

  addToCart(productId: number, quantity: number): void {
    // Clear any existing message
    delete this.cartMessages[productId];

    // Set loading state
    this.isAddingToCart[productId] = true;

    const postData = {
      ProductId: productId,
      Quantity: quantity,
    };

    this.cartService.addToCart(postData).subscribe({
      next: (response) => {
        // Success
        this.isAddingToCart[productId] = false;
        this.cartMessages[
          productId
        ] = `Đã thêm ${quantity} sản phẩm vào giỏ hàng!`;

        // Clear success message after 3 seconds
        setTimeout(() => {
          delete this.cartMessages[productId];
        }, 3000);

        // Optional: Update cart count in header/navbar
        // this.cartService.updateCartCount();
      },
      error: (error) => {
        // Error handling
        this.isAddingToCart[productId] = false;
        console.error('Error adding to cart:', error);

        // Show error message
        this.cartMessages[productId] = 'Có lỗi xảy ra. Vui lòng thử lại!';

        // Clear error message after 3 seconds
        setTimeout(() => {
          delete this.cartMessages[productId];
        }, 3000);
      },
    });
  }

  // Optional: Method to add to cart and redirect to checkout
  buyNow(productId: number): void {
    const quantity = this.getSelectedQuantity(productId);
    this.addToCart(productId, quantity);

    // After adding to cart, redirect to checkout or product detail
    // You can implement this logic based on your requirements
  }

  get isUser(): boolean {
    return this.loginService.isUser();
  }
}
