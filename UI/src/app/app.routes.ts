import { BooksComponent } from './pages/admin/books/books.component';
import { Routes } from '@angular/router';
import { LoginComponent } from './pages/admin/login/login.component';
import { LayoutComponent } from './pages/admin/layout/layout.component';
import { DashboardComponent } from './pages/admin/dashboard/dashboard.component';
import { AuthorsComponent } from './pages/admin/authors/authors.component';
import { UsersComponent } from './pages/admin/users/users.component';
import { CategoriesComponent } from './pages/admin/categories/categories.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: '',
        component: LayoutComponent,
        children: [
            {
                path: 'dashboard',
                component: DashboardComponent
            },
            {
                path: 'books',
                component: BooksComponent
            },
            {
                path: 'authors',
                component: AuthorsComponent
            },
            {
                path: 'categories',
                component: CategoriesComponent
            },
            {
                path: 'users',
                component: UsersComponent
            }
        ]
    }
];
