import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
@Component({
  selector: 'app-admin-header',
  imports: [RouterLink],
  templateUrl: './admin-header.component.html',
  styleUrl: './admin-header.component.css',
})
export class AdminHeaderComponent {
  constructor(private router: Router) {}

  onLogout() {
    sessionStorage.clear();
    localStorage.removeItem('userData');
    this.router.navigate(['']);
  }
}
