import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsfeedlistComponent } from './newsfeedlist.component';

describe('NewsfeedlistComponent', () => {
	let component: NewsfeedlistComponent;
	let fixture: ComponentFixture<NewsfeedlistComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ NewsfeedlistComponent ]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(NewsfeedlistComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
