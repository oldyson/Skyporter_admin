import { Component, OnInit, ViewChild } from '@angular/core';
import swal from 'sweetalert2';
import { ListtableComponent } from './../../../components/listtable/listtable.component';
import { HttpService } from './../../../http.service';
import { GlobalService } from './../../../global.service';
import { HelperService } from './../../../helper.service';
import { PopupModalComponent } from './../../../components/popup-modal/popup-modal.component';
import {
	faSearch as farSearch,
	faUndo as farUndo,
} from '@fortawesome/pro-regular-svg-icons';

@Component({
	selector: 'app-ngcheckinfamilylist',
	templateUrl: './ngcheckinfamilylist.component.html',
	styleUrls: ['./ngcheckinfamilylist.component.scss']
})
export class NgcheckinfamilylistComponent implements OnInit {
	@ViewChild('mymodal', {static: false}) private modal: PopupModalComponent;
	@ViewChild(ListtableComponent) listtable: ListtableComponent;
	public datas;
	public keys;
	public navigations;
	public page;
	public keywordParent: string;
	public keywordChild: string;
	public sortkey: number;
	public isloading: boolean;
	public farSearch = farSearch;
	public farUndo = farUndo;

	constructor(
		private http: HttpService,
		private global: GlobalService,
		private helper: HelperService,
	) {
		this.keywordParent = null;
		this.keywordChild = null;
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
				label: 'Parent',
				value: 'parentname',
				showtype: 'text',
				minwidth: false,
				priority: 0,
			},
			{
				label: 'Email',
				value: 'parentemail',
				showtype: 'text',
				minwidth: false,
				priority: 0,
			},
			{
				label: 'Phone',
				value: 'parentphone',
				showtype: 'text',
				minwidth: false,
				priority: 2,
				nullvalue: 'No Data',
				opensort: true,
				sortcolumn: 'updated_at',
				sortorder: '',
				maxlength: 30, // maximum length
			},
			{
				label: 'Child Name',
				value: 'childName',
				showtype: 'text',
				minwidth: false,
				priority: 1,
				nullvalue: 'No Child Data',
				maxlength: null
			}
		];
	}

	ngOnInit(): void {
		this.getData(1);
	}

	/*public searchData(keyword: string): void {
		this.keyword = keyword;

		this.page = 1;
		this.getData(this.page);
	}*/

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

	public clearSearch() : void {
		this.keywordParent = "";
		this.keywordChild = "";
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
				type: 'all',
				page: this.page,
				paginate: this.global.defaultpaginate,
				sortBy: this.keys[this.sortkey].sortcolumn,
				sortDirection: this.keys[this.sortkey].sortorder,
				parentName: this.keywordParent != null ? ( this.keywordParent.length < 3 ? '' : this.keywordParent ) : '',
				childName: this.keywordChild != null ? ( this.keywordChild.length < 3 ? '' : this.keywordChild ) : '',
				// untuk send null, kirim string kosong
			};
			this.isloading = true; // kepake di listtable
			this.http.sendGetRequest2('userfamily/filtered', param).subscribe((response: any) => {
				if (response.api_status === true) {
					const userfamilies = response.data.userfamilies.data;
					let temp;

					self.datas = [];
					userfamilies.forEach(($ii) => {
						let parentName = '';
						if ($ii.user != null)
							parentName += ($ii.user.gender === 'Male' ? '♂️ ': '♀️ ') + $ii.user.fullname + ($ii.user.deleted_at != null ? '&nbsp;<small>🔴</small>' : '');
						if ($ii.user2 != null)
							parentName += (parentName.length == 0 ? '' : '<br>') + ($ii.user2.gender === 'Male' ? '♂️ ': '♀️ ') + $ii.user2.fullname + ($ii.user2.deleted_at != null ? '&nbsp;<small>🔴</small>' : '');

						let parentPhone = '';
						if ($ii.user != null)
							parentPhone += $ii.user.phone;
						if ($ii.user2 != null)
							parentPhone += (parentPhone.length == 0 ? '' : '<br>') + $ii.user2.phone;

						let parentEmail = '';
						if ($ii.user != null)
							parentEmail += $ii.user.email;
						if ($ii.user2 != null)
							parentEmail += (parentEmail.length == 0 ? '' : '<br>') + $ii.user2.email;

						let marriage = '';
						if ($ii.marriage_at != null) {
							marriage += this.helper.makeDate($ii.marriage_at);
							const marrtime = this.helper.getDatetime($ii.marriage_at);
							marriage += '<br>';
							marriage += '<small>'+this.helper.dateDiffInString(marrtime)+'</small>';
						}

						let childName = '';
						if ($ii.userfamilychilds.length > 0) {
							$ii.userfamilychilds.forEach(($ii) => {
								childName += childName.length === 0 ? '' : '<br>';
								if ($ii.user != null)
									childName += $ii.user.fullname;
								else
									childName += $ii.name;
							});
						} else {
							childName = null;
						}

						temp = {
							id: $ii.id,
							parentname: parentName,
							parentphone: parentPhone,
							parentemail: parentEmail,
							children: $ii.userfamilychilds_count,
							marriage_at: marriage,
							childName: childName,
							actions: [
								{
									label: 'View Detail',
									url: 'admin/nextgen/family/detail?id=' + $ii.id,
									type: ''
								},
							]
						};
						self.datas.push(temp);
					});

					self.navigations = {
						from: response.data.userfamilies.from,
						to: response.data.userfamilies.to,
						total: response.data.userfamilies.total,
						last_page: response.data.userfamilies.last_page,
						per_page: response.data.userfamilies.per_page,
						current_page: response.data.userfamilies.current_page,
						search_by: null,// 'Subject name'
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
