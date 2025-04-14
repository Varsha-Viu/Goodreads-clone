import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
  userName: string = "";
  role: string = "";
  isDropdownOpen = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.getLoggedInUser();
  }

  getLoggedInUser() {
    var data = this.authService.DecodedToken();
    this.role = data['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    this.userName = data['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
    console.log(data);
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  logout() {
    // Your logout logic here, like clearing tokens and redirecting
    console.log('Logging out...');
    // Example:
    // this.authService.logout();
    this.router.navigate(['/login']);
    sessionStorage.removeItem('token'); 
    sessionStorage.removeItem('isUser');
  }
}
