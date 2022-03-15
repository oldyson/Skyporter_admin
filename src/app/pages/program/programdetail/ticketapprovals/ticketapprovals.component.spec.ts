import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketapprovalsComponent } from './ticketapprovals.component';

describe('TicketapprovalsComponent', () => {
  let component: TicketapprovalsComponent;
  let fixture: ComponentFixture<TicketapprovalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TicketapprovalsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketapprovalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
