import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from './../../../http.service';
import { GlobalService } from './../../../global.service';
import { HelperService } from './../../../helper.service';
import { ListtableComponent } from './../../../components/listtable/listtable.component';
import { NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import swal from 'sweetalert2';

@Component({
	selector: 'app-smallgrouprequest',
	templateUrl: './smallgrouprequest.component.html',
	styleUrls: ['./smallgrouprequest.component.scss']
})
export class SmallgrouprequestComponent implements OnInit {
	@ViewChild(ListtableComponent) listtable: ListtableComponent;

	public maskSgNameByChurch;
	public datas;
	public keys;
	public navigations;
	public page;
	public exportfilter;
	public searchResult;
	public sortkey: number;
	public sgId: number;
	public isloading: boolean;
	public typeExport;
	public urlExport;
	public dateTo;
	public dateFrom;
	public status;
	public defaultStartDate;
	public defaultEndDate;

	constructor(
		private http: HttpService,
		private global: GlobalService,
		private helper: HelperService,
		private activatedRoute: ActivatedRoute,
		private calendar: NgbCalendar
	) {
		this.maskSgNameByChurch = JSON.parse(localStorage.getItem('applicationfeatures')).filter(item => item.name === 'small-group')[0]?.applicationfeaturechurches[0]?.showname || 'small group';
		this.activatedRoute.queryParams.subscribe(params => {
			this.sgId = parseInt(params.id, 10);
		});
		this.searchResult = '';
		this.dateTo = '';
		this.dateFrom = '';
		this.status = '';
		this.sortkey = -1; // index 0 = 1, -1 is default value for sort
		this.isloading = false; // kepake di listtable
		this.defaultStartDate = calendar.getPrev(calendar.getToday(), 'd', 7);
		this.defaultEndDate = calendar.getToday();
		this.keys = [
			{
				label: 'ID',
				value: 'id',
				showtype: 'text',
				minwidth: false,
				priority: 0,
				opensort: true,
				sortcolumn: 'id',
				sortorder: 'DESC'
			},
			{
				label: 'User Name',
				value: 'userName',
				value2: 'sgMember',
				showtype: 'text',
				minwidth: false,
				priority: 0,
				nullvalue: 'No Data',
				opensort: true,
				sortcolumn: 'user_id',
				sortorder: ''
			},
			{
				label: 'Leader',
				value: 'sgLeader',
				showtype: 'text',
				minwidth: true,
				priority: 1,
				nullvalue: 'No Data',
				maxlength: 40, // maximum length
				opensort: true,
				sortcolumn: 'smallgroupmember_id',
				sortorder: ''
			},
			{
				label: 'Requested on',
				value: 'createdAt',
				showtype: 'datetime',
				minwidth: false,
				priority: 1,
				maxlength: null, // maximum length
				opensort: true,
				sortcolumn: 'created_at',
				align: 'center',
				sortorder: ''
			},
			{
				label: 'Valid to',
				value: 'pendingValidTo',
				showtype: 'datetime',
				minwidth: true,
				priority: 1,
				opensort: true,
				sortcolumn: 'pendingvalid_to',
				sortorder: ''
			},
			{
				label: 'Status',
				value: 'status',
				showtype: 'text',
				minwidth: false,
				priority: 2,
				maxlength: null, // maximum length
				opensort: true,
				sortcolumn: 'status',
				align: 'center',
				sortorder: ''
			},
			{
				label: 'Approved / Rejected / Cancelled on',
				value: 'processedOn',
				showtype: 'datetime',
				minwidth: false,
				priority: 2,
				maxlength: null, // maximum length
				opensort: true,
				sortcolumn: 'deleted_at',
				align: 'center',
				sortorder: ''
			},
			{
				label: 'Day(s) since approval / rejection / cancellation',
				value: 'processedDays',
				showtype: 'text',
				minwidth: false,
				priority: 2,
				maxlength: null, // maximum length
				opensort: false,
				sortcolumn: 'deleted_at',
				align: 'center',
				sortorder: ''
			}
		];

		this.exportfilter = {
			isExport: true,
			isFilter: true,
			datas: [{
				groupName: 'Status',
				type: 'select',
				selected: true,
				visible: true,
				datas: this.helper.statusRequest.map(item => {
					return {
						filterName: item.name,
						value: item.value,
						selected: false
					};
				})
			}, {
				groupName: 'Date',
				type: 'date',
				selected: true,
				visible: true,
				datas: [1]
			}]
		};
	}

	ngOnInit(): void {
		this.getData(1);
	}

	public handleClickFilterExportButton(type: string): void {

		switch (type) {
			case 'filter':
				this.exportfilter.datas.filter(item => {
					if (item.groupName == 'Date') {
						item.visible = true;
					}
				});
				break;
			case 'export':
				this.exportfilter.datas.filter(item => {
					if (item.groupName == 'Date') {
						item.visible = true;
					}
				});
				break;
			default:
				break;
		}
	}

	public searchData(name: string): void {
		this.searchResult = name;

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
		this.dateTo = endDate ? `${endDate.year}/${endDate.month}/${endDate.day}` : '';
		this.dateFrom = startDate ? `${startDate.year}/${startDate.month}/${startDate.day}` : '';
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
	}

	public generateFilterData(data: any): void {
		this.getDataFromExportFilter(data);
		this.listtable.closeExportfilter();
		this.getData(1);
	}

	public generateExportData(data: any): void {
		this.getDataFromExportFilter(data);
		const param = {
			dateFrom: this.dateFrom,
			dateTo: this.dateTo,
			status: this.status
		};
		this.http.sendGetRequest2('smallgrouprequest/export/filtered', param).subscribe((response: any) => {
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

	public getData(pageNumber): void {
		const self = this;
		this.page = pageNumber;
		if (typeof pageNumber === 'string') {
			this.page = parseInt(pageNumber, 10);
		}
		const param = {
			paginate: this.global.defaultpaginate,
			page: this.page,
			name: this.searchResult,
			status: this.status,
			dateFrom: this.dateFrom,
			dateTo: this.dateTo,
			sortBy: this.sortkey < 0 ? 'created_at' : this.keys[this.sortkey].sortcolumn, // created_at is default value if sortkey -1
			sortDirection: this.sortkey < 0 ? 'DESC' : this.keys[this.sortkey].sortorder, // DESC is default value if sortkey -1
		};
		this.isloading = true; // kepake di listtable
		this.http.sendGetRequest2('smallgrouprequest/get-invitee', param).subscribe((response: any) => {
			if (response.api_status) {
				const result = response.data.smallgrouprequest;
				const resultDatas = result.data;
				self.datas = resultDatas.map(item => {
					let userName;
					let sgMember;

					if (item.smallgroupmember?.user) {
						userName = item.smallgroupmember.user2 ? `${item?.smallgroupmember?.user?.fullname} & ${item?.smallgroupmember?.user2?.fullname}` : item?.smallgroupmember?.user?.fullname;
					} else {
						userName = item.user2 ? `${item?.user?.fullname} & ${item?.user2?.fullname}` : item?.user?.fullname;
					}

					if (item.smallgroupmember?.smallgroup) {
						sgMember = `Transfer from ${item?.smallgroupmember?.smallgroup?.name} to ${item?.smallgroup?.name}`;
					} else {
						sgMember = item?.smallgroup?.name;
					}
					return {
						id: item.id,
						userName: userName,
						sgLeader: item?.smallgroup?.smallgroupleader?.user2 ? `${item?.smallgroup?.smallgroupleader?.user?.fullname} & ${item?.smallgroup?.smallgroupleader?.user2.fullname}` : item?.smallgroup?.smallgroupleader?.user?.fullname,
						sgMember: sgMember || 'No Data',
						createdAt: item.created_at,
						pendingValidTo: item.pendingvalid_to,
						status: (item.deleted_at && item.status != 'Approved' && item.status != 'Rejected' ? 'Cancelled' : item.status) + '<br/>' + (item.user_id ? '<small>New Request</small>' : '<small>Transfer</small>'),
						processedOn: item.deleted_at,
						processedDays: item.deleted_at ? this.helper.dateDiffInString(this.helper.getDatetime(item.deleted_at)) : null,
						actions: item.status != 'Approved' && item.status != 'Rejected' ? [
							{
								label: 'Approved',
								url: '',
								type: 'question',
								apimethod: 'POST',
								apiurl: 'smallgrouprequest/action',
								confirmButtonText: 'Approve',
								confirmButtonColor: '#8DC466',
								apiparams: {
									id: item.id,
									status: 'Approved'
								}
							},
							{
								label: 'Rejected',
								url: '',
								type: 'questionActionSgRequest',
								messageInput: 'Type your reason here...',
								messageInputValidation: 'You need to write reason!',
								apimethod: 'POST',
								apiurl: 'smallgrouprequest/action',
								confirmButtonText: 'Reject',
								apiparams: {
									id: item.id,
									status: 'Rejected'
								}
							},
						] : []
					};
				});

				self.navigations = {
					from: result.from,
					to: result.to,
					total: result.total,
					last_page: result.last_page,
					per_page: result.per_page,
					current_page: result.current_page,
					search_by: 'Name'
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
}
