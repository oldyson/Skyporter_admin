import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpService } from './../../../http.service';
import { HelperService } from './../../../helper.service';
import { GlobalService } from './../../../global.service';
import { ListtableComponent } from './../../../components/listtable/listtable.component';
import swal from 'sweetalert2';

@Component({
	selector: 'app-dashboardcustomquery',
	templateUrl: './dashboardcustomquery.component.html',
	styleUrls: ['./dashboardcustomquery.component.scss']
})
export class DashboardcustomqueryComponent implements OnInit {
	@ViewChild(ListtableComponent) listtable: ListtableComponent;
	public datas;
	public keys;
	public navigations;
	public page;
	public filterOptions;
	public startat;
	public endat;
	public keyword: string;
	public sortkey: number;
	public isloading: boolean;
	constructor(
		private http: HttpService,
		private global: GlobalService,
		private helper: HelperService,
		private activatedRoute: ActivatedRoute,
	) {
		this.keyword = null;
		this.sortkey = 0; // index 0 = 1
		this.isloading = false; // kepake di listtable
		this.startat = '';
		this.endat = '';

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
				label: 'Query Name', // NAMA Header Column (muncul)
				value: 'name', // [key] name
				showtype: 'text', // show type
				minwidth: false, // Press width, jadi 1%
				priority: 1, // 0 tidak hilang, dst..
				opensort: true, // bisa di sort
				sortcolumn: 'name', // Sort column [key]
				sortorder: '' // Sort order pertama
			},
			{
				label: 'Description',
				value: 'description',
				showtype: 'text',
				minwidth: false,
				priority: 2,
				opensort: false,
				sortcolumn: 'description',
				sortorder: ''
			},
			{
				label: 'Query',
				value: 'query',
				showtype: 'text',
				minwidth: false,
				priority: 3,
				nullvalue: 'No Data',
				opensort: false,
				sortcolumn: 'query',
				sortorder: ''
			}
		];
		

		this.filterOptions = {
			isExport: false,
			isFilter: false,
			datas: [{
				groupName: 'Time',
				type: 'date',
				selected: true,
				datas: [1]
			}]
		};
	}

	ngOnInit(): void {
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

	public generateFilterData(data: any): void {
		this.startat = `${data.startDate.year}-${data.startDate.month}-${data.startDate.day} 00:00:00`;
		this.endat = `${data.endDate.year}-${data.endDate.month}-${data.endDate.day} 23:59:59`;
		this.getData(1);
		this.listtable.closeExportfilter();
	}

	public getData(pageNumber): void {
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
			searchKeyword: this.keyword != null ? ( this.keyword.length < 3 ? '' : this.keyword ) : '',
			// untuk send null, kirim string kosong
		};
		this.isloading = true; // kepake di listtable
		this.http.sendGetRequest2('query/get', param).subscribe((response: any) => {
			if (response.api_status) {
				const datas = response.data.queries.data;
				let temp;

				self.datas = [];
				datas.forEach(($ii) => {
					temp = {
						id: $ii.id,
						name: $ii.name,
						description: $ii.description,
						query: $ii.query,
						actions: [
							{
								label: 'View',
								url: 'admin/dashboard/customquery/detail?id=' + $ii.id,
								type: ''
							},
						]
					};
					self.datas.push(temp);
				});


				self.navigations = {
					from: response.data.queries.from,
					to: response.data.queries.to,
					total: response.data.queries.total,
					last_page: response.data.queries.last_page,
					per_page: response.data.queries.per_page,
					current_page: response.data.queries.current_page,
					search_by: 'Search...'
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
