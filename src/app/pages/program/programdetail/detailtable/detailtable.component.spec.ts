import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailtableComponent } from './detailtable.component';

describe('DetailtableComponent', () => {
	let component: DetailtableComponent;
	let fixture: ComponentFixture<DetailtableComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ DetailtableComponent ]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(DetailtableComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
