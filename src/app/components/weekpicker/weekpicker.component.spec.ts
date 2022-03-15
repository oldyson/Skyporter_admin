import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeekpickerComponent } from './weekpicker.component';

describe('WeekpickerComponent', () => {
  let component: WeekpickerComponent;
  let fixture: ComponentFixture<WeekpickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WeekpickerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeekpickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
