import { Component, Input } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { Subscription, interval } from 'rxjs';
import { CourseService } from '../../service/course.service';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-course-form',
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.css']
})
export class CourseFormComponent {
  InstructorId!: string;
  instructor: any;
  @Input() userProfileId!: string;
  successMessages: Message[] = [];
  successVideoMessages:Message[]=[];
  selectedImage!: string;
  public Editor = ClassicEditor;
  public courseForm: FormGroup;
  private autoSaveInterval$!: Subscription;
  public isAutoSaving: boolean = false;
  courseLevel: any;
  curriculumForm!: FormGroup;
  isVideoAdded: boolean = false;
  isPdfAdded: boolean = false;
  isVideoUploaded: boolean = false;
  items: any[] = [{ label: 'Basic Information' }, { label: 'Curriculum' }];

  currentStep: number = 0;

  getCategoryList!: any[]; 
  getSubCategoryList!: any[]; 
  selectedCategory: any;
  courseDuration:any
  showSpinner: boolean = false; 

  constructor(
    private fb: FormBuilder,
    private router:Router,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private confirmationService: ConfirmationService, 
    private courseService: CourseService
    
    ) {
    this.courseForm = this.fb.group({
      title: ['', [Validators.required, this.noConsecutiveSpacesValidator]],
      category: ['', Validators.required],
      subCategory: ['', Validators.required],
      level: ['', Validators.required],
      coverImage: [''],
      courseDuration:[''],
      subtitle: ['', Validators.required],
      tags: [[]],
      price: [''],
      description: ['', Validators.required],
      instructor: [null],
    });
  }

  ngOnInit() {

    this.autoSaveInterval$ = interval(300000).subscribe(() => {
      this.isAutoSaving = true;
      this.saveDraft();
      this.isAutoSaving = false;
    });
    this.curriculumForm = this.fb.group({
      sections: this.fb.array([]),
    });

    this.getCategory();
    this.getSubCategory();
    this.getCourseLevel();
    this.getDuration();
    this.loadDraft();
  }

  getCategory() {
    debugger
    this.courseService.getCategories().subscribe((res) => {
      this.getCategoryList = res;
      console.log('getCategoryList', this.getCategoryList);
    });
  }

  onCategoryChange(event: any) {
    const categoryId = event.value;
    this.selectedCategory = this.getCategoryList.find(cat => cat._id === categoryId);
    this.getSubCategoryList = this.selectedCategory ? this.selectedCategory.subcategories : [];
    this.courseForm.get('subCategory')?.setValue('');
  }
  getSubCategory() {
    this.courseService.getSubCategories().subscribe((res) => {
      this.getSubCategoryList = res;
      console.log('getSubCategoryList', this.getSubCategoryList);
    });
  }

  getCourseLevel() {
    this.courseService.getCourseLevel().subscribe((res) => {
      this.courseLevel = res;
      console.log('courseLevel', this.courseLevel);
    });
  }

  getDuration() {
    this.courseService.getCourseDuration().subscribe((res) => {
      this.courseDuration = res;
      console.log('courseDuration', this.courseDuration);
    });
  }
  ngOnDestroy() {
    // Unsubscribe from the auto-save interval to avoid memory leaks
    this.autoSaveInterval$.unsubscribe();
  }

  
  onFileSelected(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement?.files?.length) {
      const selectedFile = inputElement.files[0] as File;
  
      this.courseService.uploadCoverImage(selectedFile).subscribe(
        (response: any) => { // Use 'any' here to accept any response type
          if (typeof response === 'string') {
            // Handle the response when it's a string URL
            const coverImageURL = response;
            console.log('Cover Image URL:', coverImageURL);
            this.selectedImage = coverImageURL;
            this.courseForm.patchValue({ coverImage: coverImageURL }); // Update the form control with the cover image URL
          } else if (typeof response === 'object' && response.coverImage) {
            // Handle the response when it's an object with a 'coverImage' property
            const coverImageURL = response.coverImage;
            console.log('Cover Image URL:', coverImageURL);
            this.selectedImage = coverImageURL;
            this.courseForm.patchValue({ coverImage: coverImageURL }); // Update the form control with the cover image URL
          } else {
            console.error('Invalid response format. Expected a string URL or an object with a "coverImage" property.');
          }
        },
        (error) => {
          console.error('Error uploading cover image:', error);
        }
      );
    }
  }
  
  
  
 

  deleteImage(coverImage: string): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this video?',
      header: 'Please confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // User confirmed, proceed with video deletion
        this.courseService.deleteCoverImage(coverImage).subscribe(
          (response) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'coverImage deleted successfully',
              life: 3000, 
              styleClass: 'success-message' 
            });
            this.clearInputField();
          },
          (error) => {
            // Handle any errors that occurred during video deletion
            console.error('Error deleting video:', error);
          }
        );
      },
      reject: () => {
        // User canceled, do nothing
      }
    });
  }

  clearInputField() {
    // Get the reference to the input field and clear its value
    const inputField: HTMLInputElement | null = document.querySelector('#coverImageInputField');
    if (inputField) {
      inputField.value = '';
    }
  }
  
  
  
  

  get sections(): FormArray {
    return this.curriculumForm.get('sections') as FormArray;
  }

  addSection() {
    const sections = this.curriculumForm.get('sections') as FormArray;
    sections.push(
      this.fb.group({
        title: new FormControl(''),
        lessons: this.fb.array([]),
      })
    );
  }

  removeSection(index: number): void {
    this.confirmationService.confirm({
      message: 'You are about to remove a curriculum item. Are you sure you want to continue?',
      header: 'Please confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // User confirmed, proceed with removal
        this.sections.removeAt(index);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `The section has been removed successfully.`,
          life: 3000, 
          styleClass: 'success-message' 
        });
      },
      reject: () => {
        // User canceled, do nothing
      }
    });
  }
  addLecture(section: AbstractControl) {
    const lessons = (section as FormGroup).get('lessons') as FormArray;
    const newLecture = this.fb.group({
      lectureTitle: this.fb.control(''),
      contentType: 'video',
      videoUrl: this.fb.control(''),
      duration: this.fb.control(''),
      pdfUrl: this.fb.control(''), // Initialize pdfUrl with an empty string
      videoUploadPercentage: this.fb.control('0%'),
      pdfUploadPercentage: this.fb.control('0%'),
      mcqs: this.fb.array([]),
    });
  
    // Subscribe to changes in the contentType control
    newLecture.get('contentType')?.valueChanges.subscribe((contentType) => {
      if (contentType !== 'video') {
        newLecture.get('pdfUrl')?.setValidators(Validators.required); // Set validator for pdfUrl
      } else {
        newLecture.get('pdfUrl')?.clearValidators(); // Clear validator for pdfUrl
      }
      newLecture.get('pdfUrl')?.updateValueAndValidity(); // Update validity status
    });
  
    lessons.push(newLecture);
  }
  

  getSectionTitle(section: AbstractControl): string {
    return section.get('title')?.value || '';
  }
  removeLecture(section: AbstractControl, lectureIndex: number): void {
    const lessons = (section as FormGroup).get('lessons') as FormArray;
  
    this.confirmationService.confirm({
      message: 'You are about to remove a curriculum item. Are you sure you want to continue?',
      header: 'Please confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // User confirmed, proceed with removal
        lessons.removeAt(lectureIndex);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `This lecture is being deleted. We'll let you know when the process is complete.`,
          life: 3000, 
          styleClass: 'success-message' 
        });
      },
      reject: () => {
        // User canceled, do nothing
      }
    });
  }
  

  getSectionHeader(section: AbstractControl): string {
    if (section instanceof FormGroup) {
      return `Section ${this.sections.controls.indexOf(section) + 1}: ${
        section.get('title')?.value || 'Untitled'
      }`;
    }
    return '';
  }

  getLectures(section: AbstractControl): FormArray {
    if (section instanceof FormGroup) {
      return (section as FormGroup).get('lessons') as FormArray;
    }
    return this.fb.array([]);
  }

  // Function to remove the success message after a delay
removeSuccessMessage() {
  setTimeout(() => {
    this.successMessages = []; 
  }, 2000); 
}
removeVideoSuccessMessage() {
  setTimeout(() => {
    this.successVideoMessages = []; 
  }, 2000); 
}



  

  onSubmit() {
    debugger
    // if (this.courseForm.valid && this.curriculumForm.valid) {
    // Create a new FormData object
    const formData = new FormData();

    // Append form data to the FormData object
    formData.append('title', this.courseForm.get('title')?.value);
    formData.append('category', this.courseForm.get('category')?.value);
    formData.append('subCategory', this.courseForm.get('subCategory')?.value);
    formData.append('level', this.courseForm.get('level')?.value);
    formData.append('courseDuration', this.courseForm.get('courseDuration')?.value);
    formData.append('subtitle', this.courseForm.get('subtitle')?.value);
    formData.append('tags', this.courseForm.get('tags')?.value);
    formData.append('price', this.courseForm.get('price')?.value);
    formData.append('description', this.courseForm.get('description')?.value);
     // Append the image file to the FormData object
     const coverImageURL = this.courseForm.get('coverImage')?.value;
     formData.append('coverImage', coverImageURL); 

    const instructorJson = JSON.stringify(this.courseForm.get('instructor')?.value);
    formData.append('instructor', instructorJson);
    // Append sections array to the FormData
    formData.append('sections',JSON.stringify(this.curriculumForm.value.sections));


    //Call the createCourse method of the CourseService to send the form data to the API
    this.courseService.createCourse(formData).subscribe(
      (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Course Created',
          detail: 'Course created successfully!',
        });
        // Reset the form after successful submission if needed
        this.courseForm.reset();
        this.curriculumForm.reset();
        this.currentStep = 0;
        localStorage.removeItem('courseDraft');
        this.router.navigate(['/dashboard/all-course']);
      },
      (error) => {
        console.error('Error creating course:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'An error occurred while creating the course. Please try again later.',
        });
      }
    );
    
  }

  nextStep(): void {
    if (this.currentStep < this.items.length - 1) {
      this.currentStep++;
    }
  }

  previousStep(): void {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }


  // getInstructorProfile() {
  //   this.instructorService.getInstructor(this.InstructorId).subscribe(
  //     (res: any) => {
  //       this.instructor = res;
  //       console.log(this.instructor);
  //       this.courseForm.patchValue({
  //         instructor: this.instructor,
  //       });
  //     },
  //     (error: any) => {
  //       console.error(error);
  //     }
  //   );
  // }
// Correctly declare the custom validator function
noConsecutiveSpacesValidator(control: AbstractControl): { [key: string]: boolean } | null {
  if (control.value && /\s{2,}/.test(control.value)) {
    return { consecutiveSpaces: true };
  }
  return null;
}



saveDraft() {
  // Collect the draft data to save
  const draftData = {
    courseFormData: this.courseForm.value,
    curriculumFormData: this.curriculumForm.value,
    currentStep: this.currentStep,
  };

  // Convert the draft data to a JSON string
  const draftDataJson = JSON.stringify(draftData);

  // Store the JSON string in local storage with a unique key
  localStorage.setItem('courseDraft', draftDataJson);

  // Save the draft data to your server using the courseService
  this.courseService.saveDraft(draftData).subscribe(
    (response) => {
      // Display a success message
      this.messageService.add({
        severity: 'success',
        summary: 'Draft Saved',
        detail: 'Your draft has been saved successfully!',
      });

      // Optionally, perform any additional actions after saving the draft if needed

      // Remove the success message after a delay
      this.removeSuccessMessage();
    },
    (error) => {
      // Handle any errors that occurred during the save process
      console.error('Error saving draft:', error);

      // Display an error message if needed
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'An error occurred while saving the draft. Please try again later.',
      });
    }
  );
}


loadDraft() {
  // Retrieve the draft data JSON string from local storage
  const draftDataJson = localStorage.getItem('courseDraft');

  if (draftDataJson) {
    // Parse the JSON string to get the draft data object
    const draftData = JSON.parse(draftDataJson);

    // Populate the courseForm and curriculumForm with the draft data
    this.courseForm.setValue(draftData.courseFormData);
    this.curriculumForm.setValue(draftData.curriculumFormData);
    this.currentStep = draftData.currentStep || 0; 
  }
}

}
