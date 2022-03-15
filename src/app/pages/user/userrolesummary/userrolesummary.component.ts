import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import swal from 'sweetalert2';
import { ChartType } from 'chart.js';
import { Label, MultiDataSet } from 'ng2-charts';
import { HttpService } from './../../../http.service';
import { GlobalService } from './../../../global.service';
import { PopupModalComponent } from './../../../components/popup-modal/popup-modal.component';
@Component({
	selector: 'app-userrolesummary',
	templateUrl: './userrolesummary.component.html',
	styleUrls: ['./userrolesummary.component.scss'],
	encapsulation: ViewEncapsulation.None
})


export class UserrolesummaryComponent implements OnInit {
	@ViewChild('mymodal', {static: false}) private modal: PopupModalComponent;
	public smallgroupmemberroles;
	public ministrymemberroles;
	public roles;
	public others;
	public noroleCount: number;
	public alluserCount: number;
	public isloading: boolean;
	public othershowpercent: boolean;

	public otherChartLabels: Label[] = ['Partner', 'Small Group Member', 'Ministry Member'];
	public otherChartData: MultiDataSet = [
		[1, 1, 1]
	];
	public otherChartType: ChartType = 'doughnut';

	constructor(
		private http: HttpService,
		private global: GlobalService
	) { }

	ngOnInit(): void {
		this.smallgroupmemberroles = [];
		this.ministrymemberroles = [];
		this.roles = [];
		this.others = [];
		this.noroleCount = 0;
		this.alluserCount = 0;
		this.isloading = false;
		this.othershowpercent = false;

		this.getData();
	}

	public getData(): void {
		if (!this.isloading) {
			const self = this;
			const params = {
				applicationId: 1
			};
			self.isloading = true;
			this.http.sendGetRequest2('role/summary', params).subscribe((response: any) => {
				if (response.api_status === true) {
					self.smallgroupmemberroles = response.data.smallgroupmemberroles;
					self.smallgroupmemberroles.showpercent = false;
					self.smallgroupmemberroles.allcount = response.data.smallgroupmemberroles_usersall_count;

					self.ministrymemberroles = response.data.ministrymemberroles;
					self.ministrymemberroles.showpercent = false;
					self.ministrymemberroles.allcount = response.data.ministrymemberroles_usersall_count;

					self.roles = response.data.roles;

					self.roles.allcount = 0;
					self.roles.forEach(($ii) => {
						self.roles.allcount += $ii.userroles_count;
					});

					self.noroleCount = response.data.norole_count;
					self.alluserCount = response.data.usersall_count;

					self.others = [
						{ label: 'Partner (No-Role)', value: self.noroleCount, percent: '' },
						{ label: 'Has Small Group', value: self.smallgroupmemberroles.allcount, percent: '' },
						{ label: 'Is A Ministry Member', value: self.ministrymemberroles.allcount, percent: '' },
						{ label: 'Has Admin Role', value: self.roles.allcount, percent: '' },
						{ label: 'All User', value: self.alluserCount, percent: '' }
					];

					self.otherChartData = [
						[self.noroleCount, self.smallgroupmemberroles.allcount],
						[self.noroleCount, self.smallgroupmemberroles.allcount - self.ministrymemberroles.allcount, self.ministrymemberroles.allcount]
					];
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

	public smallgroupToggled(status: boolean): void {
		this.smallgroupmemberroles.showpercent = status;
	}

	public ministryToggled(status: boolean): void {
		this.ministrymemberroles.showpercent = status;
	}

	public otherToggled(status: boolean): void {
		this.othershowpercent = status;
	}

}
