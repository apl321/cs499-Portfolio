import { User } from '../models/user';
import { AuthResponse } from '../models/auth-response';

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Trip } from '../models/trip';

export interface TripQuery {
  search?: string;
  maxPrice?: number | null;
  sort?: string;
  page?: number;
  limit?: number;
}

@Injectable({
  providedIn: 'root',
})
export class TripData {

  private url = 'http://localhost:3000/api/trips';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('travlr-token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  getTrips(filters: TripQuery = {}): Observable<Trip[]> {
    let params = new HttpParams();

    if (filters.search?.trim()) {
      params = params.set('search', filters.search.trim());
    }
    if (filters.maxPrice !== null &&
      filters.maxPrice !== undefined) {
      params = params.set('maxPrice', filters.maxPrice.toString());
    }
    if (filters.sort) {
      params = params.set('sort', filters.sort);
    }
    if (filters.page !== undefined) {
      params = params.set('page', filters.page.toString());
    }
    if (filters.limit !== undefined) {
      params = params.set('limit', filters.limit.toString());
    }
    return this.http.get<Trip[]>(this.url, {
      headers: this.getAuthHeaders(),
      params: params
    });
  }
  
  addTrip(formData: Trip): Observable<Trip> {
    return this.http.post<Trip>(this.url, formData, { headers: this.getAuthHeaders() });
  }

  getTrip(tripCode: string): Observable<Trip> {
    return this.http.get<Trip>(`${this.url}/${tripCode}`, { headers: this.getAuthHeaders() });
  }

  updateTrip(formData: Trip): Observable<Trip> {
    return this.http.put<Trip>(`${this.url}/${formData.code}`, formData, { headers: this.getAuthHeaders() });
  }
  login(user: User, passwd: string): Observable<AuthResponse>{
    const body = {
      email: user.email,
      password: passwd
    };
    return this.http.post<AuthResponse>(
      'http://localhost:3000/api/login',
      body
    );
  }
  register(user: User, passwd: string): Observable<AuthResponse> {
    const body = {
      name: user.name,
      email: user.email,
      password: passwd
    };
    return this.http.post<AuthResponse>(
      'http://localhost:3000/api/register',
      body
    );
  }
}

