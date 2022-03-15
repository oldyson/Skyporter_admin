import { Component, OnInit, ViewChild, EventEmitter, Input } from '@angular/core';
import { ChartDataSets } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { Options } from '@angular-slider/ngx-slider';
import { BarchartComponent } from './../../../../components/chart/barchart/barchart.component';
import { HttpService } from './../../../../http.service';
import { GlobalService } from './../../../../global.service';
import { HelperService } from './../../../../helper.service';
import {
	faArrowUp as fasArrowUp,
	faArrowDown as fasArrowDown
} from '@fortawesome/pro-solid-svg-icons';
import swal from 'sweetalert2';

@Component({
	selector: 'smallgroupdashboard-sgdiscipleshipjourney',
	templateUrl: './sgdiscipleshipjourney.component.html',
	styleUrls: ['./sgdiscipleshipjourney.component.scss']
})
export class SgdiscipleshipjourneyComponent implements OnInit {
	public fasArrowUp = fasArrowUp;
	public fasArrowDown = fasArrowDown;
	public description: string;
	public isLoading: boolean;
	public isFirstLoad: boolean;
	public smallgroupreportbymembers: any;
	public dates: any;
	public years: any;
	public months: any;
	public selectedYear: string;
	@ViewChild('discipleshipLine', {static: false}) private discipleshipLine: BarchartComponent;
	public options: Options;
	public max: number;
	public min: number;
	public maskSgNameByChurch: string;
	public latestTotal: number;
	public latestWeek: number;
	//Plant = total DM + CT
	//Serve = Volunteer NON DL
	//Lead = DL + DF + HDF + MH + KV
	constructor(
		private http: HttpService,
		public helper: HelperService,
	) {
		this.months = [
			'Jan',
			'Feb',
			'Mar',
			'Apr',
			'May',
			'Jun',
			'Jul',
			'Aug',
			'Sep',
			'Oct',
			'Nov',
			'Dec'
		];
		this.maskSgNameByChurch = JSON.parse(localStorage.getItem('applicationfeatures')).filter(item => item.name === 'small-group')[0]?.applicationfeaturechurches[0]?.showname || 'small group';
		this.description = "";
		this.dates = [];
		this.years = [];
		this.smallgroupreportbymembers = null;
		this.isLoading = false;
		this.isFirstLoad = true;
		this.latestTotal = 0;
	}

	ngOnInit(): void {
		if(this.years.length == 0)
			this.getYears();
	}

	public getYears(): void{
		this.http.sendGetRequest2('smallgroup/get-report-years').subscribe((response: any) => {
			this.years = response.data.years;
			this.selectedYear = this.years[this.years.length-1];
			this.getData();
		}, (error: any) => {
			//
		});

	}

	public getData() : void{
		let self = this;
		const params = {
			year: this.selectedYear,
			sortDir: 'ASC',
		};
		this.http.sendGetRequest2('smallgroup/get-report-withmembercondition', params).subscribe((response: any) => {
			if(response.api_status){
				self.smallgroupreportbymembers = response.data.smallgroupreportbymembers;
				this.dates = [];
				self.smallgroupreportbymembers.forEach(($ii) => {
					const dt2 = new Date($ii.generateddate.replace(/\second/, 'T'));
					const date = dt2.getDate();
					const month = dt2.getMonth();
					$ii.generateddate = date + ' ' + this.months[month];
					self.dates.push($ii.generateddate);
				});
				this.description = response.data.description;

				this.options = {
					floor: 0,
					ceil: self.smallgroupreportbymembers.length-1,
					translate: (value: number): string => {
						return this.dates[value];
					},
					animate: true,
					getPointerColor: ()=>{return '#9e9e9e'},
					getSelectionBarColor: () => {return '#ccc'},
				};
				// range slider default
				this.max = this.options.ceil;
				this.min = this.options.floor;

				if(this.isFirstLoad){
					this.refreshData();
					this.isFirstLoad = false;
				}
				this.getAttendanceData();
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

	public refreshData(minMax: any | null = null) : void{
		let self = this;
		if(minMax != null){
			this.max = minMax.max;
			this.min = minMax.min;
		}

		// refresh MONTH
		if(this.discipleshipLine != null){
			// kalo labels nya di set otomatis dari xVal
			var labels = []; // x
			let temp = [];
			let y1 = []; // total value each month
			let y2 = [];
			let y3 = [];
			this.smallgroupreportbymembers.forEach((rawData, index) => {
				if(index <= this.max
					&& index >= this.min){
					y1.push(rawData['smallgroupmemberscount'] + rawData['coreteamscount']);
					y2.push(rawData['servecount']);
					y3.push(rawData['leadcount'])
					labels.push(self.dates[index]);
				}
			});


			temp.push(
				{ data: y1, label: "No. of Plant" }
			);
			temp.push(
				{ data: y2, label: "No. of Serve" }
			);
			temp.push(
				{ data: y3, label: "No. of Lead" }
			);
			this.discipleshipLine.refreshData(temp);
			this.discipleshipLine.refreshLabel(labels);
		}
	}

	public getAttendanceData(): void {
		let self = this;
		const params = {
			year: this.selectedYear,
		};
		this.http.sendGetRequest2('dashboard/campusserviceattendance', params).subscribe((response: any) => {
			if(response.api_status){
				self.latestTotal = 0;
				self.latestWeek = 0;
				response.data.data_peryear.forEach(($ii)=>{
					let total = 0;
					$ii.campusservices.forEach(($jj)=>{
						total += $jj.campusserviceattendance.totalgeneral;
						total += $jj.campusserviceattendance.totalgeneralfirst;
						total += $jj.campusserviceattendance.totalgeneralsalvation;
						total += $jj.campusserviceattendance.totalyouth;
						total += $jj.campusserviceattendance.totalyouthfirst;
						total += $jj.campusserviceattendance.totalyouthsalvation;
						total += $jj.campusserviceattendance.totalkids;
						total += $jj.campusserviceattendance.totalkidsfirst;
						total += $jj.campusserviceattendance.totalkidssalvation;
					});
					if(total>0){
						self.latestTotal = total;
						self.latestWeek = $ii.weekofyear;
					}
				});
			}else{
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
}
