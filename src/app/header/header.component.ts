import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  @ViewChild('navbarNav', { static: false }) navbarNav!: ElementRef;

  constructor(private renderer: Renderer2) {}

  closeNavbar(): void {
    if (this.navbarNav?.nativeElement.classList.contains('show')) {
      this.renderer.removeClass(this.navbarNav.nativeElement, 'show');
    }
  }
}
