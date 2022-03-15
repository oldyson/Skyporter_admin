import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { ChartDataSets } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { Options } from '@angular-slider/ngx-slider';

@Component({
	selector: 'comp-linechart',
	templateUrl: './linechart.component.html',
	styleUrls: ['./linechart.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class LinechartComponent implements OnInit {

	public dataSet: ChartDataSets[];
	/* lineChartData: ChartDataSets[] = [
		{ data: [85, 72, 78, 75, 77, 75], label: 'Crude oil prices' },
	]; */
	@Input() title: string;
	public type: string;
	@Input() dataRaw: [];
	public labels: Label[];
	@Input() minX: number;
	@Input() maxX: number;
	@Input() options: Options;
	@Input() identifier: string;
	@Output() rangeChange: any = new EventEmitter<{min: number, max: number}>();

	public lineChartOptions = {
		responsive: true,
		maintainAspectRatio: false,
	};
	public lineChartColors: Color[] = [
		{
			borderColor: '#59a',
			backgroundColor: 'rgba(0,0,0,0.05)',
		}
	];
	public lineChartLegend = true;
	public lineChartPlugins = [];
	public lineChartType = 'line';

	constructor() { 
		this.type = 'unknown';
	}

	ngOnInit(): void {
	}

	public refreshLabel(labels: Label[] | null = []){
		this.labels = labels || [];
	}

	public refreshXAxis(){
		setTimeout(()=>{
			this.rangeChange.emit({ min: this.minX, max: this.maxX });
		}, 10);
	}

	public refreshData(dataSet: any | null = null): void{
		// to show data
		// console.log(dataSet)
		if(dataSet == null)
			return;

		setTimeout(()=>{ // kalo ga di timeout nanti pindah value, setelah refresh
			this.dataSet = dataSet;
		}, 10);
	}

}
