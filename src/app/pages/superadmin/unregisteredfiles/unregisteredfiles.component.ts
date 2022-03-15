import { Component, OnInit, ViewChild } from '@angular/core';
import swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { ListfiletableComponent } from './../../../components/listfiletable/listfiletable.component';
import { HttpService } from './../../../http.service';
import { GlobalService } from './../../../global.service';
import { HelperService } from './../../../helper.service';

@Component({
	selector: 'app-unregisteredfiles',
	templateUrl: './unregisteredfiles.component.html',
	styleUrls: ['./unregisteredfiles.component.scss']
})
export class UnregisteredfilesComponent implements OnInit {

	@ViewChild(ListfiletableComponent) listtable: ListfiletableComponent;
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
				value: 'index', // [key] name
				showtype: 'number', // show type
				minwidth: true, // Press width, jadi 1%
				priority: 0, // 0 tidak hilang, dst..
				opensort: false, // bisa di sort
				sortorder: 'DESC', // Sort order pertama
				align: 'left'
			},
			{
				label: 'URL', // NAMA Header Column (muncul)
				value: 'url', // [key] name
				showtype: 'text', // show type
				minwidth: true, // Press width, jadi 1%
				priority: 1, // 0 tidak hilang, dst..
				opensort: false, // bisa di sort
				sortorder: 'DESC' // Sort order pertama
			},
			{
				label: 'Download',
				value: 'url',
				showtype: 'downloadbutton',
				minwidth: false,
				priority: 2,
				opensort: false,	
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

	public getData(pageNumber): void {
		const self = this;
		this.page = pageNumber;
		if (typeof pageNumber === 'string') {
			this.page = parseInt(pageNumber, 10);
		}
		const param = {
			page: this.page,
			paginate: this.global.defaultpaginate,
			keyword: this.keyword != null ? ( this.keyword.length < 3 ? '' : this.keyword ) : '',
			// untuk send null, kirim string kosong
		};
		this.isloading = true; // kepake di listtable
		this.http.sendGetRequest2('document/get-missing', param).subscribe((response: any) => {
			if (response.api_status) {
				const datas = response.data.files.data;
				let temp;

				self.datas = [];
				let index = 0;
				datas.forEach(($ii) => {
					temp = {
						index: ++index,
						url: $ii.url,
						actions: [
							{
								label: 'Delete',
								url: '',
								type: 'danger',
								apimethod: 'POST',
								apiurl: 'document/delete-missing',
								confirmButtonText: 'Delete',
								apiparams: {
									url: $ii.url
								}
							},
						]
					};
					self.datas.push(temp);
				});


				self.navigations = {
					from: response.data.files.from,
					to: response.data.files.to,
					total: response.data.files.total,
					last_page: response.data.files.last_page,
					per_page: response.data.files.per_page,
					current_page: response.data.files.current_page,
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
