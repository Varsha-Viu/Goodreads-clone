import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';
import { BooksService } from '../../../shared/services/books.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  currentlyReadingBooks: any[] = [];
  currentBooksCount: number = 0;
  books: any;
  

  constructor(private router: Router, private authService: AuthService, private bookService: BooksService) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getCurrentlyReadingBooks();
    this.getAllBooks();
  }

  gotToBookListing() {
    this.router.navigate(['/book-listing']);
  }

  getCurrentlyReadingBooks() {
    const userId = this.authService.getUserId(); // assuming you store userId in authService
    if (userId) {
      this.bookService.getCurrentlyReadingBooks(userId).subscribe({
        next: (res:any) => {
          this.currentlyReadingBooks = res;
          this.currentBooksCount = this.currentlyReadingBooks.length;
          console.log(res)
        },
        error: (err: any) => {
          console.error('Error fetching currently reading books', err);
        }
      });
    }
  }

  getAllBooks() {
    const userId = this.authService.getUserId();
    const uid = userId ? userId : null;
  
    this.bookService.getAllBooks(uid).subscribe((response) => {
      this.books = response;
    });
  }
}
