import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserlistroleComponent } from './userlistrole.component';

describe('UserlistroleComponent', () => {
  let component: UserlistroleComponent;
  let fixture: ComponentFixture<UserlistroleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserlistroleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserlistroleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
