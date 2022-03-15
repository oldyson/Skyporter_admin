import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PraiselistComponent } from './praiselist.component';

describe('PraiselistComponent', () => {
	let component: PraiselistComponent;
	let fixture: ComponentFixture<PraiselistComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ PraiselistComponent ]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(PraiselistComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
