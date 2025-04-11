import { Component } from '@angular/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { GenreService } from '../../../shared/services/genre.service';

@Component({
  selector: 'app-categories',
  imports: [NgxDatatableModule, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent {
  authorForm: FormGroup;
  modalTitle: string = "Add new genre";
  isFormSubmitted: boolean = false;
  rowToDelete: any = null;
  rows:any;

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
  selectedGenreId: string = '';

  constructor(private fb: FormBuilder, private genreService: GenreService) {
    this.authorForm = this.fb.group({
      name: ['', [Validators.required]],
      description: [''],
    });
  }

  ngOnInit() {
    this.getAllGenres();
  }

  get f() {
    return this.authorForm.controls;
  }

  getAllGenres() {
    this.genreService.getAllGenres().subscribe((res: any) => {
      this.rows = res || [];
      this.updateDisplayedRows();
    });
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


  openModal(row: any = null) {
    this.openAddEditModal = true;
    if(row) {
      this.modalTitle = "Edit genre";
      this.authorForm.patchValue(row);
      this.selectedGenreId = row.genreId;
    }
  }

  closeModal() {
    this.openAddEditModal = false;
    this.authorForm.reset();
    this.imagePreview = null;
    this.imageError = null;
    this.selectedGenreId = '';
    this.isFormSubmitted = false;
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
    const formData = new FormData();
    const formValue = this.authorForm.value;
      formData.append('name', formValue.name || '');
      formData.append('description', formValue.description || '');
  
      
    if(this.selectedGenreId) {
      this.genreService.updateGenre(this.selectedGenreId, formData).subscribe((res: any) => { 
        console.log(res);
        this.getAllGenres();
        this.closeModal();
      }
      , (err: any) => {
        console.error(err);
      });
    }
    else {
      this.genreService.createGenre(formData).subscribe((res: any) => { 
        console.log(res);
        this.getAllGenres();
        this.closeModal();
      }
      , (err: any) => {
        console.error(err);
      });
    }
    console.log(this.authorForm.value);
    this.closeModal();
  }

  deleteGenre() {
    if (this.rowToDelete) {
      this.genreService.deleteGenre(this.rowToDelete.genreId).subscribe((res: any) => { 
        console.log(res);
        this.getAllGenres();
        this.closeDeleteModal();
      }
      , (err: any) => {
        console.error(err);
      });
    } 
  }
}
