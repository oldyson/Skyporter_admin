import { Component, OnInit, ViewChild, EventEmitter, Input } from '@angular/core';
import { ChartDataSets } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { Options } from '@angular-slider/ngx-slider';
import { LinechartComponent } from './../../../../components/chart/linechart/linechart.component';
import { HttpService } from './../../../../http.service';
import { GlobalService } from './../../../../global.service';
import { HelperService } from './../../../../helper.service';
import swal from 'sweetalert2';

@Component({
	selector: 'smallgroupdashboard-sgdemographic',
	templateUrl: './sgdemographic.component.html',
	styleUrls: ['./sgdemographic.component.scss']
})
export class SgdemographicComponent implements OnInit {

	public description: string;
	public isLoading: boolean;
	public datas: any;
	public dates: any;
	public years: any;
	public months: any;
	public maskSgNameByChurch: string;

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
		this.datas = null;
		this.isLoading = false;
	}

	ngOnInit(): void {
		this.getData();
	}


	public getData() : void{
		let self = this;
		const params = {
		};
		this.http.sendGetRequest2('smallgroup/get-demographics', params).subscribe((response: any) => {
			if(response.api_status){
				if(response.data.description != null)
					self.description = response.data.description;
				self.datas = [];
				response.data.datasets.forEach(($ii)=>{
					let temp = {
						title: $ii.title,
						dataset: [],
						labels: []
					};
					$ii.dataset.forEach(($jj)=>{
						temp.labels.push($jj.label);
						temp.dataset.push($jj.total);
					});
					self.datas.push(temp);
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

	public refreshData() : void{
		this.getData();
	}
}
