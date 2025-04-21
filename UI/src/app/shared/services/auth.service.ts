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

  Register(data: FormData) {
    return this.http.post(`${this.apiUrl}/auth/register`, data);
  }
  
  ForgotPassword(email: string) {
    return this.http.post(`${this.apiUrl}/auth/forgot-password?email=${email}`, null);
  }
  
  ResetPassword(data: FormData) {
    return this.http.post(`${this.apiUrl}/Auth/reset-password`, data);
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

  getUserId(): string | null {
    const decodedToken = this.DecodedToken();
    if(decodedToken == null) return null;
    var userId = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
    if (decodedToken && userId) {
      return userId;
    }
    return null;
  }

  getUserName(): string | null {
    const decodedToken = this.DecodedToken();
    if(decodedToken == null) return null;
    var userId = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
    if (decodedToken && userId) {
      return userId;
    }
    return null;
  }

}
