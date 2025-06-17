import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';
import path from 'node:path';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'introduce',
    loadComponent: () =>
      import('./introduce/introduce.component').then(
        (m) => m.IntroduceComponent
      ),
  },
  {
    path: 'category/:Id',
    loadComponent: () =>
      import('./product/product.component').then((m) => m.ProductComponent),
  },
  {
    path: 'user/cart',
    loadComponent: () =>
      import('./cart/cart.component').then((m) => m.CartComponent),
  },
  {
    path: 'products/:Id',
    loadComponent: () =>
      import('./product-item/product-item.component').then(
        (m) => m.ProductItemComponent
      ),
  },
  {
    path: 'user/orders',
    loadComponent: () =>
      import('./order-user/order-user.component').then(
        (m) => m.OrderUserComponent
      ),
  },
  {
    path: 'products/:Id/:CartItemId',
    loadComponent: () =>
      import('./product-item/product-item.component').then(
        (m) => m.ProductItemComponent
      ),
  },
  {
    path: 'user/login',
    loadComponent: () =>
      import('./login-form/login-form.component').then(
        (m) => m.LoginFormComponent
      ),
  },
  {
    path: 'user/register',
    loadComponent: () =>
      import('./register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'admin/dashboard',
    loadComponent: () =>
      import('./admin-product/admin-product.component').then(
        (m) => m.AdminProductComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: 'admin/dashboard/product/create',
    loadComponent: () =>
      import('./admin-product-add/admin-product-add.component').then(
        (m) => m.AdminProductAddComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: 'admin/dashboard/product/:Id',
    loadComponent: () =>
      import('./admin-product-update/admin-product-update.component').then(
        (m) => m.AdminProductUpdateComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: 'admin/dashboard/category',
    loadComponent: () =>
      import('./admin-category/admin-category.component').then(
        (m) => m.AdminCategoryComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: 'admin/dashboard/orders',
    loadComponent: () =>
      import('./admin-order/admin-order.component').then(
        (m) => m.AdminOrderComponent
      ),
    canActivate: [authGuard],
  },
  // {
  //   path: 'admin/dashboard/orders/:Id',
  //   loadComponent: () =>
  //     import('./admin-order-update/admin-order-update.component').then(
  //       (m) => m.AdminOrderUpdateComponent
  //     ),
  //   canActivate: [authGuard],
  // },

  {
    path: 'admin/dashboard/product/orders/:Id',
    loadComponent: () =>
      import('./product-item/product-item.component').then(
        (m) => m.ProductItemComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: 'admin/dashboard/report',
    loadComponent: () =>
      import('./admin-report/admin-report.component').then(
        (m) => m.AdminReportComponent
      ),
    canActivate: [authGuard],
  },
];
