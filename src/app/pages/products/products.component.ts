import { Component, inject, OnInit } from '@angular/core';
import { Product } from '../../core/types/product.model';
import { ProductService } from './product.service';
import { ProductCardComponent } from './product-card/product-card.component';
import { DialogModule } from 'primeng/dialog';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { OrderPayload } from './models/createOrder.dto';
import { AuthService } from '../../core/service/auth.service';

@Component({
  selector: 'app-products',
  imports: [ReactiveFormsModule, ButtonModule, InputTextModule, ProductCardComponent, DialogModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {
  productService = inject(ProductService);
  messageService = inject(MessageService);
  authService = inject(AuthService)

  displayProductDialog = false;
  products: Product[] = [];
  productAddForm!: FormGroup;
  chosenProduct!: Product;
  currentUserRole: string | null = null;

  constructor(public fb: FormBuilder) {
    this.productAddForm = this.fb.group({
      quantity: new FormControl(<number | null>null, [Validators.required, Validators.min(1)]),
      address: new FormControl(<string | null>null, [Validators.required])
    });
  }
  ngOnInit() {
    this.currentUserRole = this.authService.getCurrentUser()?.role ?? null;
    this.productService.productsObs$.subscribe((data) => {
      this.products = data as Product[];
    });

    this.productService.modalObs$.subscribe(() => {
      this.displayProductDialog = this.productService.productAddModal.getValue();
    });

    this.productService.chosenProObs$.subscribe(() => {
      this.chosenProduct = this.productService.chosenProduct.getValue()!;
    });
  }

  closeDialog() {
    this.productAddForm.reset();
    this.productService.productAddModal.next(false);
  }

  addProduct() {
    const orderPayload: OrderPayload = new OrderPayload(this.chosenProduct, this.productAddForm.getRawValue(), this.authService.getCurrentUser().id)
    this.productService.addProductToSales(orderPayload).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Product added successfully' });
        this.closeDialog();
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add product' });
      }
    });
  }

  addProductQuick() {
    this.productAddForm.get('address')?.setValue('1')
    this.productAddForm.get('quantity')?.setValue(1)
    const orderPayload: OrderPayload = new OrderPayload(this.chosenProduct, this.productAddForm.getRawValue(), this.authService.getCurrentUser().id)
    this.productService.addProductToSales(orderPayload).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Product added successfully' });
        this.closeDialog();
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add product' });
      }
    });
  }

  totalAmount() {
    const chosenProduct = this.productService.chosenProduct.getValue();
    if (chosenProduct) {
      return chosenProduct.price * this.productAddForm.getRawValue().quantity;
    }
    return 0;
  }

  maxStockAmount() {
    const chosenProduct = this.productService.chosenProduct.getValue();
    if (chosenProduct) {
      return chosenProduct.stock;
    }
    return 0;
  }


}
