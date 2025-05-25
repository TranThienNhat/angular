import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductServiceService } from '../service/product.service';
import { NgFor, NgIf } from '@angular/common';
import { Observable } from 'rxjs';

interface Category {
  id: number;
  name: string;
}

@Component({
  selector: 'app-admin-product',
  standalone: true,
  imports: [NgFor, NgIf,RouterLink],
  templateUrl: './admin-product.component.html',
  styleUrls: ['./admin-product.component.css']
})
export class AdminProductComponent implements OnInit {
  products: any[] = [];

  constructor(
    private productService: ProductServiceService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const categoryId = Number(this.route.snapshot.paramMap.get('id'));  // lấy 'id' từ URL
    if (categoryId) {
      this.getProductsByCategory(categoryId);
    } else {
      this.getAllProducts(); // fallback nếu không có id
    }
  }

  getProductsByCategory(id: number): void {
    this.productService.getProductByCategory(id).subscribe({
      next: (data: any[]) => {
        this.products = data;
      },
      error: (err: any) => {
        console.error('Lỗi khi lấy sản phẩm theo danh mục:', err);
      }
    });
  }

  getAllProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data: any[]) => {
        this.products = data;
      },
      error: (err: any) => {
        console.error('Lỗi khi lấy tất cả sản phẩm:', err);
      }
    });
  }
  onDelete(Id: number): void{
    if (confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
    this.productService.deleteProductById(Id).subscribe({
      next: () => {
        this.products = this.products.filter(p => p.Id !== Id);
      },
      error: err => {
        console.error('Lỗi khi xóa sản phẩm:', err);
      }
    });
  }
  }
}
