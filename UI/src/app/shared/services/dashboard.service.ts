import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  apiUrl = `${environment.apiUrl}/Dashboard`;

  constructor(private http: HttpClient) { }

  getDashboardData() {
    return this.http.get(`${this.apiUrl}/dashboard-stats`);
  }
}
