import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramformComponent } from './programform.component';

describe('ProgramformComponent', () => {
	let component: ProgramformComponent;
	let fixture: ComponentFixture<ProgramformComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ ProgramformComponent ]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ProgramformComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
