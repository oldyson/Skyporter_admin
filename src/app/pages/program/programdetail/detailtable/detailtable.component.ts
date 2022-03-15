import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { GlobalService } from './../../../../global.service';
import { HelperService } from './../../../../helper.service';
import { HttpService } from './../../../../http.service';
import { ListtableComponent } from './../../../../components/listtable/listtable.component';
import { ListattendancetableComponent } from './../../../../components/listattendancetable/listattendancetable.component';
import { ListattendanceaddbyemailComponent } from './../../../../components/listattendanceaddbyemail/listattendanceaddbyemail.component';
import { TablefilelistComponent } from './filelist/filelist.component';
import swal from 'sweetalert2';

import {
	faSpinner as fadSpinner,
} from '@fortawesome/pro-duotone-svg-icons';
import {
	faTimes as farTimes
} from '@fortawesome/pro-regular-svg-icons';

@Component({
	selector: 'programdetail-detailtable',
	templateUrl: './detailtable.component.html',
	styleUrls: ['./detailtable.component.scss']
})
export class DetailtableComponent implements OnInit {
	@ViewChild('listtableticket', { static: false }) private listtableticket: ListtableComponent;
	@ViewChild('listtablevolunteer', { static: false }) private listtablevolunteer: ListtableComponent;
	@ViewChild('listtableattendance', { static: false }) private listtableattendance: ListattendancetableComponent;
	@ViewChild('filelistmodal', { static: false }) private filelistmodal: TablefilelistComponent;
	@ViewChild('listattendanceaddbyemail') listattendanceaddbyemail: ListattendanceaddbyemailComponent;
	@Input() program: any;
	@Input() programId: number;
	@Input() programType: string;
	@Input() dataAttendanceCount: number;
	@Input() dataQrList: any;
	@Input() programStart: string;
	@Input() programEnd: string;
	@Output() refreshDetail = new EventEmitter<boolean>();
	public farTimes = farTimes;
	public fadSpinner = fadSpinner;
	public isloading: boolean;
	public isLoadingAdd: boolean;
	public isLoadingSearch: boolean;
	public sortkey: any;
	public keyword: string;
	public statusMember: any;
	public formRight: any;
	public formLeft: any;
	public listChildren: any;
	public addRegistrantMenu: any;
	public searchResult: any;
	public attendanceCount: any;
	public selectedAddRegistrantMenu;
	public pageattendance: number;
	public pageticket: number;
	public pagevolunteer: number;
	public keys;
	public navigationattendances;
	public navigationtickets;
	public navigationvolunteers;
	public datatickets;
	public dataattendances;
	public datavolunteers;
	public exportfilter;
	public typeExport;
	public tabs;
	public qrList;
	public registrantstartat;
	public registrantendat;
	public status;
	public currentTabIndex: number;

	constructor(
		public global: GlobalService,
		public helper: HelperService,
		public http: HttpService,
	) {
		this.selectedAddRegistrantMenu = '';
		this.formLeft = {
			searchResult: {
				fullname: null,
				email: null,
				phone: null,
				gender: null,
				birthdate: null,
			},
			isLoadingSearch: false,
			status: 'Member',
			keywordMember: null,
			firstTimeJoiningClass: false
		};
		this.formRight = {
			searchResult: {
				fullname: null,
				email: null,
				phone: null,
				gender: null,
				birthdate: null,
			},
			isLoadingSearch: false,
			status: 'Member',
			fullname: null,
			email: null,
			phoneNumber: null,
			keywordMember: null,
			gender: null,
			dateBirth: null,
			firstTimeJoiningClass: false
		};

		this.listChildren = [];
		this.isLoadingAdd = false;
		this.isloading = false; // kepake di listtable
		this.registrantstartat = '';
		this.registrantendat = '';
		this.status = [];

		this.keys = {
			'attendance': [],
			'ticket': [
				{
					label: '#',
					value: 'id',
					showtype: 'number',
					minwidth: false,
					priority: 0,
					opensort: false,
					sortcolumn: 'id',
					sortorder: 'ASC'
				},
				{
					label: 'Payer Name',
					value: 'name',
					showtype: 'text',
					minwidth: false,
					priority: 0,
					opensort: false,
					sortcolumn: '',
					sortorder: ''
				},
				{
					label: 'Price',
					value: 'price',
					showtype: 'text',
					minwidth: false,
					priority: 1,
				},
				{
					label: 'Bought',
					value: 'updated_at',
					showtype: 'datetime',
					minwidth: false,
					priority: 1,
					maxlength: null,
					opensort: true,
					sortcolumn: 'updated_at',
					sortorder: ''
				},
				{
					label: 'Status',
					value: 'status',
					showtype: 'text',
					minwidth: false,
					priority: 0,
					maxlength: null,
					opensort: false,
					sortcolumn: '',
					sortorder: ''
				}
			],
			'volunteer': [
				{
					label: '#',
					value: 'id',
					showtype: 'number',
					minwidth: false,
					priority: 0,
					opensort: false,
					sortcolumn: 'id',
					sortorder: 'ASC'
				},
				{
					label: 'Volunteer Name',
					value: 'name',
					showtype: 'text',
					minwidth: false,
					priority: 0,
					opensort: false,
					sortcolumn: '',
					sortorder: ''
				},
				{
					label: 'Assigned',
					value: 'created_at',
					showtype: 'datetime',
					minwidth: false,
					priority: 1,
					maxlength: null,
					opensort: true,
					sortcolumn: 'created_at',
					sortorder: ''
				},
			],
		};
		this.sortkey = {
			'attendance' : 0,
			'ticket' : 0,
			'volunteer' : 0,
		};

		this.exportfilter = {
			registrant: {
				startDateExportFilter: {},
				endDateExportFilter: {},
				isExport: true,
				isFilter: true,
				dropdownExportMenu: [
					'Excel',
					'Csv'
				],
				datas: [{
					groupName: 'Time',
					type: 'date',
					selected: true,
					datas: [1]
				}, {
					groupName: 'Status',
					type: 'select',
					selected: false,
					datas: [{
						filterName: 'Pending',
						selected: false
					}, {
						filterName: 'Approved',
						selected: false
					}, {
						filterName: 'Rejected',
						selected: false
					}]
				}]
			},
			attendance: {
				startDateExportFilter: {},
				endDateExportFilter: {},
				isExport: true,
				isFilter: false,
				dropdownExportMenu: [],
				datas: []
			},
			volunteer: {
				startDateExportFilter: {},
				endDateExportFilter: {},
				isExport: false,
				isFilter: false,
				dropdownExportMenu: [],
				datas: []
			}
		};

		this.tabs = [
			{
				value: 'ticket',
				label: 'Registrant',
			},
			{
				value: 'attendance',
				label: 'Attendance',
			},
			{
				value: 'qrcode',
				label: 'Check-In',
			},
			{
				value: 'volunteer',
				label: 'Volunteers List',
			},
		];

		this.addRegistrantMenu = [
			'Single',
			'Married Couple',
			'Married with Child',
			'Non Married Couple',
			'Single: Mult. Emails',
		];

		this.statusMember = [{
			id: 'Member',
			name: 'Member'
		}, {
			id: 'Non Member',
			name: 'Non Member'
		}];

		this.currentTabIndex = 0;
	}

	ngOnInit(): void {
		this.getData(1);
	}

	public alertAddRegistrant(value: any): any {
		if (value === 'Single') {
			swal.fire({
				title: 'Failed',
				text: `Can't add user single in ${this.selectedAddRegistrantMenu}`,
				icon: 'error',
				allowOutsideClick: false,
				confirmButtonText: 'ok'
			});
		}
	}

	public handleInput(typeForm: string): void {
		if (typeForm === 'formLeft') {
			isNaN(this.formLeft.keywordMember) ? this.searchMemberForm(typeForm) : '';
		} else {
			isNaN(this.formRight.keywordMember) ? this.searchMemberForm(typeForm) : '';
		}
	}

	public searchMemberForm(formPosition: string): void {
		formPosition === 'formLeft' ? this.formLeft.isLoadingSearch = true : this.formRight.isLoadingSearch = true;
		const param = {
			search: formPosition === 'formLeft' ? this.formLeft.keywordMember : this.formRight.keywordMember,
			showColumn: 'fullname,email,document_id,phone,gender,birthdate'
		};

		this.http.sendGetRequest2('user/search', param).subscribe((response: any) => {
			if (response.api_status) {
				const result = response.data.user;
				if (formPosition === 'formLeft') {
					if (this.selectedAddRegistrantMenu === 'Married Couple' || this.selectedAddRegistrantMenu === 'Married with Child') {
						if (result.maritalstatus.name === 'Single') {
							this.formRight.searchResult = {};
							this.listChildren = [];
							this.alertAddRegistrant(result.maritalstatus.name);
						} else {
							this.formRight.searchResult = {};
							this.formLeft.searchResult = result;
							if(result.gender == 'Male')
								this.formRight.searchResult = result?.userfamily?.user2;
							else{
								this.formRight.searchResult = result?.userfamily?.user;
							}
						}
					} else {
						this.formLeft.searchResult = result;
					}
					if (this.selectedAddRegistrantMenu === 'Married with Child') {
						this.listChildren = [];
						this.listChildren = result.userfamily?.userfamilychilds.map(item => {
							return {
								...item,
								isBiologicalChild: false
							};
						});
					}
				} else if (formPosition === 'formRight') {
					this.formRight.searchResult = result;
				}
			} else {
				swal.fire({
					title: 'Error',
					text: response.message,
					icon: 'warning',
					confirmButtonText: 'OK'
				});
			}
			formPosition === 'formLeft' ? this.formLeft.isLoadingSearch = false : this.formRight.isLoadingSearch = false;
		}, (error: any) => {
			swal.fire({
				title: 'Error ' + error.status,
				html: this.helper.changeEOLToBr(error.error.message),
				icon: 'warning',
				confirmButtonText: 'OK'
			});
			formPosition === 'formLeft' ? this.formLeft.isLoadingSearch = false : this.formRight.isLoadingSearch = false;
		});
	}

	public addRegistrant(): void {
		swal.fire({
			title: 'Are you sure?',
			text: 'Make sure the data is correct',
			icon: 'question',
			allowOutsideClick: false,
			showCancelButton: true,
			confirmButtonText: 'Save'
		}).then((result) => {
			if (result.isConfirmed) {
				this.isLoadingAdd = true;
				const tempRelation = {
					ptisnotfirst: this.formLeft.firstTimeJoiningClass ? 1 : 0,
					pt2isnotfirst: this.formRight.firstTimeJoiningClass ? 1 : 0
				};

				let param = {
					id: this.programId,
					user_id: this.formLeft?.searchResult?.id,
					iscouple: this.selectedAddRegistrantMenu === 'Single' ? 0 : 1,
					quantity: 1,
					ischurchsupplement: 0,
					churchsupplement_id: 0,
					relation: JSON.stringify(tempRelation),
					type: this.helper.capitalizeFirstWord(this.programType),
					isuser: 1,
					children: this.listChildren?.map(item => {
						return {
							id: item.id,
							isbiologicalchild: item.isBiologicalChild
						};
					})
				};

				if ((this.selectedAddRegistrantMenu != 'Single' && this.program.isreqfamily == 0 && this.program.withspouse == 0) || this.selectedAddRegistrantMenu == 'Non Married Couple') {
					const tempFormRight = {
						user2_id: this.formRight?.searchResult?.id,
						user2name: this.formRight?.searchResult?.id != null ? null : this.formRight?.searchResult?.fullname,
						user2phone: this.formRight?.searchResult?.id != null ? null : this.formRight?.searchResult?.phone.toString(),
						user2gender: this.formRight?.searchResult?.id != null ? null : this.formRight?.searchResult?.gender,
						user2email: this.formRight?.searchResult?.id != null ? null : this.formRight?.searchResult?.email,
						user2birthdate: this.formRight?.searchResult?.id != null ? null : this.formRight?.searchResult?.birthdate
					};

					param = {
						...param,
						...tempFormRight
					};
				}

				this.http.sendPostRequest2('program/register', param).subscribe((response: any) => {
					if (response.api_status) {
						swal.fire({
							title: 'Success!',
							icon: 'success',
							allowOutsideClick: false,
							showCancelButton: false,
							confirmButtonText: 'Close'
						}).then(() => {
							this.formLeft.status = 'Member';
							this.formRight.status = 'Member';
							this.formLeft.firstTimeJoiningClass = false;
							this.formLeft.firstTimeJoiningClass = false;
							this.formLeft.searchResult = {};
							this.formRight.searchResult = {};
							this.listChildren = [];
							this.refreshDetail.emit();
						});
						this.isLoadingAdd = false;
					} else {
						this.isLoadingAdd = false;
						swal.fire({
							title: 'Error',
							text: response.message,
							icon: 'warning',
							confirmButtonText: 'OK'
						});
					}
				}, (error: any) => {
					this.isLoadingAdd = false;
					swal.fire({
						title: 'Error ' + error.status,
						html: this.helper.changeEOLToBr(error.error.message),
						icon: 'warning',
						confirmButtonText: 'OK'
					});
				});
			}
		});
	}

	public showForm(item: string): void {
		if(item === "Single: Mult. Emails") {
			this.inputAttendanceByEmails();
			this.selectedAddRegistrantMenu = null;
		} else {
			this.formLeft.searchResult = {};
			this.formRight.searchResult = {};
			this.formLeft.status = 'Member';
			this.formRight.status = 'Member';
			this.formLeft.firstTimeJoiningClass = false;
			this.formRight.firstTimeJoiningClass = false;
			this.selectedAddRegistrantMenu = item;
		}
	}

	public closeForm(): void {
		this.selectedAddRegistrantMenu = null;
	}

	public initKeyAttendance(): void {
		this.keys.attendance = [
			{
				label: '#',
				value: 'id',
				showtype: 'number',
				minwidth: false,
				priority: 0,
				opensort: false,
				sortcolumn: 'id',
				sortorder: 'DESC'
			},
			{
				label: 'Attendance Name',
				value: 'name',
				showtype: 'text',
				minwidth: false,
				priority: 0,
				opensort: false,
				sortcolumn: '',
				sortorder: ''
			},
			{
				label: 'Seat',
				value: 'seat',
				showtype: 'text',
				minwidth: true,
				priority: 1,
				opensort: false,
				sortcolumn: '',
				sortorder: ''
			},
		];

		for (let index = 0; index < this.attendanceCount; index++) {
			this.keys.attendance.push({
				label: index + 1,
				value: `checkbox-${index + 1}`,
				showtype: 'attendance',
				align: 'center',
				minwidth: true,
				priority: 0,
			});
		}
	}

	public searchData(keyword: string): void {
		this.keyword = keyword;

		this.getData(1);
	}

	public sortDataBy(table: string, column: string): void {
		this.keys[table].forEach(($ii, $i) => {
			if ($ii.sortcolumn != null) {
				if ($ii.sortcolumn === column) {
					// kalo sama baru di cek
					if ($ii.sortorder === ''
						|| $ii.sortorder === 'DESC') {
						$ii.sortorder = 'ASC';
					} else {
						$ii.sortorder = 'DESC';
					}
					this.sortkey[table] = $i; // save indexnya
				}
			}
		});

		// bersihin data sort selain index sortkey
		this.keys[table].forEach(($ii, $i) => {
			if ($i !== this.sortkey[table]) {
				$ii.sortorder = '';
			}
		});

		this.getData();
	}

	public doFunction(data: any): void {
		this.filelistmodal.showDialog(data);
	}

	public doAPI(data: any): void {
		const apiurl = data.apiurl;
		const apimethod = data.apimethod;
		const apiparams = data.apiparams;

		if (apimethod === 'GET') {
			this.http.sendGetRequest2(apiurl, apiparams).subscribe(() => {
				this.getData();
			});
		} else if (apimethod === 'POST') {
			this.http.sendPostRequest2(apiurl, apiparams).subscribe(() => {
				this.getData();
			});
		}
	}

	public setTabId(index: number): void {
		this.currentTabIndex = index;
		// this.keys = [];
		if (this.tabs[this.currentTabIndex] != null) {
			if (this.tabs[this.currentTabIndex].value === 'attendance') {
				if (this.dataattendances == null)
					this.getData();
			} else if (this.tabs[this.currentTabIndex].value === 'ticket') {
				if (this.datatickets == null)
					this.getData();
			} else if (this.tabs[this.currentTabIndex].value === 'volunteer') {
				if (this.datavolunteers == null)
					this.getData();
			}
		}
		// ga refresh lagi kalo uda ada data sebelomnya, cuma pindah tab
	}

	public attendanceChecklist(data: any): void {
		this.http.sendPostRequest2('programticketattendance/attend/toggle', {
			id: data.id
		}).subscribe(() => {
			this.listtableattendance.doneToggle(data.id);
		});
	}

	public getData(pageNumber: number = null): void {
		if (pageNumber != null) {
			if (this.tabs[this.currentTabIndex].value === 'attendance') {
				this.pageattendance = pageNumber;
			} else if (this.tabs[this.currentTabIndex].value === 'ticket') {
				this.pageticket = pageNumber;
			} else if (this.tabs[this.currentTabIndex].value === 'volunteer') {
				this.pagevolunteer = pageNumber;
			}
		}

		if(this.pageattendance == null)
			this.pageattendance = 1;
		if(this.pageticket == null)
			this.pageticket = 1;
		if(this.pagevolunteer == null)
			this.pagevolunteer = 1;

		this.qrList = this.dataQrList;
		this.attendanceCount = this.dataAttendanceCount;
		this.initKeyAttendance();

		switch (this.tabs[this.currentTabIndex].value) {
			case 'ticket':
				this.exportfilter.registrant.startDateExportFilter = {
					year: parseInt(this.programStart?.split('-')[0]),
					month: parseInt(this.programStart?.split('-')[1]),
					day: parseInt(this.programStart?.split('-')[2].split(' ')[0])
				};
				this.exportfilter.registrant.endDateExportFilter = {
					year: parseInt(this.programEnd?.split('-')[0]),
					month: parseInt(this.programEnd?.split('-')[1]),
					day: parseInt(this.programEnd?.split('-')[2].split(' ')[0])
				};
				this.getTicketData();
				break;

			case 'attendance':
				this.exportfilter.attendance.startDateExportFilter = {
					year: parseInt(this.programStart?.split('-')[0]),
					month: parseInt(this.programStart?.split('-')[1]),
					day: parseInt(this.programStart?.split('-')[2].split(' ')[0])
				};
				this.exportfilter.attendance.endDateExportFilter = {
					year: parseInt(this.programEnd?.split('-')[0]),
					month: parseInt(this.programEnd?.split('-')[1]),
					day: parseInt(this.programEnd?.split('-')[2].split(' ')[0])
				};
				this.getAttendanceData();
				break;

			case 'qrcode':
				// code...
				break;

			case 'volunteer':
				// code...
				this.getVolunteerData();
				break;

			default:
				// code...
				break;
		}
	}

	public handleDropdownExportRegistrant(data: string): void {
		this.typeExport = data === 'Excel' ? 'xls' : 'csv';
	}

	public generateExportDataAttendance(): void {
		const param = {
			programId: this.programId
		};

		swal.fire({
			title: 'Downloading file',
			text: 'Please wait...',
			icon: 'info',
			allowOutsideClick: false,
			showCancelButton: false,
			didOpen: () => {
				swal.showLoading();
			}
		});
		this.http.sendGetRequest2('programticketattendance/export/filtered', param).subscribe((response: any) => {
			if (response.api_status) {
				const link = document.createElement('a');
				link.href = response.data.path;
				link.download = response.data.path;
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);

				this.listtableticket.closeExportfilter();
				swal.close();
				swal.fire({
					title: 'Downloading success!',
					icon: 'success',
					allowOutsideClick: false,
					showCancelButton: false,
					confirmButtonText: 'Close'
				});
			} else {
				swal.fire({
					title: 'Error',
					text: response.message,
					icon: 'warning',
					confirmButtonText: 'OK'
				});
			}
			this.isloading = false; // kepake di listtable
		}, (error: any) => {
			swal.fire({
				title: 'Error ' + error.status,
				html: this.helper.changeEOLToBr(error.error.message),
				icon: 'warning',
				confirmButtonText: 'OK'
			});
			this.isloading = false; // kepake di listtable
		});
	}

	public generateExportDataRegistrant(data: any): void {
		const param = {
			id: this.programId,
			formatFile: this.typeExport,
			registrantstartat: data.startDate ? `${data.startDate.year}-${data.startDate.month}-${data.startDate.day} 00:00:00` : '',
			registrantendat: data.endDate ? `${data.endDate.year}-${data.endDate.month}-${data.endDate.day} 23:59:59` : '',
			status: data.filter[0]?.value.toString() || ''
		};
		this.http.sendGetRequest2('programregistrant/export/filtered', param).subscribe((response: any) => {
			if (response.api_status) {
				const link = document.createElement('a');
				link.href = response.data.path;
				link.download = response.data.path;
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);

				this.listtableticket.closeExportfilter();
			} else {
				swal.fire({
					title: 'Error',
					text: response.message,
					icon: 'warning',
					confirmButtonText: 'OK'
				});
			}
			this.isloading = false; // kepake di listtable
		}, (error: any) => {
			swal.fire({
				title: 'Error ' + error.status,
				html: this.helper.changeEOLToBr(error.error.message),
				icon: 'warning',
				confirmButtonText: 'OK'
			});
			this.isloading = false; // kepake di listtable
		});
	}

	public generateFilterDataRegistrant(data: any): void {
		this.registrantstartat = data.startDate ? `${data.startDate.year}-${data.startDate.month}-${data.startDate.day} 00:00:00` : "";
		this.registrantendat = data.endDate ? `${data.endDate.year}-${data.endDate.month}-${data.endDate.day} 23:59:59` : "";
		this.status = "";
		data.filter.forEach(item => {
			switch (item.type) {
				case 'Status':
					this.status = item.value.toString();
					break;
				default:
					break;
			}
		});
		this.pageticket = 1;
		this.getTicketData();
		this.listtableticket.closeExportfilter();
	}

	public getTicketData(): void {
		const param = {
			page: this.pageticket,
			paginate: this.global.defaultpaginate,
			programId: this.programId,
			sortBy: this.sortkey && this.keys.ticket[this.sortkey.ticket].sortcolumn || '',
			sortDirection: this.sortkey && this.keys.ticket[this.sortkey.ticket].sortorder || '',
			name: this.keyword || '',
			registrantstartat: this.registrantstartat,
			registrantendat: this.registrantendat,
			status: this.status
		};

		this.isloading = true;
		this.http.sendGetRequest2('programticket/all/filtered', param).subscribe((response: any) => {
			if (response.api_status) {
				const result = response.data.programtickets.data;
				this.datatickets = [];
				this.datatickets = result.map(item => {
					let fullname = '';
					if (item.user != null) {
						fullname = item.user.fullname;
					}
					if (item.user2 != null) {
						fullname += '<br>' + item.user2.fullname;
					}
					if (item.user2 == null
						&& item.user2name != null) {
						fullname += '<br>' + item.user2name;
					}

					if (item.programticketattendances_count != null) {
						if (item.programticketattendances_count > 0)
							fullname += '<br>Ticket for ' + item.programticketattendances_count + ' person(s).';
					}

					let price = '';
					if (item.programprice != null) {
						price = item.quantity + ' x <b>IDR ' + item.programprice.price + '</b>';
						if (item.programprice.name != null) {
							price += '<br>( ' + item.programprice.name + ' )';
						}
					} else {
						price = item.quantity + ' x <b>IDR ' + item.price + '</b>';
					}
					if (item.bookingcode != null) {
						if (price != '')
							price += '<br>';
						price += 'Code: ' + item.bookingcode;
					}

					return {
						id: item.id,
						name: fullname,
						status: item.status + ( item.programticketdocuments_count > 0 ? "<br><small>Total "+item.programticketdocuments_count+" file(s).</small>" : "<br><small>No file data.</small>" ),
						price: price,
						updated_at: item.updated_at == null ? item.created_at : item.updated_at,
						actions: [
							{
								label: 'View List of File',
								message: '',
								url: '',
								type: '',
								apimethod: '',
								apiparams: {},
								apifunction: 'showListFile'
							},
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
									type: this.helper.capitalizeFirstWord(this.programType)
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

				this.navigationtickets = {
					from: response.data.programtickets.from,
					to: response.data.programtickets.to,
					total: response.data.programtickets.total,
					last_page: response.data.programtickets.last_page,
					per_page: response.data.programtickets.per_page,
					current_page: response.data.programtickets.current_page,
					search_by: 'name'
				};

				this.listtableticket?.generateNavigationList(this.navigationtickets.last_page, this.navigationtickets.current_page);
			} else {
				swal.fire({
					title: 'Error',
					text: response.message,
					icon: 'warning',
					confirmButtonText: 'OK'
				});
			}
			this.isloading = false; // kepake di listtable
		}, (error: any) => {
			swal.fire({
				title: 'Error ' + error.status,
				html: this.helper.changeEOLToBr(error.error.message),
				icon: 'warning',
				confirmButtonText: 'OK'
			});
			this.isloading = false; // kepake di listtable
		});
	}

	public getAttendanceData() : void {
		const param = {
			page: this.pageattendance,
			paginate: this.global.defaultpaginate,
			programId: this.programId,
			sortBy: this.sortkey && this.keys.attendance[this.sortkey.attendance].sortcolumn || '',
			sortDirection: this.sortkey && this.keys.attendance[this.sortkey.attendance].sortorder || '',
			name: this.keyword || ''
		};

		this.isloading = true;
		this.http.sendGetRequest2('programticketattendance/all-list', param).subscribe((response: any) => {

			if (response.api_status) {

				const result = response.data;
				this.dataattendances = [],
				this.dataattendances = result.data.map((data) => {
					let temp = {
						id: data.id,
						name: data.name+"<br><small>"+data.email+"</small>",
						seat: data.attendance[0].seatx != null && data.attendance[0].seaty != null ? this.helper.toAlpha(data.attendance[0].seaty) + "" + data.attendance[0].seatx : "Not generated yet",
					};
					for (let index = 0; index < data.attendance.length; index++) {
						temp = {
							...temp,
							[`checkbox-${index + 1}`]: {
								id: data.attendance[index].programticketattendance_id,
								status: data.attendance[index].ispresent,
								loading: false,
							}
						};
					}
					return temp;
				});

				this.navigationattendances = {
					from: response.data.from,
					to: response.data.to,
					total: response.data.total,
					last_page: response.data.last_page,
					per_page: response.data.per_page,
					current_page: response.data.current_page,
					search_by: 'name'
				};

				this.listtableattendance?.generateNavigationList(this.navigationattendances.last_page, this.navigationattendances.current_page);
			} else {
				swal.fire({
					title: 'Error',
					text: response.message,
					icon: 'warning',
					showCancelButton: false,
					confirmButtonText: 'OK'
				});
			}
			this.isloading = false; // kepake di listtable
		}, (error: any) => {
			swal.fire({
				title: 'Error ' + error.status,
				html: this.helper.changeEOLToBr(error.error.message),
				icon: 'warning',
				showCancelButton: false,
				confirmButtonText: 'OK'
			});
			this.isloading = false; // kepake di listtable
		});
	}

	public getVolunteerData(): void {
		const param = {
			page: this.pagevolunteer,
			paginate: this.global.defaultpaginate,
			program_id: this.programId,
			sortBy: this.sortkey && this.keys.volunteer[this.sortkey.volunteer].sortcolumn || '',
			sortDirection: this.sortkey && this.keys.volunteer[this.sortkey.volunteer].sortorder || '',
			name: this.keyword || '',
		};

		this.isloading = true;
		this.http.sendGetRequest2('programvolunteer/filtered', param).subscribe((response: any) => {
			if (response.api_status) {
				const result = response.data.programvolunteers.data;
				this.datavolunteers = [];
				this.datavolunteers = result.map(item => {
					const fullname = (item.user ? item.user.fullname + (item.user.email ? "<br><small>" + item.user.email + "</small>" : "") : "User Deleted");

					return {
						id: item.id,
						name: fullname,
						created_at: item.created_at,
						actions: [
						]
					};
				});

				this.navigationvolunteers = {
					from: response.data.programvolunteers.from,
					to: response.data.programvolunteers.to,
					total: response.data.programvolunteers.total,
					last_page: response.data.programvolunteers.last_page,
					per_page: response.data.programvolunteers.per_page,
					current_page: response.data.programvolunteers.current_page,
					search_by: 'name'
				};

				this.listtablevolunteer?.generateNavigationList(this.navigationvolunteers.last_page, this.navigationvolunteers.current_page);
			} else {
				swal.fire({
					title: 'Error',
					text: response.message,
					icon: 'warning',
					confirmButtonText: 'OK'
				});
			}
			this.isloading = false; // kepake di listtable
		}, (error: any) => {
			swal.fire({
				title: 'Error ' + error.status,
				html: this.helper.changeEOLToBr(error.error.message),
				icon: 'warning',
				confirmButtonText: 'OK'
			});
			this.isloading = false; // kepake di listtable
		});
	}

	public setQrList(qrList: any): void {
		this.qrList = qrList;
	}

	public inputAttendanceByEmails(): void {
		this.listattendanceaddbyemail.show();
	}

}
