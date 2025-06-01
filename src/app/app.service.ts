import { Injectable, OnInit } from '@angular/core';
import { NavigationEnd } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { ProductService } from './pages/products/product.service';

@Injectable({
  providedIn: 'root'
})
export class AppService implements OnInit {

  constructor() {

  }
  ngOnInit() {
  }
}
