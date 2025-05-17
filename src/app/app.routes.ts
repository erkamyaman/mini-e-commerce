import { Routes } from '@angular/router';
import { ProductsComponent } from './pages/products/products.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { SalesComponent } from './pages/sales/sales.component';
import { LoginComponent } from './pages/login/login.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    // in login there should be a token in local storage 
    // auth guard for all pages 
    // is there is a token it can go to other pages
    // if not it goes back to login

    // children should be added to implement layout properly
    // lazy loading implementation
    { path: '', redirectTo: 'products', pathMatch: 'full' },
    { path: 'products', component: ProductsComponent },
    { path: 'orders', component: OrdersComponent },
    { path: 'sales', component: SalesComponent },

    { path: '**', redirectTo: 'not-found' },
    { path: 'not-found', component: NotFoundComponent }
];
