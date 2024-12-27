import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseDurationComponent } from './course-duration.component';

describe('CourseDurationComponent', () => {
  let component: CourseDurationComponent;
  let fixture: ComponentFixture<CourseDurationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CourseDurationComponent]
    });
    fixture = TestBed.createComponent(CourseDurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
