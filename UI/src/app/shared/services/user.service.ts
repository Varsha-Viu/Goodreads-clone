import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
apiUrl = `${environment.apiUrl}/Users`;

  constructor(private http: HttpClient) { }

  getAllUsers() {
    return this.http.get(`${this.apiUrl}/allUsers`);
  }

  toggleUserStatus(userId: string) {
    return this.http.post(`${this.apiUrl}/toggle-status/${userId}`, null);
  }

  searchUsers(searchTerm: string) {
    return this.http.get(`${this.apiUrl}/search?query=${searchTerm}`);
  }
}
