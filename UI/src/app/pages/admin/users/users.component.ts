import { Component } from '@angular/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../shared/services/user.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-users',
  imports: [NgxDatatableModule, CommonModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {
  isBlocked: boolean = false;
  rows: any;
  pageSize = 5;  // Number of items per page
  currentPage = 0;
  displayedRows: {
    userName: string;
    firstName: string;
    lastName: number;
    Email: string;
    phoneNumber: number;
    address: string;
    isActive: number;
  }[] = [];

  searchTerm: string = '';

  constructor(private userService: UserService) {

 }

 ngOnInit(): void {
  this.getAllUsers();
 }

  getAllUsers() {
    this.userService.getAllUsers().subscribe((res: any) => {
      this.rows = res;
    },
      (err: any) => {
        console.log(err);
      })
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

  blockUser(row: any) {
    this.userService.toggleUserStatus(row.id).subscribe((res: any) => {
      if (res.isSuccess) {
        this.getAllUsers();
      }
    },
      (err: any) => {
        console.log(err);
      }
    );
  }

  searchUsers() {
    this.userService.searchUsers(this.searchTerm).subscribe((res: any) => {
      this.rows = res.data;
      this.updateDisplayedRows();
    },
      (err: any) => {
        console.log(err);
      }
    );
  }

  clearSearch() {
    this.searchTerm = '';
    this.getAllUsers(); // or re-fetch default user list if needed
  }
}
