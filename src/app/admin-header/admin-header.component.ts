import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
@Component({
  selector: 'app-admin-header',
  imports: [RouterLink],
  templateUrl: './admin-header.component.html',
  styleUrl: './admin-header.component.css',
})
export class AdminHeaderComponent {
  @ViewChild('navbarCollapse', { static: false }) navbarCollapse!: ElementRef;

  constructor(private router: Router, private renderer: Renderer2) {}

  closeNavbar(): void {
    if (this.navbarCollapse.nativeElement.classList.contains('show')) {
      this.renderer.removeClass(this.navbarCollapse.nativeElement, 'show');
    }
  }

  onLogout() {
    sessionStorage.clear();
    localStorage.removeItem('userData');
    this.router.navigate(['']);
  }
}
