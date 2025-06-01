import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, tap, throwError } from 'rxjs';
import { Product } from '../../core/types/product.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  httpService = inject(HttpClient);

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
}
