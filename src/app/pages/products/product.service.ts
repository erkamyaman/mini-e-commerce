import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, tap, throwError } from 'rxjs';
import { Product } from '../../core/types/product.model';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/service/auth.service';
import { OrderPayload } from './models/createOrder.dto';
import { OrdersService } from '../orders/orders.service';
import { Order } from '../orders/orders.component';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  httpService = inject(HttpClient);
  authService = inject(AuthService);
  orderService = inject(OrdersService)

  products = new BehaviorSubject<Product[] | null>(null);
  productsObs$ = this.products.asObservable();

  productAddModal = new BehaviorSubject<boolean>(false);
  modalObs$ = this.productAddModal.asObservable();

  chosenProduct = new BehaviorSubject<Product | null>(null);
  chosenProObs$ = this.chosenProduct.asObservable();

  getProducts(): Observable<Product[]> {
    return this.httpService.get<Product[]>('http://localhost:3000/lotrProducts').pipe(
      tap((res) => this.products.next(res)),
      catchError((err) => {
        console.error('Error loading products', err);
        return throwError(() => new Error(err));
      })
    );
  }

  addProductToSales(dto: OrderPayload): Observable<Order> {
    return this.httpService.post<Order>('http://localhost:3000/orders', dto).pipe(
      tap((res: Order) => {
        const currentOrders = this.orderService.orders.value ?? [];
        this.orderService.orders.next([...currentOrders, res]);
        this.orderService.refreshSalesReport();
      }),
      catchError((err) => {
        console.error('Error adding order', err);
        return throwError(() => new Error(err));
      })
    );
  }
}
