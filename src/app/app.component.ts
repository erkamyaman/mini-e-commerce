import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppService } from './app.service';
import { ProductService } from './pages/products/product.service';
import { AuthService } from './core/service/auth.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ConfirmDialogModule, ToastModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'mini-Commerce';

  constructor(public appService: AppService, public productService: ProductService, public authService: AuthService) {}

  ngOnInit() {
    this.productService.getProducts().subscribe();
    this.authService.setCurrentUser();
  }
}
