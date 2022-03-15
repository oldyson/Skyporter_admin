import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from './../../../../http.service';
import { GlobalService } from './../../../../global.service';
import { HelperService } from './../../../../helper.service';
import { 
	faStop as fasStop,
	faPlay as fasPlay,
	faHourglassHalf as fasHourglassHalf,
	faCheckSquare as fasCheckSquare,
	faTimesSquare as fasTimesSquare,
	faClock as fasClock
} from '@fortawesome/pro-solid-svg-icons';
import { 
	faSquare as farSquare,
} from '@fortawesome/pro-regular-svg-icons';
import { 
	faCheckSquare as fadCheckSquare,
} from '@fortawesome/pro-duotone-svg-icons';
import swal from 'sweetalert2';

@Component({
	selector: 'programdetail-ticketdetail',
	templateUrl: './ticketdetail.component.html',
	styleUrls: ['./ticketdetail.component.scss']
})
export class TicketdetailComponent implements OnInit {
	public fasHourglassHalf = fasHourglassHalf;
	public fasCheckSquare = fasCheckSquare;
	public fasTimesSquare = fasTimesSquare;
	public farSquare = farSquare;
	public fadCheckSquare = fadCheckSquare;
	public fasPlay = fasPlay;
	public fasStop = fasStop;
	public fasClock = fasClock;
	public programticketId;
	public programType;
	public isLoading;
	public isTableLoading;
	public programticket;
	public programticketapprovaldocuments;
	public program;
	public navigationapprovaldocuments;
	public pageapprovaldocuments;
	public keys;
	public tabs;
	public currentTabIndex: number;
	public adminapprovals;
	public navigationadminapprovals;
	public pageadminapprovals;
	public leaderapprovals;
	public navigationleaderapprovals;
	public pageleaderapprovals;
	constructor(
		private http: HttpService,
		public global: GlobalService,
		private activatedRoute: ActivatedRoute,
		private router: Router,
		public helper: HelperService
	) {
		this.programticketId = null;
		this.activatedRoute.queryParams.subscribe(params => {
			this.programticketId = parseInt(params.id, 10);
		});
		this.programType = this.activatedRoute.snapshot.paramMap.get('type').toLowerCase();
		// untuk programType diambil dari id

		if (this.programticketId == null) {
			// redirect back to list
			this.router.navigateByUrl('admin/program/' + this.programType + '/list');
		}
		this.tabs = [
			{
				value: 'approvaldocuments',
				label: 'Leader Approval Files',
			},
			{
				value: 'leaderapprovals',
				label: 'Leader Approvals',
			},
			{
				value: 'adminapprovals',
				label: 'Admin Approvals',
			},
		];
		this.keys = {
			'approvaldocuments' : [
				{
					label: '#',
					value: 'id',
					showtype: 'number',
					minwidth: false,
					priority: 0,
					opensort: false,
					sortcolumn: '',
					sortorder: ''
				},
				{
					label: 'Registrant Name',
					value: 'registrantname',
					showtype: 'text',
					minwidth: false,
					priority: 0,
					opensort: false,
					sortcolumn: '',
					sortorder: ''
				},
				{
					label: 'File Name',
					value: 'filename',
					showtype: 'text',
					minwidth: false,
					priority: 0,
					opensort: false,
					sortcolumn: '',
					sortorder: ''
				},
				{
					label: 'Size (KB)',
					value: 'size',
					showtype: 'number',
					minwidth: false,
					priority: 0,
					opensort: false,
					sortcolumn: '',
					sortorder: '',
					align: 'center'
				},
				{
					label: 'Uploaded by',
					value: 'uploaded_by',
					showtype: 'text',
					minwidth: false,
					priority: 0,
					opensort: false,
					sortcolumn: '',
					sortorder: ''
				},
				{
					label: 'Uploaded at',
					value: 'uploaded_at',
					showtype: 'datetime',
					minwidth: false,
					priority: 0,
					opensort: false,
					sortcolumn: '',
					sortorder: ''
				},
				{
					label: 'Download',
					value: 'url',
					showtype: 'downloadbutton',
					minwidth: false,
					priority: 0,
					opensort: false,	
					align: 'center'		
				},
			],
			'leaderapprovals' : [
				{
					label: '#',
					value: 'id',
					showtype: 'number',
					minwidth: false,
					priority: 0,
					opensort: false,
					sortcolumn: '',
					sortorder: ''
				},
				{
					label: 'Registrant Name',
					value: 'registrantname',
					showtype: 'text',
					minwidth: false,
					priority: 0,
					opensort: false,
					sortcolumn: '',
					sortorder: ''
				},
				{
					label: 'Leader Name',
					value: 'leadername',
					showtype: 'text',
					minwidth: false,
					priority: 0,
					opensort: false,
					sortcolumn: '',
					sortorder: ''
				},
				{
					label: 'Valid to',
					value: 'valid_to',
					showtype: 'datetime',
					minwidth: false,
					priority: 0,
					opensort: false,
					sortcolumn: '',
					sortorder: ''
				},
				{
					label: 'Status',
					value: 'status',
					showtype: 'text',
					minwidth: false,
					priority: 0,
					opensort: false,
					sortcolumn: '',
					sortorder: ''
				},
			],
			'adminapprovals' : [
				{
					label: '#',
					value: 'id',
					showtype: 'number',
					minwidth: false,
					priority: 0,
					opensort: false,
					sortcolumn: '',
					sortorder: ''
				},
				{
					label: 'Registrant Name',
					value: 'registrantname',
					showtype: 'text',
					minwidth: false,
					priority: 0,
					opensort: false,
					sortcolumn: '',
					sortorder: ''
				},
				{
					label: 'Valid to',
					value: 'valid_to',
					showtype: 'datetime',
					minwidth: false,
					priority: 0,
					opensort: false,
					sortcolumn: '',
					sortorder: ''
				},
				{
					label: 'Status',
					value: 'status',
					showtype: 'text',
					minwidth: false,
					priority: 0,
					opensort: false,
					sortcolumn: '',
					sortorder: ''
				},
			]
			
		};

		this.currentTabIndex = 0;
	}

	ngOnInit(): void {
		this.getData();
		this.getApprovalDocumentData(1);
	}


	public setTabId(index: number): void {
		this.currentTabIndex = index;
		// this.keys = [];
		if (this.tabs[this.currentTabIndex] != null) {
			if (this.tabs[this.currentTabIndex].value === 'approvaldocuments') {
				if (this.programticketapprovaldocuments == null)
					this.getApprovalDocumentData();
			}
			else if (this.tabs[this.currentTabIndex].value === 'leaderapprovals') {
				if (this.leaderapprovals == null)
					this.getLeaderApprovalData();
			}
			else if (this.tabs[this.currentTabIndex].value === 'adminapprovals') {
				if (this.adminapprovals == null)
					this.getAdminApprovalData();
			}
		}
		// ga refresh lagi kalo uda ada data sebelomnya, cuma pindah tab
	}

	public getData(): void {
		let self = this;
		const params = {
			programTicketId: this.programticketId,
			type: 'Web'
		};
		this.isLoading = true;
		this.http.sendGetRequest2('programticket/detail', params).subscribe((response: any) => {
			if (response.api_status === true) {
				this.programticket = response.data.programticket;
				this.program = response.data.programticket.program;
				this.getLeaderApprovalData(1);
				this.getAdminApprovalData(1);
			} else {
				swal.fire({
					title: 'Error',
					html: response.message,
					icon: 'warning',
					confirmButtonText: 'OK'
				});
			}
			this.isLoading = false;
		}, (error: any) => {
			swal.fire({
				title: 'Error 500',
				html: error.message,
				icon: 'warning',
				confirmButtonText: 'OK'
			});
			this.isLoading = false;
		});
	}

	public doAPI(data: any): void {
		this.isLoading = true;
		const apiurl = data.apiurl;
		const apimethod = data.apimethod;
		const apiparams = data.apiparams;

		if (apimethod === 'GET') {
			this.http.sendGetRequest2(apiurl, apiparams).subscribe((response: any) => {
				if(response.api_status){
				}else{
					swal.fire({
						title: 'Error',
						html: response.message,
						icon: 'warning',
						confirmButtonText: 'OK'
					});
				}
			}, (error: any) => {
				swal.fire({
					title: 'Error 500',
					html: error.message,
					icon: 'warning',
					confirmButtonText: 'OK'
				});
				this.isLoading = false;
			});
		} else if (apimethod === 'POST') {
			this.http.sendPostRequest2(apiurl, apiparams).subscribe((response: any) => {
				if(response.api_status){
				}else{
					swal.fire({
						title: 'Error',
						html: response.message,
						icon: 'warning',
						confirmButtonText: 'OK'
					});
				}
			}, (error: any) => {
				swal.fire({
					title: 'Error 500',
					html: error.message,
					icon: 'warning',
					confirmButtonText: 'OK'
				});
				this.isLoading = false;
			});
		}
		this.getData();
		this.getLeaderApprovalData();
		this.getAdminApprovalData();
		this.getApprovalDocumentData();
	}

	public getApprovalDocumentData(pageNumber: number = null): void{
		if (pageNumber != null) {
			this.pageapprovaldocuments = pageNumber;
		}

		if(this.pageapprovaldocuments == null)
			this.pageapprovaldocuments = 1;

		const params = {
			page: this.pageapprovaldocuments,
			paginate: this.global.defaultpaginate,
			programticket_id: this.programticketId,
			type: 'leaderapproval',
			status: 'Approved'
		}

		this.isTableLoading = true;
		this.http.sendGetRequest2('programticketapprovaldocument/get', params).subscribe((response: any) => {
			if(response.api_status){
				this.programticketapprovaldocuments = response.data.programticketapprovaldocuments.data.map(item => {

					return {
						id: item.id,
						registrantname: item.programticketapproval.user.fullname,
						filename: item.document.name,
						size: item.document.size,
						uploaded_by: item.creator.fullname,
						uploaded_at: item.created_at,
						url: item.document.url,
					};
				});

				this.navigationapprovaldocuments = {
					from: response.data.programticketapprovaldocuments.from,
					to: response.data.programticketapprovaldocuments.to,
					total: response.data.programticketapprovaldocuments.total,
					last_page: response.data.programticketapprovaldocuments.last_page,
					per_page: response.data.programticketapprovaldocuments.per_page,
					current_page: response.data.programticketapprovaldocuments.current_page,
				};
			}else{

			}
			this.isTableLoading = false;
		});
	}
	public getAdminApprovalData(pageNumber: number = null): void{
		let self = this;
		if (pageNumber != null) {
			this.pageadminapprovals = pageNumber;
		}

		if(this.pageadminapprovals == null)
			this.pageadminapprovals = 1;

		const params = {
			page: this.pageadminapprovals,
			paginate: this.global.defaultpaginate,
			programticket_id: this.programticketId,
			type: 'adminapproval'
		}

		this.isTableLoading = true;
		this.http.sendGetRequest2('programticketapproval/get', params).subscribe((response: any) => {
			if(response.api_status){
				this.adminapprovals = response.data.programticketapprovals.data.map(item => {
					if(item.role?.name == self.helper.toTitleCase(self.programType + ' Admin')){
						var actionsList = [];
						if(item.status == 'Pending' && self.programticket.status == 'Pending'){
							actionsList.push(
								{
									label: 'Approve',
									message: 'Are you sure you want to approve this registrant?',
									url: '',
									type: 'question',
									apimethod: 'POST',
									apiurl: 'programticketapproval/action',
									apiparams: {
										id: item.id,
										action: 'Accept',
									}
								},
								{
									label: 'Reject',
									message: '',
									url: '',
									type: 'danger',
									apimethod: 'POST',
									apiurl: 'programticketapproval/action',
									apiparams: {
										id: item.id,
										action: 'Decline',
									}
								}
							);
						}	
						return {
							id: item.id,
							registrantname: item.user.fullname,
							valid_to: item.valid_to,
							status: item.status,
							actions: actionsList
						};
					}	
				});

				this.navigationadminapprovals = {
					from: response.data.programticketapprovals.from,
					to: response.data.programticketapprovals.to,
					total: response.data.programticketapprovals.total,
					last_page: response.data.programticketapprovals.last_page,
					per_page: response.data.programticketapprovals.per_page,
					current_page: response.data.programticketapprovals.current_page,
				};
			}else{

			}
			this.isTableLoading = false;
		});
	}

	public getLeaderApprovalData(pageNumber: number = null): void{
		let self = this;
		if (pageNumber != null) {
			this.pageleaderapprovals = pageNumber;
		}

		if(this.pageleaderapprovals == null)
			this.pageleaderapprovals = 1;

		const params = {
			page: this.pageleaderapprovals,
			paginate: this.global.defaultpaginate,
			programticket_id: this.programticketId,
			type: 'leaderapproval'
		}

		this.isTableLoading = true;
		this.http.sendGetRequest2('programticketapproval/get', params).subscribe((response: any) => {
			if(response.api_status){
				this.leaderapprovals = response.data.programticketapprovals.data.map(item => {
					var actionsList = [];
					if(item.status == 'Approved'){
						if(self.program?.programleaderapprovaldocuments?.length > 0 && self.programticket.status == 'Pending'){
							actionsList.push(
								{
									label: 'Ask Leader to Reupload File(s)',
									message: '',
									url: '',
									type: 'warning',
									apimethod: 'POST',
									apiurl: 'programticketapprovaldocument/requestreupload',
									apiparams: {
										programticketapproval_id: item.id,
									}
								}
							)
						}
					}	
					return {
						id: item.id,
						registrantname: item.user.fullname,
						leadername: item.smallgroupmember?.user2 ? item.smallgroupmember?.user?.fullname + " & " + item.smallgroupmember?.user2?.fullname : item.smallgroupmember?.user?.fullname,
						valid_to: item.valid_to,
						status: item.status == 'Reupload' ? 'Waiting for Re-upload' : item.status,
						actions: actionsList
					};
				});

				this.navigationleaderapprovals = {
					from: response.data.programticketapprovals.from,
					to: response.data.programticketapprovals.to,
					total: response.data.programticketapprovals.total,
					last_page: response.data.programticketapprovals.last_page,
					per_page: response.data.programticketapprovals.per_page,
					current_page: response.data.programticketapprovals.current_page,
				};
			}else{

			}
			this.isTableLoading = false;
		});
	}
}
