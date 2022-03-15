import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitevolunteerComponent } from './invitevolunteer.component';

describe('InvitevolunteerComponent', () => {
  let component: InvitevolunteerComponent;
  let fixture: ComponentFixture<InvitevolunteerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvitevolunteerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvitevolunteerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
