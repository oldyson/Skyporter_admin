import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramcodelistComponent } from './programcodelist.component';

describe('ProgramcodelistComponent', () => {
	let component: ProgramcodelistComponent;
	let fixture: ComponentFixture<ProgramcodelistComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ ProgramcodelistComponent ]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ProgramcodelistComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
