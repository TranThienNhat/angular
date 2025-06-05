import { Component, ElementRef, Renderer2, ViewChild, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CategoryService } from '../service/category.service';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, NgFor],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  @ViewChild('navbarNav', { static: false }) navbarNav!: ElementRef;
  
  categories: any[] = []; // List để lưu categories

  constructor(
    private renderer: Renderer2,
    private categoryService: CategoryService,  
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
      }
    });
  }

  closeNavbar(): void {
    if (this.navbarNav?.nativeElement.classList.contains('show')) {
      this.renderer.removeClass(this.navbarNav.nativeElement, 'show');
    }
  }
}