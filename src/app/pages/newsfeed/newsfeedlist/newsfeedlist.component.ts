import { Component, OnInit, ViewChild } from '@angular/core';
import swal from 'sweetalert2';
import { ListtableComponent } from './../../../components/listtable/listtable.component';
import { HttpService } from './../../../http.service';
import { GlobalService } from './../../../global.service';
import { PopupModalComponent } from './../../../components/popup-modal/popup-modal.component';
import { Router } from '@angular/router';

@Component({
	selector: 'app-newsfeedlist',
	templateUrl: './newsfeedlist.component.html',
	styleUrls: ['./newsfeedlist.component.scss']
})
export class NewsfeedlistComponent implements OnInit {
	@ViewChild('mymodal', {static: false}) private modal: PopupModalComponent;
	@ViewChild(ListtableComponent) listtable: ListtableComponent;
	public datas;
	public keys;
	public navigations;
	public page;
	public filterOptions;
	public keyword: string;
	public sortkey: number;
	public isloading: boolean;
	public categoryList: string;
	public informationType: string;
	constructor(
		private http: HttpService,
		private global: GlobalService,
		public router: Router,
	) {

		this.informationType = 'Newsfeed';
		if(this.router.url.includes('devotion')){
			this.informationType = 'Devotion';
		}
		this.keyword = null;
		this.sortkey = 0; // index 0 = 1
		this.isloading = false; // kepake di listtable
		this.categoryList = '';

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
				label: 'Category',
				value: 'category',
				showtype: 'text',
				minwidth: false,
				priority: 2,
				maxlength: 10, // maximum length
				nullvalue: 'No Data'
			},
			{
				label: 'Title',
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
				label: 'Sched.',
				value: 'schedule',
				showtype: 'interval',
				minwidth: false,
				priority: 1,
				nullvalue: 'No Schedule',
				opensort: true,
				sortcolumn: 'poststart_at',
				sortorder: ''
			},
			{
				label: 'Update',
				value: 'updated_at',
				showtype: 'datetime',
				minwidth: false,
				priority: 3,
				maxlength: null
			},
			{
				label: 'Status',
				value: 'status',
				showtype: 'text',
				minwidth: false,
				priority: 0,
				maxlength: null
			}
		];

		this.filterOptions = {
			isExport: false,
			isFilter: true,
			datas: []
		};
	}

	ngOnInit(): void {
		this.getCategoryList();
		this.getData(1);
	}

	public searchData(keyword: string): void {
		this.keyword = keyword;

		this.page = 1;
		this.getData(this.page);
	}

	public generateFilterData(data: any): void {
		this.categoryList = "";
		data.filter.forEach(item => {
			switch (item.type) {
				case 'Category':
					this.categoryList = item.value.toString();
					break;
				default:
					break;
			}
		});
		this.getData(1);
		this.listtable.closeExportfilter();
	}

	public getCategoryList(): void {
		const param = {
			type: this.informationType
		};

		this.http.sendGetRequest2('informationcategory/get', param).subscribe((response: any) => {
			if (response.api_status === true) {
				const datas = response.data.informationcategories;
				this.filterOptions.datas.push({
					groupName: 'Category',
					type: 'select',
					selected: false,
					datas: datas.map(item => {
						return {
							filterName: item.name,
							value: item.id,
							selected: false
						};
					})
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
				informationTypeName: this.informationType,
				page: this.page,
				paginate: this.global.defaultpaginate,
				sortBy: this.keys[this.sortkey].sortcolumn,
				sortDirection: this.keys[this.sortkey].sortorder,
				title: this.keyword != null ? ( this.keyword.length < 3 ? '' : this.keyword ) : '',
				informationCategoryId: this.categoryList
				// untuk send null, kirim string kosong
			};
			this.isloading = true; // kepake di listtable
			this.http.sendGetRequest2('information/get/filtered', param).subscribe((response: any) => {
				if (response.api_status === true) {
					const informations = response.data.informations.data;
					let temp;

					self.datas = [];
					informations.forEach(($ii) => {

						temp = {
							id: $ii.id,
							name: $ii.name,
							schedule: { start: $ii.poststart_at, end: $ii.postend_at },
							updated_at: $ii.updated_at == null ? $ii.created_at : $ii.updated_at,
							category: $ii.informationcategory?.name,
							status: $ii.status,
							actions: [
								{
									label: 'View & Edit',
									url: '/admin/'+ this.informationType.toLowerCase() + '/form?id=' + $ii.id,
									type: ''
								}
							]
						};
						self.datas.push(temp);
					});

					self.navigations = {
						from: response.data.informations.from,
						to: response.data.informations.to,
						total: response.data.informations.total,
						last_page: response.data.informations.last_page,
						per_page: response.data.informations.per_page,
						current_page: response.data.informations.current_page,
						search_by: 'Title'
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

}
