import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpService } from './../../../http.service';
import { GlobalService } from './../../../global.service';
import { HelperService } from './../../../helper.service';
import {
	faCaretDown as fasCaretDown,
	faTimes as fasTimes
} from '@fortawesome/pro-solid-svg-icons';
import swal from 'sweetalert2';

@Component({
	selector: 'app-campaignpreview',
	templateUrl: './campaignpreview.component.html',
	styleUrls: ['./campaignpreview.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class CampaignpreviewComponent implements OnInit {

	public fasCaretDown = fasCaretDown;
	public fasTimes = fasTimes;
	public campaignId;
	public campaign;
	public testers = [{
		email: ''
	}];
	public delete;

	constructor(
		public activatedRoute: ActivatedRoute,
		public router: Router,
		public http: HttpService,
		public global: GlobalService,
		private helper: HelperService,
	) {
		const self = this;
		this.activatedRoute.queryParams.subscribe(params => {
			self.campaignId = params.id;
		});
	}

	ngOnInit(): void {
		if (this.campaignId != null) {
			this.getCampaignDetail();
		}
	}

	public getCampaignDetail(): void {
		const params = {
			id: this.campaignId
		};
		const self = this;
		this.http.sendGetRequest2('campaign/detail', params).subscribe((response: any) => {
			self.campaign = response.data.campaign;
			self.campaign.showdescription = true;
			self.campaign.created_at = self.helper.getDatetime(self.campaign.created_at);
		});
	}

	public toggleDescription(): void {
		this.campaign.showdescription = this.campaign.showdescription ? false : true;
	}

	public addRecipient(): void {
		this.testers.push({
			email: ''
		});
	}

	public removeRecipient(index: number): void {
		this.testers.splice(index, 1);
	}

	public sendTesting(): void {
		let emails = '';

		this.testers.forEach(($ii) => {
			if ($ii.email.length > 5) {
				if (emails !== '') {
					emails += ',';
				}
				emails += $ii.email;
			}
		});

		const params = {
			emails,
			id: this.campaignId
		};
		this.http.sendPostRequest2('campaign/singlesend', params).subscribe((response: any) => {
			if (response.api_status) {
				swal.fire({
					title: 'Success',
					text: 'Please check your email.',
					icon: 'success',
					confirmButtonText: 'OK'
				});
			}else{
				swal.fire({
					title: 'Error',
					text: 'Failed to send email',
					icon: 'warning',
					confirmButtonText: 'OK'
				});
			}
		}, (error: any) => {
			swal.fire({
				title: 'Error ' + error.status,
				text: 'Failed to send email',
				icon: 'warning',
				confirmButtonText: 'OK'
			});
		});
	}

	public publishCampaign(): void {
		const params = {
			id: this.campaignId
		};
		this.http.sendPostRequest2('campaign/publish', params).subscribe((response: any) => {
			if (response.api_status) {
				swal.fire({
					title: 'Success',
					text: 'DONE!!',
					icon: 'success',
					confirmButtonText: 'OK'
				});
			}else{
				swal.fire({
					title: 'Error',
					text: 'Failed to send email',
					icon: 'warning',
					confirmButtonText: 'OK'
				});
			}
		}, (error: any) => {
			swal.fire({
				title: 'Error ' + error.status,
				text: 'Failed to send email',
				icon: 'warning',
				confirmButtonText: 'OK'
			});
		});
	}

	public editCampaign(): void {
		const route = this.campaign.type === 'Email' ? 'email' : this.campaign.type === 'Notif' ? 'notif' : null;
		if (route == null) {
			alert('Campaign has no type.');
		}

		this.router.navigateByUrl('/admin/campaign/form?type=' + route + '&id=' + this.campaignId);
	}

}
