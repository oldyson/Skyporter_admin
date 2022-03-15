import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinistrydetailComponent } from './ministrydetail.component';

describe('MinistrydetailComponent', () => {
	let component: MinistrydetailComponent;
	let fixture: ComponentFixture<MinistrydetailComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ MinistrydetailComponent ]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(MinistrydetailComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
