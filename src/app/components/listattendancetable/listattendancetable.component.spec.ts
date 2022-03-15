import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListattendancetableComponent } from './listattendancetable.component';

describe('ListattendancetableComponent', () => {
	let component: ListattendancetableComponent;
	let fixture: ComponentFixture<ListattendancetableComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ ListattendancetableComponent ]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ListattendancetableComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
