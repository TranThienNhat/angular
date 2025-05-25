import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../service/category.service';
import { NgFor, NgIf } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin-category',
  standalone: true,
  imports: [NgFor, NgIf, ReactiveFormsModule],
  templateUrl: './admin-category.component.html',
  styleUrls: ['./admin-category.component.css']
})
export class AdminCategoryComponent implements OnInit {
  categories: any[] = [];
  editingCategoryId: number | null = null;

  categoryForm = new FormGroup({
    Name: new FormControl('', [Validators.required]),
    Description: new FormControl('')
  });

  editCategoryForm = new FormGroup({
    Id: new FormControl('', [Validators.required]),
    Name: new FormControl('', [Validators.required])
  });

  constructor(
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getCategory().subscribe(
      (data) => {
        this.categories = data;
      },
      (error) => {
        console.error('Error fetching categories', error);
      }
    );
  }

  addCategory(): void {
    if (this.categoryForm.invalid) {
      alert('Tên danh mục không được để trống!');
      return;
    }

    this.categoryService.postCategory(this.categoryForm.value).subscribe(
      () => {
        alert('Danh mục mới đã được thêm!');
        this.loadCategories(); // Cập nhật danh sách
        this.categoryForm.reset(); // Reset form
      },
      (error) => {
        console.error('Error adding category', error);
      }
    );
  }

  editCategory(category: any): void {
    this.editingCategoryId = category.Id;
    this.editCategoryForm.patchValue({
      Id: category.Id,
      Name: category.Name
    });
  }

  updateCategory(): void {
    if (this.editCategoryForm.invalid) {
      alert('Tên danh mục không được để trống!');
      return;
    }

    const updateData = {
      id: this.editCategoryForm.get('Id')?.value,
      name: this.editCategoryForm.get('Name')?.value
    };

    const categoryId = Number(this.editCategoryForm.get('Id')?.value);

    this.categoryService.putCategoryById(updateData, categoryId).subscribe({
      next: (response) => {
        alert('Danh mục đã được cập nhật thành công!');
        this.loadCategories();
        this.cancelEdit();
      },
      error: (error) => {
        console.error('Error updating category:', error);
        alert('Có lỗi xảy ra khi cập nhật danh mục!');
      }
    });
  }

  cancelEdit(): void {
    this.editingCategoryId = null;
    this.editCategoryForm.reset();
  }

  deleteCategory(id: number): void {
    if (confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
      this.categoryService.deleteCategoryById(id).subscribe(
        () => {
          alert('Danh mục đã được xóa thành công!');
          this.loadCategories(); // Tải lại danh sách sau khi xóa
          // Nếu đang sửa category này thì hủy form sửa
          if (this.editingCategoryId === id) {
            this.cancelEdit();
          }
        },
        (error) => {
          console.error('Error deleting category', error);
        }
      );
    }
  }
}