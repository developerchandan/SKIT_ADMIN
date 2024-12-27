import { ComponentFixture, TestBed } from '@angular/core/testing';

import { H1bvisaComponent } from './h1bvisa.component';

describe('H1bvisaComponent', () => {
  let component: H1bvisaComponent;
  let fixture: ComponentFixture<H1bvisaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [H1bvisaComponent]
    });
    fixture = TestBed.createComponent(H1bvisaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
