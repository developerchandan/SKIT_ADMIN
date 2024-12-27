import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Course } from '../model/course';


@Injectable({
  providedIn: 'root'
})
export class CourseService {

 apiURLCourses = environment.apiUrl + 'course';
 apiURLCourssAutoSave = environment.apiUrl + 'course/auto-save';
 

 apiURLCourseLevels= environment.apiUrl + 'courseLevels';
 apiURLCategory= environment.apiUrl + 'categories';
 apiURLDuration= environment.apiUrl + 'courseDurations';


  constructor(private http: HttpClient) {}

  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiURLCategory}/api/categories`);
  }
  getSubCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiURLCategory}/api/subcategories`);
  }
  getCourseLevel(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiURLCourseLevels}/levels`);
  }

  getCourseDuration(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiURLDuration}/api/courseDurations`);
  }
  getCourse(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiURLCourses}/courses`);
  }
  
  getCourseByInstructorId(InstructorId: string): Observable<any> {
    const url = `${this.apiURLCourses}/courses/instructor/${InstructorId}`;
    return this.http.get(url);
  }

  getCourseListFilter(filters?: { [key: string]: string[] }): Observable<Course[]> {
    let params = new HttpParams();
    if (filters) {
      for (let key in filters) {
        if (filters.hasOwnProperty(key)) {
          params = params.append(key, filters[key].join(','));
        }
      }
    }
    return this.http.get<Course[]>(`${this.apiURLCourses}/courses`, {params: params});
  }
  getCourseDetails(courseId: string): Observable<any> {
    const url = `${this.apiURLCourses}/get-courses/${courseId}`;
    return this.http.get(url);
  }
  getCourseByUniqueName(uniqueCourseName: string): Observable<any> {
    return this.http.get<any>(`${this.apiURLCourses}/courses/${uniqueCourseName}`);
  }
  createCourse(formData: FormData): Observable<Course> {
    return this.http.post<Course>(`${this.apiURLCourses}/add-course`, formData);
  }
  
  saveDraft(draftData: any) {
    return this.http.post(`${this.apiURLCourses}/draft`, draftData);
  }

  autoSaveDraft(draftData: any): Observable<any> {
    const url = `${this.apiURLCourssAutoSave}`; 
    return this.http.post(url, draftData);
  }

  updateCourse(courseId: string, updatedCourse: any): Observable<any> {
    const url = `${this.apiURLCourses}/edit-course/${courseId}`;
    return this.http.put(url, updatedCourse);
  }

  uploadImage(file: File): Observable<HttpEvent<any>> {
    // Create a new FormData object
    const formData = new FormData();
    formData.append('image', file);

    // Send the image file to the server using HttpClient
    const uploadReq = new HttpRequest('POST', `${this.apiURLCourses}/uploadImage`, formData, {
      reportProgress: true, // This flag enables progress reporting
    });

    // Track the upload progress and return the Observable of HttpEvent<any>
    return this.http.request(uploadReq);
  }

  uploadCoverImage(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('coverImage', file);

    // Send a POST request to your API endpoint for uploading the cover image
    return this.http.post<string>(`${this.apiURLCourses}/api/upload-cover-image`, formData);
  }
  deleteCoverImage(coverImage: string): Observable<any> {
    return this.http.post<any>(`${this.apiURLCourses}/delete-cover-image`, { coverImage });
  }
  
  
  
  uploadVideo(file: File): Observable<HttpEvent<any>> {
    // Create a new FormData object
    const formData = new FormData();
    formData.append('video', file);

    // Send the video file to the server using HttpClient
    const uploadReq = new HttpRequest('POST', `${this.apiURLCourses}/uploadVideo`, formData, {
      reportProgress: true, // This flag enables progress reporting
    });

    // Track the upload progress and return the Observable of HttpEvent<any>
    return this.http.request(uploadReq);
  }
  deleteVideo(videoUrl: string): Observable<any> {
    return this.http.post<any>(`${this.apiURLCourses}/deleteVideo`, { videoUrl });
  }

  
  updateCoverImage(courseId: string, formData: FormData): Observable<any> {
    return this.http.put(`${this.apiURLCourses}/update-cover-image/${courseId}`, formData);
  }
  uploadPdf(file: File): Observable<HttpEvent<any>> {
    // Create a new FormData object
    const formData = new FormData();
    formData.append('pdf', file);

    // Send the video file to the server using HttpClient
    const uploadReq = new HttpRequest('POST', `${this.apiURLCourses}/uploadpdf`, formData, {
      reportProgress: true, // This flag enables progress reporting
    });

    // Track the upload progress and return the Observable of HttpEvent<any>
    return this.http.request(uploadReq);
  }
  deletePdf(pdfUrl: string): Observable<any> {
    return this.http.post<any>(`${this.apiURLCourses}/deletepdf`, { pdfUrl });
  }
  
  saveVideoDataToMongoDB(videoData: any): Observable<any> {
    // Replace 'your_backend_api_url' with the actual URL for your Node.js API endpoint to save video data to MongoDB
    return this.http.post('your_backend_api_url/saveVideoData', videoData);
  }


  uploadPdfToS3(pdfFile: File): Observable<any> {
    const formData = new FormData();
    formData.append('pdf', pdfFile);

    // Replace 'your_s3_upload_url' with the actual URL for your S3 upload endpoint for PDFs
    return this.http.post('your_s3_pdf_upload_url', formData);
  }

  deleteCategory(categoryId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiURLCourses}/${categoryId}`);
  }

  searchCourses(keyword: string, tags: string[]): Observable<any[]> {
    const params = new HttpParams()
      .set('q', keyword)
      .set('tags', tags.join(',')); 

    const options = { params };

    return this.http.get<any[]>(`${this.apiURLCourses}/search-course`, options);
  }

  getSuggestions(term: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiURLCourses}/suggestion`, {
      params: { term },
    });
  }

  dateFilterCourses(keyword: string, dateFilter: string) {
    const params = new HttpParams()
      .set('q', keyword)
      .set('dateFilter', dateFilter);

    return this.http.get(`${this.apiURLCourses}/filter-course-by-date`, { params });
  }
  sortCoursePost(sortBy: string,page?: number,pageSize?: number): Observable<any> {
    let params = new HttpParams();
  
    if (sortBy) {
      params = params.set('sortBy', sortBy);
    }
  
    if (page) {
      params = params.set('page', page.toString());
    }
  
    if (pageSize) {
      params = params.set('pageSize', pageSize.toString());
    }
  
    return this.http.get<any>(`${this.apiURLCourses}/courses`, { params }).pipe(
      map((courseList) => {
        if (courseList && courseList.length > 0) {
          return courseList.sort((a: { dateCreated: string | number | Date; }, b: { dateCreated: string | number | Date; }) => {
            if (sortBy === 'newest') {
              return new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime();
            } else if (sortBy === 'oldest') {
              return new Date(a.dateCreated).getTime() - new Date(b.dateCreated).getTime();
            } else {
              return 0;
            }
          });
        }
        return courseList;
      })
    );
  }

  getCoursesByCategory(categoryId: string): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiURLCourses}/category/${categoryId}`);
  }

  updateWatchedStatus(lessonId: string, userId: string, watched: boolean): Observable<any> {
    const body = { lessonId, userId, watched };
    return this.http.post<any>(`${this.apiURLCourses}/update-watched`, body);
  }

  getWatchedLecture(lessonId: string, userId: string): Observable<any> {
    return this.http.get<any>(
      `${this.apiURLCourses}/watched-lectures?lessonId=${lessonId}&userId=${userId}`
    );
  }


}
