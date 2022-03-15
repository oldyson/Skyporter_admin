import { Component, OnInit, ViewChild } from '@angular/core';
import swal from 'sweetalert2';
import { ListtableComponent } from './../../../components/listtable/listtable.component';
import { HttpService } from './../../../http.service';
import { GlobalService } from './../../../global.service';
import { HelperService } from './../../../helper.service';

@Component({
	selector: 'app-campaignlistemail',
	templateUrl: './campaignlistemail.component.html',
	styleUrls: ['./campaignlistemail.component.scss']
})
export class CampaignlistemailComponent implements OnInit {
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
		private global: GlobalService,
		private helper: HelperService,
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
				sortorder: 'DESC' // Sort order pertama
			},
			{
				label: 'Subject',
				value: 'subject',
				showtype: 'text',
				minwidth: false,
				priority: 0,
				maxlength: 30, // maximum length
				opensort: true,
				sortcolumn: 'title',
				sortorder: ''
			},
			{
				label: 'Update',
				value: 'lastupdate',
				showtype: 'datetime',
				minwidth: false,
				priority: 2,
				nullvalue: 'No Data',
				opensort: true,
				sortcolumn: 'updated_at',
				sortorder: ''
			},
			{
				label: 'Sched.',
				value: 'schedule',
				showtype: 'datetime',
				minwidth: false,
				priority: 3,
				nullvalue: 'No Schedule',
				opensort: true,
				sortcolumn: 'sendstart_at',
				sortorder: ''
			},
			{
				label: 'Sent',
				value: 'sent',
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
				maxlength: null
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
				sortBy: this.keys[this.sortkey].sortcolumn,
				sortDirection: this.keys[this.sortkey].sortorder,
				title: this.keyword != null ? ( this.keyword.length < 3 ? '' : this.keyword ) : ''
				// untuk send null, kirim string kosong
			};
			this.isloading = true; // kepake di listtable
			this.http.sendGetRequest2('campaign/all/filtered', param).subscribe((response: any) => {
				if (response.api_status === true) {
					const campaigns = response.data.campaigns.data;
					let temp;

					self.datas = [];
					campaigns.forEach(($ii) => {
						let title = '';
						for (let i = 0; i < $ii.campaignattachments_count; i++) {
							title += '📁';
							if ($ii.campaignattachments_count - 1 === i) {
								title += ' ';
							}
						}
						title += $ii.title;

						temp = {
							id: $ii.id,
							subject: title,
							lastupdate: self.helper.getDatetime($ii.updated_at),
							schedule: self.helper.getDatetime($ii.sendstart_at),
							status: $ii.status,
							sent: $ii.campaignrecipientssent_count + ' / ' + $ii.campaignrecipients_count,
							actions: [
								{
									label: 'Preview',
									url: 'admin/campaign/preview?id=' + $ii.id,
									type: ''
								},
								{
									label: $ii.status === 'Draft' ? 'Edit' : 'Copy',
									url: '/admin/campaign/form?id=' + $ii.id,
									type: ''
								}
							]
						};
						// baru ada preview/edit kalo draft
						if ($ii.status === 'Draft') {
							temp.actions.push(
								{
									label: 'Publish',
									url: '',
									apimethod: 'POST',
									apiurl: 'campaign/publish',
									apiparams: {
										id: $ii.id
									}
								},
								{
									label: 'Delete',
									url: '',
									type: 'danger',
									apimethod: 'POST',
									apiurl: 'campaign/delete',
									apiparams: {
										id: $ii.id
									}
								}
							);
						} else if ($ii.status !== 'Published'
							&& $ii.status !== 'Sent') {
							temp.actions.push(
								{
									label: 'Delete',
									url: 'asdf',
									type: 'danger'
								}
							);
						}
						self.datas.push(temp);
					});

					self.navigations = {
						from: response.data.campaigns.from,
						to: response.data.campaigns.to,
						total: response.data.campaigns.total,
						last_page: response.data.campaigns.last_page,
						per_page: response.data.campaigns.per_page,
						current_page: response.data.campaigns.current_page,
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


}
