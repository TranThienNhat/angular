import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { OrderService } from '../service/order.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-admin-order-update',
  imports: [ReactiveFormsModule],
  templateUrl: './admin-order-update.component.html',
  styleUrl: './admin-order-update.component.css',
})
export class AdminOrderUpdateComponent implements OnInit {
  putorderForm: FormGroup;
  routerUrl = inject(Router);

  constructor(
    private fb: FormBuilder,
    private orderService: OrderService,
    private router: ActivatedRoute
  ) {
    this.putorderForm = this.fb.group({
      name: ['', Validators.required],
      phonenumber: ['', Validators.required],
      address: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      note: [''],
    });
  }

  ngOnInit(): void {
    const Id = Number(this.router.snapshot.paramMap.get('Id'));
    if (Id) {
      this.orderService.getOrderById(Id).subscribe({
        next: (data) => {
          this.putorderForm.patchValue({
            name: data.Name,
            phonenumber: data.PhoneNumber,
            address: data.Address,
            email: data.Email,
            note: data.Note,
          });
        },
        error: (error) => {
          console.error('Error loading customer data:', error);
          alert('Có lỗi xảy ra khi tải thông tin khách hàng!');
        },
      });
    }
  }

  onSubmit(): void {
    const Id = Number(this.router.snapshot.paramMap.get('Id'));

    if (this.putorderForm.valid && Id) {
      const putData = {
        Name: this.putorderForm.get('name')?.value,
        Phonenumber: this.putorderForm.get('phonenumber')?.value,
        Address: this.putorderForm.get('address')?.value,
        Email: this.putorderForm.get('email')?.value,
        Note: this.putorderForm.get('note')?.value,
      };

      this.orderService.putOrderInfo(putData, Id).subscribe({
        next: (response) => {
          alert(
            response.message || 'Cập nhật thông tin khách hàng thành công!'
          );
          this.routerUrl.navigate(['/admin/dashboard/orders']);
        },
        error: (error) => {
          console.error('Error updating customer:', error);
          alert('Có lỗi xảy ra khi cập nhật thông tin khách hàng!');
        },
      });
    } else {
      alert('Vui lòng điền đầy đủ thông tin!');
    }
  }
}
