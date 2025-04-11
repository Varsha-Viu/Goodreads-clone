import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BooksService {
  apiUrl = `${environment.apiUrl}/Books`;
  
  constructor(private http: HttpClient) { }

  getAllBooks() {
    return this.http.get(`${this.apiUrl}/getAllBooks`);
  }

  getBookById(bookId: string) {
    return this.http.get(`${this.apiUrl}/getBookById/${bookId}`);
  }

  createBook(data: FormData) {
    return this.http.post(`${this.apiUrl}/createBook`, data);
  }

  updateBook(bookId: string, data: FormData) {
    return this.http.put(`${this.apiUrl}/updateBooks/${bookId}`, data);
  }
  
  deleteAuthor(authorId: string) {
    return this.http.delete(`${this.apiUrl}/deleteBook/${authorId}`);
  }

  searchAuthors(searchTerm: string) {
    return this.http.get(`${this.apiUrl}/search-authors?searchTerm=${searchTerm}`);
  }
}
