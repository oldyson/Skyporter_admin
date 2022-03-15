import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillinglistComponent } from './billinglist.component';

describe('BillinglistComponent', () => {
  let component: BillinglistComponent;
  let fixture: ComponentFixture<BillinglistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillinglistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BillinglistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
