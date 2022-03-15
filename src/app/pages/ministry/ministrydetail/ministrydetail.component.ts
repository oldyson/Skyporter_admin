import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpService } from './../../../http.service';
import { GlobalService } from './../../../global.service';
import { HelperService } from './../../../helper.service';
import { InvitevolunteerComponent } from 'src/app/components/invitevolunteer/invitevolunteer.component';
import { ChangeroleComponent } from 'src/app/components/changerole/changerole.component';
import { ExportfilterComponent } from 'src/app/components/exportfilter/exportfilter.component';
import {
	faSearch as fasSearch,
	faChevronDown as  fasChevronDown,
	faUser as fasUser
} from '@fortawesome/pro-solid-svg-icons';
import {
	faSpinner as fadSpinner,
} from '@fortawesome/pro-duotone-svg-icons';
import swal from 'sweetalert2';

@Component({
	selector: 'app-ministrydetail',
	templateUrl: './ministrydetail.component.html',
	styleUrls: ['./ministrydetail.component.scss']
})
export class MinistrydetailComponent implements OnInit {
	@ViewChild('changerole') changerole: ChangeroleComponent;
	@ViewChild('invite') invite: InvitevolunteerComponent;
	@ViewChild('export') export: ExportfilterComponent;

	public fasSearch = fasSearch;
	public fasUser = fasUser;
	public fadSpinner = fadSpinner;
	public fasChevronDown = fasChevronDown;

	public ministryId: number;
	public ministry: any;
	public ministrymembers: any;
	public prerequisite: any;
	public users: any;
	public searchByName: string;

	public groupexports: any;
	public exports: any;
	public exportsdata: any;
	public exportsdropdown: any;

	public isLoadingData: boolean;
	public isLoadingUsers: boolean;
	public isLoadingInvite: boolean;
	public isLoadingExport: boolean;
	public isLoadingSearch: boolean;

	constructor(
		public activatedRoute: ActivatedRoute,
		public router: Router,
		public http: HttpService,
		public global: GlobalService,
		public helper: HelperService
	) {
		this.activatedRoute.queryParams.subscribe(params => {
			this.ministryId = parseInt(params.id, 10);
		});
		this.ministry = {
			id: null,
			ministryhead: null,
			keyvolunteers: null,
			name: null,
			description: null,
			status: null,
			level: null,
			upperlevel: null,
			createdat: null,
			summary: null,
			ministrymembers: null,
			ministryrequests: null,
			ministrygroup: null,
			ministrysubgroup: null,
			document: null,
			ministryprereqprograms: null
		};
		this.isLoadingSearch = false;
		this.isLoadingInvite = false;
		this.exportsdropdown = ['Ministry Data', 'Members'];
	}

	ngOnInit(): void {
		this.getMinistryDetail(this.ministryId);
		this.getAllUsers();
	}

	public changeRole(data: any): void {
		const datas = data;
		this.changerole.showDialog(datas);
	}

	public doAPI(data: any): void {
		const apiurl = data.apiurl;
		const apimethod = data.apimethod;
		const apiparams = data.apiparams;

		if(!this.isLoadingData){
			this.isLoadingData = true;
			if (apimethod === 'GET') {
				this.http.sendGetRequest2(apiurl, apiparams).subscribe(() => {
					this.isLoadingData = false;
					this.getMinistryDetail(this.ministryId);
				});
			} else if (apimethod === 'POST') {
				this.http.sendPostRequest2(apiurl, apiparams).subscribe(() => {
					this.isLoadingData = false;
					this.getMinistryDetail(this.ministryId);
				});
			}
		}
	}

	public doActionAPI(apiurl: string, apimethod: string, apiparams: any, type: string, message: string): void {
		switch (type) {
			case 'danger':
				swal.fire({
					title: 'Are you sure?',
					text: 'You won\'t be able to revert this!',
					icon: 'warning',
					showCancelButton: true,
					confirmButtonColor: '#d33',
					confirmButtonText: 'Delete'
				}).then((result) => {
					if (result.isConfirmed) {
						this.doAPI({ apiurl, apimethod, apiparams });
					}
				});
				break;
			case 'question':
				swal.fire({
					title: 'Are you sure?',
					text: message,
					icon: type,
					showCancelButton: true,
					confirmButtonText: 'OK'
				}).then((result) => {
					if (result.isConfirmed) {
						this.doAPI({ apiurl, apimethod, apiparams });
					}
				});
				break;
			case 'warning':
				swal.fire({
					title: 'Are you sure?',
					text: message,
					icon: type,
					showCancelButton: true,
					confirmButtonText: 'OK'
				}).then((result) => {
					if (result.isConfirmed) {
						this.doAPI({ apiurl, apimethod, apiparams });
					}
				});
				break;
			case 'changeRole':
				this.changeRole({type, apiparams});
				break;
			default:
				// this.isLoadingData = true;
				// this.doAPI({ apiurl, apimethod, apiparams });
				break;
		}
	}

	public inviteVolunteer(): void {
		this.invite.showDialog();
	}

	public exportData(): void {
		this.generateExport();
	}

	public generateExport(): void {
		if (!this.isLoadingExport) {
			this.isLoadingExport = true;
			const param = {
				ministryId: this.ministryId,
			};
			this.http.sendGetRequest2('ministrymember/export', param).subscribe((response: any) => {
				this.isLoadingExport = false;
				if (response.api_status) {
					const link = document.createElement('a');
					link.href = response.data.path;
					link.download = response.data.path;
					document.body.appendChild(link);
					link.click();
					document.body.removeChild(link);
				} else {
					this.showErrorDialog(response.message);
				}
			}, (error: any) => {
				this.isLoadingExport = false;
				this.showErrorDialog(error.message);
			});
		}
	}

	public getAllUsers(): void {
		this.isLoadingUsers = true;
		this.http.sendGetRequest2('user/get').subscribe((response: any) => {
			this.isLoadingUsers = false;
			if (response.api_status === true) {
				const userList = response.data.user;
				this.users = [];
				let user;

				userList.forEach(($data) => {
					user = {
						id: $data.id,
						name: $data.fullname
					};
					this.users.push(user);
				});
			} else {
				this.showErrorDialog(response.message);
			}
		}, (error: any) => {
			this.isLoadingUsers = false;
			this.showErrorDialog(error.message);
		});
	}

	public searchMinistryMemberByName(): void {
		this.isLoadingSearch = true;
		const param = {
			paginate: 10000000,
			ministryId: this.ministryId,
			name: this.searchByName
		};

		this.http.sendGetRequest2('ministrymember/get', param).subscribe((response: any) => {
			if (response.api_status) {
				this.ministry.ministrymembers = response.data.ministrymember.data;

				this.ministry.ministrymembers = this.ministry.ministrymembers.map(($data) => {
					return {
						user: $data.user,
						ministrymemberrole: $data.ministrymemberrole,
						actions: [
							{
								label: 'View user',
								url: `admin/user/detail?id=${$data.user.id}`,
								type: '',
								// apimethod: 'POST',
								apiurl: null,
								apiparams: {}
							},
							{
								label: 'Change Role',
								url: '',
								type: 'changeRole',
								// apimethod: 'POST',
								apiurl: 'action',
								apiparams: {
									memberRole: $data.ministrymemberrole_id,
									ministryId: this.ministryId,
									id: $data.id
								}
							},
							{
								label: 'Remove',
								url: '',
								type: 'danger',
								apimethod: 'POST',
								apiurl: 'ministrymember/remove',
								apiparams: {
									id: $data.id
								}
							}
						]
					};
				});

				//sorting by role level
				this.ministry.ministrymembers.sort((a, b) =>
					a.ministrymemberrole.level > b.ministrymemberrole.level ? -1 : a.ministrymemberrole.level < b.ministrymemberrole.level ? 1 : 0
				); // copy dari internet
				this.isLoadingSearch = false;
			} else {
				swal.fire({
					title: 'Error',
					text: response.message,
					icon: 'warning',
					confirmButtonText: 'OK',
				}).then(() => {
					// NOTHING
				});
				this.isLoadingSearch = false;
			}
		}, (error: any) => {
			swal.fire({
				title: 'Error 505',
				text: error.message,
				icon: 'warning',
				confirmButtonText: 'OK',
			}).then(() => {
				// NOTHING
			});
		});
	}

	public getMinistryDetail(ministryId: number): void {
		if (!this.isLoadingData) {
			this.isLoadingData = true;
			const param = {
				id: ministryId
			};
			this.http.sendGetRequest2('ministry/detail', param).subscribe((response: any) => {
				this.isLoadingData = false;
				if (response.api_status === true) {
					const ministryData = response.data.ministry;
					const ministryLevel = response.data.ministry.ministrysubgroup ? response.data.ministry.ministrysubgroup.name : response.data.ministry.ministrygroup?.name;
					this.prerequisite = ministryData.ministryprereqprograms.filter(item => item.programcode.type === 'Class');
					this.ministry.ministryhead = [];
					this.ministry.keyvolunteers = [];
					this.groupexports = [];
					this.exports = [];
					this.ministrymembers = [];
					let group = {};
					let filter;
					let ministrymember;

					//sorting by role level
					ministryData.ministrymembers.sort((a, b) =>
						a.ministrymemberrole.level > b.ministrymemberrole.level ? -1 : a.ministrymemberrole.level < b.ministrymemberrole.level ? 1 : 0
					); // copy dari internet

					filter = {
						filterId: -1,
						filterName: 'All Roles',
						filterShortname: 'All Roles',
					};

					this.exports.push(filter);
					ministryData.ministrymembers.forEach(($data) => {
						ministrymember = {
							user: $data.user,
							ministrymemberrole: $data.ministrymemberrole,
							actions: [
								{
									label: 'View user',
									url: `admin/user/detail?id=${$data.user.id}`,
									type: '',
									// apimethod: 'POST',
									apiurl: null,
									apiparams: {}
								},
								{
									label: 'Change Role',
									url: '',
									type: 'changeRole',
									// apimethod: 'POST',
									apiurl: 'action',
									apiparams: {
										memberRole: $data.ministrymemberrole_id,
										ministryId: this.ministryId,
										id: $data.id
									}
								},
								{
									label: 'Remove',
									url: '',
									type: 'danger',
									apimethod: 'POST',
									apiurl: 'ministrymember/remove',
									apiparams: {
										id: $data.id
									}
								}
							]
						};

						this.ministrymembers.push(ministrymember);

						if ($data.ministrymemberrole.name === 'Ministry Head') {
							this.ministry.ministryhead.push($data.user);
						}
						if ($data.ministrymemberrole.name === 'Key Volunteer') {
							this.ministry.keyvolunteers.push($data.user);
						}

						filter = {
							filterId: $data.ministrymemberrole.level,
							filterName: $data.ministrymemberrole.name,
							filterShortname: $data.ministrymemberrole.name,
						};
						if (this.exports.find((item) => item.filterId === $data.ministrymemberrole.level) === undefined) {
							this.exports.push(filter);
						}
					});

					group = {
						groupId: 0,
						groupName: 'Roles',
						groupShortname: 'Roles',
						datas: this.exports
					};
					this.groupexports.push(group);

					this.exportsdata = {
						datas: this.groupexports,
						isExport: true
					};

					this.ministry = {
						id: ministryData.id,
						ministryhead: this.ministry.ministryhead,
						keyvolunteers: this.ministry.keyvolunteers,
						name: ministryData.name,
						description: ministryData.description,
						status: ministryData.status,
						level: ministryLevel,
						createdat: ministryData.created_at,
						summary: ministryData.ministrysummary,
						ministrymembers: this.ministrymembers,
						ministryrequests: ministryData.ministryrequests,
						ministrygroup: ministryData.ministrygroup,
						ministrysubgroup: ministryData.ministrysubgroup,
						document: ministryData.document,
						ministryprereqprograms: ministryData.ministryprereqprograms,
					};

				} else {
					this.showErrorDialog(response.message);
				}
			}, (error: any) => {
				this.isLoadingData = false;
				this.showErrorDialog(error.message);
			});
		}
	}

	public inviteVolunteers(userIds: any): void {
		if (!this.isLoadingInvite) {
			this.isLoadingInvite = true;
			const param = {
				ministryId: this.ministryId,
				userId: userIds.join(','),
				action: 'Invite'
			};
			this.http.sendPostRequest2('ministryinvite/action', param).subscribe((response: any) => {
				this.isLoadingInvite = false;
				if (response.api_status === true) {
					this.showDialog(response.message);
				} else {
					this.showErrorDialog(response.message);
				}
			}, (error: any) => {
				this.isLoadingInvite = false;
				this.showErrorDialog(error.message);
			});
		}
	}

	public showDialog(message: string): void {
		swal.fire({
			title: 'Success',
			text: message,
			icon: 'success',
			confirmButtonText: 'OK',
		}).then(() => {
			// Nothing
		});
	}

	public showWarningDialog(message: string): void {
		swal.fire({
			title: 'Warning',
			text: message,
			icon: 'warning',
			confirmButtonText: 'OK',
		}).then(() => {
			// Nothing
		});
	}

	public showErrorDialog(message: string): void {
		swal.fire({
			title: 'Error',
			text: message,
			icon: 'error',
			confirmButtonText: 'OK',
		}).then(() => {
			// Nothing
		});
	}
}
