import { Component } from '@angular/core';
import { GenreService } from '../../../shared/services/genre.service';
import { CommonModule } from '@angular/common';
import { BooksService } from '../../../shared/services/books.service';
import { NgxPaginationModule } from 'ngx-pagination'; // <-- import the module
import { FormsModule } from '@angular/forms';
import { SearchService } from '../../../shared/search.service';

@Component({
  selector: 'app-bookslisting',
  imports: [CommonModule, NgxPaginationModule, FormsModule],
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

  constructor(private genreService: GenreService, private bookService: BooksService, private searchService: SearchService) {
    this.getAllGenres();
    this.getAllbooks();
    this.clearAllFilters();
    this.searchService.currentSearch.subscribe((term) => {
      this.searchText = term;
      this.filterBooks(); // Apply filter when text changes
    });
  }

  getAllGenres() {
    this.genreService.getAllGenres().subscribe((response) => {
      // console.log(response);
      this.genres = response;
    });
  }

  getAllbooks() {
    this.bookService.getAllBooks().subscribe((response) => {
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
    book.isWishlisted = !book.isWishlisted;
    // Optionally: trigger some service or store logic here
  }
}
