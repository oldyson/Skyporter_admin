import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardattendanceComponent } from './dashboardattendance.component';

describe('DashboardattendanceComponent', () => {
  let component: DashboardattendanceComponent;
  let fixture: ComponentFixture<DashboardattendanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardattendanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardattendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
