import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DlapplicationdetailComponent } from './dlapplicationdetail.component';

describe('DlapplicationdetailComponent', () => {
	let component: DlapplicationdetailComponent;
	let fixture: ComponentFixture<DlapplicationdetailComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ DlapplicationdetailComponent ]
		})
		.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(DlapplicationdetailComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
