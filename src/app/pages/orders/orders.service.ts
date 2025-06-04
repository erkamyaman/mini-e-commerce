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

  salesReport = new BehaviorSubject<SalesReport | null>(null);
  salesReportObs$ = this.salesReport.asObservable();

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
          this.updateOrderInStream(updatedOrder);
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
          this.handleStatusChange(updatedOrder);
          this.recalculateSalesReport();
        }),
        catchError((err: any) => {
          console.error('Error updating order', err);
          return throwError(() => new Error(err));
        })
      );
  }

  private updateOrderInStream(updatedOrder: Order): void {
    const isAcceptedOrder = updatedOrder.status === StatusLabels.wfa || updatedOrder.status === StatusLabels.accepted;

    if (isAcceptedOrder) {
      const currentAccepted = this.acceptedOrders.value || [];
      const updatedAccepted = currentAccepted.map(order =>
        order.id === updatedOrder.id ? updatedOrder : order
      );
      this.acceptedOrders.next(updatedAccepted);
    } else {
      const currentOrders = this.orders.value || [];
      const updatedOrders = currentOrders.map(order =>
        order.id === updatedOrder.id ? updatedOrder : order
      );
      this.orders.next(updatedOrders);
    }
  }

  private handleStatusChange(updatedOrder: Order): void {
    const currentOrders = this.orders.value || [];
    const currentAccepted = this.acceptedOrders.value || [];

    const isNowAccepted = updatedOrder.status === StatusLabels.wfa || updatedOrder.status === StatusLabels.accepted;
    const wasInOrders = currentOrders.find(o => o.id === updatedOrder.id);
    const wasInAccepted = currentAccepted.find(o => o.id === updatedOrder.id);

    if (isNowAccepted) {
      if (wasInOrders) {
        const newOrders = currentOrders.filter(o => o.id !== updatedOrder.id);
        const newAccepted = [...currentAccepted, updatedOrder];

        this.orders.next(newOrders);
        this.acceptedOrders.next(newAccepted);
      } else if (wasInAccepted) {
        const newAccepted = currentAccepted.map(o =>
          o.id === updatedOrder.id ? updatedOrder : o
        );
        this.acceptedOrders.next(newAccepted);
      }
    } else {
      if (wasInAccepted) {
        const newAccepted = currentAccepted.filter(o => o.id !== updatedOrder.id);
        this.acceptedOrders.next(newAccepted);

        if (updatedOrder.status !== StatusLabels.deleted) {
          const newOrders = [...currentOrders, updatedOrder];
          this.orders.next(newOrders);
        }
      } else if (wasInOrders) {
        if (updatedOrder.status === StatusLabels.deleted) {
          const newOrders = currentOrders.filter(o => o.id !== updatedOrder.id);
          this.orders.next(newOrders);
        } else {
          const newOrders = currentOrders.map(o =>
            o.id === updatedOrder.id ? updatedOrder : o
          );
          this.orders.next(newOrders);
        }
      }
    }
  }

  private recalculateSalesReport(): void {
    const allOrders = [...(this.orders.value || []), ...(this.acceptedOrders.value || [])];
    const totalSales = (this.acceptedOrders.value || []).length;
    const totalOrders = (this.orders.value || []).length;
    const deletedOrders = 0;
    const approvedSales = (this.acceptedOrders.value || []).filter(o => o.status === StatusLabels.accepted);
    const revenue = approvedSales.reduce((sum, o) => sum + o.totalAmount, 0);

    const report: SalesReport = {
      totalOrders,
      totalSales,
      deletedOrders,
      approvedSales: approvedSales.length,
      revenue
    };

    this.salesReport.next(report);
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

        this.salesReport.next(report);
        return report;
      })
    );
  }
}
