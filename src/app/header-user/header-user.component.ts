import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { CategoryService } from '../service/category.service';
import { Router, RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-header-user',
  imports: [RouterLink, NgFor],
  templateUrl: './header-user.component.html',
  styleUrl: './header-user.component.css',
})
export class HeaderUserComponent {
  @ViewChild('navbarNav', { static: false }) navbarNav!: ElementRef;

  categories: any[] = []; // List để lưu categories

  constructor(
    private renderer: Renderer2,
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCategories(); // Gọi API khi component khởi tạo
  }

  // Gọi API và lưu vào list
  loadCategories(): void {
    this.categoryService.getCategory().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (error) => {
        this.categories = []; // Reset list nếu lỗi
      },
    });
  }

  closeNavbar(): void {
    if (this.navbarNav?.nativeElement.classList.contains('show')) {
      this.renderer.removeClass(this.navbarNav.nativeElement, 'show');
    }
  }

  onLogout() {
    sessionStorage.clear();
    localStorage.removeItem('userData');
    this.router.navigate(['']);
  }
}
