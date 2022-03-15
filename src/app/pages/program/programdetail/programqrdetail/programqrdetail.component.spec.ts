import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramqrdetailComponent } from './programqrdetail.component';

describe('ProgramqrdetailComponent', () => {
  let component: ProgramqrdetailComponent;
  let fixture: ComponentFixture<ProgramqrdetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProgramqrdetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgramqrdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
