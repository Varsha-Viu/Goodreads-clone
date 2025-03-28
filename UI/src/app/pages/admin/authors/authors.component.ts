import { Component } from '@angular/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-authors',
  imports: [NgxDatatableModule, CommonModule],
  templateUrl: './authors.component.html',
  styleUrl: './authors.component.css'
})
export class AuthorsComponent {
  rows = [
    { 
      title: "The Great Gatsby", 
      author: "F. Scott Fitzgerald", 
      year: 1925, 
      genre: "Fiction", 
      pages: 180, 
      publisher: "Scribner volume ", 
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

  editBook(row: any) {
    console.log("Edit book:", row);
  }

  deleteBook(row: any) {
    console.log("Delete book:", row);
  }
}
