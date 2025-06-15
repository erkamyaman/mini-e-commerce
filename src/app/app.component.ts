import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppService } from './app.service';
import { ProductService } from './pages/products/product.service';
import { AuthService } from './core/service/auth.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { OrdersService } from './pages/orders/orders.service';
import { UserService } from './core/service/user.service';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ConfirmDialogModule, ToastModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'mini-Commerce';

  constructor(public appService: AppService, public productService: ProductService, public ordersService: OrdersService, public authService: AuthService, public userService: UserService) { }

  ngOnInit() {
    this.productService.getProducts().subscribe();
    this.ordersService.getOrders().subscribe();
    this.authService.setCurrentUser();
    this.userService.getUsers().subscribe();
  }
}
