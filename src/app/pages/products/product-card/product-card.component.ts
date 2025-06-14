import { Component, inject, Input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { Product } from '../../../core/types/product.model';
import { ProductService } from '../product.service';
import { AuthService } from '../../../core/service/auth.service';
import { OrderPayload } from '../models/createOrder.dto';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-product-card',
  imports: [CardModule, ButtonModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {
  productService = inject(ProductService);
  authService = inject(AuthService);
  messageService = inject(MessageService);

  currentUserRole = this.authService.getCurrentUserRole()

  @Input() data: Product | null = null;
  @Input() isInDialog: boolean = false;

  openDialog() {
    this.productService.productAddModal.next(true);
    this.productService.chosenProduct.next(this.data);
  }

  addProductQuick() {
    this.productService.chosenProduct.next(this.data);
    const chosenProduct = this.productService.chosenProduct.value;
    if (!chosenProduct) {
      return;
    }
    const orderPayload: OrderPayload = new OrderPayload(chosenProduct, { address: '1', quantity: 1 }, this.authService.getCurrentUser().id);
    this.productService.addProductToSales(orderPayload).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Product added successfully' });
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add product' });
      }
    });
  }
}
