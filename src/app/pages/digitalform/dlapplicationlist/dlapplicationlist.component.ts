import { Component, OnInit, ViewChild } from '@angular/core';
import swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { ListtableComponent } from './../../../components/listtable/listtable.component';
import { HttpService } from './../../../http.service';
import { GlobalService } from './../../../global.service';
import { HelperService } from './../../../helper.service';

@Component({
	selector: 'app-dlapplicationlist',
	templateUrl: './dlapplicationlist.component.html',
	styleUrls: ['./dlapplicationlist.component.scss']
})
export class DlapplicationlistComponent implements OnInit {
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
	public applicationType: string;
	constructor(
		private http: HttpService,
		private global: GlobalService,
		private helper: HelperService,
		private activatedRoute: ActivatedRoute,
	) {
		this.applicationType = this.activatedRoute.snapshot.paramMap.get('applicationtype').toLowerCase();
		this.keyword = null;
		this.sortkey = 0; // index 0 = 1
		this.isloading = false; // kepake di listtable
		this.startat = '';
		this.endat = '';

		// showtype:
		// number, text, datetime,
		if(this.applicationType == 'dlapplication'){
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
					label: 'Nominated DATE Leader', // NAMA Header Column (muncul)
					value: 'name', // [key] name
					showtype: 'text', // show type
					minwidth: false, // Press width, jadi 1%
					priority: 1, // 0 tidak hilang, dst..
					opensort: true, // bisa di sort
					sortcolumn: 'name', // Sort column [key]
					sortorder: '' // Sort order pertama
				},
				{
					label: 'DATE Name',
					value: 'smallgroupname',
					showtype: 'text',
					minwidth: false,
					priority: 2,
					maxlength: 20,
					opensort: true,
					sortcolumn: 'smallgroupname',
					sortorder: ''
				},
				{
					label: 'DATE Leader',
					value: 'leadername',
					showtype: 'text',
					minwidth: false,
					priority: 3,
					maxlength: 20,
					nullvalue: 'No Data',
					opensort: true,
					sortcolumn: 'leadername',
					sortorder: ''
				},
				{
					label: 'DATE Facilitator',
					value: 'upperleadername',
					showtype: 'text',
					minwidth: false,
					priority: 4,
					maxlength: 20,
					opensort: true,
					sortcolumn: 'upperleadername',
					sortorder: ''
				},
				{
					label: 'Created at',
					value: 'created_at',
					showtype: 'datetime',
					minwidth: false,
					priority: 5,
					opensort: true,
					sortcolumn: 'created_at',
					sortorder: ''
				},
				{
					label: 'Status',
					value: 'status',
					showtype: 'text',
					minwidth: false,
					priority: 6,
					opensort: true,
					sortcolumn: 'status',
					sortorder: ''
				}
			];
		} else if(this.applicationType == "dfapplication"){
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
					label: 'Nominated DATE Facilitator', // NAMA Header Column (muncul)
					value: 'name', // [key] name
					showtype: 'text', // show type
					minwidth: false, // Press width, jadi 1%
					priority: 1, // 0 tidak hilang, dst..
					opensort: true, // bisa di sort
					sortcolumn: 'name', // Sort column [key]
					sortorder: '' // Sort order pertama
				},
				{
					label: 'DATE Name',
					value: 'smallgroupname',
					showtype: 'text',
					minwidth: false,
					priority: 2,
					maxlength: 20,
					opensort: true,
					sortcolumn: 'smallgroupname',
					sortorder: ''
				},
				{
					label: 'DATE Facilitator',
					value: 'leadername',
					showtype: 'text',
					minwidth: false,
					priority: 3,
					maxlength: 20,
					nullvalue: 'No Data',
					opensort: true,
					sortcolumn: 'leadername',
					sortorder: ''
				},
				{
					label: 'Head DATE Facilitator',
					value: 'upperleadername',
					showtype: 'text',
					minwidth: false,
					priority: 4,
					maxlength: 20,
					opensort: true,
					sortcolumn: 'upperleadername',
					sortorder: ''
				},
				{
					label: 'Created at',
					value: 'created_at',
					showtype: 'datetime',
					minwidth: false,
					priority: 5,
					opensort: true,
					sortcolumn: 'created_at',
					sortorder: ''
				},
				{
					label: 'Status',
					value: 'status',
					showtype: 'text',
					minwidth: false,
					priority: 6,
					opensort: true,
					sortcolumn: 'status',
					sortorder: ''
				}
			];
		} else if(this.applicationType == "baptismform"){
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
					label: 'Name', // NAMA Header Column (muncul)
					value: 'name', // [key] name
					showtype: 'text', // show type
					minwidth: false, // Press width, jadi 1%
					priority: 1, // 0 tidak hilang, dst..
					opensort: true, // bisa di sort
					sortcolumn: 'name', // Sort column [key]
					sortorder: '' // Sort order pertama
				},
				{
					label: 'DATE Name',
					value: 'smallgroupname',
					showtype: 'text',
					minwidth: false,
					priority: 2,
					maxlength: 20,
					opensort: true,
					sortcolumn: 'smallgroupname',
					sortorder: ''
				},
				{
					label: 'Created at',
					value: 'created_at',
					showtype: 'datetime',
					minwidth: false,
					priority: 3,
					opensort: true,
					sortcolumn: 'created_at',
					sortorder: ''
				},
				{
					label: 'Status',
					value: 'status',
					showtype: 'text',
					minwidth: false,
					priority: 4,
					opensort: true,
					sortcolumn: 'status',
					sortorder: ''
				}
			];
		}
		

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

	public doAPI(data: any): void {
		const self = this;
		const apiurl = data.apiurl;
		const apimethod = data.apimethod;
		const apiparams = data.apiparams;
		self.isloading = true;
		if (apimethod === 'GET') {
			this.http.sendGetRequest2(apiurl, apiparams).subscribe((response: any) => {
				if (response.api_status) {
					if(response.data.path){
						const link = document.createElement('a');
						link.href = response.data.path;
						link.download = response.data.path;
						document.body.appendChild(link);
						link.click();
						document.body.removeChild(link);
					}
				} else {
					swal.fire({
						title: 'Error',
						text: response.message,
						icon: 'warning',
						confirmButtonText: 'OK'
					});
				}
				self.getData(self.page);
				self.isloading = false;
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
		let type = null;
		if(this.applicationType == 'dlapplication'){
			type = "DL";
		}else if(this.applicationType == 'dfapplication'){
			type = "DF";
		}else if(this.applicationType == 'baptismform'){
			type = "Baptism";
		}
		const param = {
			type: type,
			page: this.page,
			paginate: this.global.defaultpaginate,
			sortBy: this.keys[this.sortkey].sortcolumn,
			sortDir: this.keys[this.sortkey].sortorder,
			searchKeyword: this.keyword != null ? ( this.keyword.length < 3 ? '' : this.keyword ) : '',
			// untuk send null, kirim string kosong
		};
		this.isloading = true; // kepake di listtable
		this.http.sendGetRequest2('formuser/all/filtered', param).subscribe((response: any) => {
			if (response.api_status) {
				const datas = response.data.formusers.data;
				let temp;

				self.datas = [];
				datas.forEach(($ii) => {
					temp = {
						id: $ii.id,
						name: $ii.name,
						smallgroupname: $ii.smallgroupname,
						leadername: $ii.leadername,
						upperleadername: $ii.upperleadername,
						created_at: $ii.created_at,
						status: $ii.status,
						actions: [
							{
								label: 'Preview',
								url: 'admin/digitalform/' + self.applicationType +'/detail?id=' + $ii.id,
								type: ''
							},
							{
								label: 'Export to PDF',
								url: '',
								apimethod: 'GET',
								apiurl: 'formuser/pdf',
								apiparams: {
									id: $ii.id
								}
							},
						]
					};
					self.datas.push(temp);
				});


				self.navigations = {
					from: response.data.formusers.from,
					to: response.data.formusers.to,
					total: response.data.formusers.total,
					last_page: response.data.formusers.last_page,
					per_page: response.data.formusers.per_page,
					current_page: response.data.formusers.current_page,
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
