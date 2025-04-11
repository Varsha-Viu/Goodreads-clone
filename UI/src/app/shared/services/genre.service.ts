import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GenreService {
  apiUrl = `${environment.apiUrl}/Genres`;

  constructor(private http: HttpClient) { }

  getAllGenres() {
    return this.http.get(`${this.apiUrl}/getAllGenres`);
  }

  getGenreById(authorId: string) {
    return this.http.get(`${this.apiUrl}/getGenreById/${authorId}`);
  }

  createGenre(data: FormData) {
    return this.http.post(`${this.apiUrl}/createGenre`, data);
  }

  updateGenre(authorId: string, data: FormData) {
    return this.http.put(`${this.apiUrl}/updateGenre/${authorId}`, data);
  }
  
  deleteGenre(authorId: string) {
    return this.http.delete(`${this.apiUrl}/deleteGenre/${authorId}`);
  }
}
