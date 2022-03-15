import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserdetailinfoComponent } from './userdetailinfo.component';

describe('UserdetailinfoComponent', () => {
  let component: UserdetailinfoComponent;
  let fixture: ComponentFixture<UserdetailinfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserdetailinfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserdetailinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
