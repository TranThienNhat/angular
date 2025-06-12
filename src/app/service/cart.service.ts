import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginService } from './login.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl = 'https://localhost:44384/api/cart';

  constructor(private http: HttpClient, private loginService: LoginService) {}

  private getHeaders(): HttpHeaders {
    const token = this.loginService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    });
  }

  // 1. Lấy giỏ hàng của user
  getCart(): Observable<any> {
    return this.http.get<any>(this.apiUrl, {
      headers: this.getHeaders(),
    });
  }

  // 2. Thêm sản phẩm vào giỏ hàng
  addToCart(postData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/add`, postData, {
      headers: this.getHeaders(),
    });
  }

  // 3. Xóa một sản phẩm khỏi giỏ hàng
  deleteCartItem(cartItemId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/item/${cartItemId}`, {
      headers: this.getHeaders(),
    });
  }
}
