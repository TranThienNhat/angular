import { Component, OnInit } from '@angular/core';
import { ProductServiceService } from '../service/product.service';
import { NgFor, NgIf, CurrencyPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

interface Category {
  id: number;
  name: string;
}

@Component({
  selector: 'app-product',
  imports: [NgIf, NgFor, RouterLink, CurrencyPipe],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css',
})
export class ProductComponent implements OnInit {
  products: any[] = [];

  constructor(
    private productService: ProductServiceService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const Id = Number(params.get('Id'));
      this.productService.getProductByCategory(Id).subscribe((data) => {
        this.products = data;
      });
    });
  }
}