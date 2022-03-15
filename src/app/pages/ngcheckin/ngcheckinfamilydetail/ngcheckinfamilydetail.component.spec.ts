import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgcheckinfamilydetailComponent } from './ngcheckinfamilydetail.component';

describe('NgcheckinfamilydetailComponent', () => {
	let component: NgcheckinfamilydetailComponent;
	let fixture: ComponentFixture<NgcheckinfamilydetailComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ NgcheckinfamilydetailComponent ]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(NgcheckinfamilydetailComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
