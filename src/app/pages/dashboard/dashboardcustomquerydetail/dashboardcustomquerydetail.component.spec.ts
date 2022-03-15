import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardcustomquerydetailComponent } from './dashboardcustomquerydetail.component';

describe('DashboardcustomquerydetailComponent', () => {
  let component: DashboardcustomquerydetailComponent;
  let fixture: ComponentFixture<DashboardcustomquerydetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardcustomquerydetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardcustomquerydetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
