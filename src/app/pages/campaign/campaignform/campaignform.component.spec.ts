import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignformComponent } from './campaignform.component';

describe('CampaignformComponent', () => {
	let component: CampaignformComponent;
	let fixture: ComponentFixture<CampaignformComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ CampaignformComponent ]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(CampaignformComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
