import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmallgroupdashboardComponent } from './smallgroupdashboard.component';

describe('SmallgroupdashboardComponent', () => {
  let component: SmallgroupdashboardComponent;
  let fixture: ComponentFixture<SmallgroupdashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmallgroupdashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmallgroupdashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
