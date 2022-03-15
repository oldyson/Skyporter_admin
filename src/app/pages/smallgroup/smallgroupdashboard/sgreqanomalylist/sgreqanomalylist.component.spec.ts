import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SgreqanomalylistComponent } from './sgreqanomalylist.component';

describe('SgreqanomalylistComponent', () => {
  let component: SgreqanomalylistComponent;
  let fixture: ComponentFixture<SgreqanomalylistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SgreqanomalylistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SgreqanomalylistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
