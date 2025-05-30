import { Routes } from '@angular/router';
import { ProductComponent } from './product/product.component';
import { ProductItemComponent } from './product-item/product-item.component';
import { HomeComponent } from './home/home.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { authGuard } from './auth.guard';
import { AdminHeaderComponent } from './admin-header/admin-header.component';
import { AdminProductUpdateComponent } from './admin-product-update/admin-product-update.component';
import { AdminProductComponent } from './admin-product/admin-product.component';
import { AdminCategoryComponent } from './admin-category/admin-category.component';
import { AdminProductAddComponent } from './admin-product-add/admin-product-add.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    
    // Lazy loading cho các component
    {
        path: 'category/:Id',
        loadComponent: () => import('./product/product.component').then(m => m.ProductComponent)
    },
    {
        path: 'products/:Id',
        loadComponent: () => import('./product-item/product-item.component').then(m => m.ProductItemComponent)
    },
    {
        path: 'admin/login',
        loadComponent: () => import('./login-form/login-form.component').then(m => m.LoginFormComponent)
    },
    {
        path: 'admin/dashboard',
        loadComponent: () => import('./admin-product/admin-product.component').then(m => m.AdminProductComponent),
        canActivate: [authGuard]
    },
    {
        path: 'admin/dashboard/product/create',
        loadComponent: () => import('./admin-product-add/admin-product-add.component').then(m => m.AdminProductAddComponent),
        canActivate: [authGuard]
    },
    {
        path: 'admin/dashboard/product/:Id',
        loadComponent: () => import('./admin-product-update/admin-product-update.component').then(m => m.AdminProductUpdateComponent),
        canActivate: [authGuard]
    },
    {
        path: 'admin/dashboard/category',
        loadComponent: () => import('./admin-category/admin-category.component').then(m => m.AdminCategoryComponent),
        canActivate: [authGuard]
    },
    {
        path: 'admin/dashboard/orders',
        loadComponent: () => import('./admin-order/admin-order.component').then(m => m.AdminOrderComponent),
        canActivate: [authGuard]
    },
    {
        path: 'admin/dashboard/product/orders/:Id',
        loadComponent: () => import('./product-item/product-item.component').then(m => m.ProductItemComponent),
        canActivate: [authGuard]
    }
];