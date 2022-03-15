import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ListtableComponent } from './../../../components/listtable/listtable.component';
import { HttpService } from './../../../http.service';
import { GlobalService } from './../../../global.service';

@Component({
	selector: 'app-programcodelist',
	templateUrl: './programcodelist.component.html',
	styleUrls: ['./programcodelist.component.scss']
})
export class ProgramcodelistComponent implements OnInit {
	@ViewChild(ListtableComponent) listtable: ListtableComponent;
	public datas;
	public keys;
	public navigations;
	public page;
	public keyword: string;
	public sortkey: number;
	public isloading: boolean;
	public programCodeType

	constructor(
		private activatedRoute: ActivatedRoute,
		private http: HttpService,
		private global: GlobalService
	) {
		this.keyword = null;
		this.sortkey = 0; // index 0 = 1
		this.isloading = false; // kepake di listtable

		this.programCodeType = this.activatedRoute.snapshot.paramMap.get('type').toLowerCase();
		this.programCodeType = this.programCodeType.charAt(0).toUpperCase() + this.programCodeType.slice(1);
		console.log(this.programCodeType);

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
				label: 'Code Name',
				value: 'codename',
				showtype: 'text',
				minwidth: false,
				priority: 2,
				maxlength: 10, // maximum length
				opensort: true,
				sortcolumn: 'title',
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
				sortcolumn: 'updated_at',
				sortorder: ''
			},
			{
				label: 'Total Session',
				value: 'numbersession',
				showtype: 'number',
				minwidth: false,
				priority: 1,
				opensort: true,
				sortcolumn: 'programstart_at',
				sortorder: ''
			},
			{
				label: 'Min. Attend',
				value: 'minattenddays',
				showtype: 'number',
				minwidth: false,
				priority: 2,
				opensort: true,
				sortcolumn: 'registerstart_at',
				sortorder: ''
			},
			{
				label: 'Last Updated',
				value: 'updated_at',
				showtype: 'datetime',
				minwidth: false,
				priority: 3,
				maxlength: null,
				opensort: true,
				sortcolumn: 'updated_at',
				sortorder: ''
			},
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
			type: this.programCodeType,
			page: this.page,
			paginate: this.global.defaultpaginate,
			sortBy: this.keys[this.sortkey].sortcolumn,
			sortDirection: this.keys[this.sortkey].sortorder,
			programnameorcode: this.keyword != null ? ( this.keyword.length < 3 ? '' : this.keyword ) : ''
			// untuk send null, kirim string kosong
		};
		this.isloading = true; // kepake di listtable
		this.http.sendGetRequest2('programcode/filtered', param).subscribe((response: any) => {
			const datas = response.data.programcodes.data;
			let temp;

			self.datas = [];
			datas.forEach(($ii) => {
				temp = {
					id: $ii.id,
					codename: $ii.codename,
					name: $ii.name,
					numbersession: $ii.numbersession,
					minattenddays: $ii.minattenddays,
					updated_at: $ii.updated_at != null ? $ii.updated_at : $ii.created_at,
					actions: [
						{
							label: 'Edit',
							url: 'admin/program/' + this.programCodeType.toLowerCase() +'/form-code?id=' + $ii.id,
							type: ''
						}
					]
				};
				self.datas.push(temp);
			});

			self.navigations = {
				from: response.data.programcodes.from,
				to: response.data.programcodes.to,
				total: response.data.programcodes.total,
				last_page: response.data.programcodes.last_page,
				per_page: response.data.programcodes.per_page,
				current_page: response.data.programcodes.current_page,
				search_by: 'Subject name'
			};

			self.listtable.generateNavigationList(self.navigations.last_page, self.navigations.current_page);
			self.isloading = false; // kepake di listtable
		}, () => {
			self.isloading = false; // kepake di listtable
		});
	}
}
