import { Component, OnInit, ViewChild } from '@angular/core';
import swal from 'sweetalert2';
import { ListtableComponent } from './../../../components/listtable/listtable.component';
import { HelperService } from './../../../helper.service';
import { HttpService } from './../../../http.service';
import { GlobalService } from './../../../global.service';
import { PopupModalComponent } from './../../../components/popup-modal/popup-modal.component';

@Component({
	selector: 'app-praiselist',
	templateUrl: './praiselist.component.html',
	styleUrls: ['./praiselist.component.scss']
})
export class PraiselistComponent implements OnInit {
	@ViewChild('mymodal', {static: false}) private modal: PopupModalComponent;
	@ViewChild(ListtableComponent) listtable: ListtableComponent;
	public datas;
	public keys;
	public navigations;
	public page;
	public exportfilter;
	public startat: string;
	public endat: string;
	public campusList: string;
	public categoryList: string;
	public keyword: string;
	public sortkey: number;
	public isloading: boolean;

	constructor(
		private http: HttpService,
		public helper: HelperService,
		private global: GlobalService
	) {
		this.startat = '';
		this.endat = '';
		this.categoryList = '';
		this.campusList = '';
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
				label: 'Full Name',
				value: 'nameemail',
				showtype: 'text',
				minwidth: false,
				priority: 1
			},
			{
				label: 'Category',
				value: 'category',
				showtype: 'text',
				minwidth: false,
				priority: 2,
				nullvalue: 'No Category'
			},
			{
				label: 'Request',
				value: 'description',
				showtype: 'text',
				minwidth: false,
				priority: 0,
				opensort: true,
				sortcolumn: 'description',
				sortorder: '',
				maxlength: 90 // maximum length
			},
			{
				label: 'Campus',
				value: 'campusservice',
				showtype: 'text',
				minwidth: false,
				priority: 3,
				maxlength: null,
				nullvalue: 'No Campus'
			},
			{
				label: 'Submit',
				value: 'created_at',
				showtype: 'datetime',
				minwidth: false,
				priority: 3,
				nullvalue: 'No Date',
				opensort: true,
				sortcolumn: 'created_at',
				sortorder: ''
			}
		];

		this.exportfilter = {
			isExport: true,
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
		this.getCampusList();
		this.getCategoryList();
	}

	public generateFilterData(data: any): void {
		const startDate = data.startDate;
		const endDate = data.endDate;
		this.startat = startDate ? `${this.helper.twoDigitDate(startDate.year)}-${this.helper.twoDigitDate(startDate.month)}-${this.helper.twoDigitDate(startDate.day)} ${startDate ? '00:00:00' : ''}` : "";
		this.endat = endDate ? `${this.helper.twoDigitDate(endDate.year)}-${this.helper.twoDigitDate(endDate.month)}-${this.helper.twoDigitDate(endDate.day)} ${endDate ? '23:59:59' : ''}` : "";
		this.campusList = "";
		this.categoryList = "";

		data.filter.forEach(item => {
			switch (item.type) {
				case 'Campus':
					this.campusList = item.value.toString();
					break;
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

	public generateExportData(data: any): void {
		let campusIds;
		let categoryIds;
		data.filter.forEach(item => {
			switch (item.type) {
				case 'Campus':
					campusIds = item.value.toString();
					break;
				case 'Category':
					categoryIds = item.value.toString();
					break;
				default:
					break;
			}
		});

		const param = {
			prayertypeIds: 2,
			campusserviceIds: campusIds,
			prayercategoryIds: categoryIds,
			startat: `${this.helper.twoDigitDate(data.startDate.year)}-${this.helper.twoDigitDate(data.startDate.month)}-${this.helper.twoDigitDate(data.startDate.day)} ${data.startDate ? '00:00:00' : ''}`,
			endat: `${this.helper.twoDigitDate(data.endDate.year)}-${this.helper.twoDigitDate(data.endDate.month)}-${this.helper.twoDigitDate(data.endDate.day)} ${data.endDate ? '23:59:59' : ''}`,
		};
		this.http.sendGetRequest2('prayer/export/filtered', param).subscribe((response: any) => {
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
		}, (error: any) => {
			swal.fire({
				title: 'Error ' + error.status,
				html: this.helper.changeEOLToBr(error.error.message),
				icon: 'warning',
				confirmButtonText: 'OK'
			});
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
	} public getCategoryList(): void {
		this.http.sendGetRequest2('prayercategory/all').subscribe((response: any) => {
			if (response.api_status === true) {
				const datas = response.data.prayercategories;
				this.exportfilter.datas.push({
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

	public getCampusList(): void {
		this.http.sendGetRequest2('campusservice/all').subscribe((response: any) => {
			if (response.api_status === true) {
				const datas = response.data.campusservices;
				this.exportfilter.datas.push({
					groupName: 'Campus',
					type: 'select',
					selected: false,
					datas: datas.map(item => {
						return {
							filterName: item.campus.name,
							filterSubName: item.servicetime,
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
				prayertypeIds: 2, // praise
				page: this.page,
				paginate: this.global.defaultpaginate,
				sortBy: this.keys[this.sortkey].sortcolumn,
				sortDir: this.keys[this.sortkey].sortorder,
				userName: this.keyword != null ? (this.keyword.length < 3 ? '' : this.keyword) : '',
				startat: this.startat,
				endat: this.endat,
				campusserviceIds: this.campusList,
				prayercategoryIds: this.categoryList
				// untuk send null, kirim string kosong
			};
			this.isloading = true; // kepake di listtable
			this.http.sendGetRequest2('prayer/all/filtered', param).subscribe((response: any) => {
				if (response.api_status === true) {
					const datas = response.data.prayers.data;
					let temp;

					self.datas = [];
					datas.forEach(($ii) => {
						temp = {
							id: $ii.id,
							nameemail: '' + $ii.user.fullname + '<br><small><i>' + $ii.user.email + '</i></small>',
							category: $ii.prayercategory.name,
							description: $ii.description,
							campusservice: $ii.campusservice == null ? null : $ii.campusservice.campus.name + '<br>' + $ii.campusservice.servicetime,
							created_at: $ii.created_at,
							actions: [
								{
									label: 'View History',
									url: 'admin/prayerpraise/user-history?userId=' + $ii.user_id,
									type: ''
								}
							]
						};

						self.datas.push(temp);
					});

					self.navigations = {
						from: response.data.prayers.from,
						to: response.data.prayers.to,
						total: response.data.prayers.total,
						last_page: response.data.prayers.last_page,
						per_page: response.data.prayers.per_page,
						current_page: response.data.prayers.current_page,
						search_by: 'Name / Email'
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
