import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthorService {
  apiUrl = `${environment.apiUrl}/Authors`;
  publishersApiUrl = `${environment.apiUrl}/Publisher`;
  
  constructor(private http: HttpClient) { }

  getAllAuthors() {
    return this.http.get(`${this.apiUrl}/GetAllAuthors`);
  }

  getAuthorById(authorId: string) {
    return this.http.get(`${this.apiUrl}/getAuthorByauthorId/${authorId}`);
  }

  createAuthor(data: FormData) {
    return this.http.post(`${this.apiUrl}/addAuthor`, data);
  }

  updateAuthor(authorId: string, data: FormData) {
    return this.http.put(`${this.apiUrl}/updateAuthor/${authorId}`, data);
  }
  
  deleteAuthor(authorId: string) {
    return this.http.delete(`${this.apiUrl}/deleteAuthor/${authorId}`);
  }

  searchAuthors(searchTerm: string) {
    return this.http.get(`${this.apiUrl}/search-authors?searchTerm=${searchTerm}`);
  }


  // publishers

  getAllPublishers() {
    return this.http.get(`${this.publishersApiUrl}/getAllPublishers`);
  }
}
