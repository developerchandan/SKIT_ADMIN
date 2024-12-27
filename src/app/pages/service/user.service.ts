import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../model/auth';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  apiURLUsers = environment.apiUrl + 'Skit-admin';

  constructor(private http: HttpClient) { }

  getUserAdmin(userId: string):Observable<User> {
    return this.http.get(`${this.apiURLUsers}/admin-profile/${userId}`);
  }

  updateProfile(userId: string, formData: FormData): Observable<any> {
    return this.http.put(`${this.apiURLUsers}/update-profile/${userId}`, formData);
  }

  uploadFile(userId: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(`${this.apiURLUsers}/update-profile/${userId}`, formData);
  }

}
