import { Component, OnInit, ViewChild } from '@angular/core';
import swal from 'sweetalert2';
import { ListtableComponent } from './../../../components/listtable/listtable.component';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from './../../../http.service';
import { GlobalService } from './../../../global.service';
import { HelperService } from './../../../helper.service';
import { PopupModalComponent } from './../../../components/popup-modal/popup-modal.component';

@Component({
	selector: 'app-prayerpraisehistory',
	templateUrl: './prayerpraisehistory.component.html',
	styleUrls: ['./prayerpraisehistory.component.scss']
})
export class PrayerpraisehistoryComponent implements OnInit {
	@ViewChild('mymodal', {static: false}) private modal: PopupModalComponent;
	@ViewChild(ListtableComponent) listtable: ListtableComponent;
	public datas;
	public keys;
	public navigations;
	public page;
	public keyword: string;
	public sortkey: number;
	public isloading: boolean;
	public userId: number;
	public user: any; // untuk data user yang ambil dari API

	constructor(
		private http: HttpService,
		private global: GlobalService,
		private helper: HelperService,
		private activatedRoute: ActivatedRoute
	) {
		const self = this;
		this.userId = 0;
		this.activatedRoute.queryParams.subscribe(params => {
			self.userId = parseInt(params.userId, 10);
		});
		this.keyword = null;
		this.sortkey = 0; // index 0 = 1
		this.isloading = false; // kepake di listtable

		// showtype:
		// number, text, datetime,
		this.keys = [
			{
				label: 'Prayer & Praise History',
				value: 'description',
				showtype: 'text',
				minwidth: false,
				priority: 0,
				nullvalue: '',
				maxlength: null
			}
		];
	}

	ngOnInit(): void {
		this.getData(1);
		this.getProfile();
	}

	public searchData(keyword: string): void {
		this.keyword = keyword;

		this.user = null;
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

	public getData(pageNumber): void {
		const self = this;
		if (this.userId === 0 || isNaN(this.userId)) {
			setTimeout(() => {
				self.modal.show('Error', 'No parameter UserId.', 'danger');
			}, 100);
			return;
		}

		if (!this.isloading) {
			this.page = pageNumber;
			if (typeof pageNumber === 'string') {
				this.page = parseInt(pageNumber, 10);
			}
			const param = {
				page: this.page,
				paginate: 6,
				userId: this.userId
				// untuk send null, kirim string kosong
			};
			this.isloading = true; // kepake di listtable
			this.http.sendGetRequest2('prayer/all/userid', param).subscribe((response: any) => {
				if (response.api_status === true) {
					const datas = response.data.prayers.data;
					let temp;

					self.datas = [];
					datas.forEach(($ii) => {
						temp = {
							description: '<br><b>' + $ii.prayercategory.name + ' - ' + this.helper.getDatetime($ii.created_at) + '</b>'
						};
						if ($ii.prayerprev != null) {
							temp.description += '<br>' + $ii.prayerprev.description + '<br><br><b>Praise</b>';
						}
						temp.description += '<br>' + $ii.description + '<br>&nbsp;';

						self.datas.push(temp);
					});

					self.navigations = {
						from: response.data.prayers.from,
						to: response.data.prayers.to,
						total: response.data.prayers.total,
						last_page: response.data.prayers.last_page,
						per_page: response.data.prayers.per_page,
						current_page: response.data.prayers.current_page,
						search_by: null // no search input
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

	public getProfile(): void {
		const params = {
			id: this.userId
		};
		const self = this;
		this.isloading = true;
		this.http.sendGetRequest2('user/profile', params).subscribe((response: any) => {
			if (response.api_status === true) {
				self.user = response.data.user;
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
			self.isloading = false;
		}, (error: any) => {
			swal.fire({
				title: 'Error 505',
				text: error.message,
				icon: 'warning',
				confirmButtonText: 'OK',
			}).then(() => {
				// NOTHING
			});
			self.isloading = false;
		});
	}
}
