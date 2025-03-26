import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  chartData = [
    { name: 'Books', value: 500 },
    { name: 'Authors', value: 120 },
    { name: 'Users', value: 300 }
  ];
  topRatedBooks = [
    { name: 'Book A', value: 95 },
    { name: 'Book B', value: 90 },
    { name: 'Book C', value: 85 },
    { name: 'Book D', value: 80 },
    { name: 'Book E', value: 75 }
  ];
}
