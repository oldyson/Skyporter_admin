import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SganomalycountComponent } from './sganomalycount.component';

describe('SganomalycountComponent', () => {
  let component: SganomalycountComponent;
  let fixture: ComponentFixture<SganomalycountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SganomalycountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SganomalycountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
