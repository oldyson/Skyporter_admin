import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PercenttoggleComponent } from './percenttoggle.component';

describe('PercenttoggleComponent', () => {
	let component: PercenttoggleComponent;
	let fixture: ComponentFixture<PercenttoggleComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ PercenttoggleComponent ]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(PercenttoggleComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
