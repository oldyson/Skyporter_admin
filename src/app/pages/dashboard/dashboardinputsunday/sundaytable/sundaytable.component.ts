import { Component, OnInit, Input } from '@angular/core';
import { HttpService } from './../../../../http.service';
import {
	faCheck as fasCheck,
	faSave as fasSave,
	faSpinner as fasSpinner,
} from '@fortawesome/pro-solid-svg-icons';

@Component({
	selector: 'dashboardinputsunday-sundaytable',
	templateUrl: './sundaytable.component.html',
	styleUrls: ['./sundaytable.component.scss']
})
export class SundaytableComponent implements OnInit {

	@Input() campusservices: any;
	public fasCheck = fasCheck;
	public fasSave = fasSave;
	public fasSpinner = fasSpinner;

	public dayofweek = [
		'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
	];

	constructor(
		private http: HttpService,
	) { 
	}

	ngOnInit(): void {
	}

	public change(campusservice){
		campusservice.changed = true;
	}

	public saveOneRow(campusservice){
		if(campusservice.changed && campusservice.loading == false){
			campusservice.loading = true;
			this.http.sendPostRequest2('dashboard/service-attendance/save-single', campusservice.campusserviceattendance).subscribe((response: any) => {
				campusservice.changed = false;
				campusservice.loading = false;
			}, (error: any) => {
				campusservice.loading = false;
			});
		}
	}

	public saveAllRow(){
		this.campusservices.forEach(($ii) => {
			this.saveOneRow($ii);
		});
	}

}
