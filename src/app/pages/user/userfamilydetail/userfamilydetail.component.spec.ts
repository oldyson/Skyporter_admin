import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserfamilydetailComponent } from './userfamilydetail.component';

describe('UserfamilydetailComponent', () => {
	let component: UserfamilydetailComponent;
	let fixture: ComponentFixture<UserfamilydetailComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ UserfamilydetailComponent ]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(UserfamilydetailComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
