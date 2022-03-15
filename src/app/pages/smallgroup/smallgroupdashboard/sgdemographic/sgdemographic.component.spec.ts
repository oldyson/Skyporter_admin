import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SgdemographicComponent } from './sgdemographic.component';

describe('SgdemographicComponent', () => {
  let component: SgdemographicComponent;
  let fixture: ComponentFixture<SgdemographicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SgdemographicComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SgdemographicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
