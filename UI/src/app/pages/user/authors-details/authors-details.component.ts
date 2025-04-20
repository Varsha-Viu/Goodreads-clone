import { Component } from '@angular/core';
import { BooksService } from '../../../shared/services/books.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthorService } from '../../../shared/services/author.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-authors-details',
  imports: [CommonModule],
  templateUrl: './authors-details.component.html',
  styleUrl: './authors-details.component.css'
})
export class AuthorsDetailsComponent {

  books: any[] = [];
  author: any = {};
  bookImageError: { [bookId: string]: boolean } = {};
  authorImageBroken: boolean = false;

  authorId: string = '';

  constructor(private authorService: AuthorService, private route: ActivatedRoute, private router:Router) {}

  ngOnInit(): void {
    this.authorId = this.route.snapshot.paramMap.get('authorId') || '';
    this.authorService.getBooksByAuthor(this.authorId).subscribe((data: any) => {
      this.books = data.books;
      this.author = data.author;
      console.table(data)
    });
  }

  goToBooksDetail(bookId: string) {
    this.router.navigate([`/book-details/${bookId}`])
  }

  navigateBacktoListing() {
    const redirectPath = sessionStorage.getItem('redirectPath');
    debugger
    if(redirectPath == null){
      this.router.navigate(['/author-list']);
    }
    else {
      this.router.navigateByUrl(redirectPath);
      sessionStorage.removeItem('redirectPath');
    }
  }

  onImageError(bookId: string) {
    this.bookImageError[bookId] = true;
  }
}
