import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramdiagrampopupComponent } from './programdiagrampopup.component';

describe('ProgramdiagrampopupComponent', () => {
  let component: ProgramdiagrampopupComponent;
  let fixture: ComponentFixture<ProgramdiagrampopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProgramdiagrampopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgramdiagrampopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
