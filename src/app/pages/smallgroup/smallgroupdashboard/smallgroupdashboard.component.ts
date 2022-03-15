import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-smallgroupdashboard',
	templateUrl: './smallgroupdashboard.component.html',
	styleUrls: ['./smallgroupdashboard.component.scss']
})
export class SmallgroupdashboardComponent implements OnInit {


	public ishide: boolean = false;
	public tabs: any;
	public activeTab1: string;

	constructor() { 
		this.tabs = [
			{
				'label' : 'Oddity Groups Count',
				'value' : 'anomalycount',
			},
			{
				'label' : 'Growth Chart',
				'value' : 'growthchart',
			},
			{
				'label' : 'Pending Request >5d',
				'value' : 'anomalyrequestlist',
			},
			{
				'label' : 'Current Demographics',
				'value' : 'demographicchart',
			},
			{
				'label' : 'Discipleship Journey',
				'value' : 'discipleshipjourney',
			},
		];

		this.activeTab1 = this.tabs[0].value;
	}

	ngOnInit(): void {
	}

	public setActiveTab1(index:number): void{
		this.activeTab1 = this.tabs[index]?.value;
	}

}
