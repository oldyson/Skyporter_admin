import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmallgroupformComponent } from './smallgroupform.component';

describe('SmallgroupformComponent', () => {
  let component: SmallgroupformComponent;
  let fixture: ComponentFixture<SmallgroupformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmallgroupformComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmallgroupformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
