// admin-report.component.ts
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OrderService } from '../service/order.service';

@Component({
  selector: 'app-admin-report',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-report.component.html',
  styleUrl: './admin-report.component.css',
})
export class AdminReportComponent implements OnInit {
  invoiceForm: FormGroup;
  isLoading = false;
  actionType: 'view' | 'email' | null = null;
  responseMessage = '';
  responseType: 'success' | 'error' = 'success';

  constructor(private fb: FormBuilder, private orderService: OrderService) {
    this.invoiceForm = this.fb.group({
      phoneNumber: [
        '',
        [Validators.required, Validators.pattern(/^[0-9]{10,11}$/)],
      ],
      orderDate: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    // Set default date to current date (date only, no time)
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;

    this.invoiceForm.patchValue({
      orderDate: dateString,
    });
  }

  onView(): void {
    if (this.invoiceForm.valid) {
      this.actionType = 'view';
      this.viewInvoice();
    }
  }

  onEmail(): void {
    if (this.invoiceForm.valid) {
      this.actionType = 'email';
      this.submitForm(true);
    }
  }

  // Method to handle PDF viewing
  private viewInvoice(): void {
    this.isLoading = true;
    this.responseMessage = '';

    const formData = this.invoiceForm.value;
    const postData = {
      PhoneNumber: formData.phoneNumber,
      OrderDate: formData.orderDate, // Already in YYYY-MM-DD format
      SendConfirmation: false,
    };

    this.orderService.postInvicePdf(postData).subscribe({
      next: (blob) => {
        this.isLoading = false;
        this.actionType = null;

        // Handle blob response to open PDF
        if (blob instanceof Blob) {
          const url = window.URL.createObjectURL(blob);
          window.open(url);
          // Clean up memory after 10 seconds
          setTimeout(() => window.URL.revokeObjectURL(url), 10000);

          this.responseMessage = 'Hóa đơn đã được mở thành công!';
          this.responseType = 'success';
        } else {
          this.responseMessage = 'Dữ liệu không hợp lệ!';
          this.responseType = 'error';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.actionType = null;

        // Handle different error scenarios
        if (error.status === 200 && error.error?.text) {
          // Sometimes the response is successful but parsed as error
          this.responseMessage = error.error.text;
          this.responseType = 'success';
        } else if (error.error?.Message) {
          this.responseMessage = error.error.Message;
          this.responseType = 'error';
        } else {
          this.responseMessage =
            'Có lỗi xảy ra khi xem hóa đơn. Vui lòng thử lại!';
          this.responseType = 'error';
        }
        console.error('Error viewing invoice:', error);
      },
    });
  }

  // Method for sending email
  private submitForm(sendConfirmation: boolean): void {
    this.isLoading = true;
    this.responseMessage = '';

    const formData = this.invoiceForm.value;
    const postData = {
      PhoneNumber: formData.phoneNumber,
      OrderDate: formData.orderDate, // Already in YYYY-MM-DD format
      SendConfirmation: sendConfirmation,
    };

    this.orderService.postInvice(postData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.actionType = null;

        if (response?.Message) {
          this.responseMessage = response.Message;
        } else {
          this.responseMessage = sendConfirmation
            ? 'Email đã được gửi thành công!'
            : 'Dữ liệu đã được xử lý thành công!';
        }
        this.responseType = 'success';
        console.log('Response:', response);
      },
      error: (error) => {
        this.isLoading = false;
        this.actionType = null;

        if (error.error?.Message) {
          this.responseMessage = error.error.Message;
        } else {
          this.responseMessage = 'Có lỗi xảy ra. Vui lòng thử lại!';
        }
        this.responseType = 'error';
        console.error('Error:', error);
      },
    });
  }

  // Getter methods for easier template access
  get phoneNumber() {
    return this.invoiceForm.get('phoneNumber');
  }

  get orderDate() {
    return this.invoiceForm.get('orderDate');
  }

  get isFormValid(): boolean {
    return this.invoiceForm.valid;
  }

  get isFormInvalid(): boolean {
    return this.invoiceForm.invalid;
  }
}
