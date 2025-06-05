import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, forkJoin, map, Observable, switchMap, tap, throwError } from 'rxjs';
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

  reportData = new BehaviorSubject<SalesReport | null>(null);
  reportDataObs = this.reportData.asObservable();

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
          this.handleStatusChanges(updatedOrder)
        }),
        catchError((err: any) => {
          console.error('Error updating order', err);
          return throwError(() => new Error(err));
        })
      );
  }

  handleStatusChanges(updatedOrder: Order) {
    const currentOrders = this.orders.value || [];
    const currentForwardedOrders = this.acceptedOrders.value || [];

    const isNowForwarded = updatedOrder.status === StatusLabels.wfa;
    const isNowRejected = updatedOrder.status === StatusLabels.rejected;
    const wasInOrders = currentOrders.some(o => o.id === updatedOrder.id);
    const wasInForwarded = currentForwardedOrders.some(o => o.id === updatedOrder.id);


    if (wasInOrders) {
      if (!isNowForwarded) {
        const updatedOrders = currentOrders.map(order =>
          order.id === updatedOrder.id
            ? { ...order, ...updatedOrder }
            : order
        );
        this.orders.next(updatedOrders);
      } else {
        const updatedOrders = currentOrders.filter(order => order.id !== updatedOrder.id);
        this.orders.next(updatedOrders);

        const updatedAcceptedOrders = [...currentForwardedOrders, updatedOrder];
        this.acceptedOrders.next(updatedAcceptedOrders);
      }
    }

    if (wasInForwarded) {
      if (isNowRejected) {
        const updatedAcceptedOrders = currentOrders.filter(order => order.id !== updatedOrder.id);
        this.acceptedOrders.next(updatedAcceptedOrders);

        const updatedOrders = [...currentOrders, updatedOrder];
        this.orders.next(updatedOrders);
      } else {
        const updatedAcceptedOrders = currentForwardedOrders.map(order =>
          order.id === updatedOrder.id
            ? { ...order, ...updatedOrder }
            : order
        );
        this.acceptedOrders.next(updatedAcceptedOrders);
      }

    }

    this.refreshSalesReport();
  }

  getSalesReport() {
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

        this.reportData.next(report)
      })
    );
  }

  refreshSalesReport() {
    const currentOrders = this.orders.value || [];
    const currentForwardedOrders = this.acceptedOrders.value || [];

    const totalSales = currentForwardedOrders.length;
    const totalOrders = currentOrders.length;
    const deletedOrders = currentOrders.filter(o => o.status === StatusLabels.deleted).length;
    const approvedSales = currentForwardedOrders.filter(o => o.status === StatusLabels.accepted);
    const revenue = approvedSales.reduce((sum, o) => sum + o.totalAmount, 0);

    const report: SalesReport = {
      totalOrders,
      totalSales,
      deletedOrders,
      approvedSales: approvedSales.length,
      revenue
    };

    this.reportData.next(report)
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
        this.acceptedOrders.next(null);
        this.refreshSalesReport();
      }),
      catchError((err) => {
        console.error('Error deleting orders:', err);
        return throwError(() => new Error(err?.message || 'Unknown error'));
      })
    );
  }
}
