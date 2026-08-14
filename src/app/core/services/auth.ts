import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginRequest, LoginResponse } from '../interfaces/login';
import { UserResponse } from '../interfaces/user';
import { environment } from '../../enviroments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);

  login(data: LoginRequest): Observable<LoginResponse> {

    return this.http.post<LoginResponse>(

      `${environment.apiUrl}/auth/login`,

      data
    );

  }
  logout(): Observable<any> {

    return this.http.post(

      `${environment.apiUrl}/auth/logout`,

      {}

    );

  }

  me(): Observable<UserResponse> {

    return this.http.get<UserResponse>(

      `${environment.apiUrl}/auth/me`

    );

  }

}

