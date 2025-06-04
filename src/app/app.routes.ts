import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { LayoutComponent } from './layout/layout.component';
import { authGuard } from './core/guard/auth.guard';
import { loggedInGuard } from './core/guard/logged-in.guard';
import { UnauthorizedComponent } from './pages/unauthorized/unauthorized.component';
import { roleGuard } from './core/guard/role.guard';

const loadProducts = () => import('./pages/products/products.component').then((m) => m.ProductsComponent);

const loadOrders = () => import('./pages/orders/orders.component').then((m) => m.OrdersComponent);

const loadSales = () => import('./pages/sales/sales.component').then((m) => m.SalesComponent);

export const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [loggedInGuard] },

  {
    path: '',
    canActivate: [authGuard],
    canActivateChild: [roleGuard],
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'products', pathMatch: 'full' },
      { path: 'products', loadComponent: loadProducts, title: 'Products', data: { roles: ['customer', 'god'] } },
      { path: 'orders', loadComponent: loadOrders, title: 'Orders', data: { roles: ['salesman', 'manager', 'god'] } },
      { path: 'sales', loadComponent: loadSales, title: 'Sales', data: { roles: ['manager', 'god'] } }
    ]
  },

  // route state
  { path: 'unauthorized', component: UnauthorizedComponent, title: 'Unauthorized' },
  { path: '**', redirectTo: 'not-found', pathMatch: 'full' },
  { path: 'not-found', component: NotFoundComponent, title: '404' }
];
