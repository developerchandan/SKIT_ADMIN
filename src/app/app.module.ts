import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { HomeComponent } from './shared/home/home.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { DashboardComponent } from './shared/dashboard/dashboard.component';
import { IndexComponent } from './shared/index/index.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './pages/service/auth.interceptor';
import { CategoriesFormComponent } from './pages/categories/categories-form/categories-form.component';
import { DropdownModule } from 'primeng/dropdown';
import {DialogModule} from 'primeng/dialog';
import {InputTextModule} from 'primeng/inputtext';
import {ToastModule} from 'primeng/toast';

import { CardModule } from 'primeng/card';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import {MultiSelectModule} from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ColorPickerModule } from 'primeng/colorpicker';
import { InputNumberModule } from 'primeng/inputnumber';
import { FieldsetModule } from 'primeng/fieldset';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputSwitchModule } from 'primeng/inputswitch';
import { EditorModule } from 'primeng/editor';
import { TagModule } from 'primeng/tag';
import {PasswordModule} from 'primeng/password';
import { InputMaskModule } from 'primeng/inputmask';
import { BrowserModule } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import { MessagesModule } from 'primeng/messages';
import { CourseDurationComponent } from './pages/categories/course-duration/course-duration.component';
import { CourseFormComponent } from './pages/course/course-form/course-form.component';
import { CourseListComponent } from './pages/course/course-list/course-list.component';
import { CourseLevelComponent } from './pages/categories/course-level/course-level.component';
import { EditCourseComponent } from './pages/course/edit-course/edit-course.component';
import { TooltipModule } from 'primeng/tooltip';
import { RatingModule } from 'primeng/rating';
import { SpeedDialModule } from 'primeng/speeddial';
import { DragDropModule } from 'primeng/dragdrop';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ChipsModule } from 'primeng/chips';
import { TabViewModule } from 'primeng/tabview';
import {CheckboxModule} from 'primeng/checkbox';
import {AccordionModule} from 'primeng/accordion';
import {CarouselModule} from 'primeng/carousel';
import { StepsModule } from 'primeng/steps';
import { FileUploadModule } from 'primeng/fileupload';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular'; 
import { ProgressBarModule } from 'primeng/progressbar';
import { BadgeModule } from 'primeng/badge';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { PanelModule } from 'primeng/panel';
import { BecomeInstructorComponent } from './pages/forms/become-instructor/become-instructor.component';
import { CorporateTrainingComponent } from './pages/forms/corporate-training/corporate-training.component';
import { H1bvisaComponent } from './pages/forms/h1bvisa/h1bvisa.component';
import { DemoComponent } from './pages/forms/demo/demo.component';
import { ContactUsComponent } from './pages/forms/contact-us/contact-us.component'; 

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    SidebarComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    IndexComponent,
    CategoriesFormComponent,
    CourseDurationComponent,
    CourseFormComponent,
    CourseListComponent,
    CourseLevelComponent,
    EditCourseComponent,
    BecomeInstructorComponent,
    CorporateTrainingComponent,
    H1bvisaComponent,
    DemoComponent,
    ContactUsComponent,
   
  
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    DropdownModule,
    DialogModule,
    InputTextModule,
    ToastModule,
    CardModule,
    TableModule,
    ToolbarModule,
    ButtonModule,
    ConfirmDialogModule,
    ColorPickerModule,
    InputNumberModule,
    InputTextareaModule,
    InputSwitchModule,
    EditorModule,
    TagModule,
    InputMaskModule,
    FieldsetModule,
    MultiSelectModule,
    PasswordModule,
    MessagesModule,
    CheckboxModule,
    FileUploadModule ,
    AccordionModule,
    CarouselModule,
    PanelModule,
    SpeedDialModule,
    DragDropModule,
    StepsModule,
    ProgressSpinnerModule,
    ProgressBarModule,
    CKEditorModule ,
    TooltipModule,
    RatingModule,
    BreadcrumbModule,
    ChipsModule,
    TabViewModule,
    BadgeModule,

  ],
  providers: [
    DatePipe,
    MessageService,
    ConfirmationService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
