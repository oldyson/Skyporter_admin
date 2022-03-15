import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrayerpraisehistoryComponent } from './prayerpraisehistory.component';

describe('PrayerpraisehistoryComponent', () => {
	let component: PrayerpraisehistoryComponent;
	let fixture: ComponentFixture<PrayerpraisehistoryComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ PrayerpraisehistoryComponent ]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(PrayerpraisehistoryComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
