import { Component } from '@angular/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BooksService } from '../../../shared/services/books.service';
import { AuthorService } from '../../../shared/services/author.service';
import { GenreService } from '../../../shared/services/genre.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-books',
  imports: [NgxDatatableModule, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './books.component.html',
  styleUrl: './books.component.css'
})
export class BooksComponent {
  bookForm: FormGroup;
  modalTitle: string = "Add Book";
  isFormSubmitted: boolean = false;
  rowToDelete: any = null;
  rows: any;
  pageSize = 5;  // Number of items per page
  currentPage = 0;
  displayedRows: { 
    title: string; 
    author: string; 
    year: number; 
    genre: string; 
    pages: number; 
    publisher: string; 
    rating: number; 
  }[] = [];
  openAddEditModal = false;
  DeleteModal = false;
  imagePreview: string | null = null;
  imageError: string | null = null;
  authors: any;
  genres: any;
  publishers: any;
  selectedBookId = '';
  searchInput: string = '';


  constructor(private fb: FormBuilder, private bookService: BooksService, private authorService: AuthorService, private genreService: GenreService, private toastr: ToastrService ) {
    this.bookForm = this.fb.group({
      title: ['', [Validators.required]],
      publicationYear: [''],
      description: [''],
      isbn: [''],
      language: [''],
      pageCount: [''],
      publisherId: [''],
      authorId: [''],
      genreId: [''],
      bookCover: [null]
    });
  }

  ngOnInit(): void {
    this.getAllBooks();
    this.getAllAuthors();
    this.getAllGenres();
    this.getAllPublishers();
  }

  getAllBooks() {
    this.bookService.getAllBooks().subscribe((res: any) => {
      this.rows = res || [];
      this.updateDisplayedRows();
    }, (err: any) => {
      console.error(err);
    });
  }

  getAllAuthors() {
    this.authorService.getAllAuthors().subscribe(
      (res:any) => {
        this.authors = res;
      },
      (err: any) => {
        console.log(err);
      }
    )
  }

  getAllGenres() {
    this.genreService.getAllGenres().subscribe(
      (res: any) => this.genres = res,
      (err: any) => console.log(err)
    );
  }

  getAllPublishers() {
    this.authorService.getAllPublishers().subscribe(
      (res: any) => this.publishers = res,
      (err: any) => console.log(err)
    );
  }
  
  get f() {
    return this.bookForm.controls;
  }

  updateDisplayedRows() {
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    this.displayedRows = this.rows.slice(start, end);
  }

  onPageChange(event: any) {
    this.currentPage = event.offset;
    this.updateDisplayedRows();
  }

  nextPage() {
    if ((this.currentPage + 1) * this.pageSize < this.rows.length) {
      this.currentPage++;
      this.updateDisplayedRows();
    }
  }

  prevPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.updateDisplayedRows();
    }
  }

  get totalPages() {
    return Math.ceil(this.rows.length / this.pageSize);
  }

  onFileSelect(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        this.imageError = "Invalid file type. Please upload an image.";
        return;
      }

      // Validate file size (Max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        this.imageError = "File size should not exceed 2MB.";
        return;
      }

      // Clear errors
      this.imageError = null;

      // Convert file to base64 for preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);

      // Save the file in the form control
      this.bookForm.patchValue({ bookCover: file });
      this.bookForm.get('bookCover')?.updateValueAndValidity();
    }
  }

  editBook(row: any) {
    console.log("Edit book:", row);
  }

  deleteBook() {
    console.log(this.rowToDelete);
  }

  openModal(book: any = null) {
    this.openAddEditModal = true;
    if(book) {
      this.selectedBookId = book.bookId;
      this.modalTitle = "Edit Book";
      this.bookForm.patchValue({
        title: book.title,
        publicationYear: book.publicationYear,
        description: book.description,
        isbn: book.isbn,
        language: book.language,
        pageCount: book.pageCount,
        publisherId: book.publisherId,
        authorId: book.authorId,
        genreId: book.genreId
      });
    }
  }

  closeModal() {
    this.openAddEditModal = false;
    this.bookForm.reset();
    this.imagePreview = null;
    this.imageError = null;
  }

  openDeleteModal(row: any) {
    // console.log(row);
    this.rowToDelete = row;
    this.DeleteModal = true;
  }
  closeDeleteModal() {
    this.DeleteModal = false;
    this.rowToDelete = [];
  }
  DeleteBook() {
    this.bookService.deleteBook(this.rowToDelete.bookId).subscribe((res: any) => {
      console.log(res);
      this.getAllBooks();
      this.closeDeleteModal();
    }, (err: any) => {
      console.error(err);
      this.toastr.error(err)
    });
  }

  submitForm() {
    this.isFormSubmitted = true;
  
    if (this.bookForm.invalid) {
      return;
    }
  
    const formValues = this.bookForm.value;
    const formData = new FormData();
  
    formData.append('title', formValues.title);
    formData.append('publicationYear', formValues.publicationYear || '');
    formData.append('description', formValues.description || '');
    formData.append('isbn', formValues.isbn || '');
    formData.append('language', formValues.language || '');
    formData.append('pageCount', formValues.pageCount || '');
  
    // These should match backend parameter expectations
    formData.append('publisherId', formValues.publisherId || '');
    formData.append('authorId', formValues.authorId || '');
    formData.append('genreId', formValues.genreId || '');
  
    if (formValues.bookCover) {
      formData.append('bookCover', formValues.bookCover);
    }
  
    if (this.selectedBookId) {
      // Update book
      this.bookService.updateBook(this.selectedBookId, formData).subscribe(
        (res) => {
          this.toastr.success('Book updated successfully:', "Error");
          this.closeModal();
          this.getAllBooks();
        },
        (err) => {
          console.error('Error updating book:', err);
        }
      );
    } else {
      // Create new book
      this.bookService.createBook(formData).subscribe(
        (res) => {
          this.toastr.success('Book created successfully:', "Success");
          this.closeModal();
        },
        (err) => {
          console.error('Error creating book:', err);
        }
      );
    }
  }
  
  clearSearch() {
    this.searchInput = '';
    this.getAllBooks(); // or re-fetch default user list if needed
  }

  searchBooks() {
    const term = this.searchInput?.trim();
    if (!term) return;
  
    this.bookService.searchBooks(term).subscribe((res: any) => {
      this.rows = res || [];
      this.updateDisplayedRows();
    }, err => {
      console.error('Search error:', err);
    });
  }
  
}
