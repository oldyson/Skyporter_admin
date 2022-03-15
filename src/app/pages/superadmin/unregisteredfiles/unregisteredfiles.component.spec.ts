import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnregisteredfilesComponent } from './unregisteredfiles.component';

describe('UnregisteredfilesComponent', () => {
  let component: UnregisteredfilesComponent;
  let fixture: ComponentFixture<UnregisteredfilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnregisteredfilesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnregisteredfilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
