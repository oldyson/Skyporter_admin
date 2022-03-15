import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinistrylistComponent } from './ministrylist.component';

describe('MinistrylistComponent', () => {
	let component: MinistrylistComponent;
	let fixture: ComponentFixture<MinistrylistComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ MinistrylistComponent ]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(MinistrylistComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
