import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  apiUrl = `${environment.apiUrl}/Users`;
  readingChallengeApiUrl = `${environment.apiUrl}/ReadingChallenge`;

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

  getUserChallenge(userId: string) {
    const d = new Date();
    let year = d.getFullYear();
    return this.http.get(`${this.readingChallengeApiUrl}/getChallenge/${userId}/${year}`);
  }

  createChallenge(payload: any) {
    return this.http.post(`${this.readingChallengeApiUrl}/addChallenge`, payload);
  }
  
  UpdateChallenge(challengeID: any, payload: any) {
    return this.http.patch(`${this.readingChallengeApiUrl}/updateChallenge/${challengeID}`, payload);
  }

  updateChallenge(id: string, challengeData: any): Observable<any> {
    return this.http.put(`${this.readingChallengeApiUrl}/updateChallenge/${id}`, challengeData);
  }

}
