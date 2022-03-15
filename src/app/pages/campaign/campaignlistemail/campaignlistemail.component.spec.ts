import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignlistemailComponent } from './campaignlistemail.component';

describe('CampaignlistemailComponent', () => {
	let component: CampaignlistemailComponent;
	let fixture: ComponentFixture<CampaignlistemailComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ CampaignlistemailComponent ]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(CampaignlistemailComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
