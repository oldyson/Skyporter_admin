import { Component, OnInit, ViewChild } from '@angular/core';
import { ListtableComponent } from './../../../components/listtable/listtable.component';
import { HttpService } from './../../../http.service';
import { GlobalService } from './../../../global.service';
import { PopupModalComponent } from './../../../components/popup-modal/popup-modal.component';
import swal from 'sweetalert2';

@Component({
	selector: 'app-ministrylist',
	templateUrl: './ministrylist.component.html',
	styleUrls: ['./ministrylist.component.scss']
})
export class MinistrylistComponent implements OnInit {
	@ViewChild('mymodal', { static: false }) private modal: PopupModalComponent;
	@ViewChild(ListtableComponent) listtablegrouphead: ListtableComponent;
	@ViewChild(ListtableComponent) listtablesubgroup: ListtableComponent;
	@ViewChild(ListtableComponent) listtableministry: ListtableComponent;

	public groupfilters;
	public filtersResult;
	public filtersData;
	public data;
	public keys;
	public navigations;
	public page;
	public keyword: string;
	public sortkey: number;
	public isloading: boolean;
	public selectedTabIndex: number;
	public tabs: any;

	constructor(
		private http: HttpService,
		private global: GlobalService
	) {
		this.keyword = null;
		this.sortkey = 0; // index 0 = 1
		this.isloading = false; // kepake di listtable

		this.data = {
			groupHead: [],
			subGroup: [],
			ministry: []
		};

		this.tabs = [
			{
				label: 'Group Head',
				value: 'Group'
			},
			{
				label: 'Sub-Group',
				value: 'Subgroup'
			},
			{
				label: 'Ministry',
				value: 'Ministry'
			}
		];

		this.filtersResult = {
			ministrygroupId: '',
			ministrysubgroupId: '',
			status: ''
		};

		this.filtersData = {
			groupHead: {
				datas: [],
				isFilter: true
			},
			subGroup: {
				datas: [],
				isFilter: true
			},
			ministry: {
				datas: [],
				isFilter: true
			}
		};

		this.navigations = {
			groupHead: {
				search_by: 'Name'
			},
			subGroup: {
				search_by: 'Name'
			},
			ministry: {
				search_by: 'Name'
			}
		};

		// showtype:
		// number, text, datetime,
		this.keys = {
			groupHead: [
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
					label: 'Name',
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
					label: 'Head',
					value: 'headmember',
					showtype: 'text',
					minwidth: false,
					priority: 1,
					nullvalue: 'No Head'
				},
				{
					label: 'Total',
					value: 'totalmember',
					showtype: 'number',
					minwidth: false,
					priority: 0
				}
			],
			subGroup: [
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
					label: 'Name',
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
					label: 'Upper Level',
					value: 'upperlevel',
					showtype: 'text',
					minwidth: false,
					priority: 2,
					nullvalue: 'No Upper Level'
				},
				{
					label: 'Head',
					value: 'headmember',
					showtype: 'text',
					minwidth: false,
					priority: 1,
					nullvalue: 'No Head'
				},
				{
					label: 'Total',
					value: 'totalmember',
					showtype: 'number',
					minwidth: false,
					priority: 0
				}
			],
			ministry: [
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
					label: 'Ministry Name',
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
					label: 'Upper Level',
					value: 'upperlevel',
					showtype: 'text',
					minwidth: false,
					priority: 2,
					nullvalue: 'No Upper Level'
				},
				{
					label: 'Head',
					value: 'headmember',
					showtype: 'text',
					minwidth: false,
					priority: 1,
					nullvalue: 'No Head'
				},
				{
					label: 'Members',
					value: 'totalmember',
					showtype: 'number',
					minwidth: false,
					priority: 0
				},
				{
					label: 'Status',
					value: 'status',
					showtype: 'text',
					minwidth: false,
					priority: 3,
					nullvalue: 'No Status',
					align: 'center'
				}
			]
		};
	}

	ngOnInit(): void {
		this.changeSelectedTabIndex(2);
		this.getFilter();
		this.getData(1);
	}

	public generateFilterData(data: any): void {
		data.filter.forEach(item => {
			switch (item.type) {
				case 'Head':
					this.filtersResult.ministrygroupId = item.value.toString();
					break;
				case 'Upper Level':
					this.filtersResult.ministrysubgroupId = item.value.toString();
					break;
				case 'Status':
					this.filtersResult.status = item.value.toString();
					break;
				default:
					break;
			}
		});
		this.listtableministry.closeExportfilter();
		this.getData(1);
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

	public changeSelectedTabIndex(index: number): void {
		this.selectedTabIndex = index;
		if (this.tabs[this.selectedTabIndex] != null) {
			this.keyword = '';
			this.getData(1);
		}
	}

	public getFilter(): void {
		this.http.sendGetRequest2('ministry/filters', null).subscribe((response: any) => {
			if (response.api_status === true) {
				const groupFilterList = response.data.ministrygroups.map(item => {
					return {
						filterName: item.name,
						value: item.id,
						selected: false
					};
				});
				const subGroupFilterList = response.data.ministrysubgroups.map(item => {
					return {
						filterName: item.name,
						value: item.id,
						selected: false
					};
				});
				this.filtersData.ministry.datas = [{
					groupName: 'Head',
					type: 'select',
					selected: true,
					datas: groupFilterList
				}, {
					groupName: 'Upper Level',
					type: 'select',
					selected: true,
					datas: subGroupFilterList
				}, {
					groupName: 'Status',
					type: 'select',
					selected: true,
					datas: [{
						filterName: 'Open',
						value: 'Open',
						selected: false
					}, {
						filterName: 'Full',
						value: 'Full',
						selected: false
					}, {
						filterName: 'Closed',
						value: 'Closed',
						selected: false
					}]
				}];
			} else {
				this.modal.show('Error', response.message, 'danger');
			}
		}, (error: any) => {
			this.modal.show('Error 500', error.message, 'danger');
		});
	}

	public getData(pageNumber): void {
		if (!this.isloading) {
			this.page = pageNumber;
			if (typeof pageNumber === 'string') {
				this.page = parseInt(pageNumber, 10);
			}
			const param = {
				level: this.tabs[this.selectedTabIndex].value,
				page: this.page,
				paginate: this.global.defaultpaginate,
				sortBy: this.sortkey && this.keys[this.sortkey].sortcolumn || '',
				sortDirection: this.sortkey && this.keys[this.sortkey].sortorder || '',
				name: this.keyword || '',
				status: this.filtersResult?.status || '',
				ministrysubgroupId: this.filtersResult?.ministrysubgroupId || '',
				ministrygroupId: this.filtersResult?.ministrygroupId || ''
			};
			this.isloading = true; // kepake di listtable
			this.http.sendGetRequest2('ministry/all/filtered-admin', param).subscribe((response: any) => {
				if (response.api_status === true) {
					const ministryList = response.data.ministryList.data;
					switch (this.tabs[this.selectedTabIndex].value) {
						case 'Group':
							this.data.groupHead = ministryList.map(($ii) => {
								return {
									id: $ii.id,
									name: $ii.name,
									headmember: $ii.headMember,
									totalmember: $ii.totalMember,
									// actions: [
									// 	{
									// 		label: 'View Ministry',
									// 		url: 'admin/ministry/detail?id=' + $ii.id,
									// 		type: ''
									// 	},
									// 	{
									// 		label: 'Edit Ministry',
									// 		url: 'admin/ministry/edit?id=' + $ii.id + '&tab=' + this.selectedTabIndex,
									// 		type: ''
									// 	}
									// ]
								};
							});
							this.navigations.groupHead = {
								from: response.data.ministryList.from,
								to: response.data.ministryList.to,
								total: response.data.ministryList.total,
								last_page: response.data.ministryList.last_page,
								per_page: response.data.ministryList.per_page,
								current_page: response.data.ministryList.current_page,
								search_by: this.tabs[this.selectedTabIndex].label + ' Name'
							};
							this.listtablegrouphead.generateNavigationList(this.navigations.groupHead.last_page, this.navigations.groupHead.current_page);
							break;
						case 'Subgroup':
							this.data.subGroup = ministryList.map(($ii) => {
								return {
									id: $ii.id,
									name: $ii.name,
									upperlevel: $ii.upperLevel,
									headmember: $ii.headMember,
									totalmember: $ii.totalMember,
									// actions: [
									// 	{
									// 		label: 'View Ministry',
									// 		url: 'admin/ministry/detail?id=' + $ii.id,
									// 		type: ''
									// 	},
									// 	{
									// 		label: 'Edit Ministry',
									// 		url: 'admin/ministry/edit?id=' + $ii.id + '&tab=' + this.selectedTabIndex,
									// 		type: ''
									// 	}
									// ]
								};
							});
							this.navigations.subGroup = {
								from: response.data.ministryList.from,
								to: response.data.ministryList.to,
								total: response.data.ministryList.total,
								last_page: response.data.ministryList.last_page,
								per_page: response.data.ministryList.per_page,
								current_page: response.data.ministryList.current_page,
								search_by: this.tabs[this.selectedTabIndex].label + ' Name'
							};
							this.listtablesubgroup.generateNavigationList(this.navigations.subGroup.last_page, this.navigations.subGroup.current_page);
							break;
						case 'Ministry':
							this.data.ministry = ministryList.map(($ii) => {
								return {
									id: $ii.id,
									name: $ii.name,
									upperlevel: $ii.upperLevel,
									headmember: $ii.headMember,
									totalmember: $ii.totalMember,
									status: $ii.status,
									actions: [
										{
											label: 'View Ministry',
											url: 'admin/ministry/detail?id=' + $ii.id,
											type: ''
										},
										{
											label: 'Edit Ministry',
											url: 'admin/ministry/edit?id=' + $ii.id + '&tab=' + this.selectedTabIndex,
											type: ''
										},
										{
											label: 'Delete  Ministry',
											url: '',
											type: 'danger',
											apimethod: 'POST',
											apiurl: 'admin/ministry/delete',
											apiparams: {
												id: $ii.id
											}
										}
									]
								};
							});
							this.navigations.ministry = {
								from: response.data.ministryList.from,
								to: response.data.ministryList.to,
								total: response.data.ministryList.total,
								last_page: response.data.ministryList.last_page,
								per_page: response.data.ministryList.per_page,
								current_page: response.data.ministryList.current_page,
								search_by: this.tabs[this.selectedTabIndex].label + ' Name'
							};
							this.listtableministry.generateNavigationList(this.navigations.ministry.last_page, this.navigations.ministry.current_page);
							break;
						default:
							break;
					}

					this.isloading = false; // kepake di listtable
				} else {
					this.showErrorDialog(response.message);
				}
			}, (error: any) => {
				this.isloading = false; // kepake di listtable
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
