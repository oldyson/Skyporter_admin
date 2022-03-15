import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserlistroletableComponent } from './userlistroletable.component';

describe('UserlistroletableComponent', () => {
  let component: UserlistroletableComponent;
  let fixture: ComponentFixture<UserlistroletableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserlistroletableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserlistroletableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
