import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Level } from '../model/course-level';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root',
})
export class LevelService {
//   private apiUrl = '/api/levels'; 
  apiUrl = environment.apiUrl + 'courseLevels';

  constructor(private http: HttpClient) {}

  // POST: Create a new level
  createLevel(levelData: Level): Observable<Level> {
    return this.http.post<Level>(`${this.apiUrl}/levels`, levelData);
  }

  // GET: Get all levels
  getLevels(): Observable<Level[]> {
    return this.http.get<Level[]>(`${this.apiUrl}/levels`,);
  }

  // GET: Get a specific level by ID
  getLevelById(levelId: string): Observable<Level> {
    return this.http.get<Level>(`${this.apiUrl}/${levelId}`);
  }

  // PUT: Update a specific level by ID
  updateLevel(levelId: string, levelData: Level): Observable<Level> {
    return this.http.put<Level>(`${this.apiUrl}/${levelId}`, levelData);
  }

  // DELETE: Delete a specific level by ID
  deleteLevel(levelId: string): Observable<Level> {
    return this.http.delete<Level>(`${this.apiUrl}/${levelId}`);
  }
}
