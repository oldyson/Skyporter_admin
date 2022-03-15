import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpService } from './../../../http.service';
import { HelperService } from './../../../helper.service';
import { GlobalService } from './../../../global.service';
import { ListtableComponent } from './../../../components/listtable/listtable.component';
import swal from 'sweetalert2';

@Component({
	selector: 'app-billinglist',
	templateUrl: './billinglist.component.html',
	styleUrls: ['./billinglist.component.scss']
})
export class BillinglistComponent implements OnInit {

	@ViewChild(ListtableComponent) listtable: ListtableComponent;
	public datas;
	public keys;
	public navigations;
	public page;
	public keyword: string;
	public sortkey: number;

	public isloadingheader: boolean;
	public isloadingdetail: boolean;
	public churchbillprice: any;
	public nowbill: {
		billfrom_at: Date | null,
		billuntil_at: Date | null,
		totaluser: number,
		minimumprice: number,
		extraprice: number,
		totalprice: number,
	};

	constructor(
		private http: HttpService,
		private helper: HelperService,
		private global: GlobalService,
	) { 
		// HEADER ===============
		this.isloadingheader = false;
		this.churchbillprice = null;
		this.nowbill = {
			billfrom_at: null,
			billuntil_at: null,
			totaluser: 0,
			minimumprice: 0,
			extraprice: 0,
			totalprice: 0,
		};

		// DETAIL ==============
		this.keyword = null;
		this.sortkey = 0; // index 0 = 1
		this.isloadingdetail = false; // kepake di listtable

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
				label: 'Bill Start Date',
				value: 'billed_at',
				showtype: 'text',
				minwidth: false,
				priority: 2,
				nullvalue: 'No Data',
				align: 'center',
			},
			{
				label: 'Bill Due Date',
				value: 'due_at',
				showtype: 'text',
				minwidth: false,
				priority: 2,
				nullvalue: 'No Data',
				align: 'center',
			},
			{
				label: 'Cycle From Date',
				value: 'cyclefrom_at',
				showtype: 'text',
				minwidth: false,
				priority: 1,
				nullvalue: 'No Data',
				align: 'center',
			},
			{
				label: 'Cycle until Date',
				value: 'cycleuntil_at',
				showtype: 'text',
				minwidth: false,
				priority: 1,
				nullvalue: 'No Data',
				align: 'center',
			},
			{
				label: 'User',
				value: 'totaluser',
				showtype: 'number',
				minwidth: false,
				priority: 2,
				maxlength: null,
				align: 'center',
			},
			{
				label: 'Status',
				value: 'status',
				showtype: 'text',
				minwidth: false,
				priority: 2,
				maxlength: null,
				align: 'center',
			},
			{
				label: 'ISO',
				value: 'currency',
				showtype: 'text',
				minwidth: false,
				priority: 3,
				maxlength: null,
				align: 'center',
			},
			{
				label: 'Total Billing',
				value: 'rate',
				showtype: 'number',
				minwidth: false,
				priority: 0,
				maxlength: null,
			}
		];
	}

	ngOnInit(): void {
		this.getCurrentBilling();
		this.getData(1);
	}

	public getCurrentBilling(){
		if (!this.isloadingheader) {
			this.isloadingheader = true;
			this.http.sendGetRequest2('church/bill/current').subscribe((response: any) => {
				if (response.api_status) {
					this.nowbill.billfrom_at = this.helper.getDatetime(response.data.billfrom_at);
					this.nowbill.billuntil_at = this.helper.getDatetime(response.data.billuntil_at);
					this.nowbill.totaluser = response.data.totaluser;
					this.nowbill.minimumprice = response.data.minimumprice;
					this.nowbill.extraprice = response.data.extraprice;
					this.nowbill.totalprice = response.data.totalprice;
					this.churchbillprice = response.data.churchbillprice;
				}
				this.isloadingheader = false;
			}, (error: any) => {
				this.isloadingheader = false;
			});
		}
	}

	public searchData(keyword: string): void {
		this.keyword = keyword;

		this.page = 1;
		this.getData(this.page);
	}

	public sortDataBy(column: string): void {
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
					this.sortkey = $i; // save indexnya
				}
			}
		});

		// bersihin data sort selain index sortkey
		this.keys.forEach(($ii, $i) => {
			if ($i !== this.sortkey) {
				$ii.sortorder = '';
			}
		});

		this.getData(this.page);
	}

	public doAPI(data: any): void {
		const apiurl = data.apiurl;
		const apimethod = data.apimethod;
		const apiparams = data.apiparams;

		if (apimethod === 'GET') {
			this.http.sendGetRequest2(apiurl, apiparams).subscribe(() => {
				this.getData(this.page);
			});
		} else if (apimethod === 'POST') {
			this.http.sendPostRequest2(apiurl, apiparams).subscribe(() => {
				this.getData(this.page);
			});
		}
	}

	public getData(pageNumber): void {
		if (!this.isloadingdetail) {
			this.page = pageNumber;
			if (typeof pageNumber === 'string') {
				this.page = parseInt(pageNumber, 10);
			}
			const param = {
				type: 'Email',
				page: this.page,
				paginate: this.global.defaultpaginate,
				sortBy: this.keys[this.sortkey].sortcolumn,
				sortDirection: this.keys[this.sortkey].sortorder,
				title: this.keyword != null ? ( this.keyword.length < 3 ? '' : this.keyword ) : ''
				// untuk send null, kirim string kosong
			};
			this.isloadingdetail = true; // kepake di listtable
			this.http.sendGetRequest2('church/bill/filtered', param).subscribe((response: any) => {
				if (response.api_status === true) {
					const churchbills = response.data.churchbills.data;
					let temp;

					this.datas = [];
					churchbills.forEach(($ii) => {
						temp = {
							id: $ii.id,
							billed_at: this.helper.makeDate($ii.billed_at),
							due_at: this.helper.makeDate($ii.due_at),
							cyclefrom_at: this.helper.makeDate($ii.cyclefrom_at),
							cycleuntil_at: this.helper.makeDate($ii.cycleuntil_at),
							status: $ii.status,
							totaluser: $ii.totaluser,
							currency: $ii.currency?.isoname,
							rate: $ii.rate,
							actions: [
								{
									label: 'Export PDF',
									url: '',
									apimethod: 'GET',
									apiurl: 'churchbill/pdf',
									apiparams: {
										id: $ii.id
									}
								},
							]
						};
						this.datas.push(temp);
					});

					this.navigations = {
						from: response.data.churchbills.from,
						to: response.data.churchbills.to,
						total: response.data.churchbills.total,
						last_page: response.data.churchbills.last_page,
						per_page: response.data.churchbills.per_page,
						current_page: response.data.churchbills.current_page,
						// search_by: 'Subject name'
					};

					this.listtable.generateNavigationList(this.navigations.last_page, this.navigations.current_page);
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
				this.isloadingdetail = false; // kepake di listtable
			}, (error: any) => {
				swal.fire({
					title: 'Error 505',
					text: error.message,
					icon: 'warning',
					confirmButtonText: 'OK',
				}).then(() => {
					// NOTHING
				});
				this.isloadingdetail = false; // kepake di listtable
			});
		}
	}

}
