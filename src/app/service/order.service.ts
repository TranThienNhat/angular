import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = 'http://localhost:63885/api/orders';
  constructor(
    private http: HttpClient,
    private loginService: LoginService,
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.loginService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    });
  }

  getOrder(): Observable<any> {
    return this.http.get<any>(this.apiUrl, {
      headers: this.getHeaders(),
      withCredentials: true,
    });
  }

  createOrder(orderData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create`, orderData);
  }

  putOrderStatus(putData: any, Id: Number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${Id}`, putData, {
      headers: this.getHeaders(),
      withCredentials: true,
    });
  }

  putOrderInfo(putData: any, Id: Number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${Id}/info`, putData, {
      headers: this.getHeaders(),
      withCredentials: true,
    });
  }
}
