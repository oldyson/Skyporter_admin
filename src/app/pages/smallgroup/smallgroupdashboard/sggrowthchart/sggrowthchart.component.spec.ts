import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SggrowthchartComponent } from './sggrowthchart.component';

describe('SggrowthchartComponent', () => {
  let component: SggrowthchartComponent;
  let fixture: ComponentFixture<SggrowthchartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SggrowthchartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SggrowthchartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
