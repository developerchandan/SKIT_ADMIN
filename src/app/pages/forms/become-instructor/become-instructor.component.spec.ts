import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BecomeInstructorComponent } from './become-instructor.component';

describe('BecomeInstructorComponent', () => {
  let component: BecomeInstructorComponent;
  let fixture: ComponentFixture<BecomeInstructorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BecomeInstructorComponent]
    });
    fixture = TestBed.createComponent(BecomeInstructorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
