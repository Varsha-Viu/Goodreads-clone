import { AuthorService } from '../../../shared/services/author.service';
import { Component } from '@angular/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../environments/environment';

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
  rows: any;
  pageSize = 5;  // Number of items per page
  currentPage = 0;
  displayedRows: any[] = [];
  openAddEditModal = false;
  DeleteModal = false;
  imagePreview: string | null = null;
  imageError: string | null = null;
  selectedFile: File | null = null;
  selectedAuthorId = '';
  searchTerm: string = '';
  imageBaseUrl = environment.imageUrl;

  constructor(private fb: FormBuilder, private authorService: AuthorService, private toastr: ToastrService) {
    this.authorForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: [''],
      penName: [''],
      biography: [''],
      email: [''],
      website: [''],
      socialLinks: [''],
      profileImageUrl: ['']
    });
  }

  ngOnInit(): void {
    this.getAllAuthors();
  }

  get f() {
    return this.authorForm.controls;
  }

  getAllAuthors() {
    this.authorService.getAllAuthors().subscribe((res: any) => {
      this.rows = res;
      this.updateDisplayedRows();
    }, (err: any) => {
      console.error(err);
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

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0]; // ✅ Declare the file first
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
      this.authorForm.patchValue({ profileImageUrl: file });
      this.authorForm.get('profileImageUrl')?.updateValueAndValidity();
    
      this.selectedFile = file;
    }
  }

  openModal(author: any = null) {
    this.openAddEditModal = true;
    if (author) {
      this.selectedAuthorId = author.authorId;
      this.modalTitle = 'Edit Author';
      this.authorForm.patchValue(author);
      
      this.imagePreview = author.profileImageUrl
        ? `https://localhost:7078${author.profileImageUrl}` 
        : null;
    } else {
      this.modalTitle = 'Add Author';
      this.authorForm.reset();
      this.imagePreview = null;
    }
  }
  
  removeImage() {
    this.imagePreview = null;
    this.selectedFile = null;
    this.authorForm.patchValue({ profileImageUrl: null });
    this.authorForm.get('profileImageUrl')?.updateValueAndValidity();
  }

  closeModal() {
    this.openAddEditModal = false;
    this.authorForm.reset();
    this.imagePreview = null;
    this.imageError = null;
    this.selectedAuthorId = '';
  }

  openDeleteModal(row: any) {
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
      formData.append('firstName', formValue.firstName || '');
      formData.append('lastName', formValue.lastName || '');
      formData.append('penName', formValue.penName || '');
      formData.append('biography', formValue.biography || '');
      formData.append('email', formValue.email || '');
      formData.append('website', formValue.website || '');
      formData.append('socialLinks', formValue.socialLinks || '');
    
    if (this.selectedFile) {
      formData.append('profileImageUrl', this.selectedFile);
    }
      
    if(this.selectedAuthorId) {
      this.authorService.updateAuthor(this.selectedAuthorId, formData).subscribe((res: any) => { 
        console.log(res);
        this.getAllAuthors();
        this.closeModal();
      }
      , (err: any) => {
        console.error(err);
        this.toastr.error(err, "Error");
      });
    }
    else {
      this.authorService.createAuthor(formData).subscribe((res: any) => { 
        console.log(res);
        this.getAllAuthors();
        this.closeModal();
      }
      , (err: any) => {
        console.error(err);
        this.toastr.error(err, "Error");
      });
    }
    console.log(this.authorForm.value);
    this.closeModal();
  }

  DeleteAuthor() {
    this.authorService.deleteAuthor(this.rowToDelete.authorId).subscribe((res: any) => {
      console.log(res);
      this.getAllAuthors();
      this.closeDeleteModal();
    }, (err: any) => {
      console.error(err);
    });
  }

  searchAuthors() {
    console.log(this.searchTerm)
    if (this.searchTerm) {
      this.authorService.searchAuthors(this.searchTerm).subscribe((res: any) => {
        this.rows = res.data;
        this.updateDisplayedRows();
      }, (err: any) => {
        console.error(err);
      });
    } else {
      this.getAllAuthors();
    }
  }

  clearSearch() {
    this.searchTerm = '';
    this.getAllAuthors(); // or re-fetch default user list if needed
  }
}
