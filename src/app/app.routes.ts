import { Routes } from '@angular/router';
import { ProductsComponent } from './features/products/products.component';
import { OrdersComponent } from './features/orders/orders.component';
import { SalesComponent } from './features/sales/sales.component';
import { LoginComponent } from './features/login/login.component';
import { SignupComponent } from './features/signup/signup.component';
import { NotFoundComponent } from './features/not-found/not-found.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },

    { path: '', redirectTo: 'products', pathMatch: 'full' },
    { path: 'products', component: ProductsComponent },
    { path: 'orders', component: OrdersComponent },
    { path: 'sales', component: SalesComponent },

    { path: '**', redirectTo: 'not-found' },
    { path: 'not-found', component: NotFoundComponent }
];
