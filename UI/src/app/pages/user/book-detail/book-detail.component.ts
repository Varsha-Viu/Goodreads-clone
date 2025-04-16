import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BooksService } from '../../../shared/services/books.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../shared/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-book-detail',
  imports: [CommonModule, FormsModule],
  templateUrl: './book-detail.component.html',
  styleUrl: './book-detail.component.css'
})
export class BookDetailComponent {

  bookDetails: any;
  showCategoryModal = false;
  selectedBookId: number | null = null;
  bookProgress: any;
  bookProgressPercent: number = 0;

  categorySelections = {
    all: false,
    currentlyReading: false,
    wantToRead: false,
    finished: false
  };

  selectedCategory: string = '';

  constructor(private route: ActivatedRoute, private bookService: BooksService, private authService: AuthService, private router: Router, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getBookDetail();
  }

  getBookDetail() {
    const bookId = this.route.snapshot.paramMap.get('bookId');
    const userId = this.authService.getUserId();
    const uid = userId ? userId : null;
    if (bookId) {
      this.bookService.getBookById(bookId, uid).subscribe((res: any) => {
        console.log(res);
        this.bookDetails = res;
      });
    }
  }

  openCategoryModal(bookId: number) {
    const userId = this.authService.getUserId(); // make sure it fetches from session or token

    if (!userId) {
      sessionStorage.setItem('redirectPath', this.router.url);
      this.router.navigate(['/login']);
      this.toastr.info('Please login to create bookshelf.', 'Info');
      return;
    }

    this.selectedBookId = bookId;
    this.showCategoryModal = true;
    this.resetCategorySelections(); // Reset previous selections
  }

  resetCategorySelections() {
    this.categorySelections = {
      all: false,
      currentlyReading: false,
      wantToRead: false,
      finished: false
    };
  }

  closeCategoryModal() {
    this.showCategoryModal = false;
    this.selectedBookId = null;
  }

  submitCategory() {
    const userId = this.authService.getUserId(); // make sure it fetches from session or token

    const payload = {
      userId: userId,
      bookId: this.selectedBookId,
      categories: [this.selectedCategory]  // wrap in array to match API DTO
    };

    this.bookService.assignCategory(payload).subscribe({
      next: () => {
        this.toastr.success('Added to bookshelf', 'Success');
        this.closeCategoryModal();
        console.log("Category saved!");
        // Optionally close modal or show toast
      },
      error: err => console.error(err)
    });
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
        this.bookService.AddtoWishlist(userId, book.bookId).subscribe({
          next: (res) => {
            // Success: maybe show a toast or update UI
            this.toastr.success('Added to wishlist');
            book.isWishlisted = true; // update local UI if needed
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
            book.isWishlisted = true; // update local UI if needed
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

  updateBookProgress(totalPage: any) {
    this.bookProgressPercent = Math.round((this.bookProgress / totalPage) * 100);
  }

  navigateBack() {
    this.router.navigate(['/book-listing']);
  }
}
