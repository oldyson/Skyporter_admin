import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmallgrouplistComponent } from './smallgrouplist.component';

describe('SmallgrouplistComponent', () => {
  let component: SmallgrouplistComponent;
  let fixture: ComponentFixture<SmallgrouplistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmallgrouplistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmallgrouplistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
