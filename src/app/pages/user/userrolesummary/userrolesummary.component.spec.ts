import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserrolesummaryComponent } from './userrolesummary.component';

describe('UserrolesummaryComponent', () => {
	let component: UserrolesummaryComponent;
	let fixture: ComponentFixture<UserrolesummaryComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ UserrolesummaryComponent ]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(UserrolesummaryComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
