import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SgrolesComponent } from './sgroles.component';

describe('SgrolesComponent', () => {
	let component: SgrolesComponent;
	let fixture: ComponentFixture<SgrolesComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ SgrolesComponent ]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(SgrolesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
