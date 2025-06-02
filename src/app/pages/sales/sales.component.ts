import { Component, inject } from '@angular/core';
import { TableComponent } from '../../shared/components/table/table.component';
import { ButtonModule } from 'primeng/button';
import { OrdersService, SalesReport } from '../orders/orders.service';
import { Order } from '../orders/orders.component';
import { TabsModule } from 'primeng/tabs';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';

@Component({
  selector: 'app-sales',
  imports: [TableComponent, ButtonModule, TabsModule, CardModule, CommonModule, AvatarModule],
  templateUrl: './sales.component.html',
  styleUrl: './sales.component.css'
})
export class SalesComponent {
  ordersService = inject(OrdersService);
  orders: any[] = []
  report: SalesReport | null = null;

  ngOnInit() {
    this.ordersService.acceptedOrdersObs$.subscribe((data) => {
      this.orders = data as Order[];
    });

    this.ordersService.getSalesReport().subscribe((data) => {
      this.report = data
      console.log(data)
    })
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
