import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardusageComponent } from './dashboardusage.component';

describe('DashboardusageComponent', () => {
  let component: DashboardusageComponent;
  let fixture: ComponentFixture<DashboardusageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardusageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardusageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
