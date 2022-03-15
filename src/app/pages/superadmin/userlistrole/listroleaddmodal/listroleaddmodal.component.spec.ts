import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListroleaddmodalComponent } from './listroleaddmodal.component';

describe('ListroleaddmodalComponent', () => {
  let component: ListroleaddmodalComponent;
  let fixture: ComponentFixture<ListroleaddmodalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListroleaddmodalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListroleaddmodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
