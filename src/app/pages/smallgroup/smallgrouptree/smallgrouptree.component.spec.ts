import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmallgrouptreeComponent } from './smallgrouptree.component';

describe('SmallgrouptreeComponent', () => {
  let component: SmallgrouptreeComponent;
  let fixture: ComponentFixture<SmallgrouptreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmallgrouptreeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmallgrouptreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
