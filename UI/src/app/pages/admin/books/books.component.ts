import { Component } from '@angular/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BooksService } from '../../../shared/services/books.service';

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

  constructor(private fb: FormBuilder, private bookService: BooksService) {
    this.bookForm = this.fb.group({
      title: ['', [Validators.required]],
      publicationYear: [''],
      description: [''],
      isbn: [''],
      language: [''],
      pageCount: [''],
      publisherName: [''],
      authorName: [''],
      genreName: [''],
      bookCover: [null]
    });
  }

  ngOnInit(): void {
    this.getAllBooks();
  }

  getAllBooks() {
    this.bookService.getAllBooks().subscribe((res: any) => {
      this.rows = res || [];
      this.updateDisplayedRows();
    }, (err: any) => {
      console.error(err);
    });
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
      this.modalTitle = "Edit Book";
      this.bookForm.patchValue(book);
    }
  }

  closeModal() {
    this.openAddEditModal = false;
    this.bookForm.reset();
    this.imagePreview = null;
    this.imageError = null;
  }

  openDeleteModal(row: any) {
    console.log(row);
    this.rowToDelete = row;
    this.DeleteModal = true;
  }
  closeDeleteModal() {
    this.DeleteModal = false;
  }

  submitForm() {
    this.isFormSubmitted = true;
    if(this.bookForm.invalid) {
      return;
    }
    console.log(this.bookForm.value);
    // this.closeModal();
  }
}
