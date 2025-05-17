import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { NavbarComponent } from "./layout/navbar/navbar.component";
import { AppService } from './app.service';
import { AsyncPipe, NgIf } from '@angular/common';
import { ProductService } from './pages/products/product.service';
import { LayoutComponent } from "./layout/layout.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, AsyncPipe, NgIf, LayoutComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'mini-Commerce';
  currentPage: string = '';
  currentRoute: string = '';

  constructor(private router: Router, private aRoute: ActivatedRoute, public appService: AppService, public productService: ProductService
  ) {
  }
  ngOnInit() {
    this.appService.currentRoute$.subscribe(route => {
      this.currentRoute = route;
    });

    console.log(this.aRoute.snapshot.url);
    this.productService.getProducts().subscribe()


    this.aRoute.url.subscribe((res) => {
      console.log(res)
      this.currentPage = res[0].path.slice(1)
      console.log(this.currentPage)
    })
  }
}
