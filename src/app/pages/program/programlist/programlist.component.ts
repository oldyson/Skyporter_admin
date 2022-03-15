import { Component, OnInit, ViewChild } from '@angular/core';
import swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { ListtableComponent } from './../../../components/listtable/listtable.component';
import { HttpService } from './../../../http.service';
import { GlobalService } from './../../../global.service';
import { HelperService } from './../../../helper.service';

@Component({
	selector: 'app-programlist',
	templateUrl: './programlist.component.html',
	styleUrls: ['./programlist.component.scss']
})
export class ProgramlistComponent implements OnInit {

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
	public programType: string;

	constructor(
		private http: HttpService,
		private global: GlobalService,
		private helper: HelperService,
		private activatedRoute: ActivatedRoute,
	) {
		this.programType = this.activatedRoute.snapshot.paramMap.get('type').toLowerCase();
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
				minwidth: true, // Press width, jadi 1%
				priority: 0, // 0 tidak hilang, dst..
				opensort: false, // bisa di sort
				sortcolumn: 'id', // Sort column [key]
				sortorder: 'DESC' // Sort order pertama
			},
			{
				label: 'Code',
				value: 'code',
				showtype: 'text',
				minwidth: false,
				priority: 2,
				maxlength: 10, // maximum length
				opensort: true,
				sortcolumn: 'name',
				sortorder: ''
			},
			{
				label: 'Title',
				value: 'name',
				showtype: 'text',
				minwidth: false,
				priority: 0,
				nullvalue: 'No Data',
				maxlength: 40, // maximum length
				opensort: true,
				sortcolumn: 'name',
				sortorder: ''
			},
			{
				label: 'Sched.',
				value: 'schedule',
				showtype: 'interval',
				minwidth: false,
				priority: 1,
				opensort: true,
				sortcolumn: 'programstart_at',
				sortorder: ''
			},
			{
				label: 'Regis.',
				value: 'register',
				showtype: 'interval',
				minwidth: false,
				priority: 2,
				opensort: true,
				sortcolumn: 'registerstart_at',
				sortorder: ''
			},
			{
				label: 'Update',
				value: 'updated_at',
				showtype: 'datetime',
				minwidth: false,
				priority: 3,
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
				priority: 3,
				maxlength: null,
				opensort: true,
				sortcolumn: 'status',
				sortorder: ''
			}
		];

		this.filterOptions = {
			isExport: false,
			isFilter: true,
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
		this.startat = data.startDate != null ? `${data.startDate.year}-${data.startDate.month}-${data.startDate.day} 00:00:00` : "";
		this.endat = data.endDate != null ? `${data.endDate.year}-${data.endDate.month}-${data.endDate.day} 23:59:59` : "";
		this.getData(1);
		this.listtable.closeExportfilter();
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
		const self = this;
		this.page = pageNumber;
		if (typeof pageNumber === 'string') {
			this.page = parseInt(pageNumber, 10);
		}
		const param = {
			type: this.helper.toTitleCase(this.programType),
			page: this.page,
			paginate: this.global.defaultpaginate,
			sortBy: this.keys[this.sortkey].sortcolumn,
			sortDirection: this.keys[this.sortkey].sortorder,
			title: this.keyword != null ? ( this.keyword.length < 3 ? '' : this.keyword ) : '',
			durationstartat: this.startat,
			durationendat: this.endat
			// untuk send null, kirim string kosong
		};
		this.isloading = true; // kepake di listtable
		this.http.sendGetRequest2('program/all/filtered', param).subscribe((response: any) => {
			if (response.api_status) {
				const datas = response.data.programs.data;
				let temp;

				self.datas = [];
				datas.forEach(($ii) => {
					temp = {
						id: $ii.id,
						code: $ii.programcode.name,
						name: $ii.name,
						schedule: { start: $ii.programstart_at, end: $ii.programend_at },
						register: { start: $ii.registerstart_at, end: $ii.registerend_at },
						status: $ii.status,
						updated_at: $ii.updated_at,
						actions: [
							{
								label: 'Preview',
								url: 'admin/program/' + this.programType + '/detail?id=' + $ii.id,
								type: ''
							},
							{
								label: 'Edit',
								url: '/admin/program/' + this.programType + '/form?id=' + $ii.id,
								type: ''
							},
							{
								label: 'Archive',
								url: '',
								type: 'danger',
								apimethod: 'POST',
								apiurl: 'program/archive?id=' + $ii.id,
								confirmButtonText: 'Archive',
								apiparams: {
									id: $ii.id
								}
							},
						]
					};
					self.datas.push(temp);
				});


				self.navigations = {
					from: response.data.programs.from,
					to: response.data.programs.to,
					total: response.data.programs.total,
					last_page: response.data.programs.last_page,
					per_page: response.data.programs.per_page,
					current_page: response.data.programs.current_page,
					search_by: 'Subject name'
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
