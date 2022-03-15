import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SimplemdeComponent } from 'ngx-simplemde';
import { markdown } from 'markdown';
import { HttpService } from './../../../http.service';
import { GlobalService } from './../../../global.service';
import { HelperService } from './../../../helper.service';
import { PopupModalComponent } from './../../../components/popup-modal/popup-modal.component';
import {
	faCaretDown as fasCaretDown,
	faTimes as fasTimes
} from '@fortawesome/pro-solid-svg-icons';
import {
	faEye as farEye,
	faEyeSlash as farEyeSlash
} from '@fortawesome/pro-regular-svg-icons';
import {} from 'jquery';
import TurndownService from 'turndown';
import swal from 'sweetalert2';

@Component({
	selector: 'app-campaignform',
	templateUrl: './campaignform.component.html',
	styleUrls: ['./campaignform.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class CampaignformComponent implements OnInit {
	@ViewChild('mymodal', {static: false}) private modal: PopupModalComponent;
	@ViewChild('simplemde', { static: true }) private readonly simplemde: SimplemdeComponent;

	options = {
		toolbar: []
	};

	public fasCaretDown = fasCaretDown;
	public fasTimes = fasTimes;
	public farEye = farEye;
	public farEyeSlash = farEyeSlash;
	public campaignId;
	public campaign;
	public delete;
	public changeview;
	public currentViewtype;
	public quillConfig;
	public descriptionmde;
	public showPreview;
	public maritalstatuses;
	public recipients: any; // json
	public uploadedFiles;
	public documentsAttachment;
	public turndownService;
	public isShowEmoPicker: boolean;

	constructor(
		public activatedRoute: ActivatedRoute,
		public router: Router,
		public http: HttpService,
		public global: GlobalService,
		public helper: HelperService
	) {
		this.turndownService = new TurndownService();
		const self = this;
		this.activatedRoute.queryParams.subscribe(params => {
			self.campaignId = params.id;
			self.currentViewtype = params.type;
		});
		this.changeview = true;
		this.showPreview = true;
		this.isShowEmoPicker = false;
		this.uploadedFiles = [];
		this.documentsAttachment = [];
		this.recipients = {
			smallgroupmemberroles: [],
			ministrymemberroles: [],
			roles: [],
			maritalstatuses: [],
			gender: '',
			isnorole: '',
			count: 0,
			countloading: false,
			roleloading: false
		};
	}

	ngOnInit(): void {
		this.campaign = {
			saveloading: false,
			recipient_method: 'basic'
		};
		this.currentViewtype = 'Email';
		if (this.campaignId != null) {
			this.changeview = false;
			this.getCampaignDetail();
		} else {
			Object.assign(this.campaign, {
				schedule: this.helper.dateToDatetimelocal(new Date())
			});
		}

		if (this.simplemde != null) {
			this.simplemde.setOptions('lineNumbers', true);
		}

		this.getSmallgroupmemberrole();
		this.getMinistrymemberrole();
		this.getRole();
		this.getMaritalstatus();
	}

	public togglePreview(): void {
		this.showPreview = this.showPreview ? false : true;
	}

	public getCampaignDetail(): void {
		const params = {
			id: this.campaignId
		};
		const self = this;
		this.http.sendGetRequest2('campaign/detail', params).subscribe((response: any) => {
			if (response.api_status) {
				self.campaign = response.data.campaign;
				self.campaign.created_at = self.helper.getDatetime(self.campaign.created_at);
				self.descriptionmde = self.turndownService.turndown(self.campaign.description);

				// ambil documents dari attachmentsnya
				self.campaign.campaignattachments.forEach(($ii) => {
					$ii.document.checked = true;
					self.documentsAttachment.push($ii.document);
				});

				// generate schedule time
				self.campaign.schedule = self.helper.dateToDatetimelocal(new Date(self.campaign.sendstart_at));

				// sementara belom ada setting campaign
				self.campaign.recipient_method = 'basic';
				self.currentViewtype = self.campaign.type;
			} else {
				self.modal.show('Error', response.message, 'danger');
			}
			self.campaign.saveloading = false;
		}, (error: any) => {
			self.modal.show('Error 500', error.message, 'danger');
			self.campaign.saveloading = false;
		});
	}

	public getSmallgroupmemberrole(): void {
		const self = this;
		this.recipients.roleloading = true;
		this.http.sendGetRequest2('smallgroupmemberrole/get').subscribe((response: any) => {
			if (response.api_status) {
				self.recipients.smallgroupmemberroles = response.data.smallgroupmemberroles;
			} else {
				self.modal.show('Error', response.message, 'danger');
			}
			self.recipients.roleloading = false;
		}, (error: any) => {
			self.modal.show('Error 500', error.message, 'danger');
			self.recipients.roleloading = false;
		});
	}

	public getMinistrymemberrole(): void {
		const self = this;
		this.recipients.roleloading = true;
		this.http.sendGetRequest2('ministrymemberrole/get').subscribe((response: any) => {
			if (response.api_status) {
				self.recipients.ministrymemberroles = response.data.ministrymemberroles;
			} else {
				self.modal.show('Error', response.message, 'danger');
			}
			self.recipients.roleloading = false;
		}, (error: any) => {
			self.modal.show('Error 500', error.message, 'danger');
			self.recipients.roleloading = false;
		});
	}

	public getRole(): void {
		const self = this;
		const params = {
			applicationId: 1
		};
		this.recipients.roleloading = true;
		this.http.sendGetRequest2('role/all', params).subscribe((response: any) => {
			if (response.api_status) {
				self.recipients.roles = response.data.roles;
			} else {
				self.modal.show('Error', response.message, 'danger');
			}
			self.recipients.roleloading = false;
		}, (error: any) => {
			self.modal.show('Error 500', error.message, 'danger');
			self.recipients.roleloading = false;
		});
	}

	public getMaritalstatus(): void {
		const self = this;
		this.http.sendGetRequest2('maritalstatus/get').subscribe((response: any) => {
			if (response.api_status) {
				self.recipients.maritalstatuses = response.data.maritalstatuses;
				self.recipients.maritalstatuses.forEach(($ii) => {
					$ii.checked = true;
				});
			} else {
				self.modal.show('Error', response.message, 'danger');
			}
		}, (error: any) => {
			self.modal.show('Error 500', error.message, 'danger');
		});
	}

	public uploadImage(file): void {
		const self = this;
		const formData = new FormData();
		formData.append('file', file[0], file.name);
		formData.append('type', this.currentViewtype === 'Email' ? 'Email' : this.currentViewtype === 'Notif' ? 'Notif' : '');
		this.http.sendPostUpload('campaign/upload/image', formData).subscribe((response: any) => {
			if (response.api_status) {
				self.uploadedFiles.push(response.data.url);
			} else {
				self.modal.show('Error', response.message, 'danger');
			}
		}, (error: any) => {
			self.modal.show('Error 500', error.message, 'danger');
		});
	}

	public uploadAttachment(file): void {
		const self = this;
		const formData = new FormData();
		formData.append('file', file[0], file.name);
		this.http.sendPostUpload('campaignattachment/upload', formData).subscribe((response: any) => {
			if (response.api_status) {
				response.data.createdData.document.checked = false;
				self.documentsAttachment.push(response.data.createdData.document);
			} else {
				self.modal.show('Error', response.message, 'danger');
			}
		}, (error: any) => {
			self.modal.show('Error 500', error.message, 'danger');
		});
	}

	public toggleAttachment(doc): void {
		doc.checked = doc.checked ? false : true;
	}

	public changeviewtype(viewtype: string): void {
		if (this.changeview) {
			this.currentViewtype = viewtype;
			this.isShowEmoPicker = false;
		}
	}

	public showEmoji(): void {
		this.isShowEmoPicker = true;
	}

	public descriptionChanged(): void {
		// refresh preview
		let temp = markdown.toHTML(this.descriptionmde);
		if (temp.indexOf('<p>') !== -1) {
			temp = temp.substring(3);
		}
		if (temp.lastIndexOf('</p>') !== -1) {
			temp = temp.substring(0, temp.length - 1 - 3);
		}

		this.campaign.description = this.helper.htmlspecialchars_decode (temp);
	}

	public copyClipboard(val): void {
		const selBox = document.createElement('textarea');
		selBox.style.position = 'fixed';
		selBox.style.left = '0';
		selBox.style.top = '0';
		selBox.style.opacity = '0';
		selBox.value = '![](' + val + ')';
		document.body.appendChild(selBox);
		selBox.focus();
		selBox.select();
		document.execCommand('copy');
		document.body.removeChild(selBox);
	}

	public countRecipient(): void {
		const self = this;
		let maritalstatusIds = '';
		let smallgroupmemberroleIds = '';
		let ministrymemberroleIds = '';
		let roleIds = '';
		let params = {};

		// FROM array to string
		this.recipients.smallgroupmemberroles.forEach(($ii) => {
			if ($ii.checked) {
				smallgroupmemberroleIds += smallgroupmemberroleIds === '' ? $ii.id : ',' + $ii.id;
			}
		});
		// FROM array to string
		this.recipients.ministrymemberroles.forEach(($ii) => {
			if ($ii.checked) {
				ministrymemberroleIds += ministrymemberroleIds === '' ? $ii.id : ',' + $ii.id;
			}
		});
		// FROM array to string
		this.recipients.roles.forEach(($ii) => {
			if ($ii.checked) {
				roleIds += roleIds === '' ? $ii.id : ',' + $ii.id;
			}
		});
		// FROM array to string
		this.recipients.maritalstatuses.forEach(($ii) => {
			if ($ii.checked) {
				maritalstatusIds += maritalstatusIds === '' ? $ii.id : ',' + $ii.id;
			}
		});

		if (this.campaign.recipient_method === 'basic') {
			params = {
				gender: this.recipients.gender,
				maritalstatusIds,
				smallgroupmemberroleIds,
				ministrymemberroleIds,
				roleIds,
				isnorole: this.recipients.isnorole ? 1 : 0
			};
		} else if (this.campaign.recipient_method === 'query') {
			params = {
				rawquery: this.recipients.query
			};
		}

		this.recipients.countloading = true;
		this.http.sendGetRequest2('campaign/recipient', params).subscribe((response: any) => {
			if (response.api_status) {
				self.recipients.count = response.data.recipients_total;
			} else {
				self.modal.show('Error', response.message, 'danger');
			}
			self.recipients.countloading = false;
		}, (error: any) => {
			self.modal.show('Error 500', error.message, 'danger');
			self.recipients.countloading = false;
		});
	}

	public saveCampaign(status, isCopied= false): void {

		if (this.campaign.title == null) {
			this.modal.show('Warning', 'Subject length must be greater than 10 characters', 'danger');
			return;
		} else if (this.campaign.title.length <= 10) {
			this.modal.show('Warning', 'Subject length must be greater than 10 characters', 'danger');
			return;
		} else if (this.campaign.description == null) {
			this.modal.show('Warning', 'Body length must be greater than 30 characters', 'danger');
			return;
		} else if (this.campaign.description.length <= 30) {
			this.modal.show('Warning', 'Body length must be greater than 30 characters', 'danger');
			return;
		}

		const self = this;
		let maritalstatusIds = '';
		let smallgroupmemberroleIds = '';
		let ministrymemberroleIds = '';
		let roleIds = '';
		let documentIds = '';
		let params = {};

		// FROM array to string
		this.recipients.smallgroupmemberroles.forEach(($ii) => {
			if ($ii.checked) {
				smallgroupmemberroleIds += smallgroupmemberroleIds === '' ? $ii.id : ',' + $ii.id;
			}
		});
		// FROM array to string
		this.recipients.ministrymemberroles.forEach(($ii) => {
			if ($ii.checked) {
				ministrymemberroleIds += ministrymemberroleIds === '' ? $ii.id : ',' + $ii.id;
			}
		});
		// FROM array to string
		this.recipients.roles.forEach(($ii) => {
			if ($ii.checked) {
				roleIds += roleIds === '' ? $ii.id : ',' + $ii.id;
			}
		});
		// FROM array to string
		this.recipients.maritalstatuses.forEach(($ii) => {
			if ($ii.checked) {
				maritalstatusIds += maritalstatusIds === '' ? $ii.id : ',' + $ii.id;
			}
		});
		// FROM array to string
		this.documentsAttachment.forEach(($ii) => {
			if ($ii.checked) {
				documentIds += documentIds === '' ? $ii.id : ',' + $ii.id;
			}
		});

		if (this.campaign.recipient_method === 'basic') {
			params = {
				gender: this.recipients.gender,
				maritalstatusIds,
				smallgroupmemberroleIds,
				ministrymemberroleIds,
				roleIds,
				documentIds,
				isnorole: this.recipients.isnorole ? 1 : 0,
				status,
				description: this.campaign.description,
				title: this.campaign.title,
				sendstart_at: this.helper.dateToLaravelformat(new Date(this.campaign.schedule)),
				type: this.currentViewtype
			};
		} else if (this.campaign.recipient_method === 'query') {
			params = {
				rawquery: this.recipients.query,
				status,
				description: this.campaign.description,
				title: this.campaign.title,
				sendstart_at: this.helper.dateToLaravelformat(new Date(this.campaign.schedule)),
				type: this.currentViewtype,
				documentIds
			};
		}

		if (isCopied === false) {
			if (this.campaign.id != null) {
				Object.assign(params, {
					id: this.campaign.id
				});
			}
		}

		this.recipients.countloading = true;
		this.campaign.saveloading = true;
		this.http.sendPostRequest2('campaign/save', params).subscribe((response: any) => {
			if (response.api_status === true) {
				// berhasil
				// datanya ada di response.data.createdData.campaign
				self.router.navigateByUrl('admin/campaign/list-' + self.currentViewtype.toLowerCase());
			} else {
				self.modal.show('Error', response.message, 'danger');
			}
			self.recipients.countloading = false;
			self.campaign.saveloading = false;
		}, (error: any) => {
			self.modal.show('Error 500', error.message, 'danger');
			self.recipients.countloading = false;
			self.campaign.saveloading = false;
		});
	}

	handleSelection(event): void {
		this.descriptionmde = this.descriptionmde == null ? event.char : this.descriptionmde + event.char;
	}

}
