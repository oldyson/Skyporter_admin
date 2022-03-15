import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { ChartOptions } from 'chart.js';
import { Color, Label, BaseChartDirective } from 'ng2-charts';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';

@Component({
	selector: 'comp-piechart',
	templateUrl: './piechart.component.html',
	styleUrls: ['./piechart.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class PiechartComponent implements OnInit {
	@ViewChild(BaseChartDirective) piechart: BaseChartDirective;
	@ViewChild('wrapper') wrapper: ElementRef;
	@Input() title: string;
	@Input() dataRaw: [];
	@Input() labels: Label[];
	@Input() datasets: any[];
	public legendData: any;
	private getLegendCallback = (function(self) {
		function handle(chart) {
			return chart.legend.legendItems; 
		}
		return function(chart) {
			return handle(chart);
		}
	})(this);
	public pieChartOptions = {
		responsive: true,
		maintainAspectRatio: false,
		legend: {
			display: false,
		},
		plugins: {
			datalabels: {
				formatter: (value, ctx) => {
					const label = ctx.chart.data.labels[ctx.dataIndex];
					return label;
				},
				display: 'auto'
			},
		},
		tooltips: {
			callbacks: {
				label: function (tooltipItem, data) {
					try {
						let label = ' ' + data.labels[tooltipItem.index] || '';

						if (label) {
							label += ': ';
						}

						const sum = data.datasets[0].data.reduce((accumulator, curValue) => {
							return accumulator + curValue;
						});
						const value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];

						label += value + ' (' + Number((value / sum) * 100).toFixed(2) + '%)';
						return label;
					} catch (error) {
						console.log(error);
					}
				}
			}
		},
		legendCallback: this.getLegendCallback,
	};
	public pieChartLegend = true;
	public pieChartPlugins = [pluginDataLabels];
	public pieChartType = 'pie';

	

	constructor() { 
		this.legendData = [];
	}

	ngOnInit(): void {

	}

	ngAfterViewInit(): void {
		this.legendData.push(...this.piechart.chart.generateLegend() as any);
	}

	public toggleDataVisibility(dataSetId, legendItem): void {
		console.log(legendItem);
		let chartItem = this.piechart.chart.getDatasetMeta(0).data[dataSetId];
		chartItem.hidden = !chartItem.hidden;
		this.legendData[dataSetId].hidden = !this.legendData[dataSetId].hidden;
		this.piechart.update();
	};
}
