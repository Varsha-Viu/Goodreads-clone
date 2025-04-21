import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';
import { BooksService } from '../../../shared/services/books.service';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../shared/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  currentlyReadingBooks: any[] = [];
  currentBooksCount: number = 0;
  books: any;
  userName: any;
  readingChallenge: any = null;
  readingChallengeProgress: number = 0;
  userId: any;
  isAddChallengeModalOpen = false;
  targetBooks: number = 0;

  constructor(private router: Router, private authService: AuthService, private bookService: BooksService, private userService: UserService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getCurrentlyReadingBooks();
    this.getAllBooks();
    this.userName = this.authService.getUserName();
    this.userId = this.authService.getUserId(); // Replace with your actual auth logic
    if (this.userId) {
      this.fetchReadingChallenge(this.userId);
    }
  }

  gotToBookListing() {
    this.router.navigate(['/book-listing']);
  }

  getCurrentlyReadingBooks() {
    const userId = this.authService.getUserId(); // assuming you store userId in authService
    if (userId) {
      this.bookService.getCurrentlyReadingBooks(userId).subscribe({
        next: (res: any) => {
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

  fetchReadingChallenge(userId: string): void {
    this.userService.getUserChallenge(userId).subscribe({
      next: (res: any) => {
        this.readingChallenge = res;
        this.calculateChallengeProgress();
      },
      error: (err) => {
        console.error('Failed to fetch reading challenge', err);
      }
    });
  }

  calculateChallengeProgress(): void {
    if (this.readingChallenge && this.readingChallenge.targetBooks > 0) {
      const completed = this.readingChallenge.completedBooks || 0;
      const target = this.readingChallenge.targetBooks;
      this.readingChallengeProgress = (completed / target) * 100;
    } else {
      this.readingChallengeProgress = 0;
    }
  }

  openAddChallengeModal(): void {
    this.isAddChallengeModalOpen = true;
  }

  closeAddChallengeModal(): void {
    this.isAddChallengeModalOpen = false;
    this.targetBooks = 0;
  }

  submitReadingChallenge(): void {
    if (this.targetBooks > 0) {
      const d = new Date();
      let year = d.getFullYear();
      const payload = {
        targetBooks: this.targetBooks,
        userId: this.userId,
        year: year,
        CompletedBooks: 0,
      };

      this.userService.createChallenge(payload).subscribe({
        next: (res) => {
          this.toastr.success('Challenge added!');
          this.readingChallenge = res;
          this.readingChallengeProgress = 0;
          this.closeAddChallengeModal();
        },
        error: (err) => {
          console.error(err);
          this.toastr.error('Failed to add challenge');
        },
      });
    }
  }

}
