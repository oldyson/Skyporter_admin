import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignlistnotifComponent } from './campaignlistnotif.component';

describe('CampaignlistnotifComponent', () => {
	let component: CampaignlistnotifComponent;
	let fixture: ComponentFixture<CampaignlistnotifComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ CampaignlistnotifComponent ]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(CampaignlistnotifComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
