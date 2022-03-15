import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardinputsundayComponent } from './dashboardinputsunday.component';

describe('DashboardinputsundayComponent', () => {
	let component: DashboardinputsundayComponent;
	let fixture: ComponentFixture<DashboardinputsundayComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ DashboardinputsundayComponent ]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(DashboardinputsundayComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
