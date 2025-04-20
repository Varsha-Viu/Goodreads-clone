import { HomeComponent } from './pages/user/home/home.component';
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
import { AuthGuard } from './shared/guards/auth.guard';
import { RoleGuard } from './shared/guards/role.guard';
import { SignupComponent } from './pages/admin/signup/signup.component';
import { BookslistingComponent } from './pages/user/bookslisting/bookslisting.component';
import { BookDetailComponent } from './pages/user/book-detail/book-detail.component';
import { WishlistComponent } from './pages/user/wishlist/wishlist.component';
import { ProfileComponent } from './pages/user/profile/profile.component';
import { AuthorsListComponent } from './pages/user/authors-list/authors-list.component';
import { AuthorsDetailsComponent } from './pages/user/authors-details/authors-details.component';

export const routes: Routes = [
    {
        path: '',
        component: UserLayoutComponent,
        children: [
            { path: '', redirectTo: 'landingPage', pathMatch: 'full' },
            { path: 'landingPage', component: LandingPageComponent },
            { path: 'book-listing', component: BookslistingComponent },
            { path: 'book-details/:bookId', component: BookDetailComponent },
            { path: 'bookshelf', component: WishlistComponent },
            { path: 'home', component: HomeComponent },
            { path: 'profile', component: ProfileComponent },
            { path: 'author-list', component: AuthorsListComponent },
            { path: 'author-details/:authorId', component: AuthorsDetailsComponent },
        ]
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'signup',
        component: SignupComponent
    },
    {
        path: 'admin',
        component: LayoutComponent,
        children: [
            {
                path: 'dashboard',
                component: DashboardComponent,
                canActivate: [AuthGuard, RoleGuard],
                data: { role: 'Admin' }
            },
            {
                path: 'books',
                component: BooksComponent,
                canActivate: [AuthGuard, RoleGuard],
                data: { role: 'Admin' }
            },
            {
                path: 'authors',
                component: AuthorsComponent,
                canActivate: [AuthGuard, RoleGuard],
                data: { role: 'Admin' }
            },
            {
                path: 'categories',
                component: CategoriesComponent,
                canActivate: [AuthGuard, RoleGuard],
                data: { role: 'Admin' }
            },
            {
                path: 'users',
                component: UsersComponent,
                canActivate: [AuthGuard, RoleGuard],
                data: { role: 'Admin' }
            }
        ]
    },
    { path: '**', redirectTo: 'landingPage', pathMatch: 'full' }
];

