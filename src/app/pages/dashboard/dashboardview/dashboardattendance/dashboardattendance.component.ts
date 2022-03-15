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
	selector: 'dashboardview-dashboardattendance',
	templateUrl: './dashboardattendance.component.html',
	styleUrls: ['./dashboardattendance.component.scss']
})
export class DashboardattendanceComponent implements OnInit {

	@Input() year: number;
	@Input() thisweekAttendance: any;
	@Input() lastweekAttendance: any;
	@ViewChild('attendLine', {static: false}) private attendLine: LinechartComponent; 
	//-------------------------------------
	public campusservices: any;
	//------------------------------------
	public dataActiveSunAttend: {data: any, type: string}; // array dari active user per-bulan per-hari
	public minAttend: number;
	public maxAttend: number;
	public optionsAttend: Options;
	// ----------------------------------------------------
	public dataMonths: {id: number, name: string, totalDays: number}[];
	public selected: any;
	public typeLogs: any; 
	public isloading: boolean;
	public weeksofyear: {
		weekofyear: number,
		xVal: number,
		xLab: string,
		campusservices: any
	}[];

	constructor(
		private http: HttpService,
		private helper: HelperService,
		public global: GlobalService,
	) { 
		this.selected = {
			'year': this.year,
			'campusserviceId': null,
		};

		// range slider custom
		this.optionsAttend = {
			floor: 1,
			ceil: 52,
			animate: true,
			getPointerColor: ()=>{return '#9e9e9e'},
			getSelectionBarColor: () => {return '#ccc'},
		};
		// range slider default
		this.maxAttend = this.optionsAttend.ceil;
		this.minAttend = this.optionsAttend.floor;
	}

	ngOnInit(): void {
		this.getData();
		this.getCampusservice(() => {
			if(this.campusservices.length > 0){
				this.selected.campusserviceId = this.campusservices[0].id;
				console.log(this.campusservices);
				this.refreshAttend();
			}
		});
	}

	public setSliderValueByAttend(dataActiveSunAttend: any): void{
		// dipanggil waktu API kelar saja
		// untuk masukin ke dalam combobox untuk pilih month
		if(dataActiveSunAttend['data'] != null){
			if(dataActiveSunAttend['data'].length > 0){
				this.selected.month = dataActiveSunAttend['data'][0].xVal; // select yg pertama
			}else{
				console.log("error dashboardview.03");
			}
		}else{
			console.log("error dashboardview.04");
		}
	}

	public refreshAttend(minMax: any | null = null): void{
		if(this.selected.campusserviceId == null)
			return; // brarti campusservice dia belom ke load semua
		if(this.weeksofyear == null)
			return;

		if(minMax != null){
			this.maxAttend = minMax.max;
			this.minAttend = minMax.min;
		}

		// 4x Input
		// 1. general
		// 2. general first
		// 3. nextgen
		// 4. nextgen first
		let general = [];
		let generalfirst = [];
		let generalsalvation = [];
		let youth = [];
		let youthfirst = [];
		let youthsalvation = [];
		let kids = [];
		let kidsfirst = [];
		let kidssalvation = [];
		let labels = [];
		this.weeksofyear.forEach(($week) => {
		if($week.xVal <= this.maxAttend
			&& $week.xVal >= this.minAttend){
				$week.campusservices.forEach(($service) => {
					if($service.id == this.selected.campusserviceId){
						// cuma di add yang sesuai campusservice yang di pilih

						general.push($service.campusserviceattendance.totalgeneral);
						generalfirst.push($service.campusserviceattendance.totalgeneralfirst);
						generalsalvation.push($service.campusserviceattendance.totalgeneralsalvation);
						youth.push($service.campusserviceattendance.totalyouth);
						youthfirst.push($service.campusserviceattendance.totalyouthfirst);
						youthsalvation.push($service.campusserviceattendance.totalyouthsalvation);
						kids.push($service.campusserviceattendance.totalkids);
						kidsfirst.push($service.campusserviceattendance.totalkidsfirst);
						kidssalvation.push($service.campusserviceattendance.totalkidssalvation);
					}
				});

				labels.push($week.xLab);
			}
		});

		const dataSet = [
			{data: general, label: 'General'},
			{data: generalfirst, label: 'General First'},
			{data: generalsalvation, label: 'General Salvation'},
			{data: youth, label: 'Youth'},
			{data: youthfirst, label: 'Youth First'},
			{data: youthsalvation, label: 'Youth Salvation'},
			{data: kids, label: 'Kids'},
			{data: kidsfirst, label: 'Kids First'},
			{data: kidssalvation, label: 'Kids Salvation'},
		];

		if(this.attendLine != null){
			this.attendLine.refreshLabel(labels);
			this.attendLine.refreshData(dataSet);
		}

		//done
	}

	public getData() : void{
		if(!this.isloading){
			this.isloading = true;
			const nowtime: Date = new Date();
			this.selected.year = this.year ? this.year : nowtime.getFullYear();
			this.http.sendGetRequest2('dashboard/campusserviceattendance', this.selected).subscribe((response: any) => {
				if(response.api_status){

					if(this.selected.year == null)
						this.selected.year = response.data.year; // update data year kalo sebelomnya null
					this.dataActiveSunAttend = {
						'data': response.data.users_active_month,
						'type': response.data.users_active_type
					}; // simpen dulu ke sini, baru di refresh

					this.weeksofyear = response.data.data_peryear;
					this.refreshAttend();



					// INIT DATA
					this.setSliderValueByAttend(this.dataActiveSunAttend);
					// refresh ATTENDANCE
					/*if(this.attendLine != null)
						this.attendLine.refreshData(this.dataActiveSunAttend['data'], this.dataActiveSunAttend['type']);*/
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

	public getCampusservice(whendone:Function|null=null) : void {
		this.http.sendGetRequest2('campusservice/all').subscribe((response:any) => {
			if(response.api_status){
				const campusservices = response.data.campusservices;

				this.campusservices = [];
				campusservices.forEach(($ii) => {
					const temp = {
						'id': $ii.id,
						'name': $ii.campus.name + " " + $ii.servicetime.substring(0, 5),
					};
					this.campusservices.push(temp);
				});

				if(whendone != null){
					whendone();
				}

			}else{
				swal.fire({
					title: 'Error',
					text: response.message,
					icon: 'warning',
					confirmButtonText: 'OK',
				});
			}
		}, (error: any) => {
			swal.fire({
				title: 'Error ' + error.status,
				html: this.helper.changeEOLToBr(error.error.message),
				icon: 'warning',
				confirmButtonText: 'OK',
			});
		});
	}

}
