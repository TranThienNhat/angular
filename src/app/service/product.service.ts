import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root',
})
export class ProductServiceService {
  private apiUrl = 'https://localhost:44384/api/products';

  constructor(private http: HttpClient, private loginService: LoginService) {}

  private getHeaders(): HttpHeaders {
    const token = this.loginService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    });
  }

  // Headers riêng cho FormData (không có Content-Type)
  private getFormDataHeaders(): HttpHeaders {
    const token = this.loginService.getToken();
    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : '',
    });
  }

  getProductByCategory(Id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?categoryId=${Id}`, {
      withCredentials: true,
    });
  }

  getProductById(Id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${Id}`, {
      withCredentials: true,
    });
  }

  //Admin
  getProducts(): Observable<any> {
    return this.http.get<any>(this.apiUrl, { withCredentials: true });
  }

  // Sửa method này để handle FormData
  postProduct(formData: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, formData, {
      headers: this.getFormDataHeaders(),
      withCredentials: true,
    });
  }

  putProductById(putData: any, Id: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${Id}`, putData, {
      headers: this.getHeaders(),
      withCredentials: true,
    });
  }

  deleteProductById(Id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${Id}`, {
      headers: this.getHeaders(),
      withCredentials: true,
    });
  }
}
