import { Component, inject, OnInit } from '@angular/core';
import { TableComponent } from "../../shared/components/table/table.component";
import { OrdersService } from './orders.service';
import { ButtonModule } from 'primeng/button';

export type Order = {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  quantity: number;
  addedBy: {
    id: number;
    username: string;
    password: string;
    role: string;
    name: string;
    surname: string;
  };
  date: string;
  address: string;
  status: 'waiting' | 'accepted' | 'rejected';
  shop: string
};

@Component({
  selector: 'app-orders',
  imports: [TableComponent, ButtonModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent implements OnInit {
  ordersService = inject(OrdersService);
  orders: any[] = []

  ngOnInit() {
    this.ordersService.ordersObs$.subscribe((data) => {
      this.orders = data as Order[];
    });
  }

  cols = [
    { field: 'productName', header: 'Product Name' },
    { field: 'status', header: 'Product Status' },
    { field: 'shop', header: 'Shop' },
    { field: 'addedBy.name', header: 'Customer Name' },
    { field: 'date', header: 'Order Date' },
    { field: 'quantity', header: 'Order Amount' },
    { field: 'totalAmount', header: 'Total Amount' },
    { field: 'address', header: 'Address' },
    { field: 'storeActions', header: 'Store Actions' },
  ];


}


