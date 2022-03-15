import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserprogramhistoryComponent } from './userprogramhistory.component';

describe('UserprogramhistoryComponent', () => {
  let component: UserprogramhistoryComponent;
  let fixture: ComponentFixture<UserprogramhistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserprogramhistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserprogramhistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
