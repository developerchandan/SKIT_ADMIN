import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorporateTrainingComponent } from './corporate-training.component';

describe('CorporateTrainingComponent', () => {
  let component: CorporateTrainingComponent;
  let fixture: ComponentFixture<CorporateTrainingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CorporateTrainingComponent]
    });
    fixture = TestBed.createComponent(CorporateTrainingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
