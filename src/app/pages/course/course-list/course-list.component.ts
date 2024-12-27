import { Component } from '@angular/core';
import { CourseService } from '../../service/course.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.css']
})
export class CourseListComponent {

  courseList:any
  constructor(
    private courseService:CourseService,
    private route:ActivatedRoute,
    private router:Router
    ){}
  ngOnInit():void{

    this.getAllCourses();
  }

  getAllCourses(){
    this.courseService.getCourseListFilter().subscribe((res)=>{
      this.courseList=res;
      console.log(this.courseList);

    })

  }
}
