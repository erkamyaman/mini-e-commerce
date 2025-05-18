import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { LayoutComponent } from './layout/layout.component';
import { authGuard } from './core/guard/auth.guard';
import { loggedInGuard } from './core/guard/logged-in.guard';

const loadProducts = () =>
    import('./pages/products/products.component').then(m => m.ProductsComponent);

const loadOrders = () =>
    import('./pages/orders/orders.component').then(m => m.OrdersComponent);

const loadSales = () =>
    import('./pages/sales/sales.component').then(m => m.SalesComponent);

export const routes: Routes = [
    { path: 'login', component: LoginComponent, canActivate: [loggedInGuard] },

    {
        path: '',
        canActivate: [authGuard],
        component: LayoutComponent,
        children: [
            { path: '', redirectTo: 'products', pathMatch: 'full' },
            { path: 'products', loadComponent: loadProducts, title: 'Products', data: { roles: ['customer'] } },
            { path: 'orders', loadComponent: loadOrders, title: 'Orders', data: { roles: ['salesman', 'manager'] } },
            { path: 'sales', loadComponent: loadSales, title: 'Sales', data: { roles: ['manager'] } }
        ]
    },

    { path: '**', redirectTo: 'not-found', pathMatch: 'full' },
    { path: 'not-found', component: NotFoundComponent, title: '404' }
];


