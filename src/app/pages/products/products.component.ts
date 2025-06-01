import { Component, inject, OnInit } from '@angular/core';
import { Product } from '../../core/types/product.model';
import { ProductService } from './product.service';
import { ProductCardComponent } from './product-card/product-card.component';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-products',
  imports: [ProductCardComponent, DialogModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {
  productService = inject(ProductService);
  displayProductDialog: boolean = false;
  products: Product[] = [];
  ngOnInit() {
    this.productService.productsObs$.subscribe((data) => {
      this.products = data as Product[];
    });
  }

  closeDialog() {
    this.displayProductDialog = false;
  }
}
