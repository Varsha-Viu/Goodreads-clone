import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BooksService } from '../../../shared/services/books.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../shared/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { error } from 'jquery';

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
  reviews: any;
  totalReviews: number = 0;
  bookImageError: { [key: string]: boolean } = {};

  categorySelections = {
    all: false,
    currentlyReading: false,
    wantToRead: false,
    finished: false
  };

  selectedCategory: string = '';
  showReviewModal = false;
  review = {
    rating: 0,
    comment: ''
  };
  selectedReviewId: any;
  hoverRating = 0;
  loggedInUserId: any;
  isEditMode: boolean = false;


  constructor(private route: ActivatedRoute, private bookService: BooksService, private authService: AuthService, private router: Router, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getBookDetail();
    this.loggedInUserId = this.authService.getUserId();
  }

  getBookDetail() {
    const bookId = this.route.snapshot.paramMap.get('bookId');
    const userId = this.authService.getUserId();
    const uid = userId ? userId : null;
    if (bookId) {
      this.bookService.getBookById(bookId, uid).subscribe((res: any) => {
        console.log(res);
        this.bookDetails = res;
        this.getAllReviewsByBookId(bookId);
        this.bookProgress = res.lastPageRead;
        this.bookProgressPercent = res.progressPercent
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

    this.saveCategory(payload);
    
  }

  saveCategory(payload: any) {
    this.bookService.assignCategory(payload).subscribe({
      next: () => {
        this.toastr.success('Added to bookshelf', 'Success');
        this.closeCategoryModal();
        // console.log("Category saved!");
        this.getBookDetail();
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

  addUpdateBookProgress(totalPage: number) {
    if (this.bookProgress > totalPage) {
      this.toastr.error("Pages cannot be greater than total page count", "Error");
      this.bookProgress = 0;
      this.bookProgressPercent = 0;
      return;
    }

    this.bookProgressPercent = Math.round((this.bookProgress / totalPage) * 100);
    const userId = this.authService.getUserId();

    const progressDto = {
      userId: userId,
      bookId: this.bookDetails.bookId,
      progressPercent: this.bookProgressPercent,
      lastPageRead: this.bookProgress,
      status: this.bookProgressPercent === 100 ? "Completed" : "Reading"
    };

    this.saveProgress(progressDto);
  }

  alreadyFinished() {
    const userId = this.authService.getUserId();

    const progressDto = {
      userId: userId,
      bookId: this.bookDetails.bookId,
      progressPercent: 100,
      lastPageRead: this.bookDetails.pageCount,
      status: "Completed"
    };

    this.saveProgress(progressDto);
  }

  saveProgress(progressDto: any) {
    this.bookService.addUpdateBookProgress(progressDto).subscribe(
      (res: any) => {
        if (res.isSuccess) {
          this.toastr.success("Progress updated successfully!", "Success");
        }
        else {
          this.toastr.error("Failed to update progress", "Error");
        }
      },
      (err: any) => {
        this.toastr.error(err.Error, "Error");
      }
    );
  }

  navigateBack() {
    this.router.navigate(['/book-listing']);
  }

  openReviewModal() {
    this.showReviewModal = true;
  }

  closeReviewModal() {
    this.showReviewModal = false;
    this.review = { rating: 0, comment: '' }; // reset
  }

  setRating(star: number) {
    this.review.rating = star;
  }

  submitReview() {
    if (!this.review.rating && !this.review.comment) {
      this.toastr.error('Please fill in the review (rating or comment)');
      return;
    }    

    const userId = this.authService.getUserId();

    // Replace with your actual API call
    const payload = {
      bookId: this.bookDetails.bookId,
      userId: userId,
      rating: this.review.rating,
      comment: this.review.comment
    };

    if(this.selectedReviewId) {
      this.bookService.updateBookReview(this.selectedReviewId, payload).subscribe(
        (res: any) => {
          if (res.isSuccess) {
            this.toastr.success("Review submitted!", "Success");
            this.closeReviewModal();
            this.getBookDetail();
          }
          else {
            this.toastr.error("Failed to submit review", "Error");
          }
        },
        (err: any) => {
          this.toastr.error(err.Error, "Error");
        }
      );
    }
    else {
      this.bookService.createReview(payload).subscribe(
        (res: any) => {
          if (res.isSuccess) {
            this.toastr.success("Review submitted!", "Success");
            this.closeReviewModal();
            this.getBookDetail();
          }
          else {
            this.toastr.error("Failed to submit review", "Error");
          }
        },
        (err: any) => {
          this.toastr.error(err.Error, "Error");
        }
      );
    }
    
  }

  onEditReview(review: any) {
    this.review = {
      rating: review.rating || null,
      comment: review.comment || '',
      //id: review.id, // keep track for update
    };
    this.selectedReviewId = review.reviewId;
    this.isEditMode = true; // Optional: track if it's editing
    this.openReviewModal(); // This opens the modal
  }
  
  deleteReview(review: any) {
    this.bookService.deleteBookReview(review.reviewId).subscribe(
      (res: any) => {
        if (res.isSuccess) {
          this.toastr.success("Review deleted!", "Success");
          // this.closeReviewModal();
          this.getBookDetail();
        }
        else {
          this.toastr.error("Failed to delete review", "Error");
        }
      },
      (err: any) => {
        this.toastr.error(err.Error, "Error");
      }
    )
  }

  moveToCurrentlyReading(bookId: string) {
    const userId = this.authService.getUserId(); // make sure it fetches from session or token

    const payload = {
      userId: userId,
      bookId: bookId,
      categories: "currentlyReading"  // wrap in array to match API DTO
    };

    this.saveCategory(payload);
  }

  getAllReviewsByBookId(bookId: string) {
    this.bookService.getReviewsByBookId(bookId).subscribe(
      (res:any) => {
        // debugger
        // console.log(res);
        this.reviews = res
        this.totalReviews = res.length;
      },
      (err: any) => this.toastr.error(err, "Error")
    );
  }

  handleImageError(bookId: string) {
    this.bookImageError[bookId] = true;
  }
}
