import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserdetailprogramComponent } from './userdetailprogram.component';

describe('UserdetailprogramComponent', () => {
  let component: UserdetailprogramComponent;
  let fixture: ComponentFixture<UserdetailprogramComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserdetailprogramComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserdetailprogramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
