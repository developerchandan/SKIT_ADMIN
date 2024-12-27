import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CourseDuration } from '../model/CourseDuration';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class CourseDurationService {

  apiUrl = environment.apiUrl + 'courseDurations';
  constructor(private http: HttpClient) { }

  // Create a new course duration
  createCourseDuration(courseDuration: CourseDuration): Observable<CourseDuration> {
    return this.http.post<CourseDuration>(`${this.apiUrl}/api/courseDurations`,  courseDuration);
  }

  // Get all course durations
  getAllCourseDurations(): Observable<CourseDuration[]> {
    return this.http.get<CourseDuration[]>(`${this.apiUrl}/api/courseDurations`,);
  }

  // Update a course duration by ID
  updateCourseDuration(id: string, courseDuration: CourseDuration): Observable<CourseDuration> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<CourseDuration>(url, courseDuration);
  }

  // Delete a course duration by ID
  deleteCourseDuration(id: string): Observable<CourseDuration> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<CourseDuration>(url);
  }
}
