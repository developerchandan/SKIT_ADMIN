import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {

  apiUrl = environment.apiUrl + 'categories';

  constructor(private http: HttpClient) {}

  // Get all categories
  getCategories(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/categories`);
  }

  // Create a new category
  createCategory(categoryData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/categories`, categoryData);
  }

  // Get all subcategories
  getSubcategories(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/subcategories`);
  }

  // Create a new subcategory for a specific category categories 
  createSubcategory(categoryId: string, subcategoryData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/categories/${categoryId}/subcategories`, subcategoryData);
  }

  // Create a new subcategory
  createNewSubcategory(subcategoryData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/subcategories`, subcategoryData);
  }

  // Delete a category and its associated subcategories
  deleteCategory(categoryId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/categories/${categoryId}`);
  }
}
