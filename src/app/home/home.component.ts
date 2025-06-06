import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductServiceService } from '../service/product.service';
import { CategoryService } from '../service/category.service';

@Component({
  selector: 'app-home',
  imports: [RouterLink, NgFor, NgIf, NgClass],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  products: any[] = [];
  categories: any[] = [];

  // Thứ tự cố định cho categories
  private readonly FIXED_CATEGORY_ORDER = ['Bàn', 'Ghế', 'Tủ', 'Trang trí'];

  // Mapping icon cho từng category
  private readonly CATEGORY_ICONS = {
    Bàn: '🛒',
    Ghế: '🛋️',
    Tủ: '🗄️',
    'Trang trí': '🪞',
  };

  // Mapping CSS class cho từng category
  private readonly CATEGORY_CSS_CLASSES = {
    Bàn: 'table-card',
    Ghế: 'chair-card',
    Tủ: 'cabin-card',
    'Trang trí': 'decor-card',
  };

  constructor(
    private productService: ProductServiceService,
    private route: ActivatedRoute,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    // Load categories khi component khởi tạo
    this.loadCategory();

    this.route.paramMap.subscribe((params) => {
      const Id = Number(params.get('Id'));
      this.productService.getProduct(Id).subscribe((data) => {
        this.products = data;
      });
    });
  }

  /**Tính toán để số lượng bản sao để tránh khoảng trống */
  getProductCopies(): number[] {
    if (this.products.length == 0) {
      return [];
    }
    /**Tính toán số bản sao cần thiết */
    const minProductstoshow = 15;
    const copiesNeeded = Math.max(
      3,
      Math.ceil(minProductstoshow / this.products.length)
    );
    //Trả về mảng các số để cho NgFor có thể lặp
    return Array(copiesNeeded)
      .fill(0)
      .map((_, index) => index);
  }

  // Hàm sắp xếp categories theo thứ tự cố định
  private sortCategoriesByFixedOrder(categories: any[]): any[] {
    return categories.sort((a, b) => {
      const indexA = this.FIXED_CATEGORY_ORDER.indexOf(a.Name);
      const indexB = this.FIXED_CATEGORY_ORDER.indexOf(b.Name);

      const priorityA = indexA === -1 ? 999 : indexA;
      const priorityB = indexB === -1 ? 999 : indexB;

      return priorityA - priorityB;
    });
  }

  // Getter để lấy categories đã sắp xếp
  get sortedCategories() {
    return this.sortCategoriesByFixedOrder([...this.categories]);
  }

  // Hàm lấy icon cho category
  getCategoryIcon(categoryName: string): string {
    return (
      this.CATEGORY_ICONS[categoryName as keyof typeof this.CATEGORY_ICONS] ||
      '📦'
    );
  }

  // Hàm lấy CSS class cho category card
  getCategoryCssClass(categoryName: string): string {
    return (
      this.CATEGORY_CSS_CLASSES[
        categoryName as keyof typeof this.CATEGORY_CSS_CLASSES
      ] || 'default-card'
    );
  }

  loadCategory(): void {
    this.categoryService.getCategory().subscribe({
      next: (data) => {
        // Sắp xếp categories ngay khi nhận từ API
        this.categories = this.sortCategoriesByFixedOrder(data);
      },
      error: (error) => {
        alert('Không thể lấy danh mục');
      },
    });
  }
}
