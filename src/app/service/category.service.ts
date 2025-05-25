import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginService } from './login.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
    private apiUrl = 'http://localhost:63885/api/category';

  constructor(private http: HttpClient, private loginService: LoginService) { }

  private getHeaders(): HttpHeaders {
    const token = this.loginService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  getCategory(): Observable<any> {
    return this.http.get<any>(this.apiUrl, {headers: this.getHeaders(), withCredentials: true})
  }

  getCategoryById(id: number) {
    return this.http.get<any>(`${this.apiUrl}/category/${id}`);
  }

  postCategory(postData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, postData, {headers:this.getHeaders(), withCredentials: true})
  }

  putCategoryById(putData: any, Id:Number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${Id}`, putData, {headers:this.getHeaders(), withCredentials:true})
  }

  deleteCategoryById(Id:Number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${Id}`, {headers:this.getHeaders(), withCredentials:true})
  }
}