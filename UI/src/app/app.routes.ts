import { BooksComponent } from './pages/admin/books/books.component';
import { Routes } from '@angular/router';
import { LoginComponent } from './pages/admin/login/login.component';
import { LayoutComponent } from './pages/admin/layout/layout.component';
import { DashboardComponent } from './pages/admin/dashboard/dashboard.component';
import { AuthorsComponent } from './pages/admin/authors/authors.component';
import { UsersComponent } from './pages/admin/users/users.component';
import { CategoriesComponent } from './pages/admin/categories/categories.component';
import { LandingPageComponent } from './pages/user/landing-page/landing-page.component';
import { UserLayoutComponent } from './pages/user/user-layout/user-layout.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'landingPage',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'admin',
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
    },
    {
        path: '',
        component: UserLayoutComponent,
        children: [
            {
                path: 'landingPage',
                component: LandingPageComponent
            }
        ]
    }
];
