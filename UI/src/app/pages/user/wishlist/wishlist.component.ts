import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BooksService } from '../../../shared/services/books.service';
import { AuthService } from '../../../shared/services/auth.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-wishlist',
  imports: [CommonModule, FormsModule, NgxPaginationModule, RouterLink],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css'
})
export class WishlistComponent {
  searchInput: any;
  activeTag: string = 'all';
  allBooks: any[] = []; // from API, includes wishlist and category info
  filteredBooks: any[] = [];
  page: number = 1;
  bookImageError: { [bookId: string]: boolean } = {};

  tagLabels: { [key: string]: string } = {
    all: 'All',
    currentlyReading: 'Currently Reading',
    wantToRead: 'Want to Read',
    finished: 'Finished',
    wishlist: 'Wishlist'
  };

  constructor(private bookService: BooksService, private authService: AuthService, private toastr: ToastrService) { }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getUserBookShelf();
  }
  getUserBookShelf() {
    const userId = this.authService.getUserId();
    if (userId) {
      this.bookService.getUserBookshelf(userId).subscribe((res: any) => {
        const categories = res.categories || [];
        const wishlist = res.wishlist || [];
  
        // Step 1: Build a map of books with category info
        const map = new Map<string, any>();
        
        categories.forEach((book: any) => {
          map.set(book.bookId, {
            ...book,
            isWishlisted: false // default to false, updated below if needed
          });
        });
  
        // Step 2: Add wishlist info and update if already in map
        wishlist.forEach((book: any) => {
          const existing = map.get(book.bookId);
          if (existing) {
            existing.isWishlisted = true;
          } else {
            map.set(book.bookId, {
              ...book,
              categoryName: null, // no category, wishlist only
              isWishlisted: true
            });
          }
        });
  
        // Step 3: Convert map to array
        this.allBooks = Array.from(map.values());
        this.filterBooks(); // Initial filter
      });
    }
  }
  
  setActiveTag(tag: string) {
    this.activeTag = tag;
    this.filterBooks();
  }

  filterBooks() {
    if (this.activeTag === 'all') {
      this.filteredBooks = [...this.allBooks];
    } else if (this.activeTag === 'wishlist') {
      this.filteredBooks = this.allBooks.filter(book => book.isWishlisted);
    } else {
      this.filteredBooks = this.allBooks.filter(book => book.categoryName === this.activeTag);
    }
  }
  
  clearSearch() {
    this.searchInput = '';
    this.getUserBookShelf();
  }

  resetFilters() {
    this.searchInput = '';
    this.activeTag = 'all';
    this.filterBooks();
  }
  
  onImageError(bookId: string) {
    this.bookImageError[bookId] = true;
  }

  searchBook() {
    const searchTerm = this.searchInput.toLowerCase().trim();
  
    if (!searchTerm) {
      this.filterBooks(); // reapply tag filter
      return;
    }
  
    const baseBooks = this.activeTag === 'all'
      ? this.allBooks
      : this.allBooks.filter(book =>
          this.activeTag === 'wishlist'
            ? book.isWishlisted
            : book.categoryName === this.activeTag
        );
  
    this.filteredBooks = baseBooks.filter(book =>
      book.title.toLowerCase().includes(searchTerm) ||
      (book.authorName && book.authorName.toLowerCase().includes(searchTerm))
    );
  }
  
  
  toggleWishlist(book: any) {
    const userId = this.authService.getUserId();
    if (userId) {
      if (!book.isWishlisted) {
        this.bookService.AddtoWishlist(userId, book.bookId).subscribe({
          next: (res) => {
            // Success: maybe show a toast or update UI
            this.toastr.success('Added to wishlist');
            book.isWishlisted = true; // update local UI if needed
            this.setActiveTag(this.activeTag);
          },
          error: (err) => {
            if (err.status === 400) {
              this.toastr.warning(err.error); // will show "Book already in wish list."
            } else {
              this.toastr.error('Something went wrong');
            }
          }
        });
      } else {
        this.bookService.removeFromWishlist(userId, book.bookId).subscribe({
          next: (res: any) => {
            // Success: maybe show a toast or update UI
            this.toastr.success('Removed from wishlist');
            book.isWishlisted = false; // update local UI if needed
            this.setActiveTag(this.activeTag)
          },
          error: (err: any) => {
            if (err.status === 400) {
              this.toastr.warning(err.error); // will show "Book already in wish list."
            } else {
              this.toastr.error('Something went wrong');
            }
          }
        });
      }
    }

  }

}
