import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-books',
  imports: [NgxDatatableModule, CommonModule],
  templateUrl: './books.component.html',
  styleUrl: './books.component.css'
})
export class BooksComponent {
  rows=[
    {
      name:"mercy",age:10,town:"Nairobi",country:"kenya"
    },
    {
      name:"Vincent",age:40,town:"Kampala",country:"Uganda"
    },
    {    
      name:"Wesley",age:41,town:"Cairo",country:"Egypt"
    }
  ]
}
