import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassregistrantComponent } from './classregistrant.component';

describe('ClassregistrantComponent', () => {
	let component: ClassregistrantComponent;
	let fixture: ComponentFixture<ClassregistrantComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ ClassregistrantComponent ]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ClassregistrantComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
