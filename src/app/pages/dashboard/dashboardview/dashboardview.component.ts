import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { HttpService } from './../../../http.service';
import { GlobalService } from './../../../global.service';
import { HelperService } from './../../../helper.service';
import {
	faArrowUp as fasArrowUp,
	faArrowDown as fasArrowDown
} from '@fortawesome/pro-solid-svg-icons';
import swal from 'sweetalert2';

@Component({
	selector: 'app-dashboardview',
	templateUrl: './dashboardview.component.html',
	styleUrls: ['./dashboardview.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class DashboardviewComponent implements OnInit {

	public fasArrowUp = fasArrowUp;
	public fasArrowDown = fasArrowDown;
	public month: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	public monthLong: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
	public dataYears: {id: number, name: string}[];
	public totalActiveUser: number; // angka totalnya
	public totalAttendance: number;
	public thisweekAttendance: any;
	public lastweekAttendance: any;
	public selisihAttendance: number;
	public totalmonthActive: number;
	public selisihActive: number;
	public selected: any; 
	public isloading: boolean;
	public activeTab1: string;
	public lastweek: Date | null;
	public lastmonth: Date | null;

	constructor(
			private http: HttpService,
			public global: GlobalService,
			public helper: HelperService,
	) {
		this.activeTab1 = 'usage';
		this.totalActiveUser = 0;
		this.totalAttendance = 0;
		const nowtime: Date = new Date();
		this.selected = {
			'year': nowtime.getFullYear(),
		}
		this.dataYears = [
			{id: 2020, name: '2020'},
			{id: 2021, name: '2021'},
			{id: 2022, name: '2022'},
			{id: 2023, name: '2023'},
			{id: 2024, name: '2024'}
		];
		
	}

	ngOnInit(): void {
		this.getData();
	}

	public setActiveTab1(tabstring: string): void{
		this.activeTab1 = tabstring;
	}


	public getData(): void {
		if(!this.isloading){
			this.isloading = true;
			this.http.sendGetRequest2('dashboard/report-user', this.selected).subscribe((response: any) => {
				if(response.api_status){
					this.totalActiveUser = response.data.users_count;
					const thisweek = response.data.thisweek_attendances;
					this.thisweekAttendance = thisweek;

					this.totalAttendance = 0;

					this.totalAttendance += thisweek.totalgeneral;
					this.totalAttendance += thisweek.totalgeneralfirst;
					this.totalAttendance += thisweek.totalgeneralsalvation;
					this.totalAttendance += thisweek.totalyouth;
					this.totalAttendance += thisweek.totalyouthfirst;
					this.totalAttendance += thisweek.totalyouthsalvation;
					this.totalAttendance += thisweek.totalkids;
					this.totalAttendance += thisweek.totalkidsfirst;
					this.totalAttendance += thisweek.totalkidssalvation;

					const lastweek = response.data.lastweek_attendances;
					this.lastweekAttendance = lastweek;

					let lasttotal = 0;

					lasttotal += lastweek.totalgeneral;
					lasttotal += lastweek.totalgeneralfirst;
					lasttotal += lastweek.totalgeneralsalvation;
					lasttotal += lastweek.totalyouth;
					lasttotal += lastweek.totalyouthfirst;
					lasttotal += lastweek.totalyouthsalvation;
					lasttotal += lastweek.totalkids;
					lasttotal += lastweek.totalkidsfirst;
					lasttotal += lastweek.totalkidssalvation;

					this.selisihAttendance = this.totalAttendance - lasttotal;

					this.lastweek = this.helper.getDatetime(response.data.lastweek);
					this.lastmonth = this.helper.getDatetime(response.data.lastmonth_year + '-' + response.data.lastmonth_month + '-01 00:00:00');

					const lastActive = response.data.lastmonth_active;
					this.totalmonthActive = response.data.thismonth_active;
					this.selisihActive = this.totalmonthActive - lastActive;
				}else{
					swal.fire({
						title: 'Error',
						text: response.message,
						icon: 'warning',
						confirmButtonText: 'OK',
					});
				}
				this.isloading = false;
			}, (error: any) => {
				swal.fire({
					title: 'Error ' + error.status,
					html: this.helper.changeEOLToBr(error.error.message),
					icon: 'warning',
					confirmButtonText: 'OK',
				});
				this.isloading = false;
			});
		}
	}

}
