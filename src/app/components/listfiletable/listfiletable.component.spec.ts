import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListfiletableComponent } from './listfiletable.component';

describe('ListfiletableComponent', () => {
  let component: ListfiletableComponent;
  let fixture: ComponentFixture<ListfiletableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListfiletableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListfiletableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
