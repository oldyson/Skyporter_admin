import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserfamilylistComponent } from './userfamilylist.component';

describe('UserfamilylistComponent', () => {
	let component: UserfamilylistComponent;
	let fixture: ComponentFixture<UserfamilylistComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ UserfamilylistComponent ]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(UserfamilylistComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
