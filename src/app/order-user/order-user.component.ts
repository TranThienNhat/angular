import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../service/order.service';

interface OrderItem {
  ProductId: number;
  ProductName: string;
  Quantity: number;
  PriceAtPurchase: number;
}

interface Order {
  Id: number;
  Name: string;
  PhoneNumber: string;
  Email: string;
  Address: string;
  Note: string;
  OrderDate: string;
  TotalPrice: number;
  OrderStatus: string;
  OrderItems: OrderItem[];
}

@Component({
  selector: 'app-order-user',
  imports: [CommonModule],
  templateUrl: './order-user.component.html',
  styleUrl: './order-user.component.css',
})
export class OrderUserComponent implements OnInit {
  orders: Order[] = [];
  loading = false;
  error = '';
  activeTab = 'processing'; // 'processing', 'history'

  // Định nghĩa các trạng thái đơn hàng
  orderStatusMap = {
    DangXuLy: {
      label: 'Đang xử lý',
      class: 'warning',
      canCancel: true,
      isProcessing: true,
    },
    DaXacMinh: {
      label: 'Đã xác nhận',
      class: 'info',
      canCancel: false,
      isProcessing: true,
    },
    DangGiao: {
      label: 'Đang giao',
      class: 'primary',
      canCancel: false,
      isProcessing: false,
    },
    DaGiao: {
      label: 'Đã giao',
      class: 'success',
      canCancel: false,
      isProcessing: false,
    },
    DaHuy: {
      label: 'Đã hủy',
      class: 'danger',
      canCancel: false,
      isProcessing: false,
    },
  };

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.error = '';

    this.orderService.getMyOrders().subscribe({
      next: (data) => {
        this.orders = data;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Không thể tải danh sách đơn hàng. Vui lòng thử lại.';
        this.loading = false;
        console.error('Error loading orders:', error);
      },
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  getFilteredOrders(): Order[] {
    if (this.activeTab === 'processing') {
      // Đang xử lý: DangXuLy, DaXacNhan
      return this.orders.filter(
        (order) =>
          order.OrderStatus === 'DangXuLy' || order.OrderStatus === 'DaXacMinh'
      );
    } else if (this.activeTab === 'history') {
      // Lịch sử: DaGiao, DaHuy, DangGiao
      return this.orders.filter(
        (order) =>
          order.OrderStatus === 'DaGiao' ||
          order.OrderStatus === 'DaHuy' ||
          order.OrderStatus === 'DangGiao'
      );
    }
    return this.orders;
  }

  getProcessingCount(): number {
    return this.orders.filter(
      (order) =>
        order.OrderStatus === 'DangXuLy' || order.OrderStatus === 'DaXacNhan'
    ).length;
  }

  getHistoryCount(): number {
    return this.orders.filter(
      (order) =>
        order.OrderStatus === 'DaGiao' ||
        order.OrderStatus === 'DaHuy' ||
        order.OrderStatus === 'DangGiao'
    ).length;
  }

  cancelOrder(orderId: number): void {
    if (confirm('Bạn có chắc chắn muốn hủy đơn hàng này không?')) {
      this.orderService.orderUserCancel(orderId).subscribe({
        next: () => {
          // Cập nhật trạng thái đơn hàng trong danh sách
          const order = this.orders.find((o) => o.Id === orderId);
          if (order) {
            order.OrderStatus = 'DaHuy';
          }
          alert('Đơn hàng đã được hủy thành công!');
        },
        error: (error) => {
          alert('Không thể hủy đơn hàng. Vui lòng thử lại.');
          console.error('Error cancelling order:', error);
        },
      });
    }
  }

  getOrderStatusInfo(status: string) {
    return (
      this.orderStatusMap[status as keyof typeof this.orderStatusMap] || {
        label: status,
        class: 'secondary',
        canCancel: false,
        isProcessing: false,
      }
    );
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  formatCurrency(amount: number): string {
    return (
      new Intl.NumberFormat('vi-VN', {
        style: 'decimal',
        currency: 'VND',
      }).format(amount) + ' VNĐ'
    );
  }
}
