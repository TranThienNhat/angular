import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductServiceService } from '../service/product.service';
import { FormBuilder, FormControl, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService } from '../service/category.service';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-admin-product-add',
  imports: [ReactiveFormsModule, NgFor],
  templateUrl: './admin-product-add.component.html',
  styleUrl: './admin-product-add.component.css'
})
export class AdminProductAddComponent implements OnInit {
  
  postForm: FormGroup;
  routerUrl = inject(Router);
  categories: any[] = [];
  selectedFile: File | null = null; // Thêm biến để lưu file được chọn

  constructor(
    private productService: ProductServiceService,
    private fb: FormBuilder,
    private categoryService: CategoryService,
  ) {
    this.postForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      quantity: [0, [Validators.required, Validators.min(0)]],
      price: [0, [Validators.required, Validators.min(0)]],
      categoryIds: this.fb.array([]), // FormArray cho checkbox
      image: ['']
    });
  }

  ngOnInit(): void {
    // Gọi API lấy danh mục từ backend  
    this.categoryService.getCategory().subscribe({
      next: (data: any[]) => {
        // Lưu danh sách danh mục nhận được
        this.categories = data;
        // Khởi tạo các checkbox cho từng danh mục
        this.addCheckboxes();
      },
      error: (error) => {
        console.error('Lỗi khi lấy danh mục:', error);
      }
    });
  }

  // Getter để truy cập FormArray
  get categoryFormArray(): FormArray {
    return this.postForm.get('categoryIds') as FormArray;
  }

  // Thêm FormControl cho mỗi category
  private addCheckboxes(): void {
    this.categories.forEach(() => {
      this.categoryFormArray.push(new FormControl(false));
    });
  }

  // Xử lý khi user chọn file
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  onSubmit(): void {
    if (this.postForm.valid) {
      // Lấy danh sách ID của các category được chọn
      const selectedCategoryIds = this.postForm.value.categoryIds
        .map((checked: boolean, index: number) => checked ? this.categories[index].Id : null)
        .filter((value: any) => value !== null);

      // Validate required fields
      const name = this.postForm.get('name')?.value?.trim();
      const description = this.postForm.get('description')?.value?.trim();
      const quantity = parseInt(this.postForm.get('quantity')?.value, 10);
      const price = parseFloat(this.postForm.get('price')?.value);

      if (!name || !description || isNaN(quantity) || isNaN(price)) {
        alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
        return;
      }

      if (selectedCategoryIds.length === 0) {
        alert('Vui lòng chọn ít nhất một danh mục!');
        return;
      }

      // Tạo FormData để gửi multipart/form-data
      const formData = new FormData();
      formData.append('Name', name);
      formData.append('Description', description);
      formData.append('Quantity', quantity.toString()); // Sử dụng parseInt để chuyển đổi về int
      formData.append('Price', price.toString()); // Sử dụng parseFloat để chuyển đổi về long
      formData.append('CategoryIds', selectedCategoryIds.join(','));
      
      // Thêm file nếu có
      if (this.selectedFile) {
        formData.append('Image', this.selectedFile, this.selectedFile.name);
      }
      
      this.productService.postProduct(formData).subscribe({
        next: (response) => {
          alert(response.message);
          this.routerUrl.navigate(['/admin/dashboard']);
        },
        error: (error) => {
          console.error('Error creating product:', error);
          alert('Có lỗi xảy ra khi tạo sản phẩm!');
        }
      });
    } else {
      alert('Vui lòng điền đầy đủ thông tin!');
    }
}
}