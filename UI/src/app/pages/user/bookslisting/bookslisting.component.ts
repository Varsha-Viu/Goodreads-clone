import { Component } from '@angular/core';
import { GenreService } from '../../../shared/services/genre.service';
import { CommonModule } from '@angular/common';
import { BooksService } from '../../../shared/services/books.service';
import { NgxPaginationModule } from 'ngx-pagination'; // <-- import the module
import { FormsModule } from '@angular/forms';
import { SearchService } from '../../../shared/search.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-bookslisting',
  imports: [CommonModule, NgxPaginationModule, FormsModule, RouterLink],
  templateUrl: './bookslisting.component.html',
  styleUrl: './bookslisting.component.css'
})
export class BookslistingComponent {
  totalBooksCount: number = 0
  genres: any;
  books: any;
  page: number = 1;
  authorInput: string = '';
  selectedAuthors: string[] = [];
  selectedGenres: string[] = [];
  searchText: string = '';
  filtered: any[] = [];

  constructor(private genreService: GenreService, private bookService: BooksService, private searchService: SearchService, private toastr: ToastrService, private router: Router, private authService: AuthService) {

  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getAllGenres();
    this.getAllBooks();
    this.clearAllFilters();
    this.searchBook();
    
  }

  searchBook() {
    if (this.searchService.currentSearch != null) {
      this.searchService.currentSearch.subscribe((term) => {
        if (term && term.trim() !== '') {
          this.searchText = term;
          this.filterBooks(); // Apply filter only when term is not empty
        }
      });
    }
  }

  getAllGenres() {
    this.genreService.getAllGenres().subscribe((response) => {
      // console.log(response);
      this.genres = response;
    });
  }

  getAllBooks() {
    const userId = this.authService.getUserId();
    const uid = userId ? userId : null;
  
    this.bookService.getAllBooks(uid).subscribe((response) => {
      this.books = response;
      this.totalBooksCount = this.books.length;
      this.filterBooks();
    });
  }
  

  addAuthorFilter() {
    const trimmed = this.authorInput.trim();
    if (trimmed && !this.selectedAuthors.includes(trimmed)) {
      this.selectedAuthors.push(trimmed);
      this.filterBooks();
    }
    this.authorInput = ''; // clear input after adding
  }

  filterBooks() {
    let filtered = this.books;

    // Author filter
    if (this.selectedAuthors.length > 0) {
      filtered = filtered.filter((book: any) =>
        this.selectedAuthors.some((author: any) =>
          this.normalize(book.authorName ?? '').includes(this.normalize(author))
        )
      );
    }

    // Genre filter
    if (this.selectedGenres.length > 0) {
      filtered = filtered.filter((book: any) =>
        this.selectedGenres.includes(book.genreName)
      );
    }

    // Book title search filter
    if (this.searchText.trim() !== '') {
      filtered = filtered.filter((book: any) =>
        this.normalize(book.title ?? '').includes(this.normalize(this.searchText))
      );
    }

    this.filtered = filtered;
  }

  normalize(str: string): string {
    return str.toLowerCase().replace(/[\s.]/g, ''); // removes spaces and dots
  }

  toggleGenre(name: string) {
    const index = this.selectedGenres.indexOf(name);
    if (index > -1) {
      this.selectedGenres.splice(index, 1);
    } else {
      this.selectedGenres.push(name);
    }
    this.filterBooks(); // ✅ add this
  }

  clearGenres() {
    this.selectedGenres = [];
    this.filterBooks();
  }

  removeAuthor(index: number) {
    this.selectedAuthors.splice(index, 1);
    this.filterBooks(); // ✅ add this
  }

  clearAllFilters() {
    this.selectedAuthors = [];
    this.selectedGenres = [];
    this.authorInput = '';
    this.searchText = '';
    this.filterBooks(); // ✅ add this
  }

  toggleWishlist(book: any) {
    const token = sessionStorage.getItem('token');
    if (!token) {
      sessionStorage.setItem('redirectAfterLogin', this.router.url); // save current path
      this.toastr.info('Login to add the book to wishlist');
      this.router.navigate(['/login']);
      return;
    }
    const userId = this.authService.getUserId();
    if (userId) {
      if (!book.isWishlisted) {
        this.bookService.AddtoWishlist(userId, book.bookId).subscribe(() => {
          book.isWishlisted = true;
          this.toastr.success('Added to wishlist');
        });
      } else {
        this.bookService.removeFromWishlist(userId, book.bookId).subscribe(() => {
          book.isWishlisted = false;
          this.toastr.success('Removed from wishlist');
        });
      }
    }

  }
}
