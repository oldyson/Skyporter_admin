import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsfeedformComponent } from './newsfeedform.component';

describe('NewsfeedformComponent', () => {
  let component: NewsfeedformComponent;
  let fixture: ComponentFixture<NewsfeedformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewsfeedformComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsfeedformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
