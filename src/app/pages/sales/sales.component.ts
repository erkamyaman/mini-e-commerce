import { Component, inject } from '@angular/core';
import { TableComponent } from '../../shared/components/table/table.component';
import { ButtonModule } from 'primeng/button';
import { OrdersService } from '../orders/orders.service';
import { Order } from '../orders/orders.component';

@Component({
  selector: 'app-sales',
  imports: [TableComponent, ButtonModule],
  templateUrl: './sales.component.html',
  styleUrl: './sales.component.css'
})
export class SalesComponent {
  ordersService = inject(OrdersService);
  orders: any[] = []

  ngOnInit() {
    this.ordersService.acceptedOrdersObs$.subscribe((data) => {
      this.orders = data as Order[];
    });
  }

  cols = [
    { field: 'productName', header: 'Product Name' },
    { field: 'status', header: 'Product Status' },
    { field: 'shop', header: 'Shop' },
    { field: 'customerName', header: 'Customer Name' },
    { field: 'salesman.name', header: 'Accepted By' },
    { field: 'date', header: 'Order Date' },
    { field: 'quantity', header: 'Order Amount' },
    { field: 'totalAmount', header: 'Total Amount' },
    { field: 'address', header: 'Address' },
    { field: 'storeActions', header: 'Store Actions' },
  ];
}
