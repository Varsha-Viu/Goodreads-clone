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
    if (bookId) {
      this.bookService.getBookById(bookId).subscribe((res: any) => {
        console.log(res);
        this.bookDetails = res;
      });
    }
  }

  openCategoryModal(bookId: number) {
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

    if (!userId) {
      sessionStorage.setItem('redirectPath', this.router.url);
      this.router.navigate(['/login']);
      this.toastr.info('Please login to assign categories.', 'Info');
      return;
    }

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

  navigateBack() {
    this.router.navigate(['/book-listing']);
  }
}
