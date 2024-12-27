import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Message, MessageService, ConfirmationService } from 'primeng/api';
import { Subscription, interval } from 'rxjs';
import { CourseService } from '../../service/course.service';

@Component({
  selector: 'app-edit-course',
  templateUrl: './edit-course.component.html',
  styleUrls: ['./edit-course.component.css']
})
export class EditCourseComponent {
  public Editor = ClassicEditor;
  public courseForm: FormGroup;
  private autoSaveInterval$!: Subscription;
  private ngUnsubscribe = new Subscription();
  public isAutoSaving: boolean = false;
  successMessages: Message[] = [];
  successVideoMessages:Message[]=[];
  courseLevel: any;
  curriculumForm!: FormGroup;
  isVideoAdded: boolean = false;
  isPdfAdded: boolean = false;
  isVideoUploaded: boolean = false;
  private isUploadingVideo: boolean = false; 
  private videoQueue: { section: AbstractControl; lectureIndex: number }[] = [];
  items: any[] = [{ label: 'Basic Information' }, { label: 'Curriculum' }];
  selectedImage!: string;
  getCategoryList!: any[]; 
  getSubCategoryList!: any[]; 
  selectedCategory: any;
  courseDuration:any;
  currentStep: number = 0;
  private courseId!: string;
  isVideoPlaying: boolean = false;
  videoSource: string | undefined;
  isDeletingVideo: boolean = false;
  
  playVideo(videoUrl: string | undefined) {
    if (videoUrl) {
      this.isVideoPlaying = true;
      this.videoSource = videoUrl;
    }
  }
  onVideoChecked(videoUrl: string | undefined) {
    if (videoUrl) {
    } else {
    }
  }
  stopVideo() {
    this.isVideoPlaying = false;
    this.videoSource = undefined;
  }
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute, 
    private courseService: CourseService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router:Router ,
    
    ) {
    this.courseForm = this.fb.group({
      title: ['', Validators.required],
      category: ['', Validators.required],
      subCategory: ['', Validators.required],
      level: ['', Validators.required],
      courseDuration:[''],
      coverImage: [''],
      subtitle: ['', Validators.required],
      tags: [[]],
      price: [''],
      description: ['', Validators.required],
    });
  }

  ngOnInit() {
    // Auto-save draft form data every 30 seconds
    this.autoSaveInterval$ = interval(300000).subscribe(() => {
      this.isAutoSaving = true;
      this.saveDraft();
      this.isAutoSaving = false;
    });

    // Retrieve the course ID from the route parameters
    this.route.params.subscribe((params) => {
      this.courseId = params['id'];
      if (this.courseId) {
        this.fetchCourseDetails(this.courseId);
      }
    });
    
    this.curriculumForm = this.fb.group({
      sections: this.fb.array([]),
    });
    this.getCategory();
    this.getSubCategory();
    this.getCourseLevel();
    this.getDuration();

  }
  getCategory() {
    this.courseService.getCategories().subscribe((res) => {
      this.getCategoryList = res;
     
    });
  }
  getSubCategory() {
    this.courseService.getSubCategories().subscribe((res) => {
      this.getSubCategoryList = res;
     
    });
  }
  getDuration() {
    this.courseService.getCourseDuration().subscribe((res) => {
      this.courseDuration = res;
      
    });
  }
  onCategoryChange(event: any) {
    const categoryId = event.value;
    this.selectedCategory = this.getCategoryList.find(cat => cat._id === categoryId);
    this.getSubCategoryList = this.selectedCategory ? this.selectedCategory.subcategories : [];
    this.courseForm.get('subCategory')?.setValue('');
  }
  getCourseLevel() {
    this.courseService.getCourseLevel().subscribe((res) => {
      this.courseLevel = res;
      
    });
  }
 

  ngOnDestroy() {
    this.autoSaveInterval$.unsubscribe();
  }

  fetchCourseDetails(courseId: string) {
    this.courseService.getCourseDetails(courseId).subscribe(
      (courseDetails: any) => {
        const course = courseDetails.data;
        
        const curriculumFormArray = this.curriculumForm.get('sections') as FormArray;
        curriculumFormArray.clear();
        
        this.courseForm.patchValue({
          title: course.title,
          category: course.category?._id,
          subCategory: course.subCategory?._id,
          level: course.level?._id,
          courseDuration: course.courseDuration?._id,
          coverImage: course.coverImage,
          subtitle: course.subtitle,
          tags: course.tags,
          price: course.price,
          description: course.description,
        });
  
        course.sections.forEach((section: any) => {
          const sectionGroup = this.fb.group({
            title: section.title,
            lessons: this.fb.array([]),
          });
  
          const lessonsFormArray = sectionGroup.get('lessons') as FormArray;
          section.lessons.forEach((lesson: any) => {
            const lessonGroup = this.fb.group({
              lectureTitle: lesson.lectureTitle,
              contentType: lesson.contentType,
              videoUrl: lesson.videoUrl,
              duration: lesson.duration,
              pdfUrl: lesson.pdfUrl,
              videoUploadPercentage: lesson.videoUploadPercentage,
              pdfUploadPercentage: lesson.pdfUploadPercentage,
              mcqs: this.fb.array([]),
            });

            
  
            const mcqsFormArray = lessonGroup.get('mcqs') as FormArray;
            if (lesson.mcqs) {
              lesson.mcqs.forEach((mcq: any) => {
                const mcqGroup = this.fb.group({
                  question: mcq.question,
                  correctAnswer: mcq.correctAnswer,
                  options: this.fb.array([]),
                });
  
                const optionsFormArray = mcqGroup.get('options') as FormArray;
                mcq.options.forEach((option: any) => {
                  const optionControl = this.fb.group({
                    optionText: option.optionText,
                    optionValue:option.optionValue,
                  });
                  optionsFormArray.push(optionControl);
                });
  
                mcqsFormArray.push(mcqGroup);
              });
            }
  
            lessonsFormArray.push(lessonGroup);
          });
  
          curriculumFormArray.push(sectionGroup);
        });
      },
      (error) => {
        console.error('Error fetching course details:', error);
      }
    );
  }
  

  
  onFileSelected(event: Event) {
   
    const inputElement = event.target as HTMLInputElement;
    if (inputElement?.files?.length) {
      const selectedFile = inputElement.files[0] as File;
      const formData = new FormData();
      formData.append('coverImage', selectedFile);
      formData.append('courseId', this.courseId); 
  
      this.courseService.updateCoverImage(this.courseId, formData).subscribe(
        (response: any) => {
          if (typeof response === 'string' || (typeof response === 'object' && response.coverImage)) {
            const coverImageURL = typeof response === 'string' ? response : response.coverImage;
            this.selectedImage = coverImageURL;
            this.courseForm.patchValue({ coverImage: coverImageURL }); 
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Cover image updated successfully' });
          } else {
            console.error('Invalid response format. Expected a string URL or an object with a "coverImage" property.');
          }
        },
        (error) => {
          console.error('Error updating cover image:', error);
        }
      );
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
      pdfUrl: this.fb.control(''), 
      videoUploadPercentage: this.fb.control('0%'),
      pdfUploadPercentage: this.fb.control('0%'),
      mcqs: this.fb.array([]),
    });
  
    newLecture.get('contentType')?.valueChanges.subscribe((contentType) => {
      if (contentType !== 'video') {
        newLecture.get('pdfUrl')?.setValidators(Validators.required); 
      } else {
        newLecture.get('pdfUrl')?.clearValidators(); 
      }
      newLecture.get('pdfUrl')?.updateValueAndValidity(); 
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



  addMCQQuestion(sectionIndex: number, lessonIndex: number) {
    const question = this.fb.group({
      question: ['', Validators.required],
      options: this.fb.array([this.createOptionControl(1)], Validators.required), 
      correctAnswer: ['', Validators.required]
    });
  
    const sections = this.curriculumForm.get('sections') as FormArray;
    const section = sections.at(sectionIndex) as FormGroup;
    const lessons = section.get('lessons') as FormArray;
    const lesson = lessons.at(lessonIndex) as FormGroup;
  
    // Check if 'mcqs' FormArray exists in 'lesson' FormGroup
    if (!lesson.get('mcqs')) {
      lesson.addControl('mcqs', this.fb.array([]));
    }
  
    const mcqs = lesson.get('mcqs') as FormArray;
    mcqs.push(question);
  }
  
  
  createOptionControl(optionValue: number): FormGroup {
    return this.fb.group({
      optionText: ['', Validators.required],
      optionValue: optionValue,
    });
  }
  
  addMCQOption(sectionIndex: number, lessonIndex: number, mcqIndex: number): void {
    const options = this.getMCQOptions(sectionIndex, lessonIndex, mcqIndex);
    options.push(this.createOptionControl(options.length + 1));
  }
  // Remove an MCQ option from a specific question
  removeMCQOption(sectionIndex: number, lessonIndex: number, mcqIndex: number, optionIndex: number) {
    
    const mcqs = this.getMCQQuestionsFormArray(sectionIndex, lessonIndex);
    if (mcqIndex >= 0 && mcqIndex < mcqs.length) {
      const question = mcqs.at(mcqIndex) as FormGroup;
      const options = question.get('options') as FormArray;
      if (optionIndex >= 0 && optionIndex < options.length) {
        options.removeAt(optionIndex);
      }
    }
  }

  removeMCQQuestion(sectionIndex: number, lessonIndex: number, mcqIndex: number) {
    const sections = this.curriculumForm.get('sections') as FormArray;
    const section = sections.at(sectionIndex) as FormGroup;
    const lessons = section.get('lessons') as FormArray;
    const lesson = lessons.at(lessonIndex) as FormGroup;
    const mcqs = lesson.get('mcqs') as FormArray;
    mcqs.removeAt(mcqIndex);
  }
  getMCQQuestionsFormArray(sectionIndex: number, lessonIndex: number): FormArray {
    const sections = this.curriculumForm.get('sections') as FormArray;
    const section = sections.at(sectionIndex) as FormGroup;
    const lessons = section.get('lessons') as FormArray;
    const lesson = lessons.at(lessonIndex) as FormGroup;
    return lesson.get('mcqs') as FormArray;
  }

  
  getMCQQuestions(sectionIndex: number, lessonIndex: number): FormArray {
    const sections = this.curriculumForm.get('sections') as FormArray;
    const section = sections.at(sectionIndex) as FormGroup;
    const lessons = section.get('lessons') as FormArray;
    const lesson = lessons.at(lessonIndex) as FormGroup;
    return lesson.get('mcqs') as FormArray;
  }
  
  getMCQOptions(sectionIndex: number, lessonIndex: number, mcqIndex: number): FormArray {
    const mcqs = this.getMCQQuestions(sectionIndex, lessonIndex);
    const question = mcqs.at(mcqIndex) as FormGroup;
    return question.get('options') as FormArray;
  }
  
getMCQOptionCount(sectionIndex: number, lessonIndex: number, mcqIndex: number): number {
  const options = this.getMCQOptions(sectionIndex, lessonIndex, mcqIndex);
  return options.length;
}

 onVideoChange(event: any, control: AbstractControl | null, section: AbstractControl, lectureIndex: number): void {
  const file = event.target.files[0];
  if (control instanceof AbstractControl) {
    control.patchValue(file);
    this.isVideoAdded = true;
    if (this.isUploadingVideo) {
      this.videoQueue.push({ section, lectureIndex });
    } else {
      this.uploadVideo(section, lectureIndex);
    }
  }
}

private uploadVideo(section: AbstractControl, lectureIndex: number): void {
 
  const lecture = (section.get('lessons') as FormArray).at(lectureIndex) as FormGroup;
  const file = lecture.get('videoUrl')?.value;
  this.courseService.uploadVideo(file).subscribe(
    (event: HttpEvent<any>) => {
      if (event.type === HttpEventType.UploadProgress) {
        const progress = Math.round((100 * event.loaded) / (event.total || 1));
        this.setVideoUploadPercentage(section, lectureIndex, `${progress}%`);
      } else if (event.type === HttpEventType.Response) {

        if (event.body && event.body.videoUrl) {
          lecture.get('videoUrl')?.setValue(event.body.videoUrl);
          lecture.get('duration')?.setValue(event.body.duration);

          if (event.body.videoName) {
            lecture.get('videoName')?.setValue(event.body.videoName);
          }
          if (event.body.videoType) {
            lecture.get('videoType')?.setValue(event.body.videoType);
          }

          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Video uploaded successfully',
          });
        }
      }
    },
    (error) => {
      console.error('Error occurred while uploading video to server:', error);
    },
    () => {
     
      this.isUploadingVideo = false;
      if (this.videoQueue.length > 0) {
        const { section, lectureIndex } = this.videoQueue.shift()!;
        this.uploadVideo(section, lectureIndex);
      }
    }
  );
}

  setVideoUploadPercentage( section: AbstractControl, lectureIndex: number, percentage: string): void {
    const lecture = (section.get('lessons') as FormArray).at(lectureIndex) as FormGroup;
    lecture.get('videoUploadPercentage')?.setValue(percentage);
  }

  getVideoUploadPercentage(
    section: AbstractControl,
    lectureIndex: number
  ): string {
   
    const lecture = (section.get('lessons') as FormArray).at(
      lectureIndex
    ) as FormGroup;
    const videoUploadPercentageControl = lecture.get('videoUploadPercentage');

    if (videoUploadPercentageControl?.value) {
      return videoUploadPercentageControl.value;
    } else {
      return '0%';
    }
  }

  getVideoUploadProgressBarColor(percentage: string): string {
   
    const numericPercentage = parseInt(percentage, 10);
    if (numericPercentage < 25) {
      return 'red';
    } else if (numericPercentage < 50) {
      return 'orange';
    } else if (numericPercentage < 75) {
      return 'yellow';
    } else {
      return 'green';
    }
  }

  getVideoUploadPercentages(section: AbstractControl, lectureIndex: number): number {
    const percentage = parseInt(this.getVideoUploadPercentage(section, lectureIndex), 10);
    return isNaN(percentage) ? 0 : percentage;
  }

  deleteVideo(videoUrl: string): void {
    if (this.isDeletingVideo) {
      return;
    }
  
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this video?',
      header: 'Please confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.courseService.deleteVideo(videoUrl).subscribe(
          (response) => {
            this.isDeletingVideo = true; 
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Video deleted successfully',
              life: 3000,
              styleClass: 'success-message',
            });
          },
          (error) => {
            console.error('Error deleting video:', error);
          }
        );
      },
      reject: () => {
      
      },
    });
  }
 
  onPdfChange(event: any, control: AbstractControl | null, section: AbstractControl, lectureIndex: number): void {
    const file = event.target.files[0];
    if (control instanceof AbstractControl) {
      control.patchValue(file);
      this.isPdfAdded = true;
  
      this.courseService.uploadPdf(file).subscribe(
        (event: HttpEvent<any>) => {
          if (event.type === HttpEventType.UploadProgress) {
            const progress = Math.round((100 * event.loaded) / (event.total || 1));
            this.setPdfUploadPercentage(section, lectureIndex, `${progress}%`);
          } else if (event.type === HttpEventType.Response) {

            if (event.body && event.body.pdfUrl) {
              const lecture = (section.get('lessons') as FormArray).at(lectureIndex) as FormGroup;
              lecture.get('pdfUrl')?.setValue(event.body.pdfUrl);
  
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'PDF uploaded successfully',
              });
            }
          }
        },
        (error) => {
         
          console.error('Error occurred while uploading PDF to server:', error);
        }
      );
    }
  }

  setPdfUploadPercentage(section: AbstractControl,lectureIndex: number,percentage: string): void {
    const lecture = (section.get('lessons') as FormArray).at(
      lectureIndex
    ) as FormGroup;
    lecture.get('pdfUploadPercentage')?.setValue(percentage);
  }

  getPdfUploadPercentage(section: AbstractControl,lectureIndex: number): string {
    const lecture = (section.get('lessons') as FormArray).at(
      lectureIndex
    ) as FormGroup;
    const pdfUploadPercentageControl = lecture.get('pdfUploadPercentage');

    if (pdfUploadPercentageControl?.value) {
      return pdfUploadPercentageControl.value;
    } else {
      return '0%';
    }
  }

  getPdfUploadProgressBarColor(percentage: string): string {
    debugger
    const numericPercentage = parseInt(percentage, 10);
    switch (numericPercentage) {
      case 0:
        return 'red';
      case 25:
        return 'orange';
      case 50:
        return 'yellow';
      case 75:
        return 'green';
      default:
        return 'grey';
    }
  }
  

  
  deletePdf(pdfUrl: string) {
    debugger
    this.courseService.deletePdf(pdfUrl).subscribe(
      (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'PDF deleted successfully',
        });
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to delete PDF',
        });
      }
    );
  }

  onUpdateCourse() {
      const updatedCourse = {
        title: this.courseForm.get('title')?.value,
        category: this.courseForm.get('category')?.value,
        subCategory: this.courseForm.get('subCategory')?.value,
        level: this.courseForm.get('level')?.value,
        courseDuration: this.courseForm.get('courseDuration')?.value,
        coverImage: this.courseForm.get('coverImage')?.value,
        subtitle: this.courseForm.get('subtitle')?.value,
        tags: this.courseForm.get('tags')?.value,
        price: this.courseForm.get('price')?.value,
        description: this.courseForm.get('description')?.value,
        sections: this.curriculumForm.get('sections')?.value,
      };
  
      this.courseService.updateCourse(this.courseId, updatedCourse).subscribe(
        (response) => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Course updated successfully' });
          this.router.navigate(['/dashboard/all-course'])
        },
        (error) => {
          console.error('Error updating course:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error updating course' });
        }
      );
   
  }
  getpdfUploadPercentages(section: AbstractControl, lectureIndex: number): number {
    const percentage = parseInt(this.getPdfUploadPercentage(section, lectureIndex), 10);
    return isNaN(percentage) ? 0 : percentage;
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


  saveDraft() {
    const draftData = {
      courseFormData: this.courseForm.value,
      curriculumFormData: this.curriculumForm.value,
      currentStep: this.currentStep,
    };
  
    const draftDataJson = JSON.stringify(draftData);
    localStorage.setItem('courseDraft', draftDataJson);
    this.courseService.saveDraft(draftData).subscribe(
      (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Draft Saved',
          detail: 'Your draft has been saved successfully!',
        });
        this.removeSuccessMessage();
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'An error occurred while saving the draft. Please try again later.',
        });
      }
    );
  }
  
  removeSuccessMessage() {
    setTimeout(() => {
      this.successMessages = []; 
    }, 2000); 
  }

  loadDraft() {
    const draftDataJson = localStorage.getItem('courseDraft');
  
    if (draftDataJson) {
      const draftData = JSON.parse(draftDataJson);
      this.courseForm.setValue(draftData.courseFormData);
      this.curriculumForm.setValue(draftData.curriculumFormData);
      this.currentStep = draftData.currentStep || 0; 
    }
  }
}
