import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BooksService {
  apiUrl = `${environment.apiUrl}/Books`;
  wishlistUrl = `${environment.apiUrl}/WishList`;
  AssignCategoryUrl = `${environment.apiUrl}/UserBookCategories`;

  constructor(private http: HttpClient) { }

  getAllBooks1() {
    return this.http.get(`${this.apiUrl}/getAllBooks`);
  }

  getAllBooks(userId?: any) {
    let params = new HttpParams();
    if (userId) {
      params = params.set('userId', userId.toString());
    }
    return this.http.get<any[]>(`${this.apiUrl}/getAllBooks`, { params });
  }

  getBookById(bookId: string, uid: any) {
    return this.http.get(`${this.apiUrl}/getBookById/${bookId}?userId=${uid}`);
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

  AddtoWishlist(userId: string, bookId: string) {
    var data = new FormData();
    data.append('userId', userId);
    data.append('bookId', bookId);
    return this.http.post(`${this.wishlistUrl}`, data);
  }

  removeFromWishlist(userId: string, bookId: string) {
    return this.http.delete(`${this.wishlistUrl}/removeFromWishlist?bookId=${bookId}&userId=${userId}`);
  }

  assignCategory(payload: any): Observable<any> {
    return this.http.post(`${this.AssignCategoryUrl}/assign`, payload);
  }

  getUserBookshelf(userId: string): Observable<any> {
    return this.http.get(`${this.AssignCategoryUrl}/getUserBookShelf/${userId}`);
  }

  getCurrentlyReadingBooks(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.AssignCategoryUrl}/currently-reading/${userId}`);
  }
  
}
