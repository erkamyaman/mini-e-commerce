import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { LayoutComponent } from './layout/layout.component';

const loadProducts = () =>
    import('./pages/products/products.component').then(m => m.ProductsComponent);

const loadOrders = () =>
    import('./pages/orders/orders.component').then(m => m.OrdersComponent);

const loadSales = () =>
    import('./pages/sales/sales.component').then(m => m.SalesComponent);

export const routes: Routes = [
    { path: 'login', component: LoginComponent },

    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: '', redirectTo: 'products', pathMatch: 'full' },
            { path: 'products', loadComponent: loadProducts, title: 'Products' },
            { path: 'orders', loadComponent: loadOrders, title: 'Orders' },
            { path: 'sales', loadComponent: loadSales, title: 'Sales' }
        ]
    },

    { path: '**', redirectTo: 'not-found', pathMatch: 'full' },
    { path: 'not-found', component: NotFoundComponent, title: '404' }
];


