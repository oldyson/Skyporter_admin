import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardcustomqueryComponent } from './dashboardcustomquery.component';

describe('DashboardcustomqueryComponent', () => {
  let component: DashboardcustomqueryComponent;
  let fixture: ComponentFixture<DashboardcustomqueryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardcustomqueryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardcustomqueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
