import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, tap, throwError } from 'rxjs';
import { Order } from './orders.component';
import { User } from '../../core/types/user.model';
import { StatusLabels } from '../../core/types/status.enum';

export interface SalesReport {
  totalOrders: number;
  totalSales: number;
  deletedOrders: number;
  approvedSales: number;
  revenue: number;
}


@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  httpService = inject(HttpClient);

  orders = new BehaviorSubject<Order[] | null>(null);
  ordersObs$ = this.orders.asObservable();

  acceptedOrders = new BehaviorSubject<Order[] | null>(null);
  acceptedOrdersObs$ = this.acceptedOrders.asObservable();

  getOrders(): Observable<Order[]> {
    return this.httpService.get<Order[]>('http://localhost:3000/orders').pipe(
      tap((res) => {
        const filteredOrders = res.filter(order => order.status !== StatusLabels.accepted && order.status !== StatusLabels.wfa);
        this.orders.next(filteredOrders);
      }),
      catchError((err: any) => {
        console.error('Error loading products', err);
        return throwError(() => new Error(err));
      })
    );
  }

  getAcceptedOrders(): Observable<Order[]> {
    return this.httpService.get<Order[]>('http://localhost:3000/orders').pipe(
      tap((res) => {
        const acceptedOrders = res.filter(order =>
          order.status === StatusLabels.wfa || order.status === StatusLabels.accepted
        );
        this.acceptedOrders.next(acceptedOrders);
      }),
      catchError((err: any) => {
        console.error('Error loading accepted orders', err);
        return throwError(() => new Error(err));
      })
    );
  }

  addShopToOrderById(id: string, shopId: number): Observable<Order> {
    return this.httpService
      .patch<Order>(`http://localhost:3000/orders/${id}`, { shopId })
      .pipe(
        tap((updatedOrder) => {
          const currentOrders = this.orders.value;
          if (!currentOrders) return;

          const updatedOrders = currentOrders.map(order =>
            order.id === updatedOrder.id
              ? updatedOrder
              : order
          );

          this.orders.next(updatedOrders);
        }),
        catchError((err: any) => {
          console.error('Error updating order', err);
          return throwError(() => new Error(err));
        })
      );
  }

  changeOrderStatus(id: string, status: string, user: User): Observable<Order> {
    return this.httpService
      .patch<Order>(`http://localhost:3000/orders/${id}`, { status, salesman: user })
      .pipe(
        tap((updatedOrder) => {
          const currentOrders = this.orders.value;
          if (!currentOrders) return;

          const updatedOrders = currentOrders.map(order =>
            order.id === updatedOrder.id
              ? updatedOrder
              : order
          );

          this.orders.next(updatedOrders);
        }),
        catchError((err: any) => {
          console.error('Error updating order', err);
          return throwError(() => new Error(err));
        })
      );
  }

  getSalesReport(): Observable<SalesReport> {
    return this.httpService.get<Order[]>('http://localhost:3000/orders').pipe(
      map((orders: Order[]) => {
        const totalSales = orders.filter(o => o.status === StatusLabels.wfa || o.status === StatusLabels.accepted).length;
        const totalOrders = orders.length - totalSales;
        const deletedOrders = orders.filter(o => o.status === StatusLabels.deleted).length;
        const approvedSales = orders.filter(o => o.status === StatusLabels.accepted);
        const revenue = approvedSales.reduce((sum, o) => sum + o.totalAmount, 0);

        const report: SalesReport = {
          totalOrders,
          totalSales,
          deletedOrders,
          approvedSales: approvedSales.length,
          revenue
        };

        return report;
      })
    );
  }
}
