import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private apiUrl = 'https://localhost:44384/api';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    });
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { username, password });
  }

  register(registerData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, registerData);
  }

  saveUserData(data: { Username: string; Role: string; Token: string }) {
    sessionStorage.setItem(
      'user',
      JSON.stringify({
        username: data.Username,
        role: data.Role,
        token: data.Token,
      })
    );
  }

  getToken(): string | null {
    const user = sessionStorage.getItem('user');
    return user ? JSON.parse(user).token : null;
  }

  getProfile(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/user/info`, {
      headers: this.getHeaders(),
      withCredentials: true,
    });
  }

  putProfile(profileData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/user/info`, profileData, {
      headers: this.getHeaders(),
      withCredentials: true,
    });
  }

  isAdmin(): boolean {
    if (
      typeof window === 'undefined' ||
      typeof sessionStorage === 'undefined'
    ) {
      return false;
    }

    const user = sessionStorage.getItem('user');
    if (!user) {
      return false;
    }

    try {
      const parsedUser = JSON.parse(user);
      return parsedUser.role === 'ADMIN';
    } catch (error) {
      console.error('Lỗi phân tích JSON:', error);
      return false;
    }
  }

  isUser(): boolean {
    if (
      typeof window === 'undefined' ||
      typeof sessionStorage === 'undefined'
    ) {
      return false;
    }

    const user = sessionStorage.getItem('user');
    if (!user) {
      return false;
    }

    try {
      const parsedUser = JSON.parse(user);
      return parsedUser.role === 'USER';
    } catch (error) {
      console.error('Lỗi phân tích JSON:', error);
      return false;
    }
  }
}
