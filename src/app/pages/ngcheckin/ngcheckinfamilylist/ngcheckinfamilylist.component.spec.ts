import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgcheckinfamilylistComponent } from './ngcheckinfamilylist.component';

describe('NgcheckinfamilylistComponent', () => {
	let component: NgcheckinfamilylistComponent;
	let fixture: ComponentFixture<NgcheckinfamilylistComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ NgcheckinfamilylistComponent ]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(NgcheckinfamilylistComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
