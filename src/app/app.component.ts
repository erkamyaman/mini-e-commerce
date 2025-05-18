import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppService } from './app.service';
import { ProductService } from './pages/products/product.service';
import { AuthService } from './core/service/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'mini-Commerce';

  constructor(public appService: AppService, public productService: ProductService, public authService: AuthService) { }

  ngOnInit() {
    this.productService.getProducts().subscribe()
    this.authService.setCurrentUser()
  }
}
