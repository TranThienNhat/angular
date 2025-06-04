import { Component, ElementRef, Renderer2, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CategoryService } from '../service/category.service';
import { NgFor } from '@angular/common';
import { Subscription } from 'rxjs';

interface Category {
  Id: number;
  Name: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, NgFor],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  @ViewChild('navbarNav', { static: false }) navbarNav!: ElementRef;
  
  categories: Category[] = [];
  private categorySubscription?: Subscription;

  constructor(
    private renderer: Renderer2,
    private categoryService: CategoryService,  
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categorySubscription = this.categoryService.getCategory().subscribe({
      next: (data: Category[]) => {
        this.categories = data || [];
        console.log('Categories loaded in header:', this.categories);
      },
    });
  }

  // Method để refresh categories từ component khác có thể gọi
  refreshCategories(): void {
    this.loadCategories();
  }

  closeNavbar(): void {
    if (this.navbarNav?.nativeElement.classList.contains('show')) {
      this.renderer.removeClass(this.navbarNav.nativeElement, 'show');
    }
  }

  // Helper method để lấy icon cho từng danh mục
  getCategoryIcon(categoryName: string): string {
    const name = categoryName.toLowerCase();
    if (name.includes('bàn') || name.includes('ban')) {
      return 'bi bi-table';
    } else if (name.includes('ghế') || name.includes('ghe')) {
      return 'fa-solid fa-couch';
    } else if (name.includes('tủ') || name.includes('tu')) {
      return 'fa-solid fa-building';
    } else if (name.includes('trang trí') || name.includes('trang tri')) {
      return 'fa-solid fa-lightbulb';
    } else {
      return 'bi bi-grid-3x3-gap'; // Icon mặc định
    }
  }
}