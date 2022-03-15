import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListtableComponent } from './listtable.component';

describe('ListtableComponent', () => {
	let component: ListtableComponent;
	let fixture: ComponentFixture<ListtableComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ ListtableComponent ]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ListtableComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
