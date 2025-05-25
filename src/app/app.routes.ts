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
    {path: '', component: HomeComponent},
    {path: 'category/:Id', component: ProductComponent},
    {path: 'products/:Id', component: ProductItemComponent},
    {path: 'admin/login', component: LoginFormComponent},

    //admin-router
    { path: 'admin/dashboard', component: AdminProductComponent, canActivate: [authGuard] },
    {path: 'admin/dashboard/product/create', component: AdminProductAddComponent, canActivate: [authGuard]},
    {path: 'admin/dashboard/product/:Id', component: AdminProductUpdateComponent, canActivate: [authGuard]}, 
    {path: 'admin/dashboard/category', component: AdminCategoryComponent, canActivate:[authGuard] }
];