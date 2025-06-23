import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, forkJoin, map, Observable, switchMap, tap, throwError } from 'rxjs';
import { Order } from './orders.component';
import { User } from '../../core/types/user.model';
import { Status, StatusLabels } from '../../core/types/status.enum';
import { UserService } from '../../core/service/user.service';

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
  userService = inject(UserService)

  orders = new BehaviorSubject<Order[] | null>(null);
  ordersObs$ = this.orders.asObservable();

  getOrders(): Observable<Order[]> {
    return this.userService.getUsers().pipe(
      switchMap(() => {
        return this.httpService.get<Order[]>('http://localhost:3000/orders').pipe(
          tap((res) => {
            const ordersWithCustomerNames = res.map(order => ({
              ...order,
              customerName: this.userService.allUsers.getValue().find((user) => user.id === order.userId)?.name || ''
            }));
            console.log(ordersWithCustomerNames)
            this.orders.next(ordersWithCustomerNames);
          }),
          catchError((err: any) => {
            console.error('Error loading products', err);
            return throwError(() => new Error(err));
          })
        );
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
          updatedOrder.customerName = this.userService.allUsers.getValue().find((user) => user.id === updatedOrder.userId)?.name || ''

          const updatedOrders = currentOrders.map(order =>
            order.id === updatedOrder.id
              ? updatedOrder
              : order
          );

          console.log(updatedOrder)

          this.orders.next(updatedOrders);
        }),
        catchError((err: any) => {
          console.error('Error updating order', err);
          return throwError(() => new Error(err));
        })
      );
  }

  changeOrderStatus(id: string, status: Status, user: User): Observable<Order> {
    return this.httpService
      .patch<Order>(`http://localhost:3000/orders/${id}`, { status, salesman: user })
      .pipe(
        tap(() => {
          console.log(user)
          let allOrders = this.orders.getValue()!
          console.log(allOrders)
          allOrders = allOrders.map(o => o.id === id ? { ...o, status: status, salesman: user } : o)
          console.log(allOrders)
          this.orders.next(allOrders);
        }),
        catchError((err: any) => {
          console.error('Error updating order', err);
          return throwError(() => new Error(err));
        })
      );
  }

  deleteAllOrders(): Observable<void> {
    return this.httpService.get<Order[]>('http://localhost:3000/orders').pipe(
      switchMap((orders) => {
        const deleteRequests = orders.map(order =>
          this.httpService.delete(`http://localhost:3000/orders/${order.id}`)
        );
        return forkJoin(deleteRequests).pipe(
          map(() => void 0)
        );
      }),
      tap(() => {
        this.orders.next(null);
      }),
      catchError((err) => {
        console.error('Error deleting orders:', err);
        return throwError(() => new Error(err?.message || 'Unknown error'));
      })
    );
  }
}
