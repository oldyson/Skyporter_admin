import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignpreviewComponent } from './campaignpreview.component';

describe('CampaignpreviewComponent', () => {
	let component: CampaignpreviewComponent;
	let fixture: ComponentFixture<CampaignpreviewComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ CampaignpreviewComponent ]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(CampaignpreviewComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
