import { Component } from '@angular/core';
import { DashboardService } from '../../../shared/services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  totalUsers: number = 0;
  totalBooks: number = 0; 
  totalAuthors: number = 0;
  totalGenres: number = 0;
  newUsers: number = 0;

  constructor(private dashboardService: DashboardService) { }

  ngOnInit(): void {
    // Initialization logic here
    this.getDashboardData();
  }

  getDashboardData() {
    this.dashboardService.getDashboardData().subscribe((res: any) => {
      console.log(res);
      this.totalUsers = res.data.users;
      this.totalBooks = res.data.books;
      this.totalAuthors = res.data.authors;
      this.totalGenres = res.data.genres;
      this.newUsers = res.data.newUsersThisWeek;
      // Handle the dashboard data here
    }, (err: any) => {
      console.error(err);
    });
  }
}
