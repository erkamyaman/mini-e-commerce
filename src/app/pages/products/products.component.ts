import { Component, inject, OnInit } from '@angular/core';
import { Product } from '../../core/types/product.model';
import { ProductService } from './product.service';
import { ProductCardComponent } from './product-card/product-card.component';

@Component({
  selector: 'app-products',
  imports: [ProductCardComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {
  productService = inject(ProductService)

  products: Product[] = []
  ngOnInit() {
    this.productService.productsObs$.subscribe((data) => {
      this.products = data as Product[]
    })
  }

}
