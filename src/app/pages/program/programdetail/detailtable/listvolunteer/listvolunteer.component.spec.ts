import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListvolunteerComponent } from './listvolunteer.component';

describe('ListvolunteerComponent', () => {
  let component: ListvolunteerComponent;
  let fixture: ComponentFixture<ListvolunteerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListvolunteerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListvolunteerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
