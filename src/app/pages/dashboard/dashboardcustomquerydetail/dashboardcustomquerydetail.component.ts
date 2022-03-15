import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpService } from './../../../http.service';
import { HelperService } from './../../../helper.service';
import { GlobalService } from './../../../global.service';
import { ListtableComponent } from './../../../components/listtable/listtable.component';
import swal from 'sweetalert2';

@Component({
	selector: 'app-dashboardcustomquerydetail',
	templateUrl: './dashboardcustomquerydetail.component.html',
	styleUrls: ['./dashboardcustomquerydetail.component.scss']
})
export class DashboardcustomquerydetailComponent implements OnInit {

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
	public id: number;
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
		let self = this;
		this.activatedRoute.queryParams.subscribe(params => {
			self.id = params.id;
		});
		// showtype:
		// number, text, datetime,
		this.keys = [];
		

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
			id: this.id,
			page: this.page,
			paginate: this.global.defaultpaginate,
			sortBy: this.keys.length > 0 ? this.keys[this.sortkey].sortcolumn : null,
			sortDirection: this.keys.length > 0 ? this.keys[this.sortkey].sortorder : null,
			searchKeyword: this.keyword != null ? ( this.keyword.length < 3 ? '' : this.keyword ) : '',
			// untuk send null, kirim string kosong
		};
		this.isloading = true; // kepake di listtable
		this.http.sendPostRequest2('query/run', param).subscribe((response: any) => {
			if (response.api_status) {
				self.datas = response.data.results.data;
				
				if(self.keys.length == 0){
					let temp;
					let columns = Object.keys(response.data.results.data[0]);
					let idx = 0;
					columns.forEach(($ii) => {
						temp = {
							label: $ii, // NAMA Header Column (muncul)
							value: $ii, // [key] name
							showtype: 'text', // show type
							minwidth: false, // Press width, jadi 1%
							priority: idx++, // 0 tidak hilang, dst..
							opensort: true, // bisa di sort
							sortcolumn: $ii, // Sort column [key]
						};
						self.keys.push(temp);
					});
				}
				self.navigations = {
					from: response.data.results.from,
					to: response.data.results.to,
					total: response.data.results.total,
					last_page: response.data.results.last_page,
					per_page: response.data.results.per_page,
					current_page: response.data.results.current_page,
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
