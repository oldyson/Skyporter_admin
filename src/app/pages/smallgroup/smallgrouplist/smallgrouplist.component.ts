import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpService } from './../../../http.service';
import { GlobalService } from './../../../global.service';
import { HelperService } from './../../../helper.service';
import { ListtableComponent } from './../../../components/listtable/listtable.component';
import swal from 'sweetalert2';

@Component({
	selector: 'app-smallgrouplist',
	templateUrl: './smallgrouplist.component.html',
	styleUrls: ['./smallgrouplist.component.scss']
})
export class SmallgrouplistComponent implements OnInit {
	@ViewChild(ListtableComponent) listtable: ListtableComponent;

	public maskSgNameByChurch;
	public datas;
	public keys;
	public navigations;
	public page;
	public exportfilter;
	public sortkey: number;
	public currentTabIndex: number;
	public isloading: boolean;
	public programType: string;
	public sgId: string;
	public name: string;
	public churchId;
	public campusList;
	public status;
	public locations;
	public categories;
	public levels;
	public levelList;
	public campuses;
	public days;
	public dateTo;
	public dateFrom;
	public roles;
	public typeExport;
	public urlExport;
	public tabs

	constructor(
		private http: HttpService,
		private global: GlobalService,
		private helper: HelperService,
	) {
		this.maskSgNameByChurch = JSON.parse(localStorage.getItem('applicationfeatures')).filter(item => item.name === 'small-group')[0]?.applicationfeaturechurches[0]?.showname || 'small group';
		this.name = '';
		this.sgId = '';
		this.status = '';
		this.locations = '';
		this.categories = '';
		this.levels = 2; // default SG Leader
		this.campuses = '';
		this.days = '';
		this.dateTo = '';
		this.dateFrom = '';
		this.roles = '';
		this.churchId = JSON.parse(localStorage.getItem('church')).id;
		this.campusList = JSON.parse(localStorage.getItem('church')).campuses;
		this.sortkey = -1; // index 0 = 1, -1 is default value for sort
		this.isloading = false; // kepake di listtable
		this.currentTabIndex = 0;

		// showtype:
		// number, text, datetime,
		this.keys = [
			{
				label: '#', // NAMA Header Column (muncul)
				value: 'id', // [key] name
				showtype: 'number', // show type
				minwidth: false, // Press width, jadi 1%
				priority: 0, // 0 tidak hilang, dst..
				opensort: true, // bisa di sort
				sortcolumn: 'id', // Sort column [key]
				sortorder: 'DESC' // Sort order pertama
			},
			{
				label: 'Campus', // NAMA Header Column (muncul)
				value: 'campus', // [key] name
				showtype: 'text', // show type
				minwidth: true, // Press width, jadi 1%
				priority: 0, // 0 tidak hilang, dst..
				opensort: true, // bisa di sort
				sortcolumn: 'campus_id', // Sort column [key]
				sortorder: 'DESC' // Sort order pertama
			},
			{
				label: `${this.maskSgNameByChurch} Name`,
				value: 'name',
				showtype: 'text',
				minwidth: false,
				priority: 0,
				maxlength: 30, // maximum length
				opensort: true,
				sortcolumn: 'name',
				sortorder: ''
			},
			{
				label: `${this.maskSgNameByChurch} Category`,
				value: 'category',
				showtype: 'text',
				minwidth: false,
				priority: 1,
				opensort: true,
				sortcolumn: 'smallgroupcategory_id',
				sortorder: ''
			},
			{
				label: `${this.maskSgNameByChurch} Leader (s)`,
				value: 'leader',
				value2: 'leader2',
				showtype: 'text',
				minwidth: false,
				priority: 2,
				maxlength: 22, // maximum length
				opensort: false,
				sortcolumn: '',
				sortorder: ''
			},
			{
				label: 'Members',
				value: 'member',
				showtype: 'number',
				minwidth: false,
				priority: 3,
				opensort: true,
				sortcolumn: 'smallgroupmembers_count',
				sortorder: ''
			},
			{
				label: 'Day',
				value: 'day',
				showtype: 'text',
				minwidth: false,
				priority: 3,
				opensort: true,
				sortcolumn: 'appointmentdefaultday',
				align: 'center',
				sortorder: ''
			},
			{
				label: 'Time',
				value: 'time',
				showtype: 'text',
				minwidth: false,
				priority: 3,
				maxlength: null,
				opensort: true,
				sortcolumn: 'appointmentdefaulttime',
				align: 'center',
				sortorder: ''
			},
			{
				label: 'Status',
				value: 'status',
				showtype: 'text',
				minwidth: false,
				priority: 0,
				maxlength: null,
				opensort: true,
				sortcolumn: 'status',
				align: 'center',
				sortorder: ''
			}
		];

		this.exportfilter = {
			isExport: true,
			isFilter: true,
			dropdownExportMenu: [
				`${this.maskSgNameByChurch}`,
				'Member',
				'Request'
			],
			datas: []
		};
	}

	ngOnInit(): void {
		this.getData(1);
		this.getRegencyByChurchId();
		this.getDays();
		this.getCampus();
		this.getCategory();
		this.getSgLevel();
		this.getRole();
		this.getDate();
	}

	public setTabId(index: number, tab: any): void {
		this.currentTabIndex = index;
		this.levels = tab.value;
		this.getData(0);
		// this.keys = []
		// ga refresh lagi kalo uda ada data sebelomnya, cuma pindah tab
	}

	public handleDropdownExport(value: any): void {
		switch (value) {
			case `${this.maskSgNameByChurch}`:
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
					item.groupName != `${this.maskSgNameByChurch} Level` && item.groupName != 'Date' ?
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

	public searchData(name: string): void {
		this.name = name;

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
	public getDataFromExportFilter(data: any): void {
		const startDate = data.startDate;
		const endDate = data.endDate;
		this.dateTo = startDate != null ? `${startDate.year}/${startDate.month}/${startDate.day}` : "";
		this.dateFrom = endDate != null ? `${endDate.year}/${endDate.month}/${endDate.day}` : "";
		this.days = '';
		this.campuses = '';
		this.categories = '';
		this.locations = '';
		this.roles = '';
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
				case `${this.maskSgNameByChurch} Level`:
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

	public getData(pageNumber: number): void {
		const self = this;
		this.page = pageNumber;
		if (typeof pageNumber === 'string') {
			this.page = parseInt(pageNumber, 10);
		}
		const param = {
			page: this.page,
			paginate: this.global.defaultpaginate,
			sortBy: this.sortkey < 0 ? 'created_at' : this.keys[this.sortkey].sortcolumn, // created_at is default value if sortkey -1
			sortDirection: this.sortkey < 0 ? 'DESC' : this.keys[this.sortkey].sortorder, // DESC is default value if sortkey -1
			id: this.sgId,
			regency: this.locations.toString(),
			level: this.levels.toString(),
			category: this.categories.toString(),
			campus: this.campuses.toString(),
			day: this.days.toString(),
			status: this.status.toString(),
			name: this.name
			// untuk send null, kirim string kosong
		};
		this.isloading = true; // kepake di listtable
		this.http.sendGetRequest2('smallgroup/all/filtered', param).subscribe((response: any) => {
			if (response.api_status) {
				const sgResult = response.data.smallgroup;
				const datas = sgResult.data;
				const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
				self.datas = datas.map(item => {
					const memberCount = item.smallgroupmembers_count + (item.smallgroupleader?.user ? 1 : 0) + (item.smallgroupleader?.user2 ? 1 : 0) + (item.smallgroupleader2?.user ? 1 : 0) + (item.smallgroupleader2?.user2 ? 1 : 0);
					return {
						id: item.id,
						campus: item.campus?.name || 'No Campus',
						name: item.name,
						category: item.smallgroupcategory?.name,
						leader: item.smallgroupleader?.user?.fullname,
						leader2: item.smallgroupleader?.user2?.fullname,
						member: memberCount,
						day: item.appointmentdefaultday ? days[item.appointmentdefaultday] : 'Not Set',
						time: item.appointmentdefaulttime,
						status: item.status,
						actions: [
							{
								label: 'Preview',
								url: 'admin/smallgroup/detail?id=' + item.id,
								type: ''
							},
							{
								label: 'Edit',
								url: '/admin/smallgroup/form?id=' + item.id,
								type: ''
							},
							{
								label: 'Close Group',
								url: '',
								type: 'danger',
								apimethod: 'GET',
								apiurl: 'smallgroup/delete',
								confirmButtonText: 'Delete Group',
								apiparams: {
									id: item.id
								}
							},
						]
					};
				});

				self.navigations = {
					from: sgResult.from,
					to: sgResult.to,
					total: sgResult.total,
					last_page: sgResult.last_page,
					per_page: sgResult.per_page,
					current_page: sgResult.current_page,
					search_by: `${this.maskSgNameByChurch} Name`
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

	public getDays(): void {
		this.exportfilter.datas = [...this.exportfilter.datas, {
			groupName: 'Day',
			type: 'select',
			selected: false,
			visible: true,
			datas: this.helper.days.map(item => {
				return {
					filterName: item.title,
					value: item.id,
					selected: false
				};
			})
		}];
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
				this.levelList = response.data.smallgroup_level.map(item => {
					return {
						label: item.name,
						value: item.id
					};
				});
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
