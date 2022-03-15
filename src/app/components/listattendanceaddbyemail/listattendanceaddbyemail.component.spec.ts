import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListattendanceaddbyemailComponent } from './listattendanceaddbyemail.component';

describe('ListattendanceaddbyemailComponent', () => {
  let component: ListattendanceaddbyemailComponent;
  let fixture: ComponentFixture<ListattendanceaddbyemailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListattendanceaddbyemailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListattendanceaddbyemailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
