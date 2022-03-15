import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramdetailComponent } from './programdetail.component';

describe('ProgramdetailComponent', () => {
	let component: ProgramdetailComponent;
	let fixture: ComponentFixture<ProgramdetailComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ ProgramdetailComponent ]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ProgramdetailComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
