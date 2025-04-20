import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthorService } from '../../../shared/services/author.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-authors-list',
  imports: [CommonModule],
  templateUrl: './authors-list.component.html',
  styleUrl: './authors-list.component.css'
})
export class AuthorsListComponent {
  AuthorList: any[] =[];
  authorImageBroken: boolean = false;

  constructor(private authorService: AuthorService, private router: Router) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getAllAuthors();
  }

  getAllAuthors() {
    this.authorService.getAllAuthors().subscribe(
      (res: any) =>  {
        this.AuthorList = res;
      }
    )
  }

  OpenAuthorDetails(authorId: any) {
    this.router.navigate([`author-details/${authorId}`])
  }

  navigateBackToLandingPage() {
    this.router.navigate([`/landingPage`])
  }
}
