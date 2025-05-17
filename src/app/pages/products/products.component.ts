import { Component, inject, OnInit } from '@angular/core';
import { Product } from '../../core/types/product.model';
import { ProductService } from './product.service';

@Component({
  selector: 'app-products',
  imports: [],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {
  productService = inject(ProductService)

  products: Product[] = []
  ngOnInit() {
    this.productService.productsObs$.subscribe((data) => {
      console.log(data)
    })
  }

}
