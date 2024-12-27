import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CourseDurationService } from '../../service/CourseDuration.service';
import { CourseDuration } from '../../model/CourseDuration';

@Component({
  selector: 'app-course-duration',
  templateUrl: './course-duration.component.html',
  styleUrls: ['./course-duration.component.css']
})
export class CourseDurationComponent {


  courseDurationForm!: FormGroup;
  getCourseDurationList!: CourseDuration[];

  constructor(
    private formBuilder: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private courseDurationService: CourseDurationService
  ) {}

  ngOnInit(): void {
    this.initializeCategoryForm();
    this.getCourseDuration();
  }

  initializeCategoryForm() {
    this.courseDurationForm = this.formBuilder.group({
      durationInMonths: ['', [Validators.required]],
      totalHours: ['', [Validators.required]],
      startDate:[''],
      endDate:[''],

    });
  }


  getCourseDuration() {
    this.courseDurationService.getAllCourseDurations().subscribe((res: CourseDuration[]) => {
      this.getCourseDurationList = res;
      console.log('CourseDuration', this.getCourseDurationList);
    });
  }

  addCourseDuration() {
    if (this.courseDurationForm.valid) {
      this.confirmationService.confirm({
        message: 'Are you sure you want to add this course duration?',
        accept: () => {
          const categoryData = this.courseDurationForm.value;
          this.courseDurationService.createCourseDuration(categoryData).subscribe(
            (createdCategory) => {
              // Handle the response from the API or perform any necessary actions
              console.log('Course duration created:', createdCategory);
  
              // Reset the form after successful submission
              this.courseDurationForm.reset();
  
              // Show success message
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Course Duration added successfully!' });
              this.getCourseDuration();
            },
            (error) => {
              console.error('Error adding course duration:', error);
  
              // Show error message
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add Course Duration!' });
            }
          );
        },
      });
    }
  }

}
