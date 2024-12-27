import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { LevelService } from '../../service/courseLevel.service';
import { Level } from '../../model/course-level';

@Component({
  selector: 'app-course-level',
  templateUrl: './course-level.component.html',
  styleUrls: ['./course-level.component.css']
})
export class CourseLevelComponent {
  courseLevelForm!: FormGroup;
  getCourseLevelList!: Level[];

  constructor(
    private formBuilder: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private courseLevelService: LevelService
  ) {}

  ngOnInit(): void {
    this.initializeCourseLevelForm();
    this.getCourseLevel();
  }

  initializeCourseLevelForm() {
    this.courseLevelForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      
    });
  }

  getCourseLevel() {
    this.courseLevelService.getLevels().subscribe((res: Level[]) => {
      this.getCourseLevelList = res;
      console.log('courseLevel', this.getCourseLevelList);
    });
  }

  addCourseLevel() {
    if (this.courseLevelForm.valid) {
      this.confirmationService.confirm({
        message: 'Are you sure you want to add this course Level?',
        accept: () => {
          const courseLevelData = this.courseLevelForm.value;
          this.courseLevelService.createLevel(courseLevelData).subscribe(
            (createdCourseLevel) => {
              // Handle the response from the API or perform any necessary actions
              console.log('Course level created:', createdCourseLevel);
  
              // Reset the form after successful submission
              this.courseLevelForm.reset();
  
              // Show success message
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Course level added successfully!' });
              this.getCourseLevel();
            },
            (error) => {
              console.error('Error adding course level:', error);
  
              // Show error message
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add Course level!' });
            }
          );
        },
      });
    }
  }

}
