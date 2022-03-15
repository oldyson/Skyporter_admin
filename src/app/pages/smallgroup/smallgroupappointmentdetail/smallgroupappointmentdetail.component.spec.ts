import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmallgroupappointmentdetailComponent } from './smallgroupappointmentdetail.component';

describe('SmallgroupappointmentdetailComponent', () => {
	let component: SmallgroupappointmentdetailComponent;
	let fixture: ComponentFixture<SmallgroupappointmentdetailComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ SmallgroupappointmentdetailComponent ]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(SmallgroupappointmentdetailComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
