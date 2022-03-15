import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SundaytableComponent } from './sundaytable.component';

describe('SundaytableComponent', () => {
	let component: SundaytableComponent;
	let fixture: ComponentFixture<SundaytableComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ SundaytableComponent ]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(SundaytableComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
