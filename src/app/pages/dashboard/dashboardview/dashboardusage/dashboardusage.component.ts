import { Component, OnInit, ViewChild, EventEmitter, Input } from '@angular/core';
import { ChartDataSets } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { Options } from '@angular-slider/ngx-slider';
import { LinechartComponent } from './../../../../components/chart/linechart/linechart.component';
import { HttpService } from './../../../../http.service';
import { HelperService } from './../../../../helper.service';
import { GlobalService } from './../../../../global.service';
import swal from 'sweetalert2';

@Component({
	selector: 'dashboardview-dashboardusage',
	templateUrl: './dashboardusage.component.html',
	styleUrls: ['./dashboardusage.component.scss']
})
export class DashboardusageComponent implements OnInit {

	@Input() year: number;
	@ViewChild('monthLine', {static: false}) private monthLine: LinechartComponent; 
	@ViewChild('dayLine', {static: false}) private dayLine: LinechartComponent; 
	public month: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	public monthLong: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
	//------------------------------------
	public dataActiveUserMonth: {data: any, type: string}[]; // array dari active user per-bulan per-hari
	public minMonth: number;
	public maxMonth: number;
	public optionsMonth: Options;
	public minDay: number;
	public maxDay: number;
	public optionsDay: Options;
	// ----------------------------------------------------
	public dataMonths: {id: number, name: string, totalDays: number}[];
	public selected: any;
	public typeLogs: any; 
	public isloading: boolean;


	constructor(
		private http: HttpService,
		private helper: HelperService,
		public global: GlobalService,
	) { 
		this.selected = {};
		this.typeLogs = [
			{
				id: 0,
				name: 'Total Sessions',
				label: 'TOTAL SESSIONS',
				value: 'sum',
			},
			{
				id: 1,
				name: 'Total User',
				label: 'UNIQUE USER',
				value: 'count',
			},
			{
				id: 2,
				name: 'Avg. Sessions',
				label: 'AVERAGE OF SESSIONS',
				value: 'avg',
			},
		];
		this.setTypeLog();

		// range slider custom
		this.optionsMonth = {
			floor: 1,
			ceil: this.month.length,
			translate: (value: number): string => {
				return this.month[value-1];
			},
			animate: true,
			getPointerColor: ()=>{return '#9e9e9e'},
			getSelectionBarColor: () => {return '#ccc'},
		};
		// range slider custom
		this.optionsDay = {
			floor: 1,
			ceil: 30,
			animate: true,
			getPointerColor: ()=>{return '#9e9e9e'},
			getSelectionBarColor: () => {return '#ccc'},
   showTicks: true
		}
		// range slider default
		this.maxMonth = this.optionsMonth.ceil;
		this.minMonth = this.optionsMonth.floor;
		this.maxDay = this.optionsDay.ceil;
		this.minDay = this.optionsDay.floor;
	}

	ngOnInit(): void {
		this.getData();
	}

	public setTypeLog(): void{
		if(this.selected.typeLogId == null)
			this.selected.typeLogId = 0;
		this.selected.typeLog = this.typeLogs[this.selected.typeLogId].value;
		this.selected.typeLogText = this.typeLogs[this.selected.typeLogId].label;
	}

	public setSliderValueByMonth(): void{
		// dipanggil waktu API kelar saja
		// untuk masukin ke dalam combobox untuk pilih month
		this.dataMonths = [];
		if(this.dataActiveUserMonth.length > 0){
			if(this.dataActiveUserMonth[0]['data'] != null){
				if(this.dataActiveUserMonth[0]['data'].length > 0){
					this.dataActiveUserMonth[0]['data'].forEach(($ii) => {
						// set dari API masuk ke array dataMonths;
						const temp: {id: number, name: string, totalDays: number} = {
							id: $ii.xVal, // kalo januari, xVal = 1 dst
							name: $ii.xLab,
							totalDays: $ii.users_active_day.length
						};
						this.dataMonths.push(temp);
					});

					this.selected.month = this.dataActiveUserMonth[0]['data'][0].xVal; // select yg pertama
					this.refreshDay();
				}else{
					console.log("error dashboardview.03");
				}
			}else{
				console.log("error dashboardview.04");
			}
		}
	}

	public setNewCeilDay(min: number, max: number){
		// refresh slider harus bikin object Options baru 
		this.optionsDay = {
			floor: min,
			ceil: max,
			animate: true,
			getPointerColor: ()=>{return '#9e9e9e'},
			getSelectionBarColor: () => {return '#ccc'},
   showTicks: true
		};
		this.maxDay = this.optionsDay.ceil;
	}

	public refreshMonth(minMax: any | null = null) : void{
		if(minMax != null){
			this.maxMonth = minMax.max;
			this.minMonth = minMax.min;
		}

		const rawDatas = this.dataActiveUserMonth;

		// refresh MONTH
		if(this.monthLine != null){
			// kalo labels nya di set otomatis dari xVal
			var labels = []; // x
			let temp = [];
			rawDatas.forEach((rawData) => {
				let y1 = []; // total value each month
				rawData['data'].forEach(($ii: any) => {
					if($ii.xVal <= this.maxMonth
						&& $ii.xVal >= this.minMonth){
						y1.push($ii.value);
						labels.push($ii.xLab);
					}
				});
				temp.push(
					{ data: y1, label: rawData['type'] }
				);
				this.monthLine.refreshData(temp);
			});

			this.monthLine.refreshLabel(labels);
			this.selected.month = 1;
			this.refreshDay();
		}
	}

	public refreshDay(minMax: any | null = null) : void{
		if(minMax != null){
			this.maxDay = minMax.max;
			this.minDay = minMax.min;
		}

		console.log("select month: " + (this.selected.month-1));
		setTimeout(()=> {
			const label = this.dataActiveUserMonth[0]['type'];
			const rawData = this.dataActiveUserMonth[0]['data'][this.selected.month-1].users_active_day;

			// refresh DAY
			if(this.dayLine != null){
				// kalo labels nya di set otomatis dari xVal
				var labels = []; // x
				let temp = [];
				let y1 = []; // total value each month
				rawData.forEach(($ii: any) => {
					if($ii.xVal <= this.maxDay
						&& $ii.xVal >= this.minDay){
						y1.push($ii.value);
						labels.push($ii.xLab);
					}
				});
				temp.push(
					{ data: y1, label: label }
				);
				this.dayLine.refreshData(temp);
				this.dayLine.refreshLabel(labels);
				// untuk update tanggal total di xAxis
				this.optionsDay.ceil = this.dataActiveUserMonth[0]['data'][this.selected.month-1].totaldays;
				this.maxDay = this.optionsDay.ceil;
			}
		}, 10);
	}

	public getData() : void{
		if(!this.isloading){
			this.isloading = true;
			const nowtime: Date = new Date();
			this.selected.year = this.year ? this.year : nowtime.getFullYear();
			this.http.sendGetRequest2('dashboard/loghistory', this.selected).subscribe((response: any) => {
				if(response.api_status){
					if(this.selected.year == null)
						this.selected.year = response.data.year; // update data year kalo sebelomnya null
					this.dataActiveUserMonth = [
						{
							'data': response.data.users_active_month,
							'type': response.data.users_active_type
						}
					]; // simpen dulu ke sini, baru di refresh


					// INIT DATA
					this.setSliderValueByMonth();
					this.refreshMonth();

					// kalo berhasil
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
