import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { jwtDecode } from "jwt-decode";
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  login(data: FormData) {
    return this.http.post(`${this.apiUrl}/auth/login`, data);
  }

  logout() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('isUser');
  }

  isAuthenticated(): boolean {
    var token = sessionStorage.getItem('token');
    var isUser = sessionStorage.getItem('isUser');
    if (!token) {
      return false;
    }
    return true;
  }

  DecodedToken(): any {
    const token = sessionStorage.getItem('token');
    if (!token) return null;
    try {
      return jwtDecode(token);
    } catch (error) {
      return null;
    }
  }

  getUserRole(): string | null {
    const decodedToken = this.DecodedToken();
    var role = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    if (decodedToken && role) {
      return role;
    }
    return null;
  }


}
