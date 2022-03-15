import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgcheckinfamilyformComponent } from './ngcheckinfamilyform.component';

describe('NgcheckinfamilyformComponent', () => {
	let component: NgcheckinfamilyformComponent;
	let fixture: ComponentFixture<NgcheckinfamilyformComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ NgcheckinfamilyformComponent ]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(NgcheckinfamilyformComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
