import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransfermemberComponent } from './transfermember.component';

describe('TransfermemberComponent', () => {
  let component: TransfermemberComponent;
  let fixture: ComponentFixture<TransfermemberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransfermemberComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransfermemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
