import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmallgrouprequestComponent } from './smallgrouprequest.component';

describe('SmallgrouprequestComponent', () => {
  let component: SmallgrouprequestComponent;
  let fixture: ComponentFixture<SmallgrouprequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmallgrouprequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmallgrouprequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
