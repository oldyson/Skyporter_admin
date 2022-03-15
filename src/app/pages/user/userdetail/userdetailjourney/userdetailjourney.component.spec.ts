import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserdetailjourneyComponent } from './userdetailjourney.component';

describe('UserdetailjourneyComponent', () => {
  let component: UserdetailjourneyComponent;
  let fixture: ComponentFixture<UserdetailjourneyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserdetailjourneyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserdetailjourneyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
