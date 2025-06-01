import { Component, OnInit } from '@angular/core';
import { ProductServiceService } from '../service/product.service';
import { NgFor, NgIf, DecimalPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-product',
  imports: [NgIf, NgFor, RouterLink, DecimalPipe],
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
