import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { OrderService } from '../service/order.service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-order',
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './admin-order.component.html',
  styleUrl: './admin-order.component.css',
})
export class AdminOrderComponent implements OnInit {
  orders: any[] = [];
  waitingOrders: any[] = [];
  processingOrders: any[] = [];
  completedOrders: any[] = [];

  // Dùng status dạng lower-case cho activeTab
  activeTab: string = 'waiting';

  loading: boolean = false;
  error: string = '';
  private refreshSubscription?: Subscription;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderService.getOrder().subscribe({
      next: (data) => {
        this.orders = data;
        this.categorizeOrders();
      },
      error: (error) => {
        console.error('Lỗi khi tải đơn hàng:', error);
        alert('Có lỗi xảy ra khi tải danh sách đơn hàng!');
      },
    });
  }

  // Phân loại orders theo trạng thái
  categorizeOrders(): void {
    this.waitingOrders = this.orders.filter(
      (o) => o.OrderStatus === 'DangXuLy'
    );
    this.processingOrders = this.orders.filter(
      (o) => o.OrderStatus === 'DaXacMinh'
    );
    this.completedOrders = this.orders.filter(
      (o) => o.OrderStatus === 'DaGiao' || o.OrderStatus === 'DaHuy'
    );
  }

  getCurrentOrders(): any[] {
    switch (this.activeTab) {
      case 'waiting':
        return this.waitingOrders;
      case 'processing':
        return this.processingOrders;
      case 'complete':
        return this.completedOrders;
      default:
        return [];
    }
  }

  // Switch tab
  setActiveTab(tabId: string) {
    this.activeTab = tabId;
  }

  // Xác nhận đơn hàng
  confirmOrder(orderId: number): void {
    if (confirm('Bạn có chắc chắn muốn xác nhận đơn hàng này?')) {
      const updateData = { Status: 'DaXacMinh' };
      this.orderService.putOrderStatus(updateData, orderId).subscribe({
        next: () => {
          this.showMessage('Đơn hàng đã được xác nhận', 'success');
          this.loadOrders();
        },
        error: (error) => {
          console.error('Error confirming order:', error);
          this.error = 'Không thể xác nhận đơn hàng';
        },
      });
    }
  }

  // Hoàn thành đơn hàng
  completeOrder(orderId: number): void {
    if (confirm('Bạn có chắc chắn muốn hoàn thành đơn hàng này?')) {
      const updateData = { Status: 'DaGiao' };
      this.orderService.putOrderStatus(updateData, orderId).subscribe({
        next: () => {
          this.showMessage('Đơn hàng đã được hoàn thành', 'success');
          this.loadOrders();
        },
        error: (error) => {
          console.error('Error completing order:', error);
          this.error = 'Không thể hoàn thành đơn hàng';
        },
      });
    }
  }
  // Gửi hóa đơn qua email
  sendInvoiceEmail(orderId: number): void {
    if (confirm('bạn có muốn gửi hóa đơn đến email khách hàng ?')) {
      this.loading = true;
      this.orderService.putInvoiceEmail(orderId).subscribe({
        next: () => {
          this.showMessage('đã gửi hóa đơn qua email thành công', 'success');
          this.loadOrders();
        },
        error: (error) => {
          console.error('Error completing send:', error);
          this.error = 'Không thể gửi email';
        },
      });
    }
  }
  // Hủy đơn hàng
  cancelOrder(orderId: number): void {
    if (confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
      const updateData = { Status: 'DaHuy' };
      this.orderService.putOrderStatus(updateData, orderId).subscribe({
        next: () => {
          this.showMessage('Đơn hàng đã được hủy', 'success');
          this.loadOrders();
        },
        error: (error) => {
          this.error = 'Không thể hủy đơn hàng';
        },
      });
    }
  }

  viewInvoicePdf(orderId: number) {
    this.orderService.getInvoicePdf(orderId).subscribe(
      (blob) => {
        const url = window.URL.createObjectURL(blob);
        window.open(url);
        // Nếu muốn, có thể revoke URL sau 1 thời gian để giải phóng bộ nhớ
        setTimeout(() => window.URL.revokeObjectURL(url), 10000);
      },
      (error) => {
        console.error('Lấy hóa đơn PDF thất bại', error);
      }
    );
  }

  private showMessage(message: string, type: 'success' | 'error') {
    alert(message);

    if (type === 'success') {
      this.error = '';
    } else {
      this.error = message;
    }
  }

  // Helper method để hiển thị tên trạng thái
  getStatusText(status: string): string {
    switch (status) {
      case 'DangXuLy':
        return 'Đang xử lý';
      case 'DaXacMinh':
        return 'Chờ xác minh';
      case 'DaGiao':
        return 'Đã giao';
      case 'DaHuy':
        return 'Đã hủy';
      default:
        return status || 'Không xác định';
    }
  }

  // Tính tổng tiền đơn hàng
  getTotalOrderAmount(order: any): number {
    // Nếu có sẵn total amount
    if (order.TotalAmount) {
      return order.TotalAmount;
    }

    // Tính từ items
    const items = order.Items;
    if (items && Array.isArray(items)) {
      return items.reduce((total: number, item: any) => {
        const price = item.Price;
        const quantity = item.Quantity;
        return total + price * quantity;
      }, 0);
    }

    // Single product order
    const price = order.Price;
    const quantity = order.Quantity;
    return price * quantity;
  }
  /**
   * Sắp xếp đơn hàng theo thời gian mới nhất lên trên
   */
  getSortedOrders() {
    return this.getCurrentOrders().sort((a, b) => {
      const dateA = new Date(a.OrderDate);
      const dateB = new Date(b.OrderDate);
      return dateB.getTime() - dateA.getTime(); // Sắp xếp giảm dần (mới nhất lên trên)
    });
  }

  /**
   * Format tiền tệ theo định dạng VNĐ
   */
  formatCurrency(amount: number): string {
    if (!amount && amount !== 0) return '0 VNĐ';

    return (
      new Intl.NumberFormat('vi-VN', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount) + ' VNĐ'
    );
  }
}
