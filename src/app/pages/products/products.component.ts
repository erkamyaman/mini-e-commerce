import { Component, inject, OnInit } from '@angular/core';
import { Product } from '../../core/types/product.model';
import { ProductService } from './product.service';
import { ProductCardComponent } from './product-card/product-card.component';
import { DialogModule } from 'primeng/dialog';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-products',
  imports: [ReactiveFormsModule, ButtonModule, ProductCardComponent, DialogModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {
  productService = inject(ProductService);
  displayProductDialog = false;
  products: Product[] = [];
  productAddForm!: FormGroup;

  constructor(public fb: FormBuilder) {
    this.productAddForm = this.fb.group({
      quantity: new FormControl(<number | null>null, Validators.required)
    });
  }
  ngOnInit() {
    this.productService.productsObs$.subscribe((data) => {
      this.products = data as Product[];
    });

    this.productService.modalObs$.subscribe(() => {
      this.displayProductDialog = this.productService.productAddModal.getValue();
    });
  }

  closeDialog() {
    this.productService.productAddModal.next(false);
  }

  addProduct() {
    this.productAddForm.reset();
    this.closeDialog();
  }
}
