import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, tap, throwError } from 'rxjs';
import { Product } from '../../core/types/product.model';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  httpService = inject(HttpClient);
  authService = inject(AuthService);

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

  addProductToSales(product: Product, quantity: number): Observable<any> {
    const currentUser = this.authService.getCurrentUser();
    const randomId = 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();

    const orderPayload = {
      orderId: randomId,
      productId: product.id,
      productName: product.name,
      quantity: quantity,
      addedBy: currentUser,
      date: new Date().toISOString()
    };

    return this.httpService.post('http://localhost:3000/orders', orderPayload).pipe(
      tap((res) => {
        console.log('Order saved to db.json:', res);
      }),
      catchError((err) => {
        console.error('Error adding order', err);
        return throwError(() => new Error(err));
      })
    );
  }
}
