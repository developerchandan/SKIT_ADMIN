import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';


import { Auth, User } from '../model/auth';
import { LocalstorageService } from './localstorage.service';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public avail: boolean = false;
  public msg: string = "";
  private isAuthenticated = false;

  apiURLUsers = environment.apiUrl + 'skit-admin';

  constructor(
    private http: HttpClient,
    private token: LocalstorageService,
    private router: Router
  ) {}


  loginUser(email: string, password: string): Observable<Auth> {
    this.isAuthenticated = true;
    return this.http.post<Auth>(`${this.apiURLUsers}/skit-admin-login`, { email, password });
  }

  setSession(authResult: any) {
    const token = authResult.token;
    const user = authResult.user;
    localStorage.setItem('access_token', token);
    localStorage.setItem('user_id', user.id);
  }
  createUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiURLUsers}/skit-admin-sign-up`, user);
  }

  login(){
    this.isAuthenticated = true;
  }

  logout() {
    this.isAuthenticated = false;
    this.token.removeToken();
    this.router.navigate(['/login']);

  }

  loggedIn() {
    return !!localStorage.getItem('token')
  }

  isLoggedIn() {
    return this.isAuthenticated;
  }

  getToken() {
    return localStorage.getItem('token')
  }


  logoutUser() {
    localStorage.removeItem('token');
    localStorage.removeItem('simpleUser')
    localStorage.removeItem('email')

    this.router.navigate(['/'])
  }
}
