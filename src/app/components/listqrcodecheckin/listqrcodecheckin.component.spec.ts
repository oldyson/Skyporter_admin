import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListqrcodecheckinComponent } from './listqrcodecheckin.component';

describe('ListqrcodecheckinComponent', () => {
	let component: ListqrcodecheckinComponent;
	let fixture: ComponentFixture<ListqrcodecheckinComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ ListqrcodecheckinComponent ]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ListqrcodecheckinComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
