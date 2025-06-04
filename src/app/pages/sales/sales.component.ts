import { Component, inject, PLATFORM_ID } from '@angular/core';
import { TableComponent } from '../../shared/components/table/table.component';
import { ButtonModule } from 'primeng/button';
import { OrdersService, SalesReport } from '../orders/orders.service';
import { Order } from '../orders/orders.component';
import { TabsModule } from 'primeng/tabs';
import { CardModule } from 'primeng/card';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { ChartModule } from 'primeng/chart';


@Component({
  selector: 'app-sales',
  imports: [TableComponent, ButtonModule, TabsModule, CardModule, ChartModule, CommonModule, AvatarModule],
  templateUrl: './sales.component.html',
  styleUrl: './sales.component.css'
})
export class SalesComponent {
  ordersService = inject(OrdersService);
  orders: any[] = []
  report: SalesReport | null = null;
  platformId = inject(PLATFORM_ID);

  data: any;
  options: any;

  ngOnInit() {
    this.ordersService.acceptedOrdersObs$.subscribe((data) => {
      this.orders = data as Order[];
    });

    this.ordersService.getSalesReport().subscribe((data) => {
      this.report = data
      this.initChart()
    })

  }

  cols = [
    { field: 'productName', header: 'Product Name' },
    { field: 'status', header: 'Product Status' },
    { field: 'shop', header: 'Shop' },
    { field: 'customerName', header: 'Customer Name' },
    { field: 'salesman.name', header: 'Forwarded By' },
    { field: 'date', header: 'Order Date' },
    { field: 'quantity', header: 'Order Amount' },
    { field: 'totalAmount', header: 'Total Amount' },
    { field: 'address', header: 'Address' },
    { field: 'storeActions', header: 'Store Actions' },
  ];

  initChart() {
    if (isPlatformBrowser(this.platformId)) {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--text-color');

      this.data = {
        labels: ['Total Orders', 'Approved Sales'],
        datasets: [
          {
            data: [this.report?.totalOrders, this.report?.approvedSales],
            backgroundColor: [documentStyle.getPropertyValue('--p-cyan-500'), documentStyle.getPropertyValue('--p-orange-500')],
            hoverBackgroundColor: [documentStyle.getPropertyValue('--p-cyan-400'), documentStyle.getPropertyValue('--p-orange-400')]
          }
        ]
      };

      this.options = {
        plugins: {
          legend: {
            labels: {
              usePointStyle: true,
              color: textColor
            }
          }
        }
      };
    }
  }
}