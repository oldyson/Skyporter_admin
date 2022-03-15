import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinistryformComponent } from './ministryform.component';

describe('MinistryformComponent', () => {
	let component: MinistryformComponent;
	let fixture: ComponentFixture<MinistryformComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ MinistryformComponent ]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(MinistryformComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
