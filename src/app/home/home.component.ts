import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductServiceService } from '../service/product.service';

@Component({
  selector: 'app-home',
  imports: [RouterLink, NgFor, NgIf],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  products: any[] = [];

  constructor(
    private productService: ProductServiceService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const Id = Number(params.get('Id'));
      this.productService.getProduct(Id).subscribe((data) => {
        this.products = data;
      });
    });
  }
  /**Tính toán để số lượng bản sao để tránh khoảng trống */
getProductCopies(): number[] {
  if (this.products.length == 0){
    return [];
  }
/**Tính toán số bản sao cần thiết */
  const minProductstoshow = 15;
  const copiesNeeded = Math.max(3, Math.ceil(minProductstoshow / this.products.length));
  //Trả về mảng các số để cho NgFor có thể lặp
  return Array(copiesNeeded).fill(0).map((_, index) => index);
}

}