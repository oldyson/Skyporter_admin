import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramcodeformComponent } from './programcodeform.component';

describe('ProgramcodeformComponent', () => {
	let component: ProgramcodeformComponent;
	let fixture: ComponentFixture<ProgramcodeformComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ ProgramcodeformComponent ]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ProgramcodeformComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
