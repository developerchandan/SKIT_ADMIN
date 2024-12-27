import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './shared/home/home.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { DashboardComponent } from './shared/dashboard/dashboard.component';
import { PageGuard } from './pages/service/page.guard';
import { CategoriesFormComponent } from './pages/categories/categories-form/categories-form.component';
import { CourseDurationComponent } from './pages/categories/course-duration/course-duration.component';
import { CourseFormComponent } from './pages/course/course-form/course-form.component';
import { CourseLevelComponent } from './pages/categories/course-level/course-level.component';
import { CourseListComponent } from './pages/course/course-list/course-list.component';
import { EditCourseComponent } from './pages/course/edit-course/edit-course.component';
import { BecomeInstructorComponent } from './pages/forms/become-instructor/become-instructor.component';
import { H1bvisaComponent } from './pages/forms/h1bvisa/h1bvisa.component';
import { CorporateTrainingComponent } from './pages/forms/corporate-training/corporate-training.component';
import { DemoComponent } from './pages/forms/demo/demo.component';
import { ContactUsComponent } from './pages/forms/contact-us/contact-us.component';

const routes: Routes = [
  {path:'', component:LoginComponent},
  {path:'sign-up', component:RegisterComponent},


  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate:[PageGuard],

    children: [
      { path: '', component: HomeComponent },
      {path:'add-category', component:CategoriesFormComponent},
      {path:'course-duration', component:CourseDurationComponent},
      {path:'course-level', component:CourseLevelComponent},
      {path:'add-course', component:CourseFormComponent},
      {path:'all-course', component:CourseListComponent},
      {path:'course/:id', component:EditCourseComponent},
      {path:'becomeInstructor', component:BecomeInstructorComponent},
      {path:'h1bvisa', component:H1bvisaComponent},
      {path:'corporateTraining', component:CorporateTrainingComponent},
      {path:'registration-for-demo', component:DemoComponent},
      {path:'contact', component:ContactUsComponent},

      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{ useHash: true }),],
  exports: [RouterModule]
})
export class AppRoutingModule { }
