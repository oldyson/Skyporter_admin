import { Component, OnInit, ViewChild } from '@angular/core';
import { ListtableComponent } from './../../../components/listtable/listtable.component';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from './../../../http.service';
import { GlobalService } from './../../../global.service';
import { HelperService } from './../../../helper.service';
import { PopupModalComponent } from './../../../components/popup-modal/popup-modal.component';

@Component({
	selector: 'app-classregistrant',
	templateUrl: './classregistrant.component.html',
	styleUrls: ['./classregistrant.component.scss']
})
export class ClassregistrantComponent implements OnInit {
	@ViewChild('mymodal', { static: false }) private modal: PopupModalComponent;
	@ViewChild(ListtableComponent) listtable: ListtableComponent;

	public datas;
	public keys;
	public navigations;
	public page;
	public keyword: string;
	public sortkey: number;
	public isloadingInfo: boolean;
	public isloading: boolean;
	public registrantId: number;
	public registrantInfo;
	public tabs;
	public currentTab;
	public cardInfo;
	public qrList;
	private attendanceCount;

	constructor(
		private http: HttpService,
		private global: GlobalService,
		private activatedRoute: ActivatedRoute,
		public helper: HelperService
	) {
		const self = this;
		this.registrantId = 0;
		this.activatedRoute.queryParams.subscribe(params => {
			self.registrantId = parseInt(params.id, 10);
		});
		this.keyword = null;
		this.sortkey = 0; // index 0 = 1
		this.isloading = false; // kepake di listtable

		this.keys = [];

		this.tabs = [{
			id: '1',
			value: 'Registrant'
		}, {
			id: '2',
			value: 'Attendance'
		}, {
			id: '3',
			value: 'Check-In'
		}];
		this.currentTab = '2';
	}

	ngOnInit(): void {
		this.getInfo();
	}

	public getTab(id: string): void {
		this.currentTab = id;
		this.keys = [];
		this.getData(1);
	}

	public getInfo(): void {
		const params = {
			id: this.registrantId
		};
		const self = this;
		this.isloadingInfo = true;
		this.http.sendGetRequest2('program/detail', params).subscribe((response: any) => {
			if (response.api_status === true) {
				this.registrantInfo = response.data.program;
				this.qrList = response.data.program.programbreakouts[0].programbreakoutdates;
				this.attendanceCount = response.data.program.programbreakouts[0].programbreakoutdates_count;
				this.cardInfo = [{
					value: this.registrantInfo.programtickets_count_pending + this.registrantInfo.programtickets_count_approved + this.registrantInfo.programtickets_count_rejected,
					text: 'Applied',
					color: 'bg-yellow',
					icon: `
						<svg viewBox="0 0 23.784 34.642" width="23.784" height="34.642" fill="#fde81a">
							<g id="_003-login" data-name="003-login" transform="translate(5.52 .25)">
								<path id="Path_1954"
									d="M72.609 0H61.242a3.953 3.953 0 0 0-3.929 3.97v5.263a.808.808 0 1 0 1.617 0V3.978a2.331 2.331 0 0 1 2.312-2.353h11.375a2.336 2.336 0 0 1 2.312 2.353v26.194a2.331 2.331 0 0 1-2.312 2.353H61.242a2.337 2.337 0 0 1-2.312-2.353V24.95a.808.808 0 0 0-1.617 0v5.223a3.953 3.953 0 0 0 3.929 3.97h11.375a3.952 3.952 0 0 0 3.929-3.97V3.978A3.961 3.961 0 0 0 72.609 0zm0 0"
									data-name="Path 1954" transform="translate(-58.531)"></path>
								<path id="Path_1955"
									d="M4.788 204.493a.812.812 0 0 0 1.237 1.051l2.991-3.533.024-.024c.008-.008.016-.025.024-.032a.041.041 0 0 0 .016-.033c.008-.008.016-.024.025-.032s.008-.024.016-.033.008-.024.016-.032.008-.024.016-.032.008-.025.016-.04.008-.024.008-.033.008-.024.008-.04.008-.024.008-.032.008-.033.008-.049v-.024a.474.474 0 0 0 0-.153v-.022c0-.016-.008-.032-.008-.048s-.008-.024-.008-.033-.008-.024-.008-.04-.008-.024-.008-.032-.008-.024-.016-.04-.008-.024-.016-.033-.008-.024-.016-.032-.008-.024-.016-.032-.016-.025-.025-.033-.008-.016-.016-.032-.016-.024-.024-.032l-.024-.024-2.991-3.533a.809.809 0 1 0-1.237 1.043l1.867 2.201H-4.461a.809.809 0 0 0-.809.808.809.809 0 0 0 .809.809H6.655zm0 0"
									data-name="Path 1955" transform="translate(0 -184.403)"></path>
							</g>
						</svg>
					`
				}, {
					value: this.registrantInfo.programtickets_count_approved,
					text: 'Approved',
					color: 'bg-green',
					icon: `
						<svg width="27.771" height="27.771" data-name="006-check-mark-button" viewBox="0 0 27.771 27.771" fill="#58c340">
							<g id="Group_2139" data-name="Group 2139">
								<path id="Path_1958"
									d="M13.885 0a13.885 13.885 0 1 0 13.886 13.885A13.9 13.9 0 0 0 13.885 0zm0 25.533a11.648 11.648 0 1 1 11.648-11.648 11.661 11.661 0 0 1-11.648 11.648z"
									data-name="Path 1958"></path>
								<path id="Path_1959"
									d="M25.9 18.641l-6.481 6.482-2.372-2.372a1.119 1.119 0 0 0-1.582 1.582l3.167 3.167a1.118 1.118 0 0 0 1.582 0l7.273-7.273a1.119 1.119 0 0 0-1.587-1.586z"
									data-name="Path 1959" transform="translate(-7.592 -9.183)"></path>
							</g>
						</svg>
					`
				}, {
					value: `${this.registrantInfo.programtickets_count_quotafilled} | ${this.registrantInfo.programtickets_count_quota}`,
					text: 'Quota',
					color: 'bg-blue',
					icon: `
						<svg width="24.73" height="35" viewBox="0 0 24.73 35" fill="#4da5dc">
							<path id="_001-chair"
								d="M21.088 13.642a4.781 4.781 0 0 0 .868-2.751V4.809A4.815 4.815 0 0 0 17.146 0H7.584a4.815 4.815 0 0 0-4.809 4.809v6.082a4.781 4.781 0 0 0 .868 2.751A4.035 4.035 0 0 0 0 17.653v1.974a1.039 1.039 0 0 0 1.039 1.039h10.287v4.385L3.976 32.4a1.039 1.039 0 1 0 1.469 1.47l5.881-5.881v5.972a1.039 1.039 0 0 0 2.078 0v-5.972l5.881 5.881a1.039 1.039 0 1 0 1.469-1.47l-7.35-7.35v-4.384h10.288a1.039 1.039 0 0 0 1.039-1.039v-1.974a4.035 4.035 0 0 0-3.643-4.011zM4.853 4.809a2.735 2.735 0 0 1 2.731-2.731h9.562a2.735 2.735 0 0 1 2.731 2.732v6.082a2.735 2.735 0 0 1-2.731 2.732H7.584a2.735 2.735 0 0 1-2.731-2.732zm17.8 13.779H2.078v-.935A1.954 1.954 0 0 1 4.03 15.7H20.7a1.954 1.954 0 0 1 1.952 1.952zm0 0"
								class="cls-1" data-name="001-chair"></path>
						</svg>
					`
				}, {
					value: this.registrantInfo.programtickets_count_pending,
					text: 'Pending',
					color: 'bg-grey-light',
					icon: `
						<svg width="26.602" height="34.923" viewBox="0 0 26.602 34.923" fill="#989898">
							<path id="_004-hourglass"
								d="M86.578 32.877h-3.069v-4.932a11.811 11.811 0 0 0-6.345-10.483 11.811 11.811 0 0 0 6.345-10.484V2.046h3.069a1.023 1.023 0 1 0 0-2.046H62.023a1.023 1.023 0 1 0 0 2.046h3.069v4.932a11.811 11.811 0 0 0 6.345 10.483 11.811 11.811 0 0 0-6.345 10.483v4.932h-3.069a1.023 1.023 0 1 0 0 2.046h24.555a1.023 1.023 0 1 0 0-2.046zm-5.116-4.932v4.932h-2.046v-3.138c0-3.153-2.04-3.716-4.093-4.726v-6.148a9.767 9.767 0 0 1 6.14 9.08zM74.3 26.791c2.334 1.164 3.069 1.165 3.069 2.949v3.138h-6.138v-3.139c0-1.783.735-1.784 3.069-2.948zm0-10.387a9.794 9.794 0 0 1-3.767-2.025h7.533A9.794 9.794 0 0 1 74.3 16.4zM67.139 2.046h14.324v4.932a9.766 9.766 0 0 1-1.6 5.368H68.738a9.766 9.766 0 0 1-1.6-5.368zm0 25.9a9.767 9.767 0 0 1 6.139-9.079v6.148c-2.044 1.006-4.093 1.569-4.093 4.726v3.138h-2.046z"
								class="cls-1" data-name="004-hourglass" transform="translate(-61)"></path>
						</svg>
					`
				}, {
					value: this.registrantInfo.programtickets_count_rejected,
					text: 'Rejected',
					color: 'bg-red',
					icon: `
						<svg width="28" height="28" viewBox="0 0 28 28" fill="#e34f4f">
							<g id="_005-cancel" data-name="005-cancel" transform="translate(-6.4 -6.4)">
								<g id="Group_2138" data-name="Group 2138" transform="translate(6.4 6.4)">
									<path id="Path_1956"
										d="M20.4 34.4a14 14 0 1 0-14-14 14.012 14.012 0 0 0 14 14zm0-26.024A12.024 12.024 0 1 1 8.376 20.4 12.042 12.042 0 0 1 20.4 8.376z"
										data-name="Path 1956" transform="translate(-6.4 -6.4)"></path>
									<path id="Path_1957"
										d="M41.789 51.7a.989.989 0 0 0 1.4 0l3.855-3.855L50.9 51.7a.989.989 0 0 0 1.4 0 .989.989 0 0 0 0-1.4l-3.86-3.858 3.86-3.855a.988.988 0 1 0-1.4-1.4l-3.855 3.855-3.855-3.855a.988.988 0 1 0-1.4 1.4l3.855 3.855-3.856 3.858a.989.989 0 0 0 0 1.4z"
										data-name="Path 1957" transform="translate(-33.042 -32.587)"></path>
								</g>
							</g>
						</svg>
					`
				}, {
					value: `${this.registrantInfo.programtickets_count_pass} | ${this.registrantInfo.programtickets_count_fail}`,
					text: 'Pass | Fail',
					color: 'bg-white',
					icon: `
						<svg viewBox="0 0 17.461 34.923" width="17.461" height="34.923" fill="#404040">
							<g id="battery-charging-status" transform="rotate(-90 13.462 21.462)">
								<g id="Almost_x5F_Full_x5F_Battery" transform="translate(0 8)">
									<g id="Group_2268" data-name="Group 2268">
										<path id="Path_1976"
											d="M32.74 11.274h-2.183A3.278 3.278 0 0 0 27.283 8H3.274A3.278 3.278 0 0 0 0 11.274v10.913a3.278 3.278 0 0 0 3.274 3.274h24.009a3.278 3.278 0 0 0 3.274-3.274h2.183A2.183 2.183 0 0 0 34.923 20v-6.543a2.184 2.184 0 0 0-2.183-2.183zm-4.365 10.913a1.092 1.092 0 0 1-1.091 1.091H3.274a1.092 1.092 0 0 1-1.091-1.091V11.274a1.092 1.092 0 0 1 1.091-1.091h24.009a1.092 1.092 0 0 1 1.091 1.091zM32.74 20h-2.183v-6.543h2.183zm-12.119-6.658a1.938 1.938 0 0 0-1.579-.977H5.457a1.1 1.1 0 0 0-1.091 1.091V20a1.1 1.1 0 0 0 1.091 1.1h17.949a.622.622 0 0 0 .6-.977z"
											data-name="Path 1976" transform="translate(0 -8)"></path>
									</g>
								</g>
							</g>
						</svg>
					`
				}];
			} else {
				self.modal.show('Error', response.message, 'danger');
			}
			self.isloadingInfo = false;
			this.getData(1);
		}, (error: any) => {
			self.modal.show('Error 500', error.message, 'danger');
			self.isloadingInfo = false;
		});
	}

	public searchData(keyword: string): void {
		this.keyword = keyword;

		this.registrantInfo = null;
		this.page = 1;
		this.getData(this.page);
	}

	public sortDataBy(column: string): void {
		const self = this;
		this.keys.forEach(($ii, $i) => {
			if ($ii.sortcolumn != null) {
				if ($ii.sortcolumn === column) {
					// kalo sama baru di cek
					if ($ii.sortorder === ''
						|| $ii.sortorder === 'DESC') {
						$ii.sortorder = 'ASC';
					} else {
						$ii.sortorder = 'DESC';
					}
					self.sortkey = $i; // save indexnya
				}
			}
		});

		// bersihin data sort selain index sortkey
		this.keys.forEach(($ii, $i) => {
			if ($i !== self.sortkey) {
				$ii.sortorder = '';
			}
		});

		this.getData(this.page);
	}

	public doAPI(data: any): void {
		const self = this;
		const apiurl = data.apiurl;
		const apimethod = data.apimethod;
		const apiparams = data.apiparams;

		if (apimethod === 'GET') {
			this.http.sendGetRequest2(apiurl, apiparams).subscribe(() => {
				self.getData(self.page);
			});
		} else if (apimethod === 'POST') {
			this.http.sendPostRequest2(apiurl, apiparams).subscribe(() => {
				self.getData(self.page);
			});
		}
	}

	public attendanceChecklist(data: any): void {
		const self = this;

		this.http.sendPostRequest2('programticketattendance/attend/toggle', {
			id: data
		}).subscribe(() => {
			self.getData(self.page);
		});
	}

	public getData(pageNumber: number): void {
		this.isloading = this.qrList.length && this.currentTab === '3' ? false : true; // kepake di listtable
		const self = this;
		if (this.registrantId === 0 || isNaN(this.registrantId)) {
			setTimeout(() => {
				self.modal.show('Error', 'No parameter Registrant Id.', 'danger');
			}, 100);
			return;
		}

		this.page = pageNumber;
		if (typeof pageNumber === 'string') {
			this.page = parseInt(pageNumber, 10);
		}
		const param = {
			page: this.page,
			paginate: this.global.defaultpaginate,
			programId: this.registrantId,
			sortBy: this.sortkey && this.keys[this.sortkey].sortcolumn || '',
			sortDirection: this.sortkey && this.keys[this.sortkey].sortorder || '',
			name: this.keyword || ''
		};

		switch (this.currentTab) {
			case '1': // Tab registrant
				this.http.sendGetRequest2('programticket/all/filtered', param).subscribe((response: any) => {
					if (response.api_status) {

						const result = response.data.programtickets.data;
						self.datas = [],
						self.keys = [
							{
								label: 'NAME',
								value: 'name',
								showtype: 'text',
								minwidth: false,
								priority: 0,
								maxlength: 10, // maximum length
								opensort: false,
								sortcolumn: '',
								sortorder: ''
							},
							{
								label: 'REGISTERED AT',
								value: 'register_at',
								showtype: 'datetime',
								minwidth: false,
								priority: 1,
								maxlength: null,
								opensort: true,
								sortcolumn: 'created_at',
								sortorder: ''
							},
							{
								label: 'UPDATED AT',
								value: 'updated_at',
								showtype: 'datetime',
								minwidth: false,
								priority: 2,
								maxlength: null,
								opensort: true,
								sortcolumn: 'updated_at',
								sortorder: ''
							},
							{
								label: 'STATUS',
								value: 'status',
								showtype: 'text',
								minwidth: false,
								priority: 0,
								maxlength: null,
								opensort: false,
								sortcolumn: '',
								sortorder: ''
							}
						];

						self.datas = result.map(item => {
							return {
								name: item.user.fullname,
								status: item.status,
								updated_at: item.updated_at,
								register_at: item.created_at,
								actions: [
									{
										label: 'Resend Confirmation Email',
										message: 'Are you sure you want to resend confirmation email ?',
										url: '',
										type: 'question',
										apimethod: 'GET',
										apiurl: 'programregistrant/resend-email',
										apiparams: {
											programTicketId: item.id,
											userId: item.user.id,
											type: 'Class'
										}
									},
									{
										label: 'Remove Registrant',
										message: '',
										url: '',
										type: 'danger',
										apimethod: 'GET',
										apiurl: 'programregistrant/remove',
										apiparams: {
											programTicketId: item.id
										}
									}
								]
							};
						});

						self.navigations = {
							from: response.data.programtickets.from,
							to: response.data.programtickets.to,
							total: response.data.programtickets.total,
							last_page: response.data.programtickets.last_page,
							per_page: response.data.programtickets.per_page,
							current_page: response.data.programtickets.current_page,
							search_by: 'name'
						};

						self.listtable.generateNavigationList(self.navigations.last_page, self.navigations.current_page);
					} else {
						self.modal.show('Error', response.message, 'danger');
					}
					self.isloading = false; // kepake di listtable
				}, (error: any) => {
					self.modal.show('Error 500', error.message, 'danger');
					self.isloading = false; // kepake di listtable
				});
				break;
			case '2':
				this.http.sendGetRequest2('programticketattendance/all-list', param).subscribe((response: any) => {

					if (response.api_status) {

						const result = response.data;
						self.datas = [],
						self.keys = [
							{
								label: 'NAME',
								value: 'name',
								showtype: 'text',
								minwidth: false,
								priority: 0,
								maxlength: 10, // maximum length
								opensort: false,
								sortcolumn: '',
								sortorder: ''
							}
						];
						for (let index = 0; index < self.attendanceCount; index++) {
							self.keys.push({
								label: index + 1,
								value: `checkbox-${index + 1}`,
								showtype: 'checkbox',
								align: 'center',
								minwidth: false,
								priority: 0,
								maxlength: 10, // maximum length
								opensort: false,
								sortcolumn: '',
								sortorder: ''
							});
						}
						self.datas = result.data.map((data) => {
							let temp = {
								name: data.name
							};
							for (let index = 0; index < data.attendance.length; index++) {
								temp = {
									...temp,
									[`checkbox-${index + 1}`]: {
										id: data.attendance[index].programticketattendance_id,
										status: data.attendance[index].ispresent
									}
								};
							}
							return temp;
						});

						self.navigations = {
							from: response.data.from,
							to: response.data.to,
							total: response.data.total,
							last_page: response.data.last_page,
							per_page: response.data.per_page,
							current_page: response.data.current_page,
							search_by: 'name'
						};

						self.listtable.generateNavigationList(self.navigations.last_page, self.navigations.current_page);
					} else {
						self.modal.show('Error', response.message, 'danger');
					}
					self.isloading = false; // kepake di listtable
				}, (error: any) => {
					self.modal.show('Error 500', error.message, 'danger');
					self.isloading = false; // kepake di listtable
				});
				break;
			default:
				break;
		}
	}

}
