import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';
import { SearchService } from '../../../shared/search.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-layout',
  imports: [RouterOutlet, FooterComponent, FormsModule, CommonModule],
  templateUrl: './user-layout.component.html',
  styleUrl: './user-layout.component.css'
})
export class UserLayoutComponent {
  searchInput: any;

  constructor(private searchService: SearchService, private router: Router) {}

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
}
