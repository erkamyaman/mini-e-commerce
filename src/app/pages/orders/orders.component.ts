import { Component, inject, OnInit } from '@angular/core';
import { TableComponent } from "../../shared/components/table/table.component";
import { OrdersService } from './orders.service';
import { ButtonModule } from 'primeng/button';
import { Status, StatusLabels } from '../../core/types/status.enum';

export type Order = {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  customerName: string;
  date: string;
  address: string;
  status: Status;
  shopId: number;
  totalAmount: number;
  userId: string;
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
      this.orders = data?.filter((order) => order.status !== StatusLabels.accepted && order.status !== StatusLabels.wfa) || [];
    });
  }

  cols = [
    { field: 'productName', header: 'Product Name' },
    { field: 'status', header: 'Product Status' },
    { field: 'shop', header: 'Shop' },
    { field: 'customerName', header: 'Customer Name' },
    { field: 'date', header: 'Order Date' },
    { field: 'quantity', header: 'Order Amount' },
    { field: 'totalAmount', header: 'Total Amount' },
    { field: 'address', header: 'Address' },
    { field: 'storeActions', header: 'Store Actions' },
  ];


}


