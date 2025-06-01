import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { Order } from './orders.component';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  httpService = inject(HttpClient);

  orders = new BehaviorSubject<Order[] | null>(null);
  ordersObs$ = this.orders.asObservable();

  getOrders(): Observable<Order[]> {
    return this.httpService.get<Order[]>('http://localhost:3000/orders').pipe(
      tap((res) => this.orders.next(res)),
      catchError((err: any) => {
        console.error('Error loading products', err);
        return throwError(() => new Error(err));
      })
    );
  }

  addShopToOrderById(orderId: string, shopId: number): Observable<Order> {
    return this.httpService
      .patch<Order>(`http://localhost:3000/orders/${orderId}`, { shopId })
      .pipe(
        tap((updatedOrder) => {
          console.log(updatedOrder)
          const currentOrders = this.orders.value;
          if (!currentOrders) return;

          const updatedOrders = currentOrders.map(order =>
            order.orderId === updatedOrder.orderId
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


}
