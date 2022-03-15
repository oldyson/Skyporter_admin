import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SgdiscipleshipjourneyComponent } from './sgdiscipleshipjourney.component';

describe('SgdiscipleshipjourneyComponent', () => {
  let component: SgdiscipleshipjourneyComponent;
  let fixture: ComponentFixture<SgdiscipleshipjourneyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SgdiscipleshipjourneyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SgdiscipleshipjourneyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
