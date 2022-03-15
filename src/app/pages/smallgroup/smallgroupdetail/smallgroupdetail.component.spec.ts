import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmallgroupdetailComponent } from './smallgroupdetail.component';

describe('SmallgroupdetailComponent', () => {
  let component: SmallgroupdetailComponent;
  let fixture: ComponentFixture<SmallgroupdetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmallgroupdetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmallgroupdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
