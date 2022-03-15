import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UseractiontableComponent } from './useractiontable.component';

describe('UseractiontableComponent', () => {
	let component: UseractiontableComponent;
	let fixture: ComponentFixture<UseractiontableComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ UseractiontableComponent ]
		})
		.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(UseractiontableComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
