import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = 'https://localhost:44384/api/orders';
  constructor(private http: HttpClient, private loginService: LoginService) {}

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

  getOrderById(Id: Number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${Id}`, {
      headers: this.getHeaders(),
      withCredentials: true,
    });
  }

  getInvoicePdf(Id: number): Observable<Blob> {
  return this.http.get(`${this.apiUrl}/${Id}/invoicepdf`, {
    headers: this.getHeaders(),
    withCredentials: true,
    responseType: 'blob'
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

  putInvoiceEmail(Id:Number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${Id}/sendinvoice`, {}, {headers: this.getHeaders(), withCredentials: true})
  }
}
