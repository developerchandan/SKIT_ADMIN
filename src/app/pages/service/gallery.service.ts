import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Gallery } from '../model/gallery';


@Injectable({ providedIn: 'root' })
export class GalleryService {

  apiURLGallerys = environment.apiUrl + 'gallery';

  constructor(
    private http: HttpClient,
  ) {}

  getGalleryList() {
    return this.http.get(`${this.apiURLGallerys}/getgalleryList` );
  }

  getGalleryListId(gallerydetailsid: string): Observable<Gallery> {
    return this.http.get<Gallery>(`${this.apiURLGallerys}/${gallerydetailsid}`);
  }
}
