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

  getUserProfile(userId: any) {
    return this.http.get(`${this.apiUrl}/profile?userId=${userId}`);
  }

  UpdateUser(userId: any, data: FormData) {
    return this.http.put(`${this.apiUrl}/update/${userId}`, data);
  }

  toggleUserStatus(userId: string) {
    return this.http.post(`${this.apiUrl}/toggle-status/${userId}`, null);
  }

  searchUsers(searchTerm: string) {
    return this.http.get(`${this.apiUrl}/search?query=${searchTerm}`);
  }


}
