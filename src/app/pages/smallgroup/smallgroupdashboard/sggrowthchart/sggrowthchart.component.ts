import { Component, OnInit, ViewChildren, EventEmitter, Input, QueryList } from '@angular/core';
import { ChartDataSets } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { Options } from '@angular-slider/ngx-slider';
import { LinechartComponent } from './../../../../components/chart/linechart/linechart.component';
import { HttpService } from './../../../../http.service';
import { GlobalService } from './../../../../global.service';
import { HelperService } from './../../../../helper.service';
import swal from 'sweetalert2';

@Component({
	selector: 'smallgroupdashboard-sggrowthchart',
	templateUrl: './sggrowthchart.component.html',
	styleUrls: ['./sggrowthchart.component.scss']
})
export class SggrowthchartComponent implements OnInit {
	public description: string;
	public isLoading: boolean;
	public smallgroupreportbymembers: any;
	public columns: any;
	public dates: any;
	public years: any;
	public months: any;
	public selectedYear: string;
	@ViewChildren(LinechartComponent) private linecharts: QueryList<LinechartComponent>;
	public options: any;
	public max: any;
	public min: any;
	public maskSgNameByChurch: string;
	public isFirstLoad: boolean;
	public differences: any;
	public types: any;
	public selectedType: any;

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
		this.dates = {
			count: [],
			increment: []
		};
		this.columns = [
			{
				name: 'smallgrouprequestscount',
				label: this.maskSgNameByChurch + ' Requests',
			},
			{
				name: 'probationscount',
				label: 'Probations',
			},
			{
				name: 'smallgroupmemberscount',
				label: this.maskSgNameByChurch + ' Members',
			},
			{
				name: 'coreteamscount',
				label: 'Core Teams',
			},
			{
				name: 'leaderscount',
				label: this.maskSgNameByChurch + ' Leaders',
			},
			{
				name: 'smallgroupscount',
				label: this.maskSgNameByChurch,
			},
		];

		this.years = [];
		this.differences = [];
		this.min = [];
		this.max = [];
		this.options = [];
		this.smallgroupreportbymembers = null;
		this.isLoading = false;
		this.isFirstLoad = true;
		this.selectedType = [];
		this.types = [
			{
				id: 0,
				name: 'Total',
				label: 'TOTAL',
				value: 'count',
			},
			{
				id: 1,
				name: 'Increment',
				label: 'INCREMENT',
				value: 'increment',
			},
		];
		let self = this;
		this.columns.forEach(($ii) => {
			self.selectedType[$ii.name] = self.types[0].value;
		});
	}

	ngOnInit(): void {
		if(this.years.length == 0)
			this.getYears();
	}

	public getYears(): void{
		this.http.sendGetRequest2('smallgroup/get-report-years').subscribe((response: any) => {
			if(response.api_status){
				this.years = response.data.years;
				this.selectedYear = this.years[this.years.length-1];
				this.getData();
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

	public getData() : void{
		let self = this;
		const params = {
			year: this.selectedYear,
			sortDir: 'ASC',
		};
		this.http.sendGetRequest2('smallgroup/get-report-withmembercondition', params).subscribe((response: any) => {
			if(response.api_status){
				if(response.data.smallgroupreportbymembers.length < 3){
					swal.fire({
						title: 'Error',
						text: 'Cannot generate charts because there is not enough data',
						icon: 'warning',
						confirmButtonText: 'OK'
					});
				}else{
					self.smallgroupreportbymembers = response.data.smallgroupreportbymembers;
					this.types.forEach(($ii) => {
						self.dates[$ii.value] = [];
					});

					self.smallgroupreportbymembers.forEach(($ii, idx) => {
						const dt2 = new Date($ii.generateddate.replace(/\second/, 'T'));
						const date = dt2.getDate();
						const month = dt2.getMonth();
						$ii.generateddate = date + ' ' + this.months[month];
						this.dates['count'].push($ii.generateddate);
						if(idx != 0)
							this.dates['increment'].push($ii.generateddate);
					});
					self.differences = [];
					let temp = null;
					for (let i = 1; i < self.smallgroupreportbymembers.length; i++) {
						let temp = {};
						self.columns.forEach(($ii) => {
							temp[$ii.name] = self.smallgroupreportbymembers[i][$ii.name] - self.smallgroupreportbymembers[i-1][$ii.name];
						});
						self.differences.push(temp);
					}
					this.description = response.data.description;
					this.initChart(null, this.isFirstLoad);
					if(this.isFirstLoad){
						this.isFirstLoad = !this.isFirstLoad;
					}
					
				}
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

	public refreshData(minMax: any | null = null, column: any = null) : void{
		let self = this;
		if(column == null){
			this.columns.forEach(($ii) => {
				if(minMax != null){
					this.max[$ii.name] = minMax.max;
					this.min[$ii.name] = minMax.min;
				}
				// refresh MONTH
				let linechart = this.linecharts.find((chart) => {
					return chart['identifier'] == $ii.name;
				})
				if(linechart != null){
					// kalo labels nya di set otomatis dari xVal
					var labels = []; // x
					let temp = [];
					let y1 = []; // total value each month
					if(this.selectedType[$ii.name] == 'increment'){
						this.differences.forEach((rawData, index) => {
							if(index <= this.max[$ii.name]
								&& index >= this.min[$ii.name]){
								y1.push(rawData[$ii.name]);
								labels.push(self.dates[self.selectedType[$ii.name]][index]);
							}
						});
					}else{
						this.smallgroupreportbymembers.forEach((rawData, index) => {
							if(index <= this.max[$ii.name]
								&& index >= this.min[$ii.name]){
								y1.push(rawData[$ii.name]);
								labels.push(self.dates[self.selectedType[$ii.name]][index]);
							}
						});
					}
					if(this.selectedType[$ii.name] == 'increment'){
						temp.push(
							{ data: y1, label: "No. of new " + $ii.label }
						);
					}else {
						temp.push(
							{ data: y1, label: "Total no. of " + $ii.label }
						);
					}
					
					linechart.refreshData(temp);
					linechart.refreshLabel(labels);
					
				}
			});
		}else{
			if(minMax != null){
				this.max[column.name] = minMax.max;
				this.min[column.name] = minMax.min;
			}
			// refresh MONTH
			let linechart = this.linecharts.find((chart) => {
				return chart['identifier'] == column.name;
			})
			if(linechart != null){
				// kalo labels nya di set otomatis dari xVal
				var labels = []; // x
				let temp = [];
				let y1 = []; // total value each month
				if(this.selectedType[column.name] == 'increment'){
					this.differences.forEach((rawData, index) => {
						if(index <= this.max[column.name]
							&& index >= this.min[column.name]){
							y1.push(rawData[column.name]);
							labels.push(self.dates[self.selectedType[column.name]][index]);
						}
					});
				}else{
					this.smallgroupreportbymembers.forEach((rawData, index) => {
						if(index <= this.max[column.name]
							&& index >= this.min[column.name]){
							y1.push(rawData[column.name]);
							labels.push(self.dates[self.selectedType[column.name]][index]);
						}
					});
				}
				if(this.selectedType[column.name] == 'increment'){
					temp.push(
						{ data: y1, label: "No. of new " + column.label }
					);
				}else {
					temp.push(
						{ data: y1, label: "Total no. of " + column.label }
					);
				}
				
				linechart.refreshData(temp);
				linechart.refreshLabel(labels);
				
			}
		}
	}

	public sumDiffs(min, max, column){
		let sum = 0;
		for(let i = min+1; i<=max; i++){
			sum += this.differences[i][column];
		}
		return sum;
	}	


	public initChart(column: any = null, isFirstLoad = false){
		let self = this;
		if(column == null){
			this.columns.forEach(($ii) => {
				self.options[$ii.name] = {
					floor: 0,
					ceil: this.selectedType[$ii.name] == 'increment' ? this.differences.length-1 : this.smallgroupreportbymembers.length-1,
					translate: (value: number): string => {
						return self.dates[self.selectedType[$ii.name]][value]; 
					},
					animate: true,
					getPointerColor: ()=>{return '#9e9e9e'},
					getSelectionBarColor: () => {return '#ccc'},
				}
				this.max[$ii.name] = this.options[$ii.name].ceil;
				this.min[$ii.name] = this.options[$ii.name].floor;
				if(isFirstLoad)
					this.refreshData(null, $ii);
			});
		}else{
			this.options[column.name] = {
				floor: 0,
				ceil: this.selectedType[column.name] == 'increment' ? this.differences.length-1 : this.smallgroupreportbymembers.length-1,
				translate: (value: number): string => {
					return self.dates[self.selectedType[column.name]][value]; 
				},
				animate: true,
				getPointerColor: ()=>{return '#9e9e9e'},
				getSelectionBarColor: () => {return '#ccc'},
			}
			this.max[column.name] = this.options[column.name].ceil;
			this.min[column.name] = this.options[column.name].floor;
			if(isFirstLoad)
				this.refreshData(null, column);
		}
	}
}
