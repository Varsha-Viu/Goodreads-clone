import { Injectable } from '@angular/core';
import { CanActivate, CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService, // Inject your authentication service
    private router: Router
  ) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) { // Use your authentication check
      return true;
    } else {
      this.router.navigate(['/login']); // Redirect to login
      return false;
    }
  }
}
