import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { AdminHeaderComponent } from './admin-header/admin-header.component';
import { LoginService } from './service/login.service';
import { NgIf } from '@angular/common';
import { FooterComponent } from './footer/footer.component';
import { HeaderUserComponent } from './header-user/header-user.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    AdminHeaderComponent,
    NgIf,
    FooterComponent,
    HeaderUserComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'angular';

  constructor(private login: LoginService, private router: Router) {}

  ngOnInit(): void {
    if (this.login.isAdmin() && this.router.url === '/admin/dashboard') {
      this.router.navigate(['/admin/dashboard']);
    }
  }

  get isAdmin(): boolean {
    return this.login.isAdmin();
  }

  get isUser(): boolean {
    return this.login.isUser();
  }
}
