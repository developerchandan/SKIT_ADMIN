import { Component } from '@angular/core';
import { FormsService } from '../../service/forms.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-become-instructor',
  templateUrl: './become-instructor.component.html',
  styleUrls: ['./become-instructor.component.css']
})
export class BecomeInstructorComponent {

  becomeInstructor:any

  constructor(
    private courseService:FormsService,
    private route:ActivatedRoute,
    private router:Router
    ){}
  ngOnInit():void{

    this.getBecomeInstructors();
  }

  getBecomeInstructors(){
    this.courseService.getBecomeInstructor().subscribe((res)=>{
      this.becomeInstructor=res;
     

    })

  }

}
