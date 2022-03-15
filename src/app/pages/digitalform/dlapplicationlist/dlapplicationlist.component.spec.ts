import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DlapplicationlistComponent } from './dlapplicationlist.component';

describe('DlapplicationlistComponent', () => {
	let component: DlapplicationlistComponent;
	let fixture: ComponentFixture<DlapplicationlistComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ DlapplicationlistComponent ]
		})
		.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(DlapplicationlistComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
