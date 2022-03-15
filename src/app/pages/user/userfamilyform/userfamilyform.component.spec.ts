import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserfamilyformComponent } from './userfamilyform.component';

describe('UserfamilyformComponent', () => {
	let component: UserfamilyformComponent;
	let fixture: ComponentFixture<UserfamilyformComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ UserfamilyformComponent ]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(UserfamilyformComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
