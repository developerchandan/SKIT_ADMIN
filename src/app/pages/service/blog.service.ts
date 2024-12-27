import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Blog } from '../model/blog';


@Injectable({ providedIn: 'root' })
export class BlogService {

  apiURLBlogs = environment.apiUrl + 'blogs';

  constructor(
    private http: HttpClient,
  ) {}

  getBlogList() {
    return this.http.get(`${this.apiURLBlogs}/getblogsList` );
  }

  getBlogListId(blogdetailsid: string): Observable<Blog> {
    return this.http.get<Blog>(`${this.apiURLBlogs}/${blogdetailsid}`);
  }
}
