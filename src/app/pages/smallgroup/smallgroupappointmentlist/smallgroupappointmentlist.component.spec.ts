import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmallgroupappointmentlistComponent } from './smallgroupappointmentlist.component';

describe('SmallgroupappointmentlistComponent', () => {
	let component: SmallgroupappointmentlistComponent;
	let fixture: ComponentFixture<SmallgroupappointmentlistComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ SmallgroupappointmentlistComponent ]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(SmallgroupappointmentlistComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
