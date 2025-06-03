import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ProductServiceService } from '../service/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, inject, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-admin-product-update',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './admin-product-update.component.html',
  styleUrls: ['./admin-product-update.component.css'],
})
export class AdminProductUpdateComponent implements OnInit {
  putproductForm: FormGroup;
  routerUrl = inject(Router);

  constructor(
    private router: ActivatedRoute,
    private productService: ProductServiceService,
    private fb: FormBuilder
  ) {
    this.putproductForm = this.fb.group({
      name: ['', Validators.required], // Đặt tên nhất quán
      description: ['', Validators.required],
      quantity: [0, [Validators.required, Validators.min(0)]],
      price: [0, [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit(): void {
    const Id = Number(this.router.snapshot.paramMap.get('Id')); // Ép kiểu an toàn
    if (Id) {
      this.productService.getProductById(Id).subscribe((data) => {
        this.putproductForm.patchValue({
          name: data.Name,
          description: data.Description,
          quantity: data.Quantity,
          price: data.Price,
        });
      });
    }
  }

  onSubmit(): void {
    const Id = Number(this.router.snapshot.paramMap.get('Id'));

    if (this.putproductForm.valid) {
      const putData = {
        name: this.putproductForm.get('name')?.value,
        description: this.putproductForm.get('description')?.value,
        quantity: this.putproductForm.get('quantity')?.value,
        price: this.putproductForm.get('price')?.value,
      };

      this.productService.putProductById(putData, Id).subscribe({
        next: (response) => {
          alert(response.message);
          this.routerUrl.navigate(['/admin/dashboard/']);
        },
        error: (error) => {
          console.error('Error updating:', error);
          alert('Có lỗi xảy ra khi cập nhật thông tin!');
        },
      });
    }
  }
}
