import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private apiUrl = 'https://localhost:44384/api/admin/login';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { username, password });
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
}
