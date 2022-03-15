import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddprogramhistoryComponent } from './addprogramhistory.component';

describe('AddprogramhistoryComponent', () => {
	let component: AddprogramhistoryComponent;
	let fixture: ComponentFixture<AddprogramhistoryComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ AddprogramhistoryComponent ]
		})
		.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(AddprogramhistoryComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
