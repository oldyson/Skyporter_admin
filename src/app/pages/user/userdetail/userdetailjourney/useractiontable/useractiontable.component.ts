import { Component, OnInit, ViewChild, Input, ViewEncapsulation} from '@angular/core';
import { ListtableComponent } from '../../../../../components/listtable/listtable.component';
import { HttpService } from '../../../../../http.service';
import { HelperService } from '../../../../../helper.service';

@Component({
	selector: 'comp-useractiontable',
	templateUrl: './useractiontable.component.html',
	styleUrls: ['./useractiontable.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class UseractiontableComponent implements OnInit {

	@ViewChild(ListtableComponent) listtable: ListtableComponent;
	@Input() section: string;
	@Input() title: string;
	@Input() withName: boolean;
	@Input() userId: number;

	public datas;
	public keys;
	public navigations;
	public page;
	public keyword: string;
	public sortkey: number;
	public isloading: boolean;

	constructor(
		private http: HttpService,
		public helper: HelperService
	) {
		this.keyword = null;
		this.sortkey = 0; // index 0 = 1
		this.isloading = false; // kepake di listtable

		// showtype:
		// number, text, datetime,
	}

	ngOnInit(): void {
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
				label: 'Action',
				value: 'action',
				showtype: 'text',
				minwidth: false,
				priority: 0,
				nullvalue: 'No Data',
				maxlength: 40, // maximum length
				opensort: true,
				sortcolumn: 'description',
				sortorder: ''
			},
			{
				label: 'Description',
				value: 'description',
				showtype: 'text',
				minwidth: false,
				priority: 0,
				nullvalue: 'No Data',
				maxlength: 40, // maximum length
				opensort: true,
				sortcolumn: 'description',
				sortorder: ''
			},
			// {
			// 	label: 'Type',
			// 	value: 'section',
			// 	showtype: 'text',
			// 	minwidth: false,
			// 	priority: 1,
			// 	opensort: false,
			// 	sortcolumn: '',
			// 	sortorder: ''
			// },
			{
				label: 'Last Updated',
				value: 'updated_at',
				showtype: 'datetime',
				minwidth: false,
				priority: 0,
				maxlength: null,
				opensort: true,
				sortcolumn: 'updated_at',
				sortorder: ''
			},
		];
		// kalo withname, ambil param namenya
		if(this.withName){
			//splice 1 karena mau ditaruh di ke 2 paling pertama
			this.keys.splice(1, 0,
				{
					label: this.helper.toTitleCase(this.title)+' Name',
					value: 'name',
					showtype: 'text',
					minwidth: false,
					priority: 0,
					nullvalue: 'No Data',
					maxlength: 40, // maximum length
					opensort: false,
					sortcolumn: '',
					sortorder: ''
				});
		}
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
		console.log('get Data');
		const self = this;
		this.page = pageNumber;
		if (typeof pageNumber === 'string') {
			this.page = parseInt(pageNumber, 10);
		}
		const param = {
			section: this.section,
			page: this.page,
			paginate: 6,
			sortBy: this.keys[this.sortkey].sortcolumn,
			sortDirection: this.keys[this.sortkey].sortorder,
			user_id: this.userId
			// untuk send null, kirim string kosong
		};
		this.isloading = true; // kepake di listtable
		this.http.sendGetRequest2('useraction/get/list', param).subscribe((response: any) => {
			const datas = response.data.useractions.data;
			let temp;

			self.datas = [];
			datas.forEach(($ii) => {
				temp = {
					id: $ii.id,
					action: $ii.useractiontype.name,
					description: $ii.description,
					// section: $ii.useractiontype.section,
					updated_at: $ii.updated_at != null ? $ii.updated_at : $ii.created_at,
				};

				if(this.withName){
					if($ii[self.section] != null)
						temp.name =$ii[self.section].name;
					else
						temp.name = "No Data";
				}

				self.datas.push(temp);
			});

			self.navigations = {
				from: response.data.useractions.from,
				to: response.data.useractions.to,
				total: response.data.useractions.total,
				last_page: response.data.useractions.last_page,
				per_page: response.data.useractions.per_page,
				current_page: response.data.useractions.current_page,
			};

			self.listtable.generateNavigationList(self.navigations.last_page, self.navigations.current_page);
			self.isloading = false; // kepake di listtable
		}, () => {
			self.isloading = false; // kepake di listtable
		});
	}
}
