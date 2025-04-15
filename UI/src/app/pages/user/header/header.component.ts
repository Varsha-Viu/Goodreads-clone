import { Component } from '@angular/core';
import { SearchService } from '../../../shared/search.service';
import { Router, RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule, NgxPaginationModule, FormsModule, RouterModule, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  searchInput: any;
  showDropdown = false;

  constructor(private searchService: SearchService, private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.showDropdown = false;
  }
  
  searchBook() {
    if (this.searchInput?.trim()) {
      this.searchService.setSearch(this.searchInput.trim());
      this.router.navigate(['/book-listing']); // Or your actual route
    }
  }

  clearSearch() {
    this.searchInput = '';
    this.searchService.setSearch(''); // this will reset and show all books
  }

  navigateToHome() {
    this.router.navigate(['/landingPage']);
  }

  isTokenAvailable() {
    return this.authService.isAuthenticated();
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  openLoginPage() {
    this.router.navigate(['/login']);
  }
  
  openSignUpPage() {
    this.router.navigate(['/signup']);
  }

  logout() {
    // Clear session, redirect to login
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}
