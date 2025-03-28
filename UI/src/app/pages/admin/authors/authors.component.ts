import { Component } from '@angular/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-authors',
  imports: [NgxDatatableModule, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './authors.component.html',
  styleUrl: './authors.component.css'
})
export class AuthorsComponent {
  authorForm: FormGroup;
  modalTitle: string = "Add Author";
  isFormSubmitted: boolean = false;
  rowToDelete: any = null;

  constructor(private fb: FormBuilder) {
    this.authorForm = this.fb.group({
      title: ['', [Validators.required]],
      subtitle: [''],
      description: [''],
      isbn: [''],
      publicationYear: [''],
      language: [''],
      numberOfPages: [''],
      publisher: [''],
      authors: [''],
      genre: [''],
      bookCover: [null]
    });
  }
  rows = [
    { 
      title: "The Great Gatsby", 
      author: "F. Scott Fitzgerald", 
      year: 1925, 
      genre: "Fiction", 
      pages: 180, 
      publisher: "Scribner", 
      rating: 4.3 
    },
    { 
      title: "To Kill a Mockingbird", 
      author: "Harper Lee", 
      year: 1960, 
      genre: "Drama", 
      pages: 281, 
      publisher: "J. B. Lippincott & Co.", 
      rating: 4.8 
    },
    { 
      title: "1984", 
      author: "George Orwell", 
      year: 1949, 
      genre: "Dystopian", 
      pages: 328, 
      publisher: "Secker & Warburg", 
      rating: 4.6 
    },
    { 
      title: "The Great Gatsby", 
      author: "F. Scott Fitzgerald", 
      year: 1925, 
      genre: "Fiction", 
      pages: 180, 
      publisher: "Scribner", 
      rating: 4.3 
    },
    { 
      title: "To Kill a Mockingbird", 
      author: "Harper Lee", 
      year: 1960, 
      genre: "Drama", 
      pages: 281, 
      publisher: "J. B. Lippincott & Co.", 
      rating: 4.8 
    },
    { 
      title: "1984", 
      author: "George Orwell", 
      year: 1949, 
      genre: "Dystopian", 
      pages: 328, 
      publisher: "Secker & Warburg", 
      rating: 4.6 
    }
  ];

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

  get f() {
    return this.authorForm.controls;
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
      this.authorForm.patchValue({ bookCover: file });
      this.authorForm.get('bookCover')?.updateValueAndValidity();
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
      this.modalTitle = "Edit Author";
      this.authorForm.patchValue(book);
    }
  }

  closeModal() {
    this.openAddEditModal = false;
    this.authorForm.reset();
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
    if(this.authorForm.invalid) {
      return;
    }
    console.log(this.authorForm.value);
    // this.closeModal();
  }
}
