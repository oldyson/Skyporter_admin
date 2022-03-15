import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { ChartDataSets } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { Options } from '@angular-slider/ngx-slider';

@Component({
	selector: 'comp-barchart',
	templateUrl: './barchart.component.html',
	styleUrls: ['./barchart.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class BarchartComponent implements OnInit {

	public dataSet: ChartDataSets[];
	/* barChartData: ChartDataSets[] = [
		{ data: [85, 72, 78, 75, 77, 75], label: 'Crude oil prices' },
	]; */
	@Input() title: string;
	public type: string;
	@Input() dataRaw: [];
	public labels: Label[];
	@Input() minX: number;
	@Input() maxX: number;
	@Input() options: Options;
	@Output() rangeChange: any = new EventEmitter<{min: number, max: number}>();

	public barChartOptions = {
		responsive: true,
		maintainAspectRatio: false,
		scales: {
			xAxes: [{ stacked: true }],
			yAxes: [{ stacked: true }]
		}
	};
	public barChartColors: Color[] = [
		{
			borderColor: '#59a',
			backgroundColor: 'rgba(0,0,0,0.05)',
		}
	];
	public barChartLegend = true;
	public barChartPlugins = [];
	public barChartType = 'bar';

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
