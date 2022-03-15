import { Component, OnInit, ViewChild } from '@angular/core';
import swal from 'sweetalert2';
import { ListtableComponent } from './../../../components/listtable/listtable.component';
import { HttpService } from './../../../http.service';
import { GlobalService } from './../../../global.service';
import { HelperService } from './../../../helper.service';
import { PopupModalComponent } from './../../../components/popup-modal/popup-modal.component';

@Component({
	selector: 'app-smallgroupappointmentlist',
	templateUrl: './smallgroupappointmentlist.component.html',
	styleUrls: ['./smallgroupappointmentlist.component.scss']
})
export class SmallgroupappointmentlistComponent implements OnInit {
	@ViewChild('mymodal', {static: false}) private modal: PopupModalComponent;
	@ViewChild(ListtableComponent) listtable: ListtableComponent;
	public datas;
	public keys;
	public navigations;
	public page;
	public keyword: string;
	public sortkey: number;
	public isloading: boolean;
	public exportfilter;
	public typeExport;
	public urlExport;
	public sgId: string;
	public name: string;
	public churchId;
	public campusList;
	public status;
	public locations;
	public categories;
	public levels;
	public campuses;
	public days;
	public dateTo;
	public dateFrom;
	public roles;

	constructor(
		private http: HttpService,
		private global: GlobalService,
		private helper: HelperService,
	) {
		this.name = '';
		this.sgId = '';
		this.status = '';
		this.locations = '';
		this.categories = '';
		this.levels = '';
		this.campuses = '';
		this.days = '';
		this.dateTo = '';
		this.dateFrom = '';
		this.roles = '';
		this.churchId = JSON.parse(localStorage.getItem('church')).id;
		this.campusList = JSON.parse(localStorage.getItem('church')).campuses;

		this.keyword = null;
		this.sortkey = 0; // index 0 = 1
		this.isloading = false; // kepake di listtable

		// showtype:
		// number, text, datetime,
		this.keys = [
			{
				label: '#', // NAMA Header Column (muncul)
				value: 'id', // [key] name
				showtype: 'number', // show type
				minwidth: true, // Press width, jadi 1%
				priority: 0, // 0 tidak hilang, dst..
				opensort: false, // bisa di sort
				sortcolumn: 'id', // Sort column [key]
				sortorder: 'DESC' // Sort order pertama
			},
			{
				label: 'Title',
				value: 'name',
				showtype: 'text',
				minwidth: false,
				priority: 0,
				opensort: true,
				sortcolumn: 'title',
				sortorder: ''
			},
			{
				label: 'SG Name',
				value: 'smallgroupname',
				showtype: 'text',
				minwidth: false,
				priority: 1,
				nullvalue: 'No Small Group',
			},
			{
				label: 'Date',
				value: 'appointmentdatetime',
				showtype: 'datetime',
				minwidth: false,
				priority: 3,
				nullvalue: 'No Schedule',
				opensort: true,
				sortcolumn: 'appointmentdatetime',
				sortorder: ''
			},
			{
				label: 'Created By',
				value: 'created_by',
				showtype: 'text',
				minwidth: false,
				priority: 3,
				nullvalue: '',
				opensort: true,
				sortcolumn: 'appointmentdatetime',
				sortorder: ''
			},
			{
				label: 'Attendee',
				value: 'attend',
				showtype: 'text',
				minwidth: false,
				priority: 2,
				maxlength: null,
				align: 'center',
			},
		];

		this.exportfilter = {
			isExport: true,
			isFilter: true,
			dropdownExportMenu: [
				'Small Group',
				'Member',
				'Request'
			],
			datas: []
		};
	}

	ngOnInit(): void {
		this.getData(1);

		this.getRegencyByChurchId();
		this.getCampus();
		this.getCategory();
		this.getSgLevel();
		this.getRole();
		this.getDate();
	}

	public handleDropdownExport(value: any): void {
		switch (value) {
			case 'Small Group':
				this.typeExport = value;
				this.urlExport = 'smallgroup/export/filtered';
				this.exportfilter.datas.map(item => {
					item.groupName != 'Role' && item.groupName != 'Date' ?
						item.visible = true
						:
						item.visible = false;
				});
				break;
			case 'Member':
				this.typeExport = value;
				this.urlExport = 'smallgroupmember/export/filtered';
				this.exportfilter.datas.map(item => {
					item.groupName != 'SG Level' && item.groupName != 'Date' ?
						item.visible = true
						:
						item.visible = false;
				});
				break;
			case 'Request':
				this.typeExport = value;
				this.urlExport = 'smallgrouprequest/export/filtered';
				this.exportfilter.datas.map(item => {
					item.groupName != 'Role' ?
						item.visible = true
						:
						item.visible = false;
				});
				break;
			default:
				this.typeExport = 'Filter';
				this.exportfilter.datas.map(item => {
					item.groupName != 'Role' && item.groupName != 'Date' ?
						item.visible = true
						:
						item.visible = false;
				});
				break;
		}
	}

	public getDataFromExportFilter(data: any): void {
		const startDate = data.startDate;
		const endDate = data.endDate;
		this.dateTo = startDate != null ? `${startDate.year}/${startDate.month}/${startDate.day}` : "";
		this.dateFrom = endDate != null ? `${endDate.year}/${endDate.month}/${endDate.day}` : "";
		this.days = "";
		this.campuses = "";
		this.categories = "";
		this.locations = "";
		this.levels = "";
		this.roles = "";
		data.filter.forEach(item => {
			switch (item.type) {
				case 'Day':
					this.days = item.value.toString();
					break;
				case 'Campus':
					this.campuses = item.value.toString();
					break;
				case 'Category':
					this.categories = item.value.toString();
					break;
				case 'Location':
					this.locations = item.value.toString();
					break;
				case 'SG Level':
					this.levels = item.value.toString();
					break;
				case 'Role':
					this.roles = item.value.toString();
					break;
				default:
					break;
			}
		});
	}

	public generateFilterData(data: any): void {
		this.getDataFromExportFilter(data);
		this.listtable.closeExportfilter();
		this.getData(1);
	}

	public generateExportData(data: any): void {
		this.getDataFromExportFilter(data);
		const param = {
			location: this.locations,
			day: this.days,
			category: this.categories,
			level: this.typeExport !== 'Request' ? this.levels : '',
			campus: this.campuses,
			dateTo: this.typeExport === 'Request' ? this.dateTo : '',
			dateFrom: this.typeExport === 'Request' ? this.dateFrom : '',
			role: this.typeExport === 'Member' ? this.roles : ''
		};
		this.http.sendGetRequest2(this.urlExport, param).subscribe((response: any) => {
			if (response.api_status) {
				const link = document.createElement('a');
				link.href = response.data.path;
				link.download = response.data.path;
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);

				this.listtable.closeExportfilter();
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

	public searchData(keyword: string): void {
		this.keyword = keyword;

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

	public getData(pageNumber): void {
		if (!this.isloading) {
			const self = this;
			this.page = pageNumber;
			if (typeof pageNumber === 'string') {
				this.page = parseInt(pageNumber, 10);
			}
			const param = {
				page: this.page,
				paginate: this.global.defaultpaginate,
				sortBy: this.keys[this.sortkey].sortcolumn,
				sortDirection: this.keys[this.sortkey].sortorder,
				name: this.keyword != null ? ( this.keyword.length < 3 ? '' : this.keyword ) : '',
				smallgroupId: this.sgId,
				smallgroupCampus: this.campuses.toString(),
				smallgroupLevel: this.levels.toString(),
				smallgroupCategory: this.categories.toString(),

				// untuk send null, kirim string kosong
			};

			this.isloading = true; // kepake di listtable
			this.http.sendGetRequest2('smallgroupappointment/all/filtered', param).subscribe((response: any) => {

				if (response.api_status === true) {
					const smallgroupappointments = response.data.smallgroupappointments.data;
					let temp;

					self.datas = [];
					smallgroupappointments.forEach(($ii) => {
						temp = {
							id: $ii.id,
							name: '<b>' + $ii.smallgroupappointmenttype.name + '</b><br>' + $ii.name,
							smallgroupname: $ii.smallgroup.name,
							appointmentdatetime: self.helper.getDatetime($ii.appointmentdatetime),
							created_by: $ii.createdbyuser != null ? $ii.createdbyuser.fullname : 'No Creator',
							attend: '<b>' + $ii.smallgroupappointmentattendances_present_count + '</b> / ' + $ii.smallgroupappointmentattendances_count,
							actions: [
								{
									label: 'View Detail',
									url: '/admin/smallgroup/detail-appointments?id=' + $ii.id,
									type: ''
								}
							]
						};

						if ($ii.smallgroup_id != null) {
							temp.actions.push({
								label: 'View Small Group',
								url: '/admin/smallgroup/detail?id=' + $ii.smallgroup_id,
								type: ''
							});
						}

						self.datas.push(temp);
					});

					self.navigations = {
						from: response.data.smallgroupappointments.from,
						to: response.data.smallgroupappointments.to,
						total: response.data.smallgroupappointments.total,
						last_page: response.data.smallgroupappointments.last_page,
						per_page: response.data.smallgroupappointments.per_page,
						current_page: response.data.smallgroupappointments.current_page,
						search_by: 'Appointment Name'
					};

					self.listtable.generateNavigationList(self.navigations.last_page, self.navigations.current_page);
				} else {
					swal.fire({
						title: 'Error',
						text: response.message,
						icon: 'warning',
						confirmButtonText: 'OK',
					}).then(() => {
						// NOTHING
					});
				}
				self.isloading = false; // kepake di listtable
			}, (error: any) => {
				swal.fire({
					title: 'Error 505',
					text: error.message,
					icon: 'warning',
					confirmButtonText: 'OK',
				}).then(() => {
					// NOTHING
				});
				self.isloading = false; // kepake di listtable
			});
		}
	}


	public getRegencyByChurchId(): void {
		const param = {
			churchId: this.churchId
		};

		this.http.sendGetRequest2('smallgroup/location/by-church-id', param).subscribe((response: any) => {
			if (response.api_status) {
				this.exportfilter.datas = [...this.exportfilter.datas, {
					groupName: 'Location',
					type: 'select',
					selected: false,
					visible: true,
					datas: response.data.regency.map(item => {
						return {
							filterName: item.regency.name,
							value: item.regency_id,
							selected: false
						};
					})
				}];
			} else {
				swal.fire({
					title: 'Error',
					text: response.message,
					icon: 'warning',
					confirmButtonText: 'OK',
				}).then(() => {
					// NOTHING
				});
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

	public getCampus(): void {
		if (this.campusList) {

			this.exportfilter.datas = [...this.exportfilter.datas, {
				groupName: 'Campus',
				type: 'select',
				selected: false,
				visible: true,
				datas: [{
					filterName: 'NO CAMPUS',
					value: '',
					selected: false
				},
				...this.campusList.map(item => {
					return {
						filterName: item.name,
						value: item.id,
						selected: false
					};
				})]
			}];
		}
	}

	public getCategory(): void {
		const param = {
			churchId: this.churchId
		};

		this.http.sendGetRequest2('smallgroup/category/by-church-id', param).subscribe((response: any) => {
			if (response.api_status) {
				this.exportfilter.datas = [...this.exportfilter.datas, {
					groupName: 'Category',
					type: 'select',
					selected: false,
					visible: true,
					datas: response.data.categories.map(item => {
						return {
							filterName: item.name,
							value: item.id,
							selected: false
						};
					})
				}];
			} else {
				swal.fire({
					title: 'Error',
					text: response.message,
					icon: 'warning',
					confirmButtonText: 'OK',
				}).then(() => {
					// NOTHING
				});
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

	public getSgLevel(): void {
		this.http.sendGetRequest2('smallgroup/all-level').subscribe((response: any) => {
			if (response.api_status) {
				this.exportfilter.datas = [...this.exportfilter.datas, {
					groupName: 'SG Level',
					type: 'select',
					selected: false,
					visible: true,
					datas: response.data.smallgroup_level.map(item => {
						return {
							filterName: item.name,
							value: item.id,
							selected: false
						};
					})
				}];
			} else {
				swal.fire({
					title: 'Error',
					text: response.message,
					icon: 'warning',
					confirmButtonText: 'OK',
				}).then(() => {
					// NOTHING
				});
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

	public getRole(): void {
		this.http.sendGetRequest2('smallgroupmemberrole/get').subscribe((response: any) => {
			if (response.api_status) {
				this.exportfilter.datas = [...this.exportfilter.datas, {
					groupName: 'Role',
					type: 'select',
					selected: false,
					visible: true,
					datas: response.data.smallgroupmemberroles.map(item => {
						return {
							filterName: item.name,
							value: item.id,
							selected: false
						};
					})
				}];
			} else {
				swal.fire({
					title: 'Error',
					text: response.message,
					icon: 'warning',
					confirmButtonText: 'OK',
				}).then(() => {
					// NOTHING
				});
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

	public getDate(): void {
		this.exportfilter.datas = [...this.exportfilter.datas, {
			groupName: 'Date',
			type: 'date',
			selected: true,
			visible: true,
			datas: [1]
		}];
	}
}
