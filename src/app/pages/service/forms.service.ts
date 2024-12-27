import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class FormsService {

  apiURLBecomeInstructor = environment.apiUrl + 'becomeInstructor';
  apiURLCorporateTraining = environment.apiUrl + 'corporateTraining';
  apiURLH1bvisa = environment.apiUrl + 'h1bvisa';
  apiURLDemo = environment.apiUrl + 'demo';
  apiURLContactUs = environment.apiUrl + 'contacts';

  constructor(
    private http: HttpClient,
  ) {}

  getBecomeInstructor() {
    return this.http.get(`${this.apiURLBecomeInstructor}` );
  }

  getCorporateTraining() {
    return this.http.get(`${this.apiURLCorporateTraining}` );
  }

  getH1bvisa() {
    return this.http.get(`${this.apiURLH1bvisa}` );
  }

  getDemo () {
    return this.http.get(`${this.apiURLDemo}` );
  }
  getContactUs () {
    return this.http.get(`${this.apiURLContactUs}` );
  }
 
}
