import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmallgroupotherexportComponent } from './smallgroupotherexport.component';

describe('SmallgroupotherexportComponent', () => {
	let component: SmallgroupotherexportComponent;
	let fixture: ComponentFixture<SmallgroupotherexportComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ SmallgroupotherexportComponent ]
		})
		.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(SmallgroupotherexportComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
