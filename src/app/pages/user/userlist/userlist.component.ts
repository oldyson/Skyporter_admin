import { Component, OnInit, ViewChild } from '@angular/core';
import { ListtableComponent } from './../../../components/listtable/listtable.component';
import { HttpService } from './../../../http.service';
import { HelperService } from './../../../helper.service';
import { GlobalService } from './../../../global.service';
import { PopupModalComponent } from './../../../components/popup-modal/popup-modal.component';
import swal from 'sweetalert2';

@Component({
	selector: 'app-userlist',
	templateUrl: './userlist.component.html',
	styleUrls: ['./userlist.component.scss']
})
export class UserlistComponent implements OnInit {
	@ViewChild('mymodal', {static: false}) private modal: PopupModalComponent;
	@ViewChild(ListtableComponent) listtable: ListtableComponent;
	public datas;
	public keys;
	public navigations;
	public page;
	public keyword: string;
	public sortkey: number;
	public isloading: boolean;

	constructor(
		private http: HttpService,
		private helper: HelperService,
		private global: GlobalService,
	) {
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
				sortorder: 'ASC' // Sort order pertama
			},
			{
				label: 'Full Name',
				value: 'name',
				showtype: 'text',
				minwidth: false,
				priority: 0,
				maxlength: 30,
				opensort: true, // bisa di sort
				sortcolumn: 'fullname', // Sort column [key]
				sortorder: '' // Sort order pertama
			},
			{
				label: 'User Email',
				value: 'email',
				showtype: 'text',
				minwidth: false,
				priority: 2,
				nullvalue: 'No Data',
				opensort: true, // bisa di sort
				sortcolumn: 'email', // Sort column [key]
				sortorder: '' // Sort order pertama
			},
			{
				label: 'Phone',
				value: 'phone',
				showtype: 'text',
				minwidth: false,
				priority: 3,
				nullvalue: 'No Schedule'
			},
			{
				label: 'Gen.',
				value: 'gender',
				showtype: 'gender',
				minwidth: false,
				priority: 3,
				nullvalue: '',
				align: 'center'
			},
			{
				label: 'Role',
				value: 'role',
				showtype: 'text',
				minwidth: false,
				priority: 2,
				maxlength: null
			},
			{
				label: 'Status',
				value: 'status',
				showtype: 'text',
				minwidth: false,
				priority: 1,
				maxlength: null,
				align: 'center'
			}
		];
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

	public getData(pageNumber: number): void {
		const self = this;
		this.page = pageNumber;
		if (typeof pageNumber === 'string') {
			this.page = parseInt(pageNumber, 10);
		}
		const param = {
			page: this.page,
			paginate: this.global.defaultpaginate,
			sortBy: this.keys[this.sortkey].sortcolumn,
			sortDir: this.keys[this.sortkey].sortorder,
			name: this.keyword != null ? ( this.keyword.length < 3 ? '' : this.keyword ) : '',
			// untuk send null, kirim string kosong
			type: "ListOnly", // supaya enteng
		};
		this.isloading = true; // kepake di listtable
		this.http.sendGetRequest2('user/all/filtered', param).subscribe((response: any) => {
			const datas = response.data.users.data;
			let temp;

			self.datas = [];
			datas.forEach(($ii) => {
				temp = {
					id: $ii.id,
					name: $ii.fullname,
					email: $ii.email,
					phone: $ii.phone,
					gender: $ii.gender,
					schedule: self.helper.getDatetime($ii.sendstart_at),
					status: $ii.deleted_at ? 'Inactive' : 'Active',
					role: '',
					actions: [
						{
							label: 'View User',
							url: 'admin/user/detail?id=' + $ii.id,
							type: ''
						},
						{
							label: 'Deactivate',
							url: '',
							type: 'danger',
							apimethod: 'POST',
							apiurl: 'user/deactivate',
							apiparams: {
								userId: $ii.id
							}
						}
					]
				};
				$ii.userroles.forEach(($jj) => {
					if(temp.role !== '')
						temp.role += ', ';
					temp.role += $jj.role.name;
				});
				self.datas.push(temp);
			});

			self.navigations = {
				from: response.data.users.from,
				to: response.data.users.to,
				total: response.data.users.total,
				last_page: response.data.users.last_page,
				per_page: response.data.users.per_page,
				current_page: response.data.users.current_page,
				search_by: 'Full Name'
			};

			self.listtable.generateNavigationList(self.navigations.last_page, self.navigations.current_page);
			self.isloading = false; // kepake di listtable
		}, () => {
			self.isloading = false; // kepake di listtable
		});
	}

	public getUser(pageNumber): void {
		if (!this.isloading) {
			const self = this;
			this.page = pageNumber;
			if (typeof pageNumber === 'string') {
				this.page = parseInt(pageNumber, 10);
			}
			const param = {
				type: 'Email',
				page: this.page,
				paginate: this.global.defaultpaginate,
				sortBy: 'id',
				sortDirection: 'DESC',
				name: this.keyword != null ? ( this.keyword.length < 3 ? '' : this.keyword ) : ''
				// untuk send null, kirim string kosong
			};
			this.isloading = true;
			this.http.sendGetRequest2('user/all/filtered', param).subscribe((response: any) => {
				if (response.api_status === true) {
					const users = response.data.users.data;
					let temp;

					self.datas = [];
					users.forEach(($ii) => {
						temp = {
							id: $ii.id,
							name: $ii.fullname,
							email: $ii.email,
							phone: $ii.phone,
							gender: $ii.gender,
							schedule: self.helper.getDatetime($ii.sendstart_at),
							status: $ii.deleted_at ? 'Inactive' : 'Active',
							role: '',
							actions: [
								{
									label: 'View User',
									url: 'admin/user/detail?id=' + $ii.id,
									type: ''
								}
							]
						};
						// baru ada preview/edit kalo draft
						if (!$ii.deleted_at) {
							temp.actions.push(
								{
									label: 'Deactivate',
									url: '',
									type: 'danger'
								}
							);
						}

						$ii.userroles.forEach(($jj) => {
							temp.role += $jj.role.name;
						});

						self.datas.push(temp);
					});

					self.navigations = {
						from: response.data.users.from,
						to: response.data.users.to,
						total: response.data.users.total,
						last_page: response.data.users.last_page,
						per_page: response.data.users.per_page,
						current_page: response.data.users.current_page,
						search_by: 'User Full Name'
					};

					self.listtable.generateNavigationList(self.navigations.last_page, self.navigations.current_page);
				} else {
					swal.fire({
						title: 'Error',
						text: response.message,
						icon: 'warning',
						confirmButtonText: 'OK',
					});
				}
				self.isloading = false; // kepake di listtable
			}, (error: any) => {
				swal.fire({
					title: 'Error ' + error.status,
					html: this.helper.changeEOLToBr(error.error.message),
					icon: 'warning',
					confirmButtonText: 'OK',
				});
				self.isloading = false; // kepake di listtable
			});
		}
	}


}
